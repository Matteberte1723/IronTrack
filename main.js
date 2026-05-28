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

// Applica Tema
const applyTheme = (theme) => {
  document.body.className = theme === 'default' ? '' : `theme-${theme}`;
};
applyTheme(storage.getTheme());

const exportData = () => {
  const data = {
    routines: storage.getRoutines(),
    logs: storage.getLogs(),
    user: storage.getUser(),
    theme: storage.getTheme(),
    version: APP_VERSION,
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `irontrack_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (confirm('Questo sovrascriverà tutti i dati attuali. Sei sicuro?')) {
        if (data.routines) storage.saveRoutines(data.routines);
        if (data.logs) {
          localStorage.setItem('iron_track_logs', JSON.stringify(data.logs));
        }
        if (data.user) storage.saveUser(data.user);
        if (data.theme) storage.saveTheme(data.theme);
        alert('Dati importati con successo! L\'app verrà ricaricata.');
        window.location.reload();
      }
    } catch (err) {
      alert('Errore durante l\'importazione. Il file potrebbe essere corrotto.');
    }
  };
  reader.readAsText(file);
};

const APP_VERSION = "v2.2.0";

const changelogData = [
  {
    version: "v2.2.0",
    title: "Saturazione Automatica & Personalizzazione Premium",
    changes: [
      "Switch Progressione Globale: Attiva/disattiva gli incrementi automatici dei pesi in Settings per un controllo assoluto",
      "Passo Auto in base al Muscolo: Calcola l'incremento ideale in modo scientifico (+2.5 kg per Petto/Dorso/Gambe, +1 kg per Spalle/Braccia/Addome)",
      "Tre Nuove Modalità di Progressioni: Mista (Reps → Peso), Solo Peso (incremento diretto) o Solo Reps (ottimale per corpo libero fino a max 15)",
      "Simulatore Split-Screen & Solo Reps: Anteprima visiva affiancata del comportamento sui gruppi muscolari e con cappello blu per le reps",
      "Modalità Esercizio Eredita: Scegli per ogni singolo esercizio se ereditare le impostazioni globali o personalizzare logica, passo e applicazione"
    ]
  },
  {
    version: "v2.1.1",
    title: "Progressione Avanzata & Autoregolazione",
    changes: [
      "Progressione per Esercizio: imposta strategie di incremento personalizzate per ciascun esercizio direttamente in modifica scheda",
      "Autoregolazione (Smart Deload): se accumuli 3 feedback negativi consecutivi sullo stesso esercizio, a fine allenamento ti proporremo uno scarico del -10% peso",
      "Doppia Progressione Classica: supporto integrato per i range di reps (es. 8-12 reps) che aumenta il peso solo al completamento del range massimo",
      "Simulatore di Progressione: grafico a barre interattivo in Impostazioni che visualizza in tempo reale come cambieranno i pesi dei tuoi set",
      "Pulsanti Info (Tooltips): icone esplicative 'ℹ️' per comprendere pedagogicamente ogni singola impostazione"
    ]
  },
  {
    version: "v2.1.0",
    title: "Progressione Personalizzata & Storico Avanzato",
    changes: [
      "Progressione su misura: scegli come incrementare i carichi (tutte le serie, ultima serie, prima serie o alternate)",
      "Incrementi flessibili: seleziona il passo (1, 2, 2.5, 5 kg/lbs) e la soglia minima di ripetizioni",
      "Sovraccarico Storico: applica istantaneamente i carichi di una sessione passata alla scheda attiva con lo stesso nome",
      "Conferma Sicura: sistema di conferma prima di sovrascrivere i carichi della scheda attiva",
      "Indicatore 'Carico Facile': gli esercizi con feedback positivo nella sessione precedente saranno evidenziati in verde la volta successiva"
    ]
  },
  {
    version: "v2.0.0",
    title: "Navigazione Sicura & Impostazioni",
    changes: [
      "Sistema di Pausa: Previeni l'interruzione accidentale dell'allenamento",
      "Nuova Sezione Impostazioni dedicata per gestire Profilo, Unità e Backup",
      "Allarme Timer riscritto per maggiore affidabilità in background",
      "Supporto per Kg e Libbre"
    ]
  },
  {
    version: "v1.9.2",
    title: "Sincronizzazione Timer",
    changes: [
      "Risolto blocco del timer di recupero e del circuito in standby o in background",
      "Calcolo basato su timestamp assoluti per massima precisione",
      "Sincronizzazione immediata al rientro nell'app"
    ]
  },
  {
    version: "v1.9.1",
    title: "Progressi & Volume",
    changes: ["Progressione intelligente: aumenta reps o carichi in base al feedback", "Persistenza automatica di carichi e reps sulla scheda", "Nuovo grafico del Volume Totale", "Calendario mensile evidenziato correttamente"]
  },
  {
    version: "v1.9.0",
    title: "Personalizzazione & Flow",
    changes: [
      "Riordino Dinamico: Sposta gli esercizi con un tocco (Drag & Drop)",
      "Note Esercizio: Aggiungi promemoria per ogni esercizio",
      "Ripetizioni Variabili: Imposta reps diverse per ogni serie",
      "Stima Durata: Calcolo automatico della durata dell'allenamento",
      "Interfaccia Migliorata: Nuovo sistema di inserimento rapido"
    ]
  },
  {
    version: "v1.8.0",
    title: "L'Evoluzione",
    changes: [
      "Backup & Ripristino: Esporta i tuoi dati per non perderli mai",
      "Calendario Allenamenti: Visualizza la tua costanza mensile",
      "Temi Personalizzati: Scegli il tuo colore (Red, Blue, Purple, White)",
      "Icone Esercizi: Migliorata la navigazione visiva dei muscoli"
    ]
  },
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
if (user) {
  let needsSave = false;
  if (user.progressionEnabled === undefined) { user.progressionEnabled = true; needsSave = true; }
  if (user.progressionType === undefined) { user.progressionType = 'all'; needsSave = true; }
  if (user.progressionStep === undefined) { user.progressionStep = 'auto'; needsSave = true; }
  if (user.repsThreshold === undefined) { user.repsThreshold = 8; needsSave = true; }
  if (user.progressionMode === undefined) { user.progressionMode = 'mixed'; needsSave = true; }
  if (needsSave) storage.saveUser(user);
}
let pausedWorkout = storage.getPausedWorkout ? storage.getPausedWorkout() : null;
let activeWorkoutHandler = null;

// State per il timer di riposo e allenamento
let restTimerInterval = null;
let audioContext = null;
let workoutTimerInterval = null;
let workoutStartTime = null;
let activeTimerSyncFn = null;

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

const MUSCLE_ICONS = {
  "Petto": "🍒",
  "Dorso": "🦅",
  "Gambe": "🍗",
  "Spalle": "🛡️",
  "Bicipiti": "💪",
  "Tricipiti": "⚡",
  "Addome": "🧱",
  "Altro": "🏋️"
};

const getMuscleGroup = (exerciseName) => {
  if (!exerciseName) return "";
  for (const [muscle, exercises] of Object.entries(EXERCISE_DB)) {
    if (exercises.includes(exerciseName)) return muscle;
  }
  return "Altro";
};

const getMuscleIcon = (muscleGroup) => {
  return MUSCLE_ICONS[muscleGroup] || MUSCLE_ICONS["Altro"];
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

const calculateEstimatedDuration = (routine) => {
  if (!routine || !routine.exercises) return 0;
  let totalSeconds = 0;
  routine.exercises.forEach(ex => {
    const sets = parseInt(ex.sets) || 1;
    const rest = parseInt(ex.rest) || 60;
    // Assumiamo 45 secondi per serie + il tempo di recupero (tranne l'ultima serie che non ha recupero dopo)
    totalSeconds += (sets * 45) + ((sets - 1) * rest);
  });
  // Aggiungiamo 5 minuti di riscaldamento/spostamento generale
  return Math.round((totalSeconds / 60) + 5);
};

const initSortable = (container, onSort) => {
  const items = container.querySelectorAll('.draggable-item');
  
  items.forEach(item => {
    const handle = item.querySelector('.drag-handle');
    
    // Mouse Events (Desktop)
    item.setAttribute('draggable', true);
    item.addEventListener('dragstart', (e) => {
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      if (onSort) onSort();
    });

    // Touch Events (Mobile)
    if (handle) {
      handle.addEventListener('touchstart', (e) => {
        item.classList.add('dragging');
      }, { passive: true });

      handle.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        const touch = e.touches[0];
        const dragging = container.querySelector('.dragging');
        if (!dragging) return;

        const afterElement = getDragAfterElement(container, touch.clientY);
        if (afterElement == null) {
          container.appendChild(dragging);
        } else {
          container.insertBefore(dragging, afterElement);
        }
      }, { passive: false });

      handle.addEventListener('touchend', () => {
        if (item.classList.contains('dragging')) {
          item.classList.remove('dragging');
          if (onSort) onSort();
        }
      });
    }
  });

  // Desktop Drag Over
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = container.querySelector('.dragging');
    if (!dragging) return;
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(dragging);
    } else {
      container.insertBefore(dragging, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
};

// === SISTEMA AUDIO ROBUSTO (iOS/Android/Desktop) ===
// Genera WAV beep in memoria e usa <audio> HTML per massima compatibilità iOS

// Helper per scrivere header WAV
const writeWavHeader = (view, numSamples, sampleRate) => {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
};

const makeSamplesWav = (samples, sampleRate) => {
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + samples.length * 2);
  const view = new DataView(buffer);
  writeWavHeader(view, samples.length, sampleRate);
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(headerSize + i * 2, Math.max(-32768, Math.min(32767, samples[i] * 32767)), true);
  }
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
};

// --- Suono 1: Classic (beep singolo 880Hz) ---
const generateClassicWav = () => {
  const sr = 44100, freq = 880, dur = 0.35, vol = 0.6;
  const n = Math.floor(sr * dur);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const fadeIn = Math.min(1, t / 0.01);
    const fadeOut = Math.min(1, (dur - t) / 0.05);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * vol * fadeIn * fadeOut;
  }
  return makeSamplesWav(samples, sr);
};

// --- Suono 2: Digital (triplo beep rapido, stile smartwatch) ---
const generateDigitalWav = () => {
  const sr = 44100, freq = 1200, vol = 0.55;
  const beepDur = 0.08, gapDur = 0.08;
  const totalDur = beepDur * 3 + gapDur * 2;
  const n = Math.floor(sr * totalDur);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    // Determina se siamo in un beep o in una pausa
    const cyclePos = t % (beepDur + gapDur);
    const cycleIndex = Math.floor(t / (beepDur + gapDur));
    if (cycleIndex < 3 && cyclePos < beepDur) {
      const localT = cyclePos;
      const fadeIn = Math.min(1, localT / 0.005);
      const fadeOut = Math.min(1, (beepDur - localT) / 0.005);
      samples[i] = Math.sin(2 * Math.PI * freq * t) * vol * fadeIn * fadeOut;
    }
  }
  return makeSamplesWav(samples, sr);
};

// --- Suono 3: Gong (tono profondo con riverbero, stile campana) ---
const generateGongWav = () => {
  const sr = 44100, dur = 1.2, vol = 0.5;
  const n = Math.floor(sr * dur);
  const samples = new Float32Array(n);
  const freqs = [220, 440, 554, 660]; // Armoniche di una campana
  const amps = [1.0, 0.6, 0.3, 0.2];
  const decays = [1.5, 2.0, 2.5, 3.0];
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let s = 0;
    for (let h = 0; h < freqs.length; h++) {
      s += Math.sin(2 * Math.PI * freqs[h] * t) * amps[h] * Math.exp(-t * decays[h]);
    }
    const fadeIn = Math.min(1, t / 0.005);
    samples[i] = s * vol * fadeIn;
  }
  return makeSamplesWav(samples, sr);
};

// Cache dei suoni generati
const soundCache = {};
const getBeepUrl = (type) => {
  if (!type) type = storage.getAlarmSound();
  if (!soundCache[type]) {
    switch (type) {
      case 'digital': soundCache[type] = generateDigitalWav(); break;
      case 'gong': soundCache[type] = generateGongWav(); break;
      default: soundCache[type] = generateClassicWav(); break;
    }
  }
  return soundCache[type];
};

// Pool di <audio> sbloccati al primo tocco
let audioPool = [];
let audioPoolReady = false;
let audioPoolType = null;

const rebuildAudioPool = (type) => {
  // Pulisci pool precedente
  audioPool.forEach(a => { try { a.pause(); a.src = ''; } catch(e) {} });
  audioPool = [];
  audioPoolReady = false;
  audioPoolType = null;
};

const unlockAudio = () => {
  if (!audioContext) {
    try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  
  const currentType = storage.getAlarmSound();
  // Ricostruisci pool se il tipo di suono è cambiato
  if (audioPoolType && audioPoolType !== currentType) {
    rebuildAudioPool();
  }
  
  if (!audioPoolReady) {
    const url = getBeepUrl(currentType);
    for (let i = 0; i < 4; i++) {
      const a = new Audio(url);
      a.volume = 0.01;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.volume = 1.0;
      }).catch(() => {});
      audioPool.push(a);
    }
    audioPoolReady = true;
    audioPoolType = currentType;
  }
};

// Anteprima suono per le impostazioni
const previewAlarmSound = (type) => {
  const url = getBeepUrl(type);
  const a = new Audio(url);
  a.volume = 1.0;
  a.play().catch(() => {});
};

const playAlarm = () => {
  // Controlla se l'allarme è attivo
  if (!storage.getAlarmEnabled()) {
    // Solo vibrazione se il suono è disattivato
    if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
    return () => { if (navigator.vibrate) navigator.vibrate(0); };
  }
  
  unlockAudio();
  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
  
  let beepInterval = null;
  let stopped = false;
  let beepIndex = 0;
  const currentType = storage.getAlarmSound();
  const url = getBeepUrl(currentType);
  // Intervallo diverso in base al tipo di suono
  const intervalMs = currentType === 'gong' ? 2000 : currentType === 'digital' ? 1500 : 1200;
  
  const playBeep = () => {
    if (stopped) return;
    
    if (navigator.vibrate) navigator.vibrate(300);
    
    // Strategia 1: Pool audio (iOS-friendly)
    const poolAudio = audioPool[beepIndex % audioPool.length];
    if (poolAudio) {
      try {
        poolAudio.currentTime = 0;
        poolAudio.volume = 1.0;
        poolAudio.play().catch(() => {});
      } catch(e) {}
    }
    
    // Strategia 2: Nuovo Audio element come fallback
    try {
      const fresh = new Audio(url);
      fresh.volume = 1.0;
      fresh.play().catch(() => {});
    } catch(e) {}
    
    // Strategia 3: Web Audio API oscillator come ultimo fallback
    if (audioContext && currentType === 'classic') {
      try {
        if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } catch(e) {}
    }
    
    beepIndex++;
  };

  playBeep();
  beepInterval = setInterval(playBeep, intervalMs);
  
  const autoStopTimeout = setTimeout(() => {
    if (beepInterval) clearInterval(beepInterval);
  }, 60000);

  return () => {
    stopped = true;
    if (beepInterval) { clearInterval(beepInterval); beepInterval = null; }
    clearTimeout(autoStopTimeout);
    if (navigator.vibrate) navigator.vibrate(0);
    audioPool.forEach(a => { try { a.pause(); a.currentTime = 0; } catch(e) {} });
  };
};

const showRestTimer = (seconds) => {
  unlockAudio();
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

  const endTime = Date.now() + (seconds * 1000);
  let stopAlarm = null;

  overlay.innerHTML = `
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${seconds}s</div>
    <button id="stop-timer" class="btn" style="margin-top: 15px; background: var(--danger); height: 45px; padding: 0 30px">Annulla</button>
  `;

  document.body.appendChild(overlay);

  const updateTimer = () => {
    const display = document.getElementById('timer-display');
    if (!display) {
      clearInterval(restTimerInterval);
      activeTimerSyncFn = null;
      return;
    }

    const curTimeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    display.innerText = curTimeLeft + 's';

    if (curTimeLeft <= 0) {
      clearInterval(restTimerInterval);
      activeTimerSyncFn = null;
      display.innerText = "FINE! 🔥";
      display.style.animation = "pulse 0.5s infinite";
      if (!stopAlarm) {
        stopAlarm = playAlarm();
        // Auto-stop allarme e chiusura overlay dopo la durata impostata
        const alarmDuration = storage.getAlarmDuration() * 1000;
        setTimeout(() => {
          if (stopAlarm) { stopAlarm(); stopAlarm = null; }
          const overlayEl = document.getElementById('rest-timer-overlay');
          if (overlayEl) {
            overlayEl.style.animation = 'slideDown 0.3s ease-in forwards';
            setTimeout(() => overlayEl.remove(), 300);
          }
        }, alarmDuration);
      }
      const stopBtn = document.getElementById('stop-timer');
      if (stopBtn) {
        stopBtn.innerText = "STOP ALLARME";
        stopBtn.style.background = "var(--accent-color)";
        stopBtn.style.color = "#000";
      }
    }
  };

  activeTimerSyncFn = updateTimer;
  restTimerInterval = setInterval(updateTimer, 1000);

  document.getElementById('stop-timer').addEventListener('click', () => {
    if (stopAlarm) stopAlarm();
    clearInterval(restTimerInterval);
    activeTimerSyncFn = null;
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

      ${pausedWorkout ? `
      <div style="padding: 0 16px; margin-bottom: 20px;">
        <button class="btn pulse" id="resume-workout" style="background: var(--accent-color); color: #000; border: none;">
          Riprendi Allenamento in Pausa
        </button>
      </div>
      ` : ''}

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

  const resumeBtn = document.getElementById('resume-workout');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      if (pausedWorkout.type === 'circuit') {
        renderCircuitSession(pausedWorkout.routineId, true);
      } else {
        renderWorkoutSession(pausedWorkout.routineId, true);
      }
    });
  }
};

const renderRoutines = () => {
  app.innerHTML = `
    <div class="view">
      <div style="padding: 0 16px 16px; display: flex; justify-content: space-between; align-items: center">
        <h2 style="font-weight: 800">Le tue schede</h2>
        <div style="display: flex; gap: 8px">
          <button class="badge" id="scan-routine-btn" style="border: none; cursor: pointer; background: var(--accent-color); color: #000; display: flex; align-items: center; gap: 4px; padding: 6px 10px">Inserimento rapido 📷✏️</button>
          <button class="badge" id="add-routine-btn" style="border: none; cursor: pointer">+ Aggiungi</button>
        </div>
      </div>
      
      <div id="routines-list">
        ${routines.map(r => {
          const firstEx = r.exercises[0];
          const muscle = firstEx ? getMuscleGroup(firstEx.name) : "Altro";
          const icon = getMuscleIcon(muscle);
          const estDuration = calculateEstimatedDuration(r);
          return `
            <div class="card routine-card" data-id="${r.id}" style="position: relative">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
                <div style="display: flex; align-items: center; gap: 15px">
                  <div class="ex-icon" style="background: var(--accent-glow); color: var(--accent-color); font-size: 1.2rem; width: 45px; height: 45px">${icon}</div>
                  <div>
                    <div class="card-title">${r.name}</div>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <div class="card-subtitle">${r.type === 'circuit' ? '🔄 Circuito' : '💪 Standard'} • ${r.exercises.length} esercizi</div>
                      <div class="est-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${estDuration} min
                      </div>
                    </div>
                  </div>
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
          `;
        }).join('')}
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
    _manual: false,
    _multiWeight: Array.isArray(ex.weight),
    _multiReps: Array.isArray(ex.reps),
    notes: ex.notes || ''
  }));
  let currentType = routine.type || 'standard';

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
                <option value="standard" ${currentType === 'standard' ? 'selected' : ''}>Standard 💪</option>
                <option value="circuit" ${currentType === 'circuit' ? 'selected' : ''}>Circuito 🔄</option>
              </select>
            </div>
            <div id="edit-duration-container" style="display: ${currentType === 'circuit' ? 'block' : 'none'}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="edit-routine-duration" value="${routine.duration || 50}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${editExercises.map((ex, i) => {
            const type = currentType;
            if (type === 'circuit') {
              return `
                <div class="card exercise-form-card draggable-item" data-index="${i}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <div style="display: flex; align-items: center">
                      <div class="drag-handle" style="margin-right: 10px">⠿</div>
                      <span class="badge">Esercizio ${i + 1}</span>
                    </div>
                    <button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                  </div>
                  <div style="display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; gap: 10px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${ex.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${ex.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">Peso</div>
                      <input type="number" class="ex-weight-edit" value="${Array.isArray(ex.weight) ? ex.weight[0] : ex.weight}">
                    </div>
                  </div>
                  <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
                </div>
              `;
            }
            return `
            <div class="card exercise-form-card draggable-item" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center">
                  <div class="drag-handle" style="margin-right: 10px">⠿</div>
                  <span class="badge">Esercizio ${i + 1}</span>
                </div>
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
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiReps ? 'Reps fisse' : 'Reps variabili?'}</button>
                  </div>
                  ${ex._multiReps 
                    ? `<div class="multi-reps-grid">
                        ${Array.from({ length: ex.sets }).map((_, si) => `
                          <input type="text" class="ex-reps-set-edit" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.reps) ? (ex.reps[si] || '10') : ex.reps}" placeholder="S${si+1}">
                        `).join('')}
                       </div>`
                    : `<input type="text" class="ex-reps" value="${ex.reps}">`
                  }
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiWeight ? 'Usa carico unico' : 'Carichi diversi?'}</button>
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
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08)">
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  ⚙️ Progressione Esercizio ${ex.progressionType && ex.progressionType !== 'inherit' ? '(Personalizzata)' : '(Eredita)'}
                </button>
                <div class="ex-progression-settings-panel" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; animation: slideUp 0.2s ease-out">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">LOGICA</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionMode || ex.progressionMode === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="mixed" ${ex.progressionMode === 'mixed' ? 'selected' : ''}>Mista (Reps → Peso)</option>
                      <option value="weight-only" ${ex.progressionMode === 'weight-only' ? 'selected' : ''}>Solo Peso</option>
                      <option value="reps-only" ${ex.progressionMode === 'reps-only' ? 'selected' : ''}>Solo Reps</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">APPLICAZIONE PESO</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionType || ex.progressionType === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="all" ${ex.progressionType === 'all' ? 'selected' : ''}>Tutte</option>
                      <option value="last" ${ex.progressionType === 'last' ? 'selected' : ''}>Ultima</option>
                      <option value="first" ${ex.progressionType === 'first' ? 'selected' : ''}>Prima</option>
                      <option value="alternate" ${ex.progressionType === 'alternate' ? 'selected' : ''}>Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">PASSO INCREMENTO</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionStep || ex.progressionStep === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="auto" ${ex.progressionStep === 'auto' ? 'selected' : ''}>🤖 Auto (Muscolo)</option>
                      <option value="1" ${ex.progressionStep == 1 ? 'selected' : ''}>+1 kg</option>
                      <option value="2" ${ex.progressionStep == 2 ? 'selected' : ''}>+2 kg</option>
                      <option value="2.5" ${ex.progressionStep == 2.5 ? 'selected' : ''}>+2.5 kg</option>
                      <option value="5" ${ex.progressionStep == 5 ? 'selected' : ''}>+5 kg</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SOGLIA REPS</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.repsThreshold || ex.repsThreshold === 'inherit' ? 'selected' : ''}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(v => `<option value="${v}" ${ex.repsThreshold == v ? 'selected' : ''}>${v} reps</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
            </div>
          `; }).join('')}
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
    
    initSortable(document.getElementById('exercises-container'), () => {
      syncExercises();
    });

    const typeSelect = document.getElementById('edit-routine-type');
    typeSelect.addEventListener('change', () => {
      syncExercises();
      currentType = typeSelect.value;
      renderForm();
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

    document.querySelectorAll('.toggle-multi-reps-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        editExercises[idx]._multiReps = !editExercises[idx]._multiReps;
        renderForm();
      });
    });

    document.getElementById('add-ex-row-edit').addEventListener('click', () => {
      syncExercises();
      editExercises.push({ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false, notes: '' });
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
          rest: ex.rest || 60,
          notes: ex.notes || '',
          progressionMode: ex.progressionMode || 'inherit',
          progressionType: ex.progressionType || 'inherit',
          progressionStep: ex.progressionStep || 'inherit',
          repsThreshold: ex.repsThreshold || 'inherit',
          repsRange: ex.repsRange || (typeof ex.reps === 'string' && ex.reps.includes('-') ? ex.reps : undefined)
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
    const type = currentType;
    const newOrderExercises = [];
    
    document.querySelectorAll('.exercise-form-card').forEach((card) => {
      const oldIdx = parseInt(card.getAttribute('data-index'));
      const nameEl = card.querySelector('.ex-name');
      const repsEl = card.querySelector('.ex-reps');
      const notesEl = card.querySelector('.notes-input');
      
      const ex = { ...editExercises[oldIdx] };
      ex.name = nameEl ? nameEl.value : '';
      ex.notes = notesEl ? notesEl.value : '';
      
      const progModeEl = card.querySelector('.ex-prog-mode');
      const progTypeEl = card.querySelector('.ex-prog-type');
      const progStepEl = card.querySelector('.ex-prog-step');
      const progThreshEl = card.querySelector('.ex-prog-thresh');
      
      ex.progressionMode = progModeEl ? progModeEl.value : 'inherit';
      ex.progressionType = progTypeEl ? progTypeEl.value : 'inherit';
      ex.progressionStep = progStepEl ? (progStepEl.value === 'inherit' ? 'inherit' : (progStepEl.value === 'auto' ? 'auto' : parseFloat(progStepEl.value))) : 'inherit';
      ex.repsThreshold = progThreshEl ? (progThreshEl.value === 'inherit' ? 'inherit' : parseInt(progThreshEl.value)) : 'inherit';
      
      if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
        ex.repsRange = ex.reps;
      }

      if (type === 'circuit') {
        ex.reps = repsEl ? repsEl.value : '10';
        ex.sets = 1;
        ex.rest = 0;
        ex.weight = parseFloat(card.querySelector('.ex-weight-edit')?.value) || 0;
        ex._multiWeight = false;
        ex._multiReps = false;
      } else {
        const muscleEl = card.querySelector('.ex-muscle');
        ex._muscle = muscleEl ? muscleEl.value : (ex._muscle || '');
        ex.sets = parseInt(card.querySelector('.ex-sets').value) || 3;
        ex.rest = parseInt(card.querySelector('.ex-rest').value) || 60;

        // Reps
        const multiRepsInputs = card.querySelectorAll('.ex-reps-set-edit');
        if (multiRepsInputs.length > 0) {
          ex.reps = Array.from(multiRepsInputs).map(inp => inp.value || '10');
          ex._multiReps = true;
        } else {
          ex.reps = repsEl ? repsEl.value : '10';
          ex._multiReps = false;
        }

        // Weight
        const multiWeightInputs = card.querySelectorAll('.ex-weight-set-edit');
        if (multiWeightInputs.length > 0) {
          ex.weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
          ex._multiWeight = true;
        } else {
          const singleWeightInput = card.querySelector('.ex-weight-edit');
          ex.weight = parseFloat(singleWeightInput ? singleWeightInput.value : 0) || 0;
          ex._multiWeight = false;
        }
      }
      newOrderExercises.push(ex);
    });
    editExercises = newOrderExercises;
  };

  renderForm();
};

const renderAddRoutine = (initialExercises = null) => {
  let newExercises = initialExercises ? initialExercises.map(ex => ({
    ...ex,
    _muscle: getMuscleGroup(ex.name),
    _manual: false,
    _multiWeight: Array.isArray(ex.weight),
    _multiReps: Array.isArray(ex.reps),
    notes: ex.notes || ''
  })) : [{ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false, notes: '' }];
  let currentType = 'standard';
  let currentDuration = 50;

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
                <option value="standard" ${currentType === 'standard' ? 'selected' : ''}>Standard 💪</option>
                <option value="circuit" ${currentType === 'circuit' ? 'selected' : ''}>Circuito 🔄</option>
              </select>
            </div>
            <div id="duration-container" style="display: ${currentType === 'circuit' ? 'block' : 'none'}">
              <div class="card-subtitle">Durata (min)</div>
              <input type="number" id="routine-duration-input" value="${currentDuration}">
            </div>
          </div>
        </div>

        <div id="exercises-container">
          ${newExercises.map((ex, i) => {
            const type = currentType;
            if (type === 'circuit') {
              return `
                <div class="card exercise-form-card draggable-item" data-index="${i}" style="border-left: 3px solid var(--accent-color)">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                    <div style="display: flex; align-items: center">
                      <div class="drag-handle" style="margin-right: 10px">⠿</div>
                      <span class="badge">Esercizio ${i + 1}</span>
                    </div>
                    <button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                  </div>
                  <div style="display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; gap: 10px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${ex.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${ex.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">Peso</div>
                      <input type="number" class="ex-weight-init" value="${Array.isArray(ex.weight) ? ex.weight[0] : ex.weight}">
                    </div>
                  </div>
                  <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
                </div>
              `;
            }
            return `
            <div class="card exercise-form-card draggable-item" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center">
                  <div class="drag-handle" style="margin-right: 10px">⠿</div>
                  <span class="badge">Esercizio ${i + 1}</span>
                </div>
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
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiReps ? 'Reps fisse' : 'Reps variabili?'}</button>
                  </div>
                  ${ex._multiReps 
                    ? `<div class="multi-reps-grid">
                        ${Array.from({ length: ex.sets }).map((_, si) => `
                          <input type="text" class="ex-reps-set" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.reps) ? (ex.reps[si] || '10') : ex.reps}" placeholder="S${si+1}">
                        `).join('')}
                       </div>`
                    : `<input type="text" class="ex-reps" value="${ex.reps}">`
                  }
                </div>
              </div>

              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                  <div class="card-subtitle">Carico (kg)</div>
                  <button class="toggle-multi-weight" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">${ex._multiWeight ? 'Usa carico unico' : 'Carichi diversi?'}</button>
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
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08)">
                <button type="button" class="toggle-ex-progression-btn" style="background: none; border: none; color: var(--accent-color); font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 700; padding: 0" onclick="const p = this.nextElementSibling; p.style.display = p.style.display === 'none' ? 'grid' : 'none';">
                  ⚙️ Progressione Esercizio ${ex.progressionType && ex.progressionType !== 'inherit' ? '(Personalizzata)' : '(Eredita)'}
                </button>
                <div class="ex-progression-settings-panel" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; animation: slideUp 0.2s ease-out">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">LOGICA</div>
                    <select class="ex-prog-mode" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionMode || ex.progressionMode === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="mixed" ${ex.progressionMode === 'mixed' ? 'selected' : ''}>Mista (Reps → Peso)</option>
                      <option value="weight-only" ${ex.progressionMode === 'weight-only' ? 'selected' : ''}>Solo Peso</option>
                      <option value="reps-only" ${ex.progressionMode === 'reps-only' ? 'selected' : ''}>Solo Reps</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">APPLICAZIONE PESO</div>
                    <select class="ex-prog-type" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionType || ex.progressionType === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="all" ${ex.progressionType === 'all' ? 'selected' : ''}>Tutte</option>
                      <option value="last" ${ex.progressionType === 'last' ? 'selected' : ''}>Ultima</option>
                      <option value="first" ${ex.progressionType === 'first' ? 'selected' : ''}>Prima</option>
                      <option value="alternate" ${ex.progressionType === 'alternate' ? 'selected' : ''}>Alternate</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">PASSO INCREMENTO</div>
                    <select class="ex-prog-step" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.progressionStep || ex.progressionStep === 'inherit' ? 'selected' : ''}>Eredita</option>
                      <option value="auto" ${ex.progressionStep === 'auto' ? 'selected' : ''}>🤖 Auto (Muscolo)</option>
                      <option value="1" ${ex.progressionStep == 1 ? 'selected' : ''}>+1 kg</option>
                      <option value="2" ${ex.progressionStep == 2 ? 'selected' : ''}>+2 kg</option>
                      <option value="2.5" ${ex.progressionStep == 2.5 ? 'selected' : ''}>+2.5 kg</option>
                      <option value="5" ${ex.progressionStep == 5 ? 'selected' : ''}>+5 kg</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px">SOGLIA REPS</div>
                    <select class="ex-prog-thresh" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="inherit" ${!ex.repsThreshold || ex.repsThreshold === 'inherit' ? 'selected' : ''}>Eredita</option>
                      ${[5,6,7,8,9,10,11,12,13,14,15].map(v => `<option value="${v}" ${ex.repsThreshold == v ? 'selected' : ''}>${v} reps</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
            </div>
          `; }).join('')}
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

    initSortable(document.getElementById('exercises-container'), () => {
      syncExercises();
    });

    const typeSelect = document.getElementById('routine-type-select');
    typeSelect.addEventListener('change', () => {
      syncExercises();
      currentType = typeSelect.value;
      renderForm();
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

    document.querySelectorAll('.toggle-multi-reps').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        newExercises[idx]._multiReps = !newExercises[idx]._multiReps;
        renderForm();
      });
    });

    document.getElementById('add-ex-row').addEventListener('click', () => {
      syncExercises();
      newExercises.push({ name: '', sets: 3, reps: '10', weight: 0, rest: 60, _muscle: '', _manual: false, notes: '' });
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
          rest: ex.rest || 60,
          notes: ex.notes || '',
          progressionMode: ex.progressionMode || 'inherit',
          progressionType: ex.progressionType || 'inherit',
          progressionStep: ex.progressionStep || 'inherit',
          repsThreshold: ex.repsThreshold || 'inherit',
          repsRange: ex.repsRange || (typeof ex.reps === 'string' && ex.reps.includes('-') ? ex.reps : undefined)
        }))
      };

      if (newRoutine.exercises.length === 0) return alert('Aggiungi e compila almeno un esercizio');

      routines.push(newRoutine);
      storage.saveRoutines(routines);
      renderRoutines();
    });
  };

  const syncExercises = () => {
    const type = currentType;
    if (document.getElementById('routine-duration-input')) {
      currentDuration = parseInt(document.getElementById('routine-duration-input').value) || 50;
    }
    
    const newOrderExercises = [];
    document.querySelectorAll('.exercise-form-card').forEach((card) => {
      const oldIdx = parseInt(card.getAttribute('data-index'));
      const nameEl = card.querySelector('.ex-name');
      const repsEl = card.querySelector('.ex-reps');
      const notesEl = card.querySelector('.notes-input');
      
      const ex = { ...newExercises[oldIdx] };
      ex.name = nameEl ? nameEl.value : '';
      ex.notes = notesEl ? notesEl.value : '';
      
      const progModeEl = card.querySelector('.ex-prog-mode');
      const progTypeEl = card.querySelector('.ex-prog-type');
      const progStepEl = card.querySelector('.ex-prog-step');
      const progThreshEl = card.querySelector('.ex-prog-thresh');
      
      ex.progressionMode = progModeEl ? progModeEl.value : 'inherit';
      ex.progressionType = progTypeEl ? progTypeEl.value : 'inherit';
      ex.progressionStep = progStepEl ? (progStepEl.value === 'inherit' ? 'inherit' : (progStepEl.value === 'auto' ? 'auto' : parseFloat(progStepEl.value))) : 'inherit';
      ex.repsThreshold = progThreshEl ? (progThreshEl.value === 'inherit' ? 'inherit' : parseInt(progThreshEl.value)) : 'inherit';
      
      if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
        ex.repsRange = ex.reps;
      }

      if (type === 'circuit') {
        ex.sets = 1;
        ex.rest = 0;
        ex.reps = repsEl ? repsEl.value : '10';
        ex.weight = parseFloat(card.querySelector('.ex-weight-init')?.value) || 0;
        ex._multiWeight = false;
        ex._multiReps = false;
      } else {
        const muscleEl = card.querySelector('.ex-muscle');
        ex._muscle = muscleEl ? muscleEl.value : (ex._muscle || '');
        ex.sets = parseInt(card.querySelector('.ex-sets').value) || 3;
        ex.rest = parseInt(card.querySelector('.ex-rest').value) || 60;

        // Reps
        const multiRepsInputs = card.querySelectorAll('.ex-reps-set');
        if (multiRepsInputs.length > 0) {
          ex.reps = Array.from(multiRepsInputs).map(inp => inp.value || '10');
          ex._multiReps = true;
        } else {
          ex.reps = repsEl ? repsEl.value : '10';
          ex._multiReps = false;
        }

        // Weight
        const multiWeightInputs = card.querySelectorAll('.ex-weight-set');
        if (multiWeightInputs.length > 0) {
          ex.weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
          ex._multiWeight = true;
        } else {
          const singleWeightInput = card.querySelector('.ex-weight-init');
          ex.weight = parseFloat(singleWeightInput ? singleWeightInput.value : 0) || 0;
          ex._multiWeight = false;
        }
      }
      newOrderExercises.push(ex);
    });
    newExercises = newOrderExercises;
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
        ${routine.exercises.map(ex => {
          const muscle = getMuscleGroup(ex.name);
          const icon = getMuscleIcon(muscle);
          return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; align-items: center">
              <span style="display: flex; align-items: center">
                <span class="ex-icon" style="font-size: 0.9rem; width: 24px; height: 24px; margin-right: 8px; background: rgba(255,255,255,0.03)">${icon}</span>
                ${ex.name}
              </span>
              <span style="color: var(--text-secondary)">${ex.sets}x${ex.reps}</span>
            </div>
          `;
        }).join('')}
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
    // Sblocchiamo l'audio al tocco dell'utente
    unlockAudio();

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

const renderCircuitSession = (routineId, isResume = false) => {
  const routine = routines.find(r => r.id == routineId);
  const durationMin = routine.duration || 50;
  
  let endTime;
  let rounds = 0;
  let activeExerciseIdx = 0;
  let circuitAlarmPlayed = false;
  
  if (isResume && pausedWorkout && pausedWorkout.type === 'circuit' && pausedWorkout.routineId == routineId) {
    endTime = Date.now() + (pausedWorkout.curTimeLeft * 1000);
    rounds = pausedWorkout.rounds;
    activeExerciseIdx = pausedWorkout.activeExerciseIdx;
  } else {
    endTime = Date.now() + (durationMin * 60 * 1000);
  }
  
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
        <div id="round-count" class="round-number">${rounds}</div>
        <button class="btn pulse" id="round-completed" style="margin-top: 15px">GIRO COMPLETATO! 🔥</button>
      </div>

      <div style="padding: 0 16px 10px">
        <div class="card-subtitle">LISTA ESERCIZI</div>
      </div>
      
      <div class="circuit-list">
        ${routine.exercises.map((ex, i) => {
          const muscle = getMuscleGroup(ex.name);
          const icon = getMuscleIcon(muscle);
          return `
            <div class="circuit-item ${i === activeExerciseIdx ? 'active' : ''}" data-idx="${i}">
              <div style="display: flex; align-items: center; gap: 10px">
                <span class="ex-icon" style="background: var(--accent-glow); width: 28px; height: 28px; font-size: 0.9rem; margin-right: 0">${icon}</span>
                <div style="font-weight: 600">${ex.name}</div>
              </div>
              <div style="color: var(--accent-color); font-weight: 800">${ex.reps}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="padding: 24px 16px">
        <button class="btn btn-secondary" id="finish-circuit">Concludi Allenamento</button>
      </div>
    </div>
  `;

  const roundDisplay = document.getElementById('round-count');
  
  const updateTimer = () => {
    const timerDisplay = document.getElementById('circuit-timer');
    if (!timerDisplay) {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      return;
    }

    const curTimeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const m = Math.floor(curTimeLeft / 60).toString().padStart(2, '0');
    const s = (curTimeLeft % 60).toString().padStart(2, '0');
    timerDisplay.innerText = `${m}:${s}`;

    if (curTimeLeft <= 0) {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      timerDisplay.innerText = "TEMPO SCADUTO!";
      timerDisplay.style.color = "var(--danger)";
      if (!circuitAlarmPlayed) {
        playAlarm();
        circuitAlarmPlayed = true;
      }
    }
  };

  activeTimerSyncFn = updateTimer;
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(updateTimer, 1000);
  updateTimer();

  activeWorkoutHandler = {
    interrupt: () => {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      pausedWorkout = null;
      storage.savePausedWorkout(null);
    },
    pause: () => {
      const curTimeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      pausedWorkout = { type: 'circuit', routineId, curTimeLeft, rounds, activeExerciseIdx };
      storage.savePausedWorkout(pausedWorkout);
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
    }
  };

  document.getElementById('cancel-circuit').addEventListener('click', () => {
    showWorkoutInterruptModal(
      () => {
        activeWorkoutHandler.interrupt();
        activeWorkoutHandler = null;
        renderRoutines();
      },
      () => {
        activeWorkoutHandler.pause();
        activeWorkoutHandler = null;
        switchView('dashboard');
      }
    );
  });

  document.getElementById('rest-trigger').addEventListener('click', () => {
    unlockAudio();
    showRestTimer(30);
  });

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
    activeTimerSyncFn = null;
    
    const curTimeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const durationStr = `${durationMin - Math.floor(curTimeLeft / 60)} min`;
    
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
    pausedWorkout = null;
    storage.savePausedWorkout(null);
    activeWorkoutHandler = null;
    switchView('dashboard');
  });
};

const renderWorkoutSession = (routineId, isResume = false) => {
    const routine = routines.find(r => r.id == routineId);
    if (!routine) return;

    let sessionExercises = JSON.parse(JSON.stringify(routine.exercises)); // Deep copy
    if (isResume && pausedWorkout && pausedWorkout.type === 'standard' && pausedWorkout.routineId == routineId) {
      workoutStartTime = Date.now() - (pausedWorkout.elapsedSeconds * 1000);
    } else {
      workoutStartTime = Date.now();
    }

  const syncSessionExercises = () => {
    document.querySelectorAll('#active-exercises-list .card').forEach((card, idx) => {
      const exIdx = parseInt(card.getAttribute('data-idx'));
      const ex = sessionExercises[exIdx];
      const rows = card.querySelectorAll('.set-row');
      
      rows.forEach((row, ri) => {
        const weightInput = row.querySelector('.log-weight');
        const repsInput = row.querySelector('.log-reps');
        
        if (Array.isArray(ex.weight)) {
          ex.weight[ri] = parseFloat(weightInput.value) || 0;
        } else {
          ex.weight = parseFloat(weightInput.value) || 0;
        }

        if (Array.isArray(ex.reps)) {
          ex.reps[ri] = repsInput.value || '10';
        } else {
          ex.reps = repsInput.value || '10';
        }
        
        // Mantieni anche lo stato di completamento se possibile
        if (row.style.opacity === '0.5') {
          row.dataset.completed = 'true';
        }
      });
    });
  };

  const renderActiveSession = () => {
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

        <div id="active-exercises-list">
          ${sessionExercises.map((ex, idx) => {
            const muscle = getMuscleGroup(ex.name);
            const icon = getMuscleIcon(muscle);
            const hasPositiveFeedback = ex.hadPositiveFeedback === true;
            return `
              <div class="card draggable-item" data-idx="${idx}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                  <div class="card-title" style="color: var(--accent-color); display: flex; align-items: center; gap: 10px; margin: 0; width: 100%">
                    <span class="ex-icon" style="background: var(--accent-glow); width: 32px; height: 32px; font-size: 1rem">${icon}</span>
                    <span style="flex: 1">${ex.name}</span>
                    ${hasPositiveFeedback ? `<span class="badge" style="background: rgba(0, 255, 136, 0.12); color: var(--success); border: 1px solid var(--success); font-size: 0.65rem; padding: 2px 6px; text-transform: uppercase; font-weight: 800; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px">Carico Facile 👍</span>` : ''}
                  </div>
                  <div class="drag-handle">⠿</div>
                </div>
                
                <div class="card-subtitle">${ex.sets} serie × ${Array.isArray(ex.reps) ? ex.reps.join('-') : ex.reps}</div>
                
                ${ex.notes ? `<div class="notes-display">📝 ${ex.notes}</div>` : ''}

                <div style="margin-top: 15px">
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; text-align: center; color: var(--text-secondary); font-size: 0.7rem; margin-bottom: 5px">
                    <div>SET</div>
                    <div>KG</div>
                    <div>REPS</div>
                    <div></div>
                  </div>
                  ${Array.from({ length: ex.sets }).map((_, i) => {
                    const savedSet = (isResume && pausedWorkout && pausedWorkout.savedExercises[idx] && pausedWorkout.savedExercises[idx].sets[i]) ? pausedWorkout.savedExercises[idx].sets[i] : null;
                    const isCompleted = savedSet ? savedSet.completed : false;
                    const w = savedSet ? savedSet.weight : (Array.isArray(ex.weight) ? (ex.weight[i] || ex.weight[0] || 0) : ex.weight);
                    const r = savedSet ? savedSet.reps : (Array.isArray(ex.reps) ? (ex.reps[i] || ex.reps[0] || '10') : ex.reps);
                    return `
                    <div class="set-row" data-ex-idx="${idx}" style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; gap: 8px; margin-bottom: 8px; transition: opacity 0.3s; opacity: ${isCompleted ? '0.5' : '1'}">
                      <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 8px">${i + 1}</div>
                      <input type="number" value="${w}" style="margin: 0; text-align: center; transition: background 0.3s; ${hasPositiveFeedback ? 'border-color: var(--success); background: rgba(0, 255, 136, 0.06); color: #fff; box-shadow: 0 0 6px rgba(0, 255, 136, 0.15);' : ''}" class="log-weight">
                      <input type="text" value="${r}" style="margin: 0; text-align: center; transition: background 0.3s" class="log-reps">
                      <button class="check-set-btn" style="background: ${isCompleted ? 'var(--accent-color)' : 'transparent'}; border: 2px solid var(--accent-color); border-radius: 8px; color: ${isCompleted ? '#000' : 'var(--accent-color)'}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </button>
                    </div>
                  `;
                  }).join('')}
                </div>

                <div class="exercise-feedback" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Com'è andato l'esercizio?</div>
                  <div style="display: flex; gap: 10px">
                    <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer">👍 Bene</button>
                    <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer">👎 Fatica</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="padding: 16px">
          <button class="btn" id="finish-workout" style="background: var(--success)">
            Concludi Allenamento
          </button>
        </div>
      </div>
    `;

  const updateWorkoutTimer = () => {
    const display = document.getElementById('workout-timer-display');
    if (!display) {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      return;
    }
    const now = Date.now();
    const diff = Math.floor((now - workoutStartTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    display.innerText = `${m}:${s}`;
  };

  activeTimerSyncFn = updateWorkoutTimer;
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(updateWorkoutTimer, 1000);

  activeWorkoutHandler = {
    interrupt: () => {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      pausedWorkout = null;
      storage.savePausedWorkout(null);
    },
    pause: () => {
      const savedExercises = [];
      document.querySelectorAll('#active-exercises-list .card').forEach(card => {
        const sets = [];
        card.querySelectorAll('.set-row').forEach(row => {
          sets.push({
            weight: row.querySelector('.log-weight').value,
            reps: row.querySelector('.log-reps').value,
            completed: row.style.opacity === '0.5'
          });
        });
        savedExercises.push({ sets });
      });
      const elapsedSeconds = Math.floor((Date.now() - workoutStartTime) / 1000);
      pausedWorkout = { type: 'standard', routineId, elapsedSeconds, savedExercises };
      storage.savePausedWorkout(pausedWorkout);
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
    }
  };

    document.getElementById('back-to-routines').addEventListener('click', () => {
      showWorkoutInterruptModal(
        () => {
          activeWorkoutHandler.interrupt();
          activeWorkoutHandler = null;
          renderRoutines();
        },
        () => {
          activeWorkoutHandler.pause();
          activeWorkoutHandler = null;
          switchView('dashboard');
        }
      );
    });
    document.getElementById('rest-trigger').addEventListener('click', () => {
      unlockAudio();
      showRestTimer(60);
    });
    
    initSortable(document.getElementById('active-exercises-list'), () => {
      // Reordering in session doesn't need to update original routine
    });

    // Logica per spuntare le serie
    document.querySelectorAll('.check-set-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        unlockAudio();
        const row = e.target.closest('.set-row');
        const isCompleted = row.style.opacity === '0.5';
        
        if (!isCompleted) {
          row.style.opacity = '0.5';
          btn.style.background = 'var(--accent-color)';
          btn.style.color = '#000';
          
          const exIdx = row.getAttribute('data-ex-idx');
          const restSeconds = sessionExercises[exIdx].rest || 60;
          showRestTimer(restSeconds);
        } else {
          row.style.opacity = '1';
          btn.style.background = 'transparent';
          btn.style.color = 'var(--accent-color)';
        }

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
      
      document.querySelectorAll('#active-exercises-list .card').forEach((card) => {
        const name = card.querySelector('.card-title')?.innerText.replace(/[^\x00-\x7F]/g, "").trim(); 
        if (!name) return;

        const sets = [];
        card.querySelectorAll('.set-row').forEach((row) => {
          if (row.style.opacity === '0.5') {
            sets.push({
              weight: parseFloat(row.querySelector('.log-weight').value) || 0,
              reps: row.querySelector('.log-reps').value || '0'
            });
          }
        });

        if (sets.length > 0) {
          exerciseData.push({
            name,
            sets,
            feedback: card.getAttribute('data-feedback') || 'neutral'
          });
        }
      });

      if (exerciseData.length === 0) return alert('Non hai completato alcun esercizio!');

      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      const totalTime = document.getElementById('workout-timer-display').innerText;

      storage.saveLog({
        routineName: routine.name,
        date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        timestamp: Date.now(),
        duration: totalTime,
        type: 'standard',
        exercises: exerciseData
      });

      // --- PERSISTENZA E PROGRESSIONE CARICHI ---
      const originalRoutine = routines.find(r => r.id == routineId);
      let deloadExercises = [];
      
      if (originalRoutine) {
        exerciseData.forEach(sessionEx => {
          const routineEx = originalRoutine.exercises.find(re => re.name === sessionEx.name);
          if (routineEx) {
            const isPositive = sessionEx.feedback === 'positive';
            const isNegative = sessionEx.feedback === 'negative';
            
            // Salva il feedback per l'evidenziazione la volta successiva
            routineEx.hadPositiveFeedback = isPositive;

            const sessionWeights = sessionEx.sets.map(s => parseFloat(s.weight) || 0);
            const sessionReps = sessionEx.sets.map(s => s.reps);

            // Gestione autoregolazione (consecutive negatives)
            if (user.progressionEnabled !== false && isNegative) {
              routineEx.consecutiveNegatives = (routineEx.consecutiveNegatives || 0) + 1;
              if (routineEx.consecutiveNegatives >= 3) {
                deloadExercises.push(routineEx);
              }
            } else {
              routineEx.consecutiveNegatives = 0;
            }

            // Se progressione è disattivata globalmente, salviamo semplicemente i dati dell'allenamento senza progredire
            if (user.progressionEnabled === false) {
              if (Array.isArray(routineEx.weight)) {
                routineEx.weight = sessionWeights;
              } else {
                routineEx.weight = Math.max(...sessionWeights);
              }
              if (Array.isArray(routineEx.reps)) {
                routineEx.reps = sessionReps;
              } else {
                routineEx.reps = sessionReps[0] || '10';
              }
              return;
            }

            // Risolvi parametri progressione specifici o globali
            const { type: progressionType, step: progressionStep, repsThresh, mode: progressionMode } = resolveExerciseProgression(routineEx, user);

            // 1. MODALITA' SOLO REPS
            if (progressionMode === 'reps-only') {
              if (Array.isArray(routineEx.weight)) {
                routineEx.weight = sessionWeights;
              } else {
                routineEx.weight = Math.max(...sessionWeights);
              }
              if (isPositive) {
                if (Array.isArray(routineEx.reps)) {
                  routineEx.reps = sessionReps.map(r => {
                    const rNum = parseInt(r) || 0;
                    return String(Math.min(15, rNum + 1));
                  });
                } else {
                  const rNum = parseInt(sessionReps[0]) || 0;
                  routineEx.reps = String(Math.min(15, rNum + 1));
                }
              } else {
                if (Array.isArray(routineEx.reps)) {
                  routineEx.reps = sessionReps;
                } else {
                  routineEx.reps = sessionReps[0] || '10';
                }
              }
              return;
            }

            // 2. MODALITA' SOLO PESO
            if (progressionMode === 'weight-only') {
              if (isPositive) {
                if (Array.isArray(routineEx.weight) || progressionType !== 'all') {
                  routineEx.weight = sessionWeights.map((w, index) => {
                    let applyIncrement = false;
                    if (progressionType === 'all') applyIncrement = true;
                    else if (progressionType === 'last') applyIncrement = (index === sessionWeights.length - 1);
                    else if (progressionType === 'first') applyIncrement = (index === 0);
                    else if (progressionType === 'alternate') applyIncrement = (index % 2 === 0);
                    return w + (applyIncrement ? progressionStep : 0);
                  });
                } else {
                  routineEx.weight = Math.max(...sessionWeights) + progressionStep;
                }
              } else {
                if (Array.isArray(routineEx.weight)) {
                  routineEx.weight = sessionWeights;
                } else {
                  routineEx.weight = Math.max(...sessionWeights);
                }
              }
              if (Array.isArray(routineEx.reps)) {
                routineEx.reps = sessionReps;
              } else {
                routineEx.reps = sessionReps[0] || '10';
              }
              return;
            }

            // 3. MODALITA' MISTA (Standard & Double Progression)
            const range = parseRepsRange(routineEx.repsRange);

            if (range) {
              // Logica Doppia Progressione
              let hitMaxRepsAllSets = true;
              sessionReps.forEach(r => {
                if (parseInt(r) < range.max) hitMaxRepsAllSets = false;
              });

              if (isPositive && hitMaxRepsAllSets) {
                // Incrementa peso e resetta reps al minimo
                if (Array.isArray(routineEx.weight) || progressionType !== 'all') {
                  routineEx.weight = sessionWeights.map((w, index) => {
                    let applyIncrement = false;
                    if (progressionType === 'all') applyIncrement = true;
                    else if (progressionType === 'last') applyIncrement = (index === sessionWeights.length - 1);
                    else if (progressionType === 'first') applyIncrement = (index === 0);
                    else if (progressionType === 'alternate') applyIncrement = (index % 2 === 0);
                    return w + (applyIncrement ? progressionStep : 0);
                  });
                } else {
                  routineEx.weight = Math.max(...sessionWeights) + progressionStep;
                }

                // Resetta reps al minimo per la prossima sessione
                if (Array.isArray(routineEx.reps)) {
                  routineEx.reps = Array(routineEx.sets || sessionReps.length).fill(String(range.min));
                } else {
                  routineEx.reps = String(range.min);
                }
              } else {
                // Non progredisce col peso, salva carichi e ripetizioni ottenute
                if (Array.isArray(routineEx.weight)) {
                  routineEx.weight = sessionWeights;
                } else {
                  routineEx.weight = Math.max(...sessionWeights);
                }
                
                if (Array.isArray(routineEx.reps)) {
                  routineEx.reps = sessionReps;
                } else {
                  routineEx.reps = sessionReps[0] || String(range.min);
                }
              }
            } else {
              // Logica Progressione Standard (con repsThreshold)
              let shouldIncreaseReps = false;
              if (isPositive) {
                sessionReps.forEach(r => {
                  if (parseInt(r) < repsThresh) shouldIncreaseReps = true;
                });
              }

              // Progressione dei carichi
              if (isPositive && !shouldIncreaseReps) {
                if (Array.isArray(routineEx.weight) || progressionType !== 'all') {
                  routineEx.weight = sessionWeights.map((w, index) => {
                    let applyIncrement = false;
                    if (progressionType === 'all') applyIncrement = true;
                    else if (progressionType === 'last') applyIncrement = (index === sessionWeights.length - 1);
                    else if (progressionType === 'first') applyIncrement = (index === 0);
                    else if (progressionType === 'alternate') applyIncrement = (index % 2 === 0);
                    return w + (applyIncrement ? progressionStep : 0);
                  });
                } else {
                  routineEx.weight = Math.max(...sessionWeights) + progressionStep;
                }
              } else {
                if (Array.isArray(routineEx.weight)) {
                  routineEx.weight = sessionWeights;
                } else {
                  routineEx.weight = Math.max(...sessionWeights);
                }
              }

              // Progressione delle reps
              if (Array.isArray(routineEx.reps)) {
                routineEx.reps = sessionReps.map(r => {
                  const rNum = parseInt(r) || 0;
                  if (isPositive && shouldIncreaseReps && rNum < repsThresh) return String(repsThresh);
                  return r;
                });
              } else {
                const rNum = parseInt(sessionReps[0]) || 0;
                if (isPositive && shouldIncreaseReps && rNum < repsThresh) {
                  routineEx.reps = String(repsThresh);
                } else {
                  routineEx.reps = sessionReps[0] || '10';
                }
              }
            }
          }
        });
        storage.saveRoutines(routines);
      }
      // ----------------------------------------

      logs = storage.getLogs();
      pausedWorkout = null;
      storage.savePausedWorkout(null);
      activeWorkoutHandler = null;

      if (deloadExercises.length > 0) {
        const exNames = deloadExercises.map(e => e.name).join(', ');
        showConfirmModal(
          "🧠 Scarico Consigliato",
          `Abbiamo notato che hai accumulato molta fatica su: <strong>${exNames}</strong> negli ultimi 3 allenamenti.<br><br>Ti consigliamo una sessione di <strong>scarico attivo (-10% peso)</strong> per permettere il recupero e superare lo stallo. Vuoi applicarla?`,
          () => {
            deloadExercises.forEach(routineEx => {
              if (Array.isArray(routineEx.weight)) {
                routineEx.weight = routineEx.weight.map(w => Math.round(w * 0.9 * 2) / 2); // arrotonda a passi di 0.5 kg/lbs
              } else {
                routineEx.weight = Math.round(routineEx.weight * 0.9 * 2) / 2;
              }
              routineEx.consecutiveNegatives = 0; // resetta contatore
            });
            storage.saveRoutines(routines);
            alert('Scarico applicato con successo! La prossima sessione sarà più leggera per favorire il recupero. 🏋️‍♂️');
            switchView('dashboard');
          },
          () => {
            switchView('dashboard');
          }
        );
      } else {
        alert('Allenamento salvato con successo! 🎉');
        switchView('dashboard');
      }
    });
  };

  const updateWorkoutTimer = () => {
    const display = document.getElementById('workout-timer-display');
    if (!display) {
      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      return;
    }
    const now = Date.now();
    const diff = Math.floor((now - workoutStartTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    display.innerText = `${m}:${s}`;
  };

  activeTimerSyncFn = updateWorkoutTimer;
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(updateWorkoutTimer, 1000);

  renderActiveSession();
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

  const routine = routines.find(r => r.name === log.routineName);

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
        ${routine ? `
          <button id="overload-weights-btn" class="btn" style="background: var(--accent-color); color: #000; margin-top: 15px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3L21 7L17 11M7 21L3 17L7 13M21 7H9M3 17H15"/></svg>
            Sovraccarica carichi su scheda
          </button>
        ` : ''}
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

  if (routine) {
    const overloadBtn = document.getElementById('overload-weights-btn');
    if (overloadBtn) {
      overloadBtn.addEventListener('click', () => {
        showConfirmModal(
          "Sovraccarica Carichi",
          `Sei sicuro di voler sovraccaricare i carichi di questo allenamento sulla tua scheda attiva "${log.routineName}"? Questa operazione sovrascriverà i carichi correnti.`,
          () => {
            let updatedCount = 0;
            log.exercises.forEach(histEx => {
              const routineEx = routine.exercises.find(re => re.name === histEx.name);
              if (routineEx) {
                const histWeights = histEx.sets.map(s => parseFloat(s.weight) || 0);
                if (Array.isArray(routineEx.weight) || histWeights.length > 1) {
                  const newWeights = [];
                  for (let i = 0; i < routineEx.sets; i++) {
                    newWeights.push(histWeights[i] !== undefined ? histWeights[i] : (histWeights[histWeights.length - 1] || 0));
                  }
                  routineEx.weight = newWeights;
                } else {
                  routineEx.weight = histWeights[0] || 0;
                }
                updatedCount++;
              }
            });
            storage.saveRoutines(routines);
            alert(`Carichi aggiornati con successo su "${log.routineName}" (${updatedCount} esercizi modificati)! 🎉`);
            renderWorkoutDetails(logIdx);
          }
        );
      });
    }
  }
};

const renderProgress = () => {
  const renderProfile = () => {
    app.innerHTML = `
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
              <div class="card-title">${user.name} ${user.surname}</div>
              <div class="card-subtitle">"${user.nickname}" • ${user.gender === 'male' ? 'Uomo' : 'Donna'}</div>
            </div>
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
              ${getUniqueExercises().map(ex => `<option value="${ex}">${ex}</option>`).join('')}
            </select>
          </div>
          <canvas id="progressChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${getUniqueExercises().length > 0 ? 'display:none' : ''}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <!-- Volume Chart -->
        <div class="card">
          <div class="card-title" style="margin-bottom: 15px">Volume Totale Sollevato (kg)</div>
          <canvas id="volumeChart" style="width: 100%; height: 200px"></canvas>
          <div id="no-volume-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${logs.length > 0 ? 'display:none' : ''}">
            Nessun volume registrato.
          </div>
        </div>

      </div>
    `;

    renderCalendar();

    document.getElementById('show-changelog').addEventListener('click', () => renderChangelog());
    document.getElementById('open-settings').addEventListener('click', () => renderSettings());
    
    const select = document.getElementById('exercise-select');
    if (select) {
      const uniqueEx = getUniqueExercises();
      if (uniqueEx.length > 0) {
        const randomEx = uniqueEx[Math.floor(Math.random() * uniqueEx.length)];
        select.value = randomEx;
        updateChart(randomEx);
      }
      select.addEventListener('change', (e) => {
        updateChart(e.target.value);
      });
    }

    updateVolumeChart();
  };

  const renderCalendar = () => {
    const mount = document.getElementById('calendar-mount');
    if (!mount) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Converti giorni logs in un set di date (YYYY-MM-DD)
    const workoutDates = new Set(logs.map(log => {
      if (!log.timestamp) return null;
      const d = new Date(log.timestamp);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }).filter(d => d));

    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    let html = `
      <div class="calendar-container">
        <div class="calendar-header">
          <span style="font-weight: 700; text-transform: capitalize">${new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(now)}</span>
        </div>
        <div class="calendar-grid">
          ${dayNames.map(d => `<div class="calendar-day-name">${d}</div>`).join('')}
    `;

    // Giorni vuoti prima dell'inizio del mese (aggiustato per Lunedì come primo giorno)
    const emptyDays = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < emptyDays; i++) {
      html += `<div class="calendar-day empty"></div>`;
    }

    // Giorni del mese
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const isToday = d === now.getDate();
      const hasWorkout = workoutDates.has(dateStr);
      
      html += `
        <div class="calendar-day ${isToday ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}">
          ${d}
        </div>
      `;
    }

    html += `</div></div>`;
    mount.innerHTML = html;
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
        const maxWeight = Array.isArray(ex.sets) 
          ? Math.max(...ex.sets.map(s => s.weight))
          : (typeof ex.weight === 'number' ? ex.weight : 0);
        return { date: log.date, weight: maxWeight };
      })
      .reverse();

    const ctx = document.getElementById('progressChart').getContext('2d');
    if (window.currentChart) window.currentChart.destroy();

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#ccff00';

    window.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.date),
        datasets: [{
          label: 'Peso Massimo (kg)',
          data: chartData.map(d => d.weight),
          borderColor: accentColor,
          backgroundColor: accentColor + '1a', // 10% opacity
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: accentColor,
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

  const updateVolumeChart = () => {
    const ctx = document.getElementById('volumeChart')?.getContext('2d');
    if (!ctx) return;
    
    const volumeData = logs.map(log => {
      let volume = 0;
      if (log.exercises) {
        log.exercises.forEach(ex => {
          if (ex.sets) {
            ex.sets.forEach(s => {
              const w = parseFloat(s.weight) || 0;
              const r = parseInt(s.reps) || 0;
              volume += w * r;
            });
          }
        });
      }
      return { date: log.date, volume };
    }).reverse().slice(-10); // Show last 10 workouts

    if (window.volumeChartInstance) window.volumeChartInstance.destroy();

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#ccff00';

    window.volumeChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: volumeData.map(d => d.date),
        datasets: [{
          label: 'Volume (kg x reps)',
          data: volumeData.map(d => d.volume),
          backgroundColor: accentColor + '80', // 50% opacity
          borderColor: accentColor,
          borderWidth: 1,
          borderRadius: 4
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
            <div style="grid-column: span 2">
              <div class="card-subtitle">Altezza (cm)</div>
              <input type="number" id="edit-height" value="${user.height || ''}">
            </div>
          </div>
        </div>

        <button class="btn" id="save-profile" style="margin-top: 20px">Salva Modifiche</button>
      </div>
    `;

    document.getElementById('cancel-edit').addEventListener('click', () => renderSettings());
    document.getElementById('save-profile').addEventListener('click', () => {
      user.nickname = document.getElementById('edit-nickname').value;
      user.age = document.getElementById('edit-age').value;
      user.weight = document.getElementById('edit-weight').value;
      user.height = document.getElementById('edit-height').value;
      storage.saveUser(user);
      renderSettings();
      alert('Profilo aggiornato! 🦾');
    });
  };

  const renderSettings = () => {
    app.innerHTML = `
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
          <div class="card-subtitle">${user.name} ${user.surname} • ${user.age} anni</div>
        </div>

        <!-- Unità di Misura -->
        <div class="card">
          <div class="card-title">Unità di Misura</div>
          <div style="display: flex; gap: 10px; margin-top: 10px">
            <button class="btn ${user.unit !== 'lbs' ? '' : 'btn-secondary'}" id="unit-kg" style="flex: 1; height: 40px">Kg</button>
            <button class="btn ${user.unit === 'lbs' ? '' : 'btn-secondary'}" id="unit-lbs" style="flex: 1; height: 40px">Libbre (lbs)</button>
          </div>
        </div>

        <!-- Suono Allarme -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div class="card-title" style="margin: 0">Suono Allarme</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="alarm-toggle" ${storage.getAlarmEnabled() ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${storage.getAlarmEnabled() ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${storage.getAlarmEnabled() ? '25px' : '3px'};
                width: 22px; height: 22px; background: ${storage.getAlarmEnabled() ? '#000' : '#888'};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 12px">Scegli il suono che sentirai al termine del recupero.</div>
          <div style="display: flex; flex-direction: column; gap: 8px; opacity: ${storage.getAlarmEnabled() ? '1' : '0.4'}; pointer-events: ${storage.getAlarmEnabled() ? 'auto' : 'none'};" id="alarm-sounds-container">
            ${[
              { id: 'classic', name: 'Classico', desc: 'Beep singolo', icon: '🔔' },
              { id: 'digital', name: 'Digitale', desc: 'Triplo beep rapido', icon: '⏱️' },
              { id: 'gong',    name: 'Campana',  desc: 'Gong profondo',   icon: '🔕' }
            ].map(s => `
              <div class="alarm-sound-option" data-sound="${s.id}" style="
                display: flex; align-items: center; gap: 12px;
                padding: 12px; border-radius: 12px; cursor: pointer;
                background: ${storage.getAlarmSound() === s.id ? 'rgba(var(--accent-rgb, 204,255,0), 0.12)' : 'rgba(255,255,255,0.03)'};
                border: 2px solid ${storage.getAlarmSound() === s.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)'};
                transition: all 0.2s ease;
              ">
                <div style="font-size: 1.4rem; width: 38px; text-align: center">${s.icon}</div>
                <div style="flex: 1">
                  <div style="font-weight: 700; font-size: 0.9rem">${s.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary)">${s.desc}</div>
                </div>
                <button class="preview-sound-btn" data-sound="${s.id}" style="
                  background: none; border: 1px solid rgba(255,255,255,0.15);
                  color: var(--text-secondary); border-radius: 50%; width: 34px; height: 34px;
                  display: flex; align-items: center; justify-content: center; cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
                ${storage.getAlarmSound() === s.id ? '<div style="color: var(--accent-color); font-size: 1.1rem">✓</div>' : ''}
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 14px; opacity: ${storage.getAlarmEnabled() ? '1' : '0.4'}; pointer-events: ${storage.getAlarmEnabled() ? 'auto' : 'none'};">
            <div class="card-subtitle" style="margin-bottom: 8px">Durata allarme</div>
            <div style="display: flex; gap: 8px">
              ${[3, 5, 10, 15].map(d => `
                <button class="btn alarm-duration-btn ${storage.getAlarmDuration() === d ? '' : 'btn-secondary'}" data-duration="${d}" style="flex: 1; height: 38px; font-size: 0.85rem; font-weight: 700">${d}s</button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Feedback & Progressione -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div class="card-title" style="margin: 0">Feedback & Progressione</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="progression-toggle" ${user.progressionEnabled !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${user.progressionEnabled !== false ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${user.progressionEnabled !== false ? '25px' : '3px'};
                width: 22px; height: 22px; background: ${user.progressionEnabled !== false ? '#000' : '#888'};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 15px">Personalizza il comportamento di incremento automatico dei carichi e delle ripetizioni. Se disattivato, i pesi delle schede non verranno modificati a fine allenamento.</div>
          
          <div id="progression-settings-panel" style="opacity: ${user.progressionEnabled !== false ? '1' : '0.4'}; pointer-events: ${user.progressionEnabled !== false ? 'auto' : 'none'}; transition: all 0.3s ease">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  LOGICA DI PROG.
                  <span class="info-help-btn" data-type="mode" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-progression-mode" style="margin-bottom: 0">
                  <option value="mixed" ${user.progressionMode === 'mixed' ? 'selected' : ''}>Mista (Reps → Peso)</option>
                  <option value="weight-only" ${user.progressionMode === 'weight-only' ? 'selected' : ''}>Solo Peso</option>
                  <option value="reps-only" ${user.progressionMode === 'reps-only' ? 'selected' : ''}>Solo Reps</option>
                </select>
              </div>
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  APPLICAZIONE PESO
                  <span class="info-help-btn" data-type="strategy" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-progression-type" style="margin-bottom: 0">
                  <option value="all" ${user.progressionType === 'all' ? 'selected' : ''}>Tutte le serie</option>
                  <option value="last" ${user.progressionType === 'last' ? 'selected' : ''}>Solo l'ultima serie</option>
                  <option value="first" ${user.progressionType === 'first' ? 'selected' : ''}>Solo la prima serie</option>
                  <option value="alternate" ${user.progressionType === 'alternate' ? 'selected' : ''}>Serie alternate</option>
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
                  <option value="auto" ${user.progressionStep === 'auto' ? 'selected' : ''}>🤖 Auto (Muscolo)</option>
                  <option value="1" ${user.progressionStep === 1 ? 'selected' : ''}>+1 kg</option>
                  <option value="2" ${user.progressionStep === 2 ? 'selected' : ''}>+2 kg</option>
                  <option value="2.5" ${user.progressionStep === 2.5 ? 'selected' : ''}>+2.5 kg</option>
                  <option value="5" ${user.progressionStep === 5 ? 'selected' : ''}>+5 kg</option>
                </select>
              </div>
              <div>
                <div class="card-subtitle" style="margin-bottom: 5px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center">
                  SOGLIA REPS
                  <span class="info-help-btn" data-type="thresh" style="margin-left: 6px; cursor: pointer; color: var(--accent-color); font-size: 0.95rem">ℹ️</span>
                </div>
                <select id="setting-reps-threshold" style="margin-bottom: 0" ${user.progressionMode === 'reps-only' ? 'disabled' : ''}>
                  ${[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(v => `
                    <option value="${v}" ${user.repsThreshold === v ? 'selected' : ''}>${v} reps</option>
                  `).join('')}
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
            <div class="theme-circle ${storage.getTheme() === 'default' ? 'active' : ''}" data-theme="default" style="background: #ccff00"></div>
            <div class="theme-circle ${storage.getTheme() === 'red' ? 'active' : ''}" data-theme="red" style="background: #ff003c"></div>
            <div class="theme-circle ${storage.getTheme() === 'blue' ? 'active' : ''}" data-theme="blue" style="background: #00d4ff"></div>
            <div class="theme-circle ${storage.getTheme() === 'purple' ? 'active' : ''}" data-theme="purple" style="background: #9d00ff"></div>
            <div class="theme-circle ${storage.getTheme() === 'white' ? 'active' : ''}" data-theme="white" style="background: #f0f0f0"></div>
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
          IronTrack ${APP_VERSION} • Premium Workout Tracking
        </div>
      </div>
    `;

    document.getElementById('close-settings').addEventListener('click', () => renderProfile());
    document.getElementById('edit-profile-btn').addEventListener('click', () => renderEditForm());
    
    document.getElementById('unit-kg').addEventListener('click', () => { user.unit = 'kg'; storage.saveUser(user); renderSettings(); });
    document.getElementById('unit-lbs').addEventListener('click', () => { user.unit = 'lbs'; storage.saveUser(user); renderSettings(); });

    // Alarm toggle
    document.getElementById('alarm-toggle').addEventListener('change', (e) => {
      storage.saveAlarmEnabled(e.target.checked);
      renderSettings();
    });

    // Alarm sound selection
    document.querySelectorAll('.alarm-sound-option').forEach(option => {
      option.addEventListener('click', (e) => {
        if (e.target.closest('.preview-sound-btn')) return;
        const sound = option.getAttribute('data-sound');
        storage.saveAlarmSound(sound);
        rebuildAudioPool();
        renderSettings();
      });
    });

    // Preview sound buttons
    document.querySelectorAll('.preview-sound-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sound = btn.getAttribute('data-sound');
        previewAlarmSound(sound);
      });
    });

    // Alarm duration selection
    document.querySelectorAll('.alarm-duration-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dur = parseInt(btn.getAttribute('data-duration'));
        storage.saveAlarmDuration(dur);
        renderSettings();
      });
    });

    document.querySelectorAll('.theme-circle').forEach(circle => {
      circle.addEventListener('click', (e) => {
        const theme = e.target.getAttribute('data-theme');
        storage.saveTheme(theme);
        applyTheme(theme);
        renderSettings();
      });
    });

    const updateSettingsProgressionPreview = () => {
      const previewContainer = document.getElementById('settings-progression-visual-preview');
      if (!previewContainer) return;
      
      if (user.progressionEnabled === false) {
        previewContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; color: var(--text-secondary); font-size: 0.8rem; font-weight: 700; text-align: center; padding: 12px">
            <span style="font-size: 1.2rem; margin-bottom: 4px">⏸️</span>
            Progressione Automatica Disattivata
          </div>
        `;
        return;
      }
      
      const type = document.getElementById('setting-progression-type').value;
      const rawStep = document.getElementById('setting-progression-step').value;
      const mode = document.getElementById('setting-progression-mode').value;
      
      let html = "";
      
      if (mode === 'reps-only') {
        // Simulazione solo reps: barre con cappello blu pulsante (+1 R)
        html = `
          <div style="display: flex; gap: 8px; justify-content: center; align-items: flex-end; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
        `;
        for (let i = 0; i < 4; i++) {
          const baseHeight = 45 + i * 5;
          html += `
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
              <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.05)">
                <div class="pulse" style="height: 18px; background: #00d4ff; display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.55rem; font-weight: 800">
                  +1 R
                </div>
                <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 2px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #a0a0a0; font-weight: 700">
                  S${i+1}
                </div>
              </div>
            </div>
          `;
        }
        html += `</div>`;
      } else if (rawStep === 'auto') {
        // Simulazione split-screen per passo automatico
        html = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px">
            <!-- Grandi Muscoli (+2.5 kg) -->
            <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
              <div style="font-size: 0.62rem; color: var(--accent-color); font-weight: 800; text-align: center; margin-bottom: 8px">💪 GRANDI (Petto, Gambe)</div>
              <div style="display: flex; gap: 4px; justify-content: center; align-items: flex-end; height: 80px">
                ${[0, 1, 2, 3].map(i => {
                  let applyStep = false;
                  if (type === 'all') applyStep = true;
                  else if (type === 'last' && i === 3) applyStep = true;
                  else if (type === 'first' && i === 0) applyStep = true;
                  else if (type === 'alternate' && i % 2 === 0) applyStep = true;
                  
                  const baseHeight = 35 + i * 4;
                  return `
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                      <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                        ${applyStep ? `<div class="pulse" style="height: 15px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+2.5</div>` : ''}
                        <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${i+1}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <!-- Piccoli Muscoli (+1 kg) -->
            <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
              <div style="font-size: 0.62rem; color: var(--accent-color); font-weight: 800; text-align: center; margin-bottom: 8px">⚡ PICCOLI (Braccia, Spalle)</div>
              <div style="display: flex; gap: 4px; justify-content: center; align-items: flex-end; height: 80px">
                ${[0, 1, 2, 3].map(i => {
                  let applyStep = false;
                  if (type === 'all') applyStep = true;
                  else if (type === 'last' && i === 3) applyStep = true;
                  else if (type === 'first' && i === 0) applyStep = true;
                  else if (type === 'alternate' && i % 2 === 0) applyStep = true;
                  
                  const baseHeight = 35 + i * 4;
                  return `
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                      <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                        ${applyStep ? `<div class="pulse" style="height: 15px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+1</div>` : ''}
                        <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${i+1}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      } else {
        // Passo fisso standard
        const step = parseFloat(rawStep) || 1;
        html = `
          <div style="display: flex; gap: 8px; justify-content: center; align-items: flex-end; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
        `;
        for (let i = 0; i < 4; i++) {
          let applyStep = false;
          if (type === 'all') applyStep = true;
          else if (type === 'last' && i === 3) applyStep = true;
          else if (type === 'first' && i === 0) applyStep = true;
          else if (type === 'alternate' && i % 2 === 0) applyStep = true;
          
          const baseHeight = 45 + i * 5;
          const stepHeight = applyStep ? 18 : 0;
          
          html += `
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
              <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.05)">
                ${applyStep ? `
                  <div class="pulse" style="height: ${stepHeight}px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.55rem; font-weight: 800">
                    +${step}
                  </div>
                ` : ''}
                <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 2px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #a0a0a0; font-weight: 700">
                  S${i+1}
                </div>
              </div>
            </div>
          `;
        }
        html += `</div>`;
      }
      
      previewContainer.innerHTML = html;
    };
    
    updateSettingsProgressionPreview();

    // Progression Toggle Listener
    document.getElementById('progression-toggle').addEventListener('change', (e) => {
      user.progressionEnabled = e.target.checked;
      storage.saveUser(user);
      
      const panel = document.getElementById('progression-settings-panel');
      if (panel) {
        panel.style.opacity = e.target.checked ? '1' : '0.4';
        panel.style.pointerEvents = e.target.checked ? 'auto' : 'none';
      }
      updateSettingsProgressionPreview();
      
      // Visual feedback slider update
      const sliderBg = e.target.nextElementSibling;
      const sliderKnob = sliderBg ? sliderBg.nextElementSibling : null;
      if (sliderBg && sliderKnob) {
        sliderBg.style.background = e.target.checked ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)';
        sliderKnob.style.left = e.target.checked ? '25px' : '3px';
        sliderKnob.style.background = e.target.checked ? '#000' : '#888';
      }
    });

    document.getElementById('setting-progression-mode').addEventListener('change', (e) => {
      user.progressionMode = e.target.value;
      storage.saveUser(user);
      
      const threshEl = document.getElementById('setting-reps-threshold');
      if (threshEl) {
        threshEl.disabled = (e.target.value === 'reps-only');
      }
      updateSettingsProgressionPreview();
    });

    document.getElementById('setting-progression-type').addEventListener('change', (e) => {
      user.progressionType = e.target.value;
      storage.saveUser(user);
      updateSettingsProgressionPreview();
    });

    document.getElementById('setting-progression-step').addEventListener('change', (e) => {
      user.progressionStep = e.target.value === 'auto' ? 'auto' : parseFloat(e.target.value) || 1;
      storage.saveUser(user);
      updateSettingsProgressionPreview();
    });

    document.getElementById('setting-reps-threshold').addEventListener('change', (e) => {
      user.repsThreshold = parseInt(e.target.value) || 8;
      storage.saveUser(user);
    });

    document.querySelectorAll('.info-help-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        let title = "", msg = "";
        if (type === 'strategy') {
          title = "Strategia di Incremento";
          msg = `<strong>Strategia di Incremento Carichi</strong><br><br>Determina come l'app distribuisce l'aumento di peso tra le varie serie di un esercizio dopo un feedback positivo:<br><br>• <strong>Tutte le serie:</strong> Il peso aumenta in ogni serie (es. da 50kg in tutte a 51kg in tutte).<br>• <strong>Solo l'ultima serie:</strong> Incrementa solo l'ultimo set per testare il nuovo carico in sicurezza (es. 50, 50, 50, 51kg).<br>• <strong>Solo la prima serie:</strong> Aumenta solo il primo set quando sei più fresco (es. 51, 50, 50, 50kg).<br>• <strong>Alternate:</strong> Incrementa a set alternati (es. 1° e 3° set).`;
        } else if (type === 'step') {
          title = "Passo di Incremento";
          msg = `<strong>Valore di Incremento Carichi</strong><br><br>Scegli l'unità di peso da aggiungere quando progredisci:<br><br>• <strong>🤖 Auto (in base al muscolo):</strong> Il sistema intelligente assegna:<br>&nbsp;&nbsp;- <strong>+2.5 kg</strong> a muscoli grandi (Petto, Dorso, Gambe)<br>&nbsp;&nbsp;- <strong>+1 kg</strong> a muscoli piccoli (Spalle, Bicipiti, Tricipiti, Addome, Altro)<br>• <strong>Fissi (+1, +2, +2.5, +5 kg):</strong> Applica sempre lo stesso incremento fisso indipendentemente dall'esercizio.`;
        } else if (type === 'thresh') {
          title = "Soglia Reps Minime";
          msg = `<strong>Soglia Ripetizioni Minime</strong><br><br>Se dai feedback positivo ma le ripetizioni eseguite in qualche set sono inferiori a questa soglia, l'app darà la priorità all'aumento delle ripetizioni portandole al valore soglia, rimandando l'aumento di peso alla sessione successiva.<br><br>Se usi una <strong>Doppia Progressione Range</strong> (es. 8-12 reps), questa soglia globale viene ignorata a favore del limite massimo del range dell'esercizio.`;
        } else if (type === 'mode') {
          title = "Logica di Progressione";
          msg = `<strong>Modalità del Sistema di Sovraccarico</strong><br><br>Scegli come deve agire l'app quando riceve un feedback positivo:<br><br>• <strong>Mista (Reps → Peso):</strong> Progressioni classiche. Prima aumenta le ripetizioni fino alla soglia o limite del range, poi incrementa il peso.<br>• <strong>Solo Peso:</strong> Aumenta direttamente il peso del passo prescelto ad ogni feedback positivo, lasciando le ripetizioni invariate.<br>• <strong>Solo Reps:</strong> Mantiene fisso il peso e aumenta solo le ripetizioni di +1 ad ogni sessione positiva (fino a max 15 reps). Ideale per esercizi a corpo libero o calistenici.`;
        }
        showInfoModal(title, msg);
      });
    });

    document.getElementById('export-btn-settings').addEventListener('click', exportData);
    document.getElementById('import-input-settings').addEventListener('change', (e) => {
      if (e.target.files.length > 0) importData(e.target.files[0]);
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
    const targetView = item.getAttribute('data-view');
    if (targetView === currentView) return;

    if (activeWorkoutHandler) {
      showWorkoutInterruptModal(
        () => { // onInterrupt
          activeWorkoutHandler.interrupt();
          activeWorkoutHandler = null;
          switchView(targetView);
        },
        () => { // onPause
          activeWorkoutHandler.pause();
          activeWorkoutHandler = null;
          switchView(targetView);
        }
      );
    } else {
      switchView(targetView);
    }
  });
});

const showWorkoutInterruptModal = (onInterrupt, onPause) => {
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;
  
  overlay.innerHTML = `
    <div class="card" style="width: 100%; max-width: 400px; text-align: center; margin: 0">
      <h3 style="margin-top: 0">Allenamento in corso</h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px">Vuoi interrompere l'allenamento o metterlo in pausa per riprenderlo in seguito?</p>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <button id="modal-pause" class="btn" style="background: var(--accent-color); color: #000">Metti in Pausa</button>
        <button id="modal-interrupt" class="btn btn-secondary" style="border: 2px solid var(--danger); color: var(--danger)">Interrompi</button>
        <button id="modal-cancel" class="btn btn-secondary">Annulla</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('modal-pause').addEventListener('click', () => {
    overlay.remove();
    if(onPause) onPause();
  });
  document.getElementById('modal-interrupt').addEventListener('click', () => {
    overlay.remove();
    if(onInterrupt) onInterrupt();
  });
  document.getElementById('modal-cancel').addEventListener('click', () => {
    overlay.remove();
  });
};

const showConfirmModal = (title, message, onConfirm, onCancel) => {
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    backdrop-filter: blur(8px);
  `;
  
  overlay.innerHTML = `
    <div class="card" style="width: 100%; max-width: 400px; text-align: center; margin: 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5)">
      <h3 style="margin-top: 0; color: var(--accent-color); font-weight: 800">${title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem">${message}</p>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <button id="modal-confirm-btn" class="btn" style="background: var(--accent-color); color: #000; font-weight: 700">Conferma</button>
        <button id="modal-cancel-btn" class="btn btn-secondary" style="font-weight: 700">Annulla</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    overlay.remove();
    if(onConfirm) onConfirm();
  });
  document.getElementById('modal-cancel-btn').addEventListener('click', () => {
    overlay.remove();
    if(onCancel) onCancel();
  });
};

const showInfoModal = (title, message) => {
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    backdrop-filter: blur(8px);
  `;
  
  overlay.innerHTML = `
    <div class="card" style="width: 100%; max-width: 400px; text-align: left; margin: 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5)">
      <h3 style="margin-top: 0; color: var(--accent-color); font-weight: 800; text-align: center">${title}</h3>
      <div style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.85rem; line-height: 1.6; max-height: 300px; overflow-y: auto; padding-right: 5px">
        ${message}
      </div>
      <button id="modal-close-btn" class="btn" style="background: var(--accent-color); color: #000; font-weight: 700; width: 100%">Capito! 👍</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    overlay.remove();
  });
};

const parseRepsRange = (repsRange) => {
  if (typeof repsRange === 'string' && repsRange.includes('-')) {
    const parts = repsRange.split('-').map(x => parseInt(x.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
  }
  return null;
};

const resolveExerciseProgression = (routineEx, userObj) => {
  const type = (routineEx.progressionType && routineEx.progressionType !== 'inherit') ? routineEx.progressionType : (userObj.progressionType || 'all');
  const repsThresh = (routineEx.repsThreshold && routineEx.repsThreshold !== 'inherit') ? parseInt(routineEx.repsThreshold) : (parseInt(userObj.repsThreshold) || 8);
  const mode = (routineEx.progressionMode && routineEx.progressionMode !== 'inherit') ? routineEx.progressionMode : (userObj.progressionMode || 'mixed');
  
  let step = 1;
  const rawStep = (routineEx.progressionStep && routineEx.progressionStep !== 'inherit') ? routineEx.progressionStep : (userObj.progressionStep || 'auto');
  if (rawStep === 'auto') {
    const muscle = getMuscleGroup(routineEx.name);
    if (muscle === 'Petto' || muscle === 'Dorso' || muscle === 'Gambe') {
      step = 2.5;
    } else {
      step = 1;
    }
  } else {
    step = parseFloat(rawStep) || 1;
  }
  
  return { type, step, repsThresh, mode };
};

// Start the app
switchView('dashboard');

// Global audio unlock - no {once: true} to ensure audio resumes after backgrounding
document.addEventListener('click', unlockAudio, { passive: true });
document.addEventListener('touchstart', unlockAudio, { passive: true });

// Listener globali di visibilità per sincronizzare istantaneamente i timer
['visibilitychange', 'pageshow', 'focus'].forEach(event => {
  window.addEventListener(event, () => {
    if (document.visibilityState === 'visible' && typeof activeTimerSyncFn === 'function') {
      activeTimerSyncFn();
    }
  });
});
