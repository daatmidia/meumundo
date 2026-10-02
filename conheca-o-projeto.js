(function () {
  'use strict';
  const LANG_KEY = 'jsb_lang';
  const PT_BR = 'pt-BR';
  const EN_US = 'en-US';
  const ES_ES = 'es-ES';
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
    document.title = 'About the Project — REACT Project';
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
    setText('.proj-tag', 'Education and citizenship');
    setText('.proj-hero h1', 'About the Project');
    setHtml('.proj-lead', 'Understand why <strong>identifying</strong> bullying is essential and what the <strong>rights and duties</strong> of educators, parents and students are — in line with <strong>Law No. 14,811/2024</strong>.');
    setText('#identificar h2', 'Why identify?');
    setHtml('#identificar p', 'Bullying is <strong>repetitive</strong> and usually involves a <strong>power imbalance</strong>. Without early identification, schools and families lose time and victims remain unprotected. Cyberbullying expands the reach and duration of suffering.');
    const idItems = document.querySelectorAll('#identificar .proj-list li');
    if (idItems[0]) idItems[0].textContent = 'Signs: lower performance, isolation, fear of going to school, sleep and mood changes.';
    if (idItems[1]) idItems[1].textContent = 'Acting early reduces psychological harm and prevents normalization of violence.';
    setText('#educadores h2', 'Educators — rights and duties (summary)');
    setText('#educadores .proj-card:nth-child(1) h3', 'Rights');
    setText('#educadores .proj-card:nth-child(2) h3', 'Duties');
    const edu1 = document.querySelectorAll('#educadores .proj-card:nth-child(1) li');
    if (edu1[0]) edu1[0].textContent = 'Training and support to mediate conflicts safely.';
    if (edu1[1]) edu1[1].textContent = 'Clear referral protocols and staff protection.';
    const edu2 = document.querySelectorAll('#educadores .proj-card:nth-child(2) li');
    if (edu2[0]) edu2[0].textContent = 'Active monitoring of school climate and victim support.';
    if (edu2[1]) edu2[1].textContent = 'Record and report according to school-network and legal rules.';
    if (edu2[2]) edu2[2].textContent = 'Do not minimize reports; avoid public revictimization.';
    setText('#pais h2', 'Parents and guardians');
    setText('#pais .proj-card:nth-child(1) h3', 'Rights');
    setText('#pais .proj-card:nth-child(2) h3', 'Duties');
    const pais1 = document.querySelectorAll('#pais .proj-card:nth-child(1) li');
    if (pais1[0]) pais1[0].textContent = 'Be informed about protective measures adopted by the school (respecting necessary confidentiality).';
    if (pais1[1]) pais1[1].textContent = 'Access to reporting channels and case follow-up.';
    const pais2 = document.querySelectorAll('#pais .proj-card:nth-child(2) li');
    if (pais2[0]) pais2[0].textContent = 'Observe signs and keep a supportive dialogue with children.';
    if (pais2[1]) pais2[1].textContent = 'Cooperate with the school and seek specialized support when needed.';
    setText('#alunos h2', 'Students');
    setText('#alunos .proj-card:nth-child(1) h3', 'Rights');
    setText('#alunos .proj-card:nth-child(2) h3', 'Duties');
    const aluno1 = document.querySelectorAll('#alunos .proj-card:nth-child(1) li');
    if (aluno1[0]) aluno1[0].textContent = 'Learn in a safe, violence-free environment.';
    if (aluno1[1]) aluno1[1].textContent = 'Report with protection — including anonymously when offered.';
    const aluno2 = document.querySelectorAll('#alunos .proj-card:nth-child(2) li');
    if (aluno2[0]) aluno2[0].textContent = 'Respect classmates; do not engage in humiliation or hate chains.';
    if (aluno2[1]) aluno2[1].textContent = 'Support those suffering, without exposing victims; seek trusted adults.';
    setText('#lei h2', 'Law No. 14,811/2024 (landmark)');
    setHtml('#lei p', 'It strengthens the protection of children and adolescents against violence in school and related environments, including prevention measures, accountability, and care channels. Always consult the <strong>full legal text</strong> and your city school network.');
    setText('.proj-cta a:nth-child(1)', 'Access School Ombudsman');
    setText('.proj-cta a:nth-child(2)', 'Back to home');
    setText('.footer-bottom p', '© 2026 REACT Project');
  };

  const applyEsEs = () => {
    document.documentElement.lang = ES_ES;
    localStorage.setItem(LANG_KEY, ES_ES);
    document.title = 'Conoce el Proyecto — Proyecto REACT';
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
    setText('.proj-tag', 'Educación y ciudadanía');
    setText('.proj-hero h1', 'Conoce el Proyecto');
    setHtml('.proj-lead', 'Entiende por qué <strong>identificar</strong> el bullying es esencial y cuáles son los <strong>derechos y deberes</strong> de educadores, padres y alumnos — en línea con la <strong>Ley N.º 14.811/2024</strong>.');
    setText('#identificar h2', '¿Por qué identificar?');
    setHtml('#identificar p', 'El bullying es <strong>repetitivo</strong> y suele implicar <strong>desequilibrio de poder</strong>. Sin identificación temprana, la escuela y la familia pierden tiempo y la víctima queda desprotegida. El ciberbullying amplía el alcance y la duración del sufrimiento.');
    const idItems = document.querySelectorAll('#identificar .proj-list li');
    if (idItems[0]) idItems[0].textContent = 'Señales: bajo rendimiento, aislamiento, miedo a ir a la escuela, alteraciones del sueño y del estado de ánimo.';
    if (idItems[1]) idItems[1].textContent = 'Actuar temprano reduce daños psicológicos y evita la normalización de la violencia.';
    setText('#educadores h2', 'Educadores — derechos y deberes (resumen)');
    setText('#educadores .proj-card:nth-child(1) h3', 'Derechos');
    setText('#educadores .proj-card:nth-child(2) h3', 'Deberes');
    const edu1 = document.querySelectorAll('#educadores .proj-card:nth-child(1) li');
    if (edu1[0]) edu1[0].textContent = 'Formación y apoyo para mediar conflictos con seguridad.';
    if (edu1[1]) edu1[1].textContent = 'Protocolos claros de derivación y protección del personal.';
    const edu2 = document.querySelectorAll('#educadores .proj-card:nth-child(2) li');
    if (edu2[0]) edu2[0].textContent = 'Vigilancia activa del clima escolar y acogida de la víctima.';
    if (edu2[1]) edu2[1].textContent = 'Registrar y comunicar conforme a normas de la red y la ley.';
    if (edu2[2]) edu2[2].textContent = 'No minimizar denuncias; evitar la revictimización pública.';
    setText('#pais h2', 'Padres y responsables');
    setText('#pais .proj-card:nth-child(1) h3', 'Derechos');
    setText('#pais .proj-card:nth-child(2) h3', 'Deberes');
    const pais1 = document.querySelectorAll('#pais .proj-card:nth-child(1) li');
    if (pais1[0]) pais1[0].textContent = 'Ser informados sobre medidas de protección adoptadas por la escuela (respetando la confidencialidad necesaria).';
    if (pais1[1]) pais1[1].textContent = 'Acceso a canales de denuncia y seguimiento.';
    const pais2 = document.querySelectorAll('#pais .proj-card:nth-child(2) li');
    if (pais2[0]) pais2[0].textContent = 'Observar señales y mantener diálogo acogedor con sus hijos.';
    if (pais2[1]) pais2[1].textContent = 'Cooperar con la escuela y buscar apoyo especializado cuando sea necesario.';
    setText('#alunos h2', 'Alumnos');
    setText('#alunos .proj-card:nth-child(1) h3', 'Derechos');
    setText('#alunos .proj-card:nth-child(2) h3', 'Deberes');
    const aluno1 = document.querySelectorAll('#alunos .proj-card:nth-child(1) li');
    if (aluno1[0]) aluno1[0].textContent = 'Aprender en un entorno seguro, libre de violencia.';
    if (aluno1[1]) aluno1[1].textContent = 'Denunciar con protección, incluso de forma anónima cuando esté disponible.';
    const aluno2 = document.querySelectorAll('#alunos .proj-card:nth-child(2) li');
    if (aluno2[0]) aluno2[0].textContent = 'Respetar a los compañeros; no participar en humillaciones o cadenas de odio.';
    if (aluno2[1]) aluno2[1].textContent = 'Apoyar a quien sufre, sin exponer a la víctima; buscar adultos de confianza.';
    setText('#lei h2', 'Ley N.º 14.811/2024 (hito)');
    setHtml('#lei p', 'Refuerza la protección de niñas, niños y adolescentes contra violencias en el entorno escolar y relacionado, incluyendo medidas de prevención, responsabilización y canales de atención. Consulte siempre el <strong>texto legal completo</strong> y la red educativa de su ciudad.');
    setText('.proj-cta a:nth-child(1)', 'Acceder a la Defensoría Escolar');
    setText('.proj-cta a:nth-child(2)', 'Volver al inicio');
    setText('.footer-bottom p', '© 2026 Proyecto REACT');
  };
  const storedLang = localStorage.getItem(LANG_KEY) || PT_BR;
  if (storedLang === EN_US) applyEnUs();
  else if (storedLang === ES_ES) applyEsEs();
  else applyPtBr();
  document.querySelectorAll('.js-lang-ptbr').forEach((el) => {
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
  document.querySelectorAll('.js-lang-enus').forEach((el) => {
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
  document.querySelectorAll('.js-lang-eses').forEach((el) => {
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
})();
