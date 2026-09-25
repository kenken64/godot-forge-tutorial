const moduleSlug = "game-assets-creation";
const learnerId = (() => {
  const key = "godot-forge-learner-id";
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID().replace(/-/g, ""); localStorage.setItem(key, value); }
  return value;
})();
const steps = [
  { field: "theme", prompt: "What kind of world is this asset pack for?", choices: ["Forest adventure", "Sci-fi station", "Cozy dungeon", "Sky islands"] },
  { field: "style", prompt: "What visual style should hold every asset together?", choices: ["Clean pixel art", "Hand-painted storybook", "Bold arcade", "Soft low-poly 2D"] },
  { field: "palette", prompt: "Which colours should define the world?", choices: ["Moss green + gold", "Indigo + neon cyan", "Terracotta + cream", "Purple dusk + silver"] },
  { field: "scale", prompt: "What is the intended tile and object scale?", choices: ["16 px compact", "32 px classic", "48 px detailed", "64 px large"] },
  { field: "gameplay", prompt: "What should the player do most often in this world?", choices: ["Explore", "Platform", "Fight", "Collect and craft"] },
  { field: "signature", prompt: "What one visual detail should make this world memorable?", choices: ["Glowing plants", "Clockwork machinery", "Ancient runes", "Friendly ghosts"] },
];

const templates = {
  forest: { prompt: "A bright forest adventure where small explorers restore a sleeping grove.", answers: { theme: "Forest adventure", style: "Clean pixel art", palette: "Moss green + gold", scale: "32 px classic", gameplay: "Explore", signature: "Glowing plants" }, direction: { packName: "Grove Light", palette: ["#244d32", "#a7d95b", "#e5b96d", "#f5f0cf"], artDirection: "Clear woodland pixel art with mossy edges, warm light, and readable silhouettes." } },
  station: { prompt: "A deserted orbital station where a repair crew restarts its gardens and machines.", answers: { theme: "Sci-fi station", style: "Bold arcade", palette: "Indigo + neon cyan", scale: "32 px classic", gameplay: "Fight", signature: "Clockwork machinery" }, direction: { packName: "Orbit Garden", palette: ["#12163e", "#4359a5", "#32d5e4", "#f8b75c"], artDirection: "Crisp side-view arcade assets with angular machinery, cyan energy, and strong indigo shadows." } },
  cozy: { prompt: "A warm underground dungeon where helpful ghosts guide visitors through candlelit rooms.", answers: { theme: "Cozy dungeon", style: "Hand-painted storybook", palette: "Terracotta + cream", scale: "48 px detailed", gameplay: "Collect and craft", signature: "Friendly ghosts" }, direction: { packName: "Hearth Hollow", palette: ["#6b3e39", "#bb7455", "#f1d6a7", "#8ba79b"], artDirection: "Warm storybook side-view assets with soft terracotta stone, candlelight, and gentle ghost shapes." } },
};

const creativePrompt = document.querySelector("#creative-prompt");
const templateSelect = document.querySelector("#asset-template");
const loadTemplateButton = document.querySelector("#load-template");
const chatLog = document.querySelector("#chat-log");
const choiceList = document.querySelector("#choice-list");
const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer-input");
const stepCount = document.querySelector("#step-count");
const directionStatus = document.querySelector("#direction-status");
const directionEmpty = document.querySelector("#direction-empty");
const assetDirectionElement = document.querySelector("#asset-direction");
const generatedPrompt = document.querySelector("#generated-prompt");
const buildDirectionButton = document.querySelector("#build-direction");
const productionWorkspace = document.querySelector("#production-workspace");
const categoryList = document.querySelector("#category-list");
const generateAssetButton = document.querySelector("#generate-asset");
const generationStatus = document.querySelector("#generation-status");
const assetPreview = document.querySelector("#asset-preview");
const assetPlaceholder = document.querySelector("#asset-placeholder");
const downloadAsset = document.querySelector("#download-asset");
const saveToFinalGameButton = document.querySelector("#save-to-final-game");
const manifestDownload = document.createElement('a');
manifestDownload.className = 'small-action';
manifestDownload.textContent = 'DOWNLOAD COORDINATES JSON';
manifestDownload.hidden = true;
saveToFinalGameButton.after(manifestDownload);
const assetLibrary = document.querySelector("#asset-library");
const libraryCount = document.querySelector("#library-count");
const completeModuleButton = document.querySelector("#complete-module");
const generationReadiness = document.querySelector("#generation-readiness");

const answers = {};
let currentStep = 0;
let direction = null;
let selectedCategory = "tileset";
let busy = false;
let generatedAssets = {};
let imageGenerationAvailable = null;
let checkpointReady = false;
let replacementConfirmTimer = null;

async function checkGenerationReadiness() {
  const response = await fetch("/api/health").catch(() => null);
  const health = response?.ok ? await response.json().catch(() => ({})) : {};
  imageGenerationAvailable = health.imageGenerationConfigured === true;
  if (imageGenerationAvailable) {
    generationReadiness.textContent = `GPT Image ready (${health.imageModel || "configured model"}). Build a direction, then generate one category at a time.`;
    generationReadiness.dataset.status = "ready";
  } else {
    generationReadiness.textContent = "GPT Image is unavailable. Add OPENAI_API_KEY to tutorial-web-app/.env, then restart the tutorial server.";
    generationReadiness.dataset.status = "warning";
  }
}

async function saveCheckpoint() {
  if (!checkpointReady) return;
  const state = { creativePrompt: creativePrompt.value, answers, currentStep, direction, selectedCategory, generatedAssets };
  await fetch(`/api/modules/${moduleSlug}/checkpoint`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, state }) }).catch(() => {});
}

function showAsset(asset) {
  if (!asset?.assetUrl) {
    assetPreview.hidden = true;
    assetPlaceholder.hidden = false;
    downloadAsset.hidden = true;
    saveToFinalGameButton.hidden = true;
    manifestDownload.hidden = true;
    return;
  }
  assetPreview.src = asset.assetUrl;
  assetPreview.hidden = false;
  assetPlaceholder.hidden = true;
  downloadAsset.href = asset.assetUrl;
  downloadAsset.download = asset.originalName || `${selectedCategory}-sheet.png`;
  downloadAsset.hidden = false;
  saveToFinalGameButton.hidden = false;
  saveToFinalGameButton.textContent = asset.finalGameAsset ? 'SAVED TO FINAL GAME' : 'SAVE TO FINAL GAME';
  saveToFinalGameButton.disabled = Boolean(asset.finalGameAsset);
  const metadata = asset.finalGameAsset?.metadataAsset;
  manifestDownload.hidden = !metadata?.assetUrl;
  if (metadata?.assetUrl) { manifestDownload.href = metadata.assetUrl; manifestDownload.download = metadata.originalName; }
}

async function restoreCheckpoint() {
  const response = await fetch(`/api/modules/${moduleSlug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`).catch(() => null);
  const checkpoint = response?.ok ? await response.json() : null;
  const state = checkpoint?.state;
  if (!state || typeof state !== "object") return;
  creativePrompt.value = String(state.creativePrompt || "");
  Object.assign(answers, state.answers && typeof state.answers === "object" ? state.answers : {});
  currentStep = Math.min(steps.length, Number(state.currentStep) || Object.keys(answers).length);
  direction = state.direction && typeof state.direction === "object" ? state.direction : null;
  selectedCategory = ["tileset", "props", "pickups", "ui"].includes(state.selectedCategory) ? state.selectedCategory : "tileset";
  generatedAssets = state.generatedAssets && typeof state.generatedAssets === "object" ? state.generatedAssets : {};
  if (direction) { directionStatus.textContent = "RESUMED"; renderDirection(); productionWorkspace.hidden = false; showAsset(generatedAssets[selectedCategory]); generationStatus.textContent = "Resumed your saved direction and generated sheets."; }
  selectCategory(selectedCategory);
  renderGuide();
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = role === "user" ? "YOU" : "GODOT FORGE";
  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = text;
  message.append(label, body);
  chatLog.append(message);
}

function renderGuide() {
  chatLog.replaceChildren();
  addMessage("bot", "Let’s make an asset pack that feels like one world, not a pile of unrelated images.");
  steps.forEach((step, index) => {
    if (answers[step.field]) {
      addMessage("bot", step.prompt);
      addMessage("user", answers[step.field]);
    }
    if (index === currentStep && currentStep < steps.length) addMessage("bot", step.prompt);
  });
  if (currentStep === steps.length) addMessage("bot", "Your visual brief is ready. Build the asset direction, then generate one category at a time.");
  chatLog.scrollTop = chatLog.scrollHeight;
  stepCount.textContent = `${String(Math.min(currentStep + 1, steps.length)).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
  choiceList.replaceChildren();
  if (currentStep < steps.length) {
    steps[currentStep].choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => submitAnswer(choice));
      choiceList.append(button);
    });
  }
  buildDirectionButton.disabled = busy || currentStep !== steps.length;
}

function submitAnswer(value) {
  const answer = value.trim();
  if (!answer || busy || currentStep >= steps.length) return;
  answers[steps[currentStep].field] = answer;
  currentStep += 1;
  answerInput.value = "";
  direction = null;
  generatedAssets = {};
  showAsset(null);
  updateGenerateButton();
  directionStatus.textContent = "WAITING";
  directionEmpty.hidden = false;
  assetDirectionElement.replaceChildren();
  productionWorkspace.hidden = true;
  renderGuide();
  saveCheckpoint();
}

function setBusy(nextBusy, message = "") {
  busy = nextBusy;
  document.querySelectorAll("button, input, select, textarea").forEach((element) => { element.disabled = nextBusy; });
  if (message) generationStatus.textContent = message;
  renderGuide();
}

function parseJson(text) {
  const objectText = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || text.match(/\{[\s\S]*\}/)?.[0];
  if (!objectText) throw new Error("Codex did not return an asset direction. Please try again.");
  try { return JSON.parse(objectText); } catch { throw new Error("Codex returned an invalid asset direction. Please try again."); }
}

function directionPrompt() {
  return `Create a production-ready 2D game asset-pack direction from this student's brief. Return ONLY valid JSON with this exact shape:
{
  "packName": "short memorable pack name",
  "theme": "...",
  "style": "...",
  "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
  "scale": "...",
  "gameplay": "...",
  "signature": "...",
  "artDirection": "a concise direction that keeps every category consistent"
}
Student’s creative idea: ${creativePrompt.value.trim() || "No separate idea provided."}
Guided answers: ${JSON.stringify(answers)}
Keep the direction appropriate for readable 2D game tiles, props, pickups, and UI icons. Use the student’s choices and do not add copyrighted characters or brands.`;
}

function normaliseDirection(raw) {
  const value = raw.assetPack || raw;
  const text = (key, fallback) => String(value[key] || fallback).slice(0, 500);
  return {
    packName: text("packName", `${answers.theme} asset pack`), theme: text("theme", answers.theme), style: text("style", answers.style),
    palette: Array.isArray(value.palette) ? value.palette.slice(0, 6).map(String) : [], scale: text("scale", answers.scale),
    gameplay: text("gameplay", answers.gameplay), signature: text("signature", answers.signature), artDirection: text("artDirection", "Clear, consistent 2D game art with transparent gutters."),
  };
}

function renderDirection() {
  directionEmpty.hidden = true;
  assetDirectionElement.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = direction.packName;
  assetDirectionElement.append(heading);
  [["WORLD", direction.theme], ["STYLE", direction.style], ["SCALE", direction.scale], ["GAMEPLAY", direction.gameplay], ["SIGNATURE", direction.signature], ["DIRECTION", direction.artDirection]].forEach(([label, value]) => {
    const item = document.createElement("div");
    const key = document.createElement("span"); key.textContent = label;
    const text = document.createElement("p"); text.textContent = value;
    item.append(key, text); assetDirectionElement.append(item);
  });
  if (direction.palette.length) {
    const palette = document.createElement("p");
    palette.textContent = `Palette: ${direction.palette.join(" · ")}`;
    assetDirectionElement.append(palette);
  }
  generatedPrompt.textContent = `Draw a transparent, grid-aligned SIDE-VIEW 2D PLATFORMER ${selectedCategory} sheet for “${direction.packName}”: ${direction.artDirection} Theme: ${direction.theme}. Style: ${direction.style}. Palette: ${direction.palette.join(", ") || answers.palette}. Scale: ${direction.scale}. Create 16 distinct, readable assets for left-to-right platforming, with a consistent side-on camera angle and transparent gutters. Never use top-down, isometric, or RPG-map perspective.`;
  updateGenerateButton();
}

function updateGenerateButton() {
  window.clearTimeout(replacementConfirmTimer);
  replacementConfirmTimer = null;
  delete generateAssetButton.dataset.confirming;
  generateAssetButton.textContent = generatedAssets[selectedCategory] ? "GENERATE REPLACEMENT" : "GENERATE ASSET SHEET";
}

async function saveCurrentAssetToFinalGame() {
  const asset = generatedAssets[selectedCategory];
  if (!asset?.assetUrl || busy) return;
  setBusy(true, `Saving ${selectedCategory} to Final Game…`);
  try {
    const response = await fetch("/api/assets/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceModule: moduleSlug, assetUrl: asset.assetUrl, name: `${direction.packName}-${selectedCategory}-sheet.png`, category: selectedCategory }),
    });
    const published = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(published.error || "Could not save this sheet to Final Game.");
    generatedAssets[selectedCategory].finalGameAsset = published;
    await saveCheckpoint();
    manifestDownload.hidden = !published.metadataAsset?.assetUrl;
    if (published.metadataAsset?.assetUrl) { manifestDownload.href = published.metadataAsset.assetUrl; manifestDownload.download = published.metadataAsset.originalName; }
    saveToFinalGameButton.textContent = "SAVED TO FINAL GAME";
    saveToFinalGameButton.disabled = true;
    generationStatus.textContent = `${selectedCategory} sheet and coordinates JSON saved to the Final Game library.`;
  } catch (error) {
    generationStatus.textContent = error.message;
  } finally { setBusy(false); saveToFinalGameButton.disabled = Boolean(generatedAssets[selectedCategory]?.finalGameAsset); }
}

async function buildDirection() {
  if (direction) { renderDirection(); productionWorkspace.hidden = false; generationStatus.textContent = "Using your saved asset direction. Change a guide answer to create a new one."; return; }
  setBusy(true, "Building a consistent asset direction…");
  directionStatus.textContent = "BUILDING";
  try {
    const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model: "gpt-5.6-luna", stream: false, messages: [{ role: "user", content: directionPrompt() }] }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.message?.content) throw new Error(payload.error?.message || payload.error || "Could not reach the configured Codex proxy. Check OLLAMA_PROXY_URL in tutorial-web-app/.env and make sure it is running.");
    direction = normaliseDirection(parseJson(payload.message.content));
    directionStatus.textContent = "READY";
    productionWorkspace.hidden = false;
    renderDirection();
    productionWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
    await saveCheckpoint();
  } catch (error) {
    directionStatus.textContent = "WAITING";
    generationStatus.textContent = error.message;
  } finally { setBusy(false); }
}

function selectCategory(category) {
  selectedCategory = category;
  categoryList.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
  if (direction) renderDirection();
  showAsset(generatedAssets[selectedCategory]);
  updateGenerateButton();
  saveCheckpoint();
}

async function generateAsset() {
  if (!direction || busy) return;
  if (imageGenerationAvailable === false) {
    generationStatus.textContent = "GPT Image is unavailable. Add OPENAI_API_KEY to tutorial-web-app/.env, then restart the tutorial server.";
    return;
  }
  if (generatedAssets[selectedCategory]) {
    if (generateAssetButton.dataset.confirming !== "true") {
      generateAssetButton.dataset.confirming = "true";
      generateAssetButton.textContent = "CLICK AGAIN TO REPLACE";
      showAsset(generatedAssets[selectedCategory]);
      generationStatus.textContent = `Click again to replace the saved ${selectedCategory} sheet with one new GPT Image request.`;
      replacementConfirmTimer = window.setTimeout(updateGenerateButton, 6000);
      return;
    }
    updateGenerateButton();
  }
  setBusy(true, `Generating your ${selectedCategory} sheet… this can take a moment.`);
  try {
    const response = await fetch("/api/assets/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ category: selectedCategory, brief: direction }) });
    const asset = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(asset.error || "Could not generate this asset sheet.");
    generatedAssets[selectedCategory] = asset;
    showAsset(asset);
    updateGenerateButton();
    generationStatus.textContent = `${selectedCategory} sheet saved to your asset library.`;
    await loadLibrary();
    await saveCheckpoint();
  } catch (error) { generationStatus.textContent = error.message; }
  finally { setBusy(false); }
}

async function loadLibrary() {
  const response = await fetch(`/api/assets?module=${moduleSlug}`);
  const assets = response.ok ? await response.json() : [];
  libraryCount.textContent = `${assets.length} ${assets.length === 1 ? "FILE" : "FILES"}`;
  assetLibrary.replaceChildren();
  if (!assets.length) {
    const empty = document.createElement("p"); empty.className = "profile-empty"; empty.textContent = "No generated assets yet."; assetLibrary.append(empty); return;
  }
  assets.forEach((asset) => {
    const link = document.createElement("a"); link.href = asset.assetUrl; link.download = asset.originalName;
    const image = document.createElement("img"); image.src = asset.assetUrl; image.alt = asset.originalName;
    const name = document.createElement("span"); name.textContent = asset.originalName;
    link.append(image, name); assetLibrary.append(link);
  });
}

async function toggleCompletion() {
  const completed = completeModuleButton.dataset.completed !== "true";
  const response = await fetch(`/api/modules/${moduleSlug}/progress`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, completed }) });
  if (!response.ok) return;
  completeModuleButton.dataset.completed = String(completed);
  completeModuleButton.textContent = completed ? "REOPEN MODULE" : "MARK MODULE COMPLETE";
}

answerForm.addEventListener("submit", (event) => { event.preventDefault(); submitAnswer(answerInput.value); });
loadTemplateButton.addEventListener("click", () => {
  const template = templates[templateSelect.value];
  if (!template || busy) return;
  creativePrompt.value = template.prompt;
  Object.keys(answers).forEach((key) => delete answers[key]);
  Object.assign(answers, template.answers);
  currentStep = steps.length;
  generatedAssets = {};
  direction = { ...template.answers, ...template.direction };
  directionStatus.textContent = "READY";
  productionWorkspace.hidden = false;
  renderDirection();
  showAsset(null);
  generationStatus.textContent = "Template ready. Choose a category, then generate its sheet.";
  renderGuide();
  saveCheckpoint();
});
buildDirectionButton.addEventListener("click", buildDirection);
document.querySelector("#copy-prompt").addEventListener("click", async () => { await navigator.clipboard?.writeText(generatedPrompt.textContent); });
categoryList.addEventListener("click", (event) => { const category = event.target.closest("button")?.dataset.category; if (category) selectCategory(category); });
generateAssetButton.addEventListener("click", generateAsset);
saveToFinalGameButton.addEventListener("click", saveCurrentAssetToFinalGame);
completeModuleButton.addEventListener("click", toggleCompletion);
creativePrompt.addEventListener("change", saveCheckpoint);
selectCategory(selectedCategory);
renderGuide();
loadLibrary();
restoreCheckpoint().finally(() => { checkpointReady = true; });
checkGenerationReadiness();
