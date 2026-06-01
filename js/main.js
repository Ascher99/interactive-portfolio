/**
 * main.js — Application entry point
 *
 * Imports stylesheets (Vite handles CSS imports), bootstraps every
 * module, and wires up remaining UI event listeners.
 */

// ─── Styles ──────────────────────────────────────────────────────────────────

import '../style/index.css';
import '../style/layout.css';
import '../style/components.css';
import '../style/animations.css';

// ─── Modules ─────────────────────────────────────────────────────────────────

import { initLoader } from './loader.js';
import { initTheme, toggleTheme } from './theme.js';
import { initLanguage, setLanguage, getCurrentLang } from './i18n.js';
import { initParticles } from './three-bg.js';
import { initTyped } from './typed.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './contact.js';
import { initCustomizer } from './customizer.js';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  /* 1 */ initLoader();
  /* 2 */ initTheme();
  /* 3 */ initLanguage();
  /* 4 */ initParticles();
  /* 5 */ setupTypedEffect();
  /* 6 */ initAnimations();
  /* 7 */ initContactForm();
  /* 8 */ setupHamburgerToggle();
  /* 9 */ setupProjectFilters();
  /* 10 */ setupSmoothScrollLinks();
  /* 11 */ setupLanguageToggle();
  /* 12 */ setupThemeToggle();
  /* 13 */ setupActiveNavHighlight();
  /* 14 */ initCustomizer();
});

// ─── Typed effect ────────────────────────────────────────────────────────────

function setupTypedEffect() {
  const el = document.getElementById('typed-output');
  if (!el) return;

  initTyped(el, [
    'Frontend Developer',
    'React Specialist',
    'TypeScript Enthusiast',
    'UI/UX Lover',
  ]);
}

// ─── Mobile hamburger menu ───────────────────────────────────────────────────

function setupHamburgerToggle() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar__links');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close mobile menu when any nav link is clicked
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// ─── Project filter buttons ──────────────────────────────────────────────────

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const tags = card.getAttribute('data-tags') || '';

        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = '';
          // Re-trigger entrance animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ─── Smooth scroll for anchor links ──────────────────────────────────────────

function setupSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetEl = document.querySelector(link.getAttribute('href'));
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Language toggle ─────────────────────────────────────────────────────────

function setupLanguageToggle() {
  const btn = document.querySelector('.lang-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = getCurrentLang() === 'pl' ? 'en' : 'pl';
    setLanguage(next);
  });
}

// ─── Theme toggle ────────────────────────────────────────────────────────────

function setupThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', toggleTheme);
}

// ─── Active nav link highlighting ────────────────────────────────────────────

function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.navbar__links a[href^="#"]');
  if (!sections.length || !navLinksAll.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksAll.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`,
            );
          });
        }
      });
    },
    {
      // Trigger when the top ~30% of a section is visible
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
}
