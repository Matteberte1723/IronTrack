// features_v42.js — Calcolatore Dischi, Tag Serie, Superset Helpers, Sostituzione al volo & Sistema Badge (Awards)

export const SET_TAG_META = {
  normal: { key: 'normal', label: 'Normale', short: '', color: 'rgba(255,255,255,0.06)', textColor: '#fff', border: 'transparent' },
  warmup: { key: 'warmup', label: 'Riscaldamento', short: 'W', color: 'rgba(56, 189, 248, 0.16)', textColor: '#38bdf8', border: 'rgba(56, 189, 248, 0.45)' },
  dropset: { key: 'dropset', label: 'Drop Set', short: 'D', color: 'rgba(245, 158, 11, 0.16)', textColor: '#fbbf24', border: 'rgba(245, 158, 11, 0.45)' },
  failure: { key: 'failure', label: 'Cedimento', short: 'F', color: 'rgba(239, 68, 68, 0.18)', textColor: '#f87171', border: 'rgba(239, 68, 68, 0.45)' }
};

export const SET_TAG_ORDER = ['normal', 'warmup', 'dropset', 'failure'];

/**
 * Calcola i dischi per lato dato un peso totale e il peso del bilanciere.
 */
export const calculateBarbellPlates = (targetWeight, barWeight = 20, unit = 'kg') => {
  const availablePlates = unit === 'lbs'
    ? [45, 35, 25, 10, 5, 2.5]
    : [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];

  const total = Math.max(0, parseFloat(targetWeight) || 0);
  const bar = Math.max(0, parseFloat(barWeight) || 0);
  if (total <= bar) {
    return { perSide: [], remainder: 0, achieved: bar, perSideWeight: 0 };
  }

  let remainingPerSide = (total - bar) / 2;
  const perSide = [];

  for (const plate of availablePlates) {
    while (remainingPerSide + 1e-6 >= plate) {
      perSide.push(plate);
      remainingPerSide = Math.round((remainingPerSide - plate) * 1000) / 1000;
    }
  }

  const perSideWeight = perSide.reduce((a, b) => a + b, 0);
  const achieved = Math.round((bar + perSideWeight * 2) * 100) / 100;
  return {
    perSide,
    perSideWeight: Math.round(perSideWeight * 100) / 100,
    achieved,
    remainder: Math.round(remainingPerSide * 2 * 100) / 100
  };
};

const PLATE_COLORS = {
  25: { bg: '#ef4444', h: 66, w: 13 },
  20: { bg: '#3b82f6', h: 64, w: 12 },
  15: { bg: '#eab308', h: 56, w: 11 },
  10: { bg: '#22c55e', h: 48, w: 10 },
  5: { bg: '#f8fafc', h: 38, w: 9 },
  2.5: { bg: '#a855f7', h: 30, w: 8 },
  1.25: { bg: '#94a3b8', h: 24, w: 7 },
  0.5: { bg: '#64748b', h: 20, w: 6 },
  45: { bg: '#3b82f6', h: 66, w: 13 },
  35: { bg: '#eab308', h: 58, w: 11 }
};

/**
 * Modale Calcolatore Dischi Bilanciere (Bar + Plates)
 */
export const openPlateCalculatorModal = (initialWeight = 60, unit = 'kg') => {
  const existing = document.getElementById('plate-calc-modal');
  if (existing) existing.remove();

  let targetWeight = parseFloat(initialWeight) > 0 ? parseFloat(initialWeight) : (unit === 'lbs' ? 135 : 60);
  let barWeight = unit === 'lbs' ? 45 : 20;

  const overlay = document.createElement('div');
  overlay.id = 'plate-calc-modal';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 99995; display: flex; align-items: flex-end; justify-content: center;
  `;

  const renderInner = () => {
    const res = calculateBarbellPlates(targetWeight, barWeight, unit);
    const counts = {};
    res.perSide.forEach(p => { counts[p] = (counts[p] || 0) + 1; });

    const barOpts = unit === 'lbs'
      ? [{ v: 45, l: '45 lbs (Olimpico)' }, { v: 35, l: '35 lbs' }, { v: 20, l: '20 lbs (EZ)' }]
      : [{ v: 20, l: '20 kg (Olimpico)' }, { v: 15, l: '15 kg (Tecnico)' }, { v: 10, l: '10 kg (EZ/Corto)' }, { v: 0, l: '0 kg (Senza bil.)' }];

    overlay.innerHTML = `
      <div class="card" style="width:100%; max-width:500px; margin:0; border-radius:24px 24px 0 0; padding:20px 18px 28px; background:#11151c; border:1px solid rgba(255,255,255,0.12); border-bottom:none;">
        <div style="width:44px; height:5px; background:rgba(255,255,255,0.2); border-radius:3px; margin:0 auto 14px;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="margin:0; font-size:1.15rem; color:#fff;">🏋️ Calcolatore Dischi</h3>
            <div style="font-size:0.76rem; color:var(--text-secondary);">Dischi esatti da caricare per lato</div>
          </div>
          <button id="close-plate-calc" type="button" style="background:rgba(255,255,255,0.08); border:none; color:#cbd5e1; width:34px; height:34px; border-radius:50%; font-size:1.1rem; cursor:pointer;">✕</button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
          <div>
            <div class="card-subtitle">Peso Totale (${unit})</div>
            <input id="pc-target-input" type="number" step="0.5" value="${targetWeight}" style="margin:0; font-size:1.1rem; font-weight:800; text-align:center; color:var(--accent-color);">
          </div>
          <div>
            <div class="card-subtitle">Bilanciere</div>
            <select id="pc-bar-select" style="margin:0; font-size:0.85rem;">
              ${barOpts.map(o => `<option value="${o.v}" ${barWeight === o.v ? 'selected' : ''}>${o.l}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px;">
          ${[-10, -5, -2.5, +2.5, +5, +10].map(delta => `
            <button type="button" class="pc-step-btn" data-delta="${delta}" style="flex:1; min-width:48px; padding:6px 4px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:#fff; font-size:0.75rem; font-weight:700; cursor:pointer;">${delta > 0 ? '+' + delta : delta}</button>
          `).join('')}
        </div>

        <!-- Visualizzazione grafica bilanciere -->
        <div style="background:#0a0d14; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px 12px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; justify-content:center; gap:3px; min-height:76px; overflow-x:auto;">
            <div style="width:44px; height:8px; background:#64748b; border-radius:4px 0 0 4px;"></div>
            <div style="width:8px; height:22px; background:#94a3b8; border-radius:2px;"></div>
            ${res.perSide.length === 0
              ? `<span style="font-size:0.78rem; color:var(--text-secondary); padding:0 10px;">Solo bilanciere (${barWeight} ${unit})</span>`
              : res.perSide.map(p => {
                  const st = PLATE_COLORS[p] || { bg: 'var(--accent-color)', h: 36, w: 9 };
                  return `<div title="${p} ${unit}" style="width:${st.w}px; height:${st.h}px; background:${st.bg}; border-radius:3px; border:1px solid rgba(0,0,0,0.4); flex-shrink:0;"></div>`;
                }).join('')
            }
            <div style="width:20px; height:10px; background:#475569; border-radius:0 4px 4px 0;"></div>
          </div>

          <div style="text-align:center; margin-top:10px;">
            ${res.perSide.length > 0 ? `
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Carica su <strong style="color:#fff">CIASCUN LATO</strong> (${res.perSideWeight} ${unit}/lato):</div>
              <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
                ${Object.entries(counts).map(([plate, qty]) => `
                  <span style="background:rgba(200,255,0,0.14); border:1px solid rgba(200,255,0,0.35); color:var(--accent-color); padding:4px 10px; border-radius:999px; font-size:0.82rem; font-weight:800;">
                    ${qty} × ${plate} ${unit}
                  </span>
                `).join('')}
              </div>
            ` : ''}
            ${res.remainder > 0 ? `
              <div style="font-size:0.75rem; color:#fbbf24; margin-top:8px;">⚠️ Peso più vicino raggiungibile: <strong>${res.achieved} ${unit}</strong> (scarto ${res.remainder} ${unit})</div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    overlay.querySelector('#close-plate-calc').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#pc-target-input').addEventListener('input', (e) => {
      targetWeight = parseFloat(e.target.value) || 0;
      // update results without losing focus
      const next = calculateBarbellPlates(targetWeight, barWeight, unit);
      if (e.target === document.activeElement) {
        clearTimeout(overlay._reRenderTimer);
        overlay._reRenderTimer = setTimeout(() => {
          const val = targetWeight;
          renderInner();
          const inp = overlay.querySelector('#pc-target-input');
          if (inp) { inp.value = val; inp.focus(); }
        }, 250);
      }
      void next;
    });
    overlay.querySelector('#pc-bar-select').addEventListener('change', (e) => {
      barWeight = parseFloat(e.target.value) || 0;
      renderInner();
    });
    overlay.querySelectorAll('.pc-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        targetWeight = Math.max(0, Math.round((targetWeight + parseFloat(btn.dataset.delta)) * 10) / 10);
        renderInner();
      });
    });
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
  renderInner();
};

/**
 * Modale Sostituzione Esercizio al volo in sessione (solo oggi vs permanente)
 */
export const openReplaceExerciseModal = (currentEx, exerciseDB, getMuscleGroupFn, getExerciseImagesFn, onConfirm) => {
  const existing = document.getElementById('replace-ex-modal');
  if (existing) existing.remove();

  const currentMuscle = currentEx._muscle || getMuscleGroupFn(currentEx.name) || 'Petto';
  let selectedMuscle = currentMuscle;
  let query = '';
  let scope = 'today'; // 'today' | 'permanent'

  const muscles = ['Tutti', ...Object.keys(exerciseDB).filter(m => (exerciseDB[m] || []).length > 0)];
  const flatList = [];
  const seen = new Set();
  for (const [m, list] of Object.entries(exerciseDB)) {
    for (const name of list) {
      const k = name.toLowerCase();
      if (seen.has(k) || k === (currentEx.name || '').toLowerCase()) continue;
      seen.add(k);
      const imgMeta = getExerciseImagesFn ? getExerciseImagesFn(name) : null;
      flatList.push({ name, en: imgMeta?.en || '', muscle: m });
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'replace-ex-modal';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 99994; display: flex; align-items: flex-end; justify-content: center;
  `;

  overlay.innerHTML = `
    <div class="card" style="width:100%; max-width:520px; height:84vh; display:flex; flex-direction:column; margin:0; border-radius:24px 24px 0 0; padding:18px 16px 20px; background:#11151c; border:1px solid rgba(255,255,255,0.12); border-bottom:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <h3 style="margin:0; font-size:1.1rem; color:#fff;">🔄 Sostituisci Esercizio</h3>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Al posto di: <strong style="color:var(--accent-color)">${currentEx.name}</strong></div>
        </div>
        <button id="close-replace-modal" type="button" style="background:rgba(255,255,255,0.08); border:none; color:#cbd5e1; width:34px; height:34px; border-radius:50%; font-size:1.1rem; cursor:pointer;">✕</button>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <button type="button" id="rep-scope-today" style="padding:8px; border-radius:10px; font-size:0.78rem; font-weight:700; cursor:pointer; border:1px solid var(--accent-color); background:rgba(200,255,0,0.16); color:var(--accent-color);">Solo per oggi</button>
        <button type="button" id="rep-scope-perm" style="padding:8px; border-radius:10px; font-size:0.78rem; font-weight:700; cursor:pointer; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:#cbd5e1;">Salva nella scheda</button>
      </div>

      <input id="rep-search" type="search" placeholder="Cerca alternativa..." autocomplete="off" style="margin:0 0 10px 0; padding:10px 12px; border-radius:12px; background:#0a0d14; border:1px solid rgba(255,255,255,0.12); color:#fff; font-size:0.88rem;">
      <div id="rep-chips" style="display:flex; gap:6px; overflow-x:auto; padding-bottom:10px; margin-bottom:6px; flex-shrink:0;"></div>
      <div id="rep-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:6px;"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  const searchEl = overlay.querySelector('#rep-search');
  const chipsEl = overlay.querySelector('#rep-chips');
  const listEl = overlay.querySelector('#rep-list');
  const btnToday = overlay.querySelector('#rep-scope-today');
  const btnPerm = overlay.querySelector('#rep-scope-perm');

  const updateScopeUI = () => {
    btnToday.style.borderColor = scope === 'today' ? 'var(--accent-color)' : 'rgba(255,255,255,0.12)';
    btnToday.style.background = scope === 'today' ? 'rgba(200,255,0,0.16)' : 'rgba(255,255,255,0.04)';
    btnToday.style.color = scope === 'today' ? 'var(--accent-color)' : '#cbd5e1';
    btnPerm.style.borderColor = scope === 'permanent' ? 'var(--accent-color)' : 'rgba(255,255,255,0.12)';
    btnPerm.style.background = scope === 'permanent' ? 'rgba(200,255,0,0.16)' : 'rgba(255,255,255,0.04)';
    btnPerm.style.color = scope === 'permanent' ? 'var(--accent-color)' : '#cbd5e1';
  };

  btnToday.addEventListener('click', () => { scope = 'today'; updateScopeUI(); });
  btnPerm.addEventListener('click', () => { scope = 'permanent'; updateScopeUI(); });

  const renderChips = () => {
    chipsEl.innerHTML = muscles.map(m => {
      const active = m === selectedMuscle;
      return `<button type="button" data-m="${m}" style="flex-shrink:0; padding:5px 11px; border-radius:999px; font-size:0.74rem; font-weight:700; cursor:pointer; border:1px solid ${active ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}; background:${active ? 'rgba(200,255,0,0.16)' : 'rgba(255,255,255,0.04)'}; color:${active ? 'var(--accent-color)' : '#cbd5e1'};">${m}</button>`;
    }).join('');
    chipsEl.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { selectedMuscle = b.dataset.m; renderChips(); renderList(); });
    });
  };

  const renderList = () => {
    const q = query.trim().toLowerCase();
    const filtered = flatList.filter(item => {
      if (selectedMuscle !== 'Tutti' && item.muscle !== selectedMuscle) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.en.toLowerCase().includes(q);
    }).slice(0, 100);

    listEl.innerHTML = filtered.map(item => `
      <div class="rep-item" data-name="${item.name.replace(/"/g, '&quot;')}" data-muscle="${item.muscle}" style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); cursor:pointer;">
        <div>
          <div style="font-size:0.88rem; font-weight:600; color:#fff;">${item.name}</div>
          <div style="font-size:0.72rem; color:var(--accent-color);">${item.muscle}${item.en && item.en.toLowerCase() !== item.name.toLowerCase() ? ` · <span style="color:var(--text-secondary)">${item.en}</span>` : ''}</div>
        </div>
        <span style="font-size:0.8rem; color:var(--accent-color); font-weight:700;">Scegli →</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.rep-item').forEach(row => {
      row.addEventListener('click', () => {
        onConfirm(row.dataset.name, row.dataset.muscle, scope === 'permanent');
        overlay.remove();
      });
    });
  };

  searchEl.addEventListener('input', (e) => { query = e.target.value; renderList(); });
  overlay.querySelector('#close-replace-modal').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  renderChips();
  renderList();
};

/**
 * Sistema Badge / Premi (Awards) calcolato dai log locali
 */
export const computeAwards = (logs, routines, parseLogDateFn) => {
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeRoutines = Array.isArray(routines) ? routines : [];
  const totalWorkouts = safeLogs.length;

  let totalVolume = 0;
  let maxSessionVol = 0;
  let usedSuperset = safeRoutines.some(r => Array.isArray(r.exercises) && r.exercises.some(e => e.supersetWithNext));
  let usedWarmupCooldown = safeRoutines.some(r => r.includeWarmup || r.includeCooldown);
  const uniqueExercises = new Set();
  const weekKeys = new Set();

  safeLogs.forEach(l => {
    let sVol = 0;
    (l.exercises || []).forEach(ex => {
      if (ex.name) uniqueExercises.add(ex.name.trim().toLowerCase());
      if (ex.supersetGroup) usedSuperset = true;
      (ex.sets || []).forEach(s => {
        if (s.tag === 'warmup') return;
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps) || 0;
        sVol += w * r;
        if (s.dropWeight && s.dropReps) {
          sVol += (parseFloat(s.dropWeight) || 0) * (parseInt(s.dropReps) || 0);
        }
      });
    });
    totalVolume += sVol;
    if (sVol > maxSessionVol) maxSessionVol = sVol;
    if ((l.warmupDone && l.warmupDone.length > 0) || (l.cooldownDone && l.cooldownDone.length > 0)) {
      usedWarmupCooldown = true;
    }

    const d = parseLogDateFn ? parseLogDateFn(l) : (l.timestamp ? new Date(l.timestamp) : null);
    if (d && !isNaN(d.getTime())) {
      const tmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayNum = (tmp.getDay() + 6) % 7;
      tmp.setDate(tmp.getDate() - dayNum + 3);
      const firstThursday = new Date(tmp.getFullYear(), 0, 4);
      const weekNo = 1 + Math.round(((tmp - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
      weekKeys.add(tmp.getFullYear() * 100 + weekNo);
    }
  });

  // Calcola miglior streak di settimane consecutive
  const sortedWeeks = Array.from(weekKeys).sort((a, b) => a - b);
  let bestStreak = 0;
  let curStreak = 0;
  for (let i = 0; i < sortedWeeks.length; i++) {
    if (i === 0) {
      curStreak = 1;
    } else {
      const prev = sortedWeeks[i - 1];
      const curr = sortedWeeks[i];
      const isNext = (curr === prev + 1) || (Math.floor(curr / 100) === Math.floor(prev / 100) + 1 && prev % 100 >= 52 && curr % 100 === 1);
      curStreak = isNext ? curStreak + 1 : 1;
    }
    if (curStreak > bestStreak) bestStreak = curStreak;
  }

  const defs = [
    { id: 'first_wo', icon: '🌱', title: 'Primo Passo', desc: 'Completa 1 allenamento', unlocked: totalWorkouts >= 1, progress: `${Math.min(totalWorkouts, 1)}/1` },
    { id: 'wo_10', icon: '🔥', title: 'Costanza', desc: '10 allenamenti completati', unlocked: totalWorkouts >= 10, progress: `${Math.min(totalWorkouts, 10)}/10` },
    { id: 'wo_25', icon: '⚡', title: 'Abitudine d’Acciaio', desc: '25 allenamenti completati', unlocked: totalWorkouts >= 25, progress: `${Math.min(totalWorkouts, 25)}/25` },
    { id: 'wo_50', icon: '🦁', title: 'Veterano', desc: '50 allenamenti completati', unlocked: totalWorkouts >= 50, progress: `${Math.min(totalWorkouts, 50)}/50` },
    { id: 'wo_100', icon: '👑', title: 'Centurione', desc: '100 allenamenti completati', unlocked: totalWorkouts >= 100, progress: `${Math.min(totalWorkouts, 100)}/100` },
    { id: 'vol_1t', icon: '🏋️', title: 'Prima Tonnellata', desc: '1.000 kg in una sessione', unlocked: maxSessionVol >= 1000, progress: `${Math.min(Math.round(maxSessionVol), 1000)}/1000 kg` },
    { id: 'vol_10t', icon: '🚀', title: '10 Tonnellate', desc: '10.000 kg in una sessione', unlocked: maxSessionVol >= 10000, progress: `${Math.min(Math.round(maxSessionVol), 10000)}/10000 kg` },
    { id: 'vol_50t', icon: '🧱', title: '50 Tonnellate', desc: '50.000 kg totali sollevati', unlocked: totalVolume >= 50000, progress: `${Math.min(Math.round(totalVolume / 1000), 50)}/50 t` },
    { id: 'streak_4', icon: '📆', title: 'Mese Perfetto', desc: '4 settimane di fila attivo', unlocked: bestStreak >= 4, progress: `${Math.min(bestStreak, 4)}/4 sett.` },
    { id: 'ex_15', icon: '🎯', title: 'Atleta Completo', desc: '15+ esercizi diversi svolti', unlocked: uniqueExercises.size >= 15, progress: `${Math.min(uniqueExercises.size, 15)}/15` },
    { id: 'superset', icon: '🔗', title: 'Maestro Superset', desc: 'Crea o svolgi un Superset', unlocked: usedSuperset, progress: usedSuperset ? 'Sbloccato' : '0/1' },
    { id: 'mobility', icon: '🧘', title: 'Cura & Mobilità', desc: 'Usa Riscaldamento o Defaticamento', unlocked: usedWarmupCooldown, progress: usedWarmupCooldown ? 'Sbloccato' : '0/1' }
  ];

  return defs;
};

export const checkAndNotifyNewAwards = (logs, routines, parseLogDateFn) => {
  const awards = computeAwards(logs, routines, parseLogDateFn);
  const STORAGE_KEY = 'iron_track_seen_awards';
  let seen = [];
  try {
    seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { seen = []; }

  const seenSet = new Set(seen);
  const newlyUnlocked = awards.filter(a => a.unlocked && !seenSet.has(a.id));
  if (newlyUnlocked.length > 0) {
    const updated = awards.filter(a => a.unlocked).map(a => a.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
      z-index: 100005; background: linear-gradient(135deg, #161b24, #0d1117);
      border: 1px solid var(--accent-color); border-radius: 16px;
      padding: 12px 18px; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.7);
      display: flex; align-items: center; gap: 12px; max-width: 90vw;
      animation: fadeIn 0.25s ease-out;
    `;
    const first = newlyUnlocked[0];
    toast.innerHTML = `
      <span style="font-size: 1.7rem;">${first.icon}</span>
      <div>
        <div style="font-size: 0.72rem; color: var(--accent-color); font-weight: 800; text-transform: uppercase;">🏅 Premio Sbloccato!</div>
        <div style="font-size: 0.92rem; font-weight: 700;">${first.title}${newlyUnlocked.length > 1 ? ` (+${newlyUnlocked.length - 1} altri)` : ''}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }
  return awards;
};
