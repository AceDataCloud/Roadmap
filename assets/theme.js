(() => {
  const THEME_KEY = 'theme';
  const COOKIE_KEY = 'THEME';

  const readCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
  };

  const normalizeTheme = (value) => (value === 'dark' ? 'dark' : value === 'light' ? 'light' : '');

  const getPreferredTheme = () => {
    const cookieTheme = normalizeTheme(readCookie(COOKIE_KEY));
    if (cookieTheme) return cookieTheme;

    try {
      const stored = normalizeTheme(localStorage.getItem(THEME_KEY));
      if (stored) return stored;
    } catch (_err) {}

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
  };

  const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  const applyTheme = (theme, { persist } = { persist: true }) => {
    const next = normalizeTheme(theme) || 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.dataset.theme = next;

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_err) {}
      try {
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(next)}; path=/; max-age=31536000; samesite=lax`;
      } catch (_err) {}
    }

    document.dispatchEvent(new CustomEvent('ace:themechange', { detail: { theme: next } }));
  };

  const setTheme = (theme) => applyTheme(theme, { persist: true });
  const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

  window.AceRoadmapTheme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme
  };

  // Apply saved theme (or system preference) and persist immediately
  applyTheme(getPreferredTheme(), { persist: true });

  // Sync across tabs: when another tab changes the theme in localStorage, apply here too
  try {
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        const synced = normalizeTheme(e.newValue);
        if (synced && synced !== getTheme()) {
          applyTheme(synced, { persist: false });
        }
      }
    });
  } catch (_err) {}
})();

