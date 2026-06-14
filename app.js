/**
 * ClimateCrop – Core Application Logic
 * Keys used from productivity.json: id, name, temp, rain, humid, risk, cat, padi, jagung, kedelai
 */

/* ─────────────────────────────────────────────
   CROP AGRONOMY PROFILES
   ───────────────────────────────────────────── */
const CROPS = {
  padi: {
    key: 'padi',
    name: 'Padi',
    emoji: '🌾',
    idealTemp: 27.0,
    idealRain: 200,
    idealHumid: 82,
    maxProd: 5.9,           // national max ton/ha
    plantingWindow: 'November – Februari (Musim Hujan)'
  },
  jagung: {
    key: 'jagung',
    name: 'Jagung',
    emoji: '🌽',
    idealTemp: 26.5,
    idealRain: 140,
    idealHumid: 74,
    maxProd: 6.1,
    plantingWindow: 'Maret – Juni (Musim Pancaroba / Kemarau I)'
  },
  kedelai: {
    key: 'kedelai',
    name: 'Kedelai',
    emoji: '🫘',
    idealTemp: 26.8,
    idealRain: 115,
    idealHumid: 70,
    maxProd: 1.5,
    plantingWindow: 'Juli – Oktober (Musim Kemarau II)'
  }
};

/* ─────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────── */
const FALLBACK_DB = [
  { "id": "aceh", "name": "Aceh", "svg_id": "Aceh", "temp": 27.2, "rain": 195, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 5.4, "jagung": 5.2, "kedelai": 1.4 },
  { "id": "sumatera-utara", "name": "Sumatera Utara", "svg_id": "Sumatera-Utara", "temp": 26.8, "rain": 220, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 5.2, "jagung": 6.1, "kedelai": 1.3 },
  { "id": "sumatera-barat", "name": "Sumatera Barat", "svg_id": "Sumatera-Barat", "temp": 26.5, "rain": 280, "humid": 86, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.9, "jagung": 5.8, "kedelai": 1.2 },
  { "id": "riau", "name": "Riau", "svg_id": "Riau", "temp": 27.5, "rain": 210, "humid": 83, "risk": "Sedang", "cat": "Tropis Basah (Af)", "padi": 3.8, "jagung": 4.1, "kedelai": 1.0 },
  { "id": "kepulauan-riau", "name": "Kepulauan Riau", "svg_id": "Kepulauan-Riau", "temp": 27.8, "rain": 190, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.2, "jagung": 3.5, "kedelai": 0.9 },
  { "id": "jambi", "name": "Jambi", "svg_id": "Jambi", "temp": 27.0, "rain": 200, "humid": 83, "risk": "Sedang", "cat": "Tropis Basah (Af)", "padi": 4.3, "jagung": 4.8, "kedelai": 1.1 },
  { "id": "bengkulu", "name": "Bengkulu", "svg_id": "Bengkulu", "temp": 26.9, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.5, "jagung": 4.7, "kedelai": 1.1 },
  { "id": "sumatera-selatan", "name": "Sumatera Selatan", "svg_id": "Sumatera-Selatan", "temp": 27.3, "rain": 180, "humid": 81, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 5.1, "jagung": 5.5, "kedelai": 1.3 },
  { "id": "kepulauan-bangka-belitung", "name": "Kepulauan Bangka Belitung", "svg_id": "Pulau-Bangka", "temp": 27.1, "rain": 185, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 3.5, "jagung": 3.8, "kedelai": 0.9 },
  { "id": "lampung", "name": "Lampung", "svg_id": "Lampung", "temp": 27.0, "rain": 170, "humid": 80, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 5.3, "jagung": 5.9, "kedelai": 1.4 },
  { "id": "banten", "name": "Banten", "svg_id": "Banten", "temp": 27.4, "rain": 160, "humid": 79, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 5.5, "jagung": 4.9, "kedelai": 1.3 },
  { "id": "dki-jakarta", "name": "DKI Jakarta", "svg_id": "Indonesia-Map", "temp": 28.2, "rain": 140, "humid": 76, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "padi": 4.8, "jagung": 3.0, "kedelai": 0.8 },
  { "id": "jawa-barat", "name": "Jawa Barat", "svg_id": "Jawa-Barat", "temp": 26.3, "rain": 210, "humid": 81, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 5.7, "jagung": 5.4, "kedelai": 1.5 },
  { "id": "jawa-tengah", "name": "Jawa Tengah", "svg_id": "Jawa-Tengah", "temp": 26.8, "rain": 175, "humid": 80, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 5.8, "jagung": 5.6, "kedelai": 1.4 },
  { "id": "di-yogyakarta", "name": "DI Yogyakarta", "svg_id": "Daerah-Istimewa-Yogyakarta", "temp": 26.7, "rain": 150, "humid": 79, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "padi": 5.6, "jagung": 5.0, "kedelai": 1.3 },
  { "id": "jawa-timur", "name": "Jawa Timur", "svg_id": "Jawa-Timur", "temp": 27.1, "rain": 145, "humid": 78, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "padi": 5.9, "jagung": 5.7, "kedelai": 1.5 },
  { "id": "bali", "name": "Bali", "svg_id": "Bali", "temp": 27.2, "rain": 130, "humid": 77, "risk": "Sedang", "cat": "Sabana Tropis (Aw)", "padi": 5.8, "jagung": 4.5, "kedelai": 1.2 },
  { "id": "nusa-tenggara-barat", "name": "Nusa Tenggara Barat", "svg_id": "Nusa-Tenggara-Barat", "temp": 27.5, "rain": 110, "humid": 75, "risk": "Tinggi", "cat": "Sabana Tropis (Aw)", "padi": 5.4, "jagung": 5.3, "kedelai": 1.3 },
  { "id": "nusa-tenggara-timur", "name": "Nusa Tenggara Timur", "svg_id": "Nusa-Tenggara-Timur", "temp": 27.8, "rain": 90, "humid": 72, "risk": "Tinggi", "cat": "Sabana Tropis (Aw)", "padi": 3.9, "jagung": 4.2, "kedelai": 1.1 },
  { "id": "kalimantan-barat", "name": "Kalimantan Barat", "svg_id": "Kalimantan-Barat", "temp": 27.0, "rain": 260, "humid": 85, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.2, "jagung": 4.5, "kedelai": 1.0 },
  { "id": "kalimantan-tengah", "name": "Kalimantan Tengah", "svg_id": "Kalimantan-Tengah", "temp": 27.1, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.6, "jagung": 4.8, "kedelai": 1.1 },
  { "id": "kalimantan-selatan", "name": "Kalimantan Selatan", "svg_id": "Kalimantan-Selatan", "temp": 27.2, "rain": 210, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 4.2, "jagung": 5.0, "kedelai": 1.2 },
  { "id": "kalimantan-timur", "name": "Kalimantan Timur", "svg_id": "Kalimantan-Utara---Kalimantan-Timur", "temp": 27.3, "rain": 200, "humid": 83, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.8, "jagung": 4.6, "kedelai": 1.0 },
  { "id": "kalimantan-utara", "name": "Kalimantan Utara", "svg_id": "Kalimantan-Utara---Kalimantan-Timur", "temp": 27.0, "rain": 220, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.7, "jagung": 4.4, "kedelai": 0.9 },
  { "id": "sulawesi-utara", "name": "Sulawesi Utara", "svg_id": "Sulawesi-Utara", "temp": 26.5, "rain": 190, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.8, "jagung": 5.1, "kedelai": 1.2 },
  { "id": "gorontalo", "name": "Gorontalo", "svg_id": "Gorontalo", "temp": 27.4, "rain": 140, "humid": 78, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 5.0, "jagung": 5.6, "kedelai": 1.3 },
  { "id": "sulawesi-tengah", "name": "Sulawesi Tengah", "svg_id": "Sulawesi-Tengah", "temp": 26.8, "rain": 160, "humid": 81, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 4.7, "jagung": 5.2, "kedelai": 1.2 },
  { "id": "sulawesi-barat", "name": "Sulawesi Barat", "svg_id": "Sulawesi-Barat", "temp": 26.9, "rain": 180, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Am)", "padi": 4.9, "jagung": 4.9, "kedelai": 1.1 },
  { "id": "sulawesi-selatan", "name": "Sulawesi Selatan", "svg_id": "Sulawesi-Selatan", "temp": 27.1, "rain": 170, "humid": 80, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 5.3, "jagung": 5.5, "kedelai": 1.4 },
  { "id": "sulawesi-tenggara", "name": "Sulawesi Tenggara", "svg_id": "Sulawesi-Tenggara", "temp": 27.0, "rain": 180, "humid": 81, "risk": "Sedang", "cat": "Tropis Muson (Am)", "padi": 4.1, "jagung": 4.6, "kedelai": 1.1 },
  { "id": "maluku", "name": "Maluku", "svg_id": "Maluku", "temp": 27.2, "rain": 230, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.2, "jagung": 3.9, "kedelai": 1.0 },
  { "id": "maluku-utara", "name": "Maluku Utara", "svg_id": "Maluku-Utara", "temp": 27.3, "rain": 210, "humid": 83, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.9, "jagung": 4.0, "kedelai": 0.9 },
  { "id": "papua-barat", "name": "Papua Barat", "svg_id": "Papua-Barat", "temp": 26.8, "rain": 250, "humid": 85, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.1, "jagung": 4.2, "kedelai": 1.1 },
  { "id": "papua-barat-daya", "name": "Papua Barat Daya", "svg_id": "Papua-Barat", "temp": 26.9, "rain": 260, "humid": 86, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.0, "jagung": 4.1, "kedelai": 1.0 },
  { "id": "papua", "name": "Papua", "svg_id": "Papua", "temp": 27.0, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 4.2, "jagung": 4.3, "kedelai": 1.1 },
  { "id": "papua-selatan", "name": "Papua Selatan", "svg_id": "Papua", "temp": 27.1, "rain": 200, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "padi": 4.4, "jagung": 4.5, "kedelai": 1.2 },
  { "id": "papua-tengah", "name": "Papua Tengah", "svg_id": "Papua", "temp": 25.5, "rain": 280, "humid": 87, "risk": "Rendah", "cat": "Tropis Basah (Af)", "padi": 3.8, "jagung": 4.0, "kedelai": 0.9 },
  { "id": "papua-pegunungan", "name": "Papua Pegunungan", "svg_id": "Papua", "temp": 19.5, "rain": 310, "humid": 89, "risk": "Rendah", "cat": "Pegunungan (Cfb)", "padi": 3.0, "jagung": 3.8, "kedelai": 0.8 }
];

let DB = [];           // loaded from productivity.json
let selectedProv = null;

/* ─────────────────────────────────────────────
   BOOT
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', boot);

async function boot() {
  // 1. Load province data
  try {
    DB = await fetch('./data/productivity.json').then(r => {
      if (!r.ok) throw new Error('HTTP error ' + r.status);
      return r.json();
    });
    if (!DB || DB.length === 0) {
      throw new Error('Data provinsi kosong');
    }
  } catch (error) {
    console.error(error);
    DB = FALLBACK_DB;
  }

  // 2. Build province dropdown (sorted A–Z)
  buildProvinceDropdown();

  // 3. Load SVG map
  await loadSVGMap();

  // 4. Bind events
  bindNav();
  bindForm();
  bindMonitoring();

  // 5. Pre-select first province
  selectProvince('aceh');

  // 6. Initial history render
  renderHistory();
}

/* ─────────────────────────────────────────────
   PROVINCE DROPDOWN
   ───────────────────────────────────────────── */
function buildProvinceDropdown() {
  const sel = document.getElementById('province-select');
  if (!sel) return;
  const sorted = [...DB].sort((a, b) => a.name.localeCompare(b.name, 'id'));
  sorted.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
}

/* ─────────────────────────────────────────────
   SVG MAP LOADING
   ───────────────────────────────────────────── */
async function loadSVGMap() {
  // SVG Map is disabled; replaced by National Agriculture Information Panel
  return;
}

function bindMapListeners() {
  const mapWrap = document.querySelector('.map-box');
  const tooltip = document.getElementById('map-tooltip');
  if (!mapWrap) return;

  mapWrap.addEventListener('mouseover', e => {
    const g = e.target.closest('.province-group');
    if (!g || !tooltip) return;
    const pid = g.dataset.provinceId;
    const prov = DB.find(p => p.id === pid);
    if (prov) {
      tooltip.textContent = prov.name;
      tooltip.style.opacity = '1';
    }
  });

  mapWrap.addEventListener('mousemove', e => {
    if (!tooltip || tooltip.style.opacity === '0') return;
    const rect = mapWrap.getBoundingClientRect();
    tooltip.style.left = (e.clientX - rect.left + 14) + 'px';
    tooltip.style.top  = (e.clientY - rect.top  + 14) + 'px';
  });

  mapWrap.addEventListener('mouseleave', () => {
    if (tooltip) tooltip.style.opacity = '0';
  });

  mapWrap.addEventListener('click', e => {
    const g = e.target.closest('.province-group');
    if (!g) return;
    selectProvince(g.dataset.provinceId);
    if (window.innerWidth < 900) {
      document.getElementById('analisis').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ─────────────────────────────────────────────
   SELECT PROVINCE
   ───────────────────────────────────────────── */
function selectProvince(id) {
  if (!id) return;
  const prov = DB.find(p => p.id === id);
  const sel = document.getElementById('province-select');

  if (!prov) {
    selectedProv = null;
    if (sel) {
      showInputError(sel, 'Data provinsi belum tersedia.');
    }
    
    // Reset climate card values
    const set = (cid, val) => { const el = document.getElementById(cid); if (el) el.textContent = val; };
    set('ci-temp',  '–');
    set('ci-rain',  '–');
    set('ci-humid', '–');
    set('ci-risk',  '–');
    set('ci-cat',   'Data provinsi belum tersedia.');
    
    const riskEl = document.getElementById('ci-risk');
    if (riskEl) {
      const row = riskEl.closest('.climate-item');
      if (row) row.classList.remove('risk-high', 'risk-med', 'risk-low');
    }
    return;
  }

  selectedProv = prov;

  // Sync dropdown
  if (sel && sel.value !== id) sel.value = id;

  // Clear validation styling if present
  if (sel) {
    sel.classList.remove('is-invalid');
    const feedback = sel.parentNode.querySelector('.invalid-feedback');
    if (feedback) feedback.style.display = 'none';
  }

  // Sync map active state
  document.querySelectorAll('.province-group').forEach(g => {
    g.classList.toggle('map-active', g.dataset.provinceId === id);
  });

  // Update climate auto-card
  renderClimateCard(prov);
}

/* ─────────────────────────────────────────────
   CLIMATE CARD
   ───────────────────────────────────────────── */
function renderClimateCard(prov) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('ci-temp',  `${prov.temp} °C`);
  set('ci-rain',  `${prov.rain} mm/bulan`);
  set('ci-humid', `${prov.humid}%`);
  set('ci-risk',  prov.risk);
  set('ci-cat',   prov.cat);

  // Risk badge class on parent climate-item
  const riskEl = document.getElementById('ci-risk');
  if (riskEl) {
    const row = riskEl.closest('.climate-item');
    if (row) {
      row.classList.remove('risk-high', 'risk-med', 'risk-low');
      if (prov.risk === 'Tinggi') row.classList.add('risk-high');
      else if (prov.risk === 'Sedang') row.classList.add('risk-med');
      else row.classList.add('risk-low');
    }
  }
}

/* ─────────────────────────────────────────────
   FORM BINDINGS
   ───────────────────────────────────────────── */
function bindForm() {
  // Province dropdown → select province
  const provSel = document.getElementById('province-select');
  if (provSel) provSel.addEventListener('change', e => selectProvince(e.target.value));

  // Land Area → clear validation error on input
  const landAreaInput = document.getElementById('land-area');
  if (landAreaInput) {
    landAreaInput.addEventListener('input', () => {
      landAreaInput.classList.remove('is-invalid');
      const feedback = landAreaInput.parentNode.querySelector('.invalid-feedback');
      if (feedback) feedback.style.display = 'none';
    });
  }

  // Planting Month → clear validation error on change
  const plantingMonthSel = document.getElementById('planting-month');
  if (plantingMonthSel) {
    plantingMonthSel.addEventListener('change', () => {
      plantingMonthSel.classList.remove('is-invalid');
      const feedback = plantingMonthSel.parentNode.querySelector('.invalid-feedback');
      if (feedback) feedback.style.display = 'none';
    });
  }

  // Mode switch → show/hide specific crop
  const modeSel = document.getElementById('analysis-mode');
  const condField = document.getElementById('cond-crop');
  if (modeSel && condField) {
    modeSel.addEventListener('change', () => {
      condField.classList.toggle('show', modeSel.value === 'specific');
    });
  }

  // Radio pills active state
  document.querySelectorAll('.radio-pill input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
        r.closest('.radio-pill').querySelector('.radio-pill-label').style.fontWeight = '';
      });
    });
  });

  // Form submit
  const form = document.getElementById('analysis-form');
  if (form) form.addEventListener('submit', e => { e.preventDefault(); runAnalysis(); });
}

/* ─────────────────────────────────────────────
   SCORING ALGORITHM
   40% Climate + 20% Water + 20% Land + 20% Productivity
   ───────────────────────────────────────────── */
function scoreCrop(prov, cropKey, water, land) {
  const crop = CROPS[cropKey];

  /* Climate Score */
  const tempSuit  = Math.max(0, 100 - Math.abs(prov.temp  - crop.idealTemp)  * 14);
  const rainSuit  = Math.max(0, 100 - Math.abs(prov.rain  - crop.idealRain)  * 0.38);
  const humidSuit = Math.max(0, 100 - Math.abs(prov.humid - crop.idealHumid) * 2.8);
  const climate   = Math.round(tempSuit * 0.30 + rainSuit * 0.50 + humidSuit * 0.20);

  /* Water Score */
  const waterMap = {
    padi:    { melimpah: 100, sedang: 72,  rendah: 28  },
    jagung:  { sedang: 100,   melimpah: 78, rendah: 52 },
    kedelai: { sedang: 100,   rendah: 72,  melimpah: 42 }
  };
  const waterScore = waterMap[cropKey][water] ?? 50;

  /* Land Score */
  const landMap = {
    padi:    { irigasi: 100, 'tadah-hujan': 84, kering: 38, perkebunan: 10 },
    jagung:  { kering: 100,  'tadah-hujan': 84, irigasi: 58, perkebunan: 30 },
    kedelai: { kering: 100,  'tadah-hujan': 78, irigasi: 48, perkebunan: 40 }
  };
  const landScore = landMap[cropKey][land] ?? 40;

  /* Productivity Score – normalized to national max */
  const prodRaw   = prov[cropKey] ?? 1;
  const prodScore = Math.min(100, Math.round((prodRaw / crop.maxProd) * 100));

  /* Weighted total */
  const total = Math.round(climate * 0.4 + waterScore * 0.2 + landScore * 0.2 + prodScore * 0.2);

  return {
    total: Math.min(100, total),
    breakdown: { climate, water: waterScore, land: landScore, productivity: prodScore },
    prodRaw
  };
}

/* ─────────────────────────────────────────────
   RUN ANALYSIS
   ───────────────────────────────────────────── */
function runAnalysis() {
  clearFormErrors();

  const provEl = document.getElementById('province-select');
  const areaEl = document.getElementById('land-area');
  const monthEl = document.getElementById('planting-month');

  // Fallback check to sync selectedProv if dropdown was changed
  if (!selectedProv && provEl.value) {
    selectedProv = DB.find(p => p.id === provEl.value);
  }

  let hasError = false;

  // 1. Validate Province
  if (!selectedProv || !provEl.value) {
    showInputError(provEl, 'Data provinsi belum tersedia.');
    hasError = true;
  }

  // 2. Validate Land Area
  const area = parseFloat(areaEl.value);
  if (isNaN(area) || area <= 0) {
    showInputError(areaEl, 'Luas lahan wajib diisi dengan angka lebih besar dari 0.');
    hasError = true;
  }

  // 3. Validate Planting Month
  if (!monthEl.value) {
    showInputError(monthEl, 'Bulan rencana tanam wajib dipilih.');
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const water = document.querySelector('input[name="water"]:checked')?.value  || 'sedang';
  const land  = document.querySelector('input[name="land"]:checked')?.value   || 'irigasi';
  const mode  = document.getElementById('analysis-mode').value;
  const specificKey = document.getElementById('specific-crop-select')?.value || 'padi';

  // Toggle button loading spinner
  const submitBtn = document.querySelector('#analysis-form button[type="submit"]');
  let originalBtnHtml = '';
  if (submitBtn) {
    originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses Analisis...`;
  }

  /* Show skeleton */
  switchResultState('skeleton');

  setTimeout(() => {
    let bestKey, bestResult;

    if (mode === 'auto') {
      const results = Object.keys(CROPS).map(k => ({ key: k, ...scoreCrop(selectedProv, k, water, land) }));
      const best = results.reduce((a, b) => b.total > a.total ? b : a);
      bestKey    = best.key;
      bestResult = best;
    } else {
      bestKey    = specificKey;
      bestResult = { key: specificKey, ...scoreCrop(selectedProv, specificKey, water, land) };
    }

    const crop       = CROPS[bestKey];
    const score      = bestResult.total;
    const yieldPerHa = (bestResult.prodRaw * (score / 100)).toFixed(2);
    const yieldTotal = (yieldPerHa * area).toFixed(2);

    /* Update DOM */
    setText('res-crop-name',  `${crop.emoji} ${crop.name}`);
    setText('res-score-val',   score);
    setText('res-yield-ha',   `${yieldPerHa} Ton/Ha`);
    setText('res-yield-total',`${yieldTotal} Ton`);
    setText('res-time',        crop.plantingWindow);

    const riskEl = document.getElementById('res-risk');
    if (riskEl) {
      riskEl.textContent = selectedProv.risk;
      riskEl.className = 'badge';
      riskEl.classList.add('badge-' + selectedProv.risk.toLowerCase());
    }

    /* Progress bars */
    setBar('bar-climate',    bestResult.breakdown.climate);
    setBar('bar-water',      bestResult.breakdown.water);
    setBar('bar-land',       bestResult.breakdown.land);
    setBar('bar-prod',       bestResult.breakdown.productivity);

    /* Advice narrative */
    setText('res-advice', `Analisis agronomi untuk komoditas ${crop.name} di ${selectedProv.name} menunjukkan kecocokan ${score}%. Dengan luas lahan ${area} Ha, estimasi panen mencapai ${yieldTotal} Ton. Waktu tanam optimal: ${crop.plantingWindow}.`);

    /* Radar chart */
    ChartManager.renderRadarChart('radar-chart', bestResult.breakdown);

    /* Save history */
    StorageManager.saveRecord({
      province:   selectedProv.name,
      area,
      commodity:  crop.name,
      yieldTotal,
      score,
      risk:       selectedProv.risk
    });
    renderHistory();

    // Restore button loading spinner state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    /* Show results */
    switchResultState('output');

    /* Scroll to results */
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 850);
}

/* ─────────────────────────────────────────────
   RESULT STATE MACHINE
   ───────────────────────────────────────────── */
function switchResultState(state) {
  const ph  = document.getElementById('res-placeholder');
  const sk  = document.getElementById('res-skeleton');
  const out = document.getElementById('res-output');

  ph .style.display = state === 'placeholder' ? 'flex' : 'none';
  sk .classList.toggle('show', state === 'skeleton');
  out.classList.toggle('show', state === 'output');
}

/* ─────────────────────────────────────────────
   HISTORY TABLE
   ───────────────────────────────────────────── */
function renderHistory() {
  const query  = document.getElementById('hist-search')?.value  || '';
  const filter = document.getElementById('hist-filter')?.value || '';
  const tbody  = document.getElementById('hist-body');
  if (!tbody) return;

  const records = StorageManager.filterHistory(query, filter);

  if (!records.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8" style="text-align:center;padding:40px;color:#4B5563">Belum ada riwayat analisis atau hasil pencarian kosong.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map((r, i) => {
    const cropCls = r.commodity === 'Padi' ? 'padi' : r.commodity === 'Jagung' ? 'jagung' : 'kedelai';
    const riskCls = r.risk?.toLowerCase() || 'sedang';
    return `
      <tr>
        <td>${i + 1}</td>
        <td style="white-space:nowrap">${r.date}</td>
        <td style="font-weight:600;color:#E2E8F0">${r.province}</td>
        <td>${r.area} Ha</td>
        <td><span class="badge badge-${cropCls}">${r.commodity}</span></td>
        <td style="font-weight:700;color:#fff">${r.yieldTotal} Ton</td>
        <td><span style="font-weight:800;color:#43A047">${r.score}%</span></td>
        <td><button class="btn btn-red btn-sm del-btn" data-id="${r.id}">Hapus</button></td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Hapus riwayat ini?')) {
        StorageManager.deleteRecord(btn.dataset.id);
        renderHistory();
      }
    });
  });
}

/* ─────────────────────────────────────────────
   MONITORING BINDINGS
   ───────────────────────────────────────────── */
function bindMonitoring() {
  const search   = document.getElementById('hist-search');
  const filter   = document.getElementById('hist-filter');
  const clearBtn = document.getElementById('btn-clear-hist');
  const csvBtn   = document.getElementById('btn-export-csv');
  const pdfBtn   = document.getElementById('btn-export-pdf');

  if (search)   search.addEventListener('input',   renderHistory);
  if (filter)   filter.addEventListener('change',  renderHistory);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Hapus seluruh riwayat?')) { StorageManager.clearHistory(); renderHistory(); }
  });
  if (csvBtn) csvBtn.addEventListener('click', StorageManager.exportCSV);
  if (pdfBtn) pdfBtn.addEventListener('click', StorageManager.exportPDF);
}

/* ─────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────── */
function bindNav() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);

    // Highlight active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('#nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  burger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  document.querySelectorAll('#nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function setBar(id, val) {
  const fill = document.getElementById(id + '-fill');
  const label = document.getElementById(id + '-val');
  if (fill)  fill.style.width = val + '%';
  if (label) label.textContent = val + '%';
}

function showInputError(inputEl, message) {
  inputEl.classList.add('is-invalid');
  let feedback = inputEl.parentNode.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = document.createElement('span');
    feedback.className = 'invalid-feedback';
    inputEl.parentNode.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.display = 'block';
}

function clearFormErrors() {
  document.querySelectorAll('.form-control.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
  document.querySelectorAll('.invalid-feedback').forEach(el => {
    el.style.display = 'none';
  });
}

function showFetchError() {
  const form = document.getElementById('analysis-form');
  if (!form) return;

  // Check if error banner already exists
  if (form.querySelector('.error-banner')) return;

  const errBanner = document.createElement('div');
  errBanner.className = 'error-banner';
  errBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat data komoditas pertanian nasional (productivity.json). Pastikan file tersedia dan web server berjalan.`;
  form.prepend(errBanner);

  const sel = document.getElementById('province-select');
  if (sel) {
    sel.innerHTML = '<option value="" disabled selected>Gagal memuat data provinsi…</option>';
  }
}
