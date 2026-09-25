import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

test('brand migration retains learner identity and does not overwrite current preferences', async () => {
  const values = new Map([
    ['pixel-forge-learner-id', 'existing-student-123'],
    ['pixel-forge-locale', 'zh'], ['pixel-forge-proxy-url', 'http://localhost:8788'],
    ['godot-forge-locale', 'ms'],
  ]);
  const localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const script = await readFile(new URL('../brand-storage.js', import.meta.url), 'utf8');
  vm.runInNewContext(script, { localStorage });
  assert.equal(values.get('godot-forge-learner-id'), 'existing-student-123');
  assert.equal(values.get('godot-forge-locale'), 'ms');
  assert.equal(values.get('godot-forge-proxy-url'), 'http://localhost:8788');
  assert.equal(values.get('pixel-forge-learner-id'), 'existing-student-123');
  vm.runInNewContext(script, { localStorage });
  assert.equal(values.get('godot-forge-learner-id'), 'existing-student-123');
});

test('all HTML pages use Godot Forge and load storage compatibility before application scripts', async () => {
  const root = new URL('../../', import.meta.url);
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const html = await readFile(new URL(`${entry.name}/index.html`, root), 'utf8').catch(() => null);
    if (!html) continue;
    assert.doesNotMatch(html, /pixel\s*forge/i, entry.name);
    assert.match(html, /Godot Forge/, entry.name);
    assert.ok(html.indexOf('/brand-storage.js') < html.indexOf('</head>'), entry.name);
  }
});
