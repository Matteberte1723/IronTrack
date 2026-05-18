(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`,THEME:`iron_track_theme`,MEASUREMENTS:`iron_track_measurements`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},saveTheme:t=>{localStorage.setItem(e.THEME,t)},getTheme:()=>localStorage.getItem(e.THEME)||`default`,clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=e=>{document.body.className=e===`default`?``:`theme-${e}`};i(t.getTheme());var a=()=>{let e={routines:t.getRoutines(),logs:t.getLogs(),user:t.getUser(),theme:t.getTheme(),version:s,exportDate:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`irontrack_backup_${new Date().toISOString().split(`T`)[0]}.json`,i.click(),URL.revokeObjectURL(r)},o=e=>{let n=new FileReader;n.onload=e=>{try{let n=JSON.parse(e.target.result);confirm(`Questo sovrascriverà tutti i dati attuali. Sei sicuro?`)&&(n.routines&&t.saveRoutines(n.routines),n.logs&&localStorage.setItem(`iron_track_logs`,JSON.stringify(n.logs)),n.user&&t.saveUser(n.user),n.theme&&t.saveTheme(n.theme),alert(`Dati importati con successo! L'app verrà ricaricata.`),window.location.reload())}catch{alert(`Errore durante l'importazione. Il file potrebbe essere corrotto.`)}},n.readAsText(e)},s=`v1.9.1`,c=[{version:`v1.9.1`,title:`Progressi & Volume`,changes:[`Progressione intelligente: aumenta reps o carichi in base al feedback`,`Persistenza automatica di carichi e reps sulla scheda`,`Nuovo grafico del Volume Totale`,`Calendario mensile evidenziato correttamente`]},{version:`v1.9.0`,title:`Personalizzazione & Flow`,changes:[`Riordino Dinamico: Sposta gli esercizi con un tocco (Drag & Drop)`,`Note Esercizio: Aggiungi promemoria per ogni esercizio`,`Ripetizioni Variabili: Imposta reps diverse per ogni serie`,`Stima Durata: Calcolo automatico della durata dell'allenamento`,`Interfaccia Migliorata: Nuovo sistema di inserimento rapido`]},{version:`v1.8.0`,title:`L'Evoluzione`,changes:[`Backup & Ripristino: Esporta i tuoi dati per non perderli mai`,`Calendario Allenamenti: Visualizza la tua costanza mensile`,`Temi Personalizzati: Scegli il tuo colore (Red, Blue, Purple, White)`,`Icone Esercizi: Migliorata la navigazione visiva dei muscoli`]},{version:`v1.7.0`,title:`Circuiti & Visione`,changes:[`Gestione Circuiti AMRAP con timer e round`,`Rilevamento automatico schede cartacee (OCR)`,`Correzione refusi motivazionali`]},{version:`v1.6.0`,title:`Controllo Totale`,changes:[`Timer di recupero personalizzabile per esercizio`,`Anteprima scheda prima di iniziare`,`Impostazione carichi iniziali nella creazione`,`Inserimento manuale esercizi migliorato`]},{version:`v1.5.0`,title:`Update Professionale`,changes:[`Database esercizi con menu a tendina`,`Auto-valutazione serie (👍/👎) e aumento carichi intelligente`,`Dettaglio storico allenamenti cliccabile`]},{version:`v1.4.0`,title:`Guida Intelligente`,changes:[`Guida all'installazione per nuovi utenti`,`Rilevamento automatico modalità standalone`]},{version:`v1.3.0`,title:`Sessioni & Timer`,changes:[`Timer durata totale allenamento`,`Dettaglio durata nella cronologia`,`Migliorato sistema di aggiornamento`]},{version:`v1.2.0`,title:`Training Flow`,changes:[`Spunta serie completate`,`Avvio automatico timer di riposo al check`,`Allarme sonoro al termine del recupero`]},{version:`v1.1.0`,title:`Personalizzazione`,changes:[`Profilo utente completo (Età, Peso, Altezza)`,`Soprannome personalizzato`,`Frasi motivazionali dinamiche (Gymbo/Guerriera)`]},{version:`v1.0.0`,title:`Lancio IronTrack`,changes:[`Gestione schede allenamento`,`Tracking pesi e ripetizioni`,`Dark Mode & Premium Design`]}],l=t.getRoutines(),u=t.getLogs(),d=t.getUser(),f=null,p=null,m=null,h=null;l.length===0&&(l=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0,rest:90},{name:`Rematore`,sets:3,reps:`10-12`,weight:50,rest:60},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20,rest:60}]},{id:3,name:`Circuito Full Body 🔥`,type:`circuit`,duration:50,exercises:[{name:`Piegamenti sulle braccia`,sets:1,reps:`10`,weight:0},{name:`Jump squat verticale`,sets:1,reps:`10`,weight:0},{name:`Russian twist con kettlebell`,sets:1,reps:`10xlato`,weight:10},{name:`Corsa`,sets:1,reps:`2 min`,weight:0},{name:`Rematore / Australian Pull-up`,sets:1,reps:`10`,weight:0},{name:`Step up su panca`,sets:1,reps:`10xlato`,weight:0},{name:`Plank tocco spalla`,sets:1,reps:`10xlato`,weight:0},{name:`Cyclette 80-90rpm`,sets:1,reps:`2 min`,weight:0},{name:`Arnold press manubri`,sets:1,reps:`10`,weight:10},{name:`Dips su panca`,sets:1,reps:`10`,weight:0},{name:`Leg raises sdraiato`,sets:1,reps:`10`,weight:0},{name:`Cyclette con ventilatore`,sets:1,reps:`2 min`,weight:0}]}],t.saveRoutines(l));var g={Petto:[`Panca Piana Bilanciere`,`Panca Inclinata Manubri`,`Panca Piana`,`Croci ai Cavi`,`Dips`,`Chest Press`,`Pectoral Machine`,`Push Up`],Dorso:[`Trazioni alla Sbarra`,`Trazioni`,`Lat Machine`,`Rematore Bilanciere`,`Rematore Manubrio`,`Pulley`,`Pull-down braccia tese`],Gambe:[`Squat Bilanciere`,`Squat`,`Leg Press`,`Affondi`,`Leg Extension`,`Leg Curl`,`Stacchi Romeni`,`Stacco`,`Calf Raises`],Spalle:[`Military Press`,`Alzate Laterali`,`Lento Avanti Manubri`,`Alzate Frontali`,`Face Pull`,`Shoulder Press`],Bicipiti:[`Curl Bilanciere`,`Curl Manubri`,`Hammer Curl`,`Curl panca Scott`,`Spider Curl`],Tricipiti:[`Pushdown Tricipiti`,`French Press`,`Estensioni dietro nuca`,`Kickback`,`Dips su panca`],Addome:[`Crunch`,`Plank`,`Leg Raises`,`Ab Roller`,`Russian Twist`,`Sit-up`],Altro:[]},_={Petto:`🍒`,Dorso:`🦅`,Gambe:`🍗`,Spalle:`🛡️`,Bicipiti:`💪`,Tricipiti:`⚡`,Addome:`🧱`,Altro:`🏋️`},v=e=>{if(!e)return``;for(let[t,n]of Object.entries(g))if(n.includes(e))return t;return`Altro`},y=e=>_[e]||_.Altro,b={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbro {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},x=()=>{if(!d)return`Pronto per l'allenamento?`;let e=b[d.gender]||b.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,d.nickname||d.name||``)},S=e=>{if(!e||!e.exercises)return 0;let t=0;return e.exercises.forEach(e=>{let n=parseInt(e.sets)||1,r=parseInt(e.rest)||60;t+=n*45+(n-1)*r}),Math.round(t/60+5)},C=(e,t)=>{e.querySelectorAll(`.draggable-item`).forEach(r=>{let i=r.querySelector(`.drag-handle`);r.setAttribute(`draggable`,!0),r.addEventListener(`dragstart`,e=>{r.classList.add(`dragging`)}),r.addEventListener(`dragend`,()=>{r.classList.remove(`dragging`),t&&t()}),i&&(i.addEventListener(`touchstart`,e=>{r.classList.add(`dragging`)},{passive:!0}),i.addEventListener(`touchmove`,t=>{t.preventDefault();let r=t.touches[0],i=e.querySelector(`.dragging`);if(!i)return;let a=n(e,r.clientY);a==null?e.appendChild(i):e.insertBefore(i,a)},{passive:!1}),i.addEventListener(`touchend`,()=>{r.classList.contains(`dragging`)&&(r.classList.remove(`dragging`),t&&t())}))}),e.addEventListener(`dragover`,t=>{t.preventDefault();let r=e.querySelector(`.dragging`);if(!r)return;let i=n(e,t.clientY);i==null?e.appendChild(r):e.insertBefore(r,i)});function n(e,t){return[...e.querySelectorAll(`.draggable-item:not(.dragging)`)].reduce((e,n)=>{let r=n.getBoundingClientRect(),i=t-r.top-r.height/2;return i<0&&i>e.offset?{offset:i,element:n}:e},{offset:-1/0}).element}},w=()=>{p||=new(window.AudioContext||window.webkitAudioContext),p.state===`suspended`&&p.resume().catch(e=>console.log(`Audio resume failed:`,e));try{let e=p.createBuffer(1,1,22050),t=p.createBufferSource();t.buffer=e,t.connect(p.destination),t.start(0)}catch(e){console.log(`Audio unlock failed:`,e)}},T=()=>{w();let e=!0,t=()=>{if(e){try{let e=p.createOscillator(),t=p.createGain();e.type=`sine`,e.frequency.setValueAtTime(880,p.currentTime),t.gain.setValueAtTime(.5,p.currentTime),t.gain.exponentialRampToValueAtTime(.01,p.currentTime+.5),e.connect(t),t.connect(p.destination),e.start(),e.stop(p.currentTime+.5)}catch(e){console.log(`Failed to play beep:`,e)}setTimeout(t,800)}};return t(),()=>{e=!1}},E=e=>{w();let t=document.getElementById(`rest-timer-overlay`);t&&t.remove(),f&&clearInterval(f);let n=document.createElement(`div`);n.id=`rest-timer-overlay`,n.style=`
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
  `,document.body.appendChild(n),f=setInterval(()=>{r--;let e=document.getElementById(`timer-display`);if(e&&(e.innerText=r+`s`),r<=0){clearInterval(f),e&&(e.innerText=`FINE! 🔥`,e.style.animation=`pulse 0.5s infinite`),i=T();let t=document.getElementById(`stop-timer`);t&&(t.innerText=`STOP ALLARME`,t.style.background=`var(--accent-color)`,t.style.color=`#000`)}},1e3),document.getElementById(`stop-timer`).addEventListener(`click`,()=>{i&&i(),clearInterval(f),n.remove()})},D=()=>window.navigator.standalone||window.matchMedia(`(display-mode: standalone)`).matches,O=()=>{n.innerHTML=`
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
  `,document.getElementById(`skip-guide`).addEventListener(`click`,()=>{d?A():k()})},k=(e=1,r={})=>{e===1?(n.innerHTML=`
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
    `,document.querySelectorAll(`.gender-btn`).forEach(e=>{e.addEventListener(`click`,()=>{k(2,{gender:e.getAttribute(`data-gender`)})})})):(n.innerHTML=`
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
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>k(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);d=e,t.saveUser(d),W(`dashboard`)}))},A=()=>{if(!d){k();return}let e=u[0]||{routineName:`Nessun allenamento`,date:`-`},t=u.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${d.gender===`male`?`Bentornato, Gymbro`:`Bentornata, Guerriera`}</div>
        <div class="card-title" style="font-size: 1.5rem">${x()}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${t}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Peso Attuale</div>
          <div class="stat-value">${d.weight||`--`} kg</div>
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
        Versione App: ${s}
      </div>
    </div>
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{W(`routines`)})},j=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000; display: flex; align-items: center; gap: 4px; padding: 6px 10px">Inserimento rapido 📷✏️</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${l.map(e=>{let t=e.exercises[0],n=y(t?v(t.name):`Altro`),r=S(e);return`
            <div class="card routine-card" data-id="${e.id}" style="position: relative">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
                <div style="display: flex; align-items: center; gap: 15px">
                  <div class="ex-icon" style="background: var(--accent-glow); color: var(--accent-color); font-size: 1.2rem; width: 45px; height: 45px">${n}</div>
                  <div>
                    <div class="card-title">${e.name}</div>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <div class="card-subtitle">${e.type===`circuit`?`🔄 Circuito`:`💪 Standard`} • ${e.exercises.length} esercizi</div>
                      <div class="est-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${r} min
                      </div>
                    </div>
                  </div>
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
          `}).join(``)}
      </div>
    </div>
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{N()}),document.getElementById(`scan-routine-btn`).addEventListener(`click`,()=>{I()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||P(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.edit-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),M(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.delete-routine-btn`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.stopPropagation(),confirm(`Sei sicuro di voler eliminare questa scheda?`)){let n=parseInt(e.getAttribute(`data-id`));l=l.filter(e=>e.id!==n),t.saveRoutines(l),j()}})})},M=e=>{let r=l.find(t=>t.id==e),i=r.exercises.map(e=>({...e,_muscle:v(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})),a=r.type||`standard`,o=()=>{n.innerHTML=`
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
                <option value="standard" ${a===`standard`?`selected`:``}>Standard 💪</option>
                <option value="circuit" ${a===`circuit`?`selected`:``}>Circuito 🔄</option>
              </select>
            </div>
            <div id="edit-duration-container" style="display: ${a===`circuit`?`block`:`none`}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="edit-routine-duration" value="${r.duration||50}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${i.map((e,t)=>a===`circuit`?`
                <div class="card exercise-form-card draggable-item" data-index="${t}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <div style="display: flex; align-items: center">
                      <div class="drag-handle" style="margin-right: 10px">⠿</div>
                      <span class="badge">Esercizio ${t+1}</span>
                    </div>
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
                  <textarea class="notes-input" placeholder="Note per l'esercizio...">${e.notes||``}</textarea>
                </div>
              `:`
            <div class="card exercise-form-card draggable-item" data-index="${t}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center">
                  <div class="drag-handle" style="margin-right: 10px">⠿</div>
                  <span class="badge">Esercizio ${t+1}</span>
                </div>
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
                        ${Object.keys(g).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(g[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps-edit" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiReps?`Reps fisse`:`Reps variabili?`}</button>
                  </div>
                  ${e._multiReps?`<div class="multi-reps-grid">
                        ${Array.from({length:e.sets}).map((n,r)=>`
                          <input type="text" class="ex-reps-set-edit" data-index="${t}" data-set="${r}" value="${Array.isArray(e.reps)?e.reps[r]||`10`:e.reps}" placeholder="S${r+1}">
                        `).join(``)}
                       </div>`:`<input type="text" class="ex-reps" value="${e.reps}">`}
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight-edit" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiWeight?`Usa carico unico`:`Carichi diversi?`}</button>
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
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${e.notes||``}</textarea>
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
    `,document.getElementById(`cancel-edit-routine`).addEventListener(`click`,()=>j()),C(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`edit-routine-type`);e.addEventListener(`change`,()=>{s(),a=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));i[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._manual=!i[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiWeight=!i[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiReps=!i[t]._multiReps,o()})}),document.getElementById(`add-ex-row-edit`).addEventListener(`click`,()=>{s(),i.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i.splice(t,1),o()})}),document.getElementById(`save-edited-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`edit-routine-name`).value,n=document.getElementById(`edit-routine-type`).value,a=parseInt(document.getElementById(`edit-routine-duration`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let o={id:r.id,name:e,type:n,duration:n===`circuit`?a:null,exercises:i.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``}))};if(o.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);let c=l.findIndex(e=>e.id==r.id);l[c]=o,t.saveRoutines(l),j()})},s=()=>{let e=a,t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let r=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...i[r]};if(c.name=a?a.value:``,c.notes=s?s.value:``,e===`circuit`)c.reps=o?o.value:`10`,c.sets=1,c.rest=0,c.weight=parseFloat(n.querySelector(`.ex-weight-edit`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set-edit`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set-edit`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-edit`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),i=t};o()},N=(e=null)=>{let r=e?e.map(e=>({...e,_muscle:v(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})):[{name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}],i=`standard`,a=50,o=()=>{n.innerHTML=`
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
                <option value="standard" ${i===`standard`?`selected`:``}>Standard 💪</option>
                <option value="circuit" ${i===`circuit`?`selected`:``}>Circuito 🔄</option>
              </select>
            </div>
            <div id="duration-container" style="display: ${i===`circuit`?`block`:`none`}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="routine-duration-input" value="${a}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${r.map((e,t)=>i===`circuit`?`
                <div class="card exercise-form-card draggable-item" data-index="${t}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <div style="display: flex; align-items: center">
                      <div class="drag-handle" style="margin-right: 10px">⠿</div>
                      <span class="badge">Esercizio ${t+1}</span>
                    </div>
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
                  <textarea class="notes-input" placeholder="Note per l'esercizio...">${e.notes||``}</textarea>
                </div>
              `:`
            <div class="card exercise-form-card draggable-item" data-index="${t}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center">
                  <div class="drag-handle" style="margin-right: 10px">⠿</div>
                  <span class="badge">Esercizio ${t+1}</span>
                </div>
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
                        ${Object.keys(g).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(g[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiReps?`Reps fisse`:`Reps variabili?`}</button>
                  </div>
                  ${e._multiReps?`<div class="multi-reps-grid">
                        ${Array.from({length:e.sets}).map((n,r)=>`
                          <input type="text" class="ex-reps-set" data-index="${t}" data-set="${r}" value="${Array.isArray(e.reps)?e.reps[r]||`10`:e.reps}" placeholder="S${r+1}">
                        `).join(``)}
                       </div>`:`<input type="text" class="ex-reps" value="${e.reps}">`}
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight" data-index="${t}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${e._multiWeight?`Usa carico unico`:`Carichi diversi?`}</button>
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
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${e.notes||``}</textarea>
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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>j()),C(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`routine-type-select`);e.addEventListener(`change`,()=>{s(),i=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));r[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._manual=!r[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiWeight=!r[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiReps=!r[t]._multiReps,o()})}),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{s(),r.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r.splice(t,1),o()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`routine-name-input`).value,n=document.getElementById(`routine-type-select`).value,i=parseInt(document.getElementById(`routine-duration-input`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let a={id:Date.now(),name:e,type:n,duration:n===`circuit`?i:null,exercises:r.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``}))};if(a.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);l.push(a),t.saveRoutines(l),j()})},s=()=>{let e=i;document.getElementById(`routine-duration-input`)&&(a=parseInt(document.getElementById(`routine-duration-input`).value)||50);let t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let i=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...r[i]};if(c.name=a?a.value:``,c.notes=s?s.value:``,e===`circuit`)c.sets=1,c.rest=0,c.reps=o?o.value:`10`,c.weight=parseFloat(n.querySelector(`.ex-weight-init`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-init`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),r=t};o()},P=e=>{let t=l.find(t=>t.id==e);n.innerHTML=`
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
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; align-items: center">
              <span style="display: flex; align-items: center">
                <span class="ex-icon" style="font-size: 0.9rem; width: 24px; height: 24px; margin-right: 8px; background: rgba(255,255,255,0.03)">${y(v(e.name))}</span>
                ${e.name}
              </span>
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
  `,document.getElementById(`back-to-list`).addEventListener(`click`,()=>j()),document.getElementById(`start-session-now`).addEventListener(`click`,()=>{w(),t.type===`circuit`?R(e):z(e)})},F=e=>{let t=e.split(`
`),n=[];return t.forEach(e=>{let t=e.trim();if(t.length<3)return;let r=t.match(/^([a-zA-Z\s]+)\s+(\d+)\s*[xX*]\s*(\d+)(?:\s*(\d+))?/),i=t.match(/^(\d+)\s*[xX*]\s*(\d+)\s+([a-zA-Z\s]+)/);if(r)n.push({name:r[1].trim(),sets:parseInt(r[2]),reps:r[3],weight:parseInt(r[4]||0),rest:60});else if(i)n.push({name:i[3].trim(),sets:parseInt(i[1]),reps:i[2],weight:0,rest:60});else{let e=t.match(/\d+/g),r=``;for(let e in g){for(let n of g[e])if(t.toLowerCase().includes(n.toLowerCase())){r=n;break}if(r)break}if(r&&e&&e.length>=1)n.push({name:r,sets:parseInt(e[0]||3),reps:e[1]||`10`,weight:parseInt(e[2]||0),rest:60});else if(t.replace(/[^a-zA-Z]/g,``).length>4&&e&&e.length>=2){let r=t.replace(/\d+/g,``).replace(/[xX*]/g,``).trim();n.push({name:r,sets:parseInt(e[0]),reps:e[1],weight:parseInt(e[2]||0),rest:60})}}}),n},I=()=>{n.innerHTML=`
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
      `).join(``),document.querySelectorAll(`.remove-parsed-ex`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.getAttribute(`data-index`));p.splice(t,1),m()})}))};s.addEventListener(`click`,()=>{s.style.background=`var(--accent-color)`,s.style.color=`#000`,c.style.background=`rgba(255,255,255,0.1)`,c.style.color=`#fff`,l.style.display=`block`,u.style.display=`none`}),c.addEventListener(`click`,()=>{c.style.background=`var(--accent-color)`,c.style.color=`#000`,s.style.background=`rgba(255,255,255,0.1)`,s.style.color=`#fff`,l.style.display=`none`,u.style.display=`block`}),f.addEventListener(`click`,()=>{let e=d.value;if(!e.trim())return alert(`Incolla del testo prima!`);p=F(e),m()}),document.getElementById(`cancel-scan`).addEventListener(`click`,()=>j()),t.addEventListener(`click`,()=>e.click()),e.addEventListener(`change`,async e=>{let n=e.target.files[0];if(!n)return;let o=new FileReader;o.onload=e=>{r.innerHTML=`<img src="${e.target.result}">`},o.readAsDataURL(n),t.style.display=`none`,i.style.display=`block`,a.style.display=`none`;try{let e=await Tesseract.createWorker(`ita`,1,{logger:e=>{if(e.status===`recognizing text`){let t=Math.round(e.progress*100);document.getElementById(`ocr-progress-bar`).style.width=t+`%`,document.getElementById(`ocr-label`).innerText=`Riconoscimento: ${t}%`}}}),{data:{text:r}}=await e.recognize(n);await e.terminate(),p=F(r),i.style.display=`none`,t.style.display=`flex`,m()}catch(e){console.error(e),alert(`Errore durante la scansione. Riprova.`),i.style.display=`none`,t.style.display=`flex`}}),document.getElementById(`confirm-scan`).addEventListener(`click`,()=>{p.length!==0&&L(p)})},L=e=>{N(e.map(e=>({...e,_muscle:v(e.name),_manual:v(e.name)===`Altro`})))},R=e=>{let r=l.find(t=>t.id==e),i=r.duration||50,a=i*60,o=0;n.innerHTML=`
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
        ${r.exercises.map((e,t)=>{let n=y(v(e.name));return`
            <div class="circuit-item ${t===0?`active`:``}" data-idx="${t}">
              <div style="display: flex; align-items: center; gap: 10px">
                <span class="ex-icon" style="background: var(--accent-glow); width: 28px; height: 28px; font-size: 0.9rem; margin-right: 0">${n}</span>
                <div style="font-weight: 600">${e.name}</div>
              </div>
              <div style="color: var(--accent-color); font-weight: 800">${e.reps}</div>
            </div>
          `}).join(``)}
      </div>

      <div style="padding: 24px 16px">
        <button class="btn btn-secondary" id="finish-circuit">Concludi Allenamento</button>
      </div>
    </div>
  `;let s=document.getElementById(`circuit-timer`),c=document.getElementById(`round-count`),d=()=>{a--;let e=Math.floor(a/60).toString().padStart(2,`0`),t=(a%60).toString().padStart(2,`0`);s&&(s.innerText=`${e}:${t}`),a<=0&&(clearInterval(m),s&&(s.innerText=`TEMPO SCADUTO!`,s.style.color=`var(--danger)`),T())};m&&clearInterval(m),m=setInterval(d,1e3),d(),document.getElementById(`cancel-circuit`).addEventListener(`click`,()=>{confirm(`Annullare l'allenamento? I progressi non verranno salvati.`)&&(clearInterval(m),j())}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{w(),E(30)}),document.getElementById(`round-completed`).addEventListener(`click`,()=>{o++,c.innerText=o,document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.circuit-item[data-idx="0"]`).classList.add(`active`),c.style.transform=`scale(1.2)`,setTimeout(()=>c.style.transform=`scale(1)`,200)}),document.querySelectorAll(`.circuit-item`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)})}),document.getElementById(`finish-circuit`).addEventListener(`click`,()=>{clearInterval(m);let e=`${i-Math.floor(a/60)} min`;t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:e,type:`circuit`,rounds:o,exercises:r.exercises.map(e=>({name:e.name,sets:[{reps:e.reps,weight:e.weight}]}))}),u=t.getLogs(),alert(`Ottimo lavoro! 🔥 Hai completato ${o} giri in questo circuito!`),W(`dashboard`)})},z=e=>{let r=l.find(t=>t.id==e),i=JSON.parse(JSON.stringify(r.exercises));h=Date.now(),m&&clearInterval(m),m=setInterval(()=>{let e=Math.floor((Date.now()-h)/1e3),t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`),r=document.getElementById(`workout-timer-display`);r&&(r.innerText=`${t}:${n}`)},1e3),n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
          <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
          <div style="text-align: center">
            <h2 style="font-size: 1.1rem; margin: 0">${r.name}</h2>
            <div id="workout-timer-display" style="font-size: 0.8rem; color: var(--accent-color); font-weight: 700; margin-top: 2px">00:00</div>
          </div>
          <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
        </header>

        <div id="active-exercises-list">
          ${i.map((e,t)=>`
              <div class="card draggable-item" data-idx="${t}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                  <div class="card-title" style="color: var(--accent-color); display: flex; align-items: center; gap: 10px; margin: 0">
                    <span class="ex-icon" style="background: var(--accent-glow); width: 32px; height: 32px; font-size: 1rem">${y(v(e.name))}</span>
                    ${e.name}
                  </div>
                  <div class="drag-handle">⠿</div>
                </div>
                
                <div class="card-subtitle">${e.sets} serie × ${Array.isArray(e.reps)?e.reps.join(`-`):e.reps}</div>
                
                ${e.notes?`<div class="notes-display">📝 ${e.notes}</div>`:``}

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
                      <input type="text" value="${Array.isArray(e.reps)?e.reps[r]||e.reps[0]||`10`:e.reps}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
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
        </div>

        <div style="padding: 16px">
          <button class="btn" id="finish-workout" style="background: var(--success)">
            Concludi Allenamento
          </button>
        </div>
      </div>
    `,m&&clearInterval(m),m=setInterval(()=>{let e=Math.floor((Date.now()-h)/1e3),t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`),r=document.getElementById(`workout-timer-display`);r&&(r.innerText=`${t}:${n}`)},1e3),document.getElementById(`back-to-routines`).addEventListener(`click`,()=>{clearInterval(m),j()}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{w(),E(60)}),C(document.getElementById(`active-exercises-list`),()=>{}),document.querySelectorAll(`.check-set-btn`).forEach(e=>{e.addEventListener(`click`,t=>{w();let n=t.target.closest(`.set-row`);n.style.opacity===`0.5`?(n.style.opacity=`1`,e.style.background=`transparent`,e.style.color=`var(--accent-color)`):(n.style.opacity=`0.5`,e.style.background=`var(--accent-color)`,e.style.color=`#000`,E(i[n.getAttribute(`data-ex-idx`)].rest||60));let r=n.closest(`.card`),a=r.querySelectorAll(`.set-row`);Array.from(a).filter(e=>e.style.opacity===`0.5`).length===a.length?r.querySelector(`.exercise-feedback`).style.display=`block`:r.querySelector(`.exercise-feedback`).style.display=`none`})}),document.querySelectorAll(`.feedback-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.card`);n.querySelectorAll(`.feedback-btn`).forEach(e=>e.style.opacity=`0.4`),e.style.opacity=`1`,n.setAttribute(`data-feedback`,e.classList.contains(`pos`)?`positive`:`negative`)})}),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{let n=[];if(document.querySelectorAll(`#active-exercises-list .card`).forEach(e=>{let t=e.querySelector(`.card-title`)?.innerText.replace(/[^\x00-\x7F]/g,``).trim();if(!t)return;let r=[];e.querySelectorAll(`.set-row`).forEach(e=>{e.style.opacity===`0.5`&&r.push({weight:parseFloat(e.querySelector(`.log-weight`).value)||0,reps:e.querySelector(`.log-reps`).value||`0`})}),r.length>0&&n.push({name:t,sets:r,feedback:e.getAttribute(`data-feedback`)||`neutral`})}),n.length===0)return alert(`Non hai completato alcun esercizio!`);clearInterval(m);let i=document.getElementById(`workout-timer-display`).innerText;t.saveLog({routineName:r.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:i,type:`standard`,exercises:n});let a=l.find(t=>t.id==e);a&&(n.forEach(e=>{let t=a.exercises.find(t=>t.name===e.name);if(t){let n=e.feedback===`positive`,r=e.sets.map(e=>parseFloat(e.weight)||0),i=e.sets.map(e=>e.reps),a=!1;n&&i.forEach(e=>{parseInt(e)<8&&(a=!0)});let o=n&&!a?1:0;if(Array.isArray(t.weight)?t.weight=r.map(e=>e+o):t.weight=Math.max(...r)+o,Array.isArray(t.reps))t.reps=i.map(e=>n&&a&&(parseInt(e)||0)<8?`8`:e);else{let e=parseInt(i[0])||0;n&&a&&e<8?t.reps=`8`:t.reps=i[0]}}}),t.saveRoutines(l)),u=t.getLogs(),alert(`Allenamento salvato con successo! 🎉`),W(`dashboard`)})},B=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${u.length===0?`
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      `:u.map((e,t)=>`
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
  `,document.querySelectorAll(`.log-card`).forEach(e=>{e.addEventListener(`click`,()=>{V(e.getAttribute(`data-idx`))})})},V=e=>{let t=u[e];if(!t)return B();n.innerHTML=`
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
  `,document.getElementById(`back-to-history`).addEventListener(`click`,()=>B()),document.getElementById(`return-history`).addEventListener(`click`,()=>B())},H=()=>{let e=()=>{n.innerHTML=`
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
              <div class="card-title">${d.name} ${d.surname}</div>
              <div class="card-subtitle">"${d.nickname}" • ${d.gender===`male`?`Uomo`:`Donna`}</div>
            </div>
            <button id="edit-profile" class="badge" style="border: none; cursor: pointer">Modifica</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center">
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Età</div>
              <div style="font-weight: 700">${d.age}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Peso</div>
              <div style="font-weight: 700; color: var(--accent-color)">${d.weight} kg</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Altezza</div>
              <div style="font-weight: 700">${d.height} cm</div>
            </div>
          </div>
        </div>

        <!-- Calendario -->
        <div class="card">
          <div class="card-title">Attività Recente</div>
          <div id="calendar-mount"></div>
        </div>

        <!-- Performance -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div class="card-title">Progressione Esercizio</div>
            <select id="exercise-select" style="width: auto; margin: 0; padding: 5px 10px; font-size: 0.8rem">
              <option value="">Seleziona Esercizio</option>
              ${s().map(e=>`<option value="${e}">${e}</option>`).join(``)}
            </select>
          </div>
          <canvas id="progressChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${s().length>0?`display:none`:``}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <!-- Volume Chart -->
        <div class="card">
          <div class="card-title" style="margin-bottom: 15px">Volume Totale Sollevato (kg)</div>
          <canvas id="volumeChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-volume-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${u.length>0?`display:none`:``}">
            Nessun volume registrato.
          </div>
        </div>

        <!-- Impostazioni e Backup -->
        <div class="card">
          <div class="card-title">Personalizzazione</div>
          <div class="card-subtitle">Colore Accento</div>
          <div class="theme-picker">
            <div class="theme-circle ${t.getTheme()===`default`?`active`:``}" data-theme="default" style="background: #ccff00"></div>
            <div class="theme-circle ${t.getTheme()===`red`?`active`:``}" data-theme="red" style="background: #ff003c"></div>
            <div class="theme-circle ${t.getTheme()===`blue`?`active`:``}" data-theme="blue" style="background: #00d4ff"></div>
            <div class="theme-circle ${t.getTheme()===`purple`?`active`:``}" data-theme="purple" style="background: #9d00ff"></div>
            <div class="theme-circle ${t.getTheme()===`white`?`active`:``}" data-theme="white" style="background: #f0f0f0"></div>
          </div>

          <div style="margin-top: 25px; pt: 15px; border-top: 1px solid rgba(255,255,255,0.05)">
            <div class="card-subtitle" style="margin-bottom: 12px">Sicurezza Dati</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
              <button class="btn btn-secondary" id="export-btn" style="height: 40px; font-size: 0.8rem">Esporta Backup</button>
              <label class="btn btn-secondary" style="height: 40px; font-size: 0.8rem; margin: 0">
                Importa
                <input type="file" id="import-input" style="display: none" accept=".json">
              </label>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.7rem; padding-bottom: 20px">
          IronTrack v1.9.1 • Premium Workout Tracking
        </div>
      </div>
    `,r(),document.getElementById(`edit-profile`).addEventListener(`click`,()=>f()),document.getElementById(`show-changelog`).addEventListener(`click`,()=>U()),document.getElementById(`export-btn`).addEventListener(`click`,a),document.getElementById(`import-input`).addEventListener(`change`,e=>{e.target.files.length>0&&o(e.target.files[0])}),document.querySelectorAll(`.theme-circle`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.getAttribute(`data-theme`);t.saveTheme(r),i(r),e()})});let p=document.getElementById(`exercise-select`);if(p){let e=s();if(e.length>0){let t=e[Math.floor(Math.random()*e.length)];p.value=t,c(t)}p.addEventListener(`change`,e=>{c(e.target.value)})}l()},r=()=>{let e=document.getElementById(`calendar-mount`);if(!e)return;let t=new Date,n=t.getFullYear(),r=t.getMonth(),i=new Date(n,r,1).getDay(),a=new Date(n,r+1,0).getDate(),o=new Set(u.map(e=>{if(!e.timestamp)return null;let t=new Date(e.timestamp);return`${t.getFullYear()}-${(t.getMonth()+1).toString().padStart(2,`0`)}-${t.getDate().toString().padStart(2,`0`)}`}).filter(e=>e)),s=`
      <div class="calendar-container">
        <div class="calendar-header">
          <span style="font-weight: 700; text-transform: capitalize">${new Intl.DateTimeFormat(`it-IT`,{month:`long`,year:`numeric`}).format(t)}</span>
        </div>
        <div class="calendar-grid">
          ${[`Lun`,`Mar`,`Mer`,`Gio`,`Ven`,`Sab`,`Dom`].map(e=>`<div class="calendar-day-name">${e}</div>`).join(``)}
    `,c=i===0?6:i-1;for(let e=0;e<c;e++)s+=`<div class="calendar-day empty"></div>`;for(let e=1;e<=a;e++){let i=`${n}-${(r+1).toString().padStart(2,`0`)}-${e.toString().padStart(2,`0`)}`,a=e===t.getDate(),c=o.has(i);s+=`
        <div class="calendar-day ${a?`today`:``} ${c?`has-workout`:``}">
          ${e}
        </div>
      `}s+=`</div></div>`,e.innerHTML=s},s=()=>{let e=new Set;return u.forEach(t=>{t.exercises&&t.exercises.forEach(t=>e.add(t.name))}),Array.from(e)},c=e=>{if(!e)return;let t=u.filter(t=>t.exercises&&t.exercises.find(t=>t.name===e)).map(t=>{let n=t.exercises.find(t=>t.name===e),r=Array.isArray(n.sets)?Math.max(...n.sets.map(e=>e.weight)):typeof n.weight==`number`?n.weight:0;return{date:t.date,weight:r}}).reverse(),n=document.getElementById(`progressChart`).getContext(`2d`);window.currentChart&&window.currentChart.destroy();let r=getComputedStyle(document.body).getPropertyValue(`--accent-color`).trim()||`#ccff00`;window.currentChart=new Chart(n,{type:`line`,data:{labels:t.map(e=>e.date),datasets:[{label:`Peso Massimo (kg)`,data:t.map(e=>e.weight),borderColor:r,backgroundColor:r+`1a`,borderWidth:3,tension:.4,fill:!0,pointBackgroundColor:r,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},l=()=>{let e=document.getElementById(`volumeChart`)?.getContext(`2d`);if(!e)return;let t=u.map(e=>{let t=0;return e.exercises&&e.exercises.forEach(e=>{e.sets&&e.sets.forEach(e=>{let n=parseFloat(e.weight)||0,r=parseInt(e.reps)||0;t+=n*r})}),{date:e.date,volume:t}}).reverse().slice(-10);window.volumeChartInstance&&window.volumeChartInstance.destroy();let n=getComputedStyle(document.body).getPropertyValue(`--accent-color`).trim()||`#ccff00`;window.volumeChartInstance=new Chart(e,{type:`bar`,data:{labels:t.map(e=>e.date),datasets:[{label:`Volume (kg x reps)`,data:t.map(e=>e.volume),backgroundColor:n+`80`,borderColor:n,borderWidth:1,borderRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},f=()=>{n.innerHTML=`
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="cancel-edit" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Profilo</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Soprannome</div>
          <input type="text" id="edit-nickname" value="${d.nickname}">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="edit-age" value="${d.age}">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="edit-weight" value="${d.weight}">
            </div>
            <div style="grid-column: span 2">
              <div class="card-subtitle">Altezza (cm)</div>
              <input type="number" id="edit-height" value="${d.height||``}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `,document.getElementById(`cancel-edit`).addEventListener(`click`,()=>e()),document.getElementById(`save-profile`).addEventListener(`click`,()=>{d.nickname=document.getElementById(`edit-nickname`).value,d.age=document.getElementById(`edit-age`).value,d.weight=document.getElementById(`edit-weight`).value,d.height=document.getElementById(`edit-height`).value,t.saveUser(d),e(),alert(`Profilo aggiornato! 🦾`)})};e()},U=()=>{n.innerHTML=`
    <div class="view" style="padding: 20px">
      <header style="position: static; background: transparent; padding: 0 0 20px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-size: 1.2rem; margin: 0">Cosa c'è di nuovo</h2>
        <button id="close-changelog" style="background: none; border: none; color: var(--accent-color); font-weight: 800; cursor: pointer">CHIUDI</button>
      </header>

      <div style="display: flex; flex-direction: column; gap: 20px">
        ${c.map(e=>`
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
  `,document.getElementById(`close-changelog`).addEventListener(`click`,()=>H())},W=e=>{if(r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!D()&&!sessionStorage.getItem(`guide-skipped`)&&e===`dashboard`&&!d){sessionStorage.setItem(`guide-skipped`,`true`),O();return}if(!d&&e!==`onboarding`){k();return}switch(e){case`dashboard`:A();break;case`routines`:j();break;case`history`:B();break;case`progress`:H();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),W(e.getAttribute(`data-view`))})}),W(`dashboard`);