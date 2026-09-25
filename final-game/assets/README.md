# Final Game asset library

When a student clicks **Save Character** after generating a sprite sheet, or
**Save to Final Game** after generating an asset sheet, the tutorial server
copies that PNG into the persistent asset volume at:

`assets/final-game/`

DuckDB records the asset with `module_slug = 'final-game'`. The Final Game module
can list the published library with:

`GET /api/assets?module=final-game`

The source repository folder is documentation only. Do not put runtime or
Railway assets here: use the configured local or Railway volume instead.
