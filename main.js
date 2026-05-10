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

let currentView = 'dashboard';
let routines = storage.getRoutines();
let logs = storage.getLogs();
let user = storage.getUser();

// State per il timer di riposo
let restTimerInterval = null;
let audioContext = null;

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
        { name: 'Trazioni', sets: 4, reps: '8', weight: 0 },
        { name: 'Rematore', sets: 3, reps: '10-12', weight: 50 },
        { name: 'Curl Bilanciere', sets: 3, reps: '12', weight: 20 }
      ]
    }
  ];
  storage.saveRoutines(routines);
}

const phrases = {
  male: [
    "Pronto per spingere, {name}? ⚡️",
    "Si parte Gymbo {name}! 💪",
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
  const greeting = user.gender === 'male' ? 'Bentornato, Gymbo' : 'Bentornata, Guerriera';
  
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
        <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
      </div>
      
      <div id="routines-list">
        ${routines.map(r => `
          <div class="card routine-card" data-id="${r.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start">
              <div>
                <div class="card-title">${r.name}</div>
                <div class="card-subtitle">${r.exercises.length} esercizi</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('add-routine-btn').addEventListener('click', () => {
    renderAddRoutine();
  });

  document.querySelectorAll('.routine-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      renderWorkoutSession(id);
    });
  });
};

const renderAddRoutine = () => {
  let newExercises = [{ name: '', sets: 3, reps: '10', weight: 0 }];

  const renderForm = () => {
    app.innerHTML = `
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
          ${newExercises.map((ex, i) => `
            <div class="card exercise-form-card" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <span class="badge">Esercizio ${i + 1}</span>
                ${newExercises.length > 1 ? `<button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>` : ''}
              </div>
              <input type="text" class="ex-name" placeholder="Nome esercizio" value="${ex.name}">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
                <div>
                  <div class="card-subtitle">Serie</div>
                  <input type="number" class="ex-sets" value="${ex.sets}">
                </div>
                <div>
                  <div class="card-subtitle">Reps</div>
                  <input type="text" class="ex-reps" value="${ex.reps}">
                </div>
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
    
    document.getElementById('add-ex-row').addEventListener('click', () => {
      syncExercises();
      newExercises.push({ name: '', sets: 3, reps: '10', weight: 0 });
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
      if (!name) return alert('Inserisci un nome per la scheda');
      
      const newRoutine = {
        id: Date.now(),
        name,
        exercises: newExercises.filter(ex => ex.name.trim() !== '')
      };

      if (newRoutine.exercises.length === 0) return alert('Aggiungi almeno un esercizio');

      routines.push(newRoutine);
      storage.saveRoutines(routines);
      renderRoutines();
    });
  };

  const syncExercises = () => {
    document.querySelectorAll('.exercise-form-card').forEach((card, i) => {
      newExercises[i].name = card.querySelector('.ex-name').value;
      newExercises[i].sets = parseInt(card.querySelector('.ex-sets').value);
      newExercises[i].reps = card.querySelector('.ex-reps').value;
    });
  };

  renderForm();
};

const renderWorkoutSession = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  app.innerHTML = `
    <div class="view">
      <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
        <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
        <h2 style="font-size: 1.1rem">${routine.name}</h2>
        <div id="rest-trigger" style="color: var(--accent-color); font-weight: 800; cursor: pointer">⏲ TIMER</div>
      </header>

      ${routine.exercises.map((ex, idx) => `
        <div class="card">
          <div class="card-title" style="color: var(--accent-color)">${ex.name}</div>
          <div class="card-subtitle">${ex.sets} serie × ${ex.reps}</div>
          
          <div style="margin-top: 15px">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; color: var(--text-secondary); font-size: 0.7rem; margin-bottom: 5px">
              <div>SET</div>
              <div>KG</div>
              <div>REPS</div>
            </div>
            ${Array.from({ length: ex.sets }).map((_, i) => `
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px">
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${i + 1}</div>
                <input type="number" value="${ex.weight}" style="margin: 0; text-align: center">
                <input type="number" placeholder="${ex.reps}" style="margin: 0; text-align: center">
              </div>
            `).join('')}
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

  document.getElementById('back-to-routines').addEventListener('click', () => renderRoutines());
  document.getElementById('rest-trigger').addEventListener('click', () => showRestTimer(60));
  
  document.getElementById('finish-workout').addEventListener('click', () => {
    storage.saveLog({
      routineName: routine.name,
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
      timestamp: Date.now()
    });
    logs = storage.getLogs();
    switchView('dashboard');
    alert('Allenamento salvato con successo! 🔥');
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
      ` : logs.map(log => `
        <div class="card">
          <div style="display: flex; justify-content: space-between">
            <div>
              <div class="card-title">${log.routineName}</div>
              <div class="card-subtitle">${log.date}</div>
            </div>
            <div class="badge">Completato</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

const renderProgress = () => {
  const renderProfile = () => {
    app.innerHTML = `
      <div class="view">
        <h2 style="padding: 0 16px 16px; font-weight: 800">I tuoi progressi</h2>
        
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
    `;

    document.getElementById('edit-profile').addEventListener('click', () => renderEditForm());
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

const switchView = (view) => {
  currentView = view;
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === view);
  });

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
