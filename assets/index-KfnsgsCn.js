(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=t.getRoutines(),a=t.getLogs(),o=t.getUser(),s=null,c=null;i.length===0&&(i=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0},{name:`Rematore`,sets:3,reps:`10-12`,weight:50},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20}]}],t.saveRoutines(i));var l={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbo {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},u=()=>{if(!o)return`Pronto per l'allenamento?`;let e=l[o.gender]||l.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,o.nickname||o.name||``)},d=()=>{c||=new(window.AudioContext||window.webkitAudioContext);let e=!0,t=()=>{if(!e)return;let n=c.createOscillator(),r=c.createGain();n.type=`sine`,n.frequency.setValueAtTime(880,c.currentTime),r.gain.setValueAtTime(.5,c.currentTime),r.gain.exponentialRampToValueAtTime(.01,c.currentTime+.5),n.connect(r),r.connect(c.destination),n.start(),n.stop(c.currentTime+.5),setTimeout(t,800)};return t(),()=>{e=!1}},f=e=>{let t=document.getElementById(`rest-timer-overlay`);t&&t.remove(),s&&clearInterval(s);let n=document.createElement(`div`);n.id=`rest-timer-overlay`,n.style=`
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
  `,document.body.appendChild(n),s=setInterval(()=>{r--;let e=document.getElementById(`timer-display`);if(e&&(e.innerText=r+`s`),r<=0){clearInterval(s),e&&(e.innerText=`FINE! 🔥`,e.style.animation=`pulse 0.5s infinite`),i=d();let t=document.getElementById(`stop-timer`);t&&(t.innerText=`STOP ALLARME`,t.style.background=`var(--accent-color)`,t.style.color=`#000`)}},1e3),document.getElementById(`stop-timer`).addEventListener(`click`,()=>{i&&i(),clearInterval(s),n.remove()})},p=(e=1,r={})=>{e===1?(n.innerHTML=`
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
    `,document.querySelectorAll(`.gender-btn`).forEach(e=>{e.addEventListener(`click`,()=>{p(2,{gender:e.getAttribute(`data-gender`)})})})):(n.innerHTML=`
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
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>p(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);o=e,t.saveUser(o),b(`dashboard`)}))},m=()=>{if(!o){p();return}let e=a[0]||{routineName:`Nessun allenamento`,date:`-`},t=a.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${o.gender===`male`?`Bentornato, Gymbo`:`Bentornata, Guerriera`}</div>
        <div class="card-title" style="font-size: 1.5rem">${u()}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${t}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Peso Attuale</div>
          <div class="stat-value">${o.weight||`--`} kg</div>
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
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{b(`routines`)})},h=()=>{n.innerHTML=`
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
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{g()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,()=>{_(e.getAttribute(`data-id`))})})},g=()=>{let e=[{name:``,sets:3,reps:`10`,weight:0}],r=()=>{n.innerHTML=`
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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>h()),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{a(),e.push({name:``,sets:3,reps:`10`,weight:0}),r()}),document.querySelectorAll(`.remove-ex`).forEach(t=>{t.addEventListener(`click`,()=>{a();let n=parseInt(t.getAttribute(`data-index`));e.splice(n,1),r()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{a();let n=document.getElementById(`routine-name-input`).value;if(!n)return alert(`Inserisci un nome per la scheda`);let r={id:Date.now(),name:n,exercises:e.filter(e=>e.name.trim()!==``)};if(r.exercises.length===0)return alert(`Aggiungi almeno un esercizio`);i.push(r),t.saveRoutines(i),h()})},a=()=>{document.querySelectorAll(`.exercise-form-card`).forEach((t,n)=>{e[n].name=t.querySelector(`.ex-name`).value,e[n].sets=parseInt(t.querySelector(`.ex-sets`).value),e[n].reps=t.querySelector(`.ex-reps`).value})};r()},_=e=>{let r=i.find(t=>t.id==e);n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
        <h2 style="font-size: 1.1rem">${r.name}</h2>
        <div id="rest-trigger" style="color: var(--accent-color); font-weight: 800; cursor: pointer">⏲ TIMER</div>
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
  `,document.getElementById(`back-to-routines`).addEventListener(`click`,()=>h()),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>f(60)),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now()}),a=t.getLogs(),b(`dashboard`),alert(`Allenamento salvato con successo! 🔥`)})},v=()=>{n.innerHTML=`
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
  `},y=()=>{let e=()=>{n.innerHTML=`
      <div class="view">
        <h2 style="padding: 0 16px 16px; font-weight: 800">I tuoi progressi</h2>
        
        <!-- Profilo Utente -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px">
            <div>
              <div class="card-title">${o.name} ${o.surname}</div>
              <div class="card-subtitle">"${o.nickname}" • ${o.gender===`male`?`Uomo`:`Donna`}</div>
            </div>
            <button id="edit-profile" class="badge" style="border: none; cursor: pointer">Modifica</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center">
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Età</div>
              <div style="font-weight: 700">${o.age}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Peso</div>
              <div style="font-weight: 700; color: var(--accent-color)">${o.weight} kg</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Altezza</div>
              <div style="font-weight: 700">${o.height} cm</div>
            </div>
          </div>
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
    `,document.getElementById(`edit-profile`).addEventListener(`click`,()=>r())},r=()=>{n.innerHTML=`
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="cancel-edit" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Profilo</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Soprannome</div>
          <input type="text" id="edit-nickname" value="${o.nickname}">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="edit-age" value="${o.age}">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="edit-weight" value="${o.weight}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `,document.getElementById(`cancel-edit`).addEventListener(`click`,()=>e()),document.getElementById(`save-profile`).addEventListener(`click`,()=>{o.nickname=document.getElementById(`edit-nickname`).value,o.age=document.getElementById(`edit-age`).value,o.weight=document.getElementById(`edit-weight`).value,t.saveUser(o),e(),alert(`Profilo aggiornato! 🦾`)})};e()},b=e=>{if(r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!o&&e!==`onboarding`){p();return}switch(e){case`dashboard`:m();break;case`routines`:h();break;case`history`:v();break;case`progress`:y();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),b(e.getAttribute(`data-view`))})}),b(`dashboard`);