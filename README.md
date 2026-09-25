# Godot Forge

Godot Forge is an interactive 2D game development tutorial. Its 21 modules take learners from character and asset creation through game systems, a physics quiz, and a final game. Lessons include playable Phaser demos, saved progress, and English, Simplified Chinese, and Malay text.

## Run locally

You need Node.js 20 or newer, npm, and an internet connection for the published artwork and audio.

```sh
git clone https://github.com/kenken64/godot-forge-tutorial.git
cd godot-forge-tutorial
cp tutorial-web-app/.env.example tutorial-web-app/.env
cd tutorial-web-app
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000). The tutorial and its playable modules can run without configuring AI services. To use image generation and storyline voice generation, set `OPENAI_API_KEY` in `tutorial-web-app/.env` and restart the app.

Text and design requests use the optional [Codex CLI proxy](ollama-api-proxy/README.md). Start it separately from `ollama-api-proxy/` after installing and authenticating the Codex CLI. The app expects it at `http://127.0.0.1:8788` by default; change `OLLAMA_PROXY_URL` in the app's `.env` if needed.

## Modules and project layout

The [web app](tutorial-web-app/README.md) serves the landing page, API, and 21 modules. The sibling module folders contain lessons for character and asset creation, storyline and tilemap design, spawning and AI, controls and physics, achievements and leaderboards, local and online multiplayer, the final cutscene, credits, a quiz, Godot setup, and the final game. See the web app README for the full module list and API details.

| Path | Purpose |
| --- | --- |
| [`tutorial-web-app/`](tutorial-web-app/) | Landing page, Node server, DuckDB persistence, and tests |
| Module folders such as [`character-creation/`](character-creation/) and [`parallax-tiling-map/`](parallax-tiling-map/) | Individual lesson pages and game demos |
| [`ollama-api-proxy/`](ollama-api-proxy/) | Optional Ollama-compatible interface to Codex CLI |
| [`upload_spaces_assets.py`](upload_spaces_assets.py) | Incremental DigitalOcean Spaces media upload |
| [`SPACES_PUBLIC_URLS.json`](SPACES_PUBLIC_URLS.json) | Public URL manifest read by the server |

## Media and saved data

The published images and cached storyline voice files are hosted in the `godot-forge` DigitalOcean Spaces bucket in `sgp1`. The URL manifest currently lists 204 images and 7 MP3 files. The app loads published media directly from Spaces. The bucket must allow the app's origin for `GET` and `HEAD`; `http://localhost:3000` is configured for local development. Add your deployed app origin to the bucket's CORS rule before deploying.

Media binaries, local `.env` files, dependencies, and generated output are excluded from Git by [`.gitignore`](.gitignore). The URL manifest and upload script remain in Git. Newly generated learner assets and voice lines are stored locally until they are uploaded; run the [upload workflow](UPLOAD_ASSETS.md) and restart the server to publish them. The uploader checks file content and skips unchanged public objects.

Learner progress and asset metadata are kept in DuckDB. The default local storage directory is `tutorial-web-app/storage/`; set `APP_STORAGE_DIR` or use `RAILWAY_VOLUME_MOUNT_PATH` for persistent deployment storage. A fresh clone starts with a new local database and no saved learner records.

## Tests

From `tutorial-web-app/`:

```sh
npm test
npm run test:modules
npm run test:storyline-voice
```

The module browser test uses Chrome. Additional module-specific test commands are listed in [`tutorial-web-app/package.json`](tutorial-web-app/package.json).
