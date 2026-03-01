(() => {
  const THEME_KEY = 'theme';

  const normalizeTheme = (value) => (value === 'dark' ? 'dark' : value === 'light' ? 'light' : '');

  /* -- Read: try localStorage then sessionStorage then system preference -- */
  const readStored = () => {
    try {
      const v = normalizeTheme(localStorage.getItem(THEME_KEY));
      if (v) return v;
    } catch (_) {}
    try {
      const v = normalizeTheme(sessionStorage.getItem(THEME_KEY));
      if (v) return v;
    } catch (_) {}
    return '';
  };

  const getPreferredTheme = () => {
    const stored = readStored();
    if (stored) return stored;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
  };

  /* -- Write: persist to both localStorage AND sessionStorage -- */
  const persistTheme = (value) => {
    try { localStorage.setItem(THEME_KEY, value); } catch (_) {}
    try { sessionStorage.setItem(THEME_KEY, value); } catch (_) {}
  };

  const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  const applyTheme = (theme, persist) => {
    const next = normalizeTheme(theme) || 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.dataset.theme = next;
    if (persist) persistTheme(next);
    document.dispatchEvent(new CustomEvent('ace:themechange', { detail: { theme: next } }));
  };

  const setTheme = (theme) => applyTheme(theme, true);
  const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

  window.AceRoadmapTheme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme
  };

  /* Apply stored theme (or system preference) and always persist */
  applyTheme(getPreferredTheme(), true);

  /* Sync across tabs via the storage event */
  try {
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        const synced = normalizeTheme(e.newValue);
        if (synced && synced !== getTheme()) applyTheme(synced, false);
      }
    });
  } catch (_) {}
})();
