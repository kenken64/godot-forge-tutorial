// Shared, accessible action feedback for the landing page and every module.
(() => {
  const visible = [];
  let host;
  const moduleSlug = location.pathname.split('/').filter(Boolean)[0] || '';
  const isQuizPage = location.pathname.includes('/math-stem-physics-quiz/');
  const quizMessages = {
    en: { answer: 'Answer checked.', progress: 'Module progress saved.', choice: 'Page selected.', language: 'Language changed.', retry: 'Quiz restarted.', page: 'Quiz page changed.', completing: 'Updating module progress…' },
    zh: { answer: '答案已检查。', progress: '模块进度已保存。', choice: '已选择页面。', language: '语言已切换。', retry: '测验已重新开始。', page: '测验页面已切换。', completing: '正在更新模块进度…' },
    ms: { answer: 'Jawapan telah disemak.', progress: 'Kemajuan modul telah disimpan.', choice: 'Halaman dipilih.', language: 'Bahasa telah ditukar.', retry: 'Kuiz dimulakan semula.', page: 'Halaman kuiz telah ditukar.', completing: 'Mengemas kini kemajuan modul…' },
  };
  const quizCopy = () => quizMessages[localStorage.getItem('godot-forge-locale')] || quizMessages.en;
  function ensureHost() {
    if (host) return host;
    host = document.createElement('div');
    host.id = 'godot-forge-toasts';
    host.className = 'toast-stack';
    host.setAttribute('aria-label', 'Action messages');
    document.body.append(host);
    return host;
  }
  function toast(message, type = 'info') {
    if (!message) return;
    ensureHost();
    const item = document.createElement('div');
    item.className = `action-toast action-toast--${type}`;
    item.setAttribute('role', type === 'error' ? 'alert' : 'status');
    item.textContent = String(message);
    host.append(item);
    visible.push(item);
    while (visible.length > 3) visible.shift().remove();
    const timer = window.setTimeout(() => { item.remove(); const index = visible.indexOf(item); if (index >= 0) visible.splice(index, 1); }, type === 'error' ? 6500 : 4000);
    item.addEventListener('click', () => { window.clearTimeout(timer); item.remove(); const index = visible.indexOf(item); if (index >= 0) visible.splice(index, 1); }, { once: true });
  }
  window.showToast = toast;

  function requestAction(path, method) {
    if (method === 'GET' || path.includes('/checkpoint')) return null;
    if (path === '/api/assets/publish') return 'PNG and coordinates JSON saved to Final Game.';
    if (path === '/api/characters') return 'Character and coordinates JSON saved to Final Game.';
    if (/^\/api\/modules\/[^/]+\/reset$/.test(path)) return 'Module reset. Generated artwork remains in the library.';
    if (/^\/api\/modules\/[^/]+\/progress$/.test(path)) return isQuizPage ? quizCopy().progress : 'Module progress saved.';
    if (path === '/api/assets/generate') return 'Game asset sheet generated and saved.';
    if (path === '/api/bosses/repair') return 'Boss animations repaired and saved.';
    if (path === '/api/bosses/generate') return 'Boss reference generated and saved.';
    if (path === '/api/sprites/generate') return 'Character sprite sheet generated and saved.';
    if (path === '/api/assets' && method === 'POST') return 'Asset saved to the library.';
    if (/^\/api\/quizzes\/[^/]+\/answer$/.test(path)) return isQuizPage ? quizCopy().answer : 'Answer checked.';
    return null;
  }
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const [input, init] = args;
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    const message = url.origin === location.origin ? requestAction(url.pathname, method) : null;
    try {
      const response = await originalFetch(...args);
      if (message) {
        if (response.ok) toast(message, 'success');
        else {
          const details = await response.clone().json().catch(() => ({}));
          toast(details.error?.message || details.error || `Action failed (${response.status}).`, 'error');
        }
      }
      return response;
    } catch (error) {
      if (message) toast(error?.message || 'Could not reach the server.', 'error');
      throw error;
    }
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled || button.matches('.reset-module-button')) return;
    const id = button.id;
    if (isQuizPage && id === 'retry') return; // The quiz provides its own localized two-click reset feedback.
    const label = button.textContent.trim().replace(/\s+/g, ' ');
    const isChoice = button.matches('.choice-button');
    const category = button.dataset.category;
    const locale = button.dataset.locale;
    const isCompletion = button.matches('.complete-button');
    const isSubmit = button.type === 'submit';
    const hadDirection = ['READY', 'RESUMED'].includes(document.querySelector('#direction-status')?.textContent.trim());
    const hadCharacterSheet = document.querySelector('#save-character')?.disabled === false;
    window.setTimeout(() => {
      if (button.dataset.confirming === 'true') return toast('Click again to confirm replacement.');
      if (isChoice || category) return toast(isQuizPage ? quizCopy().choice : `${label} selected.`);
      if (locale) return toast(isQuizPage ? quizCopy().language : `Language changed to ${label}.`);
      if (id === 'play-animation' || id === 'play-boss-animation') return toast(button.textContent.trim() === 'PAUSE' ? 'Animation playing.' : 'Animation paused.');
      if (id === 'copy-prompt') return toast('Copying the prompt…');
      if (id === 'load-template') {
        const selects = { 'character-creation': '#character-template', 'game-assets-creation': '#asset-template', 'boss-creation': '#boss-template' };
        if (!selects[moduleSlug] || !document.querySelector(selects[moduleSlug])?.value) return;
        const message = { 'character-creation': 'Character template loaded.', 'game-assets-creation': 'Asset template ready.', 'boss-creation': 'Boss template ready.' }[moduleSlug];
        return toast(message);
      }
      if (id === 'preview-template') return toast('Template preview opened.');
      if (id === 'theme-toggle') {
        const locale = localStorage.getItem('godot-forge-locale') || 'en';
        const messages = {
          en: `Display theme changed to ${button.dataset.theme || 'dark'} mode.`,
          zh: `显示主题已切换为${button.dataset.theme === 'light' ? '浅色' : '深色'}模式。`,
          ms: `Tema paparan ditukar kepada mod ${button.dataset.theme === 'light' ? 'cerah' : 'gelap'}.`,
        };
        return toast(messages[locale] || messages.en);
      }
      if (id === 'menu-toggle') return toast(document.querySelector('.sidebar')?.classList.contains('open') ? 'Navigation opened.' : 'Navigation closed.');
      if (id === 'build-direction') {
        if (moduleSlug === 'boss-creation') return toast(hadDirection ? 'Using saved boss direction.' : 'Forging boss direction…');
        if (moduleSlug === 'game-assets-creation') return toast(hadDirection ? 'Using saved asset direction.' : 'Building asset direction…');
        return;
      }
      if (id === 'build-character') return toast(hadCharacterSheet ? 'Using saved character sprite sheet.' : 'Creating character and sprite sheet…');
      if (id === 'generate-asset' || id === 'generate-boss' || id === 'create-sprite') return toast('Generating artwork…');
      if (id === 'repair-boss-animations') return toast('Repairing boss animations…');
      if (id.startsWith('save-') || id === 'save-character') return toast('Saving…');
      if (id === 'complete-module' || id === 'complete') return toast(isQuizPage ? quizCopy().completing : 'Updating module progress…');
      if (id === 'retry') return toast(isQuizPage ? quizCopy().retry : 'Quiz restarted.');
      if (id === 'previous-page' || id === 'next-page' || button.dataset.quizPage !== undefined) return toast(isQuizPage ? quizCopy().page : 'Quiz page changed.');
      if (id === 'test-attack') return toast('Attack preview playing.');
      if (id === 'test-death') return toast('Death preview playing.');
      if (id === 'reset-pose') return toast('Pose reset.');
      if (isCompletion) return toast('Updating module progress…');
      if (isSubmit) return toast('Answer submitted.');
      if (label) toast(`${label} selected.`);
    }, 0);
  }, true);
})();
