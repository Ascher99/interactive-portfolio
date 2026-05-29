/**
 * theme.js — Dark / Light mode toggle
 *
 * Stores the preference in localStorage and applies a `data-theme`
 * attribute on <html> so CSS custom-properties can switch palettes.
 *
 * Exports: initTheme(), toggleTheme()
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-theme';
const DARK = 'dark';
const LIGHT = 'light';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Apply the given theme string to the document and update the toggle button.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Update toggle button icon (emoji-based for simplicity)
  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.textContent = theme === DARK ? '☀️' : '🌙';
    btn.setAttribute(
      'aria-label',
      theme === DARK ? 'Switch to light mode' : 'Switch to dark mode',
    );
  }

  // Dispatch event so other modules (e.g. three-bg) can react
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialise theme on page load.
 * Priority: localStorage → OS preference → default dark.
 */
export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);

  let theme;
  if (stored === DARK || stored === LIGHT) {
    theme = stored;
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    theme = LIGHT;
  } else {
    theme = DARK;
  }

  applyTheme(theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Toggle between dark ↔ light and persist.
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === DARK ? LIGHT : DARK;

  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}
