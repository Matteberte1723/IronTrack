(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ROUTINES:`iron_track_routines`,LOGS:`iron_track_logs`,USER_DATA:`iron_track_user`,THEME:`iron_track_theme`,MEASUREMENTS:`iron_track_measurements`,PAUSED_WORKOUT:`iron_track_paused_workout`,ALARM_SOUND:`iron_track_alarm_sound`,ALARM_ENABLED:`iron_track_alarm_enabled`,ALARM_DURATION:`iron_track_alarm_duration`},t={saveRoutines:t=>{localStorage.setItem(e.ROUTINES,JSON.stringify(t))},getRoutines:()=>{let t=localStorage.getItem(e.ROUTINES);return t?JSON.parse(t):[]},saveLog:n=>{let r=t.getLogs();r.unshift(n),localStorage.setItem(e.LOGS,JSON.stringify(r))},getLogs:()=>{let t=localStorage.getItem(e.LOGS);return t?JSON.parse(t):[]},saveUser:t=>{localStorage.setItem(e.USER_DATA,JSON.stringify(t))},getUser:()=>{let t=localStorage.getItem(e.USER_DATA);return t?JSON.parse(t):null},saveTheme:t=>{localStorage.setItem(e.THEME,t)},getTheme:()=>localStorage.getItem(e.THEME)||`default`,savePausedWorkout:t=>{t?localStorage.setItem(e.PAUSED_WORKOUT,JSON.stringify(t)):localStorage.removeItem(e.PAUSED_WORKOUT)},getPausedWorkout:()=>{let t=localStorage.getItem(e.PAUSED_WORKOUT);return t?JSON.parse(t):null},saveAlarmSound:t=>{localStorage.setItem(e.ALARM_SOUND,t)},getAlarmSound:()=>localStorage.getItem(e.ALARM_SOUND)||`classic`,saveAlarmEnabled:t=>{localStorage.setItem(e.ALARM_ENABLED,JSON.stringify(t))},getAlarmEnabled:()=>{let t=localStorage.getItem(e.ALARM_ENABLED);return t===null?!0:JSON.parse(t)},saveAlarmDuration:t=>{localStorage.setItem(e.ALARM_DURATION,JSON.stringify(t))},getAlarmDuration:()=>{let t=localStorage.getItem(e.ALARM_DURATION);return t===null?5:JSON.parse(t)},clearAll:()=>{localStorage.clear()}};`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW Registered!`,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});var n=document.getElementById(`main-content`),r=document.querySelectorAll(`.nav-item`),i=e=>{document.body.className=e===`default`?``:`theme-${e}`};i(t.getTheme());var a=()=>{let e={routines:t.getRoutines(),logs:t.getLogs(),user:t.getUser(),theme:t.getTheme(),version:s,exportDate:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`irontrack_backup_${new Date().toISOString().split(`T`)[0]}.json`,i.click(),URL.revokeObjectURL(r)},o=e=>{let n=new FileReader;n.onload=e=>{try{let n=JSON.parse(e.target.result);confirm(`Questo sovrascriverà tutti i dati attuali. Sei sicuro?`)&&(n.routines&&t.saveRoutines(n.routines),n.logs&&localStorage.setItem(`iron_track_logs`,JSON.stringify(n.logs)),n.user&&t.saveUser(n.user),n.theme&&t.saveTheme(n.theme),alert(`Dati importati con successo! L'app verrà ricaricata.`),window.location.reload())}catch{alert(`Errore durante l'importazione. Il file potrebbe essere corrotto.`)}},n.readAsText(e)},s=`v2.3.0`,c=[{version:`v2.3.0`,title:`Mappa di Recupero Muscolare`,changes:[`Mappa Corporea Interattiva: Visualizzazione stilizzata del corpo umano (Fronte e Retro) che mostra lo stato di freschezza muscolare di ciascun distretto`,`Stati e Soglie di Recupero: Colori dinamici basati sullo storico degli allenamenti completati: Rosso (Affaticato, <50%), Giallo (In recupero, 50-85%) e Verde (Fresco/Pronto, 86-100%)`,`Dettagli di Recupero: Clicca su un muscolo per vedere la percentuale esatta, le ore mancanti al recupero, e la data dell'ultimo allenamento registrato`,`Pulsazione Attiva: Effetto di pulsazione luminosa rossa per i muscoli congestionati, evidenziando visivamente la necessità di riposo`]},{version:`v2.2.0`,title:`Saturazione Automatica & Personalizzazione Premium`,changes:[`Switch Progressione Globale: Attiva/disattiva gli incrementi automatici dei pesi in Settings per un controllo assoluto`,`Passo Auto in base al Muscolo: Calcola l'incremento ideale in modo scientifico (+2.5 kg per Petto/Dorso/Gambe, +1 kg per Spalle/Braccia/Addome)`,`Tre Nuove Modalità di Progressioni: Mista (Reps → Peso), Solo Peso (incremento diretto) o Solo Reps (ottimale per corpo libero fino a max 15)`,`Simulatore Split-Screen & Solo Reps: Anteprima visiva affiancata del comportamento sui gruppi muscolari e con cappello blu per le reps`,`Modalità Esercizio Eredita: Scegli per ogni singolo esercizio se ereditare le impostazioni globali o personalizzare logica, passo e applicazione`]},{version:`v2.1.1`,title:`Progressione Avanzata & Autoregolazione`,changes:[`Progressione per Esercizio: imposta strategie di incremento personalizzate per ciascun esercizio direttamente in modifica scheda`,`Autoregolazione (Smart Deload): se accumuli 3 feedback negativi consecutivi sullo stesso esercizio, a fine allenamento ti proporremo uno scarico del -10% peso`,`Doppia Progressione Classica: supporto integrato per i range di reps (es. 8-12 reps) che aumenta il peso solo al completamento del range massimo`,`Simulatore di Progressione: grafico a barre interattivo in Impostazioni che visualizza in tempo reale come cambieranno i pesi dei tuoi set`,`Pulsanti Info (Tooltips): icone esplicative 'ℹ️' per comprendere pedagogicamente ogni singola impostazione`]},{version:`v2.1.0`,title:`Progressione Personalizzata & Storico Avanzato`,changes:[`Progressione su misura: scegli come incrementare i carichi (tutte le serie, ultima serie, prima serie o alternate)`,`Incrementi flessibili: seleziona il passo (1, 2, 2.5, 5 kg/lbs) e la soglia minima di ripetizioni`,`Sovraccarico Storico: applica istantaneamente i carichi di una sessione passata alla scheda attiva con lo stesso nome`,`Conferma Sicura: sistema di conferma prima di sovrascrivere i carichi della scheda attiva`,`Indicatore 'Carico Facile': gli esercizi con feedback positivo nella sessione precedente saranno evidenziati in verde la volta successiva`]},{version:`v2.0.0`,title:`Navigazione Sicura & Impostazioni`,changes:[`Sistema di Pausa: Previeni l'interruzione accidentale dell'allenamento`,`Nuova Sezione Impostazioni dedicata per gestire Profilo, Unità e Backup`,`Allarme Timer riscritto per maggiore affidabilità in background`,`Supporto per Kg e Libbre`]},{version:`v1.9.2`,title:`Sincronizzazione Timer`,changes:[`Risolto blocco del timer di recupero e del circuito in standby o in background`,`Calcolo basato su timestamp assoluti per massima precisione`,`Sincronizzazione immediata al rientro nell'app`]},{version:`v1.9.1`,title:`Progressi & Volume`,changes:[`Progressione intelligente: aumenta reps o carichi in base al feedback`,`Persistenza automatica di carichi e reps sulla scheda`,`Nuovo grafico del Volume Totale`,`Calendario mensile evidenziato correttamente`]},{version:`v1.9.0`,title:`Personalizzazione & Flow`,changes:[`Riordino Dinamico: Sposta gli esercizi con un tocco (Drag & Drop)`,`Note Esercizio: Aggiungi promemoria per ogni esercizio`,`Ripetizioni Variabili: Imposta reps diverse per ogni serie`,`Stima Durata: Calcolo automatico della durata dell'allenamento`,`Interfaccia Migliorata: Nuovo sistema di inserimento rapido`]},{version:`v1.8.0`,title:`L'Evoluzione`,changes:[`Backup & Ripristino: Esporta i tuoi dati per non perderli mai`,`Calendario Allenamenti: Visualizza la tua costanza mensile`,`Temi Personalizzati: Scegli il tuo colore (Red, Blue, Purple, White)`,`Icone Esercizi: Migliorata la navigazione visiva dei muscoli`]},{version:`v1.7.0`,title:`Circuiti & Visione`,changes:[`Gestione Circuiti AMRAP con timer e round`,`Rilevamento automatico schede cartacee (OCR)`,`Correzione refusi motivazionali`]},{version:`v1.6.0`,title:`Controllo Totale`,changes:[`Timer di recupero personalizzabile per esercizio`,`Anteprima scheda prima di iniziare`,`Impostazione carichi iniziali nella creazione`,`Inserimento manuale esercizi migliorato`]},{version:`v1.5.0`,title:`Update Professionale`,changes:[`Database esercizi con menu a tendina`,`Auto-valutazione serie (👍/👎) e aumento carichi intelligente`,`Dettaglio storico allenamenti cliccabile`]},{version:`v1.4.0`,title:`Guida Intelligente`,changes:[`Guida all'installazione per nuovi utenti`,`Rilevamento automatico modalità standalone`]},{version:`v1.3.0`,title:`Sessioni & Timer`,changes:[`Timer durata totale allenamento`,`Dettaglio durata nella cronologia`,`Migliorato sistema di aggiornamento`]},{version:`v1.2.0`,title:`Training Flow`,changes:[`Spunta serie completate`,`Avvio automatico timer di riposo al check`,`Allarme sonoro al termine del recupero`]},{version:`v1.1.0`,title:`Personalizzazione`,changes:[`Profilo utente completo (Età, Peso, Altezza)`,`Soprannome personalizzato`,`Frasi motivazionali dinamiche (Gymbo/Guerriera)`]},{version:`v1.0.0`,title:`Lancio IronTrack`,changes:[`Gestione schede allenamento`,`Tracking pesi e ripetizioni`,`Dark Mode & Premium Design`]}],l=`dashboard`,u=t.getRoutines(),d=t.getLogs(),f=t.getUser();if(f){let e=!1;f.progressionEnabled===void 0&&(f.progressionEnabled=!0,e=!0),f.progressionType===void 0&&(f.progressionType=`all`,e=!0),f.progressionStep===void 0&&(f.progressionStep=`auto`,e=!0),f.repsThreshold===void 0&&(f.repsThreshold=8,e=!0),f.progressionMode===void 0&&(f.progressionMode=`mixed`,e=!0),e&&t.saveUser(f)}var p=t.getPausedWorkout?t.getPausedWorkout():null,m=null,h=null,g=null,_=null,v=null,y=null;u.length===0&&(u=[{id:1,name:`Push Day (Spinta)`,exercises:[{name:`Panca Piana`,sets:4,reps:`8-10`,weight:60},{name:`Military Press`,sets:3,reps:`10-12`,weight:30},{name:`Dips`,sets:3,reps:`cedimento`,weight:0}]},{id:2,name:`Pull Day (Trazione)`,exercises:[{name:`Trazioni`,sets:4,reps:`8`,weight:0,rest:90},{name:`Rematore`,sets:3,reps:`10-12`,weight:50,rest:60},{name:`Curl Bilanciere`,sets:3,reps:`12`,weight:20,rest:60}]},{id:3,name:`Circuito Full Body 🔥`,type:`circuit`,duration:50,exercises:[{name:`Piegamenti sulle braccia`,sets:1,reps:`10`,weight:0},{name:`Jump squat verticale`,sets:1,reps:`10`,weight:0},{name:`Russian twist con kettlebell`,sets:1,reps:`10xlato`,weight:10},{name:`Corsa`,sets:1,reps:`2 min`,weight:0},{name:`Rematore / Australian Pull-up`,sets:1,reps:`10`,weight:0},{name:`Step up su panca`,sets:1,reps:`10xlato`,weight:0},{name:`Plank tocco spalla`,sets:1,reps:`10xlato`,weight:0},{name:`Cyclette 80-90rpm`,sets:1,reps:`2 min`,weight:0},{name:`Arnold press manubri`,sets:1,reps:`10`,weight:10},{name:`Dips su panca`,sets:1,reps:`10`,weight:0},{name:`Leg raises sdraiato`,sets:1,reps:`10`,weight:0},{name:`Cyclette con ventilatore`,sets:1,reps:`2 min`,weight:0}]}],t.saveRoutines(u));var b={Petto:[`Panca Piana Bilanciere`,`Panca Inclinata Manubri`,`Panca Piana`,`Croci ai Cavi`,`Dips`,`Chest Press`,`Pectoral Machine`,`Push Up`],Dorso:[`Trazioni alla Sbarra`,`Trazioni`,`Lat Machine`,`Rematore Bilanciere`,`Rematore Manubrio`,`Pulley`,`Pull-down braccia tese`],Gambe:[`Squat Bilanciere`,`Squat`,`Leg Press`,`Affondi`,`Leg Extension`,`Leg Curl`,`Stacchi Romeni`,`Stacco`,`Calf Raises`],Spalle:[`Military Press`,`Alzate Laterali`,`Lento Avanti Manubri`,`Alzate Frontali`,`Face Pull`,`Shoulder Press`],Bicipiti:[`Curl Bilanciere`,`Curl Manubri`,`Hammer Curl`,`Curl panca Scott`,`Spider Curl`],Tricipiti:[`Pushdown Tricipiti`,`French Press`,`Estensioni dietro nuca`,`Kickback`,`Dips su panca`],Addome:[`Crunch`,`Plank`,`Leg Raises`,`Ab Roller`,`Russian Twist`,`Sit-up`],Altro:[]},x={Petto:`🍒`,Dorso:`🦅`,Gambe:`🍗`,Spalle:`🛡️`,Bicipiti:`💪`,Tricipiti:`⚡`,Addome:`🧱`,Altro:`🏋️`},S=e=>{if(!e)return``;for(let[t,n]of Object.entries(b))if(n.includes(e))return t;return`Altro`},C=e=>x[e]||x.Altro,w={male:[`Pronto per spingere, {name}? ⚡️`,`Si parte Gymbro {name}! 💪`,`Oggi si alza ghisa, {name}! 🏋️‍♂️`,`Carica quel bilanciere, {name}!`,`Oggi distruggiamo tutto, {name}! 🔥`],female:[`Pronta per splendere, {name}? ✨`,`Si parte Guerriera {name}! 🛡️`,`Oggi si modella il fisico, {name}! 🎀`,`Forza e grazia {name}, andiamo a vincere!`,`Brilla più del sudore, {name}! 💎`]},T=()=>{if(!f)return`Pronto per l'allenamento?`;let e=w[f.gender]||w.male;return e[Math.floor(Math.random()*e.length)].replace(`{name}`,f.nickname||f.name||``)},ee=e=>{if(!e||!e.exercises)return 0;let t=0;return e.exercises.forEach(e=>{let n=parseInt(e.sets)||1,r=parseInt(e.rest)||60;t+=n*45+(n-1)*r}),Math.round(t/60+5)},E=(e,t)=>{e.querySelectorAll(`.draggable-item`).forEach(r=>{let i=r.querySelector(`.drag-handle`);r.setAttribute(`draggable`,!0),r.addEventListener(`dragstart`,e=>{r.classList.add(`dragging`)}),r.addEventListener(`dragend`,()=>{r.classList.remove(`dragging`),t&&t()}),i&&(i.addEventListener(`touchstart`,e=>{r.classList.add(`dragging`)},{passive:!0}),i.addEventListener(`touchmove`,t=>{t.preventDefault();let r=t.touches[0],i=e.querySelector(`.dragging`);if(!i)return;let a=n(e,r.clientY);a==null?e.appendChild(i):e.insertBefore(i,a)},{passive:!1}),i.addEventListener(`touchend`,()=>{r.classList.contains(`dragging`)&&(r.classList.remove(`dragging`),t&&t())}))}),e.addEventListener(`dragover`,t=>{t.preventDefault();let r=e.querySelector(`.dragging`);if(!r)return;let i=n(e,t.clientY);i==null?e.appendChild(r):e.insertBefore(r,i)});function n(e,t){return[...e.querySelectorAll(`.draggable-item:not(.dragging)`)].reduce((e,n)=>{let r=n.getBoundingClientRect(),i=t-r.top-r.height/2;return i<0&&i>e.offset?{offset:i,element:n}:e},{offset:-1/0}).element}},te=(e,t,n)=>{let r=n*1*(16/8),i=t*2,a=(t,n)=>{for(let r=0;r<n.length;r++)e.setUint8(t+r,n.charCodeAt(r))};a(0,`RIFF`),e.setUint32(4,36+i,!0),a(8,`WAVE`),a(12,`fmt `),e.setUint32(16,16,!0),e.setUint16(20,1,!0),e.setUint16(22,1,!0),e.setUint32(24,n,!0),e.setUint32(28,r,!0),e.setUint16(32,2,!0),e.setUint16(34,16,!0),a(36,`data`),e.setUint32(40,i,!0)},D=(e,t)=>{let n=new ArrayBuffer(44+e.length*2),r=new DataView(n);te(r,e.length,t);for(let t=0;t<e.length;t++)r.setInt16(44+t*2,Math.max(-32768,Math.min(32767,e[t]*32767)),!0);return URL.createObjectURL(new Blob([n],{type:`audio/wav`}))},O=()=>{let e=44100,t=.35,n=Math.floor(e*t),r=new Float32Array(n);for(let i=0;i<n;i++){let n=i/e,a=Math.min(1,n/.01),o=Math.min(1,(t-n)/.05);r[i]=Math.sin(2*Math.PI*880*n)*.6*a*o}return D(r,e)},ne=()=>{let e=44100,t=.08,n=.08;t*3+n*2;let r=Math.floor(e*.4),i=new Float32Array(r);for(let a=0;a<r;a++){let r=a/e,o=r%(t+n);if(Math.floor(r/(t+n))<3&&o<t){let e=o,n=Math.min(1,e/.005),s=Math.min(1,(t-e)/.005);i[a]=Math.sin(2*Math.PI*1200*r)*.55*n*s}}return D(i,e)},re=()=>{let e=44100,t=Math.floor(e*1.2),n=new Float32Array(t),r=[220,440,554,660],i=[1,.6,.3,.2],a=[1.5,2,2.5,3];for(let o=0;o<t;o++){let t=o/e,s=0;for(let e=0;e<r.length;e++)s+=Math.sin(2*Math.PI*r[e]*t)*i[e]*Math.exp(-t*a[e]);let c=Math.min(1,t/.005);n[o]=s*.5*c}return D(n,e)},k={},A=e=>{if(e||=t.getAlarmSound(),!k[e])switch(e){case`digital`:k[e]=ne();break;case`gong`:k[e]=re();break;default:k[e]=O();break}return k[e]},j=[],M=!1,N=null,P=e=>{j.forEach(e=>{try{e.pause(),e.src=``}catch{}}),j=[],M=!1,N=null},F=()=>{if(!g)try{g=new(window.AudioContext||window.webkitAudioContext)}catch{}g&&g.state===`suspended`&&g.resume().catch(()=>{});let e=t.getAlarmSound();if(N&&N!==e&&P(),!M){let t=A(e);for(let e=0;e<4;e++){let e=new Audio(t);e.volume=.01,e.play().then(()=>{e.pause(),e.currentTime=0,e.volume=1}).catch(()=>{}),j.push(e)}M=!0,N=e}},I=e=>{let t=A(e),n=new Audio(t);n.volume=1,n.play().catch(()=>{})},L=()=>{if(!t.getAlarmEnabled())return navigator.vibrate&&navigator.vibrate([500,200,500,200,500]),()=>{navigator.vibrate&&navigator.vibrate(0)};F(),navigator.vibrate&&navigator.vibrate([500,200,500,200,500]);let e=null,n=!1,r=0,i=t.getAlarmSound(),a=A(i),o=i===`gong`?2e3:i===`digital`?1500:1200,s=()=>{if(n)return;navigator.vibrate&&navigator.vibrate(300);let e=j[r%j.length];if(e)try{e.currentTime=0,e.volume=1,e.play().catch(()=>{})}catch{}try{let e=new Audio(a);e.volume=1,e.play().catch(()=>{})}catch{}if(g&&i===`classic`)try{g.state===`suspended`&&g.resume().catch(()=>{});let e=g.createOscillator(),t=g.createGain(),n=g.currentTime;e.type=`sine`,e.frequency.setValueAtTime(880,n),t.gain.setValueAtTime(0,n),t.gain.linearRampToValueAtTime(.5,n+.02),t.gain.exponentialRampToValueAtTime(.01,n+.35),e.connect(t),t.connect(g.destination),e.start(n),e.stop(n+.35)}catch{}r++};s(),e=setInterval(s,o);let c=setTimeout(()=>{e&&clearInterval(e)},6e4);return()=>{n=!0,e&&=(clearInterval(e),null),clearTimeout(c),navigator.vibrate&&navigator.vibrate(0),j.forEach(e=>{try{e.pause(),e.currentTime=0}catch{}})}},R=e=>{F();let n=document.getElementById(`rest-timer-overlay`);n&&n.remove(),h&&clearInterval(h);let r=document.createElement(`div`);r.id=`rest-timer-overlay`,r.style=`
    position: fixed; bottom: 100px; left: 16px; right: 16px;
    background: var(--card-bg); border: 2px solid var(--accent-color);
    border-radius: 20px; padding: 20px; z-index: 2000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center;
    animation: slideUp 0.3s ease-out;
  `;let i=Date.now()+e*1e3,a=null;r.innerHTML=`
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${e}s</div>
    <button id="stop-timer" class="btn" style="margin-top: 15px; background: var(--danger); height: 45px; padding: 0 30px">Annulla</button>
  `,document.body.appendChild(r);let o=()=>{let e=document.getElementById(`timer-display`);if(!e){clearInterval(h),y=null;return}let n=Math.max(0,Math.ceil((i-Date.now())/1e3));if(e.innerText=n+`s`,n<=0){if(clearInterval(h),y=null,e.innerText=`FINE! 🔥`,e.style.animation=`pulse 0.5s infinite`,!a){a=L();let e=t.getAlarmDuration()*1e3;setTimeout(()=>{a&&=(a(),null);let e=document.getElementById(`rest-timer-overlay`);e&&(e.style.animation=`slideDown 0.3s ease-in forwards`,setTimeout(()=>e.remove(),300))},e)}let n=document.getElementById(`stop-timer`);n&&(n.innerText=`STOP ALLARME`,n.style.background=`var(--accent-color)`,n.style.color=`#000`)}};y=o,h=setInterval(o,1e3),document.getElementById(`stop-timer`).addEventListener(`click`,()=>{a&&a(),clearInterval(h),y=null,r.remove()})},z=()=>window.navigator.standalone||window.matchMedia(`(display-mode: standalone)`).matches,B=()=>{n.innerHTML=`
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
  `,document.getElementById(`skip-guide`).addEventListener(`click`,()=>{f?H():V()})},V=(e=1,r={})=>{e===1?(n.innerHTML=`
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
    `,document.querySelectorAll(`.gender-btn`).forEach(e=>{e.addEventListener(`click`,()=>{V(2,{gender:e.getAttribute(`data-gender`)})})})):(n.innerHTML=`
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
    `,document.getElementById(`back-step`).addEventListener(`click`,()=>V(1)),document.getElementById(`finish-onboarding`).addEventListener(`click`,()=>{let e={...r,name:document.getElementById(`ob-name`).value,surname:document.getElementById(`ob-surname`).value,nickname:document.getElementById(`ob-nickname`).value,age:document.getElementById(`ob-age`).value,weight:document.getElementById(`ob-weight`).value,height:document.getElementById(`ob-height`).value};if(!e.name||!e.nickname)return alert(`Inserisci almeno il nome e il soprannome!`);f=e,t.saveUser(f),Z(`dashboard`)}))},H=()=>{if(!f){V();return}let e=d[0]||{routineName:`Nessun allenamento`,date:`-`},t=d.length;n.innerHTML=`
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${f.gender===`male`?`Bentornato, Gymbro`:`Bentornata, Guerriera`}</div>
        <div class="card-title" style="font-size: 1.5rem">${T()}</div>
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
  `,document.getElementById(`start-quick`).addEventListener(`click`,()=>{Z(`routines`)});let r=document.getElementById(`resume-workout`);r&&r.addEventListener(`click`,()=>{p.type===`circuit`?K(p.routineId,!0):q(p.routineId,!0)})},U=()=>{n.innerHTML=`
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000; display: flex; align-items: center; gap: 4px; padding: 6px 10px">Inserimento rapido 📷✏️</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${u.map(e=>{let t=e.exercises[0],n=C(t?S(t.name):`Altro`),r=ee(e);return`
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
  `,document.getElementById(`add-routine-btn`).addEventListener(`click`,()=>{W()}),document.getElementById(`scan-routine-btn`).addEventListener(`click`,()=>{oe()}),document.querySelectorAll(`.routine-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||ae(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.edit-routine-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),ie(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.delete-routine-btn`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.stopPropagation(),confirm(`Sei sicuro di voler eliminare questa scheda?`)){let n=parseInt(e.getAttribute(`data-id`));u=u.filter(e=>e.id!==n),t.saveRoutines(u),U()}})})},ie=e=>{let r=u.find(t=>t.id==e),i=r.exercises.map(e=>({...e,_muscle:S(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})),a=r.type||`standard`,o=()=>{n.innerHTML=`
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
                        ${Object.keys(b).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(b[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  ⚙️ Progressione Esercizio ${e.progressionType&&e.progressionType!==`inherit`?`(Personalizzata)`:`(Eredita)`}
                </button>
                <div class="ex-progression-settings-panel" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; animation: slideUp 0.2s ease-out">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">LOGICA</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionMode||e.progressionMode===`inherit`?`selected`:``}>Eredita</option>
                      <option value="mixed" ${e.progressionMode===`mixed`?`selected`:``}>Mista (Reps → Peso)</option>
                      <option value="weight-only" ${e.progressionMode===`weight-only`?`selected`:``}>Solo Peso</option>
                      <option value="reps-only" ${e.progressionMode===`reps-only`?`selected`:``}>Solo Reps</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">APPLICAZIONE PESO</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionType||e.progressionType===`inherit`?`selected`:``}>Eredita</option>
                      <option value="all" ${e.progressionType===`all`?`selected`:``}>Tutte</option>
                      <option value="last" ${e.progressionType===`last`?`selected`:``}>Ultima</option>
                      <option value="first" ${e.progressionType===`first`?`selected`:``}>Prima</option>
                      <option value="alternate" ${e.progressionType===`alternate`?`selected`:``}>Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">PASSO INCREMENTO</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionStep||e.progressionStep===`inherit`?`selected`:``}>Eredita</option>
                      <option value="auto" ${e.progressionStep===`auto`?`selected`:``}>🤖 Auto (Muscolo)</option>
                      <option value="1" ${e.progressionStep==1?`selected`:``}>+1 kg</option>
                      <option value="2" ${e.progressionStep==2?`selected`:``}>+2 kg</option>
                      <option value="2.5" ${e.progressionStep==2.5?`selected`:``}>+2.5 kg</option>
                      <option value="5" ${e.progressionStep==5?`selected`:``}>+5 kg</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SOGLIA REPS</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.repsThreshold||e.repsThreshold===`inherit`?`selected`:``}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(t=>`<option value="${t}" ${e.repsThreshold==t?`selected`:``}>${t} reps</option>`).join(``)}
                    </select>
                  </div>
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
    `,document.getElementById(`cancel-edit-routine`).addEventListener(`click`,()=>U()),E(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`edit-routine-type`);e.addEventListener(`change`,()=>{s(),a=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));i[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._manual=!i[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiWeight=!i[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps-edit`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i[t]._multiReps=!i[t]._multiReps,o()})}),document.getElementById(`add-ex-row-edit`).addEventListener(`click`,()=>{s(),i.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));i.splice(t,1),o()})}),document.getElementById(`save-edited-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`edit-routine-name`).value,n=document.getElementById(`edit-routine-type`).value,a=parseInt(document.getElementById(`edit-routine-duration`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let o={id:r.id,name:e,type:n,duration:n===`circuit`?a:null,exercises:i.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``,progressionMode:e.progressionMode||`inherit`,progressionType:e.progressionType||`inherit`,progressionStep:e.progressionStep||`inherit`,repsThreshold:e.repsThreshold||`inherit`,repsRange:e.repsRange||(typeof e.reps==`string`&&e.reps.includes(`-`)?e.reps:void 0)}))};if(o.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);let c=u.findIndex(e=>e.id==r.id);u[c]=o,t.saveRoutines(u),U()})},s=()=>{let e=a,t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let r=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...i[r]};c.name=a?a.value:``,c.notes=s?s.value:``;let l=n.querySelector(`.ex-prog-mode`),u=n.querySelector(`.ex-prog-type`),d=n.querySelector(`.ex-prog-step`),f=n.querySelector(`.ex-prog-thresh`);if(c.progressionMode=l?l.value:`inherit`,c.progressionType=u?u.value:`inherit`,c.progressionStep=d?d.value===`inherit`?`inherit`:d.value===`auto`?`auto`:parseFloat(d.value):`inherit`,c.repsThreshold=f?f.value===`inherit`?`inherit`:parseInt(f.value):`inherit`,typeof c.reps==`string`&&c.reps.includes(`-`)&&(c.repsRange=c.reps),e===`circuit`)c.reps=o?o.value:`10`,c.sets=1,c.rest=0,c.weight=parseFloat(n.querySelector(`.ex-weight-edit`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set-edit`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set-edit`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-edit`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),i=t};o()},W=(e=null)=>{let r=e?e.map(e=>({...e,_muscle:S(e.name),_manual:!1,_multiWeight:Array.isArray(e.weight),_multiReps:Array.isArray(e.reps),notes:e.notes||``})):[{name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}],i=`standard`,a=50,o=()=>{n.innerHTML=`
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
                        ${Object.keys(b).map(t=>`<option value="${t}" ${e._muscle===t?`selected`:``}>${t}</option>`).join(``)}
                      </select>
                      <select class="ex-name" data-index="${t}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(b[e._muscle]||[]).map(t=>`<option value="${t}" ${t===e.name?`selected`:``}>${t}</option>`).join(``)}
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
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  ⚙️ Progressione Esercizio ${e.progressionType&&e.progressionType!==`inherit`?`(Personalizzata)`:`(Eredita)`}
                </button>
                <div class="ex-progression-settings-panel" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; animation: slideUp 0.2s ease-out">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">LOGICA</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionMode||e.progressionMode===`inherit`?`selected`:``}>Eredita</option>
                      <option value="mixed" ${e.progressionMode===`mixed`?`selected`:``}>Mista (Reps → Peso)</option>
                      <option value="weight-only" ${e.progressionMode===`weight-only`?`selected`:``}>Solo Peso</option>
                      <option value="reps-only" ${e.progressionMode===`reps-only`?`selected`:``}>Solo Reps</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">APPLICAZIONE PESO</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionType||e.progressionType===`inherit`?`selected`:``}>Eredita</option>
                      <option value="all" ${e.progressionType===`all`?`selected`:``}>Tutte</option>
                      <option value="last" ${e.progressionType===`last`?`selected`:``}>Ultima</option>
                      <option value="first" ${e.progressionType===`first`?`selected`:``}>Prima</option>
                      <option value="alternate" ${e.progressionType===`alternate`?`selected`:``}>Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">PASSO INCREMENTO</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.progressionStep||e.progressionStep===`inherit`?`selected`:``}>Eredita</option>
                      <option value="auto" ${e.progressionStep===`auto`?`selected`:``}>🤖 Auto (Muscolo)</option>
                      <option value="1" ${e.progressionStep==1?`selected`:``}>+1 kg</option>
                      <option value="2" ${e.progressionStep==2?`selected`:``}>+2 kg</option>
                      <option value="2.5" ${e.progressionStep==2.5?`selected`:``}>+2.5 kg</option>
                      <option value="5" ${e.progressionStep==5?`selected`:``}>+5 kg</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SOGLIA REPS</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!e.repsThreshold||e.repsThreshold===`inherit`?`selected`:``}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(t=>`<option value="${t}" ${e.repsThreshold==t?`selected`:``}>${t} reps</option>`).join(``)}
                    </select>
                  </div>
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
    `,document.getElementById(`cancel-add`).addEventListener(`click`,()=>U()),E(document.getElementById(`exercises-container`),()=>{s()});let e=document.getElementById(`routine-type-select`);e.addEventListener(`change`,()=>{s(),i=e.value,o()}),document.querySelectorAll(`.ex-muscle`).forEach(e=>{e.addEventListener(`change`,e=>{s();let t=parseInt(e.target.getAttribute(`data-index`));r[t].name=``,o()})}),document.querySelectorAll(`.toggle-manual`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._manual=!r[t]._manual,o()})}),document.querySelectorAll(`.toggle-multi-weight`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiWeight=!r[t]._multiWeight,o()})}),document.querySelectorAll(`.toggle-multi-reps`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r[t]._multiReps=!r[t]._multiReps,o()})}),document.getElementById(`add-ex-row`).addEventListener(`click`,()=>{s(),r.push({name:``,sets:3,reps:`10`,weight:0,rest:60,_muscle:``,_manual:!1,notes:``}),o()}),document.querySelectorAll(`.remove-ex`).forEach(e=>{e.addEventListener(`click`,()=>{s();let t=parseInt(e.getAttribute(`data-index`));r.splice(t,1),o()})}),document.getElementById(`save-routine`).addEventListener(`click`,()=>{s();let e=document.getElementById(`routine-name-input`).value,n=document.getElementById(`routine-type-select`).value,i=parseInt(document.getElementById(`routine-duration-input`).value)||50;if(!e)return alert(`Inserisci un nome per la scheda`);let a={id:Date.now(),name:e,type:n,duration:n===`circuit`?i:null,exercises:r.filter(e=>e.name.trim()!==``).map(e=>({name:e.name,sets:e.sets,reps:e.reps,weight:e.weight||0,rest:e.rest||60,notes:e.notes||``,progressionMode:e.progressionMode||`inherit`,progressionType:e.progressionType||`inherit`,progressionStep:e.progressionStep||`inherit`,repsThreshold:e.repsThreshold||`inherit`,repsRange:e.repsRange||(typeof e.reps==`string`&&e.reps.includes(`-`)?e.reps:void 0)}))};if(a.exercises.length===0)return alert(`Aggiungi e compila almeno un esercizio`);u.push(a),t.saveRoutines(u),U()})},s=()=>{let e=i;document.getElementById(`routine-duration-input`)&&(a=parseInt(document.getElementById(`routine-duration-input`).value)||50);let t=[];document.querySelectorAll(`.exercise-form-card`).forEach(n=>{let i=parseInt(n.getAttribute(`data-index`)),a=n.querySelector(`.ex-name`),o=n.querySelector(`.ex-reps`),s=n.querySelector(`.notes-input`),c={...r[i]};c.name=a?a.value:``,c.notes=s?s.value:``;let l=n.querySelector(`.ex-prog-mode`),u=n.querySelector(`.ex-prog-type`),d=n.querySelector(`.ex-prog-step`),f=n.querySelector(`.ex-prog-thresh`);if(c.progressionMode=l?l.value:`inherit`,c.progressionType=u?u.value:`inherit`,c.progressionStep=d?d.value===`inherit`?`inherit`:d.value===`auto`?`auto`:parseFloat(d.value):`inherit`,c.repsThreshold=f?f.value===`inherit`?`inherit`:parseInt(f.value):`inherit`,typeof c.reps==`string`&&c.reps.includes(`-`)&&(c.repsRange=c.reps),e===`circuit`)c.sets=1,c.rest=0,c.reps=o?o.value:`10`,c.weight=parseFloat(n.querySelector(`.ex-weight-init`)?.value)||0,c._multiWeight=!1,c._multiReps=!1;else{let e=n.querySelector(`.ex-muscle`);c._muscle=e?e.value:c._muscle||``,c.sets=parseInt(n.querySelector(`.ex-sets`).value)||3,c.rest=parseInt(n.querySelector(`.ex-rest`).value)||60;let t=n.querySelectorAll(`.ex-reps-set`);t.length>0?(c.reps=Array.from(t).map(e=>e.value||`10`),c._multiReps=!0):(c.reps=o?o.value:`10`,c._multiReps=!1);let r=n.querySelectorAll(`.ex-weight-set`);if(r.length>0)c.weight=Array.from(r).map(e=>parseFloat(e.value)||0),c._multiWeight=!0;else{let e=n.querySelector(`.ex-weight-init`);c.weight=parseFloat(e?e.value:0)||0,c._multiWeight=!1}}t.push(c)}),r=t};o()},ae=e=>{let t=u.find(t=>t.id==e);n.innerHTML=`
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
                <span class="ex-icon" style="font-size: 0.9rem; width: 24px; height: 24px; margin-right: 8px; background: rgba(255,255,255,0.03)">${C(S(e.name))}</span>
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
  `,document.getElementById(`back-to-list`).addEventListener(`click`,()=>U()),document.getElementById(`start-session-now`).addEventListener(`click`,()=>{F(),t.type===`circuit`?K(e):q(e)})},G=e=>{let t=e.split(`
`),n=[];return t.forEach(e=>{let t=e.trim();if(t.length<3)return;let r=t.match(/^([a-zA-Z\s]+)\s+(\d+)\s*[xX*]\s*(\d+)(?:\s*(\d+))?/),i=t.match(/^(\d+)\s*[xX*]\s*(\d+)\s+([a-zA-Z\s]+)/);if(r)n.push({name:r[1].trim(),sets:parseInt(r[2]),reps:r[3],weight:parseInt(r[4]||0),rest:60});else if(i)n.push({name:i[3].trim(),sets:parseInt(i[1]),reps:i[2],weight:0,rest:60});else{let e=t.match(/\d+/g),r=``;for(let e in b){for(let n of b[e])if(t.toLowerCase().includes(n.toLowerCase())){r=n;break}if(r)break}if(r&&e&&e.length>=1)n.push({name:r,sets:parseInt(e[0]||3),reps:e[1]||`10`,weight:parseInt(e[2]||0),rest:60});else if(t.replace(/[^a-zA-Z]/g,``).length>4&&e&&e.length>=2){let r=t.replace(/\d+/g,``).replace(/[xX*]/g,``).trim();n.push({name:r,sets:parseInt(e[0]),reps:e[1],weight:parseInt(e[2]||0),rest:60})}}}),n},oe=()=>{n.innerHTML=`
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
      `).join(``),document.querySelectorAll(`.remove-parsed-ex`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.getAttribute(`data-index`));p.splice(t,1),m()})}))};s.addEventListener(`click`,()=>{s.style.background=`var(--accent-color)`,s.style.color=`#000`,c.style.background=`rgba(255,255,255,0.1)`,c.style.color=`#fff`,l.style.display=`block`,u.style.display=`none`}),c.addEventListener(`click`,()=>{c.style.background=`var(--accent-color)`,c.style.color=`#000`,s.style.background=`rgba(255,255,255,0.1)`,s.style.color=`#fff`,l.style.display=`none`,u.style.display=`block`}),f.addEventListener(`click`,()=>{let e=d.value;if(!e.trim())return alert(`Incolla del testo prima!`);p=G(e),m()}),document.getElementById(`cancel-scan`).addEventListener(`click`,()=>U()),t.addEventListener(`click`,()=>e.click()),e.addEventListener(`change`,async e=>{let n=e.target.files[0];if(!n)return;let o=new FileReader;o.onload=e=>{r.innerHTML=`<img src="${e.target.result}">`},o.readAsDataURL(n),t.style.display=`none`,i.style.display=`block`,a.style.display=`none`;try{let e=await Tesseract.createWorker(`ita`,1,{logger:e=>{if(e.status===`recognizing text`){let t=Math.round(e.progress*100);document.getElementById(`ocr-progress-bar`).style.width=t+`%`,document.getElementById(`ocr-label`).innerText=`Riconoscimento: ${t}%`}}}),{data:{text:r}}=await e.recognize(n);await e.terminate(),p=G(r),i.style.display=`none`,t.style.display=`flex`,m()}catch(e){console.error(e),alert(`Errore durante la scansione. Riprova.`),i.style.display=`none`,t.style.display=`flex`}}),document.getElementById(`confirm-scan`).addEventListener(`click`,()=>{p.length!==0&&se(p)})},se=e=>{W(e.map(e=>({...e,_muscle:S(e.name),_manual:S(e.name)===`Altro`})))},K=(e,r=!1)=>{let i=u.find(t=>t.id==e),a=i.duration||50,o,s=0,c=0,l=!1;r&&p&&p.type===`circuit`&&p.routineId==e?(o=Date.now()+p.curTimeLeft*1e3,s=p.rounds,c=p.activeExerciseIdx):o=Date.now()+a*60*1e3,n.innerHTML=`
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
        ${i.exercises.map((e,t)=>{let n=C(S(e.name));return`
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
  `;let f=document.getElementById(`round-count`),h=()=>{let e=document.getElementById(`circuit-timer`);if(!e){clearInterval(_),y=null;return}let t=Math.max(0,Math.ceil((o-Date.now())/1e3));e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`,t<=0&&(clearInterval(_),y=null,e.innerText=`TEMPO SCADUTO!`,e.style.color=`var(--danger)`,l||=(L(),!0))};y=h,_&&clearInterval(_),_=setInterval(h,1e3),h(),m={interrupt:()=>{clearInterval(_),y=null,p=null,t.savePausedWorkout(null)},pause:()=>{p={type:`circuit`,routineId:e,curTimeLeft:Math.max(0,Math.ceil((o-Date.now())/1e3)),rounds:s,activeExerciseIdx:c},t.savePausedWorkout(p),clearInterval(_),y=null}},document.getElementById(`cancel-circuit`).addEventListener(`click`,()=>{Q(()=>{m.interrupt(),m=null,U()},()=>{m.pause(),m=null,Z(`dashboard`)})}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{F(),R(30)}),document.getElementById(`round-completed`).addEventListener(`click`,()=>{s++,f.innerText=s,document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.circuit-item[data-idx="0"]`).classList.add(`active`),c=0,f.style.transform=`scale(1.2)`,setTimeout(()=>f.style.transform=`scale(1)`,200)}),document.querySelectorAll(`.circuit-item`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.circuit-item`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)})}),document.getElementById(`finish-circuit`).addEventListener(`click`,()=>{clearInterval(_),y=null;let e=Math.max(0,Math.ceil((o-Date.now())/1e3)),n=`${a-Math.floor(e/60)} min`;t.saveLog({routineName:i.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:n,type:`circuit`,rounds:s,exercises:i.exercises.map(e=>({name:e.name,sets:[{reps:e.reps,weight:e.weight}]}))}),d=t.getLogs(),alert(`Ottimo lavoro! 🔥 Hai completato ${s} giri in questo circuito!`),p=null,t.savePausedWorkout(null),m=null,Z(`dashboard`)})},q=(e,r=!1)=>{let i=u.find(t=>t.id==e);if(!i)return;let a=JSON.parse(JSON.stringify(i.exercises));v=r&&p&&p.type===`standard`&&p.routineId==e?Date.now()-p.elapsedSeconds*1e3:Date.now();let o=()=>{n.innerHTML=`
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
          ${a.map((e,t)=>{let n=C(S(e.name)),i=e.hadPositiveFeedback===!0;return`
              <div class="card draggable-item" data-idx="${t}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                  <div class="card-title" style="color: var(--accent-color); display: flex; align-items: center; gap: 10px; margin: 0; width: 100%">
                    <span class="ex-icon" style="background: var(--accent-glow); width: 32px; height: 32px; font-size: 1rem">${n}</span>
                    <span style="flex: 1">${e.name}</span>
                    ${i?`<span class="badge" style="background: rgba(0, 255, 136, 0.12); color: var(--success); border: 1px solid var(--success); font-size: 0.65rem; padding: 2px 6px; text-transform: uppercase; font-weight: 800; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px">Carico Facile 👍</span>`:``}
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

                <div class="exercise-feedback" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Com'è andato l'esercizio?</div>
                  <div style="display: flex; gap: 10px">
                    <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer">👍 Bene</button>
                    <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer">👎 Fatica</button>
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
    `;let o=()=>{let e=document.getElementById(`workout-timer-display`);if(!e){clearInterval(_),y=null;return}let t=Math.floor((Date.now()-v)/1e3);e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`};y=o,_&&clearInterval(_),_=setInterval(o,1e3),m={interrupt:()=>{clearInterval(_),y=null,p=null,t.savePausedWorkout(null)},pause:()=>{let n=[];document.querySelectorAll(`#active-exercises-list .card`).forEach(e=>{let t=[];e.querySelectorAll(`.set-row`).forEach(e=>{t.push({weight:e.querySelector(`.log-weight`).value,reps:e.querySelector(`.log-reps`).value,completed:e.style.opacity===`0.5`})}),n.push({sets:t})}),p={type:`standard`,routineId:e,elapsedSeconds:Math.floor((Date.now()-v)/1e3),savedExercises:n},t.savePausedWorkout(p),clearInterval(_),y=null}},document.getElementById(`back-to-routines`).addEventListener(`click`,()=>{Q(()=>{m.interrupt(),m=null,U()},()=>{m.pause(),m=null,Z(`dashboard`)})}),document.getElementById(`rest-trigger`).addEventListener(`click`,()=>{F(),R(60)}),E(document.getElementById(`active-exercises-list`),()=>{}),document.querySelectorAll(`.check-set-btn`).forEach(e=>{e.addEventListener(`click`,t=>{F();let n=t.target.closest(`.set-row`);n.style.opacity===`0.5`?(n.style.opacity=`1`,e.style.background=`transparent`,e.style.color=`var(--accent-color)`):(n.style.opacity=`0.5`,e.style.background=`var(--accent-color)`,e.style.color=`#000`,R(a[n.getAttribute(`data-ex-idx`)].rest||60));let r=n.closest(`.card`),i=r.querySelectorAll(`.set-row`);Array.from(i).filter(e=>e.style.opacity===`0.5`).length===i.length?r.querySelector(`.exercise-feedback`).style.display=`block`:r.querySelector(`.exercise-feedback`).style.display=`none`})}),document.querySelectorAll(`.feedback-btn`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.card`);n.querySelectorAll(`.feedback-btn`).forEach(e=>e.style.opacity=`0.4`),e.style.opacity=`1`,n.setAttribute(`data-feedback`,e.classList.contains(`pos`)?`positive`:`negative`)})}),document.getElementById(`finish-workout`).addEventListener(`click`,()=>{let n=[];if(document.querySelectorAll(`#active-exercises-list .card`).forEach(e=>{let t=e.querySelector(`.card-title`)?.innerText.replace(/[^\x00-\x7F]/g,``).trim();if(!t)return;let r=[];e.querySelectorAll(`.set-row`).forEach(e=>{e.style.opacity===`0.5`&&r.push({weight:parseFloat(e.querySelector(`.log-weight`).value)||0,reps:e.querySelector(`.log-reps`).value||`0`})}),r.length>0&&n.push({name:t,sets:r,feedback:e.getAttribute(`data-feedback`)||`neutral`})}),n.length===0)return alert(`Non hai completato alcun esercizio!`);clearInterval(_),y=null;let r=document.getElementById(`workout-timer-display`).innerText;t.saveLog({routineName:i.name,date:new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`short`}),timestamp:Date.now(),duration:r,type:`standard`,exercises:n});let a=u.find(t=>t.id==e),o=[];a&&(n.forEach(e=>{let t=a.exercises.find(t=>t.name===e.name);if(t){let n=e.feedback===`positive`,r=e.feedback===`negative`;t.hadPositiveFeedback=n;let i=e.sets.map(e=>parseFloat(e.weight)||0),a=e.sets.map(e=>e.reps);if(f.progressionEnabled!==!1&&r?(t.consecutiveNegatives=(t.consecutiveNegatives||0)+1,t.consecutiveNegatives>=3&&o.push(t)):t.consecutiveNegatives=0,f.progressionEnabled===!1){Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}let{type:s,step:c,repsThresh:l,mode:u}=de(t,f);if(u===`reps-only`){if(Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),n)if(Array.isArray(t.reps))t.reps=a.map(e=>String(Math.min(15,(parseInt(e)||0)+1)));else{let e=parseInt(a[0])||0;t.reps=String(Math.min(15,e+1))}else Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}if(u===`weight-only`){n?Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c:Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||`10`;return}let d=ue(t.repsRange);if(d){let e=!0;a.forEach(t=>{parseInt(t)<d.max&&(e=!1)}),n&&e?(Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c,Array.isArray(t.reps)?t.reps=Array(t.sets||a.length).fill(String(d.min)):t.reps=String(d.min)):(Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps)?t.reps=a:t.reps=a[0]||String(d.min))}else{let e=!1;if(n&&a.forEach(t=>{parseInt(t)<l&&(e=!0)}),n&&!e?Array.isArray(t.weight)||s!==`all`?t.weight=i.map((e,t)=>{let n=!1;return s===`all`?n=!0:s===`last`?n=t===i.length-1:s===`first`?n=t===0:s===`alternate`&&(n=t%2==0),e+(n?c:0)}):t.weight=Math.max(...i)+c:Array.isArray(t.weight)?t.weight=i:t.weight=Math.max(...i),Array.isArray(t.reps))t.reps=a.map(t=>n&&e&&(parseInt(t)||0)<l?String(l):t);else{let r=parseInt(a[0])||0;n&&e&&r<l?t.reps=String(l):t.reps=a[0]||`10`}}}}),t.saveRoutines(u)),d=t.getLogs(),p=null,t.savePausedWorkout(null),m=null,o.length>0?$(`🧠 Scarico Consigliato`,`Abbiamo notato che hai accumulato molta fatica su: <strong>${o.map(e=>e.name).join(`, `)}</strong> negli ultimi 3 allenamenti.<br><br>Ti consigliamo una sessione di <strong>scarico attivo (-10% peso)</strong> per permettere il recupero e superare lo stallo. Vuoi applicarla?`,()=>{o.forEach(e=>{Array.isArray(e.weight)?e.weight=e.weight.map(e=>Math.round(e*.9*2)/2):e.weight=Math.round(e.weight*.9*2)/2,e.consecutiveNegatives=0}),t.saveRoutines(u),alert(`Scarico applicato con successo! La prossima sessione sarà più leggera per favorire il recupero. 🏋️‍♂️`),Z(`dashboard`)},()=>{Z(`dashboard`)}):(alert(`Allenamento salvato con successo! 🎉`),Z(`dashboard`))})},s=()=>{let e=document.getElementById(`workout-timer-display`);if(!e){clearInterval(_),y=null;return}let t=Math.floor((Date.now()-v)/1e3);e.innerText=`${Math.floor(t/60).toString().padStart(2,`0`)}:${(t%60).toString().padStart(2,`0`)}`};y=s,_&&clearInterval(_),_=setInterval(s,1e3),o()},J=()=>{n.innerHTML=`
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
          <div class="card-subtitle">Clicca su un muscolo per visualizzare i dettagli del recupero.</div>
          
          <div class="muscle-map-container">
            <!-- FRONTE (Front Body SVG) -->
            <svg class="muscle-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Silhouette Capo (Front) -->
              <path d="M50,15 C45,15 42,20 42,25 C42,30 45,35 50,35 C55,35 58,30 58,25 C58,20 55,15 50,15 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
              <rect x="47" y="35" width="6" height="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              
              <!-- SPALLE Front -->
              <path class="muscle-shape" data-muscle="Spalle" d="M30,46 C28,48 26,52 27,58 C28,62 31,64 34,60 C36,57 37,50 35,46 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Spalle" d="M70,46 C72,48 74,52 73,58 C72,62 69,64 66,60 C64,57 63,50 65,46 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- PETTO -->
              <path class="muscle-shape" data-muscle="Petto" d="M36,46 L50,46 L50,65 L36,65 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Petto" d="M64,46 L50,46 L50,65 L64,65 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- ADDOME -->
              <rect class="muscle-shape" data-muscle="Addome" x="38" y="67" width="24" height="34" rx="2" fill="rgba(255,255,255,0.05)" />
              
              <!-- BICIPITI -->
              <path class="muscle-shape" data-muscle="Bicipiti" d="M25,58 L31,58 L29,82 L23,82 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Bicipiti" d="M75,58 L69,58 L71,82 L77,82 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- AVAMBRACCI (Altro) -->
              <path class="muscle-shape" data-muscle="Altro" d="M23,84 L28,84 L26,110 L22,110 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Altro" d="M77,84 L72,84 L74,110 L78,110 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- GAMBE Front (Quadricipiti) -->
              <path class="muscle-shape" data-muscle="Gambe" d="M36,104 L49,104 L46,146 L33,146 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Gambe" d="M64,104 L51,104 L54,146 L67,146 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- POLPACCI Front (Gambe) -->
              <path class="muscle-shape" data-muscle="Gambe" d="M33,149 L42,149 L40,188 L34,188 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Gambe" d="M67,149 L58,149 L60,188 L66,188 Z" fill="rgba(255,255,255,0.05)" />
              
              <text x="50" y="195" fill="var(--text-secondary)" font-size="8" font-weight="700" text-anchor="middle">FRONTE</text>
            </svg>
            
            <!-- RETRO (Back Body SVG) -->
            <svg class="muscle-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Silhouette Capo (Back) -->
              <path d="M50,15 C45,15 42,20 42,25 C42,30 45,35 50,35 C55,35 58,30 58,25 C58,20 55,15 50,15 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
              <rect x="47" y="35" width="6" height="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              
              <!-- SPALLE Back -->
              <path class="muscle-shape" data-muscle="Spalle" d="M30,46 C28,48 26,52 27,58 C28,62 31,64 34,60 C36,57 37,50 35,46 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Spalle" d="M70,46 C72,48 74,52 73,58 C72,62 69,64 66,60 C64,57 63,50 65,46 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- DORSO -->
              <path class="muscle-shape" data-muscle="Dorso" d="M35,46 L50,46 L50,76 L34,68 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Dorso" d="M65,46 L50,46 L50,76 L66,68 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Dorso" d="M36,70 L50,78 L50,96 L38,96 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Dorso" d="M64,70 L50,78 L50,96 L62,96 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- TRICIPITI -->
              <path class="muscle-shape" data-muscle="Tricipiti" d="M24,58 L30,58 L28,82 L22,82 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Tricipiti" d="M76,58 L70,58 L72,82 L78,82 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- GLUTEI (Gambe) -->
              <path class="muscle-shape" data-muscle="Gambe" d="M36,98 H64 V112 H36 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- GAMBE Back (Femorali) -->
              <path class="muscle-shape" data-muscle="Gambe" d="M36,114 L49,114 L46,146 L33,146 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Gambe" d="M64,114 L51,114 L54,146 L67,146 Z" fill="rgba(255,255,255,0.05)" />
              
              <!-- POLPACCI Back (Gambe) -->
              <path class="muscle-shape" data-muscle="Gambe" d="M33,149 L42,149 L40,188 L34,188 Z" fill="rgba(255,255,255,0.05)" />
              <path class="muscle-shape" data-muscle="Gambe" d="M67,149 L58,149 L60,188 L66,188 Z" fill="rgba(255,255,255,0.05)" />
              
              <text x="50" y="195" fill="var(--text-secondary)" font-size="8" font-weight="700" text-anchor="middle">RETRO</text>
            </svg>
          </div>
          
          <!-- Pannello Dettagli Muscolo -->
          <div id="muscle-detail-panel" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-top: 10px; min-height: 80px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span style="font-size: 1.5rem; margin-bottom: 5px">🔬</span>
            <div class="card-subtitle">Seleziona un muscolo per analizzarne lo stato di freschezza muscolare e recupero.</div>
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
    `,r();let e=fe();document.querySelectorAll(`.muscle-shape`).forEach(t=>{let n=e[t.getAttribute(`data-muscle`)];n&&(n.status===`sore`?t.classList.add(`muscle-pulse-red`):t.style.fill=n.color)}),document.querySelectorAll(`.muscle-shape`).forEach(t=>{t.addEventListener(`click`,t=>{let n=t.currentTarget.getAttribute(`data-muscle`),r=e[n];if(!r)return;document.querySelectorAll(`.muscle-shape`).forEach(e=>{e.classList.toggle(`selected`,e.getAttribute(`data-muscle`)===n)});let i=document.getElementById(`muscle-detail-panel`);if(i){let e={Petto:48,Dorso:48,Gambe:72,Spalle:48,Bicipiti:36,Tricipiti:36,Addome:24,Altro:24},t=``;t=r.percent>=86?`Il muscolo è fresco e pronto per essere allenato ad alta intensità! 🦾`:r.percent>=50?`Il muscolo è in fase di recupero. Mancano circa <strong>${r.hoursLeft} ore</strong> al recupero totale. Puoi allenarlo con carichi moderati o focalizzarti su altri distretti.`:`<strong>Riposo consigliato!</strong> Il muscolo è congestionato. Mancano circa <strong>${r.hoursLeft} ore</strong> per ripristinare le fibre muscolari.`;let a=C(n);i.style.textAlign=`left`,i.style.alignItems=`flex-start`,i.innerHTML=`
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
          `}})}),document.getElementById(`show-changelog`).addEventListener(`click`,()=>ce()),document.getElementById(`open-settings`).addEventListener(`click`,()=>m());let t=document.getElementById(`exercise-select`);if(t){let e=c();if(e.length>0){let n=e[Math.floor(Math.random()*e.length)];t.value=n,l(n)}t.addEventListener(`change`,e=>{l(e.target.value)})}u()},r=()=>{let e=document.getElementById(`calendar-mount`);if(!e)return;let t=new Date,n=t.getFullYear(),r=t.getMonth(),i=new Date(n,r,1).getDay(),a=new Date(n,r+1,0).getDate(),o=new Set(d.map(e=>{if(!e.timestamp)return null;let t=new Date(e.timestamp);return`${t.getFullYear()}-${(t.getMonth()+1).toString().padStart(2,`0`)}-${t.getDate().toString().padStart(2,`0`)}`}).filter(e=>e)),s=`
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
                  <option value="1" ${f.progressionStep===1?`selected`:``}>+1 kg</option>
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
    `,document.getElementById(`close-settings`).addEventListener(`click`,()=>e()),document.getElementById(`edit-profile-btn`).addEventListener(`click`,()=>p()),document.getElementById(`unit-kg`).addEventListener(`click`,()=>{f.unit=`kg`,t.saveUser(f),m()}),document.getElementById(`unit-lbs`).addEventListener(`click`,()=>{f.unit=`lbs`,t.saveUser(f),m()}),document.getElementById(`alarm-toggle`).addEventListener(`change`,e=>{t.saveAlarmEnabled(e.target.checked),m()}),document.querySelectorAll(`.alarm-sound-option`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.target.closest(`.preview-sound-btn`))return;let r=e.getAttribute(`data-sound`);t.saveAlarmSound(r),P(),m()})}),document.querySelectorAll(`.preview-sound-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),I(e.getAttribute(`data-sound`))})}),document.querySelectorAll(`.alarm-duration-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=parseInt(e.getAttribute(`data-duration`));t.saveAlarmDuration(n),m()})}),document.querySelectorAll(`.theme-circle`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.target.getAttribute(`data-theme`);t.saveTheme(n),i(n),m()})});let r=()=>{let e=document.getElementById(`settings-progression-visual-preview`);if(!e)return;if(f.progressionEnabled===!1){e.innerHTML=`
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
              <div style="font-size: 0.62rem; color: var(--accent-color); font-weight: 800; text-align: center; margin-bottom: 8px">💪 GRANDI (Petto, Gambe)</div>
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
          `}i+=`</div>`}e.innerHTML=i};r(),document.getElementById(`progression-toggle`).addEventListener(`change`,e=>{f.progressionEnabled=e.target.checked,t.saveUser(f);let n=document.getElementById(`progression-settings-panel`);n&&(n.style.opacity=e.target.checked?`1`:`0.4`,n.style.pointerEvents=e.target.checked?`auto`:`none`),r();let i=e.target.nextElementSibling,a=i?i.nextElementSibling:null;i&&a&&(i.style.background=e.target.checked?`var(--accent-color)`:`rgba(255,255,255,0.15)`,a.style.left=e.target.checked?`25px`:`3px`,a.style.background=e.target.checked?`#000`:`#888`)}),document.getElementById(`setting-progression-mode`).addEventListener(`change`,e=>{f.progressionMode=e.target.value,t.saveUser(f);let n=document.getElementById(`setting-reps-threshold`);n&&(n.disabled=e.target.value===`reps-only`),r()}),document.getElementById(`setting-progression-type`).addEventListener(`change`,e=>{f.progressionType=e.target.value,t.saveUser(f),r()}),document.getElementById(`setting-progression-step`).addEventListener(`change`,e=>{f.progressionStep=e.target.value===`auto`?`auto`:parseFloat(e.target.value)||1,t.saveUser(f),r()}),document.getElementById(`setting-reps-threshold`).addEventListener(`change`,e=>{f.repsThreshold=parseInt(e.target.value)||8,t.saveUser(f)}),document.querySelectorAll(`.info-help-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-type`),r=``,i=``;n===`strategy`?(r=`Strategia di Incremento`,i=`<strong>Strategia di Incremento Carichi</strong><br><br>Determina come l'app distribuisce l'aumento di peso tra le varie serie di un esercizio dopo un feedback positivo:<br><br>• <strong>Tutte le serie:</strong> Il peso aumenta in ogni serie (es. da 50kg in tutte a 51kg in tutte).<br>• <strong>Solo l'ultima serie:</strong> Incrementa solo l'ultimo set per testare il nuovo carico in sicurezza (es. 50, 50, 50, 51kg).<br>• <strong>Solo la prima serie:</strong> Aumenta solo il primo set quando sei più fresco (es. 51, 50, 50, 50kg).<br>• <strong>Alternate:</strong> Incrementa a set alternati (es. 1° e 3° set).`):n===`step`?(r=`Passo di Incremento`,i=`<strong>Valore di Incremento Carichi</strong><br><br>Scegli l'unità di peso da aggiungere quando progredisci:<br><br>• <strong>🤖 Auto (in base al muscolo):</strong> Il sistema intelligente assegna:<br>&nbsp;&nbsp;- <strong>+2.5 kg</strong> a muscoli grandi (Petto, Dorso, Gambe)<br>&nbsp;&nbsp;- <strong>+1 kg</strong> a muscoli piccoli (Spalle, Bicipiti, Tricipiti, Addome, Altro)<br>• <strong>Fissi (+1, +2, +2.5, +5 kg):</strong> Applica sempre lo stesso incremento fisso indipendentemente dall'esercizio.`):n===`thresh`?(r=`Soglia Reps Minime`,i=`<strong>Soglia Ripetizioni Minime</strong><br><br>Se dai feedback positivo ma le ripetizioni eseguite in qualche set sono inferiori a questa soglia, l'app darà la priorità all'aumento delle ripetizioni portandole al valore soglia, rimandando l'aumento di peso alla sessione successiva.<br><br>Se usi una <strong>Doppia Progressione Range</strong> (es. 8-12 reps), questa soglia globale viene ignorata a favore del limite massimo del range dell'esercizio.`):n===`mode`&&(r=`Logica di Progressione`,i=`<strong>Modalità del Sistema di Sovraccarico</strong><br><br>Scegli come deve agire l'app quando riceve un feedback positivo:<br><br>• <strong>Mista (Reps → Peso):</strong> Progressioni classiche. Prima aumenta le ripetizioni fino alla soglia o limite del range, poi incrementa il peso.<br>• <strong>Solo Peso:</strong> Aumenta direttamente il peso del passo prescelto ad ogni feedback positivo, lasciando le ripetizioni invariate.<br>• <strong>Solo Reps:</strong> Mantiene fisso il peso e aumenta solo le ripetizioni di +1 ad ogni sessione positiva (fino a max 15 reps). Ideale per esercizi a corpo libero o calistenici.`),le(r,i)})}),document.getElementById(`export-btn-settings`).addEventListener(`click`,a),document.getElementById(`import-input-settings`).addEventListener(`change`,e=>{e.target.files.length>0&&o(e.target.files[0])})};e()},ce=()=>{n.innerHTML=`
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
  `,document.getElementById(`close-changelog`).addEventListener(`click`,()=>X())},Z=e=>{if(l=e,r.forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`data-view`)===e)}),!z()&&!sessionStorage.getItem(`guide-skipped`)&&e===`dashboard`&&!f){sessionStorage.setItem(`guide-skipped`,`true`),B();return}if(!f&&e!==`onboarding`){V();return}switch(e){case`dashboard`:H();break;case`routines`:U();break;case`history`:J();break;case`progress`:X();break}};r.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`data-view`);n!==l&&(m?Q(()=>{m.interrupt(),m=null,Z(n)},()=>{m.pause(),m=null,Z(n)}):Z(n))})});var Q=(e,t)=>{let n=document.createElement(`div`);n.style=`
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
  `,document.body.appendChild(i),document.getElementById(`modal-confirm-btn`).addEventListener(`click`,()=>{i.remove(),n&&n()}),document.getElementById(`modal-cancel-btn`).addEventListener(`click`,()=>{i.remove(),r&&r()})},le=(e,t)=>{let n=document.createElement(`div`);n.style=`
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
  `,document.body.appendChild(n),document.getElementById(`modal-close-btn`).addEventListener(`click`,()=>{n.remove()})},ue=e=>{if(typeof e==`string`&&e.includes(`-`)){let t=e.split(`-`).map(e=>parseInt(e.trim()));if(t.length===2&&!isNaN(t[0])&&!isNaN(t[1]))return{min:t[0],max:t[1]}}return null},de=(e,t)=>{let n=e.progressionType&&e.progressionType!==`inherit`?e.progressionType:t.progressionType||`all`,r=e.repsThreshold&&e.repsThreshold!==`inherit`?parseInt(e.repsThreshold):parseInt(t.repsThreshold)||8,i=e.progressionMode&&e.progressionMode!==`inherit`?e.progressionMode:t.progressionMode||`mixed`,a=1,o=e.progressionStep&&e.progressionStep!==`inherit`?e.progressionStep:t.progressionStep||`auto`;if(o===`auto`){let t=S(e.name);a=t===`Petto`||t===`Dorso`||t===`Gambe`?2.5:1}else a=parseFloat(o)||1;return{type:n,step:a,repsThresh:r,mode:i}},fe=()=>{let e=t.getLogs(),n=Date.now(),r={Petto:0,Dorso:0,Gambe:0,Spalle:0,Bicipiti:0,Tricipiti:0,Addome:0,Altro:0};e.forEach(e=>{e.exercises&&e.timestamp&&e.exercises.forEach(t=>{let n=S(t.name);n&&r[n]===0&&(r[n]=e.timestamp)})});let i={Petto:48,Dorso:48,Gambe:72,Spalle:48,Bicipiti:36,Tricipiti:36,Addome:24,Altro:24},a={};for(let e of Object.keys(i)){let t=r[e],o=i[e]*3600*1e3;if(t===0)a[e]={percent:100,hoursLeft:0,lastTrainedStr:`Mai allenato`,status:`fresh`,color:`#00ff88`};else{let r=n-t;if(r>=o)a[e]={percent:100,hoursLeft:0,lastTrainedStr:new Date(t).toLocaleDateString(`it-IT`)+` `+new Date(t).toLocaleTimeString(`it-IT`,{hour:`2-digit`,minute:`2-digit`}),status:`fresh`,color:`#00ff88`};else{let n=Math.floor(r/o*100),i=Math.ceil((o-r)/(3600*1e3)),s=new Date(t).toLocaleDateString(`it-IT`)+` `+new Date(t).toLocaleTimeString(`it-IT`,{hour:`2-digit`,minute:`2-digit`}),c=`recovering`,l=`#ffb300`;n<50?(c=`sore`,l=`#ff4d4d`):n>=86&&(c=`fresh`,l=`#00ff88`),a[e]={percent:n,hoursLeft:i,lastTrainedStr:s,status:c,color:l}}}}return a};Z(`dashboard`),document.addEventListener(`click`,F,{passive:!0}),document.addEventListener(`touchstart`,F,{passive:!0}),[`visibilitychange`,`pageshow`,`focus`].forEach(e=>{window.addEventListener(e,()=>{document.visibilityState===`visible`&&typeof y==`function`&&y()})});