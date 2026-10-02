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
    <button type="button" class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="Abrir acessibilidade"><span class="a11y-toggle-icon" aria-hidden="true">🤟</span><span class="a11y-toggle-label">Acessibilidade</span></button>
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

  document.querySelectorAll('[vw]').forEach((el) => {
    el.hidden = true;
  });

  function vlibrasAccess() {
    const root = document.getElementById('vlibras-access-wrapper')?.shadowRoot;
    return root ? root.querySelector('#vlibras-access') : null;
  }

  function placeVlibras() {
    const access = vlibrasAccess();
    if (!access || !dock) return;
    const r = dock.getBoundingClientRect();
    const gap = 8;
    const groupWidth = 274;
    const height = 56;
    const fits = r.right + gap + groupWidth <= window.innerWidth - 12;
    const left = fits ? r.right + gap : r.left;
    const top = fits ? r.top + (r.height - height) / 2 : r.top - height - gap;
    access.style.left = `${Math.round(left)}px`;
    access.style.top = `${Math.round(Math.max(8, top))}px`;
  }

  function joinVlibrasButtons() {
    const wrapper = document.getElementById('vlibras-access-wrapper');
    const root = wrapper && wrapper.shadowRoot;
    if (!root) return false;
    if (!root.getElementById('vlibras-join')) {
      const style = document.createElement('style');
      style.id = 'vlibras-join';
      style.textContent = `
        #vlibras-access {
          position: fixed !important;
          right: auto !important;
          bottom: auto !important;
          width: auto !important;
          height: 56px !important;
          gap: 8px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          transition: none !important;
          z-index: 2147483639 !important;
        }
        #vlibras-popup {
          display: block !important;
          position: relative !important;
          width: 210px !important;
          height: 56px !important;
          max-width: none !important;
          object-fit: fill !important;
          border-radius: 14px !important;
          flex: 0 0 auto !important;
        }
        #vlibras-button {
          position: relative !important;
          inset: auto !important;
          right: auto !important;
          width: 56px !important;
          height: 56px !important;
          flex: 0 0 56px !important;
          border-radius: 14px !important;
        }
        #vlibras-button img {
          display: block !important;
          width: 56px !important;
          height: 56px !important;
        }
      `;
      root.appendChild(style);
    }
    placeVlibras();
    return true;
  }

  if (!joinVlibrasButtons()) {
    const started = Date.now();
    const timer = setInterval(() => {
      if (joinVlibrasButtons() || Date.now() - started > 8000) clearInterval(timer);
    }, 100);
  }
  window.addEventListener('resize', placeVlibras);

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
