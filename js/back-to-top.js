/**
 * back-to-top.js — Floating back to top button with SVG scroll progress indicator
 */

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const circle = document.getElementById('back-to-top-circle');
  if (!btn || !circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  // Set SVG dash properties
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) return;

    // Show button after scrolling down 300px
    if (scrollTop > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    // Calculate progress percentage (0 to 1)
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = `${offset}`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // Initial execution

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
