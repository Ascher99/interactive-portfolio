/**
 * typed.js — Typewriter text effect
 *
 * Types each string character-by-character, pauses, then deletes it
 * before moving to the next string. Loops infinitely.
 *
 * Exports: initTyped(element, strings)
 */

// ─── Default timing (ms) ────────────────────────────────────────────────────

const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 500;

// ─── State ───────────────────────────────────────────────────────────────────

let animationFrameId = null;

// ─── Core loop ───────────────────────────────────────────────────────────────

/**
 * Start the typewriter effect on the given element.
 *
 * @param {HTMLElement} element  — target element whose textContent will update
 * @param {string[]}    strings — phrases to cycle through
 * @param {object}      [opts]  — optional speed overrides
 */
export function initTyped(
  element,
  strings = [
    'Frontend Developer',
    'React Specialist',
    'TypeScript Enthusiast',
    'UI/UX Lover',
  ],
  opts = {},
) {
  if (!element) {
    console.warn('[typed] Target element not found');
    return;
  }

  const typeSpeed = opts.typeSpeed ?? TYPE_SPEED;
  const deleteSpeed = opts.deleteSpeed ?? DELETE_SPEED;
  const pauseAfterType = opts.pauseAfterType ?? PAUSE_AFTER_TYPE;
  const pauseAfterDelete = opts.pauseAfterDelete ?? PAUSE_AFTER_DELETE;

  let stringIndex = 0; // which string we're on
  let charIndex = 0; // how many chars are visible
  let isDeleting = false;

  // Ensure the cursor element exists right after the target
  let cursor = element.parentElement?.querySelector('.typed-cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.classList.add('typed-cursor');
    cursor.textContent = '|';
    element.insertAdjacentElement('afterend', cursor);
  }

  function tick() {
    const current = strings[stringIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      element.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        // Full string typed — pause, then start deleting
        isDeleting = true;
        animationFrameId = setTimeout(tick, pauseAfterType);
        return;
      }

      animationFrameId = setTimeout(tick, typeSpeed);
    } else {
      // Deleting backward
      charIndex--;
      element.textContent = current.substring(0, charIndex);

      if (charIndex === 0) {
        // Done deleting — move to next string
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        animationFrameId = setTimeout(tick, pauseAfterDelete);
        return;
      }

      animationFrameId = setTimeout(tick, deleteSpeed);
    }
  }

  // Kick off
  tick();
}

/**
 * Stop the typewriter loop (useful for cleanup).
 */
export function destroyTyped() {
  if (animationFrameId) {
    clearTimeout(animationFrameId);
    animationFrameId = null;
  }
}
