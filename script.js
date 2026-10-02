(function () {
  'use strict';

  /* ========== Idioma / navbar ========== */
  const langPtBrButtons = document.querySelectorAll('.js-lang-ptbr');
  const langEnUsButtons = document.querySelectorAll('.js-lang-enus');
  const langEsEsButtons = document.querySelectorAll('.js-lang-eses');
  const LANG_KEY = 'jsb_lang';
  const PT_BR = 'pt-BR';
  const EN_US = 'en-US';
  const ES_ES = 'es-ES';
  const getCurrentLang = () => localStorage.getItem(LANG_KEY) || PT_BR;

  const setText = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
  const setHtml = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
  const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };

  const applyNavI18n = (labels) => {
    const navHome = document.querySelector('#navLinks > li:nth-child(1) > a');
    const navProject = document.querySelector('#navLinks > li:nth-child(2) > a');
    const navAccess = document.querySelector('#navLinks > li:nth-child(3) > .nav-link-trigger');
    if (navHome) navHome.textContent = labels.home;
    if (navProject) navProject.textContent = labels.project;
    if (navAccess) navAccess.textContent = labels.access;
    const projectSub = document.querySelectorAll('#navLinks > li:nth-child(2) .nav-submenu a');
    labels.projectSub.forEach((txt, i) => { if (projectSub[i]) projectSub[i].textContent = txt; });
    const accessSub = document.querySelectorAll('#navLinks > li:nth-child(3) .nav-submenu a');
    labels.accessSub.forEach((txt, i) => { if (accessSub[i]) accessSub[i].textContent = txt; });
  };

  const applyPtBr = () => {
    document.documentElement.lang = PT_BR;
    localStorage.setItem(LANG_KEY, PT_BR);
  };
  const applyEnUs = () => {
    document.documentElement.lang = EN_US;
    localStorage.setItem(LANG_KEY, EN_US);
    if (document.body.classList.contains('page-noticias')) {
      document.title = 'News — REACT Project';
    } else if (document.body.classList.contains('page-home')) {
      document.title = 'REACT Project — Transforming Schools into Spaces of Peace';
    }
    setHtml('.logo-text', 'Project <strong>REACT</strong>');
    setAttr('.js-lang-ptbr', 'title', 'Change language to Portuguese (Brazil)');
    setAttr('.js-lang-enus', 'title', 'Switch language to English (US)');
    setAttr('.js-lang-eses', 'title', 'Cambiar idioma a Español (España)');
    setAttr('.js-lang-ptbr', 'alt', 'Brazil Flag');
    setAttr('.js-lang-enus', 'alt', 'United States Flag');
    setAttr('.js-lang-eses', 'alt', 'Spain Flag');
    applyNavI18n({
      home: 'Home',
      project: 'About the Project',
      omb: 'Report',
      access: 'Access',
      projectSub: ['About', 'News', 'Educational Content', 'Data'],
      accessSub: ['Track protocol', 'Administrative access', 'School access', 'Training']
    });
    setText('.hero-badge-text', 'NATIONAL INCLUSION AND PREVENTION PROGRAM');
    setText('.hero-under-title', 'Youth Against Bullying');
    setText('.hero-subtitle', 'A platform that connects families, schools and the support network to promote inclusion, prevent situations of violence and organize each stage of protecting children and adolescents.');
    setHtml('.hero-desc', 'Education, technology and legal support against bullying, under <strong>Law No. 14,811/2024</strong>.');
    const heroBtns = document.querySelectorAll('.hero-actions a');
    if (heroBtns[0]) heroBtns[0].innerHTML = 'Meet the Platform <span aria-hidden="true">→</span>';
    if (heroBtns[1]) heroBtns[1].textContent = 'File a Report';
    document.querySelectorAll('.stat-label').forEach((el, i) => {
      const labels = ['Commitment to support', 'Active support channel', 'National legal basis'];
      if (labels[i]) el.textContent = labels[i];
    });
    setAttr('.hero-scroll', 'aria-label', 'Scroll to the footer');
    setAttr('.news-ticker', 'aria-label', 'Featured news');
    setText('.news-ticker-label', '📰 LATEST NEWS');
    setText('#noticias .section-tag', 'Real-time updates');
    setHtml('#noticias .section-title', 'News about <span class="text-gradient-react">bullying and cyberbullying</span>');
    setText('#noticias .section-desc', 'We only display news about bullying and cyberbullying from trusted and verifiable sources.');
    setAttr('#newsSearchInput', 'placeholder', 'Search trusted sources (e.g.: school bullying, cyberbullying, law 14.811)');
    setText('#newsSearchBtn', 'Search');
    const filters = document.querySelectorAll('.news-filter');
    if (filters[0]) filters[0].textContent = '📰 School Bullying';
    if (filters[1]) filters[1].textContent = '📱 Cyberbullying';
    if (filters[2]) filters[2].textContent = '📌 Cases in Brazil';
    setText('#loadMoreNews', 'Load more news');
    setText('.section-cta h2', 'Let us build a safer school together');
    setText('.section-cta p', 'Access the official channel for reports, protocol follow-up, and prevention guidance.');
    setText('.section-cta .cta-actions a:nth-child(1)', 'Go to Ombudsman');
    setText('.section-cta .cta-actions a:nth-child(2)', 'About the Project');
    setText('.footer-about p', 'Education, support and protection in school environments with technology.');
    const footerLinks = document.querySelectorAll('.footer-links');
    if (footerLinks[0]) {
      const items = footerLinks[0].querySelectorAll('li a');
      footerLinks[0].querySelector('h4').textContent = 'Portal';
      if (items[0]) items[0].textContent = 'Home';
      if (items[1]) items[1].textContent = 'News';
      if (items[2]) items[2].textContent = 'Data';
    }
    if (footerLinks[1]) {
      const items = footerLinks[1].querySelectorAll('li a');
      footerLinks[1].querySelector('h4').textContent = 'Sections';
      if (items[0]) items[0].textContent = 'About the Project';
      if (items[1]) items[1].textContent = 'Educational Content';
      if (items[2]) items[2].textContent = 'School Ombudsman';
      if (items[3]) items[3].textContent = 'Admin Login';
    }
    setText('.footer-contact h4', 'Institutional contact');
    setText('.footer-contact p:nth-child(2)', 'E-mail: contato@juventudesembullying.org');
    setText('.footer-contact p:nth-child(3)', 'Support line: 0800 000 000');
    setText('.footer-bottom p:nth-child(1)', '© 2026 REACT Project — All rights reserved.');
    setText('.footer-bottom p:nth-child(2)', 'According to Law No. 14,811/2024 guidelines.');
  };

  const applyEsEs = () => {
    document.documentElement.lang = ES_ES;
    localStorage.setItem(LANG_KEY, ES_ES);
    if (document.body.classList.contains('page-noticias')) {
      document.title = 'Noticias — Proyecto REACT';
    } else if (document.body.classList.contains('page-home')) {
      document.title = 'Proyecto REACT — Transformando escuelas en espacios de paz';
    }
    setHtml('.logo-text', 'Proyecto <strong>REACT</strong>');
    setAttr('.js-lang-ptbr', 'title', 'Cambiar idioma a Portugués (Brasil)');
    setAttr('.js-lang-enus', 'title', 'Switch language to English (US)');
    setAttr('.js-lang-eses', 'title', 'Cambiar idioma a Español (España)');
    setAttr('.js-lang-ptbr', 'alt', 'Bandera de Brasil');
    setAttr('.js-lang-enus', 'alt', 'Bandera de Estados Unidos');
    setAttr('.js-lang-eses', 'alt', 'Bandera de España');
    applyNavI18n({
      home: 'Página Inicial',
      project: 'Conoce el Proyecto',
      omb: 'Denuncia',
      access: 'Acceso',
      projectSub: ['Acerca de', 'Noticias', 'Contenido Educativo', 'Datos'],
      accessSub: ['Consultar protocolo', 'Acceso administrativo', 'Acceso escuelas', 'Capacitaciones']
    });
    setText('.hero-badge-text', 'PROGRAMA NACIONAL DE INCLUSIÓN Y PREVENCIÓN');
    setText('.hero-under-title', 'Juventud Contra el Bullying');
    setText('.hero-subtitle', 'Una plataforma que conecta familias, escuelas y la red de apoyo para promover la inclusión, prevenir situaciones de violencia y organizar cada etapa de la protección de niños y adolescentes.');
    setHtml('.hero-desc', 'Educación, tecnología y apoyo legal contra el bullying, conforme a la <strong>Ley N.º 14.811/2024</strong>.');
    const heroBtns = document.querySelectorAll('.hero-actions a');
    if (heroBtns[0]) heroBtns[0].innerHTML = 'Conoce la Plataforma <span aria-hidden="true">→</span>';
    if (heroBtns[1]) heroBtns[1].textContent = 'Hacer una denuncia';
    document.querySelectorAll('.stat-label').forEach((el, i) => {
      const labels = ['Compromiso con la acogida', 'Canal de apoyo activo', 'Base legal nacional'];
      if (labels[i]) el.textContent = labels[i];
    });
    setAttr('.hero-scroll', 'aria-label', 'Desplazarse al pie de página');
    setAttr('.news-ticker', 'aria-label', 'Noticias destacadas');
    setText('.news-ticker-label', '📰 ÚLTIMAS NOTICIAS');
    setText('#noticias .section-tag', 'Actualizaciones en tiempo real');
    setHtml('#noticias .section-title', 'Noticias sobre <span class="text-gradient-react">bullying y ciberbullying</span>');
    setText('#noticias .section-desc', 'Mostramos solo noticias sobre bullying y ciberbullying de fuentes confiables y verificables.');
    setAttr('#newsSearchInput', 'placeholder', 'Buscar en fuentes confiables (ej.: bullying escolar, ciberbullying, ley 14.811)');
    setText('#newsSearchBtn', 'Buscar');
    const filters = document.querySelectorAll('.news-filter');
    if (filters[0]) filters[0].textContent = '📰 Bullying escolar';
    if (filters[1]) filters[1].textContent = '📱 Ciberbullying';
    if (filters[2]) filters[2].textContent = '📌 Casos en Brasil';
    setText('#loadMoreNews', 'Cargar más noticias');
    setText('.section-cta h2', 'Construyamos juntos una escuela más segura');
    setText('.section-cta p', 'Accede al canal oficial para denuncias, seguimiento de protocolos y orientaciones de prevención.');
    setText('.section-cta .cta-actions a:nth-child(1)', 'Ir a Defensoría');
    setText('.section-cta .cta-actions a:nth-child(2)', 'Conocer el Proyecto');
    setText('.footer-about p', 'Educación, acogida y protección en el entorno escolar con apoyo de la tecnología.');
    const footerLinks = document.querySelectorAll('.footer-links');
    if (footerLinks[0]) {
      const items = footerLinks[0].querySelectorAll('li a');
      footerLinks[0].querySelector('h4').textContent = 'Portal';
      if (items[0]) items[0].textContent = 'Inicio';
      if (items[1]) items[1].textContent = 'Noticias';
      if (items[2]) items[2].textContent = 'Datos';
    }
    if (footerLinks[1]) {
      const items = footerLinks[1].querySelectorAll('li a');
      footerLinks[1].querySelector('h4').textContent = 'Secciones';
      if (items[0]) items[0].textContent = 'Conoce el Proyecto';
      if (items[1]) items[1].textContent = 'Contenido Educativo';
      if (items[2]) items[2].textContent = 'Defensoría Escolar';
      if (items[3]) items[3].textContent = 'Acceso Administrativo';
    }
    setText('.footer-contact h4', 'Contacto institucional');
    setText('.footer-contact p:nth-child(2)', 'Correo: contato@juventudesembullying.org');
    setText('.footer-contact p:nth-child(3)', 'Canal de apoyo: 0800 000 000');
    setText('.footer-bottom p:nth-child(1)', '© 2026 Proyecto REACT — Todos los derechos reservados.');
    setText('.footer-bottom p:nth-child(2)', 'Conforme a las directrices de la Ley N.º 14.811/2024.');
  };

  const storedLang = localStorage.getItem(LANG_KEY) || PT_BR;
  if (storedLang === EN_US) applyEnUs();
  else if (storedLang === ES_ES) applyEsEs();
  else applyPtBr();

  langPtBrButtons.forEach((el) => {
    const handler = (e) => {
      e.preventDefault();
      applyPtBr();
      window.location.reload();
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handler(e);
    });
  });
  langEnUsButtons.forEach((el) => {
    const handler = (e) => {
      e.preventDefault();
      localStorage.setItem(LANG_KEY, EN_US);
      window.location.reload();
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handler(e);
    });
  });
  langEsEsButtons.forEach((el) => {
    const handler = (e) => {
      e.preventDefault();
      localStorage.setItem(LANG_KEY, ES_ES);
      window.location.reload();
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handler(e);
    });
  });

  /* ========== Stats counter ========== */
  const animateCounters = () => {
    const nums = document.querySelectorAll('.stat-number[data-target], .dado-number[data-target]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.target);
        if (Number.isNaN(target)) return;
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const dur = 1500;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = target * eased;
          el.textContent = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    nums.forEach((n) => obs.observe(n));
  };
  animateCounters();

  /* ========== Fade in on scroll ========== */
  document.querySelectorAll('.section-header, .about-card, .dado-card, .news-card').forEach((el) => {
    el.classList.add('fade-in');
  });
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-in').forEach((el) => fadeObs.observe(el));

  /* ========== Hero particles (canvas) ========== */
  const canvas = document.getElementById('heroParticles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, particles = [];
    const colors = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399'];

    function resize() {
      const hero = canvas.closest('.hero');
      if (!hero) return;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const n = Math.min(55, Math.floor((w * h) / 18000));
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 0.5,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: Math.random() * 0.5 + 0.15
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 100) {
            ctx.strokeStyle = 'rgba(167,139,250,' + (0.22 * (1 - d / 100)) + ')';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(tick);
  }

  /* ========== Notícias (RSS via proxy) ========== */
  const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const NEWS_SOURCES = [
    { name: 'G1', url: 'https://g1.globo.com/rss/g1/educacao/' },
    { name: 'Folha', url: 'https://feeds.folha.uol.com.br/folha/educacao/rss091.xml' },
    { name: 'UOL', url: 'https://rss.uol.com.br/feed/noticias.xml' },
    { name: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml' },
    { name: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br/rss/' }
  ];

  const KEYWORDS = [
    'bullying',
    'cyberbullying',
    'ciberbullying',
    'bulling'
  ];

  const SOURCE_INFO = {
    default: { color: '#6366f1', portal: '#' },
    'G1': { color: '#c4170c', portal: 'https://g1.globo.com' },
    'Folha': { color: '#7c3aed', portal: 'https://www.folha.uol.com.br' },
    'UOL': { color: '#ff7900', portal: 'https://www.uol.com.br' },
    'Agência Brasil': { color: '#059669', portal: 'https://agenciabrasil.ebc.com.br' },
    'CNN Brasil': { color: '#c1000f', portal: 'https://www.cnnbrasil.com.br' },
    'Google News': { color: '#4285f4', portal: 'https://news.google.com' },
    'Planalto': { color: '#1d4ed8', portal: 'https://www.planalto.gov.br' },
    'Gov.br': { color: '#1351b4', portal: 'https://www.gov.br' }
  };

  let allNewsItems = [];
  let displayedCount = 4;

  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  }

  function isRelevant(item, query) {
    const text = normalize([item.title, item.description, item.content].join(' '));
    const q = normalize(query || '');
    const qWords = q.split(/\s+/).filter(Boolean);
    const hitQuery = qWords.length === 0 || qWords.some((w) => text.includes(w));
    const hitBullying = KEYWORDS.some((k) => text.includes(normalize(k)));
    return hitQuery && hitBullying;
  }

  /** Imagens de apoio quando o feed não traz foto (rotação por índice) */
  const NEWS_PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop&q=75',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop&q=75',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop&q=75',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=500&fit=crop&q=75',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=500&fit=crop&q=75',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&q=75'
  ];

  function decodeEntities(str) {
    if (!str) return '';
    const t = document.createElement('textarea');
    t.innerHTML = str;
    return t.value;
  }

  function normalizeImageUrl(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let u = decodeEntities(raw).trim().replace(/\s/g, '');
    if (!u) return '';
    if (u.startsWith('//')) u = 'https:' + u;
    if (u.startsWith('http://')) u = 'https://' + u.slice(7);
    try {
      const parsed = new URL(u);
      if (!/^https?:$/i.test(parsed.protocol)) return '';
      u = parsed.href;
    } catch {
      return '';
    }
    const lower = u.toLowerCase();
    if (lower.includes('pixel') || lower.includes('1x1') || lower.includes('spacer') || lower.includes('blank.gif')) return '';
    if (lower.includes('favicon') || lower.includes('/icon/') || lower.endsWith('.ico')) return '';
    return u;
  }

  function scoreImageUrl(u) {
    if (!u) return -1;
    let s = 0;
    if (/\.(jpe?g|webp|png)(\?|$)/i.test(u)) s += 30;
    if (/large|medium|800|1024|1200|orig|full/i.test(u)) s += 15;
    if (/thumb|thumbnail|small|50x|64x|96x/i.test(u)) s -= 10;
    if (/logo|avatar|badge|emoji/i.test(u)) s -= 25;
    return s;
  }

  function extractUrlsFromHtml(html) {
    if (!html) return [];
    const out = [];
    const patterns = [
      /<img[^>]+src\s*=\s*["']([^"']+)["']/gi,
      /<img[^>]+data-src\s*=\s*["']([^"']+)["']/gi,
      /<img[^>]+data-original\s*=\s*["']([^"']+)["']/gi,
      /property\s*=\s*["']og:image["'][^>]*content\s*=\s*["']([^"']+)["']/gi,
      /content\s*=\s*["']([^"']+)["'][^>]*property\s*=\s*["']og:image["']/gi,
      /media:(?:thumbnail|content)\s+[^>]*url\s*=\s*["']([^"']+)["']/gi,
      /url\s*\(\s*["']?([^"')]+\.(jpe?g|png|webp)[^"')]*)["']?\s*\)/gi
    ];
    patterns.forEach((re) => {
      let m;
      const r = new RegExp(re.source, re.flags);
      while ((m = r.exec(html)) !== null) {
        const url = normalizeImageUrl(m[1]);
        if (url) out.push(url);
      }
    });
    return out;
  }

  function getRssThumbnailField(item) {
    const th = item.thumbnail;
    if (typeof th === 'string') return normalizeImageUrl(th);
    if (th && typeof th === 'object') {
      if (typeof th.url === 'string') return normalizeImageUrl(th.url);
      if (typeof th.link === 'string') return normalizeImageUrl(th.link);
    }
    return '';
  }

  function getEnclosureImage(item) {
    const enc = item.enclosure;
    if (!enc || !enc.link) return '';
    const type = (enc.type || '').toLowerCase();
    const link = normalizeImageUrl(enc.link);
    if (!link) return '';
    if (type.startsWith('image/')) return link;
    if (/\.(jpe?g|png|gif|webp)(\?|$)/i.test(link)) return link;
    return '';
  }

  function getItemImage(item) {
    const candidates = [];
    const t = getRssThumbnailField(item);
    if (t) candidates.push(t);
    const e = getEnclosureImage(item);
    if (e) candidates.push(e);
    const html = [item.description, item.content, item.contentSnippet].filter(Boolean).join('\n');
    extractUrlsFromHtml(html).forEach((u) => candidates.push(u));
    const uniq = [...new Set(candidates)];
    if (!uniq.length) return '';
    uniq.sort((a, b) => scoreImageUrl(b) - scoreImageUrl(a));
    return uniq[0];
  }

  function placeholderImageForIndex(index) {
    return NEWS_PLACEHOLDER_IMAGES[index % NEWS_PLACEHOLDER_IMAGES.length];
  }

  function getSourceInfo(name) {
    const n = name || '';
    const key = Object.keys(SOURCE_INFO).find((k) => k !== 'default' && n.includes(k));
    return { ...(SOURCE_INFO[key] || SOURCE_INFO.default), label: key || n || 'Notícias' };
  }

  function formatDate(pubDate) {
    try {
      const d = new Date(pubDate);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return ''; }
  }

  function stripHtml(html) {
    const t = document.createElement('div');
    t.innerHTML = html || '';
    return (t.textContent || '').replace(/\s+/g, ' ').trim();
  }

  async function fetchFromSource(source) {
    const url = RSS_PROXY + encodeURIComponent(source.url);
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];
    return data.items.map((it) => ({ ...it, sourceName: source.name }));
  }

  async function fetchGoogleNews(query) {
    const q = encodeURIComponent(query);
    const rssUrl = `https://news.google.com/rss/search?q=${q}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const url = RSS_PROXY + encodeURIComponent(rssUrl);
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];
    return data.items.map((it) => ({ ...it, sourceName: 'Google News' }));
  }

  function dedupe(items) {
    const seen = new Set();
    return items.filter((it) => {
      const k = normalize(it.title).slice(0, 80);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  function getFallbackNews() {
    return [
      { title: 'Lei 14.811/2024 — medidas contra violência e bullying nas escolas', link: 'https://www.planalto.gov.br', pubDate: new Date().toISOString(), description: 'Legislação brasileira que reforça proteção à criança e ao adolescente.', sourceName: 'Planalto', thumbnail: NEWS_PLACEHOLDER_IMAGES[0] },
      { title: 'Bullying escolar: prevenção e canais de apoio', link: 'https://www.gov.br/saude', pubDate: new Date().toISOString(), description: 'Orientações sobre identificação e enfrentamento do bullying.', sourceName: 'Gov.br', thumbnail: NEWS_PLACEHOLDER_IMAGES[1] }
    ];
  }

  function updateTicker(items) {
    const el = document.getElementById('tickerContent');
    if (!el || !items.length) return;
    const chunk = items.slice(0, 12).map((it) => {
      const info = getSourceInfo(it.sourceName);
      return `<span class="ticker-item"><span class="ticker-source" style="color:${info.color}">${it.sourceName}</span> ${stripHtml(it.title)}</span>`;
    }).join('');
    el.innerHTML = chunk + chunk;
  }

  function renderNews(items, append) {
    const grid = document.getElementById('newsGrid');
    const loading = document.getElementById('newsLoading');
    if (!grid) return;
    if (loading) loading.remove();
    if (!append) grid.innerHTML = '';
    items.forEach((item, index) => {
      const info = getSourceInfo(item.sourceName);
      const feedImg = getItemImage(item);
      const stockImg = placeholderImageForIndex(index);
      const firstUrl = feedImg || stockImg;
      const excerpt = stripHtml(item.description || '').slice(0, 160);
      const initial = (item.sourceName || 'N').charAt(0).toUpperCase();
      const titleSafe = stripHtml(item.title).slice(0, 140);
      const card = document.createElement('article');
      card.className = 'news-card fade-in visible' + (index === 0 ? ' news-card-featured' : '');

      const link = document.createElement('a');
      link.className = 'news-card-link';
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const wrap = document.createElement('div');
      wrap.className = 'news-card-img-wrap';

      const im = document.createElement('img');
      im.className = 'news-card-img';
      im.src = firstUrl;
      im.alt = titleSafe || 'Imagem da matéria';
      im.loading = 'lazy';
      im.decoding = 'async';
      im.referrerPolicy = 'strict-origin-when-cross-origin';

      const ph = document.createElement('div');
      ph.className = 'news-card-img-placeholder';
      ph.style.background = info.color;
      ph.innerHTML = `<span class="placeholder-initial">${initial}</span>`;
      ph.hidden = true;

      let errCount = 0;
      im.addEventListener('error', () => {
        errCount += 1;
        if (errCount === 1) {
          im.referrerPolicy = 'no-referrer';
          im.src = firstUrl;
          return;
        }
        if (errCount === 2 && feedImg) {
          im.src = stockImg;
          im.referrerPolicy = 'no-referrer';
          return;
        }
        im.remove();
        ph.hidden = false;
      });

      wrap.appendChild(im);
      wrap.appendChild(ph);

      const body = document.createElement('div');
      body.className = 'news-card-body';
      body.innerHTML = `
        <div class="news-card-meta">
          <span class="news-card-source" style="background:${info.color}">${item.sourceName}</span>
          <span>${formatDate(item.pubDate)}</span>
        </div>
        <h3 class="news-card-title">${item.title.replace(/</g, '&lt;')}</h3>
        <p class="news-card-excerpt">${excerpt.replace(/</g, '&lt;')}${excerpt.length >= 160 ? '…' : ''}</p>`;

      link.appendChild(wrap);
      link.appendChild(body);
      card.appendChild(link);

      const foot = document.createElement('div');
      foot.className = 'news-card-footer';
      foot.innerHTML = `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-card-portal">Ler matéria →</a>
        <a href="${info.portal}" target="_blank" rel="noopener noreferrer" class="news-card-portal">Portal</a>`;
      card.appendChild(foot);

      grid.appendChild(card);
    });
  }

  async function fetchNews(query) {
    const grid = document.getElementById('newsGrid');
    const more = document.getElementById('newsMore');
    if (!grid) return;
    grid.innerHTML = `<div class="news-loading" id="newsLoading"><div class="news-spinner"></div><p>Buscando notícias...</p></div>`;
    if (more) { more.hidden = true; }
    displayedCount = 4;

    try {
      const [google, ...rest] = await Promise.all([
        fetchGoogleNews(query),
        ...NEWS_SOURCES.map((s) => fetchFromSource(s).catch(() => []))
      ]);
      let combined = dedupe([...google, ...rest.flat()]);
      let relevant = combined.filter((it) => isRelevant(it, query));
      relevant.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      allNewsItems = relevant.length ? relevant : getFallbackNews();
      updateTicker(allNewsItems);
      renderNews(allNewsItems.slice(0, displayedCount));
      if (more) more.hidden = allNewsItems.length <= displayedCount;
    } catch (e) {
      console.warn(e);
      allNewsItems = getFallbackNews();
      updateTicker(allNewsItems);
      renderNews(allNewsItems);
    }
  }

  if (document.getElementById('newsGrid')) {
    document.getElementById('newsSearchBtn')?.addEventListener('click', () => {
      const q = document.getElementById('newsSearchInput')?.value.trim() || 'bullying escolar Brasil';
      fetchNews(q);
    });

    document.getElementById('newsSearchInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('newsSearchBtn')?.click();
      }
    });

    document.querySelectorAll('.news-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.news-filter').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const q = btn.dataset.query || '';
        const input = document.getElementById('newsSearchInput');
        if (input) input.value = q;
        fetchNews(q);
      });
    });

    document.getElementById('loadMoreNews')?.addEventListener('click', () => {
      displayedCount += 4;
      const grid = document.getElementById('newsGrid');
      if (grid) grid.innerHTML = '';
      renderNews(allNewsItems.slice(0, displayedCount));
      const more = document.getElementById('newsMore');
      if (more) more.hidden = allNewsItems.length <= displayedCount;
    });

    const initialQ = document.getElementById('newsSearchInput')?.value.trim() || 'bullying escolar Brasil';
    fetchNews(initialQ);
  }
})();
