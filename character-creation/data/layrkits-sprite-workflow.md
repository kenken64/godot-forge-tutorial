# Character Creation sprite workflow reference

Source: [How to create a game-ready 2D sprite sheet for ANY animation](https://x.com/LayrKits/article/2050277473116619240)

The source article describes a practical approach for turning an AI-created character into reliable game animation. The X article was not directly fetchable from this environment, so this file records a concise implementation reference rather than a copy of the article.

## How it applies to this module

The student first completes the guided character brief. The resulting character design becomes the source of truth for every visual asset. The production reference should use a real transparent alpha channel; chroma green is only a fallback for video-model workflows that require a keyed background.

1. Generate one full-body, animation-safe reference pose. Keep the character centered, fully visible, and away from the canvas edges. Request a genuinely transparent background with no shadows, floor, text, props, or extra characters. If a video model requires chroma green, retain a separate keyed source and remove it before the game asset is promoted.
2. Create each motion from that reference pose with a video-capable image workflow. Keep the camera locked, preserve the character design and facing direction, and describe the motion as a sequence of readable beats.
3. Extract the source video frames at full resolution. Preserve the original canvas size and frame position; do not tightly crop or independently recenter frames.
4. Review frames in a contact sheet. Select clear key poses first, then add in-between frames. Reject frames with missing limbs, clipped weapons, major design changes, or broken motion.
5. Remove the chroma-green background, validate the transparent edges, and pack the reviewed frames into a fixed-cell sprite sheet.
6. Store the reviewed sheet and frame metadata with the character record so the tutorial can replay the same result.

## Animation set for Character Creation

The module should produce these rows or clips:

- `idle`: breathing or subtle stance movement
- `walk`: alternating foot positions
- `run`: stronger stride and body lean
- `attack`: anticipation, strike, follow-through, recovery
- `jump`: crouch, lift-off, airborne pose, landing
- `hurt`: readable impact reaction and return to stance
- `death`: defeat motion that ends in a stable final pose

## Current reference asset

- `storm-warden-reference.png`: primary RGBA character reference with transparent background
- `storm-warden-reference-chroma.png`: preserved chroma-green source for workflows that require a keyed video background
- `storm-warden-sprite-sheet.png`: generated 4-column by 7-row RGBA sheet
- `storm-warden-sprite-sheet.json`: frame dimensions, row order, FPS, and anchor metadata

## Important generation constraints

- Full body, weapon, hair, cape, and effects must remain inside generous margins.
- Keep the character scale and anchor point consistent across every frame.
- Use a fixed camera: no zoom, pan, cuts, shake, or rotation.
- Keep the background flat and separate from the character palette.
- Generate transition poses for complex actions instead of jumping directly from idle to an extreme pose.
- Prefer 12–24 reviewed frames per animation over a large sheet of inconsistent frames.

## Next implementation step

Replace the current procedural placeholder preview with an asset-backed workflow: store generated source frames and the packed transparent sheet under the Character Creation asset namespace, then use the existing animation preview and movement controls to play the reviewed clips.
