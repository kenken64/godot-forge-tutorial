# Game Leaderboard: score run

This chapter replaces the placeholder overview with a playable dusk run and a separate practice leaderboard. Move with the left/right arrows or A/D, jump with Space or Up, or use the touch controls. Each of ten unique gold pickups adds 10 points; one heart adds 50. After all 11 pickups, the 150-point result animates into the ranking and the leaderboard changes from grey to full color. Three clearly labeled demo rivals give the local practice ranking context. A separate learner checkpoint stores each pickup and restores the result after reload. Completing the run enables module completion; Reset Module clears it.

The dusk arena and trophy crest were generated with the OpenAI Image API model [`gpt-image-2.5-sunburst`](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst). The gold, heart, and eight-frame walking explorer reuse existing Sunburst artwork from neighboring chapters. The exact prompts are expandable on the lesson page. Optimized WebP files in [`images/`](images/) are what the browser loads for the new art.

Run `npm run test:leaderboard-browser` from `tutorial-web-app` to check scoring, animation, the grey-to-color board, persistence, localization, and mobile layout.
