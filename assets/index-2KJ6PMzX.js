(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`,THEME:`iron_track_theme`,MEASUREMENTS:`iron_track_measurements`,PAUSED_WORKOUT:`iron_track_paused_workout`,ALARM_SOUND:`iron_track_alarm_sound`,ALARM_ENABLED:`iron_track_alarm_enabled`,ALARM_DURATION:`iron_track_alarm_duration`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},saveTheme:t=>{localStorage.setItem(e.THEME,t)},getTheme:()=>localStorage.getItem(e.THEME)||`default`,savePausedWorkout:t=>{t?localStorage.setItem(e.PAUSED_WORKOUT,JSON.stringify(t)):localStorage.removeItem(e.PAUSED_WORKOUT)},getPausedWorkout:()=>{let t=localStorage.getItem(e.PAUSED_WORKOUT);return t?JSON.parse(t):null},saveAlarmSound:t=>{localStorage.setItem(e.ALARM_SOUND,t)},getAlarmSound:()=>localStorage.getItem(e.ALARM_SOUND)||`classic`,saveAlarmEnabled:t=>{localStorage.setItem(e.ALARM_ENABLED,JSON.stringify(t))},getAlarmEnabled:()=>{let t=localStorage.getItem(e.ALARM_ENABLED);return t===null?!0:JSON.parse(t)},saveAlarmDuration:t=>{localStorage.setItem(e.ALARM_DURATION,JSON.stringify(t))},getAlarmDuration:()=>{let t=localStorage.getItem(e.ALARM_DURATION);return t===null?5:JSON.parse(t)},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=e=>{document.body.className=e===`default`?``:`theme-${e}`};i(t.getTheme());var a=()=>{let e={routines:t.getRoutines(),logs:t.getLogs(),user:t.getUser(),theme:t.getTheme(),version:s,exportDate:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`irontrack_backup_${new Date().toISOString().split(`T`)[0]}.json`,i.click(),URL.revokeObjectURL(r)},o=e=>{let n=new FileReader;n.onload=e=>{try{let n=JSON.parse(e.target.result);confirm(`Questo sovrascriverà tutti i dati attuali. Sei sicuro?`)&&(n.routines&&t.saveRoutines(n.routines),n.logs&&localStorage.setItem(`iron_track_logs`,JSON.stringify(n.logs)),n.user&&t.saveUser(n.user),n.theme&&t.saveTheme(n.theme),alert(`Dati importati con successo! L'app verrà ricaricata.`),window.location.reload())}catch{alert(`Errore durante l'importazione. Il file potrebbe essere corrotto.`)}},n.readAsText(e)},s=`v2.4.0`,c=[{version:`v2.4.0`,title:`Audio Continuo, Smart Rest, PR 1RM & Esportazione Grafica`,changes:[`Musica In-App senza Interruzioni (Web Audio API): I timer di recupero e le allerte acustiche suonano senza mai bloccare o intercettare la riproduzione in sottofondo da Spotify, Apple Music o altre app musicali`,`Evidenziazione 'Carico Facile' Usa e Getta: Al feedback positivo (👍), l'esercizio si colora di verde con badge brillante nella scheda solo per il workout successivo, auto-resettandosi a fine sessione per una valutazione sempre attuale`,`Personalizzazione Aumenti al 👍 su Scheda & Micro-carichi: Nuova opzione di personalizzazione in creazione/modifica scheda con anteprima testuale interattiva; supporto ai micro-carichi (+0.5 kg, +1.25 kg) e incremento ripetizioni (+1 rep, +2 reps)`,`Autoregolazione In-Workout (Smart Rest): I pulsanti di valutazione sono sempre visibili in sessione per segnalare subito eventuale fatica (👎); il timer del riposo aggiunge automaticamente +45s con alert visivo e segnale acustico`,`Celebrazione Personal Record (PR 1RM): Calcolo in tempo reale del massimale stimato (Formula di Epley) al check di ogni serie, confronto automatico con lo storico, fanfara celebrativa con trofeo in modal e badge '🏆 PR' integrato`,`Esportazione Scheda in Immagine Elegante: Motore grafico basato su Canvas 2D per generare un'esclusiva immagine verticale PNG in stile Dark Glassmorphism ad alta definizione, pronta per download o condivisione immediata`]},{version:`v2.3.0`,title:`Mappa di Recupero Muscolare`,changes:[`Mappa Corporea Interattiva: Visualizzazione stilizzata del corpo umano (Fronte e Retro) che mostra lo stato di freschezza muscolare di ciascun distretto`,`Stati e Soglie di Recupero: Colori dinamici basati sullo storico degli allenamenti completati: Rosso (Affaticato, <50%), Giallo (In recupero, 50-85%) e Verde (Fresco/Pronto, 86-100%)`,`Dettagli di Recupero: Clicca su un muscolo per vedere la percentuale esatta, le ore mancanti al recupero, e la data dell'ultimo allenamento registrato`,`Pulsazione Attiva: Effetto di pulsazione luminosa rossa per i muscoli congestionati, evidenziando visivamente la necessità di riposo`]},{version:`v2.2.0`,title:`Saturazione Automatica & Personalizzazione Premium`,changes:[`Switch Progressione Globale: Attiva/disattiva gli incrementi automatici dei pesi in Settings per un controllo assoluto`,`Passo Auto in base al Muscolo: Calcola l'incremento ideale in modo scientifico (+2.5 kg per Petto/Dorsali/Quadricipiti, +1 kg per Spalle/Braccia/Addome)`,`Tre Nuove Modalità di Progressioni: Mista (Reps → Peso), Solo Peso (incremento diretto) o Solo Reps (ottimale per corpo libero fino a max 15)`,`Simulatore Split-Screen & Solo Reps: Anteprima visiva affiancata del comportamento sui gruppi muscolari e con cappello blu per le reps`,`Modalità Esercizio Eredita: Scegli per ogni singolo esercizio se ereditare le impostazioni globali o personalizzare logica, passo e applicazione`]},{version:`v2.1.1`,title:`Progressione Avanzata & Autoregolazione`,changes:[`Progressione per Esercizio: imposta strategie di incremento personalizzate per ciascun esercizio direttamente in modifica scheda`,`Autoregolazione (Smart Deload): se accumuli 3 feedback negativi consecutivi sullo stesso esercizio, a fine allenamento ti proporremo uno scarico del -10% peso`,`Doppia Progressione Classica: supporto integrato per i range di reps (es. 8-12 reps) che aumenta il peso solo al completamento del range massimo`,`Simulatore di Progressione: grafico a barre interattivo in Impostazioni che visualizza in tempo reale come cambieranno i pesi dei tuoi set`,`Pulsanti Info (Tooltips): icone esplicative 'ℹ️' per comprendere pedagogicamente ogni singola impostazione`]},{version:`v2.1.0`,title:`Progressione Personalizzata & Storico Avanzato`,changes:[`Progressione su misura: scegli come incrementare i carichi (tutte le serie, ultima serie, prima serie o alternate)`,`Incrementi flessibili: seleziona il passo (1, 2, 2.5, 5 kg/lbs) e la soglia minima di ripetizioni`,`Sovraccarico Storico: applica istantaneamente i carichi di una sessione passata alla scheda attiva con lo stesso nome`,`Conferma Sicura: sistema di conferma prima di sovrascrivere i carichi della scheda attiva`,`Indicatore 'Carico Facile': gli esercizi con feedback positivo nella sessione precedente saranno evidenziati in verde la volta successiva`]},{version:`v2.0.0`,title:`Navigazione Sicura & Impostazioni`,changes:[`Sistema di Pausa: Previeni l'interruzione accidentale dell'allenamento`,`Nuova Sezione Impostazioni dedicata per gestire Profilo, Unità e Backup`,`Allarme Timer riscritto per maggiore affidabilità in background`,`Supporto per Kg e Libbre`]},{version:`v1.9.2`,title:`Sincronizzazione Timer`,changes:[`Risolto blocco del timer di recupero e del circuito in standby o in background`,`Calcolo basato su timestamp assoluti per massima precisione`,`Sincronizzazione immediata al rientro nell'app`]},{version:`v1.9.1`,title:`Progressi & Volume`,changes:[`Progressione intelligente: aumenta reps o carichi in base al feedback`,`Persistenza automatica di carichi e reps sulla scheda`,`Nuovo grafico del Volume Totale`,`Calendario mensile evidenziato correttamente`]},{version:`v1.9.0`,title:`Personalizzazione & Flow`,changes:[`Riordino Dinamico: Sposta gli esercizi con un tocco (Drag & Drop)`,`Note Esercizio: Aggiungi promemoria per ogni esercizio`,`Ripetizioni Variabili: Imposta reps diverse per ogni serie`,`Stima Durata: Calcolo automatico della durata dell'allenamento`,`Interfaccia Migliorata: Nuovo sistema di inserimento rapido`]},{version:`v1.8.0`,title:`L'Evoluzione`,changes:[`Backup & Ripristino: Esporta i tuoi dati per non perderli mai`,`Calendario Allenamenti: Visualizza la tua costanza mensile`,`Temi Personalizzati: Scegli il tuo colore (Red, Blue, Purple, White)`,`Icone Esercizi: Migliorata la navigazione visiva dei muscoli`]},{version:`v1.7.0`,title:`Circuiti & Visione`,changes:[`Gestione Circuiti AMRAP con timer e round`,`Rilevamento automatico schede cartacee (OCR)`,`Correzione refusi motivazionali`]},{version:`v1.6.0`,title:`Controllo Totale`,changes:[`Timer di recupero personalizzabile per esercizio`,`Anteprima scheda prima di iniziare`,`Impostazione carichi iniziali nella creazione`,`Inserimento manuale esercizi migliorato`]},{version:`v1.5.0`,title:`Update Professionale`,changes:[`Database esercizi con menu a tendina`,`Auto-valutazione serie (👍/👎) e aumento carichi intelligente`,`Dettaglio storico allenamenti cliccabile`]},{version:`v1.4.0`,title:`Guida Intelligente`,changes:[`Guida all'installazione per nuovi utenti`,`Rilevamento automatico modalità standalone`]},{version:`v1.3.0`,title:`Sessioni & Timer`,changes:[`Timer durata totale allenamento`,`Dettaglio durata nella cronologia`,`Migliorato sistema di aggiornamento`]},{version:`v1.2.0`,title:`Training Flow`,changes:[`Spunta serie completate`,`Avvio automatico timer di riposo al check`,`Allarme sonoro al termine del recupero`]},{version:`v1.1.0`,title:`Personalizzazione`,changes:[`Profilo utente completo (Età, Peso, Altezza)`,`Soprannome personalizzato`,`Frasi motivazionali dinamiche (Gymbo/Guerriera)`]},{version:`v1.0.0`,title:`Lancio IronTrack`,changes:[`Gestione schede allenamento`,`Tracking pesi e ripetizioni`,`Dark Mode & Premium Design`]}],l=`dashboard`,u=t.getRoutines(),d=t.getLogs(),f=t.getUser();if(f){let e=!1;f.progressionEnabled===void 0&&(f.progressionEnabled=!0,e=!0),f.progressionType===void 0&&(f.progressionType=`all`,e=!0),f.progressionStep===void 0&&(f.progressionStep=`auto`,e=!0),f.repsThreshold===void 0&&(f.repsThreshold=8,e=!0),f.progressionMode===void 0&&(f.progressionMode=`mixed`,e=!0),e&&t.saveUser(f)}var p=t.getPausedWorkout?t.getPausedWorkout():null,m=null,h=null,g=null,_=null,v=null,y=null,b=null,ee=()=>{let e=g;if(!(!e||_))try{let t=e.createOscillator(),n=e.createGain();n.gain.value=0,t.connect(n),n.connect(e._masterGain||e.destination),t.start(),_=t}catch{}},te=()=>{if(_){try{_.stop()}catch{}_=null}};u.length===0&&(u=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0,rest:90},{name:`Rematore`,sets:3,reps:`10-12`,weight:50,rest:60},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20,rest:60}]},{id:3,name:`Circuito Full Body 🔥`,type:`circuit`,duration:50,exercises:[{name:`Piegamenti sulle braccia`,sets:1,reps:`10`,weight:0},{name:`Jump squat verticale`,sets:1,reps:`10`,weight:0},{name:`Russian twist con kettlebell`,sets:1,reps:`10xlato`,weight:10},{name:`Corsa`,sets:1,reps:`2 min`,weight:0},{name:`Rematore / Australian Pull-up`,sets:1,reps:`10`,weight:0},{name:`Step up su panca`,sets:1,reps:`10xlato`,weight:0},{name:`Plank tocco spalla`,sets:1,reps:`10xlato`,weight:0},{name:`Cyclette 80-90rpm`,sets:1,reps:`2 min`,weight:0},{name:`Arnold press manubri`,sets:1,reps:`10`,weight:10},{name:`Dips su panca`,sets:1,reps:`10`,weight:0},{name:`Leg raises sdraiato`,sets:1,reps:`10`,weight:0},{name:`Cyclette con ventilatore`,sets:1,reps:`2 min`,weight:0}]}],t.saveRoutines(u));var x={Petto:[`Panca Piana Bilanciere`,`Panca Inclinata Manubri`,`Panca Piana`,`Croci ai Cavi`,`Dips`,`Chest Press`,`Pectoral Machine`,`Push Up`],Dorsali:[`Trazioni alla Sbarra`,`Trazioni`,`Lat Machine`,`Rematore Bilanciere`,`Rematore Manubrio`,`Pulley`,`Pull-down braccia tese`],Trapezi:[`Scrollate Bilanciere`,`Scrollate Manubri`,`Tirate al Mento`,`Face Pull`],Lombari:[`Stacco`,`Stacchi Romeni`,`Hyperextension`,`Good Morning`],Quadricipiti:[`Squat Bilanciere`,`Squat`,`Leg Press`,`Affondi`,`Leg Extension`],Femorali:[`Leg Curl`,`Stacchi Romeni`],Glutei:[`Hip Thrust`,`Affondi`,`Glute Bridge`,`Abductor Machine`],Polpacci:[`Calf Raises`,`Calf Press`],Spalle:[`Military Press`,`Alzate Laterali`,`Lento Avanti Manubri`,`Alzate Frontali`,`Shoulder Press`],Bicipiti:[`Curl Bilanciere`,`Curl Manubri`,`Hammer Curl`,`Curl panca Scott`,`Spider Curl`],Tricipiti:[`Pushdown Tricipiti`,`French Press`,`Estensioni dietro nuca`,`Kickback`,`Dips su panca`],Addome:[`Crunch`,`Plank`,`Leg Raises`,`Ab Roller`,`Russian Twist`,`Sit-up`],Altro:[]},S={Petto:`🫁`,Dorsali:`🦅`,Trapezi:`🔺`,Lombari:`🔻`,Quadricipiti:`🦵`,Femorali:`🍗`,Glutei:`🍑`,Polpacci:`🦶`,Spalle:`🛡️`,Bicipiti:`💪`,Tricipiti:`⚡`,Addome:`🧱`,Altro:`🏋️`},C=e=>{if(!e)return``;for(let[t,n]of Object.entries(x))if(n.includes(e))return t;let t=e.toLowerCase();for(let e of[{muscle:`Femorali`,keywords:[`leg curl`,`stacchi a gambe`,`stacchi romeni`,`stacco rumeno`,`stacco a gambe`,`femorali`]},{muscle:`Lombari`,keywords:[`stacco`,`stacchi`,`hyperextension`,`good morning`,`lombari`]},{muscle:`Petto`,keywords:[`panca`,`croci`,`chest`,`dips`,`push up`,`piegamenti`,`pectoral`,`petto`]},{muscle:`Dorsali`,keywords:[`trazioni`,`lat machine`,`rematore`,`pulley`,`pull-down`,`pull down`,`dorso`,`dorsali`]},{muscle:`Trapezi`,keywords:[`scrollate`,`shrug`,`face pull`,`tirate al mento`,`trapezi`]},{muscle:`Quadricipiti`,keywords:[`squat`,`leg press`,`affondi`,`leg extension`,`quads`,`quadricipiti`]},{muscle:`Glutei`,keywords:[`hip thrust`,`glute`,`abductor`,`ponte`]},{muscle:`Polpacci`,keywords:[`calf`,`polpacci`]},{muscle:`Spalle`,keywords:[`military`,`lento`,`alzate`,`shoulder`,`spalle`,`deltoidi`,`delt`]},{muscle:`Bicipiti`,keywords:[`curl`,`bicipiti`,`biceps`]},{muscle:`Tricipiti`,keywords:[`pushdown`,`french`,`estensioni`,`kickback`,`tricipiti`,`triceps`]},{muscle:`Addome`,keywords:[`crunch`,`plank`,`leg raises`,`ab roller`,`twist`,`sit-up`,`sit up`,`addominali`,`core`,`addome`]}])if(e.keywords.some(e=>t.includes(e)))return e.muscle;return`Altro`},w=e=>S[e]||S.Altro,T={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbro {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},E=()=>{if(!f)return`Pronto per l'allenamento?`;let e=T[f.gender]||T.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,f.nickname||f.name||``)},D=e=>{if(!e||!e.exercises)return 0;let t=0;return e.exercises.forEach(e=>{let n=parseInt(e.sets)||1,r=parseInt(e.rest)||60;t+=n*45+(n-1)*r}),Math.round(t/60+5)},O=(e,t)=>{e.querySelectorAll(`.draggable-item`).forEach(r=>{let i=r.querySelector(`.drag-handle`);r.setAttribute(`draggable`,!0),r.addEventListener(`dragstart`,e=>{r.classList.add(`dragging`)}),r.addEventListener(`dragend`,()=>{r.classList.remove(`dragging`),t&&t()}),i&&(i.addEventListener(`touchstart`,e=>{r.classList.add(`dragging`)},{passive:!0}),i.addEventListener(`touchmove`,t=>{t.preventDefault();let r=t.touches[0],i=e.querySelector(`.dragging`);if(!i)return;let a=n(e,r.clientY);a==null?e.appendChild(i):e.insertBefore(i,a)},{passive:!1}),i.addEventListener(`touchend`,()=>{r.classList.contains(`dragging`)&&(r.classList.remove(`dragging`),t&&t())}))}),e.addEventListener(`dragover`,t=>{t.preventDefault();let r=e.querySelector(`.dragging`);if(!r)return;let i=n(e,t.clientY);i==null?e.appendChild(r):e.insertBefore(r,i)});function n(e,t){return[...e.querySelectorAll(`.draggable-item:not(.dragging)`)].reduce((e,n)=>{let r=n.getBoundingClientRect(),i=t-r.top-r.height/2;return i<0&&i>e.offset?{offset:i,element:n}:e},{offset:-1/0}).element}},k=()=>{if(!g)try{let e=window.AudioContext||window.webkitAudioContext;e&&(g=new e,g._masterGain=g.createGain(),g._masterGain.gain.value=1,g._masterGain.connect(g.destination))}catch{return}let e=g;if(!e)return;let t=()=>{try{let t=e.createOscillator(),n=e.createGain();t.frequency.value=440,n.gain.setValueAtTime(.001,e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.05),t.connect(n),n.connect(e._masterGain||e.destination),t.start(e.currentTime),t.stop(e.currentTime+.05)}catch{}};e.state===`suspended`?e.resume().then(t).catch(()=>{}):t()},A=e=>{let t=g;if(!t)return;let n=t.currentTime,r=t._masterGain||t.destination;try{if(e===`digital`)[0,.16,.32].forEach(e=>{let i=t.createOscillator(),a=t.createGain();i.type=`square`,i.frequency.value=1200,a.gain.setValueAtTime(0,n+e),a.gain.linearRampToValueAtTime(.7,n+e+.01),a.gain.setValueAtTime(.7,n+e+.07),a.gain.linearRampToValueAtTime(0,n+e+.08),i.connect(a),a.connect(r),i.start(n+e),i.stop(n+e+.1)});else if(e===`gong`)[[220,.9],[440,.5],[660,.25]].forEach(([e,i])=>{let a=t.createOscillator(),o=t.createGain();a.type=`sine`,a.frequency.value=e,o.gain.setValueAtTime(i*.8,n),o.gain.exponentialRampToValueAtTime(1e-4,n+1.5),a.connect(o),o.connect(r),a.start(n),a.stop(n+1.5)});else if(e===`pr_fanfare`)[[523.25,0,.2],[659.25,.18,.38],[783.99,.36,.56],[1046.5,.54,1.5]].forEach(([e,i,a])=>{let o=t.createOscillator(),s=t.createGain();o.type=`sine`,o.frequency.value=e,s.gain.setValueAtTime(0,n+i),s.gain.linearRampToValueAtTime(.7,n+i+.02),s.gain.setValueAtTime(.7,n+a-.05),s.gain.linearRampToValueAtTime(0,n+a),o.connect(s),s.connect(r),o.start(n+i),o.stop(n+a+.01)});else{let e=t.createOscillator(),i=t.createGain();e.type=`sine`,e.frequency.value=880,i.gain.setValueAtTime(0,n),i.gain.linearRampToValueAtTime(.9,n+.015),i.gain.setValueAtTime(.9,n+.3),i.gain.linearRampToValueAtTime(0,n+.38),e.connect(i),i.connect(r),e.start(n),e.stop(n+.4)}}catch{}},j=e=>{let t=g;t&&(t.state===`suspended`?t.resume().then(()=>A(e)).catch(()=>{}):A(e))},ne=e=>{k(),setTimeout(()=>j(e),80)},re=()=>{k(),setTimeout(()=>j(`pr_fanfare`),80)},M=()=>{if(!t.getAlarmEnabled())return navigator.vibrate&&navigator.vibrate([500,200,500,200,500]),()=>{navigator.vibrate&&navigator.vibrate(0)};navigator.vibrate&&navigator.vibrate([500,200,500,200,500]);let e=null,n=!1,r=t.getAlarmSound()||`classic`,i=r===`gong`?2200:r===`digital`?700:1100,a=()=>{n||(navigator.vibrate&&navigator.vibrate(300),j(r))};a(),e=setInterval(a,i);let o=setTimeout(()=>{e&&clearInterval(e)},6e4);return()=>{n=!0,e&&=(clearInterval(e),null),clearTimeout(o),navigator.vibrate&&navigator.vibrate(0)}},N=()=>{let e=document.getElementById(`rest-timer-overlay`);if(e&&window.activeRestTimerEndTime){if(window.activeRestTimerEndTime+=45e3,!document.getElementById(`smart-rest-box`)){let t=document.createElement(`div`);t.id=`smart-rest-box`,t.className=`smart-rest-alert`,t.innerHTML=`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <span><strong>Smart Rest (+45s):</strong> Autoregolazione attiva per fatica elevata!</span>
      `;let n=e.querySelector(`#stop-timer`);n?e.insertBefore(t,n):e.appendChild(t)}let t=g;if(t&&t.state!==`suspended`)try{let e=t.createOscillator(),n=t.createGain();e.connect(n),n.connect(t._masterGain||t.destination),e.type=`triangle`,e.frequency.setValueAtTime(440,t.currentTime),e.frequency.exponentialRampToValueAtTime(880,t.currentTime+.3),n.gain.setValueAtTime(.4,t.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+.35),e.start(t.currentTime),e.stop(t.currentTime+.35)}catch{}b&&b()}},P=(e,n=!1)=>{k();let r=document.getElementById(`rest-timer-overlay`);r&&r.remove(),h&&clearInterval(h);let i=document.createElement(`div`);i.id=`rest-timer-overlay`,i.style=`
    position: fixed; bottom: 100px; left: 16px; right: 16px;
    background: var(--card-bg); border: 2px solid var(--accent-color);
    border-radius: 20px; padding: 20px; z-index: 2000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center;
    animation: slideUp 0.3s ease-out;
  `,window.activeRestTimerEndTime=Date.now()+e*1e3;let a=null;i.innerHTML=`
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO ${n?`(SMART REST)`:``}</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${e}s</div>
    ${n?`
      <div id="smart-rest-box" class="smart-rest-alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <span><strong>Smart Rest (+45s):</strong> Autoregolazione attiva per fatica elevata!</span>
      </div>
    `:``}
    <button id="stop-timer" class="btn" style="margin-top: 15px; background: var(--danger); height: 45px; padding: 0 30px">Annulla</button>
  `,document.body.appendChild(i);let o=()=>{let e=document.getElementById(`timer-display`);if(!e){clearInterval(h),b=null;return}let n=Math.max(0,Math.ceil((window.activeRestTimerEndTime-Date.now())/1e3));if(e.innerText=n+`s`,n<=0){if(clearInterval(h),b=null,e.innerText=`FINE! 🔥`,e.style.animation=`pulse 0.5s infinite`,!a){a=M();let e=t.getAlarmDuration()*1e3;setTimeout(()=>{a&&=(a(),null);let e=document.getElementById(`rest-timer-overlay`);e&&(e.style.animation=`slideDown 0.3s ease-in forwards`,setTimeout(()=>e.remove(),300))},e)}let n=document.getElementById(`stop-timer`);n&&(n.innerText=`STOP ALLARME`,n.style.background=`var(--accent-color)`,n.style.color=`#000`)}};b=o,h=setInterval(o,1e3),document.getElementById(`stop-timer`).addEventListener(`click`,()=>{a&&a(),clearInterval(h),b=null,i.remove()})},F=()=>window.navigator.standalone||window.matchMedia(`(display-mode: standalone)`).matches,I=()=>{n.innerHTML=`
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
  `,document.getElementById(`skip-guide`).addEventListener(`click`,()=>{f?R():L()})},L=(e=1,r={})=>{e===1?(n.innerHTML=`
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
    `,document.querySelectorAll(`.gender-btn`).forEach(e=>{e.addEventListener(`click`,()=>{L(2,{gender:e.getAttribute(`data-gender`)})})})):(n.innerHTML=`
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
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>L(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);f=e,t.saveUser(f),Z(`dashboard`)}))},R=()=>{if(!f){L();return}let e=d[0]||{routineName:`Nessun allenamento`,date:`-`},t=d.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${f.gender===`male`?`Bentornato, Gymbro`:`Bentornata, Guerriera`}</div>
        <div class="card-title" style="font-size: 1.5rem">${E()}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${t}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Peso Attuale</div>
          <div class="stat-value">${f.weight||`--`} kg</div>
        </div>
      </div>

      <div class="card">
        <div class="card-subtitle">Ultima sessione</div>
        <div class="card-title">${e.routineName}</div>
        <div class="card-subtitle">${e.date}</div>
      </div>

      ${p?`
      <div style="padding: 0 16px; margin-bottom: 20px;">
        <button class="btn pulse" id="resume-workout" style="background: var(--accent-color); color: #000; border: none;">
          Riprendi Allenamento in Pausa
        </button>
      </div>
      `:``}

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
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{Z(`routines`)});let r=document.getElementById(`resume-workout`);r&&r.addEventListener(`click`,()=>{p.type===`circuit`?K(p.routineId,!0):q(p.routineId,!0)})},z=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000; display: flex; align-items: center; gap: 4px; padding: 6px 10px">Inserimento rapido 📷✏️</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${u.map(e=>{let t=e.exercises[0],n=w(t?C(t.name):`Altro`),r=D(e),i=e.exercises&&e.exercises.some(e=>e.hadPositiveFeedback===!0);return`
            <div class="card routine-card ${i?`easy-load-card`:``}" data-id="${e.id}" style="position: relative">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
                <div style="display: flex; align-items: center; gap: 15px">
                  <div class="ex-icon" style="background: var(--accent-glow); color: var(--accent-color); font-size: 1.2rem; width: 45px; height: 45px">${n}</div>
                  <div>
                    <div class="card-title">${e.name}</div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <div class="card-subtitle">${e.type===`circuit`?`🔄 Circuito`:`💪 Standard`} • ${e.exercises.length} esercizi</div>
                      <div class="est-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${r} min
                      </div>
                      ${i?`<span class="easy-load-badge">⚡ Aumenta Carichi</span>`:``}
                    </div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; right: 16px; top: 20px; display: flex; gap: 12px">
                <button class="export-routine-btn" data-id="${e.id}" title="Esporta Immagine PNG" style="background: none; border: none; color: var(--accent-color); cursor: pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
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
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{H()}),document.getElementById(`scan-routine-btn`).addEventListener(`click`,()=>{ae()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||ie(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.edit-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),V(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.export-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-id`),r=u.find(e=>e.id==n);r&&W(r)})}),document.querySelectorAll(`.delete-routine-btn`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.stopPropagation(),confirm(`Sei sicuro di voler eliminare questa scheda?`)){let n=parseInt(e.getAttribute(`data-id`));u=u.filter(e=>e.id!==n),t.saveRoutines(u),z()}})})},B=e=>{let t=e.progressionMode&&e.progressionMode!==`inherit`?e.progressionMode:f?.progressionMode||`mixed`,n=e.progressionStep&&e.progressionStep!==`inherit`?e.progressionStep:f?.progressionStep||`auto`,r=n===`auto`?[`Petto`,`Dorsali`,`Quadricipiti`,`Femorali`,`Glutei`,`Lombari`].includes(C(e.name))?`+2.5kg`:`+1kg`:`+${n}kg`;return t===`weight-only`?`ℹ️ Al 👍: carica subito ${r} al prossimo allenamento.`:t===`reps-only`?`ℹ️ Al 👍: aumenta le ripetizioni (+1 rep per serie) mantenendo stabile il peso.`:t===`mixed`?`ℹ️ Al 👍 (Doppia Progressione): scala prima le ripetizioni fino alla soglia max, poi aumenta il carico di ${r} e riparti dalle reps minime!`:`ℹ️ Progressione intelligente al feedback 👍.`},V=e=>{let r=u.find(t=>t.id==e),i=r.exercises.map(e=>({...e,_muscle:C(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})),a=r.type||`standard`,o=()=>{n.innerHTML=`
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
                        ${Object.keys(x).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(x[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08)">
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 2px 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  📈 Regola di Aumento al 👍 ${e.progressionMode&&e.progressionMode!==`inherit`?`(Personalizzata)`:`(Default)`}
                </button>
                <div class="ex-progression-settings-panel progression-rules-panel" style="display: none;">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">TIPO AUMENTO</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionMode||e.progressionMode===`inherit`?`selected`:``}>Eredita dal Profilo</option>
                      <option value="mixed" ${e.progressionMode===`mixed`?`selected`:``}>Doppia (Reps → poi Carico)</option>
                      <option value="weight-only" ${e.progressionMode===`weight-only`?`selected`:``}>Solo Carico (KG)</option>
                      <option value="reps-only" ${e.progressionMode===`reps-only`?`selected`:``}>Solo Ripetizioni (Reps)</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SU QUALI SERIE</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionType||e.progressionType===`inherit`?`selected`:``}>Eredita</option>
                      <option value="all" ${e.progressionType===`all`?`selected`:``}>Tutte le Serie</option>
                      <option value="last" ${e.progressionType===`last`?`selected`:``}>Solo Ultima (Top Set)</option>
                      <option value="first" ${e.progressionType===`first`?`selected`:``}>Solo Prima Serie</option>
                      <option value="alternate" ${e.progressionType===`alternate`?`selected`:``}>Serie Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">MICRO / MACRO KG</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionStep||e.progressionStep===`inherit`?`selected`:``}>Eredita</option>
                      <option value="auto" ${e.progressionStep===`auto`?`selected`:``}>🤖 Auto (in base al muscolo)</option>
                      <option value="0.5" ${e.progressionStep==.5?`selected`:``}>+0.5 kg (Micro-carico)</option>
                      <option value="1" ${e.progressionStep==1?`selected`:``}>+1 kg</option>
                      <option value="1.25" ${e.progressionStep==1.25?`selected`:``}>+1.25 kg (Micro-carico)</option>
                      <option value="2" ${e.progressionStep==2?`selected`:``}>+2 kg</option>
                      <option value="2.5" ${e.progressionStep==2.5?`selected`:``}>+2.5 kg</option>
                      <option value="5" ${e.progressionStep==5?`selected`:``}>+5 kg (Macro-carico)</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">TETTO RIPETIZIONI</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.repsThreshold||e.repsThreshold===`inherit`?`selected`:``}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(t=>`<option value="${t}" ${e.repsThreshold==t?`selected`:``}>${t} reps max</option>`).join(``)}
                    </select>
                  </div>
                  <div class="prog-rule-summary">${B(e)}</div>
                </div>
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
    `,document.getElementById(`cancel-edit-routine`).addEventListener(`click`,()=>z()),O(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`edit-routine-type`);e.addEventListener(`change`,()=>{s(),a=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));i[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._manual=!i[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiWeight=!i[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiReps=!i[t]._multiReps,o()})}),document.querySelectorAll(`.ex-prog-mode, .ex-prog-step, .ex-prog-type, .ex-prog-thresh`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=e.target.closest(`.exercise-form-card`);if(t){let e=parseInt(t.getAttribute(`data-index`)),n=t.querySelector(`.prog-rule-summary`);n&&i[e]&&(n.innerHTML=B(i[e]))}})}),document.getElementById(`add-ex-row-edit`).addEventListener(`click`,()=>{s(),i.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i.splice(t,1),o()})}),document.getElementById(`save-edited-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`edit-routine-name`).value,n=document.getElementById(`edit-routine-type`).value,a=parseInt(document.getElementById(`edit-routine-duration`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let o={id:r.id,name:e,type:n,duration:n===`circuit`?a:null,exercises:i.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``,progressionMode:e.progressionMode||`inherit`,progressionType:e.progressionType||`inherit`,progressionStep:e.progressionStep||`inherit`,repsThreshold:e.repsThreshold||`inherit`,repsRange:e.repsRange||(typeof e.reps==`string`&&e.reps.includes(`-`)?e.reps:void 0)}))};if(o.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);let c=u.findIndex(e=>e.id==r.id);u[c]=o,t.saveRoutines(u),z()})},s=()=>{let e=a,t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let r=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...i[r]};c.name=a?a.value:``,c.notes=s?s.value:``;let l=n.querySelector(`.ex-prog-mode`),u=n.querySelector(`.ex-prog-type`),d=n.querySelector(`.ex-prog-step`),f=n.querySelector(`.ex-prog-thresh`);if(c.progressionMode=l?l.value:`inherit`,c.progressionType=u?u.value:`inherit`,c.progressionStep=d?d.value===`inherit`?`inherit`:d.value===`auto`?`auto`:parseFloat(d.value):`inherit`,c.repsThreshold=f?f.value===`inherit`?`inherit`:parseInt(f.value):`inherit`,typeof c.reps==`string`&&c.reps.includes(`-`)&&(c.repsRange=c.reps),e===`circuit`)c.reps=o?o.value:`10`,c.sets=1,c.rest=0,c.weight=parseFloat(n.querySelector(`.ex-weight-edit`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set-edit`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set-edit`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-edit`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),i=t};o()},H=(e=null)=>{let r=e?e.map(e=>({...e,_muscle:C(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})):[{name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}],i=`standard`,a=50,o=()=>{n.innerHTML=`
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
                        ${Object.keys(x).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(x[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08)">
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 2px 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  📈 Regola di Aumento al 👍 ${e.progressionMode&&e.progressionMode!==`inherit`?`(Personalizzata)`:`(Default)`}
                </button>
                <div class="ex-progression-settings-panel progression-rules-panel" style="display: none;">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">TIPO AUMENTO</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionMode||e.progressionMode===`inherit`?`selected`:``}>Eredita dal Profilo</option>
                      <option value="mixed" ${e.progressionMode===`mixed`?`selected`:``}>Doppia (Reps → poi Carico)</option>
                      <option value="weight-only" ${e.progressionMode===`weight-only`?`selected`:``}>Solo Carico (KG)</option>
                      <option value="reps-only" ${e.progressionMode===`reps-only`?`selected`:``}>Solo Ripetizioni (Reps)</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SU QUALI SERIE</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionType||e.progressionType===`inherit`?`selected`:``}>Eredita</option>
                      <option value="all" ${e.progressionType===`all`?`selected`:``}>Tutte le Serie</option>
                      <option value="last" ${e.progressionType===`last`?`selected`:``}>Solo Ultima (Top Set)</option>
                      <option value="first" ${e.progressionType===`first`?`selected`:``}>Solo Prima Serie</option>
                      <option value="alternate" ${e.progressionType===`alternate`?`selected`:``}>Serie Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">MICRO / MACRO KG</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionStep||e.progressionStep===`inherit`?`selected`:``}>Eredita</option>
                      <option value="auto" ${e.progressionStep===`auto`?`selected`:``}>🤖 Auto (in base al muscolo)</option>
                      <option value="0.5" ${e.progressionStep==.5?`selected`:``}>+0.5 kg (Micro-carico)</option>
                      <option value="1" ${e.progressionStep==1?`selected`:``}>+1 kg</option>
                      <option value="1.25" ${e.progressionStep==1.25?`selected`:``}>+1.25 kg (Micro-carico)</option>
                      <option value="2" ${e.progressionStep==2?`selected`:``}>+2 kg</option>
                      <option value="2.5" ${e.progressionStep==2.5?`selected`:``}>+2.5 kg</option>
                      <option value="5" ${e.progressionStep==5?`selected`:``}>+5 kg (Macro-carico)</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">TETTO RIPETIZIONI</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.repsThreshold||e.repsThreshold===`inherit`?`selected`:``}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(t=>`<option value="${t}" ${e.repsThreshold==t?`selected`:``}>${t} reps max</option>`).join(``)}
                    </select>
                  </div>
                  <div class="prog-rule-summary">${B(e)}</div>
                </div>
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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>z()),O(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`routine-type-select`);e.addEventListener(`change`,()=>{s(),i=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));r[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._manual=!r[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiWeight=!r[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiReps=!r[t]._multiReps,o()})}),document.querySelectorAll(`.ex-prog-mode, .ex-prog-step, .ex-prog-type, .ex-prog-thresh`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=e.target.closest(`.exercise-form-card`);if(t){let e=parseInt(t.getAttribute(`data-index`)),n=t.querySelector(`.prog-rule-summary`);n&&r[e]&&(n.innerHTML=B(r[e]))}})}),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{s(),r.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r.splice(t,1),o()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`routine-name-input`).value,n=document.getElementById(`routine-type-select`).value,i=parseInt(document.getElementById(`routine-duration-input`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let a={id:Date.now(),name:e,type:n,duration:n===`circuit`?i:null,exercises:r.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``,progressionMode:e.progressionMode||`inherit`,progressionType:e.progressionType||`inherit`,progressionStep:e.progressionStep||`inherit`,repsThreshold:e.repsThreshold||`inherit`,repsRange:e.repsRange||(typeof e.reps==`string`&&e.reps.includes(`-`)?e.reps:void 0)}))};if(a.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);u.push(a),t.saveRoutines(u),z()})},s=()=>{let e=i;document.getElementById(`routine-duration-input`)&&(a=parseInt(document.getElementById(`routine-duration-input`).value)||50);let t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let i=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...r[i]};c.name=a?a.value:``,c.notes=s?s.value:``;let l=n.querySelector(`.ex-prog-mode`),u=n.querySelector(`.ex-prog-type`),d=n.querySelector(`.ex-prog-step`),f=n.querySelector(`.ex-prog-thresh`);if(c.progressionMode=l?l.value:`inherit`,c.progressionType=u?u.value:`inherit`,c.progressionStep=d?d.value===`inherit`?`inherit`:d.value===`auto`?`auto`:parseFloat(d.value):`inherit`,c.repsThreshold=f?f.value===`inherit`?`inherit`:parseInt(f.value):`inherit`,typeof c.reps==`string`&&c.reps.includes(`-`)&&(c.repsRange=c.reps),e===`circuit`)c.sets=1,c.rest=0,c.reps=o?o.value:`10`,c.weight=parseFloat(n.querySelector(`.ex-weight-init`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-init`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),r=t};o()},U=(e,t,n,r,i,a)=>{e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+i-a),e.quadraticCurveTo(t+r,n+i,t+r-a,n+i),e.lineTo(t+a,n+i),e.quadraticCurveTo(t,n+i,t,n+i-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()},W=e=>{if(!e)return;let t=document.createElement(`canvas`),n=t.getContext(`2d`),r=1080,i=Math.max(1080,320+e.exercises.length*130+160);t.width=r,t.height=i;let a=n.createLinearGradient(0,0,r,i);a.addColorStop(0,`#0f0f14`),a.addColorStop(1,`#1a1a24`),n.fillStyle=a,n.fillRect(0,0,r,i);let o=n.createRadialGradient(200,200,10,200,200,500);o.addColorStop(0,`rgba(204, 255, 0, 0.15)`),o.addColorStop(1,`transparent`),n.fillStyle=o,n.fillRect(0,0,r,i);let s=n.createRadialGradient(r-200,i-200,10,r-200,i-200,600);s.addColorStop(0,`rgba(0, 255, 136, 0.12)`),s.addColorStop(1,`transparent`),n.fillStyle=s,n.fillRect(0,0,r,i),U(n,40,40,r-80,i-80,36),n.fillStyle=`rgba(255, 255, 255, 0.03)`,n.fill(),n.lineWidth=2,n.strokeStyle=`rgba(255, 255, 255, 0.12)`,n.stroke(),n.font=`700 24px system-ui, -apple-system, sans-serif`,n.fillStyle=`#ccff00`,n.fillText(`IRONTRACK • WORKOUT PLAN`,80,110),n.font=`800 58px system-ui, -apple-system, sans-serif`,n.fillStyle=`#ffffff`,n.fillText(e.name,80,185),n.font=`500 32px system-ui, -apple-system, sans-serif`,n.fillStyle=`#a0a0b0`;let c=e.type===`circuit`?`🔄 Circuito AMRAP • ${e.duration||50} min`:`💪 Sessione Standard • ${e.exercises.length} esercizi`;n.fillText(c,80,240),n.beginPath(),n.moveTo(80,275),n.lineTo(r-80,275),n.strokeStyle=`rgba(255, 255, 255, 0.1)`,n.lineWidth=2,n.stroke();let l=320;e.exercises.forEach((e,t)=>{r-160,U(n,80,l,920,100,20),n.fillStyle=e.hadPositiveFeedback?`rgba(0, 255, 136, 0.08)`:`rgba(255, 255, 255, 0.05)`,n.fill(),n.lineWidth=1,n.strokeStyle=e.hadPositiveFeedback?`rgba(0, 255, 136, 0.4)`:`rgba(255, 255, 255, 0.08)`,n.stroke(),e.hadPositiveFeedback&&(U(n,82,l+2,8,96,6),n.fillStyle=`#00ff88`,n.fill()),n.beginPath(),n.arc(140,l+100/2,26,0,Math.PI*2),n.fillStyle=`rgba(204, 255, 0, 0.15)`,n.fill(),n.font=`800 24px system-ui, -apple-system, sans-serif`,n.fillStyle=`#ccff00`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(`${t+1}`,140,l+100/2),n.textAlign=`left`,n.textBaseline=`middle`,n.font=`700 36px system-ui, -apple-system, sans-serif`,n.fillStyle=e.hadPositiveFeedback?`#00ff88`:`#ffffff`;let i=e.name;e.hadPositiveFeedback&&(i+=` ⚡ (Aumentare)`),n.fillText(i,190,l+100/2),n.textAlign=`right`,n.font=`700 34px system-ui, -apple-system, sans-serif`,n.fillStyle=`#ccff00`;let a=`${e.sets||3}x${e.reps||10}`;if(e.weight&&(typeof e.weight==`number`&&e.weight>0||Array.isArray(e.weight))){let t=Array.isArray(e.weight)?e.weight[0]:e.weight;a+=` • ${t} kg`}n.fillText(a,r-110,l+100/2),l+=130}),n.textAlign=`center`,n.textBaseline=`middle`,n.font=`italic 500 26px system-ui, -apple-system, sans-serif`,n.fillStyle=`#666677`,n.fillText(`Generato con IronTrack — Allenati con Intelligenza 🚀`,r/2,i-80),t.toBlob(t=>{if(!t)return;let n=`irontrack_${e.name.toLowerCase().replace(/[^a-z0-9]/g,`_`)}.png`,r=new File([t],n,{type:`image/png`});if(navigator.canShare&&navigator.canShare({files:[r]}))navigator.share({files:[r],title:`IronTrack - ${e.name}`,text:`Ecco la mia scheda "${e.name}" creata con IronTrack! 💪`}).catch(()=>{let e=URL.createObjectURL(t),r=document.createElement(`a`);r.href=e,r.download=n,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(e),1e3)});else{let e=URL.createObjectURL(t),r=document.createElement(`a`);r.href=e,r.download=n,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(e),1e3)}},`image/png`,1)},ie=e=>{let t=u.find(t=>t.id==e);n.innerHTML=`
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
        ${t.exercises.map(e=>{let t=w(C(e.name));return`
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; align-items: center; ${e.hadPositiveFeedback?`background: rgba(0, 255, 136, 0.08); padding: 8px 12px; border-radius: 10px; border-left: 3px solid var(--success);`:``}">
              <span style="display: flex; align-items: center">
                <span class="ex-icon" style="font-size: 0.9rem; width: 24px; height: 24px; margin-right: 8px; background: rgba(255,255,255,0.03)">${t}</span>
                <span style="font-weight: ${e.hadPositiveFeedback?`700`:`400`}; color: ${e.hadPositiveFeedback?`#00ff88`:`white`}">${e.name}</span>
                ${e.hadPositiveFeedback?`<span class="easy-load-badge" style="margin-left: 8px; font-size: 0.6rem; padding: 1px 5px;">⚡ Carico Facile (Aumenta)</span>`:``}
              </span>
              <span style="color: var(--text-secondary)">${e.sets}x${e.reps}</span>
            </div>
          `}).join(``)}
      </div>

      <div style="padding: 30px 16px; display: flex; flex-direction: column; gap: 12px;">
        <button class="btn" id="start-session-now" style="font-size: 1.2rem; padding: 20px">
          AVVIA SESSIONE 🔥
        </button>
        <button class="btn" id="export-preview-btn" style="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2); font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>📸 Esporta Immagine Scheda (PNG)</span>
        </button>
      </div>
    </div>
  `,document.getElementById(`back-to-list`).addEventListener(`click`,()=>z());let r=document.getElementById(`export-preview-btn`);r&&r.addEventListener(`click`,()=>W(t)),document.getElementById(`start-session-now`).addEventListener(`click`,()=>{k(),t.type===`circuit`?K(e):q(e)})},G=e=>{let t=e.split(`
`),n=[];return t.forEach(e=>{let t=e.trim();if(t.length<3)return;let r=t.match(/^([a-zA-Z\s]+)\s+(\d+)\s*[xX*]\s*(\d+)(?:\s*(\d+))?/),i=t.match(/^(\d+)\s*[xX*]\s*(\d+)\s+([a-zA-Z\s]+)/);if(r)n.push({name:r[1].trim(),sets:parseInt(r[2]),reps:r[3],weight:parseInt(r[4]||0),rest:60});else if(i)n.push({name:i[3].trim(),sets:parseInt(i[1]),reps:i[2],weight:0,rest:60});else{let e=t.match(/\d+/g),r=``;for(let e in x){for(let n of x[e])if(t.toLowerCase().includes(n.toLowerCase())){r=n;break}if(r)break}if(r&&e&&e.length>=1)n.push({name:r,sets:parseInt(e[0]||3),reps:e[1]||`10`,weight:parseInt(e[2]||0),rest:60});else if(t.replace(/[^a-zA-Z]/g,``).length>4&&e&&e.length>=2){let r=t.replace(/\d+/g,``).replace(/[xX*]/g,``).trim();n.push({name:r,sets:parseInt(e[0]),reps:e[1],weight:parseInt(e[2]||0),rest:60})}}}),n},ae=()=>{n.innerHTML=`
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
      `).join(``),document.querySelectorAll(`.remove-parsed-ex`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.getAttribute(`data-index`));p.splice(t,1),m()})}))};s.addEventListener(`click`,()=>{s.style.background=`var(--accent-color)`,s.style.color=`#000`,c.style.background=`rgba(255,255,255,0.1)`,c.style.color=`#fff`,l.style.display=`block`,u.style.display=`none`}),c.addEventListener(`click`,()=>{c.style.background=`var(--accent-color)`,c.style.color=`#000`,s.style.background=`rgba(255,255,255,0.1)`,s.style.color=`#fff`,l.style.display=`none`,u.style.display=`block`}),f.addEventListener(`click`,()=>{let e=d.value;if(!e.trim())return alert(`Incolla del testo prima!`);p=G(e),m()}),document.getElementById(`cancel-scan`).addEventListener(`click`,()=>z()),t.addEventListener(`click`,()=>e.click()),e.addEventListener(`change`,async e=>{let n=e.target.files[0];if(!n)return;let o=new FileReader;o.onload=e=>{r.innerHTML=`<img src="${e.target.result}">`},o.readAsDataURL(n),t.style.display=`none`,i.style.display=`block`,a.style.display=`none`;try{let e=await Tesseract.createWorker(`ita`,1,{logger:e=>{if(e.status===`recognizing text`){let t=Math.round(e.progress*100);document.getElementById(`ocr-progress-bar`).style.width=t+`%`,document.getElementById(`ocr-label`).innerText=`Riconoscimento: ${t}%`}}}),{data:{text:r}}=await e.recognize(n);await e.terminate(),p=G(r),i.style.display=`none`,t.style.display=`flex`,m()}catch(e){console.error(e),alert(`Errore durante la scansione. Riprova.`),i.style.display=`none`,t.style.display=`flex`}}),document.getElementById(`confirm-scan`).addEventListener(`click`,()=>{p.length!==0&&oe(p)})},oe=e=>{H(e.map(e=>({...e,_muscle:C(e.name),_manual:C(e.name)===`Altro`})))},K=(e,r=!1)=>{let i=u.find(t=>t.id==e),a=i.duration||50,o,s=0,c=0,l=!1;r&&p&&p.type===`circuit`&&p.routineId==e?(o=Date.now()+p.curTimeLeft*1e3,s=p.rounds,c=p.activeExerciseIdx):o=Date.now()+a*60*1e3,n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="cancel-circuit" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">${i.name}</h2>
        <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
      </header>

      <div style="text-align: center; margin-bottom: 20px">
        <div class="card-subtitle">TEMPO RIMANENTE</div>
        <div id="circuit-timer" class="timer-large">--:--</div>
      </div>

      <div class="round-display">
        <div class="card-subtitle">GIRI COMPLETATI</div>
        <div id="round-count" class="round-number">${s}</div>
        <button class="btn pulse" id="round-completed" style="margin-top: 15px">GIRO COMPLETATO! 🔥</button>
      </div>

      <div style="padding: 0 16px 10px">
        <div class="card-subtitle">LISTA ESERCIZI</div>
      </div>
      
      <div class="circuit-list">
        ${i.exercises.map((e,t)=>{let n=w(C(e.name));return`
            <div class="circuit-item ${t===c?`active`:``}" data-idx="${t}">
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
  `;let f=document.getElementById(`round-count`),h=()=>{let e=document.getElementById(`circuit-timer`);if(!e){clearInterval(v),b=null;return}let t=Math.max(0,Math.ceil((o-Date.now())/1e3));e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`,t<=0&&(clearInterval(v),b=null,e.innerText=`TEMPO SCADUTO!`,e.style.color=`var(--danger)`,l||=(M(),!0))};b=h,v&&clearInterval(v),v=setInterval(h,1e3),h(),m={interrupt:()=>{clearInterval(v),b=null,p=null,t.savePausedWorkout(null)},pause:()=>{p={type:`circuit`,routineId:e,curTimeLeft:Math.max(0,Math.ceil((o-Date.now())/1e3)),rounds:s,activeExerciseIdx:c},t.savePausedWorkout(p),clearInterval(v),b=null}},document.getElementById(`cancel-circuit`).addEventListener(`click`,()=>{Q(()=>{m.interrupt(),m=null,z()},()=>{m.pause(),m=null,Z(`dashboard`)})}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{k(),P(30)}),document.getElementById(`round-completed`).addEventListener(`click`,()=>{s++,f.innerText=s,document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.circuit-item[data-idx="0"]`).classList.add(`active`),c=0,f.style.transform=`scale(1.2)`,setTimeout(()=>f.style.transform=`scale(1)`,200)}),document.querySelectorAll(`.circuit-item`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)})}),document.getElementById(`finish-circuit`).addEventListener(`click`,()=>{clearInterval(v),b=null;let e=Math.max(0,Math.ceil((o-Date.now())/1e3)),n=`${a-Math.floor(e/60)} min`;t.saveLog({routineName:i.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:n,type:`circuit`,rounds:s,exercises:i.exercises.map(e=>({name:e.name,sets:[{reps:e.reps,weight:e.weight}]}))}),d=t.getLogs(),alert(`Ottimo lavoro! 🔥 Hai completato ${s} giri in questo circuito!`),p=null,t.savePausedWorkout(null),m=null,Z(`dashboard`)})},se=e=>{let n=t.getLogs()||[],r=0;return n.forEach(t=>{t.exercises&&Array.isArray(t.exercises)&&t.exercises.forEach(t=>{t.name&&t.name.trim().toLowerCase()===e.trim().toLowerCase()&&t.sets&&t.sets.forEach(e=>{let t=parseFloat(e.weight)||0,n=parseInt(e.reps)||0;if(t>0&&n>0){let e=n===1?t:Math.round(t*(1+n/30)*10)/10;e>r&&(r=e)}})})}),r},ce=(e,t,n)=>{let r=Math.round((t-n)*10)/10,i=document.createElement(`div`);i.className=`pr-celebration-overlay`,i.innerHTML=`
    <div class="pr-celebration-box">
      <div class="pr-trophy-icon">🏆</div>
      <div class="pr-title">Nuovo Record (1RM)!</div>
      <div class="pr-exercise-name">${e}</div>
      <div class="pr-stats-box">
        <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Stima Massimale (Epley)</div>
        <div class="pr-value">${t} <span style="font-size: 1.2rem; color: #fff;">kg</span></div>
        <div class="pr-diff">+${r} kg dal precedente PR (${n} kg)!</div>
      </div>
      <button class="btn" id="close-pr-modal" style="background: linear-gradient(90deg, #ffd700, #ffaa00); color: #000; font-weight: 800; font-size: 1rem; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
        CONTINUA A SPINGERE 💪
      </button>
    </div>
  `,document.body.appendChild(i),i.querySelector(`#close-pr-modal`).addEventListener(`click`,()=>{i.style.animation=`slideDown 0.3s ease-in forwards`,setTimeout(()=>i.remove(),300)})},q=(e,r=!1)=>{let i=u.find(t=>t.id==e);if(!i)return;window.sessionPRs={},k(),ee();let a=JSON.parse(JSON.stringify(i.exercises));y=r&&p&&p.type===`standard`&&p.routineId==e?Date.now()-p.elapsedSeconds*1e3:Date.now();let o=()=>{n.innerHTML=`
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
          <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
          <div style="text-align: center">
            <h2 style="font-size: 1.1rem; margin: 0">${i.name}</h2>
            <div id="workout-timer-display" style="font-size: 0.8rem; color: var(--accent-color); font-weight: 700; margin-top: 2px">00:00</div>
          </div>
          <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
        </header>

        <div id="active-exercises-list">
          ${a.map((e,t)=>{let n=w(C(e.name)),i=e.hadPositiveFeedback===!0;return`
              <div class="card draggable-item ${i?`easy-load-card`:``}" data-idx="${t}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                  <div class="card-title" style="color: var(--accent-color); display: flex; align-items: center; gap: 10px; margin: 0; width: 100%">
                    <span class="ex-icon" style="background: var(--accent-glow); width: 32px; height: 32px; font-size: 1rem">${n}</span>
                    <span style="flex: 1">${e.name}</span>
                    ${i?`<span class="easy-load-badge">⚡ Carico Facile (Aumenta!)</span>`:``}
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
                  ${Array.from({length:e.sets}).map((n,a)=>{let o=r&&p&&p.savedExercises[t]&&p.savedExercises[t].sets[a]?p.savedExercises[t].sets[a]:null,s=o?o.completed:!1,c=o?o.weight:Array.isArray(e.weight)?e.weight[a]||e.weight[0]||0:e.weight,l=o?o.reps:Array.isArray(e.reps)?e.reps[a]||e.reps[0]||`10`:e.reps;return`
                    <div class="set-row" data-ex-idx="${t}" style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; margin-bottom: 8px; transition: opacity 0.3s; opacity: ${s?`0.5`:`1`}">
                      <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${a+1}</div>
                      <input type="number" value="${c}" style="margin: 0; text-align: center; transition: background 0.3s; ${i?`border-color: var(--success); background: rgba(0, 255, 136, 0.06); color: #fff; box-shadow: 0 0 6px rgba(0, 255, 136, 0.15);`:``}" class="log-weight">
                      <input type="text" value="${l}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
                      <button class="check-set-btn" style="background: ${s?`var(--accent-color)`:`transparent`}; border: 2px solid var(--accent-color); border-radius: 8px; color: ${s?`#000`:`var(--accent-color)`}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </button>
                    </div>
                  `}).join(``)}
                </div>

                <div class="exercise-feedback" style="display: block; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Valutazione & Smart Rest (+45s al 👎):</div>
                  <div style="display: flex; gap: 10px">
                    <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer">👍 Bene (Carico Facile)</button>
                    <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer">👎 Fatica (+45s Rest)</button>
                  </div>
                </div>
              </div>
            `}).join(``)}
        </div>

        <div style="padding: 16px">
          <button class="btn" id="finish-workout" style="background: var(--success)">
            Concludi Allenamento
          </button>
        </div>
      </div>
    `;let o=()=>{let e=document.getElementById(`workout-timer-display`);if(!e){clearInterval(v),b=null;return}let t=Math.floor((Date.now()-y)/1e3);e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`};b=o,v&&clearInterval(v),v=setInterval(o,1e3),m={interrupt:()=>{clearInterval(v),b=null,p=null,t.savePausedWorkout(null)},pause:()=>{let n=[];document.querySelectorAll(`#active-exercises-list .card`).forEach(e=>{let t=[];e.querySelectorAll(`.set-row`).forEach(e=>{t.push({weight:e.querySelector(`.log-weight`).value,reps:e.querySelector(`.log-reps`).value,completed:e.style.opacity===`0.5`})}),n.push({sets:t})}),p={type:`standard`,routineId:e,elapsedSeconds:Math.floor((Date.now()-y)/1e3),savedExercises:n},t.savePausedWorkout(p),clearInterval(v),b=null}},document.getElementById(`back-to-routines`).addEventListener(`click`,()=>{Q(()=>{m.interrupt(),m=null,z()},()=>{m.pause(),m=null,Z(`dashboard`)})}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{k(),P(60)}),O(document.getElementById(`active-exercises-list`),()=>{}),document.querySelectorAll(`.check-set-btn`).forEach(e=>{e.addEventListener(`click`,t=>{k();let n=t.target.closest(`.set-row`);if(n.style.opacity!==`0.5`){n.style.opacity=`0.5`,e.style.background=`var(--accent-color)`,e.style.color=`#000`;let t=n.getAttribute(`data-ex-idx`),r=n.closest(`.card`),i=r&&r.getAttribute(`data-feedback`)===`negative`,o=a[t].rest||60,s=a[t]?.name||``,c=parseFloat(n.querySelector(`.log-weight`).value)||0,l=parseInt(n.querySelector(`.log-reps`).value)||0;if(c>0&&l>0&&s){let e=l===1?c:Math.round(c*(1+l/30)*10)/10,t=se(s),r=window.sessionPRs?.[s]||0,i=Math.max(t,r);if(t>0&&e>i){window.sessionPRs||(window.sessionPRs={}),window.sessionPRs[s]=e,ce(s,e,t),re();let r=n.firstElementChild;r&&!r.querySelector(`.pr-badge-inline`)&&(r.style.width=`auto`,r.style.padding=`0 6px`,r.innerHTML+=`<span class="pr-badge-inline" style="margin-left:4px">🏆 PR</span>`)}else i===0&&e>0&&!window.sessionPRs?.[s]&&(window.sessionPRs||(window.sessionPRs={}),window.sessionPRs[s]=e)}P(i?o+45:o,i)}else n.style.opacity=`1`,e.style.background=`transparent`,e.style.color=`var(--accent-color)`})}),document.querySelectorAll(`.feedback-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.card`);n.querySelectorAll(`.feedback-btn`).forEach(e=>e.style.opacity=`0.4`),e.style.opacity=`1`;let r=e.classList.contains(`neg`);n.setAttribute(`data-feedback`,r?`negative`:`positive`),r&&N()})}),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{te();let n=[];if(document.querySelectorAll(`#active-exercises-list .card`).forEach(e=>{let t=e.querySelector(`.card-title`)?.innerText.replace(/[^\x00-\x7F]/g,``).trim();if(!t)return;let r=[];e.querySelectorAll(`.set-row`).forEach(e=>{e.style.opacity===`0.5`&&r.push({weight:parseFloat(e.querySelector(`.log-weight`).value)||0,reps:e.querySelector(`.log-reps`).value||`0`})}),r.length>0&&n.push({name:t,sets:r,feedback:e.getAttribute(`data-feedback`)||`neutral`})}),n.length===0)return alert(`Non hai completato alcun esercizio!`);clearInterval(v),b=null;let r=document.getElementById(`workout-timer-display`).innerText;t.saveLog({routineName:i.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:r,type:`standard`,exercises:n});let a=u.find(t=>t.id==e),o=[];a&&(a.exercises.forEach(e=>{e.hadPositiveFeedback=!1}),n.forEach(e=>{let t=a.exercises.find(t=>t.name===e.name);if(t){let n=e.feedback===`positive`,r=e.feedback===`negative`;t.hadPositiveFeedback=n;let i=e.sets.map(e=>parseFloat(e.weight)||0),a=e.sets.map(e=>e.reps);if(f.progressionEnabled!==!1&&r?(t.consecutiveNegatives=(t.consecutiveNegatives||0)+1,t.consecutiveNegatives>=3&&o.push(t)):t.consecutiveNegatives=0,f.progressionEnabled===!1){Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}let{type:s,step:c,repsThresh:l,mode:u}=fe(t,f);if(u===`reps-only`){if(Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),n)if(Array.isArray(t.reps))t.reps=a.map(e=>String(Math.min(15,(parseInt(e)||0)+1)));else{let e=parseInt(a[0])||0;t.reps=String(Math.min(15,e+1))}else Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}if(u===`weight-only`){n?Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c:Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}let d=de(t.repsRange);if(d){let e=!0;a.forEach(t=>{parseInt(t)<d.max&&(e=!1)}),n&&e?(Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c,Array.isArray(t.reps)?t.reps=Array(t.sets||a.length).fill(String(d.min)):t.reps=String(d.min)):(Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||String(d.min))}else{let e=!1;if(n&&a.forEach(t=>{parseInt(t)<l&&(e=!0)}),n&&!e?Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c:Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps))t.reps=a.map(t=>n&&e&&(parseInt(t)||0)<l?String(l):t);else{let r=parseInt(a[0])||0;n&&e&&r<l?t.reps=String(l):t.reps=a[0]||`10`}}}}),t.saveRoutines(u)),d=t.getLogs(),p=null,t.savePausedWorkout(null),m=null,o.length>0?$(`🧠 Scarico Consigliato`,`Abbiamo notato che hai accumulato molta fatica su: <strong>${o.map(e=>e.name).join(`, `)}</strong> negli ultimi 3 allenamenti.<br><br>Ti consigliamo una sessione di <strong>scarico attivo (-10% peso)</strong> per permettere il recupero e superare lo stallo. Vuoi applicarla?`,()=>{o.forEach(e=>{Array.isArray(e.weight)?e.weight=e.weight.map(e=>Math.round(e*.9*2)/2):e.weight=Math.round(e.weight*.9*2)/2,e.consecutiveNegatives=0}),t.saveRoutines(u),alert(`Scarico applicato con successo! La prossima sessione sarà più leggera per favorire il recupero. 🏋️‍♂️`),Z(`dashboard`)},()=>{Z(`dashboard`)}):(alert(`Allenamento salvato con successo! 🎉`),Z(`dashboard`))})},s=()=>{let e=document.getElementById(`workout-timer-display`);if(!e){clearInterval(v),b=null;return}let t=Math.floor((Date.now()-y)/1e3);e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`};b=s,v&&clearInterval(v),v=setInterval(s,1e3),o()},J=()=>{n.innerHTML=`
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${d.length===0?`
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      `:d.map((e,t)=>`
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
  `,document.querySelectorAll(`.log-card`).forEach(e=>{e.addEventListener(`click`,()=>{Y(e.getAttribute(`data-idx`))})})},Y=e=>{let r=d[e];if(!r)return J();let i=u.find(e=>e.name===r.routineName);if(n.innerHTML=`
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-history" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Indietro</button>
        <h2 style="font-size: 1.1rem; margin: 0">Dettaglio Sessione</h2>
        <div style="width: 40px"></div>
      </header>

      <div class="card" style="background: rgba(204, 255, 0, 0.05); border: 1px solid var(--accent-color)">
        <div class="card-title">${r.routineName}</div>
        <div class="card-subtitle">${r.date} ${r.duration?`• ⏱️ Durata: ${r.duration}`:``} ${r.type===`circuit`?`• 🔄 Giri: ${r.rounds}`:``}</div>
        ${i?`
          <button id="overload-weights-btn" class="btn" style="background: var(--accent-color); color: #000; margin-top: 15px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3L21 7L17 11M7 21L3 17L7 13M21 7H9M3 17H15"/></svg>
            Sovraccarica carichi su scheda
          </button>
        `:``}
      </div>

      ${r.exercises.map(e=>`
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
  `,document.getElementById(`back-to-history`).addEventListener(`click`,()=>J()),document.getElementById(`return-history`).addEventListener(`click`,()=>J()),i){let n=document.getElementById(`overload-weights-btn`);n&&n.addEventListener(`click`,()=>{$(`Sovraccarica Carichi`,`Sei sicuro di voler sovraccaricare i carichi di questo allenamento sulla tua scheda attiva "${r.routineName}"? Questa operazione sovrascriverà i carichi correnti.`,()=>{let n=0;r.exercises.forEach(e=>{let t=i.exercises.find(t=>t.name===e.name);if(t){let r=e.sets.map(e=>parseFloat(e.weight)||0);if(Array.isArray(t.weight)||r.length>1){let e=[];for(let n=0;n<t.sets;n++)e.push(r[n]===void 0?r[r.length-1]||0:r[n]);t.weight=e}else t.weight=r[0]||0;n++}}),t.saveRoutines(u),alert(`Carichi aggiornati con successo su "${r.routineName}" (${n} esercizi modificati)! 🎉`),Y(e)})})}},X=()=>{let e=()=>{n.innerHTML=`
      <div class="view">
        <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
          <h2 style="font-weight: 800; margin: 0">I tuoi progressi</h2>
          <div style="display: flex; gap: 10px">
            <button id="show-changelog" style="background: rgba(255,255,255,0.05); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
            <button id="open-settings" style="background: rgba(255,255,255,0.05); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
        
        <!-- Profilo Utente -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px">
            <div>
              <div class="card-title">${f.name} ${f.surname}</div>
              <div class="card-subtitle">"${f.nickname}" • ${f.gender===`male`?`Uomo`:`Donna`}</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center">
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Età</div>
              <div style="font-weight: 700">${f.age}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Peso</div>
              <div style="font-weight: 700; color: var(--accent-color)">${f.weight} kg</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Altezza</div>
              <div style="font-weight: 700">${f.height} cm</div>
            </div>
          </div>
        </div>

        <!-- Stato Recupero Muscoli -->
        <div class="card" id="muscle-recovery-card">
          <div class="card-title" style="margin-bottom: 5px">Stato Recupero Muscoli</div>
          <div class="card-subtitle">Tocca un muscolo per i dettagli del recupero.</div>
          
          <!-- Image + SVG overlay -->
          <div class="muscle-map-wrapper">
            <img class="muscle-base-img" src="/IronTrack/muscle-map.png" alt="Mappa muscolare" draggable="false" />
            <!-- 
              viewBox calibrata sull'immagine originale 625x510.
              FRONTE (lato sinistro dell'immagine): x ~15-300
              RETRO (lato destro dell'immagine): x ~330-620
            -->
            <svg class="muscle-overlay-svg" viewBox="0 0 624 554" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">

              <!-- ===== AUTOMATIC CONTOURS ===== -->
              <path class="muscle-hotspot" data-muscle="Polpacci" d="M530,416 L529,417 L528,420 L521,427 L520,427 L520,430 L521,431 L521,434 L522,435 L522,439 L523,440 L523,445 L524,446 L524,452 L525,453 L525,463 L526,464 L526,480 L528,480 L528,479 L529,478 L529,470 L530,469 L530,461 L531,460 L531,454 L532,453 L532,449 L533,448 L533,445 L534,444 L535,437 L536,436 L536,434 L537,433 L537,431 L538,430 L538,427 L539,426 L539,423 L536,422 L530,416 Z" />
              <path class="muscle-hotspot" data-muscle="Polpacci" d="M464,416 L458,422 L457,422 L456,423 L454,423 L455,424 L455,426 L456,427 L456,429 L457,430 L457,432 L458,433 L458,435 L459,436 L459,439 L460,440 L460,443 L461,444 L461,447 L462,448 L462,451 L463,452 L463,458 L464,459 L464,467 L465,468 L465,477 L466,478 L466,480 L468,480 L469,479 L469,475 L468,474 L468,466 L469,465 L469,454 L470,453 L470,447 L471,446 L471,441 L472,440 L472,435 L473,434 L473,430 L474,429 L474,427 L473,426 L472,426 L467,421 L466,418 L464,416 Z" />
              <path class="muscle-hotspot" data-muscle="Femorali" d="M523,364 L520,369 L520,371 L519,372 L519,374 L518,375 L518,378 L517,379 L517,382 L516,383 L516,386 L515,387 L515,392 L514,393 L514,412 L515,413 L515,417 L516,418 L517,421 L519,423 L521,423 L525,419 L525,418 L526,417 L526,415 L527,414 L527,410 L528,409 L528,399 L529,398 L529,382 L528,381 L528,373 L527,372 L527,369 L526,368 L526,367 L523,364 Z" />
              <path class="muscle-hotspot" data-muscle="Femorali" d="M471,364 L468,367 L468,368 L466,371 L466,378 L465,379 L465,401 L466,402 L466,411 L467,412 L467,415 L468,416 L469,419 L473,423 L475,423 L478,420 L478,418 L479,417 L479,414 L480,413 L480,407 L481,406 L481,401 L480,400 L480,392 L479,391 L479,386 L478,385 L478,381 L477,380 L477,377 L476,376 L475,371 L473,368 L473,366 L471,364 Z" />
              <path class="muscle-hotspot" data-muscle="Femorali" d="M459,362 L455,365 L453,369 L448,387 L446,388 L423,412 L421,413 L416,413 L422,413 L446,389 L448,390 L447,393 L447,406 L448,407 L448,410 L451,416 L454,419 L456,419 L460,416 L463,407 L463,374 L462,373 L462,368 L459,362 Z" />
              <path class="muscle-hotspot" data-muscle="Femorali" d="M536,361 L535,362 L535,363 L533,365 L533,367 L532,368 L532,373 L531,374 L531,407 L532,408 L532,411 L533,412 L533,414 L535,416 L535,417 L538,419 L540,419 L543,416 L543,415 L546,410 L546,408 L547,407 L547,393 L546,392 L546,387 L545,386 L545,382 L544,381 L544,378 L543,377 L543,374 L542,373 L542,372 L541,371 L541,370 L540,369 L538,364 L536,362 L536,361 Z" />
              <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M158,293 L158,295 L156,298 L156,301 L155,302 L155,304 L154,305 L154,308 L153,309 L153,313 L152,314 L152,319 L151,320 L151,336 L152,337 L152,341 L154,344 L154,346 L159,351 L161,351 L163,349 L163,348 L165,345 L165,341 L166,340 L166,333 L165,332 L165,327 L164,326 L164,323 L163,322 L163,318 L162,317 L162,313 L161,312 L161,307 L160,306 L160,300 L159,299 L159,293 L158,293 Z" />
              <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M116,293 L115,294 L115,300 L114,301 L114,307 L113,308 L113,312 L112,313 L112,318 L111,319 L111,322 L110,323 L110,328 L109,329 L109,343 L110,344 L110,346 L113,351 L115,351 L117,349 L118,349 L119,348 L119,347 L121,344 L121,342 L122,341 L122,338 L123,337 L123,320 L122,319 L122,312 L121,311 L121,308 L120,307 L120,304 L119,303 L119,300 L118,299 L118,297 L117,296 L117,294 L116,293 Z" />
              <path class="muscle-hotspot" data-muscle="Glutei" d="M517,283 L514,287 L513,295 L512,296 L512,311 L513,312 L514,323 L513,324 L512,323 L510,312 L509,312 L509,322 L510,323 L510,328 L511,329 L511,332 L512,333 L512,336 L514,341 L518,367 L521,361 L521,358 L524,351 L525,343 L526,342 L526,313 L525,312 L525,306 L524,305 L524,301 L523,300 L521,289 L519,284 L517,283 Z" />
              <path class="muscle-hotspot" data-muscle="Glutei" d="M521,282 L524,289 L524,292 L526,297 L526,302 L527,303 L528,317 L529,318 L529,331 L530,332 L530,340 L531,341 L531,344 L532,345 L533,350 L541,365 L542,365 L541,363 L541,327 L542,326 L542,317 L541,316 L541,308 L540,307 L539,299 L535,290 L530,284 L526,282 L521,282 Z" />
              <path class="muscle-hotspot" data-muscle="Glutei" d="M476,282 L473,289 L471,301 L470,302 L470,306 L469,307 L469,312 L468,313 L467,337 L468,338 L468,344 L471,352 L471,355 L476,367 L477,367 L477,359 L478,358 L480,341 L485,324 L485,312 L484,312 L483,315 L483,319 L482,320 L482,324 L480,330 L479,329 L479,324 L480,323 L480,319 L482,313 L483,301 L482,300 L482,295 L481,294 L480,288 L477,282 L476,282 Z" />
              <path class="muscle-hotspot" data-muscle="Glutei" d="M473,282 L466,283 L457,294 L453,309 L453,325 L421,357 L340,357 L422,357 L452,328 L453,365 L461,350 L464,339 L466,309 L473,282 Z" />
              <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M171,241 L162,282 L162,301 L168,331 L173,332 L177,327 L176,343 L178,347 L186,331 L210,355 L290,355 L211,355 L186,330 L190,310 L190,287 L184,271 L183,303 L180,319 L177,322 L182,276 L171,241 Z" />
              <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M103,240 L93,269 L92,281 L93,300 L92,301 L90,293 L90,271 L86,280 L84,291 L84,305 L86,320 L91,336 L97,347 L99,339 L98,330 L99,329 L102,332 L106,332 L113,295 L113,286 L106,261 L103,240 Z" />
              <path class="muscle-hotspot" data-muscle="Lombari" d="M514,222 L512,223 L504,232 L500,241 L500,245 L499,246 L499,257 L500,258 L500,262 L501,263 L501,265 L504,270 L509,274 L513,275 L514,276 L522,277 L523,278 L528,279 L530,281 L531,281 L536,286 L536,287 L537,287 L538,269 L539,268 L539,256 L538,255 L538,249 L537,248 L536,242 L532,235 L524,227 L514,222 Z" />
              <path class="muscle-hotspot" data-muscle="Lombari" d="M494,240 L488,229 L481,222 L469,228 L462,235 L457,245 L455,265 L451,266 L452,250 L450,259 L448,259 L449,267 L445,275 L417,303 L334,303 L418,303 L444,276 L446,277 L446,287 L446,276 L454,267 L458,287 L464,280 L488,272 L495,259 L494,240 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M155,202 L152,202 L151,203 L146,203 L145,204 L143,204 L142,205 L141,205 L141,206 L139,209 L139,250 L140,251 L142,251 L146,247 L146,245 L147,244 L147,242 L148,241 L148,239 L149,238 L149,236 L151,233 L151,230 L152,229 L152,227 L153,226 L153,224 L154,223 L154,220 L155,219 L155,216 L156,215 L156,212 L157,211 L157,204 L155,202 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M120,202 L117,205 L117,209 L118,210 L118,214 L119,215 L119,218 L120,219 L120,221 L121,222 L121,225 L122,226 L122,228 L123,229 L123,232 L124,233 L124,235 L125,236 L125,238 L127,241 L127,243 L128,244 L128,246 L129,247 L130,250 L131,250 L132,251 L135,251 L135,250 L136,249 L136,211 L135,210 L135,207 L132,204 L130,204 L129,203 L124,203 L123,202 L120,202 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M139,184 L139,196 L143,200 L162,195 L158,220 L162,227 L169,225 L177,217 L180,208 L211,238 L300,237 L210,237 L179,206 L177,195 L267,193 L178,193 L176,180 L160,193 L159,185 L154,181 L143,180 L139,184 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M118,182 L116,184 L116,186 L115,187 L115,191 L116,192 L116,194 L117,195 L117,196 L119,198 L121,198 L122,199 L127,199 L128,200 L132,200 L135,197 L135,182 L134,181 L133,181 L132,180 L128,180 L127,181 L121,181 L120,182 L118,182 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M98,180 L98,192 L97,193 L97,196 L96,197 L96,201 L95,202 L95,212 L96,213 L96,215 L98,217 L98,218 L103,223 L104,223 L109,227 L113,227 L115,225 L115,224 L116,223 L116,219 L115,218 L115,212 L114,211 L114,204 L113,203 L113,197 L112,196 L112,193 L110,191 L110,190 L107,187 L106,187 L102,183 L101,183 L99,181 L99,180 L98,180 Z" />
              <path class="muscle-hotspot" data-muscle="Dorsali" d="M501,173 L500,174 L500,176 L499,177 L499,210 L498,211 L498,223 L499,224 L499,228 L500,229 L500,230 L502,230 L503,229 L503,228 L508,223 L508,222 L512,218 L513,218 L517,214 L518,214 L519,213 L519,199 L518,198 L518,196 L517,195 L514,188 L512,186 L512,185 L509,182 L509,181 L506,178 L506,177 L501,173 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M140,160 L140,161 L139,162 L139,173 L140,174 L140,175 L141,176 L142,176 L143,177 L149,177 L150,178 L154,178 L155,179 L157,179 L159,177 L159,168 L157,166 L157,165 L156,165 L154,163 L153,163 L152,162 L151,162 L150,161 L149,161 L148,160 L146,160 L145,159 L142,159 L141,160 L140,160 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M133,159 L129,159 L128,160 L127,160 L126,161 L124,161 L122,163 L121,163 L120,164 L119,164 L116,167 L116,168 L115,169 L115,176 L116,177 L116,178 L117,179 L119,179 L120,178 L123,178 L124,177 L132,177 L133,176 L134,176 L134,175 L135,174 L135,161 L133,159 Z" />
              <path class="muscle-hotspot" data-muscle="Tricipiti" d="M432,152 L430,152 L428,154 L428,155 L427,156 L427,157 L426,158 L426,159 L425,160 L425,164 L424,165 L424,175 L425,176 L425,182 L426,183 L428,183 L429,184 L430,183 L430,181 L431,180 L431,176 L432,175 L432,172 L433,171 L433,169 L434,168 L434,163 L435,162 L435,160 L434,159 L434,155 L433,154 L433,153 L432,152 Z" />
              <path class="muscle-hotspot" data-muscle="Tricipiti" d="M563,151 L561,153 L561,154 L560,155 L560,167 L561,168 L561,171 L562,172 L562,174 L563,175 L563,178 L564,179 L564,183 L568,183 L569,182 L569,180 L570,179 L570,165 L569,164 L569,160 L568,159 L568,157 L567,156 L567,155 L563,151 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M140,144 L140,145 L139,146 L139,151 L140,152 L140,153 L141,154 L143,154 L144,155 L145,155 L146,156 L148,156 L149,157 L150,157 L152,159 L153,159 L154,160 L155,160 L156,161 L159,161 L159,160 L160,159 L160,153 L159,152 L159,150 L156,147 L155,147 L153,145 L151,145 L150,144 L148,144 L147,143 L141,143 L140,144 Z" />
              <path class="muscle-hotspot" data-muscle="Addome" d="M135,145 L132,142 L131,142 L130,143 L128,143 L127,144 L125,144 L124,145 L122,145 L121,146 L120,146 L119,147 L118,147 L116,149 L116,150 L115,151 L115,153 L114,154 L114,157 L115,158 L115,160 L116,161 L118,161 L119,160 L120,160 L121,159 L122,159 L123,158 L124,158 L125,157 L126,157 L127,156 L128,156 L129,155 L131,155 L132,154 L133,154 L135,152 L135,145 Z" />
              <path class="muscle-hotspot" data-muscle="Dorsali" d="M545,137 L543,137 L541,139 L539,139 L535,141 L526,141 L525,140 L520,140 L518,139 L514,143 L512,148 L510,150 L508,155 L506,157 L503,163 L503,169 L504,171 L509,176 L519,191 L519,193 L522,200 L522,206 L523,207 L523,209 L525,205 L526,200 L536,180 L537,173 L538,172 L538,170 L540,166 L540,163 L541,162 L541,160 L543,156 L543,153 L544,152 L545,137 Z" />
              <path class="muscle-hotspot" data-muscle="Dorsali" d="M477,139 L459,141 L449,138 L450,151 L458,179 L467,199 L431,235 L422,236 L430,236 L467,200 L471,208 L474,194 L477,195 L475,199 L475,212 L493,230 L495,229 L494,173 L491,174 L476,193 L475,192 L491,169 L491,163 L477,139 Z" />
              <path class="muscle-hotspot" data-muscle="Bicipiti" d="M188,130 L187,146 L191,162 L195,170 L206,180 L208,178 L210,167 L210,159 L208,151 L209,150 L211,150 L212,153 L212,151 L214,149 L217,150 L218,149 L281,149 L213,149 L211,146 L211,148 L209,149 L207,147 L206,141 L197,129 L193,127 L189,127 L188,130 Z" />
              <path class="muscle-hotspot" data-muscle="Bicipiti" d="M85,127 L81,127 L80,128 L79,128 L72,135 L72,136 L68,143 L68,145 L67,146 L67,149 L66,150 L66,153 L65,154 L65,171 L66,172 L66,177 L68,180 L69,179 L70,179 L80,169 L80,168 L83,163 L83,161 L84,160 L84,158 L85,157 L85,155 L86,154 L86,149 L87,148 L87,134 L86,133 L86,129 L85,128 L85,127 Z" />
              <path class="muscle-hotspot" data-muscle="Tricipiti" d="M557,125 L558,126 L558,128 L560,131 L560,134 L561,135 L561,138 L562,139 L562,142 L563,143 L563,144 L564,145 L565,148 L567,150 L567,151 L569,153 L569,154 L571,157 L571,160 L572,161 L572,173 L573,172 L573,170 L574,169 L574,161 L575,160 L575,158 L574,157 L574,148 L573,147 L573,144 L572,143 L572,141 L571,140 L571,139 L570,138 L569,135 L567,133 L567,132 L560,126 L557,125 Z" />
              <path class="muscle-hotspot" data-muscle="Tricipiti" d="M550,121 L549,122 L549,129 L548,130 L548,140 L547,141 L547,153 L548,154 L548,156 L549,157 L549,159 L550,160 L550,161 L552,163 L552,164 L555,167 L555,168 L557,170 L558,170 L558,169 L557,168 L557,164 L556,163 L556,158 L557,157 L557,153 L558,152 L558,151 L559,150 L559,148 L560,147 L560,141 L559,140 L559,136 L558,135 L558,133 L557,132 L557,130 L556,129 L556,127 L555,126 L555,125 L551,121 L550,121 Z" />
              <path class="muscle-hotspot" data-muscle="Tricipiti" d="M344,163 L403,163 L419,151 L422,173 L424,155 L433,142 L438,158 L437,170 L447,155 L446,130 L462,133 L447,128 L444,121 L426,133 L413,121 L344,121 L412,121 L425,134 L421,148 L402,163 L344,163 Z" />
              <path class="muscle-hotspot" data-muscle="Petto" d="M147,98 L142,103 L141,105 L141,107 L140,108 L140,114 L139,115 L139,126 L140,127 L140,132 L141,134 L145,138 L149,140 L151,140 L152,141 L155,141 L156,142 L167,143 L168,142 L171,142 L175,140 L182,133 L182,132 L184,130 L184,128 L186,124 L186,117 L182,109 L173,100 L165,96 L155,96 L154,97 L147,98 Z" />
              <path class="muscle-hotspot" data-muscle="Petto" d="M119,96 L109,96 L106,98 L104,98 L102,100 L101,100 L93,108 L93,109 L91,111 L89,115 L89,117 L88,118 L88,124 L89,125 L89,127 L92,133 L99,140 L103,142 L106,142 L107,143 L114,143 L115,142 L119,142 L120,141 L123,141 L131,137 L134,133 L134,131 L135,130 L135,110 L134,109 L134,106 L130,100 L129,100 L127,98 L125,98 L124,97 L120,97 L119,96 Z" />
              <path class="muscle-hotspot" data-muscle="Dorsali" d="M533,95 L517,95 L516,96 L513,96 L507,99 L503,103 L501,107 L501,109 L500,110 L500,114 L499,115 L499,158 L500,160 L502,159 L503,156 L507,151 L509,146 L514,139 L514,137 L517,132 L517,130 L519,126 L519,123 L520,122 L520,119 L521,118 L521,114 L522,113 L522,110 L523,109 L524,105 L527,102 L527,101 L533,96 L533,95 Z" />
              <path class="muscle-hotspot" data-muscle="Dorsali" d="M461,95 L461,96 L469,103 L471,107 L471,109 L472,110 L472,113 L473,114 L473,117 L474,118 L474,122 L475,123 L475,125 L476,126 L478,134 L484,146 L486,148 L490,156 L494,161 L495,159 L495,113 L494,112 L494,109 L491,103 L486,98 L484,97 L478,96 L477,95 L461,95 Z" />
              <path class="muscle-hotspot" data-muscle="Spalle" d="M99,90 L97,90 L96,89 L86,89 L85,90 L83,90 L82,91 L77,93 L71,99 L71,100 L69,102 L69,104 L66,109 L66,112 L65,113 L65,128 L66,129 L66,132 L67,133 L67,134 L68,134 L83,119 L83,118 L85,116 L86,113 L88,111 L88,110 L90,108 L90,107 L95,102 L95,101 L96,100 L97,100 L97,99 L101,95 L101,92 L99,90 Z" />
              <path class="muscle-hotspot" data-muscle="Spalle" d="M173,92 L173,95 L192,120 L206,134 L210,125 L208,110 L213,105 L289,105 L213,104 L208,108 L203,98 L193,90 L215,62 L275,62 L214,62 L192,90 L178,89 L173,92 Z" />
              <path class="muscle-hotspot" data-muscle="Trapezi" d="M541,89 L518,76 L510,68 L503,51 L499,55 L497,73 L495,70 L495,54 L491,51 L482,71 L472,78 L454,62 L381,62 L453,62 L470,78 L454,87 L455,90 L480,93 L493,100 L495,99 L495,78 L497,73 L500,100 L512,93 L531,92 L541,89 Z" />
            </svg>
          </div>

          <!-- Legend -->
          <div class="muscle-map-legend">
            <span><span class="dot" style="background:#00ff88"></span>Fresco</span>
            <span><span class="dot" style="background:#ffb300"></span>In recupero</span>
            <span><span class="dot" style="background:#ff4d4d"></span>Affaticato</span>
          </div>

          <!-- Pannello Dettagli Muscolo -->
          <div id="muscle-detail-panel" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-top: 10px; min-height: 80px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span style="font-size: 1.5rem; margin-bottom: 5px">🔬</span>
            <div class="card-subtitle">Tocca un muscolo per analizzarne lo stato di recupero.</div>
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
              ${c().map(e=>`<option value="${e}">${e}</option>`).join(``)}
            </select>
          </div>
          <canvas id="progressChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${c().length>0?`display:none`:``}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <!-- Volume Chart -->
        <div class="card">
          <div class="card-title" style="margin-bottom: 15px">Volume Totale Sollevato (kg)</div>
          <canvas id="volumeChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-volume-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${d.length>0?`display:none`:``}">
            Nessun volume registrato.
          </div>
        </div>

      </div>
    `,r();let e=pe();document.querySelectorAll(`.muscle-hotspot`).forEach(t=>{let n=e[t.getAttribute(`data-muscle`)];n&&t.classList.add(`state-${n.status}`)}),document.querySelectorAll(`.muscle-hotspot`).forEach(t=>{t.addEventListener(`click`,t=>{let n=t.currentTarget.getAttribute(`data-muscle`),r=e[n];if(!r)return;document.querySelectorAll(`.muscle-hotspot`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-muscle`)===n)});let i=document.getElementById(`muscle-detail-panel`);if(i){let e={Petto:48,Dorsali:48,Trapezi:36,Lombari:48,Quadricipiti:72,Femorali:72,Glutei:72,Polpacci:48,Spalle:48,Bicipiti:36,Tricipiti:36,Addome:24,Altro:24},t=``;t=r.percent>=86?`Il muscolo è fresco e pronto per essere allenato ad alta intensità! 🦾`:r.percent>=50?`Il muscolo è in fase di recupero. Mancano circa <strong>${r.hoursLeft} ore</strong> al recupero totale. Puoi allenarlo con carichi moderati o focalizzarti su altri distretti.`:`<strong>Riposo consigliato!</strong> Il muscolo è congestionato. Mancano circa <strong>${r.hoursLeft} ore</strong> per ripristinare le fibre muscolari.`;let a=w(n);i.style.textAlign=`left`,i.style.alignItems=`flex-start`,i.innerHTML=`
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px">
              <span style="font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; gap: 6px">
                <span style="font-size: 1.3rem">${a}</span> ${n.toUpperCase()}
              </span>
              <span class="badge" style="background: rgba(${r.status===`fresh`?`0,255,136`:r.status===`recovering`?`255,179,0`:`255,77,77`}, 0.12); color: ${r.color}; border: 1px solid ${r.color}55">
                ${r.status===`fresh`?`Fresco`:r.status===`recovering`?`Recupero`:`Affaticato`}
              </span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); width: 100%">
              Stato di recupero: <strong>${r.percent}%</strong>
            </div>
            <div class="recovery-progress-bar">
              <div class="recovery-progress-fill" style="width: ${r.percent}%; background-color: ${r.color}"></div>
            </div>
            <div class="card-subtitle" style="margin-top: 10px; font-size: 0.8rem; line-height: 1.4; color: var(--text-primary)">
              ${t}
            </div>
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.06); width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.72rem; color: var(--text-secondary)">
              <div>Ultimo allenamento:<br><strong style="color: var(--text-primary)">${r.lastTrainedStr}</strong></div>
              <div>Recupero standard:<br><strong style="color: var(--text-primary)">${e[n]} ore</strong></div>
            </div>
          `}})}),document.getElementById(`show-changelog`).addEventListener(`click`,()=>le()),document.getElementById(`open-settings`).addEventListener(`click`,()=>m());let t=document.getElementById(`exercise-select`);if(t){let e=c();if(e.length>0){let n=e[Math.floor(Math.random()*e.length)];t.value=n,l(n)}t.addEventListener(`change`,e=>{l(e.target.value)})}u()},r=()=>{let e=document.getElementById(`calendar-mount`);if(!e)return;let t=new Date,n=t.getFullYear(),r=t.getMonth(),i=new Date(n,r,1).getDay(),a=new Date(n,r+1,0).getDate(),o=new Set(d.map(e=>{if(!e.timestamp)return null;let t=new Date(e.timestamp);return`${t.getFullYear()}-${(t.getMonth()+1).toString().padStart(2,`0`)}-${t.getDate().toString().padStart(2,`0`)}`}).filter(e=>e)),s=`
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
      `}s+=`</div></div>`,e.innerHTML=s},c=()=>{let e=new Set;return d.forEach(t=>{t.exercises&&t.exercises.forEach(t=>e.add(t.name))}),Array.from(e)},l=e=>{if(!e)return;let t=d.filter(t=>t.exercises&&t.exercises.find(t=>t.name===e)).map(t=>{let n=t.exercises.find(t=>t.name===e),r=Array.isArray(n.sets)?Math.max(...n.sets.map(e=>e.weight)):typeof n.weight==`number`?n.weight:0;return{date:t.date,weight:r}}).reverse(),n=document.getElementById(`progressChart`).getContext(`2d`);window.currentChart&&window.currentChart.destroy();let r=getComputedStyle(document.body).getPropertyValue(`--accent-color`).trim()||`#ccff00`;window.currentChart=new Chart(n,{type:`line`,data:{labels:t.map(e=>e.date),datasets:[{label:`Peso Massimo (kg)`,data:t.map(e=>e.weight),borderColor:r,backgroundColor:r+`1a`,borderWidth:3,tension:.4,fill:!0,pointBackgroundColor:r,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},u=()=>{let e=document.getElementById(`volumeChart`)?.getContext(`2d`);if(!e)return;let t=d.map(e=>{let t=0;return e.exercises&&e.exercises.forEach(e=>{e.sets&&e.sets.forEach(e=>{let n=parseFloat(e.weight)||0,r=parseInt(e.reps)||0;t+=n*r})}),{date:e.date,volume:t}}).reverse().slice(-10);window.volumeChartInstance&&window.volumeChartInstance.destroy();let n=getComputedStyle(document.body).getPropertyValue(`--accent-color`).trim()||`#ccff00`;window.volumeChartInstance=new Chart(e,{type:`bar`,data:{labels:t.map(e=>e.date),datasets:[{label:`Volume (kg x reps)`,data:t.map(e=>e.volume),backgroundColor:n+`80`,borderColor:n,borderWidth:1,borderRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{grid:{color:`rgba(255,255,255,0.05)`},ticks:{color:`#a0a0a0`}},x:{grid:{display:!1},ticks:{color:`#a0a0a0`}}}}})},p=()=>{n.innerHTML=`
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="cancel-edit" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Profilo</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Soprannome</div>
          <input type="text" id="edit-nickname" value="${f.nickname}">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="edit-age" value="${f.age}">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="edit-weight" value="${f.weight}">
            </div>
            <div style="grid-column: span 2">
              <div class="card-subtitle">Altezza (cm)</div>
              <input type="number" id="edit-height" value="${f.height||``}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `,document.getElementById(`cancel-edit`).addEventListener(`click`,()=>m()),document.getElementById(`save-profile`).addEventListener(`click`,()=>{f.nickname=document.getElementById(`edit-nickname`).value,f.age=document.getElementById(`edit-age`).value,f.weight=document.getElementById(`edit-weight`).value,f.height=document.getElementById(`edit-height`).value,t.saveUser(f),m(),alert(`Profilo aggiornato! 🦾`)})},m=()=>{n.innerHTML=`
      <div class="view">
        <div style="padding: 0 16px 16px; display: flex; align-items: center; gap: 15px">
          <button id="close-settings" style="background: rgba(255,255,255,0.05); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h2 style="font-weight: 800; margin: 0">Impostazioni</h2>
        </div>

        <!-- Modifica Profilo -->
        <div class="card" id="settings-profile">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
            <div class="card-title" style="margin: 0">Profilo Utente</div>
            <button id="edit-profile-btn" class="badge" style="border: none; cursor: pointer">Modifica</button>
          </div>
          <div class="card-subtitle">${f.name} ${f.surname} • ${f.age} anni</div>
        </div>

        <!-- Unità di Misura -->
        <div class="card">
          <div class="card-title">Unità di Misura</div>
          <div style="display: flex; gap: 10px; margin-top: 10px">
            <button class="btn ${f.unit===`lbs`?`btn-secondary`:``}" id="unit-kg" style="flex: 1; height: 40px">Kg</button>
            <button class="btn ${f.unit===`lbs`?``:`btn-secondary`}" id="unit-lbs" style="flex: 1; height: 40px">Libbre (lbs)</button>
          </div>
        </div>

        <!-- Suono Allarme -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div class="card-title" style="margin: 0">Suono Allarme</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="alarm-toggle" ${t.getAlarmEnabled()?`checked`:``} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${t.getAlarmEnabled()?`var(--accent-color)`:`rgba(255,255,255,0.15)`};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${t.getAlarmEnabled()?`25px`:`3px`};
                width: 22px; height: 22px; background: ${t.getAlarmEnabled()?`#000`:`#888`};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 12px">Scegli il suono che sentirai al termine del recupero.</div>
          <div style="display: flex; flex-direction: column; gap: 8px; opacity: ${t.getAlarmEnabled()?`1`:`0.4`}; pointer-events: ${t.getAlarmEnabled()?`auto`:`none`};" id="alarm-sounds-container">
            ${[{id:`classic`,name:`Classico`,desc:`Beep singolo`,icon:`🔔`},{id:`digital`,name:`Digitale`,desc:`Triplo beep rapido`,icon:`⏱️`},{id:`gong`,name:`Campana`,desc:`Gong profondo`,icon:`🔕`}].map(e=>`
              <div class="alarm-sound-option" data-sound="${e.id}" style="
                display: flex; align-items: center; gap: 12px;
                padding: 12px; border-radius: 12px; cursor: pointer;
                background: ${t.getAlarmSound()===e.id?`rgba(var(--accent-rgb, 204,255,0), 0.12)`:`rgba(255,255,255,0.03)`};
                border: 2px solid ${t.getAlarmSound()===e.id?`var(--accent-color)`:`rgba(255,255,255,0.06)`};
                transition: all 0.2s ease;
              ">
                <div style="font-size: 1.4rem; width: 38px; text-align: center">${e.icon}</div>
                <div style="flex: 1">
                  <div style="font-weight: 700; font-size: 0.9rem">${e.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary)">${e.desc}</div>
                </div>
                <button class="preview-sound-btn" data-sound="${e.id}" style="
                  background: none; border: 1px solid rgba(255,255,255,0.15);
                  color: var(--text-secondary); border-radius: 50%; width: 34px; height: 34px;
                  display: flex; align-items: center; justify-content: center; cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
                ${t.getAlarmSound()===e.id?`<div style="color: var(--accent-color); font-size: 1.1rem">✓</div>`:``}
              </div>
            `).join(``)}
          </div>
          <div style="margin-top: 14px; opacity: ${t.getAlarmEnabled()?`1`:`0.4`}; pointer-events: ${t.getAlarmEnabled()?`auto`:`none`};">
            <div class="card-subtitle" style="margin-bottom: 8px">Durata allarme</div>
            <div style="display: flex; gap: 8px">
              ${[3,5,10,15].map(e=>`
                <button class="btn alarm-duration-btn ${t.getAlarmDuration()===e?``:`btn-secondary`}" data-duration="${e}" style="flex: 1; height: 38px; font-size: 0.85rem; font-weight: 700">${e}s</button>
              `).join(``)}
            </div>
          </div>
        </div>

        <!-- Feedback & Progressione -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div class="card-title" style="margin: 0">Feedback & Progressione</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="progression-toggle" ${f.progressionEnabled===!1?``:`checked`} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${f.progressionEnabled===!1?`rgba(255,255,255,0.15)`:`var(--accent-color)`};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${f.progressionEnabled===!1?`3px`:`25px`};
                width: 22px; height: 22px; background: ${f.progressionEnabled===!1?`#888`:`#000`};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 15px">Personalizza il comportamento di incremento automatico dei carichi e delle ripetizioni. Se disattivato, i pesi delle schede non verranno modificati a fine allenamento.</div>
          
          <div id="progression-settings-panel" style="opacity: ${f.progressionEnabled===!1?`0.4`:`1`}; pointer-events: ${f.progressionEnabled===!1?`none`:`auto`}; transition: all 0.3s ease">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  LOGICA DI PROG.
                  <span class="info-help-btn" data-type="mode" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-progression-mode" style="margin-bottom: 0">
                  <option value="mixed" ${f.progressionMode===`mixed`?`selected`:``}>Mista (Reps → Peso)</option>
                  <option value="weight-only" ${f.progressionMode===`weight-only`?`selected`:``}>Solo Peso</option>
                  <option value="reps-only" ${f.progressionMode===`reps-only`?`selected`:``}>Solo Reps</option>
                </select>
              </div>
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  APPLICAZIONE PESO
                  <span class="info-help-btn" data-type="strategy" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-progression-type" style="margin-bottom: 0">
                  <option value="all" ${f.progressionType===`all`?`selected`:``}>Tutte le serie</option>
                  <option value="last" ${f.progressionType===`last`?`selected`:``}>Solo l'ultima serie</option>
                  <option value="first" ${f.progressionType===`first`?`selected`:``}>Solo la prima serie</option>
                  <option value="alternate" ${f.progressionType===`alternate`?`selected`:``}>Serie alternate</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px">
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  INCREMENTO PESO
                  <span class="info-help-btn" data-type="step" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-progression-step" style="margin-bottom: 0">
                  <option value="auto" ${f.progressionStep===`auto`?`selected`:``}>🤖 Auto (Muscolo)</option>
                  <option value="0.5" ${f.progressionStep===.5?`selected`:``}>+0.5 kg (Micro-carico)</option>
                  <option value="1" ${f.progressionStep===1?`selected`:``}>+1 kg</option>
                  <option value="1.25" ${f.progressionStep===1.25?`selected`:``}>+1.25 kg (Micro-carico)</option>
                  <option value="2" ${f.progressionStep===2?`selected`:``}>+2 kg</option>
                  <option value="2.5" ${f.progressionStep===2.5?`selected`:``}>+2.5 kg</option>
                  <option value="5" ${f.progressionStep===5?`selected`:``}>+5 kg</option>
                </select>
              </div>
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  SOGLIA REPS
                  <span class="info-help-btn" data-type="thresh" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-reps-threshold" style="margin-bottom: 0" ${f.progressionMode===`reps-only`?`disabled`:``}>
                  ${[5,6,7,8,9,10,11,12,13,14,15].map(e=>`
                    <option value="${e}" ${f.repsThreshold===e?`selected`:``}>${e} reps</option>
                  `).join(``)}
                </select>
              </div>
            </div>
          </div>
          
          <div class="card-subtitle" style="font-size: 0.75rem; font-weight: 700; margin-bottom: 5px">SIMULATORE DI PROGRESSIONE</div>
          <div id="settings-progression-visual-preview"></div>
        </div>

        <!-- Tema -->
        <div class="card">
          <div class="card-title">Personalizzazione Tema</div>
          <div class="theme-picker" style="margin-top: 15px">
            <div class="theme-circle ${t.getTheme()===`default`?`active`:``}" data-theme="default" style="background: #ccff00"></div>
            <div class="theme-circle ${t.getTheme()===`red`?`active`:``}" data-theme="red" style="background: #ff003c"></div>
            <div class="theme-circle ${t.getTheme()===`blue`?`active`:``}" data-theme="blue" style="background: #00d4ff"></div>
            <div class="theme-circle ${t.getTheme()===`purple`?`active`:``}" data-theme="purple" style="background: #9d00ff"></div>
            <div class="theme-circle ${t.getTheme()===`white`?`active`:``}" data-theme="white" style="background: #f0f0f0"></div>
          </div>
        </div>

        <!-- Backup -->
        <div class="card">
          <div class="card-title">Sicurezza Dati</div>
          <div class="card-subtitle" style="margin-bottom: 12px">Esporta o importa i tuoi allenamenti e configurazioni.</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <button class="btn btn-secondary" id="export-btn-settings" style="height: 40px; font-size: 0.8rem">Esporta Backup</button>
            <label class="btn btn-secondary" style="height: 40px; font-size: 0.8rem; margin: 0">
              Importa
              <input type="file" id="import-input-settings" style="display: none" accept=".json">
            </label>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.7rem; padding-bottom: 20px">
          IronTrack ${s} • Premium Workout Tracking
        </div>
      </div>
    `,document.getElementById(`close-settings`).addEventListener(`click`,()=>e()),document.getElementById(`edit-profile-btn`).addEventListener(`click`,()=>p()),document.getElementById(`unit-kg`).addEventListener(`click`,()=>{f.unit=`kg`,t.saveUser(f),m()}),document.getElementById(`unit-lbs`).addEventListener(`click`,()=>{f.unit=`lbs`,t.saveUser(f),m()}),document.getElementById(`alarm-toggle`).addEventListener(`change`,e=>{t.saveAlarmEnabled(e.target.checked),m()}),document.querySelectorAll(`.alarm-sound-option`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.target.closest(`.preview-sound-btn`))return;let r=e.getAttribute(`data-sound`);t.saveAlarmSound(r),rebuildAudioPool(),m()})}),document.querySelectorAll(`.preview-sound-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),ne(e.getAttribute(`data-sound`))})}),document.querySelectorAll(`.alarm-duration-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=parseInt(e.getAttribute(`data-duration`));t.saveAlarmDuration(n),m()})}),document.querySelectorAll(`.theme-circle`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.target.getAttribute(`data-theme`);t.saveTheme(n),i(n),m()})});let r=()=>{let e=document.getElementById(`settings-progression-visual-preview`);if(!e)return;if(f.progressionEnabled===!1){e.innerHTML=`
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; color: var(--text-secondary); font-size: 0.8rem; font-weight: 700; text-align: center; padding: 12px">
            <span style="font-size: 1.2rem; margin-bottom: 4px">⏸️</span>
            Progressione Automatica Disattivata
          </div>
        `;return}let t=document.getElementById(`setting-progression-type`).value,n=document.getElementById(`setting-progression-step`).value,r=document.getElementById(`setting-progression-mode`).value,i=``;if(r===`reps-only`){i=`
          <div style="display: flex; gap: 8px; justify-content: center; align-items: flex-end; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
        `;for(let e=0;e<4;e++){let t=45+e*5;i+=`
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
              <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.05)">
                <div class="pulse" style="height: 18px; background: #00d4ff; display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.55rem; font-weight: 800">
                  +1 R
                </div>
                <div style="height: ${t}px; background: var(--accent-glow); border-top: 2px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #a0a0a0; font-weight: 700">
                  S${e+1}
                </div>
              </div>
            </div>
          `}i+=`</div>`}else if(n===`auto`)i=`
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px">
            <!-- Grandi Muscoli (+2.5 kg) -->
            <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
              <div style="font-size: 0.62rem; color: var(--accent-color); font-weight: 800; text-align: center; margin-bottom: 8px">💪 GRANDI (Petto, Quadricipiti)</div>
              <div style="display: flex; gap: 4px; justify-content: center; align-items: flex-end; height: 80px">
                ${[0,1,2,3].map(e=>{let n=!1;(t===`all`||t===`last`&&e===3||t===`first`&&e===0||t===`alternate`&&e%2==0)&&(n=!0);let r=35+e*4;return`
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                      <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                        ${n?`<div class="pulse" style="height: 15px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+2.5</div>`:``}
                        <div style="height: ${r}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${e+1}</div>
                      </div>
                    </div>
                  `}).join(``)}
              </div>
            </div>
            
            <!-- Piccoli Muscoli (+1 kg) -->
            <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
              <div style="font-size: 0.62rem; color: var(--accent-color); font-weight: 800; text-align: center; margin-bottom: 8px">⚡ PICCOLI (Braccia, Spalle)</div>
              <div style="display: flex; gap: 4px; justify-content: center; align-items: flex-end; height: 80px">
                ${[0,1,2,3].map(e=>{let n=!1;(t===`all`||t===`last`&&e===3||t===`first`&&e===0||t===`alternate`&&e%2==0)&&(n=!0);let r=35+e*4;return`
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                      <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                        ${n?`<div class="pulse" style="height: 15px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+1</div>`:``}
                        <div style="height: ${r}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${e+1}</div>
                      </div>
                    </div>
                  `}).join(``)}
              </div>
            </div>
          </div>
        `;else{let e=parseFloat(n)||1;i=`
          <div style="display: flex; gap: 8px; justify-content: center; align-items: flex-end; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
        `;for(let n=0;n<4;n++){let r=!1;(t===`all`||t===`last`&&n===3||t===`first`&&n===0||t===`alternate`&&n%2==0)&&(r=!0);let a=45+n*5;i+=`
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
              <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.05)">
                ${r?`
                  <div class="pulse" style="height: ${r?18:0}px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.55rem; font-weight: 800">
                    +${e}
                  </div>
                `:``}
                <div style="height: ${a}px; background: var(--accent-glow); border-top: 2px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #a0a0a0; font-weight: 700">
                  S${n+1}
                </div>
              </div>
            </div>
          `}i+=`</div>`}e.innerHTML=i};r(),document.getElementById(`progression-toggle`).addEventListener(`change`,e=>{f.progressionEnabled=e.target.checked,t.saveUser(f);let n=document.getElementById(`progression-settings-panel`);n&&(n.style.opacity=e.target.checked?`1`:`0.4`,n.style.pointerEvents=e.target.checked?`auto`:`none`),r();let i=e.target.nextElementSibling,a=i?i.nextElementSibling:null;i&&a&&(i.style.background=e.target.checked?`var(--accent-color)`:`rgba(255,255,255,0.15)`,a.style.left=e.target.checked?`25px`:`3px`,a.style.background=e.target.checked?`#000`:`#888`)}),document.getElementById(`setting-progression-mode`).addEventListener(`change`,e=>{f.progressionMode=e.target.value,t.saveUser(f);let n=document.getElementById(`setting-reps-threshold`);n&&(n.disabled=e.target.value===`reps-only`),r()}),document.getElementById(`setting-progression-type`).addEventListener(`change`,e=>{f.progressionType=e.target.value,t.saveUser(f),r()}),document.getElementById(`setting-progression-step`).addEventListener(`change`,e=>{f.progressionStep=e.target.value===`auto`?`auto`:parseFloat(e.target.value)||1,t.saveUser(f),r()}),document.getElementById(`setting-reps-threshold`).addEventListener(`change`,e=>{f.repsThreshold=parseInt(e.target.value)||8,t.saveUser(f)}),document.querySelectorAll(`.info-help-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-type`),r=``,i=``;n===`strategy`?(r=`Strategia di Incremento`,i=`<strong>Strategia di Incremento Carichi</strong><br><br>Determina come l'app distribuisce l'aumento di peso tra le varie serie di un esercizio dopo un feedback positivo:<br><br>• <strong>Tutte le serie:</strong> Il peso aumenta in ogni serie (es. da 50kg in tutte a 51kg in tutte).<br>• <strong>Solo l'ultima serie:</strong> Incrementa solo l'ultimo set per testare il nuovo carico in sicurezza (es. 50, 50, 50, 51kg).<br>• <strong>Solo la prima serie:</strong> Aumenta solo il primo set quando sei più fresco (es. 51, 50, 50, 50kg).<br>• <strong>Alternate:</strong> Incrementa a set alternati (es. 1° e 3° set).`):n===`step`?(r=`Passo di Incremento`,i=`<strong>Valore di Incremento Carichi</strong><br><br>Scegli l'unità di peso da aggiungere quando progredisci:<br><br>• <strong>🤖 Auto (in base al muscolo):</strong> Il sistema intelligente assegna:<br>&nbsp;&nbsp;- <strong>+2.5 kg</strong> a muscoli grandi (Petto, Dorsali, Quadricipiti)<br>&nbsp;&nbsp;- <strong>+1 kg</strong> a muscoli piccoli (Spalle, Bicipiti, Tricipiti, Addome, Altro)<br>• <strong>Fissi (+1, +2, +2.5, +5 kg):</strong> Applica sempre lo stesso incremento fisso indipendentemente dall'esercizio.`):n===`thresh`?(r=`Soglia Reps Minime`,i=`<strong>Soglia Ripetizioni Minime</strong><br><br>Se dai feedback positivo ma le ripetizioni eseguite in qualche set sono inferiori a questa soglia, l'app darà la priorità all'aumento delle ripetizioni portandole al valore soglia, rimandando l'aumento di peso alla sessione successiva.<br><br>Se usi una <strong>Doppia Progressione Range</strong> (es. 8-12 reps), questa soglia globale viene ignorata a favore del limite massimo del range dell'esercizio.`):n===`mode`&&(r=`Logica di Progressione`,i=`<strong>Modalità del Sistema di Sovraccarico</strong><br><br>Scegli come deve agire l'app quando riceve un feedback positivo:<br><br>• <strong>Mista (Reps → Peso):</strong> Progressioni classiche. Prima aumenta le ripetizioni fino alla soglia o limite del range, poi incrementa il peso.<br>• <strong>Solo Peso:</strong> Aumenta direttamente il peso del passo prescelto ad ogni feedback positivo, lasciando le ripetizioni invariate.<br>• <strong>Solo Reps:</strong> Mantiene fisso il peso e aumenta solo le ripetizioni di +1 ad ogni sessione positiva (fino a max 15 reps). Ideale per esercizi a corpo libero o calistenici.`),ue(r,i)})}),document.getElementById(`export-btn-settings`).addEventListener(`click`,a),document.getElementById(`import-input-settings`).addEventListener(`change`,e=>{e.target.files.length>0&&o(e.target.files[0])})};e()},le=()=>{n.innerHTML=`
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
  `,document.getElementById(`close-changelog`).addEventListener(`click`,()=>X())},Z=e=>{if(l=e,r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!F()&&!sessionStorage.getItem(`guide-skipped`)&&e===`dashboard`&&!f){sessionStorage.setItem(`guide-skipped`,`true`),I();return}if(!f&&e!==`onboarding`){L();return}switch(e){case`dashboard`:R();break;case`routines`:z();break;case`history`:J();break;case`progress`:X();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`data-view`);n!==l&&(m?Q(()=>{m.interrupt(),m=null,Z(n)},()=>{m.pause(),m=null,Z(n)}):Z(n))})});var Q=(e,t)=>{let n=document.createElement(`div`);n.style=`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `,n.innerHTML=`
    <div class="card" style="width: 100%; max-width: 400px; text-align: center; margin: 0">
      <h3 style="margin-top: 0">Allenamento in corso</h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px">Vuoi interrompere l'allenamento o metterlo in pausa per riprenderlo in seguito?</p>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <button id="modal-pause" class="btn" style="background: var(--accent-color); color: #000">Metti in Pausa</button>
        <button id="modal-interrupt" class="btn btn-secondary" style="border: 2px solid var(--danger); color: var(--danger)">Interrompi</button>
        <button id="modal-cancel" class="btn btn-secondary">Annulla</button>
      </div>
    </div>
  `,document.body.appendChild(n),document.getElementById(`modal-pause`).addEventListener(`click`,()=>{n.remove(),t&&t()}),document.getElementById(`modal-interrupt`).addEventListener(`click`,()=>{n.remove(),e&&e()}),document.getElementById(`modal-cancel`).addEventListener(`click`,()=>{n.remove()})},$=(e,t,n,r)=>{let i=document.createElement(`div`);i.style=`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    backdrop-filter: blur(8px);
  `,i.innerHTML=`
    <div class="card" style="width: 100%; max-width: 400px; text-align: center; margin: 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5)">
      <h3 style="margin-top: 0; color: var(--accent-color); font-weight: 800">${e}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem">${t}</p>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <button id="modal-confirm-btn" class="btn" style="background: var(--accent-color); color: #000; font-weight: 700">Conferma</button>
        <button id="modal-cancel-btn" class="btn btn-secondary" style="font-weight: 700">Annulla</button>
      </div>
    </div>
  `,document.body.appendChild(i),document.getElementById(`modal-confirm-btn`).addEventListener(`click`,()=>{i.remove(),n&&n()}),document.getElementById(`modal-cancel-btn`).addEventListener(`click`,()=>{i.remove(),r&&r()})},ue=(e,t)=>{let n=document.createElement(`div`);n.style=`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    backdrop-filter: blur(8px);
  `,n.innerHTML=`
    <div class="card" style="width: 100%; max-width: 400px; text-align: left; margin: 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5)">
      <h3 style="margin-top: 0; color: var(--accent-color); font-weight: 800; text-align: center">${e}</h3>
      <div style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.85rem; line-height: 1.6; max-height: 300px; overflow-y: auto; padding-right: 5px">
        ${t}
      </div>
      <button id="modal-close-btn" class="btn" style="background: var(--accent-color); color: #000; font-weight: 700; width: 100%">Capito! 👍</button>
    </div>
  `,document.body.appendChild(n),document.getElementById(`modal-close-btn`).addEventListener(`click`,()=>{n.remove()})},de=e=>{if(typeof e==`string`&&e.includes(`-`)){let t=e.split(`-`).map(e=>parseInt(e.trim()));if(t.length===2&&!isNaN(t[0])&&!isNaN(t[1]))return{min:t[0],max:t[1]}}return null},fe=(e,t)=>{let n=e.progressionType&&e.progressionType!==`inherit`?e.progressionType:t.progressionType||`all`,r=e.repsThreshold&&e.repsThreshold!==`inherit`?parseInt(e.repsThreshold):parseInt(t.repsThreshold)||8,i=e.progressionMode&&e.progressionMode!==`inherit`?e.progressionMode:t.progressionMode||`mixed`,a=1,o=e.progressionStep&&e.progressionStep!==`inherit`?e.progressionStep:t.progressionStep||`auto`;if(o===`auto`){let t=C(e.name);a=t===`Petto`||t===`Dorsali`||t===`Quadricipiti`||t===`Femorali`||t===`Glutei`||t===`Lombari`?2.5:1}else a=parseFloat(o)||1;return{type:n,step:a,repsThresh:r,mode:i}},pe=()=>{let e=t.getLogs(),n=Date.now(),r={Petto:0,Dorsali:0,Trapezi:0,Lombari:0,Quadricipiti:0,Femorali:0,Glutei:0,Polpacci:0,Spalle:0,Bicipiti:0,Tricipiti:0,Addome:0,Altro:0};e.forEach(e=>{e.exercises&&e.timestamp&&e.exercises.forEach(t=>{let n=C(t.name);n&&r[n]===0&&(r[n]=e.timestamp)})});let i={Petto:48,Dorsali:48,Trapezi:36,Lombari:48,Quadricipiti:72,Femorali:72,Glutei:72,Polpacci:48,Spalle:48,Bicipiti:36,Tricipiti:36,Addome:24,Altro:24},a={};for(let e of Object.keys(i)){let t=r[e],o=i[e]*3600*1e3;if(t===0)a[e]={percent:100,hoursLeft:0,lastTrainedStr:`Mai allenato`,status:`fresh`,color:`#00ff88`};else{let r=n-t;if(r>=o)a[e]={percent:100,hoursLeft:0,lastTrainedStr:new Date(t).toLocaleDateString(`it-IT`)+` `+new Date(t).toLocaleTimeString(`it-IT`,{hour:`2-digit`,minute:`2-digit`}),status:`fresh`,color:`#00ff88`};else{let n=Math.floor(r/o*100),i=Math.ceil((o-r)/(3600*1e3)),s=new Date(t).toLocaleDateString(`it-IT`)+` `+new Date(t).toLocaleTimeString(`it-IT`,{hour:`2-digit`,minute:`2-digit`}),c=`recovering`,l=`#ffb300`;n<50?(c=`sore`,l=`#ff4d4d`):n>=86&&(c=`fresh`,l=`#00ff88`),a[e]={percent:n,hoursLeft:i,lastTrainedStr:s,status:c,color:l}}}}return a};Z(`dashboard`),document.addEventListener(`click`,k,{passive:!0}),document.addEventListener(`touchstart`,k,{passive:!0}),[`visibilitychange`,`pageshow`,`focus`].forEach(e=>{window.addEventListener(e,()=>{document.visibilityState===`visible`&&typeof b==`function`&&b()})});