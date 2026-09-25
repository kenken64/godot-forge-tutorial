# Locomotion generation v2

All template **Build** requests and all original student briefs go through the
same `/api/sprites/generate` pipeline. Templates only prefill a brief; they do
not bypass animation generation.

1. Generate the character/action reference atlas with the configured image model.
2. Edit with that reference plus an explicit near-leg/far-leg pose guide, producing
   a separate 4×4 sheet: eight walk frames followed by eight run frames.
3. Find transparent seams before slicing. Normalize the frames with a common
   scale, bottom anchor and transparent margins, rather than sampling a guessed
   grid which can include pixels from neighbouring rows.
4. Check for empty/opaque frames, bleed and a static lower-body cycle; retry the
   locomotion pass once if invalid. Fail visibly rather than return the old walk
   row as successful output.
5. Pack an exact 2048×1792 PNG (8 columns × 7 rows, 256px square cells). The rows
   are idle/walk/run/attack/jump/hurt/death with 1/8/8/4/4/4/4 frames.

The authoritative shared prompt and processing code are in `../locomotion.mjs`.
These pixel checks detect gross failures, **not anatomical correctness**. An AI
image can still have a poor gait; inspect contact and passing poses before using
an animation in a finished game. Non-biped briefs should retain their anatomy.
The production pipeline preserves `OPENAI_IMAGE_MODEL`; it does not change the
user's configured model.

## Quick template playback

Choose a template and press **Preview sample animation** (also localized in
Chinese and Malay). This loads the versioned sample directly without a model
call. **Load template**, then **Build character + sprite**, still generates from
the editable brief through the shared production pipeline.

Sample assets are `storm-warden-sprite-sheet-v2.png`,
`moon-scout-sprite-sheet-v2.png`, `ember-sage-sprite-sheet-v2.png`, and their JSON
metadata in this directory. The source movement strips are the matching
`*-gait-v2.png` files. Original assets were retained; cached UUID assets were not
overwritten. Saving a sample uploads the original transparent PNG to the normal
asset store and records the generated metadata through the existing DuckDB API.

Existing four-frame sheets need regeneration; browser playback alone cannot
invent the missing poses. A/D or arrows walk, Shift runs, Space jumps.

## Sample asset generation

Mode: built-in image-generation tool, three separate reference-based requests.
Each used its matching `*-sprite-sheet-fixed.png` identity reference and
`gait-pose-guide.png`, followed by deterministic seam detection and atlas packing.
Shared final prompt for all three requests:

> Create a transparent 4-column x 4-row sprite sheet (16 equal square cells). Image 1 is CHARACTER IDENTITY ONLY; image 2 is the exact pose/layout guide. Preserve character, costume, palette, weapon and pixel art style from image1. REPLACE the static legs by the skeleton guide poses. All face RIGHT side-on. First TWO rows form ONE 8-frame WALK cycle; last TWO rows form ONE 8-frame RUN cycle. Cyan guide leg represents the same foreground leg across all frames, coral the background leg; use character's original colors, not these guide colors. Walk/run frames1 and5 have opposite anatomical leading legs! At frames3 and7 legs visibly CROSS under hips, one bent knee lifted with shin crossing the straight planted leg. Follow the drawn joint and foot positions closely. Do not repeat frames1-4 as5-8. Run includes bent recovery knees, airborne strides and lean. Keep robe/cape out of way to show moving boots. Fixed head/hip anchor and identical scale in each cell. Entire character AND weapon stay inside their cell with generous transparent margins. No text, labels, guide lines, grid, background, checkerboard or floor. Real transparent alpha PNG, exactly square sheet. This is character animation, not 16 standing portraits. Render complete character in every cell, not stick figures.

## Regression tests

From `tutorial-web-app`:

```sh
npm test
npm run test:browser
```

The browser test requires Chrome and a running local app (defaults to port 3000;
override `TEST_BASE_URL` and `CHROME_CHANNEL` if necessary). Browser screenshots
are written to `tutorial-web-app/test-results/`. API integration tests use an
isolated temporary DuckDB and a mock image provider, not the development DB or
billable image API. They verify identical template/custom handling, multipart
reference images, frame packing, rejection/retry and UI lock/error recovery.

Live verification on 2026-09-21: a non-template “Moss Courier Test” brief completed
through the local server and configured image API in 59 seconds (HTTP 201).
The output is `tutorial-web-app/storage/assets/d420bbe6-3a61-4c3b-9967-c7eb7cce7818.png`,
with DuckDB asset metadata, transparent alpha and the 8-column animation contract.
This is a test asset, not a saved student character.
