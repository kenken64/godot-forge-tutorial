# Game Physics: boulder and water

This module replaces the overview page with an interactive drop. Learners adjust height (2–8 m), boulder mass (20–120 kg), and gravity (4–15 m/s²), then watch the boulder enter a forest pool beside a controllable swimming explorer. The explorer starts on the left and can swim across the full pool: left/right arrows swim, up rises, and down dives. Separate arm and leg layers animate alternating freestyle strokes and kicks, with surface wakes and underwater bubbles. The page shows predicted fall time, live speed, impact energy, and dive depth; it supports slow motion and saves module completion after a drop. Click the pool to return keyboard focus to swimming after adjusting a slider.

## Physics model

The boulder starts at rest. Ignoring air resistance, the animation uses downward displacement `y = ½gt²` and speed `v = gt`. The predicted time is `t = √(2h/g)`, impact speed is `v = √(2gh)`, and kinetic energy just before contact is `E = mgh`. Mass therefore changes energy but not the ideal fall time or speed. The visual boulder size stays fixed so the comparison is easy to see.

These equations follow [OpenStax: Free Fall](https://openstax.org/books/university-physics-volume-1/pages/3-5-free-fall) and [OpenStax: Gravitational Potential Energy](https://openstax.org/books/college-physics/pages/7-3-gravitational-potential-energy). The water splash, ripples, and post-impact sinking are **illustrative effects**, not a quantitative fluid or buoyancy simulation. Their scale responds to impact energy. The UI states this limit explicitly.

## Generated art

The background, transparent boulder, and transparent splash were generated once with `gpt-image-2.5-sunburst` through the OpenAI Image API. The swimmer was edited from the existing Storyline Engine explorer with the same model, preserving the recognizable hood and teal scarf. The assets were optimized and converted to WebP for the page, with the transparent cutouts cropped to their content. The exact prompts are in [`art-prompts/`](art-prompts/) and can also be opened from the module page. The final browser assets are in [`images/`](images/). The page makes no image API call during a drop.

[Official OpenAI Docs](https://developers.openai.com/api/docs/guides/image-generation) list Sunburst as an Image API model and document transparent PNG output. This project uses the same model by default for its other image-generation features.

Run the tutorial server from `tutorial-web-app` with `npm start`, then open `/game-physics/`.
