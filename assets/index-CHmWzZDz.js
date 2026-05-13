(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=`v1.7.0`,a=[{version:`v1.7.0`,title:`Circuiti & Visione`,changes:[`Gestione Circuiti AMRAP con timer e round`,`Rilevamento automatico schede cartacee (OCR)`,`Correzione refusi motivazionali`]},{version:`v1.6.0`,title:`Controllo Totale`,changes:[`Timer di recupero personalizzabile per esercizio`,`Anteprima scheda prima di iniziare`,`Impostazione carichi iniziali nella creazione`,`Inserimento manuale esercizi migliorato`]},{version:`v1.5.0`,title:`Update Professionale`,changes:[`Database esercizi con menu a tendina`,`Auto-valutazione serie (👍/👎) e aumento carichi intelligente`,`Dettaglio storico allenamenti cliccabile`]},{version:`v1.4.0`,title:`Guida Intelligente`,changes:[`Guida all'installazione per nuovi utenti`,`Rilevamento automatico modalità standalone`]},{version:`v1.3.0`,title:`Sessioni & Timer`,changes:[`Timer durata totale allenamento`,`Dettaglio durata nella cronologia`,`Migliorato sistema di aggiornamento`]},{version:`v1.2.0`,title:`Training Flow`,changes:[`Spunta serie completate`,`Avvio automatico timer di riposo al check`,`Allarme sonoro al termine del recupero`]},{version:`v1.1.0`,title:`Personalizzazione`,changes:[`Profilo utente completo (Età, Peso, Altezza)`,`Soprannome personalizzato`,`Frasi motivazionali dinamiche (Gymbo/Guerriera)`]},{version:`v1.0.0`,title:`Lancio IronTrack`,changes:[`Gestione schede allenamento`,`Tracking pesi e ripetizioni`,`Dark Mode & Premium Design`]}],o=t.getRoutines(),s=t.getLogs(),c=t.getUser(),l=null,u=null,d=null,f=null;o.length===0&&(o=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0,rest:90},{name:`Rematore`,sets:3,reps:`10-12`,weight:50,rest:60},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20,rest:60}]},{id:3,name:`Circuito Full Body 🔥`,type:`circuit`,duration:50,exercises:[{name:`Piegamenti sulle braccia`,sets:1,reps:`10`,weight:0},{name:`Jump squat verticale`,sets:1,reps:`10`,weight:0},{name:`Russian twist con kettlebell`,sets:1,reps:`10xlato`,weight:10},{name:`Corsa`,sets:1,reps:`2 min`,weight:0},{name:`Rematore / Australian Pull-up`,sets:1,reps:`10`,weight:0},{name:`Step up su panca`,sets:1,reps:`10xlato`,weight:0},{name:`Plank tocco spalla`,sets:1,reps:`10xlato`,weight:0},{name:`Cyclette 80-90rpm`,sets:1,reps:`2 min`,weight:0},{name:`Arnold press manubri`,sets:1,reps:`10`,weight:10},{name:`Dips su panca`,sets:1,reps:`10`,weight:0},{name:`Leg raises sdraiato`,sets:1,reps:`10`,weight:0},{name:`Cyclette con ventilatore`,sets:1,reps:`2 min`,weight:0}]}],t.saveRoutines(o));var p={Petto:[`Panca Piana Bilanciere`,`Panca Inclinata Manubri`,`Panca Piana`,`Croci ai Cavi`,`Dips`,`Chest Press`,`Pectoral Machine`,`Push Up`],Dorso:[`Trazioni alla Sbarra`,`Trazioni`,`Lat Machine`,`Rematore Bilanciere`,`Rematore Manubrio`,`Pulley`,`Pull-down braccia tese`],Gambe:[`Squat Bilanciere`,`Squat`,`Leg Press`,`Affondi`,`Leg Extension`,`Leg Curl`,`Stacchi Romeni`,`Stacco`,`Calf Raises`],Spalle:[`Military Press`,`Alzate Laterali`,`Lento Avanti Manubri`,`Alzate Frontali`,`Face Pull`,`Shoulder Press`],Bicipiti:[`Curl Bilanciere`,`Curl Manubri`,`Hammer Curl`,`Curl panca Scott`,`Spider Curl`],Tricipiti:[`Pushdown Tricipiti`,`French Press`,`Estensioni dietro nuca`,`Kickback`,`Dips su panca`],Addome:[`Crunch`,`Plank`,`Leg Raises`,`Ab Roller`,`Russian Twist`,`Sit-up`],Altro:[]},m=e=>{if(!e)return``;for(let[t,n]of Object.entries(p))if(n.includes(e))return t;return`Altro`},h={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbro {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},g=()=>{if(!c)return`Pronto per l'allenamento?`;let e=h[c.gender]||h.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,c.nickname||c.name||``)},_=()=>{u||=new(window.AudioContext||window.webkitAudioContext);let e=!0,t=()=>{if(!e)return;let n=u.createOscillator(),r=u.createGain();n.type=`sine`,n.frequency.setValueAtTime(880,u.currentTime),r.gain.setValueAtTime(.5,u.currentTime),r.gain.exponentialRampToValueAtTime(.01,u.currentTime+.5),n.connect(r),r.connect(u.destination),n.start(),n.stop(u.currentTime+.5),setTimeout(t,800)};return t(),()=>{e=!1}},v=e=>{let t=document.getElementById(`rest-timer-overlay`);t&&t.remove(),l&&clearInterval(l);let n=document.createElement(`div`);n.id=`rest-timer-overlay`,n.style=`
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
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>x(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);c=e,t.saveUser(c),I(`dashboard`)}))},S=()=>{if(!c){x();return}let e=s[0]||{routineName:`Nessun allenamento`,date:`-`},t=s.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${c.gender===`male`?`Bentornato, Gymbro`:`Bentornata, Guerriera`}</div>
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
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{I(`routines`)})},C=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000">📷 Scansiona</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${o.map(e=>`
          <div class="card routine-card" data-id="${e.id}" style="position: relative">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
              <div>
                <div class="card-title">${e.name}</div>
                <div class="card-subtitle">${e.type===`circuit`?`🔄 Circuito`:`💪 Standard`} • ${e.exercises.length} esercizi</div>
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
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{T()}),document.getElementById(`scan-routine-btn`).addEventListener(`click`,()=>{O()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||E(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.edit-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),w(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.delete-routine-btn`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.stopPropagation(),confirm(`Sei sicuro di voler eliminare questa scheda?`)){let n=parseInt(e.getAttribute(`data-id`));o=o.filter(e=>e.id!==n),t.saveRoutines(o),C()}})})},w=e=>{let r=o.find(t=>t.id==e),i=r.exercises.map(e=>({...e,_muscle:m(e.name),_manual:!1})),a=()=>{n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px">
          <button id="cancel-edit-routine" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Scheda</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Dettagli Scheda</div>
          <input type="text" id="edit-routine-name" value="${r.name}" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div class="card-subtitle">Tipo</div>
              <select id="edit-routine-type">
                <option value="standard" ${r.type===`circuit`?``:`selected`}>Standard 💪</option>
                <option value="circuit" ${r.type===`circuit`?`selected`:``}>Circuito 🔄</option>
              </select>
            </div>
            <div id="edit-duration-container" style="display: ${r.type===`circuit`?`block`:`none`}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="edit-routine-duration" value="${r.duration||50}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${i.map((e,t)=>(document.getElementById(`edit-routine-type`)?.value||r.type||`standard`)===`circuit`?`
                <div class="card exercise-form-card" data-index="${t}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <span class="badge">Esercizio ${t+1}</span>
                    <button class="remove-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                  </div>
                  <div style="display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; gap: 10px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${e.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${e.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">Peso</div>
                      <input type="number" class="ex-weight-edit" value="${Array.isArray(e.weight)?e.weight[0]:e.weight}">
                    </div>
                  </div>
                </div>
              `:`
            <div class="card exercise-form-card" data-index="${t}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${t+1}</span>
                <div style="display: flex; gap: 10px">
                  <button class="toggle-manual-edit" data-index="${t}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${e._manual?`Usa Lista`:`Scrivi a mano`}</button>
                  <button class="remove-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${e._manual||e._muscle===`Altro`?`<input type="text" class="ex-name" data-index="${t}" placeholder="Nome (es. Corsa)" value="${e.name}" style="margin: 0">`:`
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${t}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(p).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(p[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                    </div>
                  `}
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${e.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${e.reps}">
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight-edit" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiWeight?`Usa carico unico`:`Carichi diversi per serie?`}</button>
                </div>
                
                ${e._multiWeight?`<div class="multi-weight-grid">
                      ${Array.from({length:e.sets}).map((n,r)=>`
                        <input type="number" class="ex-weight-set-edit" data-index="${t}" data-set="${r}" value="${Array.isArray(e.weight)?e.weight[r]||0:e.weight}" placeholder="S${r+1}">
                      `).join(``)}
                     </div>`:`<input type="number" class="ex-weight-edit" value="${Array.isArray(e.weight)?e.weight[0]:e.weight}">`}
              </div>

              <div>
                <div class="card-subtitle">Riposo (sec)</div>
                <input type="number" class="ex-rest" value="${e.rest||60}">
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
    `,document.getElementById(`cancel-edit-routine`).addEventListener(`click`,()=>C());let e=document.getElementById(`edit-routine-type`),c=document.getElementById(`edit-duration-container`);e.addEventListener(`change`,()=>{s(),c.style.display=e.value===`circuit`?`block`:`none`,a()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));i[t].name=``,a()})}),document.querySelectorAll(`.toggle-manual-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._manual=!i[t]._manual,a()})}),document.querySelectorAll(`.toggle-multi-weight-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiWeight=!i[t]._multiWeight,a()})}),document.getElementById(`add-ex-row-edit`).addEventListener(`click`,()=>{s(),i.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1}),a()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i.splice(t,1),a()})}),document.getElementById(`save-edited-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`edit-routine-name`).value,n=document.getElementById(`edit-routine-type`).value,a=parseInt(document.getElementById(`edit-routine-duration`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let c={id:r.id,name:e,type:n,duration:n===`circuit`?a:null,exercises:i.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60}))};if(c.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);let l=o.findIndex(e=>e.id==r.id);o[l]=c,t.saveRoutines(o),C()})},s=()=>{let e=document.getElementById(`edit-routine-type`)?.value||r.type||`standard`;document.querySelectorAll(`.exercise-form-card`).forEach((t,n)=>{let r=t.querySelector(`.ex-name`),a=t.querySelector(`.ex-reps`);if(i[n].name=r?r.value:``,i[n].reps=a?a.value:`10`,e===`circuit`)i[n].sets=1,i[n].rest=0,i[n].weight=parseFloat(t.querySelector(`.ex-weight-edit`)?.value)||0,i[n]._multiWeight=!1;else{let e=t.querySelector(`.ex-muscle`);i[n]._muscle=e?e.value:i[n]._muscle||``,i[n].sets=parseInt(t.querySelector(`.ex-sets`).value)||3,i[n].rest=parseInt(t.querySelector(`.ex-rest`).value)||60;let r=t.querySelectorAll(`.ex-weight-set-edit`);if(r.length>0)i[n].weight=Array.from(r).map(e=>parseFloat(e.value)||0),i[n]._multiWeight=!0;else{let e=t.querySelector(`.ex-weight-edit`);i[n].weight=parseFloat(e?e.value:0)||0,i[n]._multiWeight=!1}}})};a()},T=(e=null)=>{let r=e||[{name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1}],i=()=>{n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px">
          <button id="cancel-add" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Nuova Scheda</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Dettagli Scheda</div>
          <input type="text" id="routine-name-input" placeholder="es. Gambe & Glutei" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div class="card-subtitle">Tipo</div>
              <select id="routine-type-select">
                <option value="standard">Standard 💪</option>
                <option value="circuit">Circuito 🔄</option>
              </select>
            </div>
            <div id="duration-container" style="display: none">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="routine-duration-input" value="50">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${r.map((e,t)=>(document.getElementById(`routine-type-select`)?.value||`standard`)===`circuit`?`
                <div class="card exercise-form-card" data-index="${t}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <span class="badge">Esercizio ${t+1}</span>
                    <button class="remove-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                  </div>
                  <div style="display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; gap: 10px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${e.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${e.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">Peso</div>
                      <input type="number" class="ex-weight-init" value="${Array.isArray(e.weight)?e.weight[0]:e.weight}">
                    </div>
                  </div>
                </div>
              `:`
            <div class="card exercise-form-card" data-index="${t}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${t+1}</span>
                <div style="display: flex; gap: 10px">
                  <button class="toggle-manual" data-index="${t}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${e._manual?`Usa Lista`:`Scrivi a mano`}</button>
                  ${r.length>1?`<button class="remove-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>`:``}
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${e._manual||e._muscle===`Altro`?`<input type="text" class="ex-name" data-index="${t}" placeholder="Nome (es. Corsa)" value="${e.name}" style="margin: 0">`:`
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${t}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(p).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(p[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                    </div>
                  `}
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${e.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${e.reps}">
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiWeight?`Usa carico unico`:`Carichi diversi per serie?`}</button>
                </div>
                
                ${e._multiWeight?`<div class="multi-weight-grid">
                      ${Array.from({length:e.sets}).map((n,r)=>`
                        <input type="number" class="ex-weight-set" data-index="${t}" data-set="${r}" value="${Array.isArray(e.weight)?e.weight[r]||0:e.weight}" placeholder="S${r+1}">
                      `).join(``)}
                     </div>`:`<input type="number" class="ex-weight-init" value="${Array.isArray(e.weight)?e.weight[0]:e.weight}">`}
              </div>

              <div>
                <div class="card-subtitle">Riposo (sec)</div>
                <input type="number" class="ex-rest" value="${e.rest}">
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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>C());let e=document.getElementById(`routine-type-select`),s=document.getElementById(`duration-container`);e.addEventListener(`change`,()=>{a(),s.style.display=e.value===`circuit`?`block`:`none`,i()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{a();let t=parseInt(e.target.getAttribute(`data-index`));r[t].name=``,i()})}),document.querySelectorAll(`.toggle-manual`).forEach(e=>{e.addEventListener(`click`,()=>{a();let t=parseInt(e.getAttribute(`data-index`));r[t]._manual=!r[t]._manual,i()})}),document.querySelectorAll(`.toggle-multi-weight`).forEach(e=>{e.addEventListener(`click`,()=>{a();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiWeight=!r[t]._multiWeight,i()})}),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{a(),r.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1}),i()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{a();let t=parseInt(e.getAttribute(`data-index`));r.splice(t,1),i()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{a();let e=document.getElementById(`routine-name-input`).value,n=document.getElementById(`routine-type-select`).value,i=parseInt(document.getElementById(`routine-duration-input`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let s={id:Date.now(),name:e,type:n,duration:n===`circuit`?i:null,exercises:r.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60}))};if(s.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);o.push(s),t.saveRoutines(o),C()})},a=()=>{let e=document.getElementById(`routine-type-select`)?.value||`standard`;document.querySelectorAll(`.exercise-form-card`).forEach((t,n)=>{let i=t.querySelector(`.ex-name`),a=t.querySelector(`.ex-reps`);if(r[n].name=i?i.value:``,r[n].reps=a?a.value:`10`,e===`circuit`)r[n].sets=1,r[n].rest=0,r[n].weight=parseFloat(t.querySelector(`.ex-weight-init`)?.value)||0,r[n]._multiWeight=!1;else{let e=t.querySelector(`.ex-muscle`);r[n]._muscle=e?e.value:r[n]._muscle||``,r[n].sets=parseInt(t.querySelector(`.ex-sets`).value)||3,r[n].rest=parseInt(t.querySelector(`.ex-rest`).value)||60;let i=t.querySelectorAll(`.ex-weight-set`);if(i.length>0)r[n].weight=Array.from(i).map(e=>parseFloat(e.value)||0),r[n]._multiWeight=!0;else{let e=t.querySelector(`.ex-weight-init`);r[n].weight=parseFloat(e?e.value:0)||0,r[n]._multiWeight=!1}}})};i()},E=e=>{let t=o.find(t=>t.id==e);n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-list" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">Pronto?</h2>
        <div style="width: 40px"></div>
      </header>

      <div class="card" style="background: rgba(204, 255, 0, 0.05); border: 1px solid var(--accent-color); text-align: center; padding: 30px 20px">
        <div class="card-subtitle">Stai per iniziare</div>
        <div class="card-title" style="font-size: 1.8rem">${t.name}</div>
        <div class="card-subtitle" style="margin-top: 10px">
          ${t.type===`circuit`?`🔄 Circuito AMRAP • ${t.duration||50} min`:`💪 Sessione Standard • ${t.exercises.length} esercizi`}
        </div>
      </div>

      <div style="padding: 0 16px">
        <div class="card-subtitle" style="margin-bottom: 10px">Esercizi in programma:</div>
        ${t.exercises.map(e=>`
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem">
            <span>${e.name}</span>
            <span style="color: var(--text-secondary)">${e.sets}x${e.reps}</span>
          </div>
        `).join(``)}
      </div>

      <div style="padding: 30px 16px">
        <button class="btn" id="start-session-now" style="font-size: 1.2rem; padding: 20px">
          AVVIA SESSIONE 🔥
        </button>
      </div>
    </div>
  `,document.getElementById(`back-to-list`).addEventListener(`click`,()=>C()),document.getElementById(`start-session-now`).addEventListener(`click`,()=>{t.type===`circuit`?A(e):j(e)})},D=e=>{let t=e.split(`
`),n=[];return t.forEach(e=>{let t=e.trim();if(t.length<3)return;let r=t.match(/^([a-zA-Z\s]+)\s+(\d+)\s*[xX*]\s*(\d+)(?:\s*(\d+))?/),i=t.match(/^(\d+)\s*[xX*]\s*(\d+)\s+([a-zA-Z\s]+)/);if(r)n.push({name:r[1].trim(),sets:parseInt(r[2]),reps:r[3],weight:parseInt(r[4]||0),rest:60});else if(i)n.push({name:i[3].trim(),sets:parseInt(i[1]),reps:i[2],weight:0,rest:60});else{let e=t.match(/\d+/g),r=``;for(let e in p){for(let n of p[e])if(t.toLowerCase().includes(n.toLowerCase())){r=n;break}if(r)break}if(r&&e&&e.length>=1)n.push({name:r,sets:parseInt(e[0]||3),reps:e[1]||`10`,weight:parseInt(e[2]||0),rest:60});else if(t.replace(/[^a-zA-Z]/g,``).length>4&&e&&e.length>=2){let r=t.replace(/\d+/g,``).replace(/[xX*]/g,``).trim();n.push({name:r,sets:parseInt(e[0]),reps:e[1],weight:parseInt(e[2]||0),rest:60})}}}),n},O=()=>{n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="cancel-scan" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">Aggiungi Scheda</h2>
        <div style="width: 40px"></div>
      </header>

      <div style="display: flex; gap: 10px; padding: 0 16px 20px">
        <button id="tab-photo" class="btn btn-secondary" style="flex: 1; height: 40px; font-size: 0.8rem; background: var(--accent-color); color: #000">📷 Foto (OCR)</button>
        <button id="tab-text" class="btn btn-secondary" style="flex: 1; height: 40px; font-size: 0.8rem">📝 Incolla Testo</button>
      </div>

      <div class="scan-container">
        <!-- Sezione FOTO -->
        <div id="section-photo" style="width: 100%">
          <div class="card" style="width: 100%; text-align: center">
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 20px">
              Scatta una foto alla scheda cartacea.<br>L'IA proverà a estrarre i dati.
            </p>
            <div class="scan-preview-box" id="scan-preview">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--text-secondary); opacity: 0.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input type="file" id="camera-input" accept="image/*" capture="environment" style="display: none">
            <button class="btn" id="trigger-camera" style="margin-top: 20px">Scegli Immagine</button>
          </div>
        </div>

        <!-- Sezione TESTO -->
        <div id="section-text" style="width: 100%; display: none">
          <div class="card">
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 15px">
              Incolla qui la lista degli esercizi (es. da WhatsApp o Note).<br>Usa il formato: <i>Nome Esercizio 4x10 60kg</i>
            </p>
            <textarea id="manual-text-input" placeholder="Esempio:
Panca Piana 4x10 60kg
Squat 3x12 80kg" style="width: 100%; height: 150px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; padding: 12px; font-family: inherit; resize: none"></textarea>
            <button class="btn" id="parse-text-btn" style="margin-top: 15px">Riconosci Esercizi</button>
          </div>
        </div>

        <div id="ocr-status" style="display: none; width: 100%">
          <div class="card">
            <div class="card-subtitle" id="ocr-label">Analisi in corso...</div>
            <div class="ocr-loader">
              <div class="ocr-progress" id="ocr-progress-bar"></div>
            </div>
          </div>
        </div>

        <div id="scan-results" style="display: none; width: 100%">
          <h3 style="margin: 0 16px 15px; font-size: 1rem">Esercizi Rilevati</h3>
          <div id="parsed-list" style="padding: 0 16px"></div>
          <div style="padding: 20px 16px">
            <button class="btn" id="confirm-scan">Importa in Nuova Scheda</button>
          </div>
        </div>
      </div>
    </div>
  `;let e=document.getElementById(`camera-input`),t=document.getElementById(`trigger-camera`),r=document.getElementById(`scan-preview`),i=document.getElementById(`ocr-status`),a=document.getElementById(`scan-results`),o=document.getElementById(`parsed-list`),s=document.getElementById(`tab-photo`),c=document.getElementById(`tab-text`),l=document.getElementById(`section-photo`),u=document.getElementById(`section-text`),d=document.getElementById(`manual-text-input`),f=document.getElementById(`parse-text-btn`),p=[],m=()=>{a.style.display=`block`,p.length===0?o.innerHTML=`<div class="card" style="text-align: center; color: var(--danger)">Nessun esercizio trovato. Prova a cambiare formato.</div>`:(o.innerHTML=p.map((e,t)=>`
        <div class="parsed-item">
          <div>
            <div style="font-weight: 700; color: var(--accent-color)">${e.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary)">${e.sets} serie x ${e.reps} reps ${e.weight>0?`• ${e.weight}kg`:``}</div>
          </div>
          <button class="remove-parsed-ex" data-index="${t}" style="background:none; border:none; color:var(--danger); cursor:pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      `).join(``),document.querySelectorAll(`.remove-parsed-ex`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.getAttribute(`data-index`));p.splice(t,1),m()})}))};s.addEventListener(`click`,()=>{s.style.background=`var(--accent-color)`,s.style.color=`#000`,c.style.background=`rgba(255,255,255,0.1)`,c.style.color=`#fff`,l.style.display=`block`,u.style.display=`none`}),c.addEventListener(`click`,()=>{c.style.background=`var(--accent-color)`,c.style.color=`#000`,s.style.background=`rgba(255,255,255,0.1)`,s.style.color=`#fff`,l.style.display=`none`,u.style.display=`block`}),f.addEventListener(`click`,()=>{let e=d.value;if(!e.trim())return alert(`Incolla del testo prima!`);p=D(e),m()}),document.getElementById(`cancel-scan`).addEventListener(`click`,()=>C()),t.addEventListener(`click`,()=>e.click()),e.addEventListener(`change`,async e=>{let n=e.target.files[0];if(!n)return;let o=new FileReader;o.onload=e=>{r.innerHTML=`<img src="${e.target.result}">`},o.readAsDataURL(n),t.style.display=`none`,i.style.display=`block`,a.style.display=`none`;try{let e=await Tesseract.createWorker(`ita`,1,{logger:e=>{if(e.status===`recognizing text`){let t=Math.round(e.progress*100);document.getElementById(`ocr-progress-bar`).style.width=t+`%`,document.getElementById(`ocr-label`).innerText=`Riconoscimento: ${t}%`}}}),{data:{text:r}}=await e.recognize(n);await e.terminate(),p=D(r),i.style.display=`none`,t.style.display=`flex`,m()}catch(e){console.error(e),alert(`Errore durante la scansione. Riprova.`),i.style.display=`none`,t.style.display=`flex`}}),document.getElementById(`confirm-scan`).addEventListener(`click`,()=>{p.length!==0&&k(p)})},k=e=>{T(e.map(e=>({...e,_muscle:m(e.name),_manual:m(e.name)===`Altro`})))},A=e=>{let r=o.find(t=>t.id==e),i=r.duration||50,a=i*60,c=0;n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="cancel-circuit" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">${r.name}</h2>
        <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
      </header>

      <div style="text-align: center; margin-bottom: 20px">
        <div class="card-subtitle">TEMPO RIMANENTE</div>
        <div id="circuit-timer" class="timer-large">--:--</div>
      </div>

      <div class="round-display">
        <div class="card-subtitle">GIRI COMPLETATI</div>
        <div id="round-count" class="round-number">0</div>
        <button class="btn pulse" id="round-completed" style="margin-top: 15px">GIRO COMPLETATO! 🔥</button>
      </div>

      <div style="padding: 0 16px 10px">
        <div class="card-subtitle">LISTA ESERCIZI</div>
      </div>
      
      <div class="circuit-list">
        ${r.exercises.map((e,t)=>`
          <div class="circuit-item ${t===0?`active`:``}" data-idx="${t}">
            <div style="font-weight: 600">${e.name}</div>
            <div style="color: var(--accent-color); font-weight: 800">${e.reps}</div>
          </div>
        `).join(``)}
      </div>

      <div style="padding: 24px 16px">
        <button class="btn btn-secondary" id="finish-circuit">Concludi Allenamento</button>
      </div>
    </div>
  `;let l=document.getElementById(`circuit-timer`),u=document.getElementById(`round-count`),f=()=>{a--;let e=Math.floor(a/60).toString().padStart(2,`0`),t=(a%60).toString().padStart(2,`0`);l&&(l.innerText=`${e}:${t}`),a<=0&&(clearInterval(d),l&&(l.innerText=`TEMPO SCADUTO!`,l.style.color=`var(--danger)`),_())};d&&clearInterval(d),d=setInterval(f,1e3),f(),document.getElementById(`cancel-circuit`).addEventListener(`click`,()=>{confirm(`Annullare l'allenamento? I progressi non verranno salvati.`)&&(clearInterval(d),C())}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>v(30)),document.getElementById(`round-completed`).addEventListener(`click`,()=>{c++,u.innerText=c,document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.circuit-item[data-idx="0"]`).classList.add(`active`),u.style.transform=`scale(1.2)`,setTimeout(()=>u.style.transform=`scale(1)`,200)}),document.querySelectorAll(`.circuit-item`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)})}),document.getElementById(`finish-circuit`).addEventListener(`click`,()=>{clearInterval(d);let e=`${i-Math.floor(a/60)} min`;t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:e,type:`circuit`,rounds:c,exercises:r.exercises.map(e=>({name:e.name,sets:[{reps:e.reps,weight:e.weight}]}))}),s=t.getLogs(),alert(`Ottimo lavoro! 🔥 Hai completato ${c} giri in questo circuito!`),I(`dashboard`)})},j=e=>{let r=o.find(t=>t.id==e);f=Date.now(),n.innerHTML=`
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
                <input type="number" value="${Array.isArray(e.weight)?e.weight[r]||e.weight[0]||0:e.weight}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-weight">
                <input type="number" placeholder="${e.reps}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
                <button class="check-set-btn" style="background: transparent; border: 2px solid var(--accent-color); border-radius: 8px; color: var(--accent-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                </button>
              </div>
            `).join(``)}
          </div>

          <div class="exercise-feedback" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Com'è andato l'esercizio?</div>
            <div style="display: flex; gap: 10px">
              <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer">👍 Bene</button>
              <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer">👎 Fatica</button>
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
  `,d&&clearInterval(d),d=setInterval(()=>{let e=Math.floor((Date.now()-f)/1e3),t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`),r=document.getElementById(`workout-timer-display`);r&&(r.innerText=`${t}:${n}`)},1e3),document.getElementById(`back-to-routines`).addEventListener(`click`,()=>{clearInterval(d),C()}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>v(60)),document.querySelectorAll(`.check-set-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.set-row`);if(n.style.opacity!==`0.5`){n.style.opacity=`0.5`,e.style.background=`var(--accent-color)`,e.style.color=`#000`;let t=n.getAttribute(`data-ex-idx`);v(r.exercises[t].rest||60)}else n.style.opacity=`1`,e.style.background=`transparent`,e.style.color=`var(--accent-color)`;let i=n.closest(`.card`),a=i.querySelectorAll(`.set-row`);Array.from(a).filter(e=>e.style.opacity===`0.5`).length===a.length?i.querySelector(`.exercise-feedback`).style.display=`block`:i.querySelector(`.exercise-feedback`).style.display=`none`})}),document.querySelectorAll(`.feedback-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.card`);n.querySelectorAll(`.feedback-btn`).forEach(e=>e.style.opacity=`0.4`),e.style.opacity=`1`,n.setAttribute(`data-feedback`,e.classList.contains(`pos`)?`positive`:`negative`)})}),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{let e=[],n=!1;document.querySelectorAll(`.card`).forEach(t=>{let i=t.querySelector(`.card-title`)?.innerText;if(!i)return;let a=[],o=null;t.querySelectorAll(`.set-row`).forEach(e=>{o=e.getAttribute(`data-ex-idx`);let t=e.querySelectorAll(`input`),n=parseFloat(t[0].value)||0,r=parseInt(t[1].value)||0;a.push({weight:n,reps:r})});let s=t.getAttribute(`data-feedback`);o!==null&&s===`positive`&&(r.exercises[o].weight+=2.5,n=!0),e.push({name:i,sets:a,feedback:s})}),n&&t.saveRoutines(o);let i=Math.floor((Date.now()-f)/1e3),a=Math.floor(i/60),c=a>0?`${a} min`:`${i} sec`;t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:c,exercises:e}),clearInterval(d),s=t.getLogs(),alert(n?`Allenamento salvato! 🔥 Hai spaccato: i pesi per la prossima sessione sono stati aumentati automaticamente di 2.5kg dove hai performato meglio!`:`Allenamento salvato con successo! 🔥`),I(`dashboard`)})},M=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${s.length===0?`
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      `:s.map((e,t)=>`
        <div class="card log-card" data-idx="${t}" style="cursor: pointer">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <div class="card-title">${e.routineName}</div>
              <div class="card-subtitle">${e.date} ${e.duration?`• ⏱️ ${e.duration}`:``} ${e.type===`circuit`?`• 🔄 ${e.rounds} giri`:``}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-secondary)"><path d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      `).join(``)}
    </div>
  `,document.querySelectorAll(`.log-card`).forEach(e=>{e.addEventListener(`click`,()=>{N(e.getAttribute(`data-idx`))})})},N=e=>{let t=s[e];if(!t)return M();n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-history" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Indietro</button>
        <h2 style="font-size: 1.1rem; margin: 0">Dettaglio Sessione</h2>
        <div style="width: 40px"></div>
      </header>

      <div class="card" style="background: rgba(204, 255, 0, 0.05); border: 1px solid var(--accent-color)">
        <div class="card-title">${t.routineName}</div>
        <div class="card-subtitle">${t.date} ${t.duration?`• ⏱️ Durata: ${t.duration}`:``} ${t.type===`circuit`?`• 🔄 Giri: ${t.rounds}`:``}</div>
      </div>

      ${t.exercises.map(e=>`
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px">
            <div class="card-title" style="font-size: 1rem">${e.name}</div>
            ${e.feedback===`positive`?`<span style="color: var(--success); font-size: 1.2rem">👍</span>`:``}
            ${e.feedback===`negative`?`<span style="color: var(--danger); font-size: 1.2rem">👎</span>`:``}
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px">
            ${e.sets.map((e,t)=>`
              <div style="display: grid; grid-template-columns: 30px 1fr 1fr; gap: 10px; font-size: 0.9rem; color: var(--text-secondary)">
                <div style="color: var(--accent-color); font-weight: 800">${t+1}</div>
                <div>Peso: <strong>${e.weight} kg</strong></div>
                <div>Reps: <strong>${e.reps}</strong></div>
              </div>
            `).join(``)}
          </div>
        </div>
      `).join(``)}

      <div style="padding: 20px; text-align: center">
        <button class="btn btn-secondary" id="return-history">Torna alla Storia</button>
      </div>
    </div>
  `,document.getElementById(`back-to-history`).addEventListener(`click`,()=>M()),document.getElementById(`return-history`).addEventListener(`click`,()=>M())},P=()=>{let e=()=>{n.innerHTML=`
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
    `,document.getElementById(`edit-profile`).addEventListener(`click`,()=>a()),document.getElementById(`show-changelog`).addEventListener(`click`,()=>F());let e=document.getElementById(`exercise-select`);e&&e.addEventListener(`change`,e=>{i(e.target.value)})},r=()=>{let e=new Set;return s.forEach(t=>{t.exercises&&t.exercises.forEach(t=>e.add(t.name))}),Array.from(e)},i=e=>{if(!e)return;let t=s.filter(t=>t.exercises&&t.exercises.find(t=>t.name===e)).map(t=>{let n=t.exercises.find(t=>t.name===e),r=Math.max(...n.sets.map(e=>e.weight));return{date:t.date,weight:r}}).reverse(),n=document.getElementById(`progressChart`).getContext(`2d`);window.currentChart&&window.currentChart.destroy(),window.currentChart=new Chart(n,{type:`line`,data:{labels:t.map(e=>e.date),datasets:[{label:`Peso Massimo (kg)`,data:t.map(e=>e.weight),borderColor:`#ccff00`,backgroundColor:`rgba(204, 255, 0, 0.1)`,borderWidth:3,tension:.4,fill:!0,pointBackgroundColor:`#ccff00`,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},a=()=>{n.innerHTML=`
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
    `,document.getElementById(`cancel-edit`).addEventListener(`click`,()=>e()),document.getElementById(`save-profile`).addEventListener(`click`,()=>{c.nickname=document.getElementById(`edit-nickname`).value,c.age=document.getElementById(`edit-age`).value,c.weight=document.getElementById(`edit-weight`).value,t.saveUser(c),e(),alert(`Profilo aggiornato! 🦾`)})};e()},F=()=>{n.innerHTML=`
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
  `,document.getElementById(`close-changelog`).addEventListener(`click`,()=>P())},I=e=>{if(r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!y()&&!sessionStorage.getItem(`guide-skipped`)&&e===`dashboard`&&!c){sessionStorage.setItem(`guide-skipped`,`true`),b();return}if(!c&&e!==`onboarding`){x();return}switch(e){case`dashboard`:S();break;case`routines`:C();break;case`history`:M();break;case`progress`:P();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),I(e.getAttribute(`data-view`))})}),I(`dashboard`);