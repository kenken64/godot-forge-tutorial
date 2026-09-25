const moduleSlug = "boss-creation";
const learnerId = (() => { const key = "godot-forge-learner-id"; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ""); localStorage.setItem(key, value); } return value; })();
const steps = [
  { field: "name", prompt: "What is the boss called?", choices: ["The Storm King", "The Last Matriarch", "The Iron Saint", "The Ash Wyrm"] },
  { field: "archetype", prompt: "What kind of threat is it?", choices: ["Fallen monarch", "Ancient guardian", "Cosmic horror", "War machine"] },
  { field: "arena", prompt: "Where does the battle happen?", choices: ["A lightning-split throne room", "A ruined observatory", "A collapsing forge", "The top of a living tower"] },
  { field: "weapon", prompt: "What weapon, power, or impossible force does it command?", choices: ["A thunder bell", "A sun-forged greatsword", "Void chains", "A storm of molten iron"] },
  { field: "silhouette", prompt: "What makes its silhouette instantly iconic?", choices: ["A broken crown and enormous cloak", "Six radiant wings", "A cathedral-sized hammer", "A halo of orbiting blades"] },
  { field: "phases", prompt: "How should the fight escalate in its final phase?", choices: ["Armour shatters and lightning escapes", "It transforms into a celestial form", "The arena begins to break apart", "Its weapon awakens and changes shape"] },
];
const templates = {
  storm: { prompt: "An exiled storm king in shattered gold armour, carrying a bell that calls lightning from a drowned sky.", answers: { name: "The Storm King", archetype: "Fallen monarch", arena: "A lightning-split throne room", weapon: "A thunder bell", silhouette: "A broken crown and enormous cloak", phases: "Armour shatters and lightning escapes" }, direction: { palette: ["#101a34", "#d5a63e", "#6bc9ff", "#ece9d8"], artDirection: "A towering storm monarch with a regal stance, gold armour, and contained lightning under fractured plates." } },
  void: { prompt: "A regal matriarch who rules the space between stars, dressed in a cloak that contains a moving night sky.", answers: { name: "The Last Matriarch", archetype: "Cosmic horror", arena: "A ruined observatory", weapon: "Void chains", silhouette: "Six radiant wings", phases: "It transforms into a celestial form" }, direction: { palette: ["#100e29", "#493a83", "#b37bed", "#eee4ff"], artDirection: "A regal side-view cosmic matriarch with a starfield cloak, six radiant wings, and clear violet energy shapes." } },
  iron: { prompt: "A holy war machine built inside a dormant mountain forge, still carrying the command to protect a vanished empire.", answers: { name: "The Iron Saint", archetype: "War machine", arena: "A collapsing forge", weapon: "A storm of molten iron", silhouette: "A cathedral-sized hammer", phases: "Its weapon awakens and changes shape" }, direction: { palette: ["#282b35", "#737d82", "#e1793d", "#f2d293"], artDirection: "An immense iron guardian in strict side view, with cathedral armour, a monumental hammer, and controlled forge fire." } },
};
const $ = (selector) => document.querySelector(selector);
const creativePrompt = $("#creative-prompt"), templateSelect = $("#boss-template"), chatLog = $("#chat-log"), choiceList = $("#choice-list"), answerForm = $("#answer-form"), answerInput = $("#answer-input"), stepCount = $("#step-count"), directionStatus = $("#direction-status"), directionEmpty = $("#direction-empty"), bossDirection = $("#boss-direction"), generatedPrompt = $("#generated-prompt"), buildButton = $("#build-direction"), production = $("#production-workspace"), preview = $("#boss-preview"), playerCanvas = $("#boss-animation-preview"), playerContext = $("#boss-animation-preview").getContext("2d"), animationLabel = $(".boss-animation-label"), animationSelect = $("#boss-animation-select"), playAnimationButton = $("#play-boss-animation"), placeholder = $("#boss-placeholder"), status = $("#generation-status"), generateBossButton = $("#generate-boss"), download = $("#download-boss"), saveToFinalGameButton = $("#save-boss-to-final-game"), library = $("#boss-library"), libraryCount = $("#library-count"), completeButton = $("#complete-module");
const answers = {};
let currentStep = 0, direction = null, busy = false;
let generatedBoss = null, bossReplacementTimer = null, selectedAnimation = "idle", isAnimationPlaying = true;
const bossAnimations = ["idle", "walk", "run", "attack", "hurt", "death", "enrage"];
let playbackLayout = null, playbackImage = null, playbackElapsed = 0, playbackLastTime = null, loadSerial = 0;
const playbackNote = document.createElement('p');
playbackNote.id = 'boss-playback-note';
playbackNote.setAttribute('role', 'status');
playerCanvas.after(playbackNote);
const repairAnimationButton = document.createElement('button');
repairAnimationButton.id = 'repair-boss-animations';
repairAnimationButton.type = 'button';
repairAnimationButton.className = 'small-action';
repairAnimationButton.textContent = 'REPAIR ANIMATIONS';
repairAnimationButton.hidden = true;
generateBossButton.after(repairAnimationButton);
const manifestDownload = document.createElement('a');
manifestDownload.className = 'small-action';
manifestDownload.textContent = 'DOWNLOAD COORDINATES JSON';
manifestDownload.hidden = true;
saveToFinalGameButton.after(manifestDownload);
function showManifestLink(asset) {
  const metadata = asset?.finalGameAsset?.metadataAsset;
  manifestDownload.hidden = !metadata?.assetUrl;
  if (metadata?.assetUrl) { manifestDownload.href = metadata.assetUrl; manifestDownload.download = metadata.originalName; }
}

async function saveCheckpoint() { await fetch(`/api/modules/${moduleSlug}/checkpoint`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, state: { creativePrompt: creativePrompt.value, answers, currentStep, direction, generatedBoss } }) }).catch(() => {}); }
function renderAnimationOptions() {
  animationSelect.replaceChildren();
  for (const key of bossAnimations) {
    const animation = playbackLayout?.animations.find(item => item.key === key);
    const option = document.createElement('option');
    option.value = key; option.textContent = key.toUpperCase() + (animation ? '' : ' — NEEDS REPAIR');
    option.disabled = !animation;
    animationSelect.append(option);
  }
  animationSelect.value = selectedAnimation;
}
async function showBoss(asset) {
  const serial = ++loadSerial;
  playbackLayout = null; playbackImage = null; playbackElapsed = 0; playbackLastTime = null;
  playerContext.clearRect(0, 0, 256, 256);
  playerCanvas.hidden = animationLabel.hidden = animationSelect.hidden = playAnimationButton.hidden = true;
  preview.hidden = true;
  if (!asset?.assetUrl) {
    placeholder.hidden = false;
    playbackNote.textContent = '';
    download.hidden = saveToFinalGameButton.hidden = repairAnimationButton.hidden = manifestDownload.hidden = true;
    generateBossButton.textContent = 'GENERATE BOSS SPRITE SHEET';
    window.clearTimeout(bossReplacementTimer);
    delete generateBossButton.dataset.confirming;
    return;
  }
  placeholder.hidden = true;
  download.href = asset.assetUrl; download.download = asset.originalName || 'boss-sprite-sheet.png'; download.hidden = false;
  saveToFinalGameButton.hidden = false; generateBossButton.textContent = 'GENERATE REPLACEMENT';
  saveToFinalGameButton.textContent = asset.finalGameAsset ? 'SAVED TO FINAL GAME' : 'SAVE TO FINAL GAME';
  saveToFinalGameButton.disabled = Boolean(asset.finalGameAsset);
  showManifestLink(asset);
  repairAnimationButton.hidden = asset.spriteSheetVersion === 3;
  playbackNote.textContent = 'Preparing saved animation frames…';
  try {
    const response = await fetch(`/api/bosses/layout?assetUrl=${encodeURIComponent(asset.assetUrl)}&rows=${asset.rows?.length === 4 ? 4 : 7}`);
    const layout = await response.json();
    if (!response.ok) throw new Error(layout.error || 'Unable to read this sprite sheet.');
    const source = new Image();
    source.crossOrigin = 'anonymous';
    source.src = layout.asset?.assetUrl || asset.assetUrl;
    await source.decode();
    if (serial !== loadSerial) return;
    if (source.naturalWidth !== layout.width || source.naturalHeight !== layout.height) throw new Error('Sprite dimensions do not match the frame layout.');
    if (!layout.animations.length) throw new Error('This sheet has overlapping poses. It cannot be cropped safely for playback.');
    playbackImage = source; playbackLayout = layout;
    if (layout.asset) {
      generatedBoss = { ...layout.asset, finalGameAsset: asset.assetUrl === layout.asset.assetUrl ? asset.finalGameAsset : undefined };
      download.href = generatedBoss.assetUrl;
      download.download = generatedBoss.originalName;
      showManifestLink(generatedBoss);
      repairAnimationButton.hidden = true;
      await saveCheckpoint();
    }
    selectedAnimation = layout.animations[0].key; isAnimationPlaying = true;
    playAnimationButton.textContent = 'PAUSE';
    renderAnimationOptions();
    playerCanvas.hidden = animationLabel.hidden = animationSelect.hidden = playAnimationButton.hidden = false;
    playbackNote.textContent = layout.unavailable.length
      ? `Use Repair Animations to rebuild ${layout.unavailable.join(', ')} and add eight-frame walk/run cycles. This uses new image requests; completed passes are reused.`
      : layout.spriteSheetVersion === 3 ? 'All seven animations ready. Walk and run use eight poses with alternating strides.' : 'Idle holds a steady pose. Repair Animations upgrades walk/run and combat using your saved boss design.';
  } catch (error) {
    if (serial !== loadSerial) return;
    playbackNote.textContent = error.message;
  }
}
function drawBossAnimation(now) {
  const delta = playbackLastTime === null ? 0 : Math.min(now - playbackLastTime, 100);
  playbackLastTime = now;
  if (playerCanvas.hidden || !playbackLayout || !playbackImage) return;
  if (isAnimationPlaying) playbackElapsed += delta;
  const animation = playbackLayout.animations.find(item => item.key === selectedAnimation);
  if (!animation) return;
  const step = Math.floor(playbackElapsed * animation.fps / 1000);
  const frameIndex = animation.loop ? step % animation.frames.length : Math.min(step, animation.frames.length - 1);
  const frame = animation.frames[frameIndex];
  const allFrames = playbackLayout.animations.flatMap(item => item.frames);
  const scale = Math.min(216 / Math.max(...allFrames.map(item => item.width)), 204 / Math.max(...allFrames.map(item => item.height)));
  const width = frame.width * scale, height = frame.height * scale;
  playerContext.clearRect(0, 0, 256, 256);
  playerContext.imageSmoothingEnabled = false;
  playerContext.drawImage(playbackImage, frame.x, frame.y, frame.width, frame.height, (256 - width) / 2, 220 - height, width, height);
  playerCanvas.dataset.animation = selectedAnimation;
  playerCanvas.dataset.frame = String(frameIndex);
  playerContext.fillStyle = '#c7f36b';
  playerContext.font = '14px DM Mono, monospace';
  playerContext.fillText(`${selectedAnimation.toUpperCase()} / ${frameIndex + 1}`, 12, 246);
}
function animationLoop(now) { drawBossAnimation(now); window.requestAnimationFrame(animationLoop); }
async function restoreCheckpoint() { const response = await fetch(`/api/modules/${moduleSlug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`).catch(() => null), checkpoint = response?.ok ? await response.json() : null, state = checkpoint?.state; if (!state || typeof state !== "object") return; creativePrompt.value = String(state.creativePrompt || ""); Object.assign(answers, state.answers && typeof state.answers === "object" ? state.answers : {}); currentStep = Math.min(steps.length, Number(state.currentStep) || Object.keys(answers).length); direction = state.direction && typeof state.direction === "object" ? state.direction : null; generatedBoss = state.generatedBoss && typeof state.generatedBoss === "object" ? state.generatedBoss : null; if (direction) { directionStatus.textContent = "RESUMED"; renderDirection(); production.hidden = false; showBoss(generatedBoss); status.textContent = "Resumed your saved boss direction and concept."; } renderGuide(); }

function addMessage(role, text) { const message = document.createElement("div"), label = document.createElement("span"), body = document.createElement("div"); message.className = `chat-message ${role}`; label.className = "message-label"; label.textContent = role === "user" ? "YOU" : "GODOT FORGE"; body.className = "message-body"; body.textContent = text; message.append(label, body); chatLog.append(message); }
function renderGuide() {
  chatLog.replaceChildren(); addMessage("bot", "A great boss is a promise: this fight will be worth the climb.");
  steps.forEach((step, index) => { if (answers[step.field]) { addMessage("bot", step.prompt); addMessage("user", answers[step.field]); } if (index === currentStep && currentStep < steps.length) addMessage("bot", step.prompt); });
  if (currentStep === steps.length) addMessage("bot", "The threat is defined. Forge its direction, then bring the final encounter to life.");
  chatLog.scrollTop = chatLog.scrollHeight; stepCount.textContent = `${String(Math.min(currentStep + 1, steps.length)).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
  choiceList.replaceChildren();
  if (currentStep < steps.length) steps[currentStep].choices.forEach((choice) => { const button = document.createElement("button"); button.className = "choice-button"; button.type = "button"; button.textContent = choice; button.addEventListener("click", () => submit(choice)); choiceList.append(button); });
  buildButton.disabled = busy || currentStep !== steps.length;
}
function submit(value) { const answer = value.trim(); if (!answer || busy || currentStep >= steps.length) return; answers[steps[currentStep].field] = answer; currentStep += 1; answerInput.value = ""; direction = null; generatedBoss = null; showBoss(null); directionStatus.textContent = "WAITING"; directionEmpty.hidden = false; bossDirection.replaceChildren(); production.hidden = true; renderGuide(); saveCheckpoint(); }
function setBusy(value, message = "") { busy = value; document.querySelectorAll("button, input, select, textarea").forEach((el) => { el.disabled = value; }); if (message) status.textContent = message; renderGuide(); }
function parseJson(text) { const objectText = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || text.match(/\{[\s\S]*\}/)?.[0]; if (!objectText) throw new Error("Codex did not return a boss direction. Please try again."); try { return JSON.parse(objectText); } catch { throw new Error("Codex returned an invalid boss direction. Please try again."); } }
function directionPrompt() { return `Create a production-ready 2D game boss direction. The boss must be iconic, imposing, stylish, and badass without graphic gore. Return ONLY valid JSON in this exact shape:\n{"name":"...","archetype":"...","arena":"...","weapon":"...","silhouette":"...","phases":"...","palette":["#RRGGBB","#RRGGBB","#RRGGBB","#RRGGBB"],"artDirection":"..."}\nStudent idea: ${creativePrompt.value.trim() || "No separate idea."}\nGuided answers: ${JSON.stringify(answers)}\nMake the silhouette, weapon, pose, power source, and phase escalation concrete. Avoid cute, generic, harmless, or copyrighted designs.`; }
function normalise(raw) { const value = raw.boss || raw, text = (key, fallback) => String(value[key] || fallback).slice(0, 500); return { name: text("name", answers.name), archetype: text("archetype", answers.archetype), arena: text("arena", answers.arena), weapon: text("weapon", answers.weapon), silhouette: text("silhouette", answers.silhouette), phases: text("phases", answers.phases), palette: Array.isArray(value.palette) ? value.palette.slice(0, 6).map(String) : [], artDirection: text("artDirection", "A commanding full-body boss with a powerful silhouette and clear phase cues.") }; }
function renderDirection() { directionEmpty.hidden = true; bossDirection.replaceChildren(); const heading = document.createElement("h3"); heading.textContent = direction.name; bossDirection.append(heading); [["THREAT", direction.archetype], ["ARENA", direction.arena], ["POWER", direction.weapon], ["SILHOUETTE", direction.silhouette], ["FINAL PHASE", direction.phases], ["ART DIRECTION", direction.artDirection]].forEach(([key, value]) => { const item = document.createElement("div"), label = document.createElement("span"), text = document.createElement("p"); label.textContent = key; text.textContent = value; item.append(label, text); bossDirection.append(item); }); if (direction.palette.length) { const palette = document.createElement("p"); palette.textContent = `Palette: ${direction.palette.join(" · ")}`; bossDirection.append(palette); } generatedPrompt.textContent = `Draw “${direction.name},” an undeniably badass ${direction.archetype}, in strict platformer side view. ${direction.artDirection} Give it ${direction.silhouette.toLowerCase()} and ${direction.weapon.toLowerCase()}. Generate separate guided animation passes, then pack an 8 × 7 atlas with rows: idle, walk, run, attack, hurt, death, enrage (${direction.phases}). Walk and run: eight poses each, alternating leading legs with crossing/passing poses, bent recovery knees and distinct grounded walk versus airborne run. Attack: anticipation, wind-up, forward strike, recovery. Enrage: gathering energy, tension, release, empowered stance. Hold one steady idle; use four poses for each combat action. Transparent gutters, complete weapons/effects inside each frame, fixed scale and ground anchor, no text or UI.`; }
async function buildDirection() { if (direction) { renderDirection(); production.hidden = false; status.textContent = "Using your saved boss direction. Change a guide answer to forge a new one."; return; } setBusy(true, "Forging a fight-ready boss direction…"); directionStatus.textContent = "FORGING"; try { const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model: "gpt-5.6-luna", stream: false, messages: [{ role: "user", content: directionPrompt() }] }) }), payload = await response.json().catch(() => ({})); if (!response.ok || !payload.message?.content) throw new Error(payload.error?.message || payload.error || "Could not reach the configured Codex proxy. Check OLLAMA_PROXY_URL in tutorial-web-app/.env and make sure it is running."); direction = normalise(parseJson(payload.message.content)); directionStatus.textContent = "READY"; renderDirection(); production.hidden = false; production.scrollIntoView({ behavior: "smooth", block: "start" }); saveCheckpoint(); } catch (error) { directionStatus.textContent = "WAITING"; status.textContent = error.message; } finally { setBusy(false); } }
async function generateBoss() {
  if (!direction || busy) return;
  if (generatedBoss && generateBossButton.dataset.confirming !== 'true') {
    generateBossButton.dataset.confirming = 'true';
    generateBossButton.textContent = 'CLICK AGAIN TO REPLACE';
    status.textContent = 'Click again to create a new boss reference and animation passes. This uses multiple image requests. To keep this design, use Repair Animations instead.';
    bossReplacementTimer = window.setTimeout(() => { delete generateBossButton.dataset.confirming; generateBossButton.textContent = 'GENERATE REPLACEMENT'; }, 6000);
    return;
  }
  window.clearTimeout(bossReplacementTimer);
  delete generateBossButton.dataset.confirming;
  setBusy(true, 'Generating the boss reference, followed by movement and combat passes…');
  let needsRepair = false;
  try {
    const response = await fetch('/api/bosses/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ boss: direction }) });
    const asset = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(asset.error || 'Could not generate this boss sprite sheet.');
    generatedBoss = asset;
    await saveCheckpoint();
    await showBoss(asset);
    needsRepair = asset.needsAnimationRepair === true;
    await loadLibrary();
    status.textContent = 'Boss reference saved to your library.';
  } catch (error) { status.textContent = error.message; }
  finally { setBusy(false); }
  if (needsRepair) await repairAnimations();
}
async function repairAnimations() {
  if (busy || !generatedBoss?.assetUrl) return;
  setBusy(true, 'Building movement, attack and enrage animations… Completed passes are saved for resume.');
  try {
    const response = await fetch('/api/bosses/repair', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ assetUrl: generatedBoss.assetUrl, boss: direction }) });
    const asset = await response.json();
    if (!response.ok) throw new Error(asset.error || 'Animation repair failed.');
    generatedBoss = asset;
    await saveCheckpoint();
    await showBoss(asset);
    await loadLibrary();
    status.textContent = 'All seven animations saved. Walk and run have eight frames each.';
  } catch (error) { status.textContent = error.message; }
  finally { setBusy(false); }
}
repairAnimationButton.addEventListener('click', repairAnimations);
async function saveBossToFinalGame() { if (!generatedBoss?.assetUrl || busy) return; setBusy(true, "Saving boss sprite sheet to Final Game…"); try { const response = await fetch("/api/assets/publish", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sourceModule: moduleSlug, assetUrl: generatedBoss.assetUrl, name: `${direction?.name || "boss"}-boss-sprite-sheet.png` }) }), published = await response.json().catch(() => ({})); if (!response.ok) throw new Error(published.error || "Could not save this boss sprite sheet to Final Game."); generatedBoss.finalGameAsset = published; await saveCheckpoint(); showManifestLink(generatedBoss); saveToFinalGameButton.textContent = "SAVED TO FINAL GAME"; saveToFinalGameButton.disabled = true; status.textContent = "Boss sprite sheet and coordinates JSON saved to the Final Game library."; } catch (error) { status.textContent = error.message; } finally { setBusy(false); saveToFinalGameButton.disabled = Boolean(generatedBoss?.finalGameAsset); } }
async function loadLibrary() { const response = await fetch(`/api/assets?module=${moduleSlug}`), assets = response.ok ? await response.json() : []; libraryCount.textContent = `${assets.length} ${assets.length === 1 ? "FILE" : "FILES"}`; library.replaceChildren(); if (!assets.length) { const empty = document.createElement("p"); empty.className = "profile-empty"; empty.textContent = "No boss concepts yet."; library.append(empty); return; } assets.forEach((asset) => { const link = document.createElement("a"), image = document.createElement("img"), name = document.createElement("span"); link.href = asset.assetUrl; link.download = asset.originalName; image.src = asset.assetUrl; image.alt = asset.originalName; name.textContent = asset.originalName; link.append(image, name); library.append(link); }); }
async function toggleComplete() { const completed = completeButton.dataset.completed !== "true", response = await fetch(`/api/modules/${moduleSlug}/progress`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, completed }) }); if (!response.ok) return; completeButton.dataset.completed = String(completed); completeButton.textContent = completed ? "REOPEN MODULE" : "MARK MODULE COMPLETE"; }
answerForm.addEventListener("submit", (event) => { event.preventDefault(); submit(answerInput.value); });
$("#load-template").addEventListener("click", () => { const template = templates[templateSelect.value]; if (!template || busy) return; creativePrompt.value = template.prompt; Object.keys(answers).forEach((key) => delete answers[key]); Object.assign(answers, template.answers); currentStep = steps.length; direction = { ...template.answers, ...template.direction }; generatedBoss = null; directionStatus.textContent = "READY"; renderDirection(); production.hidden = false; showBoss(null); status.textContent = "Template ready. Generate its boss sprite sheet."; renderGuide(); saveCheckpoint(); });
buildButton.addEventListener("click", buildDirection); generateBossButton.addEventListener("click", generateBoss); saveToFinalGameButton.addEventListener("click", saveBossToFinalGame); animationSelect.addEventListener("change", () => { selectedAnimation = animationSelect.value; playbackElapsed = 0; playbackLastTime = null; }); playAnimationButton.addEventListener("click", () => { isAnimationPlaying = !isAnimationPlaying; playbackLastTime = null; playAnimationButton.textContent = isAnimationPlaying ? "PAUSE" : "PLAY"; }); $("#complete-module").addEventListener("click", toggleComplete); $("#copy-prompt").addEventListener("click", async () => { await navigator.clipboard?.writeText(generatedPrompt.textContent); });
creativePrompt.addEventListener("change", saveCheckpoint);
renderGuide(); loadLibrary(); restoreCheckpoint(); window.requestAnimationFrame(animationLoop);
