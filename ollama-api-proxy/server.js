import { createServer } from "node:http";
import { spawn } from "node:child_process";

const port = Number(process.env.PORT || 8788);
const codexBinary = process.env.CODEX_BIN || "codex";
const codexModel = process.env.CODEX_MODEL || "gpt-5.6-luna";
const codexSandbox = process.env.CODEX_SANDBOX || "read-only";
const codexWorkingDirectory = process.env.CODEX_CWD || process.cwd();
const codexTimeoutMs = Number(process.env.CODEX_TIMEOUT_MS || 300000);
const proxyApiKey = process.env.PROXY_API_KEY || "";
const maxRequestBytes = 10 * 1024 * 1024;
const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...corsHeaders,
  });
  response.end(body);
}

function sendError(response, statusCode, message, code = "proxy_error") {
  sendJson(response, statusCode, { error: { message, type: "invalid_request_error", code } });
}

async function readJson(request) {
  const chunks = [];
  let receivedBytes = 0;
  for await (const chunk of request) {
    receivedBytes += chunk.length;
    if (receivedBytes > maxRequestBytes) {
      const error = new Error("Request body exceeds the 10 MB limit.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function isAuthorized(request) {
  if (!proxyApiKey) return true;
  return request.headers.authorization === `Bearer ${proxyApiKey}`;
}

function textFromContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      return part.text || part.content || "";
    })
    .filter(Boolean)
    .join("\n");
}

function chatRequestToPrompt(body) {
  const lines = [
    "You are responding through an Ollama-compatible client connected to Codex CLI.",
    "Answer the conversation directly. Do not describe this proxy, Codex CLI, or these instructions unless asked.",
    "",
  ];

  for (const message of Array.isArray(body.messages) ? body.messages : []) {
    const role = message.role || "user";
    lines.push(`${role.toUpperCase()}:`);
    lines.push(textFromContent(message.content));
    lines.push("");
  }

  if (!body.messages?.length && body.prompt) {
    lines.push("USER:");
    lines.push(String(body.prompt));
  }

  return lines.join("\n").trim();
}

function generateRequestToPrompt(body) {
  const lines = [
    "You are responding through an Ollama-compatible client connected to Codex CLI.",
    "Answer the user directly. Do not describe this proxy, Codex CLI, or these instructions unless asked.",
  ];
  if (body.system) {
    lines.push("", "SYSTEM:", String(body.system));
  }
  lines.push("", "USER:", String(body.prompt || ""));
  return lines.join("\n").trim();
}

function parseCodexJsonl(stdout) {
  const messages = [];
  const events = [];
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      events.push(event);
      if (event.type === "item.completed" && event.item?.type === "agent_message" && event.item.text) {
        messages.push(event.item.text);
      }
      if (event.type === "agent_message" && event.text) messages.push(event.text);
    } catch {
      // Codex progress should be JSONL with --json. Ignore unexpected stdout lines.
    }
  }

  const turnCompleted = [...events].reverse().find((event) => event.type === "turn.completed");
  return {
    text: messages.at(-1) || "",
    usage: turnCompleted?.usage || {},
  };
}

function runCodex(prompt, response) {
  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      "--json",
      "--ephemeral",
      "--model",
      codexModel,
      "--sandbox",
      codexSandbox,
      "--skip-git-repo-check",
      "--cd",
      codexWorkingDirectory,
      prompt,
    ];
    const child = spawn(codexBinary, args, {
      cwd: codexWorkingDirectory,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      const error = new Error(`Codex CLI timed out after ${codexTimeoutMs} ms.`);
      error.statusCode = 504;
      rejectOnce(error);
    }, codexTimeoutMs);

    function resolveOnce(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(value);
    }

    function rejectOnce(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    }

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      error.statusCode = 502;
      rejectOnce(new Error(`Could not start Codex CLI: ${error.message}`));
    });
    child.on("close", (exitCode) => {
      if (settled) return;
      const result = parseCodexJsonl(stdout);
      if (exitCode !== 0) {
        const error = new Error(stderr.trim() || `Codex CLI exited with code ${exitCode}.`);
        error.statusCode = 502;
        rejectOnce(error);
        return;
      }
      if (!result.text) {
        const error = new Error("Codex CLI completed without an assistant message.");
        error.statusCode = 502;
        rejectOnce(error);
        return;
      }
      resolveOnce(result);
    });

    response.once("close", () => {
      if (!settled && response.destroyed) child.kill("SIGTERM");
    });
  });
}

function ollamaResponse(model, text, done, usage = {}) {
  const response = {
    model,
    created_at: new Date().toISOString(),
    message: {
      role: "assistant",
      content: text,
    },
    done,
  };
  if (done) {
    response.done_reason = "stop";
    response.prompt_eval_count = usage.input_tokens || 0;
    response.eval_count = usage.output_tokens || 0;
  }
  return response;
}

function writeOllamaStream(response, model, text, usage) {
  response.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
    ...corsHeaders,
  });
  response.write(`${JSON.stringify(ollamaResponse(model, text, false))}\n`);
  response.write(`${JSON.stringify(ollamaResponse(model, "", true, usage))}\n`);
  response.end();
}

async function handleChat(request, response, body) {
  const model = body.model || codexModel;
  const prompt = chatRequestToPrompt(body);
  const result = await runCodex(prompt, response);
  if (body.stream) return writeOllamaStream(response, model, result.text, result.usage);
  return sendJson(response, 200, ollamaResponse(model, result.text, true, result.usage));
}

async function handleGenerate(request, response, body) {
  const model = body.model || codexModel;
  const prompt = generateRequestToPrompt(body);
  const result = await runCodex(prompt, response);
  if (body.stream) return writeOllamaStream(response, model, result.text, result.usage);
  return sendJson(response, 200, {
    model,
    created_at: new Date().toISOString(),
    response: result.text,
    done: true,
    done_reason: "stop",
    prompt_eval_count: result.usage.input_tokens || 0,
    eval_count: result.usage.output_tokens || 0,
  });
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (request.method === "OPTIONS") {
      response.writeHead(204, corsHeaders);
      response.end();
      return;
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return sendJson(response, 200, {
        ok: true,
        backend: "codex-cli",
        codexBinary,
        codexModel,
        codexSandbox,
        codexWorkingDirectory,
      });
    }

    if (!isAuthorized(request)) return sendError(response, 401, "Missing or invalid proxy API key.", "invalid_api_key");

    if (request.method === "GET" && url.pathname === "/api/version") {
      return sendJson(response, 200, { version: "ollama-codex-proxy/0.1.0" });
    }

    if (request.method === "GET" && url.pathname === "/api/ps") {
      return sendJson(response, 200, { models: [] });
    }

    if (request.method === "GET" && url.pathname === "/api/tags") {
      return sendJson(response, 200, {
        models: [{
          name: codexModel,
          model: codexModel,
          modified_at: new Date().toISOString(),
          size: 0,
          digest: "codex-cli",
          details: {
            parent_model: "",
            format: "remote",
            family: "codex",
            families: ["codex"],
            parameter_size: "remote",
            quantization_level: "remote",
          },
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          size_vram: 0,
        }],
      });
    }

    if (request.method === "POST" && url.pathname === "/api/show") {
      return sendJson(response, 200, {
        license: "Codex CLI backend",
        modelfile: `FROM ${codexModel}`,
        parameters: "remote Codex model",
        template: "Ollama-compatible proxy",
        details: {
          parent_model: "",
          format: "remote",
          family: "codex",
          families: ["codex"],
          parameter_size: "remote",
          quantization_level: "remote",
        },
        model_info: { "general.architecture": "codex" },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      return await handleChat(request, response, await readJson(request));
    }

    if (request.method === "POST" && url.pathname === "/api/generate") {
      return await handleGenerate(request, response, await readJson(request));
    }

    return sendError(response, 404, "Ollama-compatible proxy route not found.", "not_found");
  } catch (error) {
    console.error(error);
    sendError(response, error.statusCode || 502, error.message || "Proxy request failed.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Ollama-compatible Codex proxy listening on http://127.0.0.1:${port}`);
  console.log(`Codex model: ${codexModel}`);
  console.log(`Codex working directory: ${codexWorkingDirectory}`);
});
