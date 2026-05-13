import { storage } from './storage.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW Registered!', reg);
    }).catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

const app = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');

const APP_VERSION = "v1.7.0";

const changelogData = [
  {
    version: "v1.7.0",
    title: "Circuiti & Visione",
    changes: ["Gestione Circuiti AMRAP con timer e round", "Rilevamento automatico schede cartacee (OCR)", "Correzione refusi motivazionali"]
  },
  {
    version: "v1.6.0",
    title: "Controllo Totale",
    changes: ["Timer di recupero personalizzabile per esercizio", "Anteprima scheda prima di iniziare", "Impostazione carichi iniziali nella creazione", "Inserimento manuale esercizi migliorato"]
  },
  {
    version: "v1.5.0",
    title: "Update Professionale",
    changes: ["Database esercizi con menu a tendina", "Auto-valutazione serie (👍/👎) e aumento carichi intelligente", "Dettaglio storico allenamenti cliccabile"]
  },
  {
    version: "v1.4.0",
    title: "Guida Intelligente",
    changes: ["Guida all'installazione per nuovi utenti", "Rilevamento automatico modalità standalone"]
  },
  {
    version: "v1.3.0",
    title: "Sessioni & Timer",
    changes: ["Timer durata totale allenamento", "Dettaglio durata nella cronologia", "Migliorato sistema di aggiornamento"]
  },
  {
    version: "v1.2.0",
    title: "Training Flow",
    changes: ["Spunta serie completate", "Avvio automatico timer di riposo al check", "Allarme sonoro al termine del recupero"]
  },
  {
    version: "v1.1.0",
    title: "Personalizzazione",
    changes: ["Profilo utente completo (Età, Peso, Altezza)", "Soprannome personalizzato", "Frasi motivazionali dinamiche (Gymbo/Guerriera)"]
  },
  {
    version: "v1.0.0",
    title: "Lancio IronTrack",
    changes: ["Gestione schede allenamento", "Tracking pesi e ripetizioni", "Dark Mode & Premium Design"]
  }
];

let currentView = 'dashboard';
let routines = storage.getRoutines();
let logs = storage.getLogs();
let user = storage.getUser();

// State per il timer di riposo e allenamento
let restTimerInterval = null;
let audioContext = null;
let workoutTimerInterval = null;
let workoutStartTime = null;

// Initial data if empty
if (routines.length === 0) {
  routines = [
    {
      id: 1,
      name: 'Push Day (Spinta)',
      exercises: [
        { name: 'Panca Piana', sets: 4, reps: '8-10', weight: 60 },
        { name: 'Military Press', sets: 3, reps: '10-12', weight: 30 },
        { name: 'Dips', sets: 3, reps: 'cedimento', weight: 0 }
      ]
    },
    {
      id: 2,
      name: 'Pull Day (Trazione)',
      exercises: [
        { name: 'Trazioni', sets: 4, reps: '8', weight: 0, rest: 90 },
        { name: 'Rematore', sets: 3, reps: '10-12', weight: 50, rest: 60 },
        { name: 'Curl Bilanciere', sets: 3, reps: '12', weight: 20, rest: 60 }
      ]
    },
    {
      id: 3,
      name: 'Circuito Full Body 🔥',
      type: 'circuit',
      duration: 50,
      exercises: [
        { name: 'Piegamenti sulle braccia', sets: 1, reps: '10', weight: 0 },
        { name: 'Jump squat verticale', sets: 1, reps: '10', weight: 0 },
        { name: 'Russian twist con kettlebell', sets: 1, reps: '10xlato', weight: 10 },
        { name: 'Corsa', sets: 1, reps: '2 min', weight: 0 },
        { name: 'Rematore / Australian Pull-up', sets: 1, reps: '10', weight: 0 },
        { name: 'Step up su panca', sets: 1, reps: '10xlato', weight: 0 },
        { name: 'Plank tocco spalla', sets: 1, reps: '10xlato', weight: 0 },
        { name: 'Cyclette 80-90rpm', sets: 1, reps: '2 min', weight: 0 },
        { name: 'Arnold press manubri', sets: 1, reps: '10', weight: 10 },
        { name: 'Dips su panca', sets: 1, reps: '10', weight: 0 },
        { name: 'Leg raises sdraiato', sets: 1, reps: '10', weight: 0 },
        { name: 'Cyclette con ventilatore', sets: 1, reps: '2 min', weight: 0 }
      ]
    }
  ];
  storage.saveRoutines(routines);
}

const EXERCISE_DB = {
  "Petto": ["Panca Piana Bilanciere", "Panca Inclinata Manubri", "Panca Piana", "Croci ai Cavi", "Dips", "Chest Press", "Pectoral Machine", "Push Up"],
  "Dorso": ["Trazioni alla Sbarra", "Trazioni", "Lat Machine", "Rematore Bilanciere", "Rematore Manubrio", "Pulley", "Pull-down braccia tese"],
  "Gambe": ["Squat Bilanciere", "Squat", "Leg Press", "Affondi", "Leg Extension", "Leg Curl", "Stacchi Romeni", "Stacco", "Calf Raises"],
  "Spalle": ["Military Press", "Alzate Laterali", "Lento Avanti Manubri", "Alzate Frontali", "Face Pull", "Shoulder Press"],
  "Bicipiti": ["Curl Bilanciere", "Curl Manubri", "Hammer Curl", "Curl panca Scott", "Spider Curl"],
  "Tricipiti": ["Pushdown Tricipiti", "French Press", "Estensioni dietro nuca", "Kickback", "Dips su panca"],
  "Addome": ["Crunch", "Plank", "Leg Raises", "Ab Roller", "Russian Twist", "Sit-up"],
  "Altro": []
};

const getMuscleGroup = (exerciseName) => {
  if (!exerciseName) return "";
  for (const [muscle, exercises] of Object.entries(EXERCISE_DB)) {
    if (exercises.includes(exerciseName)) return muscle;
  }
  return "Altro";
};

const phrases = {
  male: [
    "Pronto per spingere, {name}? ⚡️",
    "Si parte Gymbro {name}! 💪",
    "Oggi si alza ghisa, {name}! 🏋️‍♂️",
    "Carica quel bilanciere, {name}!",
    "Oggi distruggiamo tutto, {name}! 🔥"
  ],
  female: [
    "Pronta per splendere, {name}? ✨",
    "Si parte Guerriera {name}! 🛡️",
    "Oggi si modella il fisico, {name}! 🎀",
    "Forza e grazia {name}, andiamo a vincere!",
    "Brilla più del sudore, {name}! 💎"
  ]
};

const getMotivationalPhrase = () => {
  if (!user) return "Pronto per l'allenamento?";
  const list = phrases[user.gender] || phrases.male;
  const phrase = list[Math.floor(Math.random() * list.length)];
  return phrase.replace('{name}', user.nickname || user.name || '');
};

// Funzione per suonare l'allarme (beep pulsante)
const playAlarm = () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  let isPlaying = true;
  
  const playBeep = () => {
    if (!isPlaying) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
    
    setTimeout(playBeep, 800);
  };

  playBeep();
  
  return () => {
    isPlaying = false;
  };
};

const showRestTimer = (seconds) => {
  // Rimuovi timer esistente se presente
  const existing = document.getElementById('rest-timer-overlay');
  if (existing) existing.remove();
  if (restTimerInterval) clearInterval(restTimerInterval);

  const overlay = document.createElement('div');
  overlay.id = 'rest-timer-overlay';
  overlay.style = `
    position: fixed; bottom: 100px; left: 16px; right: 16px;
    background: var(--card-bg); border: 2px solid var(--accent-color);
    border-radius: 20px; padding: 20px; z-index: 2000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center;
    animation: slideUp 0.3s ease-out;
  `;

  let timeLeft = seconds;
  let stopAlarm = null;

  overlay.innerHTML = `
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${timeLeft}s</div>
    <button id="stop-timer" class="btn" style="margin-top: 15px; background: var(--danger); height: 45px; padding: 0 30px">Annulla</button>
  `;

  document.body.appendChild(overlay);

  const updateTimer = () => {
    timeLeft--;
    const display = document.getElementById('timer-display');
    if (display) display.innerText = timeLeft + 's';

    if (timeLeft <= 0) {
      clearInterval(restTimerInterval);
      if (display) {
        display.innerText = "FINE! 🔥";
        display.style.animation = "pulse 0.5s infinite";
      }
      stopAlarm = playAlarm();
      const stopBtn = document.getElementById('stop-timer');
      if (stopBtn) {
        stopBtn.innerText = "STOP ALLARME";
        stopBtn.style.background = "var(--accent-color)";
        stopBtn.style.color = "#000";
      }
    }
  };

  restTimerInterval = setInterval(updateTimer, 1000);

  document.getElementById('stop-timer').addEventListener('click', () => {
    if (stopAlarm) stopAlarm();
    clearInterval(restTimerInterval);
    overlay.remove();
  });
};

const isStandalone = () => {
  return (window.navigator.standalone) || (window.matchMedia('(display-mode: standalone)').matches);
};

const renderInstallGuide = () => {
  app.innerHTML = `
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
  `;

  document.getElementById('skip-guide').addEventListener('click', () => {
    if (!user) renderOnboarding();
    else renderDashboard();
  });
};

const renderOnboarding = (step = 1, tempUser = {}) => {
  if (step === 1) {
    app.innerHTML = `
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
    `;

    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        renderOnboarding(2, { gender: btn.getAttribute('data-gender') });
      });
    });
  } else {
    app.innerHTML = `
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
    `;

    document.getElementById('back-step').addEventListener('click', () => renderOnboarding(1));
    document.getElementById('finish-onboarding').addEventListener('click', () => {
      const data = {
        ...tempUser,
        name: document.getElementById('ob-name').value,
        surname: document.getElementById('ob-surname').value,
        nickname: document.getElementById('ob-nickname').value,
        age: document.getElementById('ob-age').value,
        weight: document.getElementById('ob-weight').value,
        height: document.getElementById('ob-height').value
      };

      if (!data.name || !data.nickname) return alert('Inserisci almeno il nome e il soprannome!');
      
      user = data;
      storage.saveUser(user);
      switchView('dashboard');
    });
  }
};

const renderDashboard = () => {
  if (!user) {
    renderOnboarding();
    return;
  }

  const lastWorkout = logs[0] || { routineName: 'Nessun allenamento', date: '-' };
  const totalWorkouts = logs.length;
  const greeting = user.gender === 'male' ? 'Bentornato, Gymbro' : 'Bentornata, Guerriera';
  
  app.innerHTML = `
    <div class="view">
      <div class="card">
        <div class="card-subtitle">${greeting}</div>
        <div class="card-title" style="font-size: 1.5rem">${getMotivationalPhrase()}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Allenamenti Totali</div>
          <div class="stat-value">${totalWorkouts}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Peso Attuale</div>
          <div class="stat-value">${user.weight || '--'} kg</div>
        </div>
      </div>

      <div class="card">
        <div class="card-subtitle">Ultima sessione</div>
        <div class="card-title">${lastWorkout.routineName}</div>
        <div class="card-subtitle">${lastWorkout.date}</div>
      </div>

      <div style="padding: 0 16px">
        <button class="btn" id="start-quick">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M5 3l14 9-14 9V3z"/>
          </svg>
          Inizia Allenamento
        </button>
      <div style="padding: 0 16px; margin-top: 20px; text-align: center; color: var(--text-secondary); font-size: 0.8rem">
        Versione App: ${APP_VERSION}
      </div>
    </div>
  `;

  document.getElementById('start-quick').addEventListener('click', () => {
    switchView('routines');
  });
};

const renderRoutines = () => {
  app.innerHTML = `
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000">📷 Scansiona</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${routines.map(r => `
          <div class="card routine-card" data-id="${r.id}" style="position: relative">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
              <div>
                <div class="card-title">${r.name}</div>
                <div class="card-subtitle">${r.type === 'circuit' ? '🔄 Circuito' : '💪 Standard'} • ${r.exercises.length} esercizi</div>
              </div>
            </div>
            <div style="position: absolute; right: 16px; top: 20px; display: flex; gap: 12px">
              <button class="edit-routine-btn" data-id="${r.id}" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="delete-routine-btn" data-id="${r.id}" style="background: none; border: none; color: var(--danger); cursor: pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('add-routine-btn').addEventListener('click', () => {
    renderAddRoutine();
  });

  document.getElementById('scan-routine-btn').addEventListener('click', () => {
    renderScanRoutine();
  });

  document.querySelectorAll('.routine-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; 
      const id = card.getAttribute('data-id');
      renderWorkoutPreview(id);
    });
  });

  document.querySelectorAll('.edit-routine-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderEditRoutine(btn.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.delete-routine-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Sei sicuro di voler eliminare questa scheda?')) {
        const id = parseInt(btn.getAttribute('data-id'));
        routines = routines.filter(r => r.id !== id);
        storage.saveRoutines(routines);
        renderRoutines();
      }
    });
  });
};

const renderEditRoutine = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  let editExercises = routine.exercises.map(ex => ({
    ...ex,
    _muscle: getMuscleGroup(ex.name),
    _manual: false
  }));

  const renderForm = () => {
    app.innerHTML = `
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px">
          <button id="cancel-edit-routine" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Scheda</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Dettagli Scheda</div>
          <input type="text" id="edit-routine-name" value="${routine.name}" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div class="card-subtitle">Tipo</div>
              <select id="edit-routine-type">
                <option value="standard" ${routine.type !== 'circuit' ? 'selected' : ''}>Standard 💪</option>
                <option value="circuit" ${routine.type === 'circuit' ? 'selected' : ''}>Circuito 🔄</option>
              </select>
            </div>
            <div id="edit-duration-container" style="display: ${routine.type === 'circuit' ? 'block' : 'none'}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="edit-routine-duration" value="${routine.duration || 50}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${editExercises.map((ex, i) => `
            <div class="card exercise-form-card" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${i + 1}</span>
                <div style="display: flex; gap: 10px">
                  <button class="toggle-manual-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${ex._manual ? 'Usa Lista' : 'Scrivi a mano'}</button>
                  <button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${ex._manual || ex._muscle === 'Altro'
                  ? `<input type="text" class="ex-name" data-index="${i}" placeholder="Nome (es. Corsa)" value="${ex.name}" style="margin: 0">` 
                  : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${i}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(EXERCISE_DB).map(m => `<option value="${m}" ${ex._muscle === m ? 'selected' : ''}>${m}</option>`).join('')}
                      </select>
                      <select class="ex-name" data-index="${i}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(EXERCISE_DB[ex._muscle] || []).map(e => `<option value="${e}" ${e === ex.name ? 'selected' : ''}>${e}</option>`).join('')}
                      </select>
                    </div>
                  `
                }
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${ex.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${ex.reps}">
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiWeight ? 'Usa carico unico' : 'Carichi diversi per serie?'}</button>
                </div>
                
                ${ex._multiWeight 
                  ? `<div class="multi-weight-grid">
                      ${Array.from({ length: ex.sets }).map((_, si) => `
                        <input type="number" class="ex-weight-set-edit" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.weight) ? (ex.weight[si] || 0) : ex.weight}" placeholder="S${si+1}">
                      `).join('')}
                     </div>`
                  : `<input type="number" class="ex-weight-edit" value="${Array.isArray(ex.weight) ? ex.weight[0] : ex.weight}">`
                }
              </div>

              <div>
                <div class="card-subtitle">Riposo (sec)</div>
                <input type="number" class="ex-rest" value="${ex.rest || 60}">
              </div>
            </div>
          `).join('')}
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
    `;

    document.getElementById('cancel-edit-routine').addEventListener('click', () => renderRoutines());
    
    const typeSelect = document.getElementById('edit-routine-type');
    const durationContainer = document.getElementById('edit-duration-container');
    
    typeSelect.addEventListener('change', () => {
      durationContainer.style.display = typeSelect.value === 'circuit' ? 'block' : 'none';
    });

    document.querySelectorAll('.ex-muscle').forEach(sel => {
      sel.addEventListener('change', (e) => {
        syncExercises();
        const idx = parseInt(e.target.getAttribute('data-index'));
        editExercises[idx].name = ''; 
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-manual-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        editExercises[idx]._manual = !editExercises[idx]._manual;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-weight-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        editExercises[idx]._multiWeight = !editExercises[idx]._multiWeight;
        renderForm();
      });
    });

    document.getElementById('add-ex-row-edit').addEventListener('click', () => {
      syncExercises();
      editExercises.push({ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false });
      renderForm();
    });

    document.querySelectorAll('.remove-ex').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        editExercises.splice(idx, 1);
        renderForm();
      });
    });

    document.getElementById('save-edited-routine').addEventListener('click', () => {
      syncExercises();
      const name = document.getElementById('edit-routine-name').value;
      const type = document.getElementById('edit-routine-type').value;
      const duration = parseInt(document.getElementById('edit-routine-duration').value) || 50;
      if (!name) return alert('Inserisci un nome per la scheda');
      
      const updatedRoutine = {
        id: routine.id,
        name,
        type,
        duration: type === 'circuit' ? duration : null,
        exercises: editExercises.filter(ex => ex.name.trim() !== '').map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          rest: ex.rest || 60
        }))
      };

      if (updatedRoutine.exercises.length === 0) return alert('Aggiungi e compila almeno un esercizio');

      const idx = routines.findIndex(r => r.id == routine.id);
      routines[idx] = updatedRoutine;
      storage.saveRoutines(routines);
      renderRoutines();
    });
  };

  const syncExercises = () => {
    document.querySelectorAll('.exercise-form-card').forEach((card, i) => {
      const muscleEl = card.querySelector('.ex-muscle');
      const nameEl = card.querySelector('.ex-name');
      editExercises[i]._muscle = muscleEl ? muscleEl.value : (editExercises[i]._muscle || '');
      editExercises[i].name = nameEl ? nameEl.value : '';
      editExercises[i].sets = parseInt(card.querySelector('.ex-sets').value) || 3;
      editExercises[i].reps = card.querySelector('.ex-reps').value || '10';
      editExercises[i].rest = parseInt(card.querySelector('.ex-rest').value) || 60;

      const multiWeightInputs = card.querySelectorAll('.ex-weight-set-edit');
      if (multiWeightInputs.length > 0) {
        editExercises[i].weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
        editExercises[i]._multiWeight = true;
      } else {
        const singleWeightInput = card.querySelector('.ex-weight-edit');
        editExercises[i].weight = parseFloat(singleWeightInput ? singleWeightInput.value : 0) || 0;
        editExercises[i]._multiWeight = false;
      }
    });
  };

  renderForm();
};

const renderAddRoutine = (initialExercises = null) => {
  let newExercises = initialExercises || [{ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false }];

  const renderForm = () => {
    app.innerHTML = `
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
          ${newExercises.map((ex, i) => `
            <div class="card exercise-form-card" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${i + 1}</span>
                <div style="display: flex; gap: 10px">
                  <button class="toggle-manual" data-index="${i}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${ex._manual ? 'Usa Lista' : 'Scrivi a mano'}</button>
                  ${newExercises.length > 1 ? `<button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>` : ''}
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${ex._manual || ex._muscle === 'Altro'
                  ? `<input type="text" class="ex-name" data-index="${i}" placeholder="Nome (es. Corsa)" value="${ex.name}" style="margin: 0">` 
                  : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${i}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(EXERCISE_DB).map(m => `<option value="${m}" ${ex._muscle === m ? 'selected' : ''}>${m}</option>`).join('')}
                      </select>
                      <select class="ex-name" data-index="${i}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(EXERCISE_DB[ex._muscle] || []).map(e => `<option value="${e}" ${e === ex.name ? 'selected' : ''}>${e}</option>`).join('')}
                      </select>
                    </div>
                  `
                }
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${ex.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${ex.reps}">
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiWeight ? 'Usa carico unico' : 'Carichi diversi per serie?'}</button>
                </div>
                
                ${ex._multiWeight 
                  ? `<div class="multi-weight-grid">
                      ${Array.from({ length: ex.sets }).map((_, si) => `
                        <input type="number" class="ex-weight-set" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.weight) ? (ex.weight[si] || 0) : ex.weight}" placeholder="S${si+1}">
                      `).join('')}
                     </div>`
                  : `<input type="number" class="ex-weight-init" value="${Array.isArray(ex.weight) ? ex.weight[0] : ex.weight}">`
                }
              </div>

              <div>
                <div class="card-subtitle">Riposo (sec)</div>
                <input type="number" class="ex-rest" value="${ex.rest}">
              </div>
            </div>
          `).join('')}
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
    `;

    document.getElementById('cancel-add').addEventListener('click', () => renderRoutines());

    const typeSelect = document.getElementById('routine-type-select');
    const durationContainer = document.getElementById('duration-container');
    
    typeSelect.addEventListener('change', () => {
      durationContainer.style.display = typeSelect.value === 'circuit' ? 'block' : 'none';
    });
    
    document.querySelectorAll('.ex-muscle').forEach(sel => {
      sel.addEventListener('change', (e) => {
        syncExercises();
        const idx = parseInt(e.target.getAttribute('data-index'));
        newExercises[idx].name = ''; 
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-manual').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        newExercises[idx]._manual = !newExercises[idx]._manual;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-weight').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        newExercises[idx]._multiWeight = !newExercises[idx]._multiWeight;
        renderForm();
      });
    });

    document.getElementById('add-ex-row').addEventListener('click', () => {
      syncExercises();
      newExercises.push({ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false });
      renderForm();
    });

    document.querySelectorAll('.remove-ex').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        newExercises.splice(idx, 1);
        renderForm();
      });
    });

    document.getElementById('save-routine').addEventListener('click', () => {
      syncExercises();
      const name = document.getElementById('routine-name-input').value;
      const type = document.getElementById('routine-type-select').value;
      const duration = parseInt(document.getElementById('routine-duration-input').value) || 50;
      if (!name) return alert('Inserisci un nome per la scheda');
      
      const newRoutine = {
        id: Date.now(),
        name,
        type,
        duration: type === 'circuit' ? duration : null,
        exercises: newExercises.filter(ex => ex.name.trim() !== '').map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          rest: ex.rest || 60
        }))
      };

      if (newRoutine.exercises.length === 0) return alert('Aggiungi e compila almeno un esercizio');

      routines.push(newRoutine);
      storage.saveRoutines(routines);
      renderRoutines();
    });
  };

  const syncExercises = () => {
    document.querySelectorAll('.exercise-form-card').forEach((card, i) => {
      const muscleEl = card.querySelector('.ex-muscle');
      const nameEl = card.querySelector('.ex-name');
      newExercises[i]._muscle = muscleEl ? muscleEl.value : (newExercises[i]._muscle || '');
      newExercises[i].name = nameEl ? nameEl.value : '';
      newExercises[i].sets = parseInt(card.querySelector('.ex-sets').value) || 3;
      newExercises[i].reps = card.querySelector('.ex-reps').value || '10';
      newExercises[i].rest = parseInt(card.querySelector('.ex-rest').value) || 60;
      
      const multiWeightInputs = card.querySelectorAll('.ex-weight-set');
      if (multiWeightInputs.length > 0) {
        newExercises[i].weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
        newExercises[i]._multiWeight = true;
      } else {
        const singleWeightInput = card.querySelector('.ex-weight-init');
        newExercises[i].weight = parseFloat(singleWeightInput ? singleWeightInput.value : 0) || 0;
        newExercises[i]._multiWeight = false;
      }
    });
  };

  renderForm();
};

const renderWorkoutPreview = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  app.innerHTML = `
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-list" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">Pronto?</h2>
        <div style="width: 40px"></div>
      </header>

      <div class="card" style="background: rgba(204, 255, 0, 0.05); border: 1px solid var(--accent-color); text-align: center; padding: 30px 20px">
        <div class="card-subtitle">Stai per iniziare</div>
        <div class="card-title" style="font-size: 1.8rem">${routine.name}</div>
        <div class="card-subtitle" style="margin-top: 10px">
          ${routine.type === 'circuit' ? `🔄 Circuito AMRAP • ${routine.duration || 50} min` : `💪 Sessione Standard • ${routine.exercises.length} esercizi`}
        </div>
      </div>

      <div style="padding: 0 16px">
        <div class="card-subtitle" style="margin-bottom: 10px">Esercizi in programma:</div>
        ${routine.exercises.map(ex => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem">
            <span>${ex.name}</span>
            <span style="color: var(--text-secondary)">${ex.sets}x${ex.reps}</span>
          </div>
        `).join('')}
      </div>

      <div style="padding: 30px 16px">
        <button class="btn" id="start-session-now" style="font-size: 1.2rem; padding: 20px">
          AVVIA SESSIONE 🔥
        </button>
      </div>
    </div>
  `;

  document.getElementById('back-to-list').addEventListener('click', () => renderRoutines());
  document.getElementById('start-session-now').addEventListener('click', () => {
    if (routine.type === 'circuit') {
      renderCircuitSession(routineId);
    } else {
      renderWorkoutSession(routineId);
    }
  });
};

const parseOCRText = (text) => {
  const lines = text.split('\n');
  const foundExercises = [];
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.length < 3) return;

    // Pattern 1: "Nome 4x10 60kg" o "Nome 4 x 10"
    const pattern1 = cleanLine.match(/^([a-zA-Z\s]+)\s+(\d+)\s*[xX*]\s*(\d+)(?:\s*(\d+))?/);
    
    // Pattern 2: "4x10 Nome"
    const pattern2 = cleanLine.match(/^(\d+)\s*[xX*]\s*(\d+)\s+([a-zA-Z\s]+)/);

    if (pattern1) {
      foundExercises.push({
        name: pattern1[1].trim(),
        sets: parseInt(pattern1[2]),
        reps: pattern1[3],
        weight: parseInt(pattern1[4] || 0),
        rest: 60
      });
    } else if (pattern2) {
      foundExercises.push({
        name: pattern2[3].trim(),
        sets: parseInt(pattern2[1]),
        reps: pattern2[2],
        weight: 0,
        rest: 60
      });
    } else {
      // Fallback: cerca nomi noti nel database esercizi se presenti nella riga
      const numbers = cleanLine.match(/\d+/g);
      let foundName = "";
      
      for (const group in EXERCISE_DB) {
        for (const exName of EXERCISE_DB[group]) {
          if (cleanLine.toLowerCase().includes(exName.toLowerCase())) {
            foundName = exName;
            break;
          }
        }
        if (foundName) break;
      }

      if (foundName && numbers && numbers.length >= 1) {
        foundExercises.push({
          name: foundName,
          sets: parseInt(numbers[0] || 3),
          reps: numbers[1] || '10',
          weight: parseInt(numbers[2] || 0),
          rest: 60
        });
      } else if (cleanLine.replace(/[^a-zA-Z]/g, '').length > 4 && numbers && numbers.length >= 2) {
        // Ultima spiaggia: testo lungo + almeno 2 numeri
        const namePart = cleanLine.replace(/\d+/g, '').replace(/[xX*]/g, '').trim();
        foundExercises.push({
          name: namePart,
          sets: parseInt(numbers[0]),
          reps: numbers[1],
          weight: parseInt(numbers[2] || 0),
          rest: 60
        });
      }
    }
  });

  return foundExercises;
};

const renderScanRoutine = () => {
  app.innerHTML = `
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
            <textarea id="manual-text-input" placeholder="Esempio:\nPanca Piana 4x10 60kg\nSquat 3x12 80kg" style="width: 100%; height: 150px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; padding: 12px; font-family: inherit; resize: none"></textarea>
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
  `;

  const cameraInput = document.getElementById('camera-input');
  const triggerBtn = document.getElementById('trigger-camera');
  const previewBox = document.getElementById('scan-preview');
  const ocrStatus = document.getElementById('ocr-status');
  const resultsBox = document.getElementById('scan-results');
  const parsedList = document.getElementById('parsed-list');
  
  const tabPhoto = document.getElementById('tab-photo');
  const tabText = document.getElementById('tab-text');
  const sectionPhoto = document.getElementById('section-photo');
  const sectionText = document.getElementById('section-text');
  const manualTextInput = document.getElementById('manual-text-input');
  const parseTextBtn = document.getElementById('parse-text-btn');

  let detectedExercises = [];

  const updateListUI = () => {
    resultsBox.style.display = 'block';
    if (detectedExercises.length === 0) {
      parsedList.innerHTML = `<div class="card" style="text-align: center; color: var(--danger)">Nessun esercizio trovato. Prova a cambiare formato.</div>`;
    } else {
      parsedList.innerHTML = detectedExercises.map((ex, i) => `
        <div class="parsed-item">
          <div>
            <div style="font-weight: 700; color: var(--accent-color)">${ex.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary)">${ex.sets} serie x ${ex.reps} reps ${ex.weight > 0 ? `• ${ex.weight}kg` : ''}</div>
          </div>
          <button class="remove-parsed-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      `).join('');

      document.querySelectorAll('.remove-parsed-ex').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          detectedExercises.splice(idx, 1);
          updateListUI();
        });
      });
    }
  };

  tabPhoto.addEventListener('click', () => {
    tabPhoto.style.background = 'var(--accent-color)';
    tabPhoto.style.color = '#000';
    tabText.style.background = 'rgba(255,255,255,0.1)';
    tabText.style.color = '#fff';
    sectionPhoto.style.display = 'block';
    sectionText.style.display = 'none';
  });

  tabText.addEventListener('click', () => {
    tabText.style.background = 'var(--accent-color)';
    tabText.style.color = '#000';
    tabPhoto.style.background = 'rgba(255,255,255,0.1)';
    tabPhoto.style.color = '#fff';
    sectionPhoto.style.display = 'none';
    sectionText.style.display = 'block';
  });

  parseTextBtn.addEventListener('click', () => {
    const text = manualTextInput.value;
    if (!text.trim()) return alert('Incolla del testo prima!');
    detectedExercises = parseOCRText(text);
    updateListUI();
  });

  document.getElementById('cancel-scan').addEventListener('click', () => renderRoutines());

  triggerBtn.addEventListener('click', () => cameraInput.click());

  cameraInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (re) => {
      previewBox.innerHTML = `<img src="${re.target.result}">`;
    };
    reader.readAsDataURL(file);

    triggerBtn.style.display = 'none';
    ocrStatus.style.display = 'block';
    resultsBox.style.display = 'none';

    try {
      const worker = await Tesseract.createWorker('ita', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            document.getElementById('ocr-progress-bar').style.width = progress + '%';
            document.getElementById('ocr-label').innerText = `Riconoscimento: ${progress}%`;
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      detectedExercises = parseOCRText(text);
      ocrStatus.style.display = 'none';
      triggerBtn.style.display = 'flex';
      updateListUI();
      
    } catch (err) {
      console.error(err);
      alert('Errore durante la scansione. Riprova.');
      ocrStatus.style.display = 'none';
      triggerBtn.style.display = 'flex';
    }
  });

  document.getElementById('confirm-scan').addEventListener('click', () => {
    if (detectedExercises.length === 0) return;
    renderAddRoutineWithData(detectedExercises);
  });
};

const renderAddRoutineWithData = (data) => {
  const processedData = data.map(ex => ({
    ...ex,
    _muscle: getMuscleGroup(ex.name),
    _manual: getMuscleGroup(ex.name) === 'Altro'
  }));
  renderAddRoutine(processedData);
};

const renderCircuitSession = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  const durationMin = routine.duration || 50;
  let timeLeft = durationMin * 60;
  let rounds = 0;
  let activeExerciseIdx = 0;
  
  app.innerHTML = `
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="cancel-circuit" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">Annulla</button>
        <h2 style="font-size: 1.1rem; margin: 0">${routine.name}</h2>
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
        ${routine.exercises.map((ex, i) => `
          <div class="circuit-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
            <div style="font-weight: 600">${ex.name}</div>
            <div style="color: var(--accent-color); font-weight: 800">${ex.reps}</div>
          </div>
        `).join('')}
      </div>

      <div style="padding: 24px 16px">
        <button class="btn btn-secondary" id="finish-circuit">Concludi Allenamento</button>
      </div>
    </div>
  `;

  const timerDisplay = document.getElementById('circuit-timer');
  const roundDisplay = document.getElementById('round-count');
  
  const updateTimer = () => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    if (timerDisplay) timerDisplay.innerText = `${m}:${s}`;

    if (timeLeft <= 0) {
      clearInterval(workoutTimerInterval);
      if (timerDisplay) {
        timerDisplay.innerText = "TEMPO SCADUTO!";
        timerDisplay.style.color = "var(--danger)";
      }
      playAlarm();
    }
  };

  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(updateTimer, 1000);
  updateTimer();

  document.getElementById('cancel-circuit').addEventListener('click', () => {
    if (confirm('Annullare l\'allenamento? I progressi non verranno salvati.')) {
      clearInterval(workoutTimerInterval);
      renderRoutines();
    }
  });

  document.getElementById('rest-trigger').addEventListener('click', () => showRestTimer(30));

  document.getElementById('round-completed').addEventListener('click', () => {
    rounds++;
    roundDisplay.innerText = rounds;
    // Reset active exercise focus
    document.querySelectorAll('.circuit-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.circuit-item[data-idx="0"]').classList.add('active');
    activeExerciseIdx = 0;
    
    // Feedback visivo
    roundDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => roundDisplay.style.transform = 'scale(1)', 200);
  });

  // Tap su esercizio per evidenziarlo come "corrente"
  document.querySelectorAll('.circuit-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.circuit-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  document.getElementById('finish-circuit').addEventListener('click', () => {
    clearInterval(workoutTimerInterval);
    
    const durationStr = `${durationMin - Math.floor(timeLeft / 60)} min`;
    
    storage.saveLog({
      routineName: routine.name,
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
      timestamp: Date.now(),
      duration: durationStr,
      type: 'circuit',
      rounds: rounds,
      exercises: routine.exercises.map(ex => ({ name: ex.name, sets: [{ reps: ex.reps, weight: ex.weight }] }))
    });
    
    logs = storage.getLogs();
    alert(`Ottimo lavoro! 🔥 Hai completato ${rounds} giri in questo circuito!`);
    switchView('dashboard');
  });
};

const renderWorkoutSession = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  workoutStartTime = Date.now();

  app.innerHTML = `
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
        <div style="text-align: center">
          <h2 style="font-size: 1.1rem; margin: 0">${routine.name}</h2>
          <div id="workout-timer-display" style="font-size: 0.8rem; color: var(--accent-color); font-weight: 700; margin-top: 2px">00:00</div>
        </div>
        <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
      </header>

      ${routine.exercises.map((ex, idx) => `
        <div class="card">
          <div class="card-title" style="color: var(--accent-color)">${ex.name}</div>
          <div class="card-subtitle">${ex.sets} serie × ${ex.reps}</div>
          
          <div style="margin-top: 15px">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; text-align: center; color: var(--text-secondary); font-size: 0.7rem; margin-bottom: 5px">
              <div>SET</div>
              <div>KG</div>
              <div>REPS</div>
              <div></div>
            </div>
            ${Array.from({ length: ex.sets }).map((_, i) => `
              <div class="set-row" data-ex-idx="${idx}" style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; margin-bottom: 8px; transition: opacity 0.3s">
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${i + 1}</div>
                <input type="number" value="${Array.isArray(ex.weight) ? (ex.weight[i] || ex.weight[0] || 0) : ex.weight}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-weight">
                <input type="number" placeholder="${ex.reps}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
                <button class="check-set-btn" style="background: transparent; border: 2px solid var(--accent-color); border-radius: 8px; color: var(--accent-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                </button>
              </div>
            `).join('')}
          </div>

          <div class="exercise-feedback" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Com'è andato l'esercizio?</div>
            <div style="display: flex; gap: 10px">
              <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer">👍 Bene</button>
              <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer">👎 Fatica</button>
            </div>
          </div>
        </div>
      `).join('')}

      <div style="padding: 16px">
        <button class="btn" id="finish-workout" style="background: var(--success)">
          Concludi Allenamento
        </button>
      </div>
    </div>
  `;

  const updateWorkoutTimer = () => {
    const now = Date.now();
    const diff = Math.floor((now - workoutStartTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    const display = document.getElementById('workout-timer-display');
    if (display) display.innerText = `${m}:${s}`;
  };

  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(updateWorkoutTimer, 1000);

  document.getElementById('back-to-routines').addEventListener('click', () => {
    clearInterval(workoutTimerInterval);
    renderRoutines();
  });
  document.getElementById('rest-trigger').addEventListener('click', () => showRestTimer(60));
  
  // Logica per spuntare le serie
  document.querySelectorAll('.check-set-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.set-row');
      const isCompleted = row.style.opacity === '0.5';
      
      if (!isCompleted) {
        row.style.opacity = '0.5';
        btn.style.background = 'var(--accent-color)';
        btn.style.color = '#000';
        
        const exIdx = row.getAttribute('data-ex-idx');
        const restSeconds = routine.exercises[exIdx].rest || 60;
        showRestTimer(restSeconds);
      } else {
        row.style.opacity = '1';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--accent-color)';
      }

      // Controlla se tutte le serie dell'esercizio sono completate
      const card = row.closest('.card');
      const allRows = card.querySelectorAll('.set-row');
      const completedRows = Array.from(allRows).filter(r => r.style.opacity === '0.5');
      
      if (completedRows.length === allRows.length) {
        card.querySelector('.exercise-feedback').style.display = 'block';
      } else {
        card.querySelector('.exercise-feedback').style.display = 'none';
      }
    });
  });

  // Logica feedback esercizio
  document.querySelectorAll('.feedback-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      card.querySelectorAll('.feedback-btn').forEach(b => b.style.opacity = '0.4');
      btn.style.opacity = '1';
      card.setAttribute('data-feedback', btn.classList.contains('pos') ? 'positive' : 'negative');
    });
  });

  document.getElementById('finish-workout').addEventListener('click', () => {
    const exerciseData = [];
    let routineUpdated = false;

    document.querySelectorAll('.card').forEach((card) => {
      const name = card.querySelector('.card-title')?.innerText;
      if (!name) return;
      
      const sets = [];
      let exIdx = null;

      card.querySelectorAll('.set-row').forEach(row => {
        exIdx = row.getAttribute('data-ex-idx');
        const inputs = row.querySelectorAll('input');
        const weight = parseFloat(inputs[0].value) || 0;
        const reps = parseInt(inputs[1].value) || 0;
        sets.push({ weight, reps });
      });

      const feedback = card.getAttribute('data-feedback');
      if (exIdx !== null && feedback === 'positive') {
        routine.exercises[exIdx].weight += 2.5;
        routineUpdated = true;
      }

      exerciseData.push({ name, sets, feedback });
    });

    if (routineUpdated) {
      storage.saveRoutines(routines);
    }

    const diff = Math.floor((Date.now() - workoutStartTime) / 1000);
    const m = Math.floor(diff / 60);
    const durationStr = m > 0 ? `${m} min` : `${diff} sec`;
    
    storage.saveLog({
      routineName: routine.name,
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
      timestamp: Date.now(),
      duration: durationStr,
      exercises: exerciseData
    });
    
    clearInterval(workoutTimerInterval);
    logs = storage.getLogs();
    
    if (routineUpdated) {
      alert('Allenamento salvato! 🔥 Hai spaccato: i pesi per la prossima sessione sono stati aumentati automaticamente di 2.5kg dove hai performato meglio!');
    } else {
      alert('Allenamento salvato con successo! 🔥');
    }
    
    switchView('dashboard');
  });
};

const renderHistory = () => {
  app.innerHTML = `
    <div class="view">
      <h2 style="padding: 0 16px 16px; font-weight: 800">Storia Allenamenti</h2>
      ${logs.length === 0 ? `
        <div class="card" style="text-align: center; padding: 40px 20px">
          <div class="card-subtitle">Ancora nessun allenamento registrato.</div>
        </div>
      ` : logs.map((log, idx) => `
        <div class="card log-card" data-idx="${idx}" style="cursor: pointer">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <div class="card-title">${log.routineName}</div>
              <div class="card-subtitle">${log.date} ${log.duration ? `• ⏱️ ${log.duration}` : ''} ${log.type === 'circuit' ? `• 🔄 ${log.rounds} giri` : ''}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-secondary)"><path d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.log-card').forEach(card => {
    card.addEventListener('click', () => {
      renderWorkoutDetails(card.getAttribute('data-idx'));
    });
  });
};

const renderWorkoutDetails = (logIdx) => {
  const log = logs[logIdx];
  if (!log) return renderHistory();

  app.innerHTML = `
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-history" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Indietro</button>
        <h2 style="font-size: 1.1rem; margin: 0">Dettaglio Sessione</h2>
        <div style="width: 40px"></div>
      </header>

      <div class="card" style="background: rgba(204, 255, 0, 0.05); border: 1px solid var(--accent-color)">
        <div class="card-title">${log.routineName}</div>
        <div class="card-subtitle">${log.date} ${log.duration ? `• ⏱️ Durata: ${log.duration}` : ''} ${log.type === 'circuit' ? `• 🔄 Giri: ${log.rounds}` : ''}</div>
      </div>

      ${log.exercises.map(ex => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px">
            <div class="card-title" style="font-size: 1rem">${ex.name}</div>
            ${ex.feedback === 'positive' ? '<span style="color: var(--success); font-size: 1.2rem">👍</span>' : ''}
            ${ex.feedback === 'negative' ? '<span style="color: var(--danger); font-size: 1.2rem">👎</span>' : ''}
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px">
            ${ex.sets.map((s, i) => `
              <div style="display: grid; grid-template-columns: 30px 1fr 1fr; gap: 10px; font-size: 0.9rem; color: var(--text-secondary)">
                <div style="color: var(--accent-color); font-weight: 800">${i + 1}</div>
                <div>Peso: <strong>${s.weight} kg</strong></div>
                <div>Reps: <strong>${s.reps}</strong></div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div style="padding: 20px; text-align: center">
        <button class="btn btn-secondary" id="return-history">Torna alla Storia</button>
      </div>
    </div>
  `;

  document.getElementById('back-to-history').addEventListener('click', () => renderHistory());
  document.getElementById('return-history').addEventListener('click', () => renderHistory());
};

const renderProgress = () => {
  const renderProfile = () => {
    app.innerHTML = `
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
              <div class="card-title">${user.name} ${user.surname}</div>
              <div class="card-subtitle">"${user.nickname}" • ${user.gender === 'male' ? 'Uomo' : 'Donna'}</div>
            </div>
            <button id="edit-profile" class="badge" style="border: none; cursor: pointer">Modifica</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center">
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Età</div>
              <div style="font-weight: 700">${user.age}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Peso</div>
              <div style="font-weight: 700; color: var(--accent-color)">${user.weight} kg</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 12px">
              <div class="card-subtitle">Altezza</div>
              <div style="font-weight: 700">${user.height} cm</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div class="card-title">Performance</div>
            <select id="exercise-select" style="width: auto; margin: 0; padding: 5px 10px; font-size: 0.8rem">
              <option value="">Seleziona Esercizio</option>
              ${getUniqueExercises().map(ex => `<option value="${ex}">${ex}</option>`).join('')}
            </select>
          </div>
          <canvas id="progressChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${getUniqueExercises().length > 0 ? 'display:none' : ''}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <div class="card">
      </div>
    `;

    document.getElementById('edit-profile').addEventListener('click', () => renderEditForm());
    document.getElementById('show-changelog').addEventListener('click', () => renderChangelog());
    
    const select = document.getElementById('exercise-select');
    if (select) {
      select.addEventListener('change', (e) => {
        updateChart(e.target.value);
      });
    }
  };

  const getUniqueExercises = () => {
    const names = new Set();
    logs.forEach(log => {
      if (log.exercises) {
        log.exercises.forEach(ex => names.add(ex.name));
      }
    });
    return Array.from(names);
  };

  const updateChart = (exerciseName) => {
    if (!exerciseName) return;
    
    const chartData = logs
      .filter(log => log.exercises && log.exercises.find(ex => ex.name === exerciseName))
      .map(log => {
        const ex = log.exercises.find(ex => ex.name === exerciseName);
        const maxWeight = Math.max(...ex.sets.map(s => s.weight));
        return { date: log.date, weight: maxWeight };
      })
      .reverse();

    const ctx = document.getElementById('progressChart').getContext('2d');
    if (window.currentChart) window.currentChart.destroy();

    window.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.date),
        datasets: [{
          label: 'Peso Massimo (kg)',
          data: chartData.map(d => d.weight),
          borderColor: '#ccff00',
          backgroundColor: 'rgba(204, 255, 0, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ccff00',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#a0a0a0' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#a0a0a0' }
          }
        }
      }
    });
  };

  const renderEditForm = () => {
    app.innerHTML = `
      <div class="view" style="padding: 20px">
        <header style="position: static; background: transparent; padding: 0 0 20px">
          <button id="cancel-edit" style="background: none; border: none; color: var(--text-secondary); cursor: pointer">Annulla</button>
          <h2 style="font-size: 1.2rem">Modifica Profilo</h2>
        </header>

        <div class="card">
          <div class="card-subtitle">Soprannome</div>
          <input type="text" id="edit-nickname" value="${user.nickname}">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px">
            <div>
              <div class="card-subtitle">Età</div>
              <input type="number" id="edit-age" value="${user.age}">
            </div>
            <div>
              <div class="card-subtitle">Peso (kg)</div>
              <input type="number" id="edit-weight" value="${user.weight}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `;

    document.getElementById('cancel-edit').addEventListener('click', () => renderProfile());
    document.getElementById('save-profile').addEventListener('click', () => {
      user.nickname = document.getElementById('edit-nickname').value;
      user.age = document.getElementById('edit-age').value;
      user.weight = document.getElementById('edit-weight').value;
      storage.saveUser(user);
      renderProfile();
      alert('Profilo aggiornato! 🦾');
    });
  };

  renderProfile();
};

const renderChangelog = () => {
  app.innerHTML = `
    <div class="view" style="padding: 20px">
      <header style="position: static; background: transparent; padding: 0 0 20px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-size: 1.2rem; margin: 0">Cosa c'è di nuovo</h2>
        <button id="close-changelog" style="background: none; border: none; color: var(--accent-color); font-weight: 800; cursor: pointer">CHIUDI</button>
      </header>

      <div style="display: flex; flex-direction: column; gap: 20px">
        ${changelogData.map(v => `
          <div class="card" style="border-left: 3px solid var(--accent-color)">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
              <span class="badge" style="font-size: 0.7rem">${v.version}</span>
              <span style="font-weight: 800; font-size: 0.9rem">${v.title}</span>
            </div>
            <ul style="padding-left: 18px; margin: 0; color: var(--text-secondary); font-size: 0.85rem">
              ${v.changes.map(c => `<li style="margin-bottom: 5px">${c}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 30px; color: var(--text-secondary); font-size: 0.7rem">
        IronTrack Team • Made with Ghisa
      </div>
    </div>
  `;

  document.getElementById('close-changelog').addEventListener('click', () => renderProgress());
};

const switchView = (view) => {
  currentView = view;
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === view);
  });

  // Se non è installata e siamo in Safari, mostra la guida (solo se non ha già cliccato "salta")
  if (!isStandalone() && !sessionStorage.getItem('guide-skipped') && view === 'dashboard' && !user) {
    sessionStorage.setItem('guide-skipped', 'true');
    renderInstallGuide();
    return;
  }

  if (!user && view !== 'onboarding') {
    renderOnboarding();
    return;
  }

  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'routines': renderRoutines(); break;
    case 'history': renderHistory(); break;
    case 'progress': renderProgress(); break;
  }
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    switchView(item.getAttribute('data-view'));
  });
});

// Start the app
switchView('dashboard');
