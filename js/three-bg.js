/**
 * three-bg.js — Interactive Three.js particle background
 *
 * Creates a full-viewport fixed canvas with drifting particles, mouse
 * interaction, and a network-line effect connecting nearby points.
 *
 * Exports: initParticles(), destroyParticles()
 */

import * as THREE from 'three';

// ─── Configuration ───────────────────────────────────────────────────────────

export const PRESETS = {
  emerald: {
    dark: { primary: 0x10b981, secondary: 0x14b8a6 },
    light: { primary: 0x059669, secondary: 0x0d9488 }
  },
  cyberpunk: {
    dark: { primary: 0xec4899, secondary: 0x8b5cf6 },
    light: { primary: 0xdb2777, secondary: 0x7c3aed }
  },
  ocean: {
    dark: { primary: 0x06b6d4, secondary: 0x3b82f6 },
    light: { primary: 0x0891b2, secondary: 0x2563eb }
  },
  fire: {
    dark: { primary: 0xf97316, secondary: 0xef4444 },
    light: { primary: 0xea580c, secondary: 0xdc2626 }
  },
  mono: {
    dark: { primary: 0x9ca3af, secondary: 0x4b5563 },
    light: { primary: 0x6b7280, secondary: 0x374151 }
  }
};

export const config = {
  particleCount: 1500,
  largeParticleCount: 40,
  connectionDistance: 120,
  maxConnections: 80,
  mouseRadius: 150,
  mouseForce: 0.8,
  speedMultiplier: 1.0,
  showLines: true,
  interactionMode: 'repel', // 'repel' | 'attract' | 'none'
  paletteName: 'emerald'
};

// ─── Module state ────────────────────────────────────────────────────────────

let renderer, scene, camera;
let particlesMesh, largeParticlesMesh, linesMesh;
let velocities = [];
let largeVelocities = [];
let mouse = new THREE.Vector2(9999, 9999); // offscreen initially
let rafId = null;
let canvas = null;
let currentPalette = PRESETS.emerald.dark;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function resolvePalette() {
  const theme = getTheme();
  const preset = PRESETS[config.paletteName] || PRESETS.emerald;
  return preset[theme];
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ─── Particle creation ──────────────────────────────────────────────────────

function createParticles() {
  // --- Small particles ---
  const count = config.particleCount;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  velocities = [];

  const palette = currentPalette;
  const col1 = new THREE.Color(palette.primary);
  const col2 = new THREE.Color(palette.secondary);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = randomRange(-window.innerWidth / 2, window.innerWidth / 2);
    positions[i3 + 1] = randomRange(-window.innerHeight / 2, window.innerHeight / 2);
    positions[i3 + 2] = randomRange(-200, 200);

    sizes[i] = randomRange(1.0, 3.0);

    // Mix between primary & secondary
    const mix = Math.random();
    const c = col1.clone().lerp(col2, mix);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    velocities.push({
      x: randomRange(-0.15, 0.15),
      y: randomRange(-0.15, 0.15),
      z: randomRange(-0.02, 0.02),
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false,
  });

  particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // --- Large particles (depth effect) ---
  const lgCount = config.largeParticleCount;
  const lgPositions = new Float32Array(lgCount * 3);
  const lgColors = new Float32Array(lgCount * 3);
  largeVelocities = [];

  for (let i = 0; i < lgCount; i++) {
    const i3 = i * 3;
    lgPositions[i3] = randomRange(-window.innerWidth / 2, window.innerWidth / 2);
    lgPositions[i3 + 1] = randomRange(-window.innerHeight / 2, window.innerHeight / 2);
    lgPositions[i3 + 2] = randomRange(-50, 50);

    const c = col1.clone().lerp(col2, Math.random());
    lgColors[i3] = c.r;
    lgColors[i3 + 1] = c.g;
    lgColors[i3 + 2] = c.b;

    largeVelocities.push({
      x: randomRange(-0.05, 0.05),
      y: randomRange(-0.05, 0.05),
      z: 0,
    });
  }

  const lgGeometry = new THREE.BufferGeometry();
  lgGeometry.setAttribute('position', new THREE.BufferAttribute(lgPositions, 3));
  lgGeometry.setAttribute('color', new THREE.BufferAttribute(lgColors, 3));

  const lgMaterial = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
    depthWrite: false,
  });

  largeParticlesMesh = new THREE.Points(lgGeometry, lgMaterial);
  scene.add(largeParticlesMesh);

  // --- Lines geometry (re-built every frame) ---
  const lineGeometry = new THREE.BufferGeometry();
  // Pre-allocate buffer for max connections (2 vertices per segment)
  const linePositions = new Float32Array(config.maxConnections * 6);
  const lineColors = new Float32Array(config.maxConnections * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  lineGeometry.setDrawRange(0, 0);

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });

  linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(linesMesh);
}

// ─── Update colours on theme change ──────────────────────────────────────────

function updateColors() {
  const palette = currentPalette;
  const col1 = new THREE.Color(palette.primary);
  const col2 = new THREE.Color(palette.secondary);

  // Small particles
  const count = config.particleCount;
  const colors = particlesMesh.geometry.attributes.color.array;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const mix = Math.random();
    const c = col1.clone().lerp(col2, mix);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }
  particlesMesh.geometry.attributes.color.needsUpdate = true;

  // Large particles
  const lgCount = config.largeParticleCount;
  const lgColors = largeParticlesMesh.geometry.attributes.color.array;
  for (let i = 0; i < lgCount; i++) {
    const i3 = i * 3;
    const c = col1.clone().lerp(col2, Math.random());
    lgColors[i3] = c.r;
    lgColors[i3 + 1] = c.g;
    lgColors[i3 + 2] = c.b;
  }
  largeParticlesMesh.geometry.attributes.color.needsUpdate = true;
}

// ─── Animation loop ──────────────────────────────────────────────────────────

function animate() {
  rafId = requestAnimationFrame(animate);

  const hw = window.innerWidth / 2;
  const hh = window.innerHeight / 2;
  const positions = particlesMesh.geometry.attributes.position.array;
  const count = config.particleCount;

  // Move & wrap small particles + mouse interaction
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const vel = velocities[i];
    if (!vel) continue;

    positions[i3] += vel.x * config.speedMultiplier;
    positions[i3 + 1] += vel.y * config.speedMultiplier;
    positions[i3 + 2] += vel.z * config.speedMultiplier;

    // Wrap around viewport edges (with margin)
    if (positions[i3] > hw + 50) positions[i3] = -hw - 50;
    if (positions[i3] < -hw - 50) positions[i3] = hw + 50;
    if (positions[i3 + 1] > hh + 50) positions[i3 + 1] = -hh - 50;
    if (positions[i3 + 1] < -hh - 50) positions[i3 + 1] = hh + 50;

    // Mouse interaction (repel / attract)
    if (config.interactionMode !== 'none') {
      const dx = positions[i3] - mouse.x;
      const dy = positions[i3 + 1] - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.mouseRadius && dist > 0) {
        const force = (config.mouseRadius - dist) / config.mouseRadius * config.mouseForce;
        const dirX = dx / dist;
        const dirY = dy / dist;

        if (config.interactionMode === 'repel') {
          positions[i3] += dirX * force;
          positions[i3 + 1] += dirY * force;
        } else if (config.interactionMode === 'attract') {
          positions[i3] -= dirX * force;
          positions[i3 + 1] -= dirY * force;
        }
      }
    }
  }
  particlesMesh.geometry.attributes.position.needsUpdate = true;

  // Move large particles (slower)
  const lgCount = config.largeParticleCount;
  const lgPos = largeParticlesMesh.geometry.attributes.position.array;
  for (let i = 0; i < lgCount; i++) {
    const i3 = i * 3;
    const vel = largeVelocities[i];
    if (!vel) continue;

    lgPos[i3] += vel.x * config.speedMultiplier;
    lgPos[i3 + 1] += vel.y * config.speedMultiplier;

    if (lgPos[i3] > hw + 50) lgPos[i3] = -hw - 50;
    if (lgPos[i3] < -hw - 50) lgPos[i3] = hw + 50;
    if (lgPos[i3 + 1] > hh + 50) lgPos[i3 + 1] = -hh - 50;
    if (lgPos[i3 + 1] < -hh - 50) lgPos[i3 + 1] = hh + 50;
  }
  largeParticlesMesh.geometry.attributes.position.needsUpdate = true;

  // --- Update connection lines ---
  if (config.showLines) {
    linesMesh.visible = true;
    updateLines(positions);
  } else {
    linesMesh.visible = false;
  }

  renderer.render(scene, camera);
}

/**
 * Rebuild line segments between nearby particles.
 * We use a spatial "stripe" approach — sort by X, then only check
 * neighbours within range, which avoids O(n²) comparisons.
 */
function updateLines(positions) {
  const linePos = linesMesh.geometry.attributes.position.array;
  const lineCol = linesMesh.geometry.attributes.color.array;
  let segCount = 0;

  const col = new THREE.Color(currentPalette.primary);
  const count = config.particleCount;
  const maxConn = config.maxConnections;
  const connDist = config.connectionDistance;

  // Simple brute-force with early exit for performance
  // We only check a subset of particles to keep it fast
  const step = Math.max(1, Math.floor(count / 500)); // sample ~500 particles

  for (let i = 0; i < count && segCount < maxConn; i += step) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];

    for (let j = i + step; j < count && segCount < maxConn; j += step) {
      const bx = positions[j * 3];
      const by = positions[j * 3 + 1];

      const dx = ax - bx;
      const dy = ay - by;
      const distSq = dx * dx + dy * dy;

      if (distSq < connDist * connDist) {
        const idx = segCount * 6;
        const dist = Math.sqrt(distSq);
        const alpha = 1 - dist / connDist;

        linePos[idx] = ax;
        linePos[idx + 1] = ay;
        linePos[idx + 2] = 0;
        linePos[idx + 3] = bx;
        linePos[idx + 4] = by;
        linePos[idx + 5] = 0;

        // Fade colour with distance
        lineCol[idx] = col.r * alpha;
        lineCol[idx + 1] = col.g * alpha;
        lineCol[idx + 2] = col.b * alpha;
        lineCol[idx + 3] = col.r * alpha;
        lineCol[idx + 4] = col.g * alpha;
        lineCol[idx + 5] = col.b * alpha;

        segCount++;
      }
    }
  }

  linesMesh.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.attributes.color.needsUpdate = true;
  linesMesh.geometry.setDrawRange(0, segCount * 2);
}

// ─── Event handlers ──────────────────────────────────────────────────────────

function onMouseMove(e) {
  // Convert screen coords to scene coords (centered origin)
  mouse.x = e.clientX - window.innerWidth / 2;
  mouse.y = -(e.clientY - window.innerHeight / 2);
}

function onResize() {
  if (!renderer || !camera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}

function onThemeChange(e) {
  const theme = e?.detail?.theme ?? getTheme();
  currentPalette = resolvePalette();
  if (particlesMesh) updateColors();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Recreate particles geometry and material buffer when density config changes.
 */
export function recreateParticles() {
  if (!scene) return;

  if (particlesMesh) {
    scene.remove(particlesMesh);
    particlesMesh.geometry.dispose();
    particlesMesh.material.dispose();
  }
  if (largeParticlesMesh) {
    scene.remove(largeParticlesMesh);
    largeParticlesMesh.geometry.dispose();
    largeParticlesMesh.material.dispose();
  }
  if (linesMesh) {
    scene.remove(linesMesh);
    linesMesh.geometry.dispose();
    linesMesh.material.dispose();
  }

  createParticles();
}

/**
 * Apply configuration updates and selectively recreate or update colors
 */
export function updateConfig(newConfig) {
  const oldVal = {
    count: config.particleCount,
    maxConn: config.maxConnections,
    palette: config.paletteName
  };

  Object.assign(config, newConfig);

  const needsRecreate =
    config.particleCount !== oldVal.count ||
    config.maxConnections !== oldVal.maxConn;

  const needsColorUpdate = config.paletteName !== oldVal.palette;

  if (needsRecreate) {
    recreateParticles();
  } else if (needsColorUpdate) {
    currentPalette = resolvePalette();
    if (particlesMesh) updateColors();
  }
}

/**
 * Bootstrap the Three.js particle scene.
 */
export function initParticles() {
  // Create canvas
  canvas = document.createElement('canvas');
  canvas.id = 'three-bg';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orthographic camera (2D-ish, particles in screen space)
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);
  camera.position.z = 500;

  scene = new THREE.Scene();

  // Set palette
  currentPalette = resolvePalette();

  // Build particles
  createParticles();

  // Listeners
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('themechange', onThemeChange);

  // Also watch data-theme via MutationObserver as a fallback
  const observer = new MutationObserver(() => {
    currentPalette = resolvePalette();
    if (particlesMesh) updateColors();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Start rendering
  animate();
}

/**
 * Tear everything down (useful for HMR / SPA transitions).
 */
export function destroyParticles() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('themechange', onThemeChange);

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }

  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
    canvas = null;
  }

  scene = null;
  camera = null;
  particlesMesh = null;
  largeParticlesMesh = null;
  linesMesh = null;
  velocities = [];
  largeVelocities = [];
}
