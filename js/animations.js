/**
 * animations.js — GSAP + ScrollTrigger animations
 *
 * Handles all scroll-driven animations, navbar state, progress bar,
 * and smooth scrolling for anchor links.
 *
 * Exports: initAnimations()
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns true when the user prefers reduced motion.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Scroll Reveal ───────────────────────────────────────────────────────────

function setupScrollReveals() {
  const items = gsap.utils.toArray('.scroll-reveal');
  if (!items.length) return;

  gsap.from(items, {
    scrollTrigger: {
      trigger: items[0],
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
  });
}

// ─── Section Titles ──────────────────────────────────────────────────────────

function setupSectionTitles() {
  gsap.utils.toArray('.section-title').forEach((title) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(title, {
      x: -60,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    });

    // Animate the accent underline (::after pseudo via a child span if present)
    const accent = title.querySelector('.title-accent');
    if (accent) {
      tl.from(
        accent,
        {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3',
      );
    }
  });
}

// ─── Skill Bars ──────────────────────────────────────────────────────────────

function setupSkillBars() {
  gsap.utils.toArray('.skill-card__progress-bar').forEach((bar) => {
    const target = bar.getAttribute('data-width') + '%' || '0%';

    // Reset width to 0 initially
    gsap.set(bar, { width: '0%' });

    gsap.to(bar, {
      width: target,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ─── Timeline Items ──────────────────────────────────────────────────────────

function setupTimelineItems() {
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(item, {
      x: fromLeft ? -60 : 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ─── Project Cards ───────────────────────────────────────────────────────────

function setupProjectCards() {
  const cards = gsap.utils.toArray('.project-card');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 50,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: cards[0],
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ─── Profile Image ───────────────────────────────────────────────────────────

function setupProfileImage() {
  const img = document.querySelector('.profile-image-wrapper');
  if (!img) return;

  gsap.from(img, {
    scale: 0.8,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: img,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ─── Navbar scroll state ────────────────────────────────────────────────────

function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  ScrollTrigger.create({
    start: 50,
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    },
  });
}

// ─── Scroll progress bar ────────────────────────────────────────────────────

function setupScrollProgress() {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      document.documentElement.style.setProperty(
        '--scroll-progress',
        `${(self.progress * 100).toFixed(2)}%`,
      );
    },
  });
}

// ─── Smooth scroll for anchor links ──────────────────────────────────────────

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialise all GSAP-driven animations.
 * Skips animations when the user prefers reduced motion.
 */
export function initAnimations() {
  // Always set up non-animated features
  setupNavbarScroll();
  setupScrollProgress();
  setupSmoothScroll();

  // Bail on visual animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    // Make everything visible immediately
    gsap.utils.toArray('.scroll-reveal, .section-title, .timeline-item, .project-card, .profile-image-wrapper').forEach((el) => {
      gsap.set(el, { clearProps: 'all' });
    });
    gsap.utils.toArray('.skill-card__progress-bar').forEach((bar) => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
    return;
  }

  setupScrollReveals();
  setupSectionTitles();
  setupSkillBars();
  setupTimelineItems();
  setupProjectCards();
  setupProfileImage();
}
