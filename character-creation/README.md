# Character creation

This module teaches the student to move from their own creative idea to a playable 2D character:

1. Write a free-form character idea.
2. Answer the seven guide prompts: role/class, name, focus attributes, weapon, combat style, visual identity, and weakness. Focus attributes can be combined, such as strength + vitality or intelligence + magic.
3. For fast testing, choose a quick template such as Storm Warden, Moon Scout, or Ember Sage and click **Load template**.
4. Click **Build character + sprite**. The browser sends the idea and answers to the Ollama-compatible proxy, then asks Codex for the animation plan.
5. The tutorial server sends the design to the configured image-generation service and stores a transparent 4-column by 7-row PNG sprite sheet in the assets volume. The rows are idle, walk, run, attack, jump, hurt, and death.
6. Test the generated movement preview with `A`, `D`, the arrow keys, and `Space`.
7. Click **Save PNG** to store the rendered sprite sheet in the assets volume.
8. Save the character, design, sprite plan, and movement settings to DuckDB.

Start both local services:

```sh
cd ollama-api-proxy
npm start

cd ../tutorial-web-app
npm start
```

Set `OLLAMA_PROXY_URL` in `../tutorial-web-app/.env` (default `http://127.0.0.1:8788`). The tutorial server forwards chat requests to that proxy; the student page no longer displays its URL. Restart the tutorial server after changing `.env`.

Codex supplies the design and animation specification through the Ollama proxy. The tutorial server then generates and stores the actual transparent artwork; the browser loads the saved PNG and uses its fixed cells for the animation and movement preview.

## Image generation configuration

Set these variables before starting `tutorial-web-app`:

```sh
export OPENAI_API_KEY="your-api-key"
export OPENAI_IMAGE_MODEL="gpt-image-2.5-sunburst"
npm start
```

The text conversation continues to use the Ollama-compatible Codex proxy with GPT-5.6 Luna. Image generation is a separate binary-asset request because the Ollama-compatible chat response is text/JSON, while the sprite sheet must be returned as PNG bytes.
