/**
 * i18n.js — Internationalization module (PL / EN)
 *
 * Exports:
 *   translations  – raw translation data
 *   setLanguage() – switch language & update DOM
 *   getCurrentLang()
 *   initLanguage() – read stored preference & apply
 */

// ─── Translation Data ────────────────────────────────────────────────────────

export const translations = {
  pl: {
    // Navigation
    'nav.about': 'O mnie',
    'nav.skills': 'Umiejętności',
    'nav.experience': 'Doświadczenie',
    'nav.projects': 'Projekty',
    'nav.education': 'Edukacja',
    'nav.contact': 'Kontakt',

    // Hero
    'hero.greeting': 'Cześć, jestem',
    'hero.name': 'Vu Minh Grzegorczyk',
    'hero.cta_projects': 'Zobacz projekty',
    'hero.cta_cv': 'Pobierz CV',

    // About
    'about.title': 'O mnie',
    'about.bio':
      'Pasjonat technologii webowych i ambitny programista, który solidne fundamenty informatyczne zdobyte w C++, C# i MySQL przekuł w profesjonalną specjalizację we Frontend Developmencie. Obecnie koncentruję się na budowaniu nowoczesnych, skalowalnych aplikacji webowych z wykorzystaniem biblioteki React oraz języka TypeScript. Moje podejście łączy analityczne myślenie wyniesione z języków niskopoziomowych z dbałością o estetykę i responsywność interfejsów tworzonych w HTML i CSS. Stale rozwijam swoje umiejętności w ekosystemie JavaScript, stawiając na czysty kod, nowoczesne wzorce projektowe i efektywne zarządzanie stanem aplikacji, aby dostarczać użytkownikom rozwiązania najwyższej klasy.',
    'about.location': 'Szczecin / Poznań, Polska',
    'about.status': 'Student / Inżynier',
    'about.experience_label': 'Doświadczenie',
    'about.experience_value': 'Frontend Developer',

    // Skills
    'skills.title': 'Umiejętności',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.tools': 'Narzędzia',
    'skills.soft': 'Umiejętności miękkie',

    // Experience
    'experience.title': 'Doświadczenie',
    'experience.theeventa.role': 'Frontend Developer',
    'experience.theeventa.company': 'TheEventa',
    'experience.theeventa.period': '04.2025 – obecnie',
    'experience.theeventa.desc1':
      'Projektowanie i implementacja warstwy frontendowej w React + TypeScript',
    'experience.theeventa.desc2':
      'Wsparcie procesów backendowych i administracja baz danych MySQL',
    'experience.theeventa.desc3':
      'Modelowanie architektury systemów i dokumentacja techniczna',
    'experience.theeventa.desc4':
      'Optymalizacja algorytmów i praca z Git, Agile/Jira',

    // Projects
    'projects.title': 'Projekty',
    'projects.filter_all': 'Wszystkie',
    'projects.prediction.title': 'Platforma predykcji wyników sportowych',
    'projects.prediction.desc':
      'Aplikacja full-stack wykorzystująca modele ML do prognozowania wyników meczów piłkarskich dla 10 lig europejskich. Zautomatyzowany potok ETL, inżynieria cech i responsywny interfejs z rozkładem prawdopodobieństwa w czasie rzeczywistym.',
    'projects.portfolio.title': 'Portfolio',
    'projects.portfolio.desc':
      'Responsywna strona portfolio z nowoczesnym designem, animacjami i interaktywnym tłem 3D.',

    // Education
    'education.title': 'Edukacja',
    'education.cdv.name': 'Collegium Da Vinci',
    'education.cdv.degree': 'Studia inżynierskie — Informatyka',
    'education.cdv.period': '2023 – 2026',
    'education.uam.name': 'Uniwersytet im. Adama Mickiewicza',
    'education.uam.degree': 'Technologie Komputerowe',
    'education.uam.period': '2022 – 2023',
    'education.liceum.name': 'IX Liceum Ogólnokształcące w Szczecinie',
    'education.liceum.period': '2019 – 2022',

    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Porozmawiajmy!',
    'contact.name': 'Imię',
    'contact.email': 'Email',
    'contact.message': 'Wiadomość',
    'contact.send': 'Wyślij',
    'contact.success': 'Wiadomość wysłana!',

    // Footer
    'footer.made': 'Stworzone z',
    'footer.by': 'przez Vu Minh Grzegorczyk',
  },

  en: {
    // Navigation
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.education': 'Education',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': "Hi, I'm",
    'hero.name': 'Vu Minh Grzegorczyk',
    'hero.cta_projects': 'View Projects',
    'hero.cta_cv': 'Download CV',

    // About
    'about.title': 'About Me',
    'about.bio':
      'A passionate web technology enthusiast and ambitious developer who transformed solid computer science foundations gained through C++, C#, and MySQL into a professional specialization in Frontend Development. Currently focused on building modern, scalable web applications using React and TypeScript. My approach combines analytical thinking from low-level languages with attention to aesthetics and responsiveness of interfaces crafted in HTML and CSS. I continuously develop my skills in the JavaScript ecosystem, emphasizing clean code, modern design patterns, and effective state management to deliver top-tier solutions.',
    'about.location': 'Szczecin / Poznań, Poland',
    'about.status': 'Student / Engineer',
    'about.experience_label': 'Experience',
    'about.experience_value': 'Frontend Developer',

    // Skills
    'skills.title': 'Skills',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.tools': 'Tools',
    'skills.soft': 'Soft Skills',

    // Experience
    'experience.title': 'Experience',
    'experience.theeventa.role': 'Frontend Developer',
    'experience.theeventa.company': 'TheEventa',
    'experience.theeventa.period': '04.2025 – Present',
    'experience.theeventa.desc1':
      'Design and implementation of the frontend layer in React + TypeScript',
    'experience.theeventa.desc2':
      'Backend process support and MySQL database administration',
    'experience.theeventa.desc3':
      'System architecture modeling and technical documentation',
    'experience.theeventa.desc4':
      'Algorithm optimization and work with Git, Agile/Jira',

    // Projects
    'projects.title': 'Projects',
    'projects.filter_all': 'All',
    'projects.prediction.title': 'Sports Prediction Platform',
    'projects.prediction.desc':
      'Full-stack application using ML models to predict football match outcomes for 10 European leagues. Automated ETL pipeline, feature engineering, and responsive interface with real-time probability distribution.',
    'projects.portfolio.title': 'Portfolio',
    'projects.portfolio.desc':
      'Responsive portfolio website with modern design, animations, and interactive 3D background.',

    // Education
    'education.title': 'Education',
    'education.cdv.name': 'Collegium Da Vinci',
    'education.cdv.degree': 'B.Eng. — Computer Science',
    'education.cdv.period': '2023 – 2026',
    'education.uam.name': 'Adam Mickiewicz University',
    'education.uam.degree': 'Computer Technologies',
    'education.uam.period': '2022 – 2023',
    'education.liceum.name': 'IX High School in Szczecin',
    'education.liceum.period': '2019 – 2022',

    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': "Let's talk!",
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.success': 'Message sent!',

    // Footer
    'footer.made': 'Made with',
    'footer.by': 'by Vu Minh Grzegorczyk',
  },
};

// ─── State ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-lang';
let currentLang = 'pl';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Return the active language code ('pl' | 'en').
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Switch language and update every element that carries a [data-i18n] attribute.
 * Elements may use:
 *   data-i18n="key"              → sets textContent
 *   data-i18n-placeholder="key"  → sets placeholder attribute
 *   data-i18n-aria="key"         → sets aria-label attribute
 *
 * @param {'pl'|'en'} lang
 */
export function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`[i18n] Unknown language: "${lang}"`);
    return;
  }

  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.setAttribute('lang', lang);

  const dict = translations[lang];

  // Update text content
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update placeholders (inputs, textareas)
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  // Update the toggle button label (if present)
  const toggleBtn = document.querySelector('.lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = lang === 'pl' ? 'EN' : 'PL';
  }

  // Update CV download link based on language
  const cvLink = document.getElementById('cv-download');
  if (cvLink) {
    cvLink.href = lang === 'pl'
      ? '/assets/cv/CV_Vu_Minh_Grzegorczyk_PL.pdf'
      : '/assets/cv/CV_Vu_Minh_Grzegorczyk_ENG.pdf';
  }

  // Dispatch a custom event so other modules can react
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

/**
 * Bootstrap: read saved preference (or default to 'pl') and apply.
 */
export function initLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const lang = stored && translations[stored] ? stored : 'pl';
  setLanguage(lang);
}
