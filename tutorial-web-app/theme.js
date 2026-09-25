// Shared site-wide theme preference for the landing page and all learning modules.
(() => {
  const storageKey = "godot-forge-theme";
  const labels = {
    en: { light: "Switch to light mode", dark: "Switch to dark mode" },
    zh: { light: "切换到浅色模式", dark: "切换到深色模式" },
    ms: { light: "Tukar kepada mod cerah", dark: "Tukar kepada mod gelap" },
  };

  let theme;
  try {
    theme = localStorage.getItem(storageKey);
  } catch {
    theme = null;
  }
  theme = theme === "light" ? "light" : "dark";

  function currentLocale() {
    try {
      const saved = localStorage.getItem("godot-forge-locale");
      if (labels[saved]) return saved;
    } catch { /* Use the document language when storage is unavailable. */ }
    const language = document.documentElement.lang.slice(0, 2);
    return labels[language] ? language : "en";
  }

  function updateButton(button) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const label = labels[currentLocale()][nextTheme];
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.dataset.theme = theme;
    button.textContent = theme === "dark" ? "☼" : "◐";
  }

  function applyTheme() {
    document.body.dataset.theme = theme;
    document.body.classList.toggle("dark-theme", theme === "dark");
    const button = document.querySelector("#theme-toggle");
    if (button) updateButton(button);
  }

  function mountToggle() {
    const header = document.querySelector("header");
    if (!header) return;
    let button = document.querySelector("#theme-toggle");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "theme-toggle";
      button.className = "theme-toggle";
      button.textContent = "◐";
      const languageGroup = header.querySelector("#languages, #language-toggle, .language-toggle");
      if (languageGroup) languageGroup.after(button);
      else header.append(button);
    }
    updateButton(button);
    button.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, theme); } catch { /* Theme still works for this page. */ }
      applyTheme();
    });
  }

  applyTheme();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle, { once: true });
  } else {
    mountToggle();
  }
  document.addEventListener("click", event => {
    if (!event.target.closest("#languages button[data-locale], #language-toggle button[data-locale]")) return;
    window.setTimeout(() => {
      const button = document.querySelector("#theme-toggle");
      if (button) updateButton(button);
    }, 0);
  });

  window.GodotForgeTheme = {
    get: () => theme,
    set: nextTheme => {
      if (nextTheme !== "light" && nextTheme !== "dark") return;
      theme = nextTheme;
      try { localStorage.setItem(storageKey, theme); } catch { /* Theme still works for this page. */ }
      applyTheme();
    },
    toggle: () => {
      theme = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, theme); } catch { /* Theme still works for this page. */ }
      applyTheme();
    },
  };
})();
