# Godot Forge tutorial web app

See the [module style guide](../STYLE_GUIDE.md) for shared visual conventions across the landing page and lessons.

Existing installations keep their `pixel-forge.duckdb` database. Browser preferences and learner IDs are copied from legacy keys to `godot-forge-*` keys without resetting progress or regenerating saved artwork. New installations use `godot-forge.duckdb`.

The `tutorial-web-app` folder is the landing page and API server for the 2D game development tutorial. It contains one module card for every sibling folder in the project:

- `character-creation`
- `game-assets-creation`
- `boss-creation`
- `storyline-engine` — a six-beat Phaser story preview showing the five narrative attributes, choices with visible world-state consequences, and saved character/boss sprite-sheet animations from Final Game manifests
- `parallax-tiling-map` — a three-screen Phaser tilemap workshop for placing and mirroring published tiles, inspecting localized tile tooltips, previewing decorative tile loops while solid terrain stays still, drawing square or freeform collision regions, choosing a saved character, and play-testing layered scenery with double jump; it also publishes reusable side-scroller templates to the Final Game library, with full generation prompts shown in English, Chinese and Malay
- `items-spawning` — a standalone Phaser demo of timed randomized pickups, player collection, and loot dropped by a defeated enemy
- `enemies-ai` — enemy state machines, sensing, navigation and readable combat behavior
- `game-loop-engine` — a playable Phaser quest loop: collect 20 coins, reach the Grove Relic, complete the level and restart via Continue
- `game-controls` — a Phaser forest practice game with a GPT Image 2.5 Sunburst training dummy, live gamepad visualization, on-page prompts, and saved mappings for left/right, jump, crouch/roll, and attack
- `game-settings` — Game HUD and Settings: readable in-game status displays and persistent player preferences
- `game-physics` — a boulder drop and a controllable explorer who swims across the pool with animated freestyle strokes and can dive underwater, plus gravity, speed and energy readouts
- `game-ending-cutscene` — generated four-panel final-boss recap, pixel-art dialogue, branching endings and localized image prompts
- `credits` — localized, skippable scrolling contributor roles beside a randomized gallery of generated game screenshots
- `marketplace-system` — products, purchases and player inventory
- `game-achievement` — a playable forest collection challenge with ten gold coins, HP restoration from a heart, animated unlocks, a walking explorer, and a persistent grey-to-color achievement menu
- `game-leaderboard` — a playable 150-point run with ten gold coins and a heart, an animated practice ranking, and a persistent grey-to-color leaderboard
- `local-coop` — a shared-screen coin run with a keyboard player, a gamepad player, separate coin counters, saved progress, and on-page gameplay and art prompts
- `multiplayer-game` — a two-player WebSocket room where either player hosts or joins, both can chat and ready up, and both live game views share server-owned movement and coin scores
- `math-stem-physics-quiz` — 40-question maths, physics, game-systems, and computer-game-history quiz
- `setup-godot-with-ai` — Godot 2D project setup, asset import and AI-assisted scene assembly
- `final-game`

## Persistence model

The app uses DuckDB for application data:

- `modules` stores the tutorial module metadata.
- `module_content` is ready for the Markdown/tutorial content for each module.
- `module_translations` stores English, Simplified Chinese, and Malay module titles and descriptions.
- `quiz_questions` and `quiz_question_translations` store the 40 quiz questions and their English, Simplified Chinese, and Malay wording, answer choices, and explanations.
- `quiz_answers` stores each learner's server-graded answer. Quiz completion requires all 40 answers and at least 30 correct; client checkpoints cannot mark the quiz complete.
- `learner_progress` stores completion per browser learner ID. Legacy `tutorial_progress` rows remain readable when that learner has no newer record for a module.
- `assets` stores asset metadata and the path to the corresponding file.
- `characters` stores the completed character profile and prompt-chat transcript from the `character-creation` module.

Asset binaries are stored on the filesystem, not inside DuckDB. The storage root is selected in this order:

1. `APP_STORAGE_DIR` when explicitly set (useful for local development or tests).
2. `RAILWAY_VOLUME_MOUNT_PATH` when running with a Railway Volume.
3. `tutorial-web-app/storage` locally by default.

This means a Railway volume mounted at `/app/data` will contain `/app/data/godot-forge.duckdb` and `/app/data/assets/*`. Railway documents that `RAILWAY_VOLUME_MOUNT_PATH` is provided at runtime and that the mount path must include the directory where the app writes persistent data.

Published lesson images, module icons, previously uploaded library images, and cached storyline voice files are listed in [`SPACES_PUBLIC_URLS.json`](../SPACES_PUBLIC_URLS.json). The app requests them directly from DigitalOcean Spaces; API responses also use the public URL when a saved asset is in that manifest. Set a Spaces CORS rule that allows the app's origin for `GET` and `HEAD`; the local development origin is `http://localhost:3000`. Existing app image paths remain available through the server as compatibility routes. Newly generated and learner-saved assets use the storage volume and `/api/assets/*` until they are uploaded and added to the manifest. New voice lines use the local voice API until their cached MP3s are uploaded. Run [`upload_spaces_assets.py`](../upload_spaces_assets.py) from the project root and restart this server after adding or updating published media.

The API currently exposes:

- `GET /api/modules?learnerId=...` — module metadata and that learner's saved progress.
- `POST /api/chat` — forward text/design requests to the server-configured Ollama-compatible proxy.
- `PATCH /api/modules/:slug/progress` with `{ "learnerId": "...", "completed": true }` — save that learner's progress. For the chapter 18 quiz, the server first verifies a passing score from saved graded answers.
- `POST /api/modules/:slug/reset` with `{ "learnerId": "..." }` — clear that learner's saved module checkpoint and mark the module incomplete. Generated artwork, saved characters, and Final Game exports remain available. The UI requires a second click to confirm and does not call an AI model.
- `GET /api/quizzes/math-stem-physics-quiz?locale=en|zh|ms` — return the 40 categorized DuckDB questions without answer keys in the requested language. The UI shows 10 questions per page and keeps the current page in a learner checkpoint.
- `POST /api/quizzes/math-stem-physics-quiz/answer` with `learnerId`, `questionId`, and `option` — save and grade one answer, returning a localized explanation plus a source link for history questions. `POST /api/quizzes/math-stem-physics-quiz/review` with `learnerId` and `locale` returns saved graded answers in the selected language; `POST /api/quizzes/math-stem-physics-quiz/retry` clears that learner's attempt.
- `POST /api/assets?module=character-creation` with the file bytes and an `x-file-name` header — save an asset file and its DuckDB metadata.
- `GET /api/assets/:storedName` — serve a stored asset from the configured asset volume.
- `POST /api/sprites/generate` with a character design — generate a transparent 8-by-7 sprite sheet with a separate pose-guided, eight-frame walk/run pass, store it in the asset volume, and return its metadata. The same rules apply to templates and custom briefs; see [locomotion v2](../character-creation/data/locomotion-v2.md).
- `POST /api/assets/generate` with an asset-pack brief and `tileset`, `props`, `pickups`, or `ui` category — generate and store a transparent, 4-by-4 category sheet for Game Assets Creation.
- `POST /api/bosses/generate` with a completed boss direction — generate and store a transparent, full-body boss concept with an imposing silhouette and phase-readability cues.
- `POST /api/characters` with a completed character profile and sprite sheet — save the character, mark Character Creation complete, and publish its sprite sheet and coordinates JSON to the persistent `assets/final-game/` library.
- `POST /api/assets/publish` with a saved boss or asset-pack URL — publish its PNG and a linked coordinates JSON. The response includes `metadataAsset.assetUrl` for downloading the JSON.
- `GET /api/assets?module=final-game` — list both PNGs and JSON manifests published for Final Game.

The companion JSON records pixel coordinates from the top-left of the exported PNG. Characters and bosses include each animation's frame rectangles, speed, and loop setting; asset packs include every grid cell's rectangle and category. Anchor points are provided for current animation sheets. Collision areas and tile names still need a designer's review.
- `GET /api/characters?module=character-creation` — read saved character profiles.
- `GET /api/health` — show the active database and asset paths.

## Run it

Install the server dependency and start the app from this folder:

```sh
npm install
npm start
```

Then open `http://localhost:3000`. The module links intentionally point to each sibling folder, so those folders can later receive their own `index.html` tutorial pages.

For the **Build character + sprite** and other AI design actions, start the local [Codex proxy](../ollama-api-proxy/README.md) in a second terminal before using them:

```sh
cd ../ollama-api-proxy
npm start
```

The proxy must answer at `http://127.0.0.1:8788/health` when `OLLAMA_PROXY_URL` uses the default address. The app's own `npm start` does not start that companion process.

The app includes client-side search, English/Chinese/Malay translation switching, a time-based light/dark theme toggle, mobile navigation, and progress tracking persisted through the DuckDB API.

Storyline Engine loads Phaser 3 locally from the installed `phaser` dependency. Its three outcome backgrounds and fallback explorer/guardian figures were generated with the configured GPT Image 2.5 model, then optimized into `storyline-engine/images/*-stage.webp` by `node scripts/prepare-story-art.mjs`. It previews published character and boss sheets using their companion coordinates JSON, falling back to the generated demo figures until suitable assets are saved. Story choices and the current beat are checkpointed per learner, so a refresh resumes the example without generating images again.
The explorer and guardian exchange choice-sensitive lines in a GPT Image 2.5-generated speech bubble. Text is rendered separately in Phaser and repeated in accessible HTML controls, with English, Simplified Chinese, and Malay dialogue. The current conversation line is saved in the learner checkpoint. The page displays the exact artwork prompts plus Chinese and Malay learning translations. With `OPENAI_API_KEY`, character dialogue uses OpenAI `gpt-4o-mini-tts` voices; MP3 files are cached under `storage/story-voices`, so replaying a generated line does not call the API again. The page discloses that these voices are AI-generated.

Set `OLLAMA_PROXY_URL` in `tutorial-web-app/.env` to the Ollama-compatible Codex proxy address (default `http://127.0.0.1:8788`). If that proxy uses `PROXY_API_KEY`, set the same value as `OLLAMA_PROXY_API_KEY` here. Character, boss, and asset creation send text/design requests through this server; students do not enter or see the proxy URL. Restart the tutorial server after changing `.env`.

For Character Creation, Game Asset Creation, Boss Creation image generation, and Storyline Engine voice playback, set `OPENAI_API_KEY` in the same `.env`. The default image model is `gpt-image-2.5-sunburst`; the default voice model is `gpt-4o-mini-tts` and can be changed with `OPENAI_TTS_MODEL`. `npm start` and `npm run dev` load `.env` automatically. The quiz is chapter 18, followed by Set Up Godot with AI at chapter 19 and Final Game at chapter 20. Its New Attempt button clears saved answers and pass status for unlimited retries.
