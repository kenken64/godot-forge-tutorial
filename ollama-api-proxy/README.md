# Ollama client → Codex CLI proxy

This service makes an Ollama-compatible client talk to the Codex CLI:

```text
Ollama client  →  this proxy  →  codex exec  →  gpt-5.6-luna
```

It does not run Ollama and does not call the Ollama model server. The proxy invokes the locally installed `codex` executable and forces the backend model to `gpt-5.6-luna` by default.

Codex’s official non-interactive interface is `codex exec`; JSONL output is intended for scripts and automation. ([Official Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode))

## Start

Make sure Codex CLI is installed and authenticated, then run:

```sh
cd ollama-api-proxy
npm start
```

The proxy listens on `http://127.0.0.1:8788`.
Check `http://127.0.0.1:8788/health` before using Character Creation's **Build character + sprite** action. `npm test` verifies that a failed Codex request returns an error without stopping the proxy.

Configuration is in [.env.example](.env.example):

- `CODEX_MODEL` defaults to `gpt-5.6-luna`.
- `CODEX_SANDBOX` defaults to `read-only`.
- `CODEX_CWD` controls the directory Codex can inspect.
- `PROXY_API_KEY` optionally protects the proxy with bearer authentication.

## Use from an Ollama-compatible client

Point the client’s Ollama base URL at `http://127.0.0.1:8788` instead of an Ollama server. For a direct protocol check:

```sh
curl http://127.0.0.1:8788/api/chat \
  -H 'content-type: application/json' \
  -d '{"model":"gpt-5.6-luna","messages":[{"role":"user","content":"Say hello"}],"stream":false}'
```

The exact environment variable or base-URL setting depends on the client. The proxy implements these Ollama-style routes:

- `GET /api/tags`
- `POST /api/chat`
- `POST /api/generate`

Both streaming NDJSON and non-streaming responses are supported. The requested client model name is accepted for compatibility, but the proxy backend remains `CODEX_MODEL`.

## Safety

Each request starts a new ephemeral `codex exec --json` process. The default `read-only` sandbox prevents model-generated file changes. Use a separate controlled working directory through `CODEX_CWD` if the client will send untrusted prompts.

The proxy does not expose Codex credentials in its responses. Keep it bound to `127.0.0.1` unless you add authentication and a network boundary deliberately.
