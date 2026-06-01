/**
 * customizer.js — 3D background customizer control logic
 * 
 * Manages slider inputs, toggle switches, preset color selectors,
 * and passes the settings down to the active Three.js background.
 */

import { config, updateConfig } from './three-bg.js';

const STORAGE_KEY = 'portfolio-3d-config';

const DEFAULTS = {
  particleCount: 1500,
  largeParticleCount: 40,
  connectionDistance: 120,
  maxConnections: 80,
  mouseRadius: 150,
  mouseForce: 0.8,
  speedMultiplier: 1.0,
  showLines: true,
  interactionMode: 'repel',
  paletteName: 'emerald'
};

export function initCustomizer() {
  const customizer = document.getElementById('bg-customizer');
  const toggle = document.getElementById('customizer-toggle');
  const panel = document.getElementById('customizer-panel');
  if (!customizer || !toggle || !panel) return;

  // DOM Inputs
  const inputCount = document.getElementById('custom-count');
  const valCount = document.getElementById('val-count');
  
  const inputSpeed = document.getElementById('custom-speed');
  const valSpeed = document.getElementById('val-speed');
  
  const inputLines = document.getElementById('custom-lines');
  const sectionLinesDist = document.getElementById('section-lines-dist');
  const inputLinesDist = document.getElementById('custom-lines-dist');
  const valLinesDist = document.getElementById('val-lines-dist');
  
  const inputInteraction = document.getElementById('custom-interaction');
  const sectionRadius = document.getElementById('section-radius');
  const inputRadius = document.getElementById('custom-radius');
  const valRadius = document.getElementById('val-radius');
  
  const presetBtns = document.querySelectorAll('.preset-btn');
  const resetBtn = document.getElementById('customizer-reset');

  // Toggle Panel visibility
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('active') && !customizer.contains(e.target)) {
      panel.classList.remove('active');
      toggle.classList.remove('active');
    }
  });

  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Save config to storage
  function saveToStorage() {
    const dataToSave = {
      particleCount: config.particleCount,
      largeParticleCount: config.largeParticleCount,
      connectionDistance: config.connectionDistance,
      maxConnections: config.maxConnections,
      mouseRadius: config.mouseRadius,
      mouseForce: config.mouseForce,
      speedMultiplier: config.speedMultiplier,
      showLines: config.showLines,
      interactionMode: config.interactionMode,
      paletteName: config.paletteName
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }

  // Load from storage
  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        updateConfig(parsed);
      } catch (err) {
        console.error('[Customizer] Error parsing stored config:', err);
      }
    }
  }

  // Synchronize inputs with current config
  function syncUI() {
    // Count
    if (inputCount && valCount) {
      inputCount.value = config.particleCount;
      valCount.textContent = config.particleCount;
    }

    // Speed
    if (inputSpeed && valSpeed) {
      inputSpeed.value = config.speedMultiplier;
      valSpeed.textContent = config.speedMultiplier.toFixed(1) + 'x';
    }

    // Lines
    if (inputLines) {
      inputLines.checked = config.showLines;
      if (sectionLinesDist) {
        sectionLinesDist.style.display = config.showLines ? '' : 'none';
      }
    }
    if (inputLinesDist && valLinesDist) {
      inputLinesDist.value = config.connectionDistance;
      valLinesDist.textContent = config.connectionDistance + 'px';
    }

    // Interaction
    if (inputInteraction) {
      inputInteraction.value = config.interactionMode;
      if (sectionRadius) {
        sectionRadius.style.display = config.interactionMode !== 'none' ? '' : 'none';
      }
    }
    if (inputRadius && valRadius) {
      inputRadius.value = config.mouseRadius;
      valRadius.textContent = config.mouseRadius + 'px';
    }

    // Presets
    presetBtns.forEach((btn) => {
      if (btn.getAttribute('data-preset') === config.paletteName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Attach Event Listeners ---

  // Density (Recreates buffer, update on release/change to avoid slider lag)
  if (inputCount && valCount) {
    inputCount.addEventListener('input', () => {
      valCount.textContent = inputCount.value;
    });
    inputCount.addEventListener('change', () => {
      const val = parseInt(inputCount.value, 10);
      updateConfig({ particleCount: val });
      saveToStorage();
    });
  }

  // Speed
  if (inputSpeed && valSpeed) {
    inputSpeed.addEventListener('input', () => {
      const val = parseFloat(inputSpeed.value);
      valSpeed.textContent = val.toFixed(1) + 'x';
      updateConfig({ speedMultiplier: val });
      saveToStorage();
    });
  }

  // Lines
  if (inputLines) {
    inputLines.addEventListener('change', () => {
      const checked = inputLines.checked;
      if (sectionLinesDist) {
        sectionLinesDist.style.display = checked ? '' : 'none';
      }
      updateConfig({ showLines: checked });
      saveToStorage();
    });
  }

  // Lines Distance
  if (inputLinesDist && valLinesDist) {
    inputLinesDist.addEventListener('input', () => {
      const val = parseInt(inputLinesDist.value, 10);
      valLinesDist.textContent = val + 'px';
      // Max connections scale proportionally with distance to look good
      const maxConn = Math.round((val / 120) * 80);
      updateConfig({ 
        connectionDistance: val,
        maxConnections: maxConn
      });
      saveToStorage();
    });
  }

  // Interaction Mode
  if (inputInteraction) {
    inputInteraction.addEventListener('change', () => {
      const val = inputInteraction.value;
      if (sectionRadius) {
        sectionRadius.style.display = val !== 'none' ? '' : 'none';
      }
      updateConfig({ interactionMode: val });
      saveToStorage();
    });
  }

  // Radius
  if (inputRadius && valRadius) {
    inputRadius.addEventListener('input', () => {
      const val = parseInt(inputRadius.value, 10);
      valRadius.textContent = val + 'px';
      updateConfig({ mouseRadius: val });
      saveToStorage();
    });
  }

  // Color Presets
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.getAttribute('data-preset');
      updateConfig({ paletteName: preset });
      saveToStorage();
    });
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      updateConfig(DEFAULTS);
      syncUI();
    });
  }

  // Bootstrapping Customizer
  loadFromStorage();
  syncUI();
}
