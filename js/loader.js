/**
 * loader.js — Loading screen with VMG initials animation
 *
 * Shows a full-screen loader with animated initials and a progress bar.
 * Progress accelerates to 90 % quickly, waits for window.onload, then
 * fills to 100 % before fading out and removing the element.
 *
 * Exports: initLoader()
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const FAST_DURATION = 800; // ms to reach 90 %
const FINAL_DURATION = 400; // ms to go 90→100 %
const FADE_DURATION = 600; // ms for the CSS fade-out transition

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Kick off the loading screen sequence.
 * Call this as early as possible (before other initialisations).
 */
export function initLoader() {
  const loader = document.querySelector('#loader');
  if (!loader) return;

  const progressBar = loader.querySelector('.loader-progress-bar');
  const initialsEl = loader.querySelector('.loader-initials');

  // Animate initials entrance (simple class toggle – CSS handles the rest)
  if (initialsEl) {
    requestAnimationFrame(() => initialsEl.classList.add('visible'));
  }

  // ── Progress animation ──────────────────────────────────────────────────

  let progress = 0;
  let startTime = performance.now();
  let windowLoaded = false;
  let reachedPause = false;

  // Listen for full page load
  if (document.readyState === 'complete') {
    windowLoaded = true;
  } else {
    window.addEventListener('load', () => {
      windowLoaded = true;
    });
  }

  function updateProgress(value) {
    progress = value;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  function tick(now) {
    if (!reachedPause) {
      // Phase 1: 0 → 90 % over FAST_DURATION
      const elapsed = now - startTime;
      const t = Math.min(elapsed / FAST_DURATION, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - t, 3);
      updateProgress(eased * 90);

      if (t >= 1) {
        reachedPause = true;
      }
    }

    if (reachedPause && windowLoaded) {
      // Phase 2: 90 → 100 %, then hide
      finishLoading();
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Finish sequence ─────────────────────────────────────────────────────

  function finishLoading() {
    const start = performance.now();

    function fillTick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / FINAL_DURATION, 1);
      updateProgress(90 + t * 10);

      if (t < 1) {
        requestAnimationFrame(fillTick);
      } else {
        // 100 % reached – fade out
        loader.classList.add('loaded');

        // Remove from DOM after CSS transition
        setTimeout(() => {
          loader.remove();
        }, FADE_DURATION);
      }
    }

    requestAnimationFrame(fillTick);
  }
}
