# Storyline Engine artwork prompts

Model: `gpt-image-2.5-sunburst` (the project's configured GPT Image 2.5 model). The imagegen skill's CLI was used for generation and editing. Original PNGs are retained here; `node tutorial-web-app/scripts/prepare-story-art.mjs` builds the stage-sized WebP files used by Phaser.

## Grove restored — `grove-restored-v1.png`

> Use case: stylized-concept. Asset type: polished 2D side-view platformer story preview background, designed to sit behind separately animated character and boss sprites. Scene: a bright magical forest grove recovering after drought, a small timber village and empty market stall on the left, a giant ancient guardian tree and spring on the right, distant layered forest and hills, continuous readable walkable ground across the lower quarter. Style: richly painted pixel-art fantasy game environment, crisp detailed clusters of pixels, cohesive with dramatic handcrafted character sprite sheets, beautiful but playable, no blurry 3D rendering. Composition: wide environmental panorama; keep all important scenery and ground inside the central horizontal 55 percent of this 3:2 image so it can be cropped to a very wide 8:3 game stage. Leave open visual space at foreground positions around 30 percent and 78 percent width for sprites. Mood: warm late-afternoon light, healthy teal water, glowing green leaves, hope after restoration. Constraints: environment only, no people, no characters, no guardian creature, no UI, no signs with letters, no words, no numbers, no logos, no watermark. Single coherent side-view scene, not a collage or tileset.

## Grove drought — `grove-drought-v1.png`

Edited from `grove-restored-v1.png`:

> Use case: lighting-weather. Asset type: drought-state 2D platformer story background. Image 1 is the edit target and exact composition reference. Change only the health of this same grove and village: the spring is reduced to a narrow trickle, some exposed cracked stones, the great tree has sparse amber-brown leaves, the market stall is mostly empty and quiet, dusty late-afternoon haze, visibly scarce water. Keep the same side-view camera, identical layout of village on the left, bridge and walkable path across the lower middle, ancient tree and spring on the right, same buildings, same perspective, same painterly pixel-art style. Keep the scene readable behind separately animated player and boss sprites. Do not add any characters or people. No text, letters, numbers, UI, logos, watermark, or new structures. The image will be cropped to a very wide central horizontal band; keep all important changes in that band.

## Grove flood — `grove-flood-v1.png`

Edited from `grove-restored-v1.png`:

> Use case: lighting-weather. Asset type: flood-consequence 2D platformer story background. Image 1 is the edit target and exact composition reference. Change only the environmental outcome of this same village and ancient grove after a broken seal: the spring gushes dangerously from the giant tree on the right, shallow fast-moving floodwater crosses the path and reaches the market stall on the left, a few loose crates and damaged awnings, ominous amber light through storm clouds. Keep the same side-view camera, same positions and shape of village, market, bridge, giant tree, distant town, walkable path and stonework. Preserve the detailed handcrafted pixel-art fantasy style. The foreground should remain readable behind separately animated player and boss sprites. Do not add people, characters, a guardian creature, text, letters, numbers, UI, logos, watermark, or unrelated new structures. Keep important changes in the central horizontal band for a wide game-stage crop.

## Explorer stand-in — `explorer-key-v1.png`

> Use case: stylized-concept. Asset type: fallback player sprite for a Phaser 2D side-view platformer story preview. A single small heroic forest explorer, full body visible from hood to boots, facing right in a relaxed ready-to-walk stance, practical dark leather travel clothes, teal scarf, satchel and sturdy boots. Richly painted crisp pixel-art game sprite style matching a detailed fantasy grove background. Strong readable silhouette and consistent side view; centered with generous empty margin on every side, no weapon or action effects, no ground, no cast shadow. The entire background must be one perfectly flat uniform pure chroma green RGB 0 255 0 (#00FF00), with no gradient, texture or objects, for later key removal. The explorer and clothing must contain no green color. Exactly one character, no extra limbs, no border, no text, no logo, no watermark.

The green key was removed into `explorer-v1.png` with the imagegen skill's chroma-key helper; `explorer-stage.webp` is the optimized game asset.

## Guardian stand-in — `guardian-key-v1.png`

> Use case: stylized-concept. Asset type: fallback guardian boss sprite for a Phaser 2D side-view platformer story preview. Exactly one imposing ancient grove guardian, full body visible, facing left toward the player, tall humanoid silhouette formed from weathered stone armor and twisted dark timber, bronze joints, luminous amber eyes and restrained golden runic cracks. Badass but not evil; solemn protector of a spring, readable as a game boss at small size. Richly painted crisp pixel-art game sprite style matching a detailed fantasy grove background and a hooded explorer sprite. Strict side-view, centered with generous empty margin on every side, feet fully visible, no oversized attack effects, no ground and no cast shadow. The entire background must be one perfectly flat uniform pure chroma green RGB 0 255 0 (#00FF00), with no gradient, texture or objects, for later key removal. Guardian itself must contain no green color. No extra characters, no extra limbs, no text, no logo, no watermark.

The green key was removed into `guardian-v1.png` with the imagegen skill's chroma-key helper; `guardian-stage.webp` is the optimized game asset.

## Conversation bubble — `dialogue-bubble-key-v1.png`

> Use case: stylized-concept. Asset type: blank speech bubble panel texture for a 2D fantasy platformer conversation UI. Create exactly one long, low speech bubble, approximately 4 to 1 width to height, centered in the image, with softly rounded corners and one short triangular pointer descending from the lower edge at one-third of its width. Material: warm ivory parchment interior, subtly textured but very light and uniform in the central 80 percent for excellent dark-text readability; crisp dark chestnut pixel-art outline and restrained bronze corner detailing. Cohesive with a richly painted pixel-art fantasy forest game scene. Flat front view, perfectly horizontal, no perspective, no objects within the bubble. The outer background around the entire bubble must be one perfectly uniform chroma green RGB 0 255 0 (#00FF00), with no gradient or texture, for key removal. Keep large clear green margins on every side. Absolutely no text, letters, symbols, portraits, characters, logo, watermark, extra bubbles, glow or drop shadow.

The key was removed into `dialogue-bubble-v1.png`. `dialogue-bubble-stage.webp` is the optimized Phaser texture; dialogue text remains separate so it can be localized and changed by student choices.
