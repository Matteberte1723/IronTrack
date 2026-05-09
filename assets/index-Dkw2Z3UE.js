(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=t.getRoutines(),a=t.getLogs();i.length===0&&(i=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0},{name:`Rematore`,sets:3,reps:`10-12`,weight:50},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20}]}],t.saveRoutines(i));var o=()=>{let e=a[0]||{routineName:`Nessun allenamento`,date:`-`};n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">Bentornato,</div>
        <div class="card-title" style="font-size: 1.5rem">Pronto per spingere? ⚡️</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${a.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Volume Settimanale</div>
          <div class="stat-value">12.4k</div>
        </div>
      </div>

      <div class="card">
        <div class="card-subtitle">Ultima sessione</div>
        <div class="card-title">${e.routineName}</div>
        <div class="card-subtitle">${e.date}</div>
      </div>

      <div style="padding: 0 16px">
        <button class="btn" id="start-quick">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M5 3l14 9-14 9V3z"/>
          </svg>
          Inizia Allenamento
        </button>
      </div>
    </div>
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{f(`routines`)})},s=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
      </div>
      
      <div id="routines-list">
        ${i.map(e=>`
          <div class="card routine-card" data-id="${e.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start">
              <div>
                <div class="card-title">${e.name}</div>
                <div class="card-subtitle">${e.exercises.length} esercizi</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{c()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,()=>{l(e.getAttribute(`data-id`))})})},c=()=>{let e=[{name:``,sets:3,reps:`10`,weight:0}],r=()=>{n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px">
          <button id="cancel-add" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Nuova Scheda</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Nome Scheda</div>
          <input type="text" id="routine-name-input" placeholder="es. Gambe & Glutei" style="font-size: 1.1rem; font-weight: 600">
        </div>

        <div id="exercises-container">
          ${e.map((t,n)=>`
            <div class="card exercise-form-card" data-index="${n}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${n+1}</span>
                ${e.length>1?`<button class="remove-ex" data-index="${n}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>`:``}
              </div>
              <input type="text" class="ex-name" placeholder="Nome esercizio" value="${t.name}">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${t.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${t.reps}">
                </div>
              </div>
            </div>
          `).join(``)}
        </div>

        <div style="padding: 0 16px 20px">
          <button class="btn btn-secondary" id="add-ex-row" style="margin-bottom: 12px">
            + Aggiungi Esercizio
          </button>
          <button class="btn" id="save-routine">
            Salva Scheda
          </button>
        </div>
      </div>
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>s()),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{a(),e.push({name:``,sets:3,reps:`10`,weight:0}),r()}),document.querySelectorAll(`.remove-ex`).forEach(t=>{t.addEventListener(`click`,()=>{a();let n=parseInt(t.getAttribute(`data-index`));e.splice(n,1),r()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{a();let n=document.getElementById(`routine-name-input`).value;if(!n)return alert(`Inserisci un nome per la scheda`);let r={id:Date.now(),name:n,exercises:e.filter(e=>e.name.trim()!==``)};if(r.exercises.length===0)return alert(`Aggiungi almeno un esercizio`);i.push(r),t.saveRoutines(i),s()})},a=()=>{document.querySelectorAll(`.exercise-form-card`).forEach((t,n)=>{e[n].name=t.querySelector(`.ex-name`).value,e[n].sets=parseInt(t.querySelector(`.ex-sets`).value),e[n].reps=t.querySelector(`.ex-reps`).value})};r()},l=e=>{let r=i.find(t=>t.id==e);n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px">
        <button id="back-to-routines" style="background: none; border: none; color: var(--accent-color); font-weight: 600; cursor: pointer">← Annulla</button>
        <h2 style="font-size: 1.2rem">${r.name}</h2>
      </header>

      ${r.exercises.map((e,t)=>`
        <div class="card">
          <div class="card-title" style="color: var(--accent-color)">${e.name}</div>
          <div class="card-subtitle">${e.sets} serie × ${e.reps}</div>
          
          <div style="margin-top: 15px">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; color: var(--text-secondary); font-size: 0.7rem; margin-bottom: 5px">
              <div>SET</div>
              <div>KG</div>
              <div>REPS</div>
            </div>
            ${Array.from({length:e.sets}).map((t,n)=>`
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px">
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${n+1}</div>
                <input type="number" value="${e.weight}" style="margin: 0; text-align: center">
                <input type="number" placeholder="${e.reps}" style="margin: 0; text-align: center">
              </div>
            `).join(``)}
          </div>
        </div>
      `).join(``)}

      <div style="padding: 16px">
        <button class="btn" id="finish-workout" style="background: var(--success)">
          Concludi Allenamento
        </button>
      </div>
    </div>
  `,document.getElementById(`back-to-routines`).addEventListener(`click`,()=>s()),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now()}),a=t.getLogs(),f(`dashboard`),alert(`Allenamento salvato con successo! 🔥`)})},u=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${a.length===0?`
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      `:a.map(e=>`
        <div class="card">
          <div style="display: flex; justify-content: space-between">
            <div>
              <div class="card-title">${e.routineName}</div>
              <div class="card-subtitle">${e.date}</div>
            </div>
            <div class="badge">Completato</div>
          </div>
        </div>
      `).join(``)}
    </div>
  `},d=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">I tuoi progressi</h2>
      <div class="card">
        <div class="card-subtitle">Peso Corporeo</div>
        <div class="stat-value">78.5 kg</div>
        <div class="card-subtitle" style="color: var(--success)">-1.2 kg nell'ultimo mese</div>
      </div>
      
      <div class="card">
        <div class="card-title">Massimali Stimati</div>
        <div style="margin-top: 10px">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
            <span>Panca Piana</span>
            <span style="color: var(--accent-color); font-weight: 700">85 kg</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
            <span>Squat</span>
            <span style="color: var(--accent-color); font-weight: 700">110 kg</span>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span>Stacco</span>
            <span style="color: var(--accent-color); font-weight: 700">140 kg</span>
          </div>
        </div>
      </div>
    </div>
  `},f=e=>{switch(r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),e){case`dashboard`:o();break;case`routines`:s();break;case`history`:u();break;case`progress`:d();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),f(e.getAttribute(`data-view`))})}),f(`dashboard`);