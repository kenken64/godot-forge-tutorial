# Final Game starter kit

`build_starter_kit.py` makes a Godot 4 project ZIP for the Web Editor. It selects every published media file under lesson module directories from `SPACES_PUBLIC_URLS.json`, excluding the `originals/` source-art folders. It also adds the example character animation coordinate JSON files. The kit is organized by module under `assets/` and contains an `asset_catalog.json` with source URLs and SHA-256 hashes.

The shared kit is built from lesson media. Learner-generated characters, bosses, and asset packs in the Final Game library are separate and are not included in this common ZIP.

Build and verify locally:

```sh
python3 final-game/build_starter_kit.py --download-missing
unzip -t final-game/dist/godot-forge-starter-v1.zip
```

The local archive is available through `GET /api/final-game/starter-kit` when the tutorial server runs. If no local archive is present, that endpoint redirects to the published ZIP in the existing `godot-forge` Space. To publish a new version, upload the versioned ZIP with a Spaces-enabled AWS CLI profile:

```sh
aws s3 cp final-game/dist/godot-forge-starter-v1.zip \
  s3://godot-forge/2d-game-development/final-game/starter/godot-forge-starter-v1.zip \
  --endpoint-url https://sgp1.digitaloceanspaces.com \
  --region us-east-1 \
  --profile digitalocean \
  --acl public-read \
  --content-type application/zip \
  --content-disposition 'attachment; filename="godot-forge-starter-v1.zip"'
```

The published ZIP is at `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/final-game/starter/godot-forge-starter-v1.zip`. Set `GODOT_STARTER_KIT_URL` only to override this URL. The existing general media uploader does not select ZIP files.

The Final Game page links students to Learn Godot Web Editor. Its cloud workspace seeds each learner's persistent server project from this ZIP automatically. Students may also download the common ZIP or a backup of their changed cloud project.

The page's nine-section build guide is in `guide.js`. It takes learners from the welcome scene through assets, one level, player movement, items, enemies, UI, shop, achievements, leaderboard, ending, local co-op, and online play. `writing.js` turns the Godot 4 examples into short writing tasks with prompts, hints, partial outlines, checkpoints, and independent changes. The student's place is saved in browser local storage. Students create a minimal `Game.gd` autoload before writing `Player.gd`, then expand Game in the pickup section. The full scripts appear as collapsed references only after the matching writing and change tasks are completed; the primary flow has no full-file copy button. Section 3 includes `GamepadBindings.gd` for device-specific stick, D-pad, and button actions; Section 6 assigns the first pad to P1 in solo play or P2 in local co-op, with a second pad available for P1. The online guest sends those same actions to the host. The online example uses the two-peer relay at `/ws/final-game`, implemented in `tutorial-web-app/final-game-rooms.mjs`. The shared starter ZIP intentionally remains a blank project so learners build the scenes and scripts themselves.

`walkthrough.js` and `function-details.js` supply execution flow, symbol explanations, and statement-level function notes for every complete reference. Learners can click a name, select one identifier, or use the selector beside the code. The writing checklist is self-reported: students confirm each step after testing in Godot; the site does not inspect the cloud project automatically.

The cloud editor image sets `FM_HOME=/config/project`, so students can use the Kclient Files control to upload their own saved PNG and JSON files into the project. For cloud-to-cloud multiplayer, the relay must be deployed on a URL reachable by both Godot workspaces; `localhost` in the copied code only works when Godot and the tutorial app run on the same machine.
