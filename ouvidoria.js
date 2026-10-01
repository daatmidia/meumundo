(function () {
  'use strict';

  const LS_KEY = 'jsb_ouvidoria_reports';
  const LS_PEOPLE = 'jsb_ouvidoria_people';
  const LS_PROS = 'jsb_ouvidoria_profissionais';
  const LS_SCHOOL = 'jsb_ouvidoria_school_name';
  const ADMIN_CODE = 'escola2026';
  const SITE_ADMIN_CODE = 'site2026';
  const LANG_KEY = 'jsb_lang';
  const PT_BR = 'pt-BR';
  const EN_US = 'en-US';
  const ES_ES = 'es-ES';

  // ===== Supabase (banco de dados das denúncias) =====
  const SUPABASE_URL = 'https://fywxqwkoouysmjmuctsp.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_JCVnUmTMBcomihvH4tAbkQ_uE8uiKjk';
  const SB_ON = /^https:\/\/.+\.supabase\.co$/.test(SUPABASE_URL) && Boolean(SUPABASE_KEY);
  const sbHeaders = (extra) => Object.assign({
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  }, extra || {});
  const rowToReport = (row) => ({
    protocol: row.protocolo,
    status: row.status || 'Recebido',
    created: row.created,
    data: row.dados || {},
    assignedProfessionalId: row.assigned || ''
  });

  // ----- Sessão de administrador (Supabase Auth) -----
  const SB_SESSION_KEY = 'jsb_sb_session';
  let sbSession = null;
  (function loadStoredSession() {
    try { sbSession = JSON.parse(sessionStorage.getItem(SB_SESSION_KEY) || 'null'); }
    catch { sbSession = null; }
  })();
  function sbSaveSession(s) {
    sbSession = s;
    try {
      if (s) sessionStorage.setItem(SB_SESSION_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(SB_SESSION_KEY);
    } catch { /* ignore */ }
  }
  function sbIsLogged() { return Boolean(sbSession?.access_token); }
  function sbAuthHeaders(extra) {
    const token = sbSession?.access_token || SUPABASE_KEY;
    return Object.assign({
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }, extra || {});
  }
  async function sbSignIn(email, password) {
    if (!SB_ON || !email || !password) return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data.access_token) return false;
      sbSaveSession(data);
      return true;
    } catch { return false; }
  }

  async function sbInsert(report) {
    if (!SB_ON) return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/denuncias`, {
        method: 'POST',
        headers: sbHeaders({ Prefer: 'return=minimal' }),
        body: JSON.stringify({
          protocolo: report.protocol,
          status: report.status,
          assigned: report.assignedProfessionalId || null,
          dados: report.data,
          created: report.created
        })
      });
      return res.ok;
    } catch { return false; }
  }

  // Lê todas as denúncias — só funciona para administradores logados (RLS).
  async function sbFetchAll() {
    if (!SB_ON) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/denuncias?select=*&order=created.desc`, { headers: sbAuthHeaders() });
      if (!res.ok) return null;
      const rows = await res.json();
      return Array.isArray(rows) ? rows.map(rowToReport) : null;
    } catch { return null; }
  }

  // Consulta pública de status via função protegida (retorna só status e data).
  async function sbFetchByProtocol(code) {
    if (!SB_ON) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/consultar_protocolo`, {
        method: 'POST',
        headers: sbHeaders(),
        body: JSON.stringify({ p: code })
      });
      if (!res.ok) return null;
      const rows = await res.json();
      if (!rows || !rows.length) return null;
      const row = rows[0];
      return { protocol: code, status: row.status || 'Recebido', created: row.created, data: {}, assignedProfessionalId: '' };
    } catch { return null; }
  }

  // Atualiza status/encaminhamento — só administradores logados (RLS).
  async function sbUpdate(code, patch) {
    if (!SB_ON) return false;
    try {
      const url = `${SUPABASE_URL}/rest/v1/denuncias?protocolo=eq.${encodeURIComponent(code)}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: sbAuthHeaders({ Prefer: 'return=minimal' }),
        body: JSON.stringify(patch)
      });
      return res.ok;
    } catch { return false; }
  }

  async function syncFromSupabase() {
    if (!sbIsLogged()) return null;
    const rows = await sbFetchAll();
    if (rows) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch { /* ignore */ }
    }
    return rows;
  }
  const setText = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
  const setHtml = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
  const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  const applyNavI18n = (labels) => {
    const navHome = document.querySelector('#navLinks > li:nth-child(1) > a');
    const navProject = document.querySelector('#navLinks > li:nth-child(2) > a');
    const navOmb = document.querySelector('#navLinks > li:nth-child(3) > a');
    const navAccess = document.querySelector('#navLinks > li:nth-child(4) > .nav-link-trigger');
    if (navHome) navHome.textContent = labels.home;
    if (navProject) navProject.textContent = labels.project;
    if (navOmb) navOmb.textContent = labels.omb;
    if (navAccess) navAccess.textContent = labels.access;
    const projectSub = document.querySelectorAll('#navLinks > li:nth-child(2) .nav-submenu a');
    labels.projectSub.forEach((txt, i) => { if (projectSub[i]) projectSub[i].textContent = txt; });
    const accessSub = document.querySelectorAll('#navLinks > li:nth-child(4) .nav-submenu a');
    labels.accessSub.forEach((txt, i) => { if (accessSub[i]) accessSub[i].textContent = txt; });
  };
  const getCurrentLang = () => localStorage.getItem(LANG_KEY) || PT_BR;
  const statusValues = {
    pt: ['Recebido', 'Em análise', 'Encaminhado', 'Concluído'],
    en: ['Received', 'Under review', 'Forwarded', 'Completed'],
    es: ['Recibido', 'En análisis', 'Derivado', 'Concluido']
  };
  const statusMap = {
    'Recebido': { en: 'Received', es: 'Recibido', pt: 'Recebido' },
    'Em análise': { en: 'Under review', es: 'En análisis', pt: 'Em análise' },
    'Encaminhado': { en: 'Forwarded', es: 'Derivado', pt: 'Encaminhado' },
    'Concluído': { en: 'Completed', es: 'Concluido', pt: 'Concluído' },
    'Received': { en: 'Received', es: 'Recibido', pt: 'Recebido' },
    'Under review': { en: 'Under review', es: 'En análisis', pt: 'Em análise' },
    'Forwarded': { en: 'Forwarded', es: 'Derivado', pt: 'Encaminhado' },
    'Completed': { en: 'Completed', es: 'Concluido', pt: 'Concluído' },
    'Recibido': { en: 'Received', es: 'Recibido', pt: 'Recebido' },
    'En análisis': { en: 'Under review', es: 'En análisis', pt: 'Em análise' },
    'Derivado': { en: 'Forwarded', es: 'Derivado', pt: 'Encaminhado' },
    'Concluido': { en: 'Completed', es: 'Concluido', pt: 'Concluído' }
  };
  const toCanonicalStatus = (value) => (statusMap[value]?.pt || value);
  const getStatusListByLang = () => {
    const lang = getCurrentLang();
    if (lang === EN_US) return statusValues.en;
    if (lang === ES_ES) return statusValues.es;
    return statusValues.pt;
  };
  const labelStatus = (status) => {
    const lang = getCurrentLang();
    const mapped = statusMap[status] || statusMap[toCanonicalStatus(status)];
    if (!mapped) return status;
    if (lang === EN_US) return mapped.en;
    if (lang === ES_ES) return mapped.es;
    return mapped.pt;
  };
  const msg = (key) => {
    const lang = getCurrentLang();
    const dict = {
      fillNameContact: {
        pt: 'Preencha nome e contato para que possamos retornar se for necessário. Em modo anônimo, os dados ficam sigilosos.',
        en: 'Fill in name and contact so we can follow up if needed. In anonymous mode, data stays confidential.',
        es: 'Complete nombre y contacto para que podamos responder si es necesario. En modo anónimo, los datos permanecen confidenciales.'
      },
      fillSchoolTypeFreq: {
        pt: 'Preencha escola, tipo e frequência.',
        en: 'Fill in school, type and frequency.',
        es: 'Complete escuela, tipo y frecuencia.'
      },
      describeCase: {
        pt: 'Descreva o ocorrido.',
        en: 'Describe what happened.',
        es: 'Describe lo ocurrido.'
      },
      confirmTruth: {
        pt: 'Confirme a declaração de veracidade.',
        en: 'Confirm the truthfulness declaration.',
        es: 'Confirma la declaración de veracidad.'
      },
      protocolNotFound: {
        pt: 'Protocolo não encontrado. Confira o código digitado.',
        en: 'Protocol not found. Please check the code you typed.',
        es: 'Protocolo no encontrado. Verifica el código ingresado.'
      },
      statusLabel: { pt: 'Status', en: 'Status', es: 'Estado' },
      forwardTo: { pt: 'Encaminhar para', en: 'Forward to', es: 'Derivar a' },
      noForwarding: { pt: 'Sem encaminhamento', en: 'No forwarding', es: 'Sin derivación' },
      noProfessionals: { pt: 'Sem profissionais cadastrados', en: 'No registered professionals', es: 'Sin profesionales registrados' },
      frequency: { pt: 'Frequência', en: 'Frequency', es: 'Frecuencia' },
      urgency: { pt: 'Urgência', en: 'Urgency', es: 'Urgencia' },
      noProtocolsByFilter: {
        pt: 'Nenhum protocolo encontrado para estes filtros.',
        en: 'No protocol found for these filters.',
        es: 'No se encontraron protocolos para estos filtros.'
      },
      noReportsByFilter: {
        pt: 'Nenhuma denúncia encontrada com os filtros atuais.',
        en: 'No reports found with the current filters.',
        es: 'No se encontraron denuncias con los filtros actuales.'
      },
      invalidSchoolAdminCode: {
        pt: 'E-mail ou senha inválidos.',
        en: 'Invalid email or password.',
        es: 'Correo o contraseña inválidos.'
      },
      noEmployeeThisSchool: {
        pt: 'Nenhum funcionário cadastrado para esta escola.',
        en: 'No staff registered for this school.',
        es: 'No hay personal registrado para esta escuela.'
      },
      noStudentThisSchool: {
        pt: 'Nenhum aluno cadastrado para esta escola.',
        en: 'No students registered for this school.',
        es: 'No hay alumnos registrados para esta escuela.'
      },
      noPartnerThisSchool: {
        pt: 'Nenhum profissional parceiro cadastrado para esta escola.',
        en: 'No partner professionals registered for this school.',
        es: 'No hay profesionales asociados registrados para esta escuela.'
      },
      employeeNameSchool: {
        pt: 'Informe nome do funcionário e o nome da escola.',
        en: 'Provide staff name and school name.',
        es: 'Informa el nombre del funcionario y el nombre de la escuela.'
      },
      studentNameSchool: {
        pt: 'Informe nome do aluno e o nome da escola.',
        en: 'Provide student name and school name.',
        es: 'Informa el nombre del alumno y el nombre de la escuela.'
      },
      professionalRequired: {
        pt: 'Selecione o tipo, informe o nome do profissional e a escola.',
        en: 'Select type, inform professional name and school.',
        es: 'Selecciona el tipo, indica el nombre del profesional y la escuela.'
      },
      invalidSiteAdminCode: {
        pt: 'E-mail ou senha inválidos.',
        en: 'Invalid email or password.',
        es: 'Correo o contraseña inválidos.'
      },
      noProtocols: {
        pt: 'Nenhum protocolo encontrado.',
        en: 'No protocols found.',
        es: 'No se encontraron protocolos.'
      }
    };
    return dict[key]?.[lang === EN_US ? 'en' : lang === ES_ES ? 'es' : 'pt'] || '';
  };

  const applyPtBr = () => {
    document.documentElement.lang = PT_BR;
    localStorage.setItem(LANG_KEY, PT_BR);
  };
  const applyEnUs = () => {
    document.documentElement.lang = EN_US;
    localStorage.setItem(LANG_KEY, EN_US);
    document.title = 'School Ombudsman — REACT Project';
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
      projectSub: ['About', 'News', 'Educational Content', 'Data', 'Testimonials'],
      accessSub: ['Track protocol', 'Administrative access', 'School access', 'Training']
    });
    setText('.ouv-hero-title', 'School Ombudsman');
    setText('.ouv-lead', 'Report bullying or cyberbullying anonymously or identified. You receive a protocol to follow up on your report.');
    setText('.ouv-btn-primary[href="#formulario"]', 'New report');
    setText('.ouv-btn-ghost[href="#acompanhar"]', 'Track protocol');
    setText('.ouv-section-label', 'Before registering');
    setText('.ouv-section-title', 'Important guidance');
    setAttr('#protocolInput', 'placeholder', 'Ex: JSB-2026-XXXX');
    setText('#protocolBtn', 'Check');
    setText('#adminLogin', 'Enter');
    setText('#adminAccess', 'Open Panel');
    setText('#siteAdminLogin', 'Enter');
  };
  const applyEsEs = () => {
    document.documentElement.lang = ES_ES;
    localStorage.setItem(LANG_KEY, ES_ES);
    document.title = 'Defensoría Escolar — Proyecto REACT';
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
      projectSub: ['Acerca de', 'Noticias', 'Contenido Educativo', 'Datos', 'Testimonios'],
      accessSub: ['Consultar protocolo', 'Acceso administrativo', 'Acceso escuelas', 'Capacitaciones']
    });
    setHtml('.ouv-hero-title', 'Defensoría <span class="ouv-hero-accent">Escolar</span>');
    setHtml('.ouv-lead', 'Registra bullying o ciberbullying de forma <strong>anónima</strong> o <strong>identificada</strong>. Recibes un <strong>protocolo</strong> para dar seguimiento a tu denuncia.');
    setText('.ouv-btn-primary[href="#formulario"]', 'Nueva denuncia');
    setText('.ouv-btn-ghost[href="#acompanhar"]', 'Consultar protocolo');
    setText('#orientacoes .ouv-section-label', 'Antes de registrar');
    setText('#orientacoes .ouv-section-title', 'Orientaciones importantes');
    setText('#formulario .ouv-section-label', 'Formulario');
    setText('#formulario .ouv-section-title', 'Registro por etapas');
    setText('#formulario .ouv-section-desc', 'Completa con calma. Puedes volver a cualquier paso.');
    setText('#acompanhar .ouv-panel-title', 'Consultar protocolo');
    setText('#acompanhar .ouv-muted', 'Ingresa el código generado después del envío.');
    setAttr('#protocolInput', 'placeholder', 'Ej.: JSB-2026-XXXX');
    setText('#protocolBtn', 'Consultar');
    setText('#adminLogin', 'Entrar');
    setText('#adminAccess', 'Abrir Panel');
    setText('#siteAdminLogin', 'Entrar');
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

  // Mostra o painel administrativo apenas quando a nova aba abrir com ?admin=1
  const adminPanel = document.getElementById('painel');
  const params = new URLSearchParams(window.location.search);
  const shouldShowAdmin = params.get('admin') === '1';

  // No modo admin, deixamos a página com apenas:
  //  - Acompanhar protocolo
  //  - Painel da escola (login administrativo + painel)
  //  - O restante do formulário de denúncia fica oculto
  const hero = document.querySelector('.ouv-hero');
  const orientacoes = document.getElementById('orientacoes');
  const formulario = document.getElementById('formulario');

  if (adminPanel) {
    if (shouldShowAdmin) adminPanel.classList.remove('hidden');
    else adminPanel.classList.add('hidden');
  }

  const siteAdminPanel = document.getElementById('siteAdmin');
  if (siteAdminPanel) {
    if (shouldShowAdmin) siteAdminPanel.classList.remove('hidden');
    else siteAdminPanel.classList.add('hidden');
  }

  // Se entrar no modo admin, rola automaticamente para o painel
  if (shouldShowAdmin && adminPanel) {
    setTimeout(() => {
      try {
        adminPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('adminCode')?.focus();
      } catch {
        // ignore
      }
    }, 200);
  }

  if (hero) hero.classList.toggle('hidden', shouldShowAdmin);
  if (orientacoes) orientacoes.classList.toggle('hidden', shouldShowAdmin);
  if (formulario) formulario.classList.toggle('hidden', shouldShowAdmin);

  const form = document.getElementById('ouvForm');
  const panels = () => Array.from(document.querySelectorAll('[data-panel]'));
  const steps = () => Array.from(document.querySelectorAll('.ouv-step'));
  let current = 1;

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  const camposIdent = document.getElementById('camposIdent');

  function syncRadioCards() {
    document.querySelectorAll('.ouv-radio').forEach((lab) => {
      const inp = lab.querySelector('input[type="radio"]');
      lab.classList.toggle('ouv-radio--on', Boolean(inp?.checked));
    });
  }

  document.querySelectorAll('input[name="idTipo"]').forEach((r) => {
    r.addEventListener('change', () => {
      const anon = document.querySelector('input[name="idTipo"]:checked')?.value === 'anonimo';
      const anonMsg = document.getElementById('anonMessage');
      if (anonMsg) anonMsg.hidden = !anon;
      syncRadioCards();
    });
  });
  syncRadioCards();

  // Seleção de escola (banco de dados de destino da denúncia).
  const escolaSelect = document.getElementById('escolaSelect');
  const outraEscolaWrap = document.getElementById('outraEscolaWrap');
  const escolaOutra = document.getElementById('escolaOutra');
  function toggleOutraEscola() {
    const isOutra = escolaSelect?.value === 'outra';
    if (outraEscolaWrap) outraEscolaWrap.classList.toggle('hidden', !isOutra);
    if (escolaOutra) escolaOutra.required = Boolean(isOutra);
  }
  escolaSelect?.addEventListener('change', toggleOutraEscola);
  toggleOutraEscola();

  // Escola efetiva: usa o valor da lista, ou o texto livre quando "Outra escola".
  function getEscola() {
    const sel = escolaSelect?.value || '';
    if (sel === 'outra') return (escolaOutra?.value || '').trim();
    return sel;
  }

  function showStep(n) {
    current = n;
    panels().forEach((p) => {
      const num = parseInt(p.dataset.panel, 10);
      p.classList.toggle('hidden', num !== n);
    });
    steps().forEach((s) => s.classList.toggle('active', parseInt(s.dataset.step, 10) <= n));
    if (btnPrev) btnPrev.disabled = n === 1;
    if (btnNext) btnNext.classList.toggle('hidden', n === 4);
    if (btnSubmit) btnSubmit.classList.toggle('hidden', n !== 4);
  }

  function getFormData() {
    const fd = new FormData(form);
    return Object.fromEntries(fd.entries());
  }

  function buildReview() {
    const d = getFormData();
    const lines = [
      `Identificação: ${d.idTipo || '-'}`,
      d.idTipo !== 'anonimo' ? `Nome/contato: ${d.nome || '-'} / ${d.contato || '-'}` : '',
      `Escola: ${getEscola() || '-'}`,
      `Tipo: ${d.tipo || '-'} | Frequência: ${d.frequencia || '-'} | Urgência: ${d.urgencia || '-'}`,
      '',
      `Relato:`,
      d.relato || '-'
    ].filter(Boolean);
    document.getElementById('reviewBox').textContent = lines.join('\n');
  }

  btnNext?.addEventListener('click', () => {
    if (current === 1) {
      const nome = form.nome?.value.trim();
      const cont = form.contato?.value.trim();
      if (!nome || !cont) {
        alert(msg('fillNameContact'));
        return;
      }
    }
    if (current === 2) {
      if (!getEscola() || !form.tipo?.value || !form.frequencia?.value) {
        alert(msg('fillSchoolTypeFreq'));
        return;
      }
    }
    if (current === 3) {
      if (!form.relato?.value.trim()) {
        alert(msg('describeCase'));
        return;
      }
      buildReview();
    }
    if (current < 4) showStep(current + 1);
  });

  btnPrev?.addEventListener('click', () => {
    if (current > 1) showStep(current - 1);
  });

  function genProtocol() {
    const y = new Date().getFullYear();
    const r = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `JSB-${y}-${r}`;
  }

  function loadReports() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveReport(rep) {
    const all = loadReports();
    all.unshift(rep);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.veracidade?.checked) {
      alert(msg('confirmTruth'));
      return;
    }
    const d = getFormData();
    d.escola = getEscola();
    delete d.escolaOutra;
    const protocol = genProtocol();
    const rep = {
      protocol,
      status: toCanonicalStatus('Recebido'),
      created: new Date().toISOString(),
      data: d
    };
    saveReport(rep);
    sbInsert(rep).catch(() => { /* mantém salvo localmente se o banco falhar */ });
    document.getElementById('modalProtocol').textContent = protocol;
    document.getElementById('successModal')?.classList.remove('hidden');
    form.reset();
    document.querySelectorAll('input[name="idTipo"]')[0].checked = true;
    const anonMsg = document.getElementById('anonMessage');
    if (camposIdent) camposIdent.hidden = false;
    if (anonMsg) anonMsg.hidden = false;
    toggleOutraEscola();
    showStep(1);
  });

  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('successModal')?.classList.add('hidden');
  });

  document.getElementById('protocolBtn')?.addEventListener('click', async () => {
    const code = document.getElementById('protocolInput')?.value.trim().toUpperCase();
    const box = document.getElementById('protocolResult');
    if (!code || !box) return;
    box.classList.remove('hidden');

    let rep = await sbFetchByProtocol(code);
    if (!rep) rep = loadReports().find((r) => r.protocol === code);

    if (!rep) {
      box.style.background = '#fef2f2';
      box.style.borderColor = '#fecaca';
      box.style.color = '#991b1b';
      box.textContent = msg('protocolNotFound');
      return;
    }
    box.style.background = '#ecfdf5';
    box.style.borderColor = '#a7f3d0';
    box.style.color = '#065f46';
    const currentLang = getCurrentLang();
    const currentLocale = currentLang === EN_US ? 'en-US' : currentLang === ES_ES ? 'es-ES' : 'pt-BR';
    box.innerHTML = `<strong>${msg('statusLabel')}:</strong> ${labelStatus(rep.status)}<br><small>${new Date(rep.created).toLocaleString(currentLocale)}</small>`;
  });

  document.getElementById('adminLogin')?.addEventListener('click', async () => {
    const email = document.getElementById('adminEmail')?.value.trim();
    const password = document.getElementById('adminCode')?.value;
    const app = document.getElementById('adminApp');
    const accessBlock = document.getElementById('adminAccessBlock');
    const accessBtn = document.getElementById('adminAccess');
    if (!app) return;
    const ok = await sbSignIn(email, password);
    if (!ok) {
      alert(msg('invalidSchoolAdminCode'));
      return;
    }
    if (accessBlock) accessBlock.classList.remove('hidden');

    const schoolName = localStorage.getItem(LS_SCHOOL) || '';
    const schoolInput = document.getElementById('adminSchoolName');
    if (schoolInput && schoolName && !schoolInput.value) schoolInput.value = schoolName;

    // Tabs
    document.querySelectorAll('.ouv-admin-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.ouv-admin-tab').forEach((t) => {
          t.classList.toggle('active', t.dataset.tab === tab);
          t.setAttribute('aria-selected', t.dataset.tab === tab ? 'true' : 'false');
        });
        document.querySelectorAll('.ouv-admin-panel').forEach((p) => {
          p.classList.toggle('active', p.dataset.panel === tab);
        });
      });
    });

    const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();

    function loadPeople() {
      try {
        return JSON.parse(localStorage.getItem(LS_PEOPLE) || '[]');
      } catch {
        return [];
      }
    }

    function savePeople(people) {
      localStorage.setItem(LS_PEOPLE, JSON.stringify(people));
    }

    function loadPros() {
      try {
        return JSON.parse(localStorage.getItem(LS_PROS) || '[]');
      } catch {
        return [];
      }
    }

    function savePros(pros) {
      localStorage.setItem(LS_PROS, JSON.stringify(pros));
    }

    function getSchoolFilter() {
      const v = document.getElementById('adminSchoolName')?.value || '';
      if (v) localStorage.setItem(LS_SCHOOL, v);
      return v;
    }

    function filterReports() {
      const school = normalize(getSchoolFilter());
      const reports = loadReports();
      if (!school) return reports;
      return reports.filter((r) => normalize(r?.data?.escola) && normalize(r.data.escola).includes(school));
    }

    function setStatus(protocol, newStatus) {
      const arr = loadReports();
      const item = arr.find((x) => x.protocol === protocol);
      if (!item) return;
      item.status = newStatus;
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
      sbUpdate(protocol, { status: newStatus }).catch(() => { /* ignore */ });
    }

    function setAssigned(protocol, proId) {
      const arr = loadReports();
      const item = arr.find((x) => x.protocol === protocol);
      if (!item) return;
      item.assignedProfessionalId = proId || '';
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
      sbUpdate(protocol, { assigned: proId || null }).catch(() => { /* ignore */ });
    }

    function formatDate(ptIso) {
      try {
        return new Date(ptIso).toLocaleDateString('pt-BR');
      } catch {
        return '';
      }
    }

    function escapeHtml(str) {
      return (str || '').toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderPeople() {
      const school = getSchoolFilter();
      const people = loadPeople();
      const funcs = people.filter((p) => p.kind === 'funcionario' && normalize(p.escola) && normalize(p.escola).includes(normalize(school)));
      const alunos = people.filter((p) => p.kind === 'aluno' && normalize(p.escola) && normalize(p.escola).includes(normalize(school)));
      const pros = loadPros().filter((p) => p.kind === 'profissional' && normalize(p.escola) && normalize(p.escola).includes(normalize(school)));

      const funcList = document.getElementById('funcList');
      const alunoList = document.getElementById('alunoList');
      const proList = document.getElementById('proList');
      if (funcList) {
        funcList.innerHTML = funcs.length
          ? funcs.map((p) => `<div class="ouv-admin-item"><strong>${escapeHtml(p.nome)}</strong><span class="ouv-admin-item-meta">${escapeHtml(p.cargo || '')}${p.cargo ? ' · ' : ''}${escapeHtml(p.contato || '')}</span></div>`).join('')
          : `<div class="ouv-muted">${msg('noEmployeeThisSchool')}</div>`;
      }
      if (alunoList) {
        alunoList.innerHTML = alunos.length
          ? alunos.map((p) => `<div class="ouv-admin-item"><strong>${escapeHtml(p.nome)}</strong><span class="ouv-admin-item-meta">${escapeHtml(p.turma || '')}${p.turma ? ' · ' : ''}${escapeHtml(p.responsavel || '')}</span></div>`).join('')
          : `<div class="ouv-muted">${msg('noStudentThisSchool')}</div>`;
      }
      if (proList) {
        proList.innerHTML = pros.length
          ? pros.map((p) => `<div class="ouv-admin-item"><strong>${escapeHtml(p.nome)}</strong><span class="ouv-admin-item-meta">${escapeHtml(p.tipo || '')}${p.tipo ? ' · ' : ''}${escapeHtml(p.contato || '')}</span></div>`).join('')
          : `<div class="ouv-muted">${msg('noPartnerThisSchool')}</div>`;
      }
    }

    function renderProtocols() {
      const list = document.getElementById('protocolsList');
      const empty = document.getElementById('protocolsEmpty');
      if (!list || !empty) return;
      const search = normalize(document.getElementById('protocolSearch')?.value || '');
      const status = document.getElementById('protocolStatusFilter')?.value || 'all';
      const pros = loadPros().filter((p) => p.kind === 'profissional' && normalize(p.escola) && normalize(p.escola).includes(normalize(getSchoolFilter())));
      const proLabel = (id) => {
        const pro = pros.find((p) => p.id === id);
        if (!pro) return '';
        const prefix = pro.tipo === 'advogado' ? 'Advogado' : pro.tipo === 'psicologo' ? 'Psicólogo' : 'Profissional';
        return `${prefix}: ${pro.nome}`;
      };

      let reports = filterReports();
      if (search) reports = reports.filter((r) => normalize(r.protocol).includes(search));
      if (status !== 'all') reports = reports.filter((r) => r.status === status);
      reports.sort((a, b) => new Date(b.created) - new Date(a.created));

      if (!reports.length) {
        list.innerHTML = '';
        empty.textContent = msg('noProtocolsByFilter');
        return;
      }
      empty.textContent = '';

      list.innerHTML = reports.map((r) => {
        const freq = r.data?.frequencia || '-';
        const type = r.data?.tipo || '-';
        const urg = r.data?.urgencia || '-';
        return `
          <div class="ouv-protocol-card" data-protocol="${escapeHtml(r.protocol)}">
            <div class="ouv-protocol-top">
              <div>
                <div class="ouv-protocol-proto"><strong>${escapeHtml(r.protocol)}</strong></div>
                <div class="ouv-muted">${escapeHtml(formatDate(r.created))} · ${escapeHtml(r.data?.escola || '')}</div>
              </div>
              <div class="ouv-protocol-status">
                <label class="ouv-label-small">${msg('statusLabel')}</label>
                <select class="ouv-status-sel" data-protocol="${escapeHtml(r.protocol)}">
                  ${getStatusListByLang().map((s) => `
                    <option ${toCanonicalStatus(r.status) === toCanonicalStatus(s) ? 'selected' : ''}>${s}</option>
                  `).join('')}
                </select>
              </div>
                <div class="ouv-protocol-assign">
                  <label class="ouv-label-small">${msg('forwardTo')}</label>
                  <select class="ouv-assign-sel" data-protocol="${escapeHtml(r.protocol)}">
                    <option value="" ${(!r.assignedProfessionalId ? 'selected' : '')}>${msg('noForwarding')}</option>
                    ${pros.length
                      ? pros.map((p) => {
                          const prefix = p.tipo === 'advogado' ? 'Advogado' : p.tipo === 'psicologo' ? 'Psicólogo' : 'Profissional';
                          const selected = (r.assignedProfessionalId === p.id) ? 'selected' : '';
                          return `<option value="${escapeHtml(p.id)}" ${selected}>${prefix}: ${escapeHtml(p.nome)}</option>`;
                        }).join('')
                      : `<option value="">${msg('noProfessionals')}</option>`}
                  </select>
                </div>
            </div>
            <div class="ouv-protocol-meta">
              <span class="ouv-chip">${escapeHtml(type)}</span>
              <span class="ouv-chip">${msg('frequency')}: ${escapeHtml(freq)}</span>
              <span class="ouv-chip">${msg('urgency')}: ${escapeHtml(urg)}</span>
              ${r.assignedProfessionalId ? `<span class="ouv-chip">${escapeHtml(proLabel(r.assignedProfessionalId))}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.ouv-status-sel').forEach((sel) => {
        sel.addEventListener('change', () => {
          const protocol = sel.dataset.protocol;
          setStatus(protocol, toCanonicalStatus(sel.value));
          // Atualiza protocolos e relatórios
          renderProtocols();
          renderReport();
        });
      });

      list.querySelectorAll('.ouv-assign-sel').forEach((sel) => {
        sel.addEventListener('change', () => {
          const protocol = sel.dataset.protocol;
          setAssigned(protocol, sel.value);
          renderProtocols();
          renderReport();
        });
      });
    }

    function renderReport() {
      const reportCards = document.getElementById('reportCards');
      const freqSummary = document.getElementById('freqSummary');
      const reportDetailList = document.getElementById('reportDetailList');
      if (!reportCards || !freqSummary) return;

      const startVal = document.getElementById('reportStart')?.value;
      const endVal = document.getElementById('reportEnd')?.value;
      const status = document.getElementById('reportStatus')?.value || 'all';

      let reports = filterReports();
      if (startVal) {
        const start = new Date(startVal + 'T00:00:00');
        reports = reports.filter((r) => new Date(r.created) >= start);
      }
      if (endVal) {
        const end = new Date(endVal + 'T23:59:59');
        reports = reports.filter((r) => new Date(r.created) <= end);
      }
      if (status !== 'all') reports = reports.filter((r) => r.status === status);

      const school = getSchoolFilter();
      const pros = loadPros().filter((p) => p.kind === 'profissional' && normalize(p.escola) && normalize(p.escola).includes(normalize(school)));
      const proById = new Map(pros.map((p) => [p.id, p]));
      const proLabel = (id) => {
        const pro = proById.get(id);
        if (!pro) return '';
        const prefix = pro.tipo === 'advogado' ? 'Advogado' : pro.tipo === 'psicologo' ? 'Psicólogo' : 'Profissional';
        return `${prefix}: ${pro.nome}`;
      };

      const total = reports.length;
      const byStatus = statusValues.pt.map((s) => ({ s, n: reports.filter((r) => toCanonicalStatus(r.status) === s).length }));
      const byFreq = ['unica', 'recorrente'].map((f) => ({
        f,
        n: reports.filter((r) => r.data?.frequencia === f).length
      }));
      const byTypeKeys = ['fisico', 'verbal', 'social', 'cyber', 'outro'];
      const byType = byTypeKeys.map((k) => ({ k, n: reports.filter((r) => r.data?.tipo === k).length }));

      const freqLabel = (v) => (v === 'unica' ? 'Uma vez' : v === 'recorrente' ? 'Recorrente' : v);

      reportCards.innerHTML = `
        <div class="ouv-report-card">
          <div class="ouv-report-card-title">Total de denúncias</div>
          <div class="ouv-report-card-value">${total}</div>
        </div>
        <div class="ouv-report-card">
          <div class="ouv-report-card-title">Por status</div>
          <div class="ouv-report-list">${byStatus.map((x) => `<div class="ouv-report-list-item"><span>${labelStatus(x.s)}</span><strong>${x.n}</strong></div>`).join('')}</div>
        </div>
        <div class="ouv-report-card">
          <div class="ouv-report-card-title">Por tipo</div>
          <div class="ouv-report-list">${byType.map((x) => `<div class="ouv-report-list-item"><span>${escapeHtml(x.k)}</span><strong>${x.n}</strong></div>`).join('')}</div>
        </div>
      `;

      freqSummary.innerHTML = `
        ${byFreq.map((x) => {
          const pct = total ? Math.round((x.n / total) * 100) : 0;
          const noun = getCurrentLang() === EN_US ? 'reports' : getCurrentLang() === ES_ES ? 'denuncias' : 'denúncias';
          return `<div class="ouv-admin-item"><strong>${freqLabel(x.f)}</strong><span class="ouv-admin-item-meta">${x.n} ${noun} · ${pct}%</span></div>`;
        }).join('')}
      `;

      if (reportDetailList) {
        reportDetailList.innerHTML = reports.length
          ? reports.map((r) => {
              const freq = r.data?.frequencia || '-';
              const type = r.data?.tipo || '-';
              const urg = r.data?.urgencia || '-';
              const assigned = r.assignedProfessionalId ? proLabel(r.assignedProfessionalId) : '';
              return `
                <div class="ouv-admin-item">
                  <strong>${escapeHtml(r.protocol)}</strong>
                  <span class="ouv-admin-item-meta">
                    ${escapeHtml(formatDate(r.created))} · ${escapeHtml(labelStatus(r.status))} · ${escapeHtml(type)} · ${escapeHtml(freq)} · ${escapeHtml(urg)}${assigned ? ' · ' + escapeHtml(assigned) : ''}
                  </span>
                </div>
              `;
            }).join('')
          : `<div class="ouv-muted">${msg('noReportsByFilter')}</div>`;
      }
    }

    // Events
    document.getElementById('adminRefresh')?.addEventListener('click', async () => {
      await syncFromSupabase();
      renderPeople();
      renderProtocols();
      renderReport();
    });

    document.getElementById('protocolSearch')?.addEventListener('input', () => renderProtocols());
    document.getElementById('protocolStatusFilter')?.addEventListener('change', () => renderProtocols());

    document.getElementById('genReport')?.addEventListener('click', () => renderReport());
    document.getElementById('downloadCsv')?.addEventListener('click', () => {
      const reports = (() => {
        let r = filterReports();
        const startVal = document.getElementById('reportStart')?.value;
        const endVal = document.getElementById('reportEnd')?.value;
        const status = document.getElementById('reportStatus')?.value || 'all';
        if (startVal) {
          const start = new Date(startVal + 'T00:00:00');
          r = r.filter((x) => new Date(x.created) >= start);
        }
        if (endVal) {
          const end = new Date(endVal + 'T23:59:59');
          r = r.filter((x) => new Date(x.created) <= end);
        }
        if (status !== 'all') r = r.filter((x) => x.status === status);
        return r;
      })();

      const school = getSchoolFilter();
      const pros = loadPros().filter((p) => p.kind === 'profissional' && normalize(p.escola) && normalize(p.escola).includes(normalize(school)));
      const proById = new Map(pros.map((p) => [p.id, p]));
      const proLabel = (id) => {
        const pro = proById.get(id);
        if (!pro) return '';
        const prefix = pro.tipo === 'advogado' ? 'Advogado' : pro.tipo === 'psicologo' ? 'Psicólogo' : 'Profissional';
        return `${prefix}: ${pro.nome}`;
      };

      const header = ['protocolo', 'status', 'data', 'escola', 'tipo', 'frequencia', 'urgencia', 'profissional_atribuido'];
      const rows = reports.map((r) => [
        r.protocol,
        r.status,
        new Date(r.created).toISOString(),
        r.data?.escola || '',
        r.data?.tipo || '',
        r.data?.frequencia || '',
        r.data?.urgencia || '',
        r.assignedProfessionalId ? proLabel(r.assignedProfessionalId) : ''
      ]);
      const csv = [header, ...rows].map((row) => row.map((c) => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio_ouvidoria.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    document.getElementById('addFunc')?.addEventListener('click', () => {
      const nome = document.getElementById('funcNome')?.value.trim();
      const cargo = document.getElementById('funcCargo')?.value.trim();
      const contato = document.getElementById('funcContato')?.value.trim();
      const escola = getSchoolFilter();
      if (!nome || !escola) {
        alert(msg('employeeNameSchool'));
        return;
      }
      const people = loadPeople();
      people.push({ kind: 'funcionario', escola, nome, cargo, contato, created: new Date().toISOString() });
      savePeople(people);
      document.getElementById('funcNome').value = '';
      document.getElementById('funcCargo').value = '';
      document.getElementById('funcContato').value = '';
      renderPeople();
    });

    document.getElementById('addAluno')?.addEventListener('click', () => {
      const nome = document.getElementById('alunoNome')?.value.trim();
      const turma = document.getElementById('alunoTurma')?.value.trim();
      const responsavel = document.getElementById('alunoResp')?.value.trim();
      const escola = getSchoolFilter();
      if (!nome || !escola) {
        alert(msg('studentNameSchool'));
        return;
      }
      const people = loadPeople();
      people.push({ kind: 'aluno', escola, nome, turma, responsavel, created: new Date().toISOString() });
      savePeople(people);
      document.getElementById('alunoNome').value = '';
      document.getElementById('alunoTurma').value = '';
      document.getElementById('alunoResp').value = '';
      renderPeople();
    });

    document.getElementById('addPro')?.addEventListener('click', () => {
      const tipo = document.getElementById('proTipo')?.value;
      const nome = document.getElementById('proNome')?.value.trim();
      const contato = document.getElementById('proContato')?.value.trim();
      const escola = getSchoolFilter();
      if (!tipo || !nome || !escola) {
        alert(msg('professionalRequired'));
        return;
      }
      const pros = loadPros();
      pros.push({
        kind: 'profissional',
        id: 'pro_' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        escola,
        tipo,
        nome,
        contato,
        created: new Date().toISOString()
      });
      savePros(pros);
      document.getElementById('proTipo').value = '';
      document.getElementById('proNome').value = '';
      document.getElementById('proContato').value = '';
      renderPeople();
      renderProtocols();
      renderReport();
    });

    // Abre o Painel Administrativo apenas quando o usuário clicar em "Acesso Administrativo"
    if (accessBtn) {
      accessBtn.onclick = async () => {
        app.classList.remove('hidden');
        await syncFromSupabase();
        renderPeople();
        renderProtocols();
        renderReport();
      };
    }
  });

  // ===== Painel Administrativo do Site (3º bloco) =====
  const siteAdminPanelApp = document.getElementById('siteAdminApp');
  const siteAdminCodeInput = document.getElementById('siteAdminCode');
  document.getElementById('siteAdminLogin')?.addEventListener('click', async () => {
    const email = document.getElementById('siteAdminEmail')?.value.trim();
    const password = siteAdminCodeInput?.value;
    if (!siteAdminPanelApp) return;
    const ok = await sbSignIn(email, password);
    if (!ok) {
      alert(msg('invalidSiteAdminCode'));
      return;
    }
    siteAdminPanelApp.classList.remove('hidden');
    await syncFromSupabase();
    renderSiteProtocols();
  });

  function renderSiteProtocols() {
    const list = document.getElementById('siteProtocolsList');
    const empty = document.getElementById('siteProtocolsEmpty');
    const search = normalize(document.getElementById('siteProtocolSearch')?.value || '');
    const status = document.getElementById('siteStatusFilter')?.value || 'all';
    if (!list || !empty) return;

    const reports = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      } catch {
        return [];
      }
    })();

    const pros = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_PROS) || '[]');
      } catch {
        return [];
      }
    })();

    const proById = new Map(pros.filter((p) => p.kind === 'profissional').map((p) => [p.id, p]));
    const proLabel = (id) => {
      const pro = proById.get(id);
      if (!pro) return '';
      const prefix = pro.tipo === 'advogado' ? 'Advogado' : pro.tipo === 'psicologo' ? 'Psicólogo' : 'Profissional';
      return `${prefix}: ${pro.nome}`;
    };

    let filtered = reports;
    if (search) filtered = filtered.filter((r) => normalize(r.protocol).includes(search));
    if (status !== 'all') filtered = filtered.filter((r) => r.status === status);
    filtered.sort((a, b) => new Date(b.created) - new Date(a.created));

    if (!filtered.length) {
      list.innerHTML = '';
      empty.textContent = msg('noProtocols');
      return;
    }
    empty.textContent = '';

    list.innerHTML = filtered.map((r) => {
      const type = r.data?.tipo || '-';
      const freq = r.data?.frequencia || '-';
      const urg = r.data?.urgencia || '-';
      const assigned = r.assignedProfessionalId ? proLabel(r.assignedProfessionalId) : '';
      return `
        <div class="ouv-protocol-card" data-protocol="${escapeHtml(r.protocol)}">
          <div class="ouv-protocol-top">
            <div>
              <div class="ouv-protocol-proto"><strong>${escapeHtml(r.protocol)}</strong></div>
              <div class="ouv-muted">${escapeHtml(formatDateSite(r.created))}</div>
            </div>
            <div class="ouv-protocol-status">
              <label class="ouv-label-small">${msg('statusLabel')}</label>
              <select class="ouv-status-sel" data-protocol="${escapeHtml(r.protocol)}">
                ${getStatusListByLang().map((s) => `
                  <option ${toCanonicalStatus(r.status) === toCanonicalStatus(s) ? 'selected' : ''}>${s}</option>
                `).join('')}
              </select>
            </div>
          </div>
          <div class="ouv-protocol-meta">
            <span class="ouv-chip">${escapeHtml(type)}</span>
            <span class="ouv-chip">${msg('frequency')}: ${escapeHtml(freq)}</span>
            <span class="ouv-chip">${msg('urgency')}: ${escapeHtml(urg)}</span>
            ${assigned ? `<span class="ouv-chip">${escapeHtml(assigned)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.ouv-status-sel').forEach((sel) => {
      sel.addEventListener('change', () => {
        const protocol = sel.dataset.protocol;
        const newStatus = toCanonicalStatus(sel.value);
        setSiteStatus(protocol, newStatus);
        renderSiteProtocols();
      });
    });
  }

  function setSiteStatus(protocol, newStatus) {
    const arr = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      } catch {
        return [];
      }
    })();
    const item = arr.find((x) => x.protocol === protocol);
    if (!item) return;
    item.status = newStatus;
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    sbUpdate(protocol, { status: newStatus }).catch(() => { /* ignore */ });
  }

  function normalize(s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
  }

  function escapeHtml(str) {
    return (str || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDateSite(iso) {
    try {
      return new Date(iso).toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  }

  document.getElementById('siteProtocolSearch')?.addEventListener('input', () => renderSiteProtocols());
  document.getElementById('siteStatusFilter')?.addEventListener('change', () => renderSiteProtocols());
  document.getElementById('siteDownloadCsv')?.addEventListener('click', () => {
    const reports = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      } catch {
        return [];
      }
    })();
    const search = normalize(document.getElementById('siteProtocolSearch')?.value || '');
    const status = document.getElementById('siteStatusFilter')?.value || 'all';
    let filtered = reports;
    if (search) filtered = filtered.filter((r) => normalize(r.protocol).includes(search));
    if (status !== 'all') filtered = filtered.filter((r) => r.status === status);
    filtered.sort((a, b) => new Date(b.created) - new Date(a.created));

    const header = ['protocolo', 'status', 'data', 'escola', 'tipo', 'frequencia', 'urgencia', 'profissional_atribuido'];
    const rows = filtered.map((r) => ([
      r.protocol,
      r.status,
      new Date(r.created).toISOString(),
      r.data?.escola || '',
      r.data?.tipo || '',
      r.data?.frequencia || '',
      r.data?.urgencia || '',
      r.assignedProfessionalId || ''
    ]));
    const csv = [header, ...rows].map((row) => row.map((c) => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_admin_site.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  showStep(1);

  // Sincroniza as denúncias do banco assim que a página abre.
  syncFromSupabase().catch(() => { /* segue com dados locais */ });
})();
