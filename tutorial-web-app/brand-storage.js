// Copy legacy preferences before modules read the renamed product keys.
// Retain the old values for older tabs and never overwrite a new value.
(() => {
  try {
    for (const suffix of ['learner-id', 'locale', 'proxy-url']) {
      const key = `godot-forge-${suffix}`;
      const legacy = localStorage.getItem(`pixel-forge-${suffix}`);
      if (localStorage.getItem(key) === null && legacy !== null) localStorage.setItem(key, legacy);
    }
  } catch { /* Storage can be unavailable in restricted browser contexts. */ }
})();
