// Reset one module's learner state. Generated files remain in the asset library.
(() => {
  const copy = {
    en: { reset: 'RESET MODULE', resetCurrent: 'RESET THIS MODULE', confirm: 'CONFIRM RESET', warning: 'Click again to reset only this module’s progress and current work. Saved artwork stays in the library.' },
    zh: { reset: '重置模块', resetCurrent: '重置当前模块', confirm: '确认重置', warning: '再次点击只会重置当前模块的进度和工作内容；已保存的图片仍会保留。' },
    ms: { reset: 'SET SEMULA MODUL', resetCurrent: 'SET SEMULA MODUL INI', confirm: 'SAHKAN SET SEMULA', warning: 'Klik sekali lagi untuk set semula kemajuan dan kerja modul ini sahaja. Karya yang disimpan kekal dalam pustaka.' },
  };
  const currentSlug = document.body.dataset.module || location.pathname.split('/')[1] || '';
  const originalFetch = window.fetch.bind(window);
  const pendingWrites = new Map();
  let resettingSlug = null;

  // Finish earlier checkpoint and completion saves before resetting. Ignore
  // later writes from the old page until it reloads.
  window.fetch = (...args) => {
    const [input, init] = args;
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    const match = url.origin === location.origin && (method === 'PUT' || method === 'PATCH')
      ? url.pathname.match(/^\/api\/modules\/([^/]+)\/(checkpoint|progress)$/)
      : null;
    if (!match || (match[2] === 'checkpoint' ? method !== 'PUT' : method !== 'PATCH')) return originalFetch(...args);
    const slug = decodeURIComponent(match[1]);
    if (slug === resettingSlug) return Promise.resolve(new Response('{"saved":false,"resetting":true}', { status: 200, headers: { 'content-type': 'application/json' } }));
    const request = originalFetch(...args);
    if (!pendingWrites.has(slug)) pendingWrites.set(slug, new Set());
    const pending = pendingWrites.get(slug);
    pending.add(request);
    request.then(() => pending.delete(request), () => pending.delete(request));
    return request;
  };

  function clearModuleStorage(slug, id) {
    const keys = {
      'game-controls': ['godot-forge-gamepad-mapping'],
      'game-settings': ['godot-forge-music', 'godot-forge-sound'],
      'game-ending-cutscene': ['godot-forge-ending-cutscene-choice'],
      'marketplace-system': [`godot-forge-marketplace:${id}`],
    }[slug] || [];
    keys.forEach(key => localStorage.removeItem(key));
  }
  const language = () => {
    const locale = localStorage.getItem('godot-forge-locale');
    return copy[locale] ? locale : 'en';
  };
  const learnerId = () => {
    const key = 'godot-forge-learner-id';
    let value = localStorage.getItem(key);
    if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); }
    return value;
  };

  document.addEventListener('click', async event => {
    const button = event.target.closest('.reset-module-button');
    if (!button || button.disabled) return;
    const slug = button.dataset.module;
    if (!slug) return;
    event.preventDefault();
    if (button.dataset.confirming !== 'true') {
      button.dataset.confirming = 'true';
      button.textContent = copy[language()].confirm;
      window.showToast?.(copy[language()].warning);
      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => {
        button.dataset.confirming = 'false';
        button.textContent = slug === currentSlug ? copy[language()].resetCurrent : copy[language()].reset;
      }, 8000);
      return;
    }
    clearTimeout(button.resetTimer);
    button.disabled = true;
    resettingSlug = slug;
    let reloading = false;
    try {
      await Promise.allSettled([...(pendingWrites.get(slug) || [])]);
      const id = learnerId();
      const response = await fetch(`/api/modules/${encodeURIComponent(slug)}/reset`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId: id }),
      });
      if (!response.ok) return;
      clearModuleStorage(slug, id);
      if (slug === currentSlug && !document.querySelector('#module-grid')) {
        reloading = true;
        location.reload();
        return;
      }
      window.dispatchEvent(new CustomEvent('godot-forge-module-reset', { detail: { slug } }));
    } catch {
      // The shared fetch wrapper displays the network error toast.
    } finally {
      if (!reloading) resettingSlug = null;
      button.disabled = false;
      button.dataset.confirming = 'false';
      button.textContent = slug === currentSlug ? copy[language()].resetCurrent : copy[language()].reset;
    }
  });

  const slug = document.body.dataset.module || location.pathname.split('/')[1];
  const header = document.querySelector('.module-header, .module-overview > header');
  if (slug && header) {
    const button = document.createElement('button');
    button.id = 'reset-module';
    button.className = 'reset-module-button';
    button.type = 'button';
    button.dataset.module = slug;
    button.textContent = copy[language()].resetCurrent;
    const home = header.querySelector('.home-mark');
    if (home) home.before(button);
    else header.append(button);
    new MutationObserver(() => {
      if (button.dataset.confirming !== 'true') button.textContent = copy[language()].resetCurrent;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
})();
