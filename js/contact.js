/**
 * contact.js — Contact form handler
 *
 * Validates input, submits to Formspree, and provides user feedback.
 * Replace the FORMSPREE_ENDPOINT with your real Formspree form ID.
 *
 * Exports: initContactForm()
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_ID';

// Simple email regex — strict enough for UX validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Show a transient status message below the form.
 * @param {HTMLFormElement} form
 * @param {string}  text
 * @param {'success'|'error'} type
 */
function showMessage(form, text, type = 'success') {
  // Remove any previous message
  const prev = form.parentElement.querySelector('.form-message');
  if (prev) prev.remove();

  const msg = document.createElement('div');
  msg.className = `form-message form-message--${type}`;
  msg.textContent = text;
  form.insertAdjacentElement('afterend', msg);

  // Auto-remove after 5 seconds
  setTimeout(() => msg.remove(), 5000);
}

/**
 * Set the submit button into loading / idle state.
 * @param {HTMLButtonElement} btn
 * @param {boolean} loading
 */
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;
    btn.classList.add('btn--loading');
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
    btn.classList.remove('btn--loading');
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Attach the submit handler to the contact form.
 */
export function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) {
    console.warn('[contact] #contact-form not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameField = form.querySelector('[name="name"]');
    const emailField = form.querySelector('[name="email"]');
    const messageField = form.querySelector('[name="message"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // ── Validation ─────────────────────────────────────────────────────────
    const name = nameField?.value.trim() ?? '';
    const email = emailField?.value.trim() ?? '';
    const message = messageField?.value.trim() ?? '';

    if (!name || !email || !message) {
      showMessage(form, 'Please fill in all fields.', 'error');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // ── Submit ─────────────────────────────────────────────────────────────
    setLoading(submitBtn, true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        // Use the i18n success string if available, else fallback
        const successText =
          document.querySelector('[data-i18n="contact.success"]')?.textContent ||
          'Message sent!';
        showMessage(form, successText, 'success');
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const errText =
          data?.errors?.map((err) => err.message).join(', ') ||
          'Something went wrong. Please try again.';
        showMessage(form, errText, 'error');
      }
    } catch (err) {
      console.error('[contact] Submission failed:', err);
      showMessage(form, 'Network error. Please try again later.', 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  });
}
