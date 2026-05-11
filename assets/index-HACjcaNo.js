(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=`v1.4.0`,a=[{version:`v1.4.0`,title:`Guida Intelligente`,changes:[`Guida all'installazione per nuovi utenti`,`Rilevamento automatico modalità standalone`]},{version:`v1.3.0`,title:`Sessioni & Timer`,changes:[`Timer durata totale allenamento`,`Dettaglio durata nella cronologia`,`Migliorato sistema di aggiornamento`]},{version:`v1.2.0`,title:`Training Flow`,changes:[`Spunta serie completate`,`Avvio automatico timer di riposo al check`,`Allarme sonoro al termine del recupero`]},{version:`v1.1.0`,title:`Personalizzazione`,changes:[`Profilo utente completo (Età, Peso, Altezza)`,`Soprannome personalizzato`,`Frasi motivazionali dinamiche (Gymbo/Guerriera)`]},{version:`v1.0.0`,title:`Lancio IronTrack`,changes:[`Gestione schede allenamento`,`Tracking pesi e ripetizioni`,`Dark Mode & Premium Design`]}],o=t.getRoutines(),s=t.getLogs(),c=t.getUser(),l=null,u=null,d=null,f=null;o.length===0&&(o=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0},{name:`Rematore`,sets:3,reps:`10-12`,weight:50},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20}]}],t.saveRoutines(o));var p={Petto:[`Panca Piana Bilanciere`,`Panca Inclinata Manubri`,`Panca Piana`,`Croci ai Cavi`,`Dips`,`Chest Press`,`Pectoral Machine`,`Push Up`],Dorso:[`Trazioni alla Sbarra`,`Trazioni`,`Lat Machine`,`Rematore Bilanciere`,`Rematore Manubrio`,`Pulley`,`Pull-down braccia tese`],Gambe:[`Squat Bilanciere`,`Squat`,`Leg Press`,`Affondi`,`Leg Extension`,`Leg Curl`,`Stacchi Romeni`,`Stacco`,`Calf Raises`],Spalle:[`Military Press`,`Alzate Laterali`,`Lento Avanti Manubri`,`Alzate Frontali`,`Face Pull`,`Shoulder Press`],Bicipiti:[`Curl Bilanciere`,`Curl Manubri`,`Hammer Curl`,`Curl panca Scott`,`Spider Curl`],Tricipiti:[`Pushdown Tricipiti`,`French Press`,`Estensioni dietro nuca`,`Kickback`,`Dips su panca`],Addome:[`Crunch`,`Plank`,`Leg Raises`,`Ab Roller`,`Russian Twist`,`Sit-up`],Altro:[]},m=e=>{if(!e)return``;for(let[t,n]of Object.entries(p))if(n.includes(e))return t;return`Altro`},h={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbo {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},g=()=>{if(!c)return`Pronto per l'allenamento?`;let e=h[c.gender]||h.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,c.nickname||c.name||``)},_=()=>{u||=new(window.AudioContext||window.webkitAudioContext);let e=!0,t=()=>{if(!e)return;let n=u.createOscillator(),r=u.createGain();n.type=`sine`,n.frequency.setValueAtTime(880,u.currentTime),r.gain.setValueAtTime(.5,u.currentTime),r.gain.exponentialRampToValueAtTime(.01,u.currentTime+.5),n.connect(r),r.connect(u.destination),n.start(),n.stop(u.currentTime+.5),setTimeout(t,800)};return t(),()=>{e=!1}},v=e=>{let t=document.getElementById(`rest-timer-overlay`);t&&t.remove(),l&&clearInterval(l);let n=document.createElement(`div`);n.id=`rest-timer-overlay`,n.style=`
    position: fixed; bottom: 100px; left: 16px; right: 16px;
    background: var(--card-bg); border: 2px solid var(--accent-color);
    border-radius: 20px; padding: 20px; z-index: 2000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center;
    animation: slideUp 0.3s ease-out;
  `;let r=e,i=null;n.innerHTML=`
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${r}s</div>
    <button id="stop-timer" class="btn" style="margin-top: 15px; background: var(--danger); height: 45px; padding: 0 30px">Annulla</button>
  `,document.body.appendChild(n),l=setInterval(()=>{r--;let e=document.getElementById(`timer-display`);if(e&&(e.innerText=r+`s`),r<=0){clearInterval(l),e&&(e.innerText=`FINE! 🔥`,e.style.animation=`pulse 0.5s infinite`),i=_();let t=document.getElementById(`stop-timer`);t&&(t.innerText=`STOP ALLARME`,t.style.background=`var(--accent-color)`,t.style.color=`#000`)}},1e3),document.getElementById(`stop-timer`).addEventListener(`click`,()=>{i&&i(),clearInterval(l),n.remove()})},y=()=>window.navigator.standalone||window.matchMedia(`(display-mode: standalone)`).matches,b=()=>{n.innerHTML=`
    <div class="view" style="padding: 30px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85vh; text-align: center">
      <div style="font-size: 4rem; margin-bottom: 20px">📲</div>
      <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 15px">Installa <span style="color: var(--accent-color)">IronTrack</span></h2>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 30px">
        Per usare l'app al meglio (senza barre del browser) e avere i tuoi progressi sempre pronti, aggiungila alla tua schermata Home.
      </p>

      <div class="card" style="width: 100%; text-align: left; background: rgba(204, 255, 0, 0.05); border: 1px dashed var(--accent-color)">
        <div style="margin-bottom: 15px; display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0">1</div>
          <div style="font-size: 0.9rem">Tocca l'icona di <strong>condivisione</strong> in basso (il quadrato con la freccia in alto <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>)</div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0">2</div>
          <div style="font-size: 0.9rem">Scorri verso il basso e scegli <strong>"Aggiungi alla schermata Home"</strong></div>
        </div>
      </div>

      <button id="skip-guide" style="margin-top: 30px; background: none; border: none; color: var(--text-secondary); text-decoration: underline; font-size: 0.8rem; cursor: pointer">Continua comunque nel browser</button>
    </div>
  `,document.getElementById(`skip-guide`).addEventListener(`click`,()=>{c?S():x()})},x=(e=1,r={})=>{e===1?(n.innerHTML=`
      <div class="view" style="padding: 20px">
        <div style="text-align: center; margin: 40px 0">
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px">Benvenuto su <span style="color: var(--accent-color)">IronTrack</span></h2>
          <p style="color: var(--text-secondary)">Per iniziare, dicci chi sei</p>
        </div>

        <div class="card">
          <div class="card-title" style="text-align: center; margin-bottom: 20px">Sei...</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
            <button class="btn btn-secondary gender-btn" data-gender="male" style="flex-direction: column; height: 120px; gap: 10px">
              <span style="font-size: 2rem">♂</span>
              Maschio
            </button>
            <button class="btn btn-secondary gender-btn" data-gender="female" style="flex-direction: column; height: 120px; gap: 10px">
              <span style="font-size: 2rem">♀</span>
              Femmina
            </button>
          </div>
        </div>
      </div>
    `,document.querySelectorAll(`.gender-btn`).forEach(e=>{e.addEventListener(`click`,()=>{x(2,{gender:e.getAttribute(`data-gender`)})})})):(n.innerHTML=`
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="back-step" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">← Indietro</button>
        </header>

        <div class="card">
          <div class="card-title">Dati Personali</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div class="card-subtitle">Nome</div>
              <input type="text" id="ob-name" placeholder="Mario">
            </div>
            <div>
              <div class="card-subtitle">Cognome</div>
              <input type="text" id="ob-surname" placeholder="Rossi">
            </div>
          </div>
          
          <div style="margin-top: 12px">
            <div class="card-subtitle">Come vuoi che ti chiami l'app? (Soprannome)</div>
            <input type="text" id="ob-nickname" placeholder="es. Super Mario">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="ob-age" placeholder="25">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="ob-weight" placeholder="75">
            </div>
            <div>
              <div class="card-subtitle">Altezza (cm)</div>
              <input type="number" id="ob-height" placeholder="180">
            </div>
          </div>
        </div>

        <button class="btn" id="finish-onboarding" style="margin-top: 20px">Completa Profilo</button>
      </div>
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>x(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);c=e,t.saveUser(c),A(`dashboard`)}))},S=()=>{if(!c){x();return}let e=s[0]||{routineName:`Nessun allenamento`,date:`-`},t=s.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${c.gender===`male`?`Bentornato, Gymbo`:`Bentornata, Guerriera`}</div>
        <div class="card-title" style="font-size: 1.5rem">${g()}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${t}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Peso Attuale</div>
          <div class="stat-value">${c.weight||`--`} kg</div>
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
      <div style="padding: 0 16px; margin-top: 20px; text-align: center; color: var(--text-secondary); font-size: 0.8rem">
        Versione App: ${i}
      </div>
    </div>
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{A(`routines`)})},C=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
      </div>
      
      <div id="routines-list">
        ${o.map(e=>`
          <div class="card routine-card" data-id="${e.id}" style="position: relative">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
              <div>
                <div class="card-title">${e.name}</div>
                <div class="card-subtitle">${e.exercises.length} esercizi</div>
              </div>
            </div>
            <div style="position: absolute; right: 16px; top: 20px; display: flex; gap: 12px">
              <button class="edit-routine-btn" data-id="${e.id}" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="delete-routine-btn" data-id="${e.id}" style="background: none; border: none; color: var(--danger); cursor: pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{T()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||E(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.edit-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),w(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.delete-routine-btn`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.stopPropagation(),confirm(`Sei sicuro di voler eliminare questa scheda?`)){let n=parseInt(e.getAttribute(`data-id`));o=o.filter(e=>e.id!==n),t.saveRoutines(o),C()}})})},w=e=>{let r=o.find(t=>t.id==e),i=r.exercises.map(e=>({...e,_muscle:m(e.name)})),a=()=>{n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px">
          <button id="cancel-edit-routine" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Scheda</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Nome Scheda</div>
          <input type="text" id="edit-routine-name" value="${r.name}" style="font-size: 1.1rem; font-weight: 600">
        </div>

        <div id="exercises-container">
          ${i.map((e,t)=>`
            <div class="card exercise-form-card" data-index="${t}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${t+1}</span>
                <button class="remove-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px">
                <select class="ex-muscle" data-index="${t}" style="margin: 0">
                  <option value="">Seleziona Muscolo</option>
                  ${Object.keys(p).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                </select>
                ${e._muscle===`Altro`?`<input type="text" class="ex-name" data-index="${t}" placeholder="Nome (es. Corsa)" value="${e.name}" style="margin: 0">`:`<select class="ex-name" data-index="${t}" style="margin: 0">
                      <option value="">Seleziona Esercizio</option>
                      ${(p[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
                     </select>`}
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${e.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${e.reps}">
                </div>
              </div>
            </div>
          `).join(``)}
        </div>

        <div style="padding: 0 16px 20px">
          <button class="btn btn-secondary" id="add-ex-row-edit" style="margin-bottom: 12px">
            + Aggiungi Esercizio
          </button>
          <button class="btn" id="save-edited-routine">
            Salva Modifiche
          </button>
        </div>
      </div>
    `,document.getElementById(`cancel-edit-routine`).addEventListener(`click`,()=>C()),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));i[t].name=``,a()})}),document.getElementById(`add-ex-row-edit`).addEventListener(`click`,()=>{s(),i.push({name:``,sets:3,reps:`10`,weight:0,_muscle:``}),a()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i.splice(t,1),a()})}),document.getElementById(`save-edited-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`edit-routine-name`).value;if(!e)return alert(`Inserisci un nome per la scheda`);let n={id:r.id,name:e,exercises:i.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0}))};if(n.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);let a=o.findIndex(e=>e.id==r.id);o[a]=n,t.saveRoutines(o),C()})},s=()=>{document.querySelectorAll(`.exercise-form-card`).forEach((e,t)=>{let n=e.querySelector(`.ex-muscle`),r=e.querySelector(`.ex-name`);i[t]._muscle=n?n.value:``,i[t].name=r?r.value:``,i[t].sets=parseInt(e.querySelector(`.ex-sets`).value)||3,i[t].reps=e.querySelector(`.ex-reps`).value||`10`})};a()},T=()=>{let e=[{name:``,sets:3,reps:`10`,weight:0,_muscle:``}],r=()=>{n.innerHTML=`
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
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px">
                <select class="ex-muscle" data-index="${n}" style="margin: 0">
                  <option value="">Seleziona Muscolo</option>
                  ${Object.keys(p).map(e=>`<option value="${e}" ${t._muscle===e?`selected`:``}>${e}</option>`).join(``)}
                </select>
                ${t._muscle===`Altro`?`<input type="text" class="ex-name" data-index="${n}" placeholder="Nome (es. Corsa)" value="${t.name}" style="margin: 0">`:`<select class="ex-name" data-index="${n}" style="margin: 0">
                      <option value="">Seleziona Esercizio</option>
                      ${(p[t._muscle]||[]).map(e=>`<option value="${e}" ${e===t.name?`selected`:``}>${e}</option>`).join(``)}
                     </select>`}
              </div>

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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>C()),document.querySelectorAll(`.ex-muscle`).forEach(t=>{t.addEventListener(`change`,t=>{i();let n=parseInt(t.target.getAttribute(`data-index`));e[n].name=``,r()})}),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{i(),e.push({name:``,sets:3,reps:`10`,weight:0,_muscle:``}),r()}),document.querySelectorAll(`.remove-ex`).forEach(t=>{t.addEventListener(`click`,()=>{i();let n=parseInt(t.getAttribute(`data-index`));e.splice(n,1),r()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{i();let n=document.getElementById(`routine-name-input`).value;if(!n)return alert(`Inserisci un nome per la scheda`);let r={id:Date.now(),name:n,exercises:e.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:0}))};if(r.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);o.push(r),t.saveRoutines(o),C()})},i=()=>{document.querySelectorAll(`.exercise-form-card`).forEach((t,n)=>{let r=t.querySelector(`.ex-muscle`),i=t.querySelector(`.ex-name`);e[n]._muscle=r?r.value:``,e[n].name=i?i.value:``,e[n].sets=parseInt(t.querySelector(`.ex-sets`).value)||3,e[n].reps=t.querySelector(`.ex-reps`).value||`10`})};r()},E=e=>{let r=o.find(t=>t.id==e);f=Date.now(),n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
        <div style="text-align: center">
          <h2 style="font-size: 1.1rem; margin: 0">${r.name}</h2>
          <div id="workout-timer-display" style="font-size: 0.8rem; color: var(--accent-color); font-weight: 700; margin-top: 2px">00:00</div>
        </div>
        <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
      </header>

      ${r.exercises.map((e,t)=>`
        <div class="card">
          <div class="card-title" style="color: var(--accent-color)">${e.name}</div>
          <div class="card-subtitle">${e.sets} serie × ${e.reps}</div>
          
          <div style="margin-top: 15px">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; text-align: center; color: var(--text-secondary); font-size: 0.7rem; margin-bottom: 5px">
              <div>SET</div>
              <div>KG</div>
              <div>REPS</div>
              <div></div>
            </div>
            ${Array.from({length:e.sets}).map((n,r)=>`
              <div class="set-row" data-ex-idx="${t}" style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; margin-bottom: 8px; transition: opacity 0.3s">
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${r+1}</div>
                <input type="number" value="${e.weight}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-weight">
                <input type="number" placeholder="${e.reps}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
                <button class="check-set-btn" style="background: transparent; border: 2px solid var(--accent-color); border-radius: 8px; color: var(--accent-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                </button>
              </div>
            `).join(``)}
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05)">
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px; text-align: center">Com'è andato questo esercizio?</div>
            <div style="display: flex; gap: 10px; justify-content: center">
              <button class="rate-btn positive-btn" style="flex: 1; max-width: 120px; padding: 8px; background: transparent; border: 1px solid var(--success); border-radius: 8px; color: var(--success); cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 5px">
                👍 Buono
              </button>
              <button class="rate-btn negative-btn" style="flex: 1; max-width: 120px; padding: 8px; background: transparent; border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 5px">
                👎 Duro
              </button>
            </div>
          </div>
        </div>
      `).join(``)}

      <div style="padding: 16px">
        <button class="btn" id="finish-workout" style="background: var(--success)">
          Concludi Allenamento
        </button>
      </div>
    </div>
  `,d&&clearInterval(d),d=setInterval(()=>{let e=Math.floor((Date.now()-f)/1e3),t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`),r=document.getElementById(`workout-timer-display`);r&&(r.innerText=`${t}:${n}`)},1e3),document.getElementById(`back-to-routines`).addEventListener(`click`,()=>{clearInterval(d),C()}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>v(60)),document.querySelectorAll(`.check-set-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.set-row`);n.style.opacity===`0.5`?(n.style.opacity=`1`,e.style.background=`transparent`,e.style.color=`var(--accent-color)`):(n.style.opacity=`0.5`,e.style.background=`var(--accent-color)`,e.style.color=`#000`,v(60))})}),document.querySelectorAll(`.rate-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.card`),r=e.classList.contains(`positive-btn`);n.querySelectorAll(`.rate-btn`).forEach(e=>{e.classList.contains(`positive-btn`)?(e.style.background=`transparent`,e.style.color=`var(--success)`):(e.style.background=`transparent`,e.style.color=`var(--danger)`)}),r?(e.style.background=`var(--success)`,e.style.color=`#000`,n.setAttribute(`data-rating`,`positive`)):(e.style.background=`var(--danger)`,e.style.color=`#fff`,n.setAttribute(`data-rating`,`negative`))})}),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{let e=[],n=!1;document.querySelectorAll(`.card`).forEach(t=>{let i=t.querySelector(`.card-title`)?.innerText;if(!i)return;let a=[],o=null;t.querySelectorAll(`.set-row`).forEach(e=>{o=e.getAttribute(`data-ex-idx`);let t=e.querySelectorAll(`input`),n=parseFloat(t[0].value)||0,r=parseInt(t[1].value)||0;a.push({weight:n,reps:r})});let s=t.getAttribute(`data-rating`);o!==null&&s===`positive`&&(r.exercises[o].weight+=2.5,n=!0),e.push({name:i,sets:a,rating:s})}),n&&t.saveRoutines(o);let i=Math.floor((Date.now()-f)/1e3),a=Math.floor(i/60),c=a>0?`${a} min`:`${i} sec`;t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:c,exercises:e}),clearInterval(d),s=t.getLogs(),alert(n?`Allenamento salvato! 🔥 Hai spaccato: i pesi per la prossima sessione sono stati aumentati automaticamente di 2.5kg dove hai performato meglio!`:`Allenamento salvato con successo! 🔥`),A(`dashboard`)})},D=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${s.length===0?`
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      `:s.map(e=>`
        <div class="card">
          <div style="display: flex; justify-content: space-between">
            <div>
              <div class="card-title">${e.routineName}</div>
              <div class="card-subtitle">${e.date} ${e.duration?`• ⏱️ ${e.duration}`:``}</div>
            </div>
            <div class="badge">Completato</div>
          </div>
        </div>
      `).join(``)}
    </div>
  `},O=()=>{let e=()=>{n.innerHTML=`
      <div class="view">
        <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
          <h2 style="font-weight: 800; margin: 0">I tuoi progressi</h2>
          <button id="show-changelog" style="background: rgba(255,255,255,0.05); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
        </div>
        
        <!-- Profilo Utente -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px">
            <div>
              <div class="card-title">${c.name} ${c.surname}</div>
              <div class="card-subtitle">"${c.nickname}" • ${c.gender===`male`?`Uomo`:`Donna`}</div>
            </div>
            <button id="edit-profile" class="badge" style="border: none; cursor: pointer">Modifica</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center">
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Età</div>
              <div style="font-weight: 700">${c.age}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Peso</div>
              <div style="font-weight: 700; color: var(--accent-color)">${c.weight} kg</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Altezza</div>
              <div style="font-weight: 700">${c.height} cm</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div class="card-title">Performance</div>
            <select id="exercise-select" style="width: auto; margin: 0; padding: 5px 10px; font-size: 0.8rem">
              <option value="">Seleziona Esercizio</option>
              ${r().map(e=>`<option value="${e}">${e}</option>`).join(``)}
            </select>
          </div>
          <canvas id="progressChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${r().length>0?`display:none`:``}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <div class="card">
      </div>
    `,document.getElementById(`edit-profile`).addEventListener(`click`,()=>a()),document.getElementById(`show-changelog`).addEventListener(`click`,()=>k());let e=document.getElementById(`exercise-select`);e&&e.addEventListener(`change`,e=>{i(e.target.value)})},r=()=>{let e=new Set;return s.forEach(t=>{t.exercises&&t.exercises.forEach(t=>e.add(t.name))}),Array.from(e)},i=e=>{if(!e)return;let t=s.filter(t=>t.exercises&&t.exercises.find(t=>t.name===e)).map(t=>{let n=t.exercises.find(t=>t.name===e),r=Math.max(...n.sets.map(e=>e.weight));return{date:t.date,weight:r}}).reverse(),n=document.getElementById(`progressChart`).getContext(`2d`);window.currentChart&&window.currentChart.destroy(),window.currentChart=new Chart(n,{type:`line`,data:{labels:t.map(e=>e.date),datasets:[{label:`Peso Massimo (kg)`,data:t.map(e=>e.weight),borderColor:`#ccff00`,backgroundColor:`rgba(204, 255, 0, 0.1)`,borderWidth:3,tension:.4,fill:!0,pointBackgroundColor:`#ccff00`,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},a=()=>{n.innerHTML=`
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="cancel-edit" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Profilo</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Soprannome</div>
          <input type="text" id="edit-nickname" value="${c.nickname}">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="edit-age" value="${c.age}">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="edit-weight" value="${c.weight}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `,document.getElementById(`cancel-edit`).addEventListener(`click`,()=>e()),document.getElementById(`save-profile`).addEventListener(`click`,()=>{c.nickname=document.getElementById(`edit-nickname`).value,c.age=document.getElementById(`edit-age`).value,c.weight=document.getElementById(`edit-weight`).value,t.saveUser(c),e(),alert(`Profilo aggiornato! 🦾`)})};e()},k=()=>{n.innerHTML=`
    <div class="view" style="padding: 20px">
      <header style="position: static; background: transparent; padding: 0 0 20px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-size: 1.2rem; margin: 0">Cosa c'è di nuovo</h2>
        <button id="close-changelog" style="background: none; border: none; color: var(--accent-color); font-weight: 800; cursor: pointer">CHIUDI</button>
      </header>

      <div style="display: flex; flex-direction: column; gap: 20px">
        ${a.map(e=>`
          <div class="card" style="border-left: 3px solid var(--accent-color)">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
              <span class="badge" style="font-size: 0.7rem">${e.version}</span>
              <span style="font-weight: 800; font-size: 0.9rem">${e.title}</span>
            </div>
            <ul style="padding-left: 18px; margin: 0; color: var(--text-secondary); font-size: 0.85rem">
              ${e.changes.map(e=>`<li style="margin-bottom: 5px">${e}</li>`).join(``)}
            </ul>
          </div>
        `).join(``)}
      </div>

      <div style="text-align: center; margin-top: 30px; color: var(--text-secondary); font-size: 0.7rem">
        IronTrack Team • Made with Ghisa
      </div>
    </div>
  `,document.getElementById(`close-changelog`).addEventListener(`click`,()=>O())},A=e=>{if(r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!y()&&!sessionStorage.getItem(`guide-skipped`)&&e===`dashboard`&&!c){sessionStorage.setItem(`guide-skipped`,`true`),b();return}if(!c&&e!==`onboarding`){x();return}switch(e){case`dashboard`:S();break;case`routines`:C();break;case`history`:D();break;case`progress`:O();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),A(e.getAttribute(`data-view`))})}),A(`dashboard`);