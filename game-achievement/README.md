# Game Achievement: gold and heart

This chapter replaces the placeholder overview with a playable forest run and a separate Achievements menu. Move with the left/right arrows or A/D, jump with Space or Up, or use the on-screen controls. The explorer starts at 2/3 HP. Collecting a heart restores HP to 3/3 and awards **Heart Restored**; collecting all ten gold coins awards **Gold Collector**. Each unlock triggers an animated medal reveal. The menu shows locked medals in grey and earned medals in full color, with explicit status text and progress bars.

Pickup progress is stored in the module checkpoint for the browser's learner ID. The page restores collected coins, HP, player position, and badge colors after reload. Both badges enable module completion. The shared Reset Module control clears the checkpoint and completion.

## Art

The forest background, gold coin, heart, and both medals were generated with the OpenAI Image API model [`gpt-image-2.5-sunburst`](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst). The explorer reuses the animated eight-frame walk cycle from the Sunburst sprite sheet in `items-spawning/images/forest-sword-explorer.png`, which is also used in other playable modules. The exact art prompts are expandable on the lesson page. Optimized, transparency-preserving WebP files in [`images/`](images/) are what the browser loads for the new art; image generation does not run during play.

Run `npm run test:achievement-browser` from `tutorial-web-app` to check unlocks, grey-to-color state, saved progress, localization, and mobile layout.
