(() => {
  'use strict';

  const STORAGE_KEY = 'jsb_a11y';
  const defaults = {
    fontScale: 100,
    highContrast: false,
    grayscale: false,
    reduceMotion: false,
  };

  let state = { ...defaults };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...defaults, ...JSON.parse(raw) };
  } catch {}

  const widget = document.createElement('div');
  widget.className = 'a11y-widget';
  widget.id = 'a11yWidget';
  widget.innerHTML = `
    <button type="button" class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="Abrir acessibilidade">🤟</button>
    <div class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="false" aria-label="Acessibilidade">
      <p class="a11y-title">Acessibilidade</p>
      <div class="a11y-row">
        <span>Fonte</span>
        <div class="a11y-actions">
          <button type="button" class="a11y-btn" id="a11yFontMinus" title="Fonte menor">A-</button>
          <button type="button" class="a11y-btn" id="a11yFontReset" title="Fonte padrão">100%</button>
          <button type="button" class="a11y-btn" id="a11yFontPlus" title="Fonte maior">A+</button>
        </div>
      </div>
      <div class="a11y-row">
        <span>Alto contraste</span>
        <button type="button" class="a11y-switch" id="a11yContrast" aria-pressed="false">Desativado</button>
      </div>
      <div class="a11y-row">
        <span>Escala de cinza</span>
        <button type="button" class="a11y-switch" id="a11yGrayscale" aria-pressed="false">Desativado</button>
      </div>
      <div class="a11y-row">
        <span>Reduzir movimento</span>
        <button type="button" class="a11y-switch" id="a11yMotion" aria-pressed="false">Desativado</button>
      </div>
    </div>
  `;
  const dock = document.getElementById('accessibilityDock');
  (dock || document.body).prepend(widget);

  const toggle = document.getElementById('a11yToggle');
  const panel = document.getElementById('a11yPanel');
  const minus = document.getElementById('a11yFontMinus');
  const plus = document.getElementById('a11yFontPlus');
  const reset = document.getElementById('a11yFontReset');
  const contrast = document.getElementById('a11yContrast');
  const grayscale = document.getElementById('a11yGrayscale');
  const motion = document.getElementById('a11yMotion');

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  };

  function updateSwitch(btn, on) {
    if (!btn) return;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'Ativado' : 'Desativado';
  }

  function apply() {
    document.documentElement.style.fontSize = `${clamp(state.fontScale, 85, 130)}%`;
    document.body.classList.toggle('a11y-high-contrast', !!state.highContrast);
    document.documentElement.classList.toggle('a11y-grayscale', !!state.grayscale);
    document.documentElement.classList.toggle('a11y-reduce-motion', !!state.reduceMotion);
    updateSwitch(contrast, !!state.highContrast);
    updateSwitch(grayscale, !!state.grayscale);
    updateSwitch(motion, !!state.reduceMotion);
  }

  function closePanel() {
    widget.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir acessibilidade');
  }

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = widget.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar acessibilidade' : 'Abrir acessibilidade');
  });

  panel?.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => closePanel());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  minus?.addEventListener('click', () => { state.fontScale = clamp(state.fontScale - 10, 85, 130); save(); apply(); });
  plus?.addEventListener('click', () => { state.fontScale = clamp(state.fontScale + 10, 85, 130); save(); apply(); });
  reset?.addEventListener('click', () => { state.fontScale = 100; save(); apply(); });
  contrast?.addEventListener('click', () => { state.highContrast = !state.highContrast; save(); apply(); });
  grayscale?.addEventListener('click', () => { state.grayscale = !state.grayscale; save(); apply(); });
  motion?.addEventListener('click', () => { state.reduceMotion = !state.reduceMotion; save(); apply(); });

  apply();
})();
