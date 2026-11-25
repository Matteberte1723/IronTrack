import { storage } from './storage.js';
import { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, doc, setDoc, addDoc, getDoc, updateDoc, deleteDoc, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { openExerciseGuideModal } from './exercise_guides.js';
import { buildExpandedExerciseDB, EXERCISE_CATALOG, getExerciseImages } from './exercise_catalog.js';
import { SET_TAG_META, SET_TAG_ORDER, openPlateCalculatorModal, openReplaceExerciseModal, computeAwards, checkAndNotifyNewAwards } from './features_v42.js';

// Banner informativo per migrazione da GitHub Pages a Firebase Hosting
const initGitHubPagesBanner = () => {
  if (window.location.hostname.includes('github.io') && !sessionStorage.getItem('gh-migration-banner-dismissed')) {
    const existing = document.getElementById('gh-migration-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'gh-migration-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100000;
      background: linear-gradient(135deg, #18181b 0%, #09090b 100%);
      border-bottom: 2px solid var(--accent-color, #c8ff00);
      padding: 10px 14px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.85);
      font-family: inherit;
    `;
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
        <span style="font-size: 1.4rem; flex-shrink: 0; line-height: 1;">🚀</span>
        <div style="min-width: 0;">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-color, #c8ff00);">
            Nuovo link ufficiale di IronTrack!
          </div>
          <div style="font-size: 0.74rem; color: #a1a1aa; line-height: 1.3; margin-top: 2px;">
            Questa versione su GitHub verrà dismessa. Usa la nuova app su: <strong style="color: #fff;">irontrack-6b118.web.app</strong>
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
        <a href="https://irontrack-6b118.web.app/" style="background: var(--accent-color, #c8ff00); color: #000; font-weight: 800; font-size: 0.78rem; padding: 7px 12px; border-radius: 20px; text-decoration: none; white-space: nowrap; display: inline-block;">
          Nuova App ➔
        </a>
        <button id="close-gh-banner" style="background: none; border: none; color: #71717a; font-size: 1.1rem; cursor: pointer; padding: 4px 6px; line-height: 1;" title="Chiudi">✕</button>
      </div>
    `;

    document.body.prepend(banner);

    const updatePadding = () => {
      const b = document.getElementById('gh-migration-banner');
      if (b) {
        const h = b.offsetHeight;
        document.body.style.paddingTop = `${h}px`;
        const ls = document.getElementById('login-screen');
        if (ls) ls.style.paddingTop = `${h}px`;
      } else {
        document.body.style.paddingTop = '0px';
        const ls = document.getElementById('login-screen');
        if (ls) ls.style.paddingTop = '0px';
      }
    };
    updatePadding();
    window.addEventListener('resize', updatePadding);

    document.getElementById('close-gh-banner')?.addEventListener('click', () => {
      sessionStorage.setItem('gh-migration-banner-dismissed', 'true');
      banner.remove();
      updatePadding();
    });
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGitHubPagesBanner);
} else {
  initGitHubPagesBanner();
}

// Mostra subito il login screen mentre Firebase si inizializza
// Questo evita la schermata bianca/bloccata se Firebase è lento
const _ls = document.getElementById('login-screen');
if (_ls) _ls.style.display = 'flex';

// Auth State Management
let currentUser = null;
let hasInitializedStartupView = false;

onAuthStateChanged(auth, (authUser) => {
  const loadingScreen = document.getElementById('loading-screen');
  const loginScreen = document.getElementById('login-screen');
  const appScreen = document.getElementById('app');

  const routeAfterAuth = () => {
    const targetView = !hasInitializedStartupView ? 'dashboard' : (currentView || 'dashboard');
    hasInitializedStartupView = true;
    if (typeof switchView === 'function') switchView(targetView);
  };

  if (authUser) {
    // User is logged in
    currentUser = authUser;
    if (loginScreen) loginScreen.style.display = 'none';
    if (appScreen) appScreen.style.display = 'none';
    
    // Mostra la schermata di caricamento mentre sincronizziamo/migriamo dal cloud
    if (loadingScreen) loadingScreen.style.display = 'flex';

    // Timeout di sicurezza: se la sync non risponde entro 8 secondi, mostra l'app comunque
    const syncTimeout = setTimeout(() => {
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (appScreen) appScreen.style.display = 'block';
      routines = storage.getRoutines();
      logs = storage.getLogs();
      user = storage.getUser();
      if (typeof syncLatestWorkoutSetsToRoutines === 'function') syncLatestWorkoutSetsToRoutines();
      routeAfterAuth();
    }, 8000);

    storage.syncAuthLogin(authUser.uid).then(() => {
      clearTimeout(syncTimeout);
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (appScreen) appScreen.style.display = 'block';
      
      // Update user info DIRECTLY in localStorage WITHOUT triggering syncToCloud
      // (syncToCloud would overwrite the cloud with stale local data right after downloading!)
      let existingUser = storage.getUser();
      if (!existingUser) existingUser = {};
      existingUser.name = authUser.displayName || existingUser.name;
      existingUser.email = authUser.email;
      // Write directly to localStorage, skip cloud upload
      localStorage.setItem('iron_track_user', JSON.stringify(existingUser));
      
      // Update global variables from storage — at this point localStorage has the cloud data
      routines = storage.getRoutines();
      logs = storage.getLogs();
      user = storage.getUser();
      if (typeof syncLatestWorkoutSetsToRoutines === 'function') syncLatestWorkoutSetsToRoutines();
      
      // Force Home on initial app launch, or re-render active view on subsequent auth refreshes
      routeAfterAuth();
    }).catch(() => {
      clearTimeout(syncTimeout);
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (appScreen) appScreen.style.display = 'block';
      routines = storage.getRoutines();
      logs = storage.getLogs();
      user = storage.getUser();
      if (typeof syncLatestWorkoutSetsToRoutines === 'function') syncLatestWorkoutSetsToRoutines();
      routeAfterAuth();
    });
  } else {
    // User is signed out
    currentUser = null;
    hasInitializedStartupView = false;
    currentView = 'dashboard';
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (appScreen) appScreen.style.display = 'none';
  }
});

// Handle redirect result (fallback per redirect login)
getRedirectResult(auth).then(result => {
  if (result && result.user) {
    console.log('Redirect login completed for:', result.user.email);
  }
}).catch(err => {
  if (err.code === 'auth/unauthorized-domain') {
    console.error('Redirect login error: dominio non autorizzato in Firebase Console. Hostname:', window.location.hostname);
    alert('Errore di configurazione: dominio non autorizzato. Contatta il supporto.');
  } else if (err.code !== 'auth/cancelled-popup-request') {
    console.error('Redirect login error:', err.code, err.message);
  }
});

// Attach login event
document.addEventListener('DOMContentLoaded', () => {
  const btnLoginGoogle = document.getElementById('btn-login-google');
  if (btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', async () => {
      btnLoginGoogle.disabled = true;
      btnLoginGoogle.style.opacity = '0.7';
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        if (err.code === 'auth/popup-blocked') {
          // Se il popup viene bloccato, tenta il redirect come fallback estremo
          await signInWithRedirect(auth, provider).catch(e => alert("Errore login: " + e.message));
        } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
          alert("Errore login Google: " + err.message);
        }
      } finally {
        btnLoginGoogle.disabled = false;
        btnLoginGoogle.style.opacity = '1';
      }
    });
  }

  const btnLoginEmail = document.getElementById('btn-login-email');
  const btnRegisterEmail = document.getElementById('btn-register-email');
  const btnForgot = document.getElementById('btn-forgot-password');

  if (btnForgot) {
    btnForgot.addEventListener('click', (e) => {
      e.preventDefault();
      const email = (document.getElementById('login-email')?.value || '').trim();
      if (!email) return alert("Inserisci prima la tua email nel campo qui sopra.");
      sendPasswordResetEmail(auth, email)
        .then(() => alert("Email di ripristino/creazione password inviata a " + email + "! Controlla la tua posta (anche Spam)."))
        .catch(err => alert("Errore invio email di recupero: " + err.message));
    });
  }
  
  if (btnLoginEmail && btnRegisterEmail) {
    btnLoginEmail.addEventListener('click', async () => {
      const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
      const pass = (document.getElementById('login-password')?.value || '');
      if (!email || !pass) return alert("Inserisci email e password.");
      
      btnLoginEmail.disabled = true;
      const origText = btnLoginEmail.innerText;
      btnLoginEmail.innerText = "Accesso...";
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (err) {
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          alert("Credenziali non valide. Se hai effettuato la prima registrazione con Google, usa 'Accedi con Google' oppure clicca su 'Hai dimenticato la password?'.");
        } else {
          alert("Errore login: " + err.message);
        }
      } finally {
        btnLoginEmail.disabled = false;
        btnLoginEmail.innerText = origText;
      }
    });

    btnRegisterEmail.addEventListener('click', async () => {
      const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
      const pass = (document.getElementById('login-password')?.value || '');
      if (!email || !pass) return alert("Inserisci email e password per registrarti.");
      if (pass.length < 6) return alert("La password deve essere di almeno 6 caratteri.");
      
      btnRegisterEmail.disabled = true;
      const origText = btnRegisterEmail.innerText;
      btnRegisterEmail.innerText = "Registrazione...";
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          alert("Questa email risulta già registrata! Prova a cliccare su 'Accedi' oppure su 'Accedi con Google'.");
        } else {
          alert("Errore registrazione: " + err.message);
        }
      } finally {
        btnRegisterEmail.disabled = false;
        btnRegisterEmail.innerText = origText;
      }
    });
  }
});

// Service Worker: deregistra qualsiasi SW precedente e non ne registra uno nuovo.
// Il vecchio SW (v99) causava un loop install→unregister che su Safari/iOS
// veniva interpretato come "server non raggiungibile".
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => {
      reg.unregister();
      console.log('[SW] Deregistrato:', reg.scope);
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
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (confirm('Questo sovrascriverà tutti i dati attuali. Sei sicuro?')) {
        if (data.routines) storage.saveRoutines(data.routines);
        if (data.logs) {
          // Salva i log nel localStorage e poi forza sync cloud
          localStorage.setItem('iron_track_logs', JSON.stringify(data.logs));
          // Ricalcola statistiche e sincronizza tutto sul cloud
          let totalVolume = 0;
          data.logs.forEach(l => {
            if (l.exercises) l.exercises.forEach(ex => {
              if (ex.sets) ex.sets.forEach(s => {
                totalVolume += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
              });
            });
          });
          if (auth && auth.currentUser) {
            const ref = doc(db, 'users', auth.currentUser.uid);
            await setDoc(ref, {
              logs: data.logs,
              routines: data.routines || storage.getRoutines(),
              stats: { totalVolume, totalWorkouts: data.logs.length },
              lastUpdated: new Date().toISOString()
            }, { merge: true }).catch(() => {});
          }
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

const APP_VERSION = "v4.2.0";

const changelogData = [
  {
    version: "v4.2.0",
    title: "Superset, Tag Serie, Sostituzione al Volo, Calcolatore Dischi, Riscaldamento/Defaticamento & Premi",
    changes: [
      "Superset nelle Schede Standard: Collega due o più esercizi consecutivi con il toggle Superset; il timer di recupero parte solo a fine round e puoi spuntare l'intero round con un tocco.",
      "Tag sulle Serie (W / D / F): Tocca il numero della serie in sessione per marcarla come Riscaldamento (esclusa da Volume, 1RM e progressione), Drop Set (con mini-box scalata peso/reps) o Cedimento.",
      "Sostituzione Esercizio al Volo (🔄): Sostituisci un esercizio durante l'allenamento scegliendo un'alternativa per lo stesso muscolo, solo per oggi o permanentemente nella scheda.",
      "Calcolatore Dischi Bilanciere (🏋️): Calcola all'istante i dischi esatti per lato (con anteprima visiva) direttamente dalla sessione o dai Progressi.",
      "Riscaldamento & Defaticamento Opzionali: Scegli alla creazione o modifica della scheda se includere i blocchi dedicati di Riscaldamento e Defaticamento/Stretching.",
      "Premi & Obiettivi (Awards): Nuova bacheca badge nei Progressi con sblocco automatico e notifica a fine allenamento."
    ]
  },
  {
    version: "v4.0.1",
    title: "Calendario Annuale a Puntini, Recap dell'Anno, Grafici Ridisegnati, Multi-Muscolo & TUT",
    changes: [
      "Calendario Annuale a Puntini: Nuova vista annuale in stile heatmap nella sezione Progressi per visualizzare a colpo d'occhio tutti gli allenamenti svolti nell'anno, con selezione giorno e switch rapido Annuale/Mensile.",
      "Recap dell'Anno: Nuova scheda riepilogativa con statistiche annuali complete (allenamenti totali, media settimanale, volume sollevato, tempo totale, serie, miglior streak, mese record e distribuzione muscoli).",
      "Grafici Ridisegnati: Grafici Progressione Esercizio (con switch Peso Max / 1RM / Volume e KPI riassuntivi) e Volume Totale (con filtri periodo 10/20 sessioni o mensile) completamente rinnovati con gradienti e tooltip dettagliati.",
      "Multi-Selezione Muscoli & Inserimento Manuale: Quando aggiungi un esercizio puoi selezionare più gruppi muscolari contemporaneamente e inserire manualmente sia il nome dell'esercizio (es. Chin Up) che nuovi muscoli personalizzati.",
      "TUT (Time Under Tension): Aggiunto il campo TUT accanto alle ripetizioni nella creazione/modifica scheda, in anteprima, durante l'allenamento e nello storico."
    ]
  },
  {
    version: "v4.0.0",
    title: "Catalogo 740+ Esercizi, Ricerca Rapida & Player Multi-Frame On-Demand",
    changes: [
      "Catalogo Espanso (743 Esercizi): Menu a tendina in Nuova Scheda e Modifica Scheda arricchiti con centinaia di nuovi esercizi suddivisi per gruppo muscolare e collegati alla Mappa di Recupero.",
      "Ricerca Rapida Esercizi (🔍 Cerca): Nuovo selettore con ricerca istantanea in italiano/inglese, filtri a chip per muscolo e anteprima rapida (👁️) prima di aggiungere l'esercizio alla scheda.",
      "Player Animato Multi-Frame On-Demand: Le guide esercizio mostrano l'esecuzione animata scaricando solo i fotogrammi dell'esercizio aperto, con controlli Play/Pausa, velocità (0.7× / 1× / 1.5×) e navigazione frame-by-frame."
    ]
  },
  {
    version: "v3.2.0",
    title: "Mappa Anatomica Femminile & Guide Esercizi con Omino Stilizzato",
    changes: [
      "Mappa Muscolare Femminile: Selezione del genere nelle impostazioni profilo con visualizzazione dedicata dell'anatomia femminile nei Progressi, completa di 25 zone muscolari e calcolo del tempo di recupero.",
      "Guida Esercizio con Omino Stilizzato: Tasto ⓘ accanto a ciascun esercizio che mostra l'illustrazione biomeccanica con muscoli target evidenziati, istruzioni passo-passo ed errori da evitare.",
      "Video Tutorial YouTube: Accesso rapido con un tocco al video tutorial su YouTube per verificare la corretta esecuzione di ogni movimento."
    ]
  },
  {
    version: "v3.1.4",
    title: "Guida Installazione Schermata Home per Nuovi Utenti",
    changes: [
      "Fix Guida Schermata Home: Risolto il problema per cui il mini tutorial di aggiunta alla schermata Home non veniva mostrato ai nuovi utenti alla registrazione.",
      "Promemoria Intelligente Dashboard: Aggiunto banner rapido sulla Dashboard per installare l'app in un tocco se utilizzata da browser mobile.",
      "Miglioramento Flusso Onboarding: Barra di navigazione nascosta durante la configurazione iniziale del profilo per una navigazione più chiara."
    ]
  },
  {
    version: "v3.1.3",
    title: "Memorizzazione Serie Aggiunte & Sincronizzazione Schede",
    changes: [
      "Persistenza Serie Modificate: Le serie aggiunte o rimosse durante l'allenamento vengono ora memorizzate in automatico sulla scheda per le sessioni future e sincronizzate sul Cloud.",
      "Ripristino Serie Ultimo Allenamento: Sincronizzazione automatica delle serie svolte nell'ultimo allenamento per aggiornare le schede esistenti.",
      "Mantenimento Dati in Sessione: Risolto il reset dei campi inseriti e dei checkmark quando si clicca per aggiungere o rimuovere una serie durante l'allenamento."
    ]
  },
  {
    version: "v3.1.2",
    title: "Gestione Serie Rapida & Fix Grafico Progressi",
    changes: [
      "Aggiunta rapida delle Serie in Allenamento: Aggiungi o rimuovi serie al volo durante un allenamento in corso tramite due pratici pulsanti dedicati.",
      "Fix Grafico Progressi: Corretto il problema di overflow orizzontale nella schermata dei progressi causato da nomi degli esercizi troppo lunghi.",
      "Nascondi Feedback Dinamico: Se hai disattivato il 'Feedback a fine serie' (progressione intelligente) per uno specifico esercizio nella tua scheda, i bottoni di feedback 👍/👎 non verranno più visualizzati durante la sessione in corso per evitare distrazioni."
    ]
  },
  {
    version: "v3.1.1",
    title: "Centro Feedback, Suggerimenti & Segnalazione Bug",
    changes: [
      "Supporto & Feedback in Impostazioni: Invia segnalazioni di bug o suggerisci nuove funzionalità direttamente all'interno dell'app.",
      "Salvataggio Cloud Sicuro: Le segnalazioni arrivano in tempo reale agli sviluppatori per risolvere i problemi più velocemente.",
      "Miglioramenti Login & PWA: Ottimizzata la procedura di accesso e registrazione per utenti iOS e PWA con supporto al recupero password."
    ]
  },
  {
    version: "v3.1.0",
    title: "Esercizi Personalizzati, Note in Allenamento & Progressione Granulare",
    changes: [
      "Esercizi Manuali Avanzati: Crea i tuoi esercizi personalizzati scegliendo il nome e il gruppo muscolare bersaglio direttamente dalla schermata di creazione scheda.",
      "Note durante l'Allenamento: Aggiungi appunti e note agli esercizi. Durante l'allenamento potrai leggerli e modificarli in tempo reale; verranno salvati automaticamente per la sessione successiva.",
      "Progressione Automatica per Singolo Esercizio: Personalizza come aumentano i carichi! Ora puoi attivare o disattivare l'incremento automatico per ogni singolo esercizio, decidendo quanto aumentare se il feedback è positivo (es. +2.5kg) e cosa fare se è negativo (es. mantieni, o riduci del 10%)."
    ]
  },
  {
    version: "v3.0.0",
    title: "Cloud Sync, Account & Classifiche Globali",
    changes: [
      "IronTrack Cloud Sync: Crea un account con Google o la tua Email. L'app esegue il backup e sincronizza automaticamente i tuoi allenamenti su un database Cloud. Non perderai mai più i tuoi dati e potrai usarla da qualsiasi dispositivo!",
      "Nuova Tab Community & Sfide: Entra nella nuova sezione Sfide accessibile dalla barra di navigazione inferiore per competere con atleti di tutto il mondo.",
      "Classifiche Globali in Tempo Reale: Sfida la community e scala le nuove classifiche dinamiche basate sul Volume Totale (Kg sollevati) e sulla Costanza (numero di allenamenti completati)."
    ]
  },
  {
    version: "v2.4.0",
    title: "Audio Continuo, Smart Rest, PR 1RM & Esportazione Grafica",
    changes: [
      "Musica In-App senza Interruzioni (Web Audio API): I timer di recupero e le allerte acustiche suonano senza mai bloccare o intercettare la riproduzione in sottofondo da Spotify, Apple Music o altre app musicali",
      "Evidenziazione 'Carico Facile' Usa e Getta: Al feedback positivo (👍), l'esercizio si colora di verde con badge brillante nella scheda solo per il workout successivo, auto-resettandosi a fine sessione per una valutazione sempre attuale",
      "Personalizzazione Aumenti al 👍 su Scheda & Micro-carichi: Nuova opzione di personalizzazione in creazione/modifica scheda con anteprima testuale interattiva; supporto ai micro-carichi (+0.5 kg, +1.25 kg) e incremento ripetizioni (+1 rep, +2 reps)",
      "Autoregolazione In-Workout (Smart Rest): I pulsanti di valutazione sono sempre visibili in sessione per segnalare subito eventuale fatica (👎); il timer del riposo aggiunge automaticamente +45s con alert visivo e segnale acustico",
      "Celebrazione Personal Record (PR 1RM): Calcolo in tempo reale del massimale stimato (Formula di Epley) al check di ogni serie, confronto automatico con lo storico, fanfara celebrativa con trofeo in modal e badge '🏆 PR' integrato",
      "Esportazione Scheda in Immagine Elegante: Motore grafico basato su Canvas 2D per generare un'esclusiva immagine verticale PNG in stile Dark Glassmorphism ad alta definizione, pronta per download o condivisione immediata"
    ]
  },
  {
    version: "v2.3.0",
    title: "Mappa di Recupero Muscolare",
    changes: [
      "Mappa Corporea Interattiva: Visualizzazione stilizzata del corpo umano (Fronte e Retro) che mostra lo stato di freschezza muscolare di ciascun distretto",
      "Stati e Soglie di Recupero: Colori dinamici basati sullo storico degli allenamenti completati: Rosso (Affaticato, <50%), Giallo (In recupero, 50-85%) e Verde (Fresco/Pronto, 86-100%)",
      "Dettagli di Recupero: Clicca su un muscolo per vedere la percentuale esatta, le ore mancanti al recupero, e la data dell'ultimo allenamento registrato",
      "Pulsazione Attiva: Effetto di pulsazione luminosa rossa per i muscoli congestionati, evidenziando visivamente la necessità di riposo"
    ]
  },
  {
    version: "v2.2.0",
    title: "Saturazione Automatica & Personalizzazione Premium",
    changes: [
      "Switch Progressione Globale: Attiva/disattiva gli incrementi automatici dei pesi in Settings per un controllo assoluto",
      "Passo Auto in base al Muscolo: Calcola l'incremento ideale in modo scientifico (+2.5 kg per Petto/Dorsali/Quadricipiti, +1 kg per Spalle/Braccia/Addome)",
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
let audioKeepAlive = null; // oscillatore silenzioso per tenere vivo il context su iOS durante il workout
let workoutTimerInterval = null;
let workoutStartTime = null;
let activeTimerSyncFn = null;

// Mantieni l'AudioContext in stato 'running' con un oscillatore a volume 0 per tutta la durata del workout.
// Su iOS, il browser sospende automaticamente il context se non ci sono sorgenti audio attive.
// Senza questo, l'allarme del timer (chiamato da setInterval, non da gesto utente) non può risvegliare il context.
const startAudioKeepAlive = () => {
  const ctx = audioContext;
  if (!ctx || audioKeepAlive) return;
  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0; // completamente silenzioso - serve solo a tenere vivo il context
    osc.connect(g);
    g.connect(ctx._masterGain || ctx.destination);
    osc.start();
    audioKeepAlive = osc;
  } catch(e) {}
};

const stopAudioKeepAlive = () => {
  if (audioKeepAlive) {
    try { audioKeepAlive.stop(); } catch(e) {}
    audioKeepAlive = null;
  }
};

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

const syncLatestWorkoutSetsToRoutines = () => {
  try {
    const currentLogs = storage.getLogs();
    const currentRoutines = storage.getRoutines();
    if (!currentLogs || currentLogs.length === 0 || !currentRoutines || currentRoutines.length === 0) return false;

    const lastLog = currentLogs[0];
    if (!lastLog || !lastLog.exercises || lastLog.exercises.length === 0) return false;

    // Trova la scheda corrispondente (per nome)
    const targetRoutine = currentRoutines.find(r => r.name === lastLog.routineName);
    if (!targetRoutine || !targetRoutine.exercises) return false;

    let changed = false;
    lastLog.exercises.forEach(logEx => {
      const routineEx = targetRoutine.exercises.find(re => re.name === logEx.name);
      if (routineEx && logEx.sets && logEx.sets.length > (routineEx.sets || 0)) {
        routineEx.sets = logEx.sets.length;
        changed = true;

        if (Array.isArray(routineEx.weight)) {
          const weights = logEx.sets.map(s => parseFloat(s.weight) || 0);
          while (weights.length < routineEx.sets) {
            weights.push(weights[weights.length - 1] || 0);
          }
          routineEx.weight = weights.slice(0, routineEx.sets);
        }
        if (Array.isArray(routineEx.reps)) {
          const reps = logEx.sets.map(s => String(s.reps || '10'));
          while (reps.length < routineEx.sets) {
            reps.push(reps[reps.length - 1] || '10');
          }
          routineEx.reps = reps.slice(0, routineEx.sets);
        }
      }
    });

    if (changed) {
      storage.saveRoutines(currentRoutines);
      routines = currentRoutines;
      return true;
    }
  } catch (e) {
    console.error("Errore durante syncLatestWorkoutSetsToRoutines:", e);
  }
  return false;
};

syncLatestWorkoutSetsToRoutines();

const EXERCISE_DB = buildExpandedExerciseDB({
  "Petto": ["Panca Piana Bilanciere", "Panca Inclinata Manubri", "Panca Piana", "Croci ai Cavi", "Dips", "Chest Press", "Pectoral Machine", "Push Up"],
  "Dorsali": ["Trazioni alla Sbarra", "Chin Up", "Trazioni", "Lat Machine", "Rematore Bilanciere", "Rematore Manubrio", "Pulley", "Pull-down braccia tese"],
  "Trapezi": ["Scrollate Bilanciere", "Scrollate Manubri", "Tirate al Mento", "Face Pull"],
  "Lombari": ["Stacco", "Stacchi Romeni", "Hyperextension", "Good Morning"],
  "Quadricipiti": ["Squat Bilanciere", "Squat", "Leg Press", "Affondi", "Leg Extension"],
  "Femorali": ["Leg Curl", "Stacchi Romeni"],
  "Glutei": ["Hip Thrust", "Affondi", "Glute Bridge", "Abductor Machine"],
  "Polpacci": ["Calf Raises", "Calf Press"],
  "Spalle": ["Military Press", "Alzate Laterali", "Lento Avanti Manubri", "Alzate Frontali", "Shoulder Press"],
  "Bicipiti": ["Curl Bilanciere", "Curl Manubri", "Hammer Curl", "Curl panca Scott", "Spider Curl"],
  "Tricipiti": ["Pushdown Tricipiti", "French Press", "Estensioni dietro nuca", "Kickback", "Dips su panca"],
  "Addome": ["Crunch", "Plank", "Leg Raises", "Ab Roller", "Russian Twist", "Sit-up"],
  "Altro": []
});

// Modale di ricerca rapida esercizi (zero precaricamento immagini: le immagini si scaricano solo toccando 👁️)
const openExercisePickerModal = (initialMuscle, onSelect) => {
  const existing = document.getElementById('exercise-picker-modal');
  if (existing) existing.remove();

  let selectedMuscle = initialMuscle || 'Tutti';
  let query = '';
  const muscles = ['Tutti', ...Object.keys(EXERCISE_DB).filter(m => (EXERCISE_DB[m] || []).length > 0)];

  // Indice piatto (priorità agli esercizi storici + tutti i 745 del catalogo con nome IT & EN ricercabili)
  const flatList = [];
  const seen = new Set();
  for (const [m, list] of Object.entries(EXERCISE_DB)) {
    for (const name of list) {
      const k = name.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      const imgMeta = getExerciseImages(name);
      flatList.push({
        name,
        en: imgMeta?.en || '',
        muscle: m,
        hasImg: Boolean(imgMeta)
      });
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'exercise-picker-modal';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 99990; display: flex; align-items: flex-end; justify-content: center;
  `;

  overlay.innerHTML = `
    <div class="card" style="width:100%; max-width:520px; height:84vh; display:flex; flex-direction:column; margin:0; border-radius:24px 24px 0 0; padding:18px 16px 20px; background:#11151c; border:1px solid rgba(255,255,255,0.12); border-bottom:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <h3 style="margin:0; font-size:1.1rem; color:#fff;">Catalogo Esercizi</h3>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${flatList.length} esercizi disponibili · tocca 👁️ per l'anteprima</div>
        </div>
        <button id="close-ex-picker" type="button" style="background:rgba(255,255,255,0.08); border:none; color:#cbd5e1; width:34px; height:34px; border-radius:50%; font-size:1.1rem; cursor:pointer;">✕</button>
      </div>
      <input id="ex-picker-search" type="search" placeholder="Cerca esercizio (es. Panca, Squat, Cable, Curl...)" autocomplete="off" style="margin:0 0 10px 0; padding:11px 14px; border-radius:12px; background:#0a0d14; border:1px solid rgba(255,255,255,0.12); color:#fff; font-size:0.9rem;">
      <div id="ex-picker-chips" style="display:flex; gap:6px; overflow-x:auto; padding-bottom:10px; margin-bottom:6px; flex-shrink:0;"></div>
      <div id="ex-picker-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:6px; padding-right:2px;"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  const searchInput = overlay.querySelector('#ex-picker-search');
  const chipsEl = overlay.querySelector('#ex-picker-chips');
  const listEl = overlay.querySelector('#ex-picker-list');

  const close = () => overlay.remove();
  overlay.querySelector('#close-ex-picker').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const renderChips = () => {
    chipsEl.innerHTML = muscles.map(m => {
      const active = m === selectedMuscle;
      return `<button type="button" data-m="${m}" style="flex-shrink:0; padding:5px 11px; border-radius:999px; font-size:0.74rem; font-weight:700; cursor:pointer; border:1px solid ${active ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}; background:${active ? 'rgba(200,255,0,0.16)' : 'rgba(255,255,255,0.04)'}; color:${active ? 'var(--accent-color)' : '#cbd5e1'};">${m}</button>`;
    }).join('');
    chipsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMuscle = btn.dataset.m;
        renderChips();
        renderList();
      });
    });
  };

  const renderList = () => {
    const q = query.trim().toLowerCase();
    const filtered = flatList.filter(item => {
      if (selectedMuscle !== 'Tutti' && item.muscle !== selectedMuscle) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.en.toLowerCase().includes(q) || item.muscle.toLowerCase().includes(q);
    }).slice(0, 120);

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; color:var(--text-secondary); padding:24px 12px; font-size:0.85rem;">
          Nessun esercizio trovato per "${query}".
          ${query.trim() ? `
            <div style="margin-top:14px;">
              <button type="button" id="ex-picker-use-custom" class="btn" style="padding:10px 14px; font-size:0.85rem;">
                ✍️ Aggiungi "${query.trim().replace(/"/g, '&quot;')}" manualmente
              </button>
            </div>
          ` : ''}
        </div>
      `;
      const customBtn = listEl.querySelector('#ex-picker-use-custom');
      if (customBtn) {
        customBtn.addEventListener('click', () => {
          onSelect(query.trim(), selectedMuscle !== 'Tutti' ? selectedMuscle : '', true);
          close();
        });
      }
      return;
    }

    listEl.innerHTML = filtered.map(item => `
      <div class="ex-picker-row" data-name="${item.name.replace(/"/g, '&quot;')}" data-muscle="${item.muscle}" style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); cursor:pointer;">
        <div style="min-width:0; flex:1;">
          <div style="font-size:0.88rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
          <div style="font-size:0.72rem; color:var(--text-secondary); display:flex; gap:6px; align-items:center;">
            <span style="color:var(--accent-color);">${item.muscle}</span>
            ${item.en && item.en.toLowerCase() !== item.name.toLowerCase() ? `<span>· ${item.en}</span>` : ''}
          </div>
        </div>
        <button type="button" class="ex-picker-preview" data-name="${item.name.replace(/"/g, '&quot;')}" title="Vedi esecuzione" style="background:rgba(200,255,0,0.12); border:1px solid rgba(200,255,0,0.3); color:var(--accent-color); border-radius:8px; padding:5px 8px; font-size:0.78rem; cursor:pointer; flex-shrink:0;">👁️</button>
      </div>
    `).join('') + (query.trim() ? `
      <button type="button" id="ex-picker-use-custom" style="margin-top:6px; width:100%; padding:10px 12px; border-radius:12px; background:rgba(200,255,0,0.08); border:1px dashed var(--accent-color); color:var(--accent-color); font-size:0.82rem; font-weight:700; cursor:pointer;">
        ✍️ Non lo trovi? Usa "${query.trim().replace(/"/g, '&quot;')}" manualmente
      </button>
    ` : '');

    const customBtn = listEl.querySelector('#ex-picker-use-custom');
    if (customBtn) {
      customBtn.addEventListener('click', () => {
        onSelect(query.trim(), selectedMuscle !== 'Tutti' ? selectedMuscle : '', true);
        close();
      });
    }

    listEl.querySelectorAll('.ex-picker-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openExerciseGuideModal(btn.dataset.name);
      });
    });
    listEl.querySelectorAll('.ex-picker-row').forEach(row => {
      row.addEventListener('click', () => {
        onSelect(row.dataset.name, row.dataset.muscle);
        close();
      });
    });
  };

  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    renderList();
  });

  renderChips();
  renderList();
  setTimeout(() => searchInput.focus(), 80);
};

const MUSCLE_ICONS = {
  "Petto": "🫁",
  "Dorsali": "🦅",
  "Trapezi": "🔺",
  "Lombari": "🔻",
  "Quadricipiti": "🦵",
  "Femorali": "🍗",
  "Glutei": "🍑",
  "Polpacci": "🦶",
  "Spalle": "🛡️",
  "Bicipiti": "💪",
  "Tricipiti": "⚡",
  "Addome": "🧱",
  "Altro": "🏋️"
};

const parseLogDate = (log) => {
  if (!log) return null;
  if (log.timestamp) {
    if (typeof log.timestamp === 'number') {
      const d = new Date(log.timestamp);
      if (!isNaN(d.getTime())) return d;
    } else if (typeof log.timestamp.toDate === 'function') {
      return log.timestamp.toDate();
    } else if (log.timestamp.seconds) {
      return new Date(log.timestamp.seconds * 1000);
    } else {
      const d = new Date(log.timestamp);
      if (!isNaN(d.getTime())) return d;
    }
  }
  if (log.isoDate) {
    const d = new Date(log.isoDate);
    if (!isNaN(d.getTime())) return d;
  }
  if (log.createdAt) {
    if (typeof log.createdAt.toDate === 'function') return log.createdAt.toDate();
    if (log.createdAt.seconds) return new Date(log.createdAt.seconds * 1000);
    const d = new Date(log.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  if (typeof log.date === 'string') {
    const directDate = new Date(log.date);
    if (!isNaN(directDate.getTime())) return directDate;
    
    // Parse formato italiano come "16 set" o "16 set."
    const match = log.date.match(/(\d{1,2})\s+([a-zA-Zà-úÀ-Ú]+)/);
    if (match) {
      const day = parseInt(match[1], 10);
      const mStr = match[2].toLowerCase().replace('.', '').slice(0, 3);
      const months = { 'gen': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mag': 4, 'giu': 5, 'lug': 6, 'ago': 7, 'set': 8, 'ott': 9, 'nov': 10, 'dic': 11 };
      if (months[mStr] !== undefined) {
        const year = new Date().getFullYear();
        return new Date(year, months[mStr], day);
      }
    }
  }
  return null;
};

const getMuscleGroup = (exerciseName) => {
  if (!exerciseName) return "";
  
  // 1. Controllo esatto nel database
  for (const [muscle, exercises] of Object.entries(EXERCISE_DB)) {
    if (exercises.includes(exerciseName)) return muscle;
  }

  // 1b. Controllo nel catalogo immagini esercizi
  const catalogMatch = getExerciseImages(exerciseName);
  if (catalogMatch && catalogMatch.muscle) return catalogMatch.muscle;
  
  // 2. Controllo intelligente tramite parole chiave (per esercizi personalizzati)
  const nameLower = exerciseName.toLowerCase();
  const keywordRules = [
    { muscle: "Femorali", keywords: ["leg curl", "stacchi a gambe", "stacchi romeni", "stacco rumeno", "stacco a gambe", "femorali", "rdl"] },
    { muscle: "Lombari", keywords: ["stacco", "stacchi", "hyperextension", "good morning", "lombari"] },
    { muscle: "Petto", keywords: ["panca", "croci", "chest", "dips", "push up", "piegamenti", "pectoral", "petto"] },
    { muscle: "Dorsali", keywords: ["trazioni", "chin up", "chin-up", "pull up", "pull-up", "lat machine", "rematore", "pulley", "pull-down", "pull down", "dorso", "dorsali"] },
    { muscle: "Trapezi", keywords: ["scrollate", "shrug", "face pull", "tirate al mento", "trapezi"] },
    { muscle: "Quadricipiti", keywords: ["squat", "leg press", "affondi", "leg extension", "quads", "quadricipiti"] },
    { muscle: "Glutei", keywords: ["hip thrust", "glute", "abductor", "ponte"] },
    { muscle: "Polpacci", keywords: ["calf", "polpacci"] },
    { muscle: "Spalle", keywords: ["military", "lento", "alzate", "shoulder", "spalle", "deltoidi", "delt"] },
    { muscle: "Bicipiti", keywords: ["curl", "bicipiti", "biceps"] },
    { muscle: "Tricipiti", keywords: ["pushdown", "french", "estensioni", "kickback", "tricipiti", "triceps"] },
    { muscle: "Addome", keywords: ["crunch", "plank", "leg raises", "ab roller", "twist", "sit-up", "sit up", "addominali", "core", "addome"] }
  ];

  for (const rule of keywordRules) {
    if (rule.keywords.some(kw => nameLower.includes(kw))) {
      return rule.muscle;
    }
  }

  return "Altro";
};

const getMuscleIcon = (muscleGroup) => {
  return MUSCLE_ICONS[muscleGroup] || MUSCLE_ICONS["Altro"];
};

const getExerciseMuscles = (ex) => {
  if (!ex) return [];
  if (Array.isArray(ex.muscles) && ex.muscles.length > 0) {
    return ex.muscles.filter(Boolean);
  }
  if (ex._muscle && ex._muscle.trim()) return [ex._muscle.trim()];
  const inferred = getMuscleGroup(ex.name);
  return inferred ? [inferred] : [];
};

const formatTut = (tut) => {
  if (tut === undefined || tut === null) return '';
  const str = String(tut).trim();
  if (!str) return '';
  return /^\d+(\.\d+)?$/.test(str) ? `${str}s` : str;
};

const renderManualMuscleAndNameHtml = (ex, i) => {
  const selectedMuscles = Array.isArray(ex.muscles) && ex.muscles.length > 0
    ? ex.muscles
    : (ex._muscle && ex._muscle !== 'Altro' ? [ex._muscle] : []);
  const standardMuscles = Object.keys(EXERCISE_DB).filter(m => m !== 'Altro');
  const customMuscles = selectedMuscles.filter(m => !standardMuscles.includes(m) && m !== 'Altro');
  const allChipMuscles = [...standardMuscles, ...customMuscles, 'Altro'];
  const safeName = (ex.name || '').replace(/"/g, '&quot;');
  return `
    <div style="margin-bottom: 8px;">
      <div class="card-subtitle" style="margin-bottom: 4px;">Nome Esercizio (manuale)</div>
      <input type="text" class="ex-name" data-index="${i}" placeholder="es. Chin Up, Dragon Flag..." value="${safeName}" style="margin: 0">
    </div>
    <div>
      <div class="card-subtitle" style="margin-bottom: 4px;">Muscoli coinvolti (seleziona uno o più)</div>
      <div class="muscle-chip-group" data-index="${i}">
        ${allChipMuscles.map(m => {
          const isSel = selectedMuscles.includes(m);
          return `<button type="button" class="muscle-chip ${isSel ? 'selected' : ''}" data-index="${i}" data-muscle="${m.replace(/"/g, '&quot;')}">${isSel ? '✓ ' : ''}${m}</button>`;
        }).join('')}
      </div>
      <div class="custom-muscle-row">
        <input type="text" class="custom-muscle-input" data-index="${i}" placeholder="Inserisci muscolo a mano (es. Avambracci)...">
        <button type="button" class="add-custom-muscle-btn" data-index="${i}">+ Aggiungi</button>
      </div>
    </div>
  `;
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
    
    // Mouse Events (Desktop) - Only make draggable when grasping the handle
    if (handle) {
      handle.style.cursor = 'grab';
      item.setAttribute('draggable', false);
      handle.addEventListener('mousedown', () => {
        item.setAttribute('draggable', true);
      });
      const resetDraggable = () => {
        item.setAttribute('draggable', false);
      };
      document.addEventListener('mouseup', resetDraggable);
    } else {
      item.setAttribute('draggable', true);
    }

    item.addEventListener('dragstart', (e) => {
      if (item.getAttribute('draggable') !== 'true') {
        e.preventDefault();
        return;
      }
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      if (handle) item.setAttribute('draggable', false);
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

// === SISTEMA AUDIO — Oscillatori Diretti (Massima Compatibilità iOS/Safari) ===
// AudioContext viene creato SOLO la prima volta che l'utente tocca qualcosa (unlockAudio).
// Usiamo oscillatori diretti invece di buffer precalcolati: più semplici, più affidabili su iOS.

const unlockAudio = () => {
  // Crea il contesto solo su gesto utente
  if (!audioContext) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        audioContext = new AC();
        // Collega un nodo master gain al destination - tiene viva la catena audio
        audioContext._masterGain = audioContext.createGain();
        audioContext._masterGain.gain.value = 1.0;
        audioContext._masterGain.connect(audioContext.destination);
      }
    } catch(e) { return; }
  }
  
  const ctx = audioContext;
  if (!ctx) return;
  
  const doUnlock = () => {
    // Suono di sblocco brevissimo ma REALE (non silenzio!) — iOS richiede audio reale per sbloccare
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 440;
      g.gain.setValueAtTime(0.001, ctx.currentTime); // quasi silenzioso ma reale
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.connect(g);
      g.connect(ctx._masterGain || ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(doUnlock).catch(() => {});
  } else {
    doUnlock();
  }
};

// Funzione core per suonare tramite oscillatori — NESSUN BUFFER, massima compatibilità
// Helper: garantisce che il contesto sia in stato 'running' prima di suonare
const ensureAudioRunning = () => {
  const ctx = audioContext;
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
    return false;
  }
  return true;
};

const _playOscillatorSound = (type) => {
  const ctx = audioContext;
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx._masterGain || ctx.destination;

  try {
    if (type === 'digital') {
      // Tre beep digitali rapidi a 1200 Hz
      [0, 0.16, 0.32].forEach(startOffset => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 1200;
        g.gain.setValueAtTime(0, now + startOffset);
        g.gain.linearRampToValueAtTime(0.7, now + startOffset + 0.01);
        g.gain.setValueAtTime(0.7, now + startOffset + 0.07);
        g.gain.linearRampToValueAtTime(0, now + startOffset + 0.08);
        osc.connect(g);
        g.connect(master);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + 0.1);
      });
    } else if (type === 'gong') {
      // Gong: fondamentale + armoniche con decadimento esponenziale
      [[220, 0.9], [440, 0.5], [660, 0.25]].forEach(([freq, amp]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(amp * 0.8, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + 1.5);
      });
    } else if (type === 'pr_fanfare') {
      // Fanfara arpeggiata: C5 → E5 → G5 → C6
      [[523.25, 0, 0.2], [659.25, 0.18, 0.38], [783.99, 0.36, 0.56], [1046.5, 0.54, 1.5]].forEach(([freq, start, end]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, now + start);
        g.gain.linearRampToValueAtTime(0.7, now + start + 0.02);
        g.gain.setValueAtTime(0.7, now + end - 0.05);
        g.gain.linearRampToValueAtTime(0, now + end);
        osc.connect(g);
        g.connect(master);
        osc.start(now + start);
        osc.stop(now + end + 0.01);
      });
    } else {
      // Classic: beep singolo 880 Hz
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.9, now + 0.015);
      g.gain.setValueAtTime(0.9, now + 0.3);
      g.gain.linearRampToValueAtTime(0, now + 0.38);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch(e) {}
};

const playBufferSound = (type) => {
  const ctx = audioContext;
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => _playOscillatorSound(type)).catch(() => {});
  } else {
    _playOscillatorSound(type);
  }
};

// Anteprima suono per le impostazioni
const previewAlarmSound = (type) => {
  unlockAudio();
  // Piccolo delay per assicurarsi che unlockAudio abbia avuto effetto
  setTimeout(() => {
    playBufferSound(type);
  }, 80);
};

// Celebrazione PR sonoro
const playPRCelebrationSound = () => {
  unlockAudio();
  setTimeout(() => playBufferSound('pr_fanfare'), 80);
};

const playAlarm = () => {
  // If alarm disabled, just vibrate and exit
  if (!storage.getAlarmEnabled()) {
    if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
    return () => { if (navigator.vibrate) navigator.vibrate(0); };
  }

  // Ensure audio context is unlocked (needed for iOS)
  unlockAudio();

  // Vibration pattern for alarm
  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);

  const currentType = storage.getAlarmSound() || 'classic';
  const intervalMs = currentType === 'gong' ? 2200 : currentType === 'digital' ? 700 : 1100;

  // Helper to play alarm sound via Web Audio API (come per il PR)
  const playAlarmAudio = () => {
    playBufferSound(currentType);
    // Visual flash in aggiunta al suono: solo sul banner del timer (non su tutto lo schermo / body)
    const overlay = document.getElementById('rest-timer-overlay');
    if (overlay) {
      overlay.classList.add('timer-banner-flash');
      setTimeout(() => {
        const ov = document.getElementById('rest-timer-overlay');
        if (ov) ov.classList.remove('timer-banner-flash');
      }, 800);
    }
  };

  let stopped = false;
  const playBeep = () => {
    if (stopped) return;
    if (navigator.vibrate) navigator.vibrate(300);
    playAlarmAudio();
  };

  // Immediate first beep
  playBeep();
  // Repeated beeps at appropriate interval
  const interval = setInterval(playBeep, intervalMs);

  // Return stop function for caller
  return () => {
    stopped = true;
    clearInterval(interval);
    if (navigator.vibrate) navigator.vibrate(0);
    const overlay = document.getElementById('rest-timer-overlay');
    if (overlay) overlay.classList.remove('timer-banner-flash');
  };
};

const triggerSmartRestAlert = () => {
  const overlay = document.getElementById('rest-timer-overlay');
  if (overlay && window.activeRestTimerEndTime) {
    window.activeRestTimerEndTime += 45000;
    if (!document.getElementById('smart-rest-box')) {
      const box = document.createElement('div');
      box.id = 'smart-rest-box';
      box.className = 'smart-rest-alert';
      box.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <span><strong>Smart Rest (+45s):</strong> Autoregolazione attiva per fatica elevata!</span>
      `;
      const stopBtn = overlay.querySelector('#stop-timer');
      if (stopBtn) overlay.insertBefore(box, stopBtn);
      else overlay.appendChild(box);
    }
    // Emetti segnale acustico riposo smart
    const ctx = audioContext;
    if (ctx && ctx.state !== 'suspended') {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx._masterGain || ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } catch(e) {}
    }
    if (activeTimerSyncFn) activeTimerSyncFn();
  }
};

const showRestTimer = (seconds, isSmartRest = false) => {
  unlockAudio();
  startAudioKeepAlive(); // Manteniamo il context attivo durante il riposo
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

  window.activeRestTimerEndTime = Date.now() + (seconds * 1000);
  let stopAlarm = null;

  overlay.innerHTML = `
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px">RECUPERO ${isSmartRest ? '(SMART REST)' : ''}</div>
    <div id="timer-display" style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color)">${seconds}s</div>
    ${isSmartRest ? `
      <div id="smart-rest-box" class="smart-rest-alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <span><strong>Smart Rest (+45s):</strong> Autoregolazione attiva per fatica elevata!</span>
      </div>
    ` : ''}
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

    const curTimeLeft = Math.max(0, Math.ceil((window.activeRestTimerEndTime - Date.now()) / 1000));
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
          stopAudioKeepAlive(); // Ferma keep-alive quando il timer termina
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
  return Boolean(window.navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches));
};

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const renderInstallGuide = (returnTo = 'dashboard') => {
  currentView = 'install-guide';
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.style.display = 'none';

  const defaultPlatform = isIOS() ? 'ios' : 'android';
  const isNewUser = !user || !user.gender || !user.nickname;
  const isFromSettings = returnTo === 'settings';

  app.innerHTML = `
    <div class="view" style="padding: 24px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85vh; text-align: center; max-width: 480px; margin: 0 auto">
      <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(204, 255, 0, 0.1); border: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 16px; box-shadow: 0 0 20px rgba(204, 255, 0, 0.2)">
        📲
      </div>
      <h2 style="font-size: 1.7rem; font-weight: 900; margin-bottom: 8px; letter-spacing: -0.5px">Installa <span style="color: var(--accent-color)">IronTrack</span></h2>
      <p style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem; margin-bottom: 20px">
        Aggiungi IronTrack alla schermata Home del telefono per usarlo a schermo intero come una vera app, senza barre del browser.
      </p>

      <!-- Selettore Piattaforma -->
      <div style="display: flex; width: 100%; background: #18181b; padding: 4px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #27272a">
        <button id="tab-guide-ios" class="btn" style="flex: 1; height: 36px; font-size: 0.82rem; font-weight: 700; border-radius: 8px; background: ${defaultPlatform === 'ios' ? 'var(--accent-color)' : 'transparent'}; color: ${defaultPlatform === 'ios' ? '#000' : 'var(--text-secondary)'}">
          🍎 iPhone / Safari
        </button>
        <button id="tab-guide-android" class="btn" style="flex: 1; height: 36px; font-size: 0.82rem; font-weight: 700; border-radius: 8px; background: ${defaultPlatform === 'android' ? 'var(--accent-color)' : 'transparent'}; color: ${defaultPlatform === 'android' ? '#000' : 'var(--text-secondary)'}">
          🤖 Android / Chrome
        </button>
      </div>

      <!-- Guida iOS -->
      <div id="guide-steps-ios" class="card" style="width: 100%; text-align: left; background: rgba(204, 255, 0, 0.03); border: 1px solid rgba(204, 255, 0, 0.2); display: ${defaultPlatform === 'ios' ? 'block' : 'none'}; margin-bottom: 20px">
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">1</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Apri il menu di <strong>Condivisione</strong> in basso su Safari (l'icona del quadrato con la freccia verso l'alto <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin: 0 2px"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>).</div>
        </div>
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">2</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Scorri verso il basso e tocca <strong>"Aggiungi alla schermata Home"</strong>.</div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">3</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Tocca <strong>"Aggiungi"</strong> in alto a destra per confermare.</div>
        </div>
      </div>

      <!-- Guida Android -->
      <div id="guide-steps-android" class="card" style="width: 100%; text-align: left; background: rgba(204, 255, 0, 0.03); border: 1px solid rgba(204, 255, 0, 0.2); display: ${defaultPlatform === 'android' ? 'block' : 'none'}; margin-bottom: 20px">
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">1</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Tocca i <strong>tre puntini</strong> in alto a destra su Chrome (<strong style="font-size: 1.1rem; line-height: 1">⋮</strong>).</div>
        </div>
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">2</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Tocca <strong>"Installa app"</strong> oppure <strong>"Aggiungi a schermata Home"</strong>.</div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px">
          <div style="background: var(--accent-color); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px">3</div>
          <div style="font-size: 0.88rem; line-height: 1.4">Conferma cliccando su <strong>"Installa"</strong>.</div>
        </div>
      </div>

      <button id="close-guide-btn" class="btn" style="width: 100%; height: 46px; background: var(--accent-color); color: #000; font-weight: 800; font-size: 0.95rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(204,255,0,0.3)">
        ${isFromSettings ? '← Torna alle Impostazioni' : (isNewUser ? 'Ho capito, entra nell\'app ➔' : '← Torna alla Dashboard')}
      </button>

      ${!isFromSettings ? `
        <button id="skip-guide" style="margin-top: 14px; background: none; border: none; color: var(--text-secondary); text-decoration: underline; font-size: 0.8rem; cursor: pointer; padding: 6px">
          Continua comunque nel browser
        </button>
      ` : ''}
    </div>
  `;

  const iosBtn = document.getElementById('tab-guide-ios');
  const androidBtn = document.getElementById('tab-guide-android');
  const iosSteps = document.getElementById('guide-steps-ios');
  const androidSteps = document.getElementById('guide-steps-android');

  iosBtn?.addEventListener('click', () => {
    iosBtn.style.background = 'var(--accent-color)';
    iosBtn.style.color = '#000';
    androidBtn.style.background = 'transparent';
    androidBtn.style.color = 'var(--text-secondary)';
    iosSteps.style.display = 'block';
    androidSteps.style.display = 'none';
  });

  androidBtn?.addEventListener('click', () => {
    androidBtn.style.background = 'var(--accent-color)';
    androidBtn.style.color = '#000';
    iosBtn.style.background = 'transparent';
    iosBtn.style.color = 'var(--text-secondary)';
    androidSteps.style.display = 'block';
    iosSteps.style.display = 'none';
  });

  const finishGuide = () => {
    localStorage.setItem('pwa-guide-dismissed', 'true');
    sessionStorage.setItem('pwa-guide-dismissed-session', 'true');
    if (currentUser?.uid) {
      localStorage.setItem(`pwa-guide-dismissed-${currentUser.uid}`, 'true');
    }
    if (returnTo === 'settings') {
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) bottomNav.style.display = 'flex';
      renderSettings();
    } else if (!user || !user.gender || !user.nickname) {
      renderOnboarding();
    } else {
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) bottomNav.style.display = 'flex';
      switchView('dashboard');
    }
  };

  document.getElementById('close-guide-btn')?.addEventListener('click', finishGuide);
  document.getElementById('skip-guide')?.addEventListener('click', finishGuide);
};

const renderOnboarding = (step = 1, tempUser = {}) => {
  currentView = 'onboarding';
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.style.display = 'none';
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
              <input type="text" id="ob-name" placeholder="Mario" value="${user?.name || ''}">
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
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) bottomNav.style.display = 'flex';
      switchView('dashboard');
    });
  }
};

const renderDashboard = () => {
  const headerAction = document.getElementById('header-action');
  if (headerAction) headerAction.innerHTML = '';

  if (!user || !user.gender || !user.nickname) {
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

      ${!isStandalone() ? `
      <div class="card" id="dash-install-banner" style="background: linear-gradient(135deg, rgba(204,255,0,0.08), rgba(22,22,22,0.9)); border: 1px solid rgba(204,255,0,0.25); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; margin-bottom: 16px; border-radius: var(--border-radius);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.4rem; line-height: 1">📲</div>
          <div>
            <div style="font-weight: 800; font-size: 0.85rem; color: #fff">Installa IronTrack</div>
            <div style="font-size: 0.72rem; color: var(--text-secondary)">Aggiungi l'app alla schermata Home</div>
          </div>
        </div>
        <button id="btn-dash-install-guide" class="btn" style="padding: 6px 12px; height: 32px; font-size: 0.75rem; font-weight: 700; background: var(--accent-color); color: #000; border-radius: 8px; white-space: nowrap">
          Come fare ➔
        </button>
      </div>
      ` : ''}

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
      </div>
      <div style="padding: 0 16px; margin-top: 20px; text-align: center; color: var(--text-secondary); font-size: 0.8rem">
        Versione App: ${APP_VERSION}
      </div>
    </div>
  `;

  const dashInstallBtn = document.getElementById('btn-dash-install-guide');
  if (dashInstallBtn) {
    dashInstallBtn.addEventListener('click', () => {
      renderInstallGuide('dashboard');
    });
  }

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
          const hasReadyGain = r.exercises && r.exercises.some(ex => ex.hadPositiveFeedback === true);
          return `
            <div class="card routine-card ${hasReadyGain ? 'easy-load-card' : ''}" data-id="${r.id}" style="position: relative">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-right: 80px">
                <div style="display: flex; align-items: center; gap: 15px">
                  <div class="ex-icon" style="background: var(--accent-glow); color: var(--accent-color); font-size: 1.2rem; width: 45px; height: 45px">${icon}</div>
                  <div>
                    <div class="card-title">${r.name}</div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <div class="card-subtitle">${r.type === 'circuit' ? '🔄 Circuito' : '💪 Standard'} • ${r.exercises.length} esercizi</div>
                      <div class="est-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${estDuration} min
                      </div>
                      ${hasReadyGain ? `<span class="easy-load-badge">⚡ Aumenta Carichi</span>` : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div style="position: absolute; right: 16px; top: 20px; display: flex; gap: 12px">
                <button class="export-routine-btn" data-id="${r.id}" title="Esporta Immagine PNG" style="background: none; border: none; color: var(--accent-color); cursor: pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
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

  document.querySelectorAll('.export-routine-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const routine = routines.find(r => r.id == id);
      if (routine) exportRoutineToImage(routine);
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

const getProgressionDescription = (ex) => {
  const mode = ex.progressionMode && ex.progressionMode !== 'inherit' ? ex.progressionMode : (user?.progressionMode || 'mixed');
  const step = ex.progressionStep && ex.progressionStep !== 'inherit' ? ex.progressionStep : (user?.progressionStep || 'auto');
  const stepVal = step === 'auto' ? (['Petto', 'Dorsali', 'Quadricipiti', 'Femorali', 'Glutei', 'Lombari'].includes(getMuscleGroup(ex.name)) ? '+2.5kg' : '+1kg') : `+${step}kg`;
  
  if (mode === 'weight-only') return `ℹ️ Al 👍: carica subito ${stepVal} al prossimo allenamento.`;
  if (mode === 'reps-only') return `ℹ️ Al 👍: aumenta le ripetizioni (+1 rep per serie) mantenendo stabile il peso.`;
  if (mode === 'mixed') return `ℹ️ Al 👍 (Doppia Progressione): scala prima le ripetizioni fino alla soglia max, poi aumenta il carico di ${stepVal} e riparti dalle reps minime!`;
  return `ℹ️ Progressione intelligente al feedback 👍.`;
};

// Helper condiviso per Riscaldamento & Defaticamento opzionali in Nuova/Modifica Scheda
const renderWarmupCooldownTogglesHtml = (includeWarmup, includeCooldown) => `
  <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px;">
    <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 0.86rem; font-weight: 600;">
      <span>🔥 Includi Riscaldamento</span>
      <input type="checkbox" id="toggle-include-warmup" ${includeWarmup ? 'checked' : ''} style="width: 18px; height: 18px; margin: 0; accent-color: var(--accent-color); cursor: pointer;">
    </label>
    <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 0.86rem; font-weight: 600;">
      <span>🧘 Includi Defaticamento / Stretching</span>
      <input type="checkbox" id="toggle-include-cooldown" ${includeCooldown ? 'checked' : ''} style="width: 18px; height: 18px; margin: 0; accent-color: var(--accent-color); cursor: pointer;">
    </label>
  </div>
`;

const renderExtrasEditorBlockHtml = (kind, items) => {
  const isWarm = kind === 'warmup';
  const title = isWarm ? '🔥 Riscaldamento (Pre-Workout)' : '🧘 Defaticamento / Stretching (Post-Workout)';
  const accent = isWarm ? '#fb923c' : '#38bdf8';
  return `
    <div class="card" id="${kind}-editor-card" style="border-left: 3px solid ${accent};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-size: 0.9rem; font-weight: 800; color: ${accent};">${title}</div>
        <button type="button" class="add-extra-row-btn" data-kind="${kind}" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #fff; border-radius: 8px; padding: 4px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer;">+ Aggiungi</button>
      </div>
      ${items.length === 0 ? `<div style="font-size: 0.78rem; color: var(--text-secondary);">Nessun esercizio inserito. Tocca "+ Aggiungi" per sceglierne uno.</div>` : ''}
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${items.map((item, idx) => `
          <div class="extra-ex-row" data-kind="${kind}" data-idx="${idx}" style="display: grid; grid-template-columns: 1fr 78px auto auto; gap: 6px; align-items: center;">
            <input type="text" class="extra-ex-name" data-kind="${kind}" data-idx="${idx}" placeholder="${isWarm ? 'es. Mobilità spalle / Cyclette' : 'es. Stretching petto'}" value="${(item.name || '').replace(/"/g, '&quot;')}" style="margin: 0; padding: 8px 10px; font-size: 0.84rem;">
            <input type="text" class="extra-ex-dur" data-kind="${kind}" data-idx="${idx}" placeholder="5 min" value="${(item.duration || '').replace(/"/g, '&quot;')}" style="margin: 0; padding: 8px 6px; font-size: 0.82rem; text-align: center;">
            <button type="button" class="extra-ex-pick" data-kind="${kind}" data-idx="${idx}" title="Cerca nel catalogo" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; border-radius: 8px; padding: 7px 8px; font-size: 0.8rem; cursor: pointer;">🔍</button>
            <button type="button" class="extra-ex-del" data-kind="${kind}" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: 0.95rem; cursor: pointer; padding: 4px 6px;">✕</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const bindRoutineExtrasLogic = (state, syncMainFn, rerenderFn) => {
  const syncExtrasDom = () => {
    document.querySelectorAll('.extra-ex-row').forEach(row => {
      const kind = row.dataset.kind;
      const idx = parseInt(row.dataset.idx, 10);
      const list = kind === 'warmup' ? state.warmupExercises : state.cooldownExercises;
      if (list[idx]) {
        list[idx].name = row.querySelector('.extra-ex-name')?.value?.trim() || '';
        list[idx].duration = row.querySelector('.extra-ex-dur')?.value?.trim() || '';
      }
    });
  };

  document.getElementById('toggle-include-warmup')?.addEventListener('change', (e) => {
    syncMainFn();
    syncExtrasDom();
    state.includeWarmup = e.target.checked;
    if (state.includeWarmup && state.warmupExercises.length === 0) {
      state.warmupExercises.push({ name: 'Mobilità articolare', duration: '5 min' });
    }
    rerenderFn();
  });

  document.getElementById('toggle-include-cooldown')?.addEventListener('change', (e) => {
    syncMainFn();
    syncExtrasDom();
    state.includeCooldown = e.target.checked;
    if (state.includeCooldown && state.cooldownExercises.length === 0) {
      state.cooldownExercises.push({ name: 'Stretching generale', duration: '5 min' });
    }
    rerenderFn();
  });

  document.querySelectorAll('.add-extra-row-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      syncMainFn();
      syncExtrasDom();
      const list = btn.dataset.kind === 'warmup' ? state.warmupExercises : state.cooldownExercises;
      list.push({ name: '', duration: '3 min' });
      rerenderFn();
    });
  });

  document.querySelectorAll('.extra-ex-del').forEach(btn => {
    btn.addEventListener('click', () => {
      syncMainFn();
      syncExtrasDom();
      const list = btn.dataset.kind === 'warmup' ? state.warmupExercises : state.cooldownExercises;
      list.splice(parseInt(btn.dataset.idx, 10), 1);
      rerenderFn();
    });
  });

  document.querySelectorAll('.extra-ex-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      syncMainFn();
      syncExtrasDom();
      const kind = btn.dataset.kind;
      const idx = parseInt(btn.dataset.idx, 10);
      const list = kind === 'warmup' ? state.warmupExercises : state.cooldownExercises;
      openExercisePickerModal('Tutti', (name) => {
        if (list[idx]) list[idx].name = name;
        rerenderFn();
      });
    });
  });

  return syncExtrasDom;
};

const renderEditRoutine = (routineId) => {
  const routine = routines.find(r => r.id == routineId);
  let editExercises = routine.exercises.map(ex => {
    const muscle = ex._muscle || getMuscleGroup(ex.name);
    const muscles = Array.isArray(ex.muscles) && ex.muscles.length > 0
      ? [...ex.muscles]
      : (muscle ? [muscle] : []);
    const inDb = EXERCISE_DB[muscle] && EXERCISE_DB[muscle].includes(ex.name);
    return {
      ...ex,
      _muscle: muscle,
      muscles,
      tut: ex.tut || '',
      _manual: ex._manual !== undefined ? ex._manual : (ex.name ? !inDb : false),
      _multiWeight: Array.isArray(ex.weight),
      _multiReps: Array.isArray(ex.reps),
      notes: ex.notes || '',
      autoProgression: ex.autoProgression !== false,
      progPositive: ex.progPositive || 'weight_2.5',
      progNegative: ex.progNegative || 'decrease_10pct'
    };
  });
  let currentType = routine.type || 'standard';
  const extrasState = {
    includeWarmup: Boolean(routine.includeWarmup),
    warmupExercises: Array.isArray(routine.warmupExercises) ? JSON.parse(JSON.stringify(routine.warmupExercises)) : [],
    includeCooldown: Boolean(routine.includeCooldown),
    cooldownExercises: Array.isArray(routine.cooldownExercises) ? JSON.parse(JSON.stringify(routine.cooldownExercises)) : []
  };
  let syncExtrasDomFn = () => {};

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
          ${renderWarmupCooldownTogglesHtml(extrasState.includeWarmup, extrasState.includeCooldown)}
        </div>

        ${extrasState.includeWarmup ? renderExtrasEditorBlockHtml('warmup', extrasState.warmupExercises) : ''}

        <div id="exercises-container">
          ${editExercises.map((ex, i) => {
            const type = currentType;
            const isLinkedSuperset = type !== 'circuit' && (Boolean(ex.supersetWithNext) || (i > 0 && Boolean(editExercises[i - 1]?.supersetWithNext)));
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
                  <div style="display: grid; grid-template-columns: 1.4fr 1fr 0.8fr 0.7fr; gap: 8px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${ex.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${ex.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">TUT (s)</div>
                      <input type="text" class="ex-tut" placeholder="es. 40" value="${ex.tut || ''}">
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
            <div class="card exercise-form-card draggable-item ${isLinkedSuperset ? 'superset-card-linked' : ''}" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div class="drag-handle" style="margin-right: 4px">⠿</div>
                  <span class="badge">Esercizio ${i + 1}</span>
                  ${isLinkedSuperset ? `<span class="superset-badge">🔗 Superset</span>` : ''}
                </div>
                <div style="display: flex; gap: 10px; align-items: center">
                  ${ex.name ? `<button type="button" class="preview-ex-edit" data-index="${i}" title="Vedi esecuzione" style="background:rgba(200,255,0,0.12); border:1px solid rgba(200,255,0,0.3); color:var(--accent-color); border-radius:6px; padding:2px 6px; cursor:pointer; font-size: 0.72rem">👁️</button>` : ''}
                  <button type="button" class="open-picker-edit" data-index="${i}" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#fff; border-radius:6px; padding:3px 7px; cursor:pointer; font-size: 0.7rem">🔍 Cerca</button>
                  <button class="toggle-manual-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${ex._manual ? 'Usa Lista' : 'Scrivi a mano'}</button>
                  <button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${ex._manual || ex._muscle === 'Altro'
                  ? renderManualMuscleAndNameHtml(ex, i)
                  : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${i}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(EXERCISE_DB).map(m => `<option value="${m}" ${ex._muscle === m ? 'selected' : ''}>${m}</option>`).join('')}
                        <option value="__custom__">✍️ Inserisci a mano...</option>
                      </select>
                      <select class="ex-name" data-index="${i}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(EXERCISE_DB[ex._muscle] || []).map(e => {
                          const isSel = ex.name && (e.toLowerCase() === ex.name.toLowerCase());
                          return `<option value="${e}" ${isSel ? 'selected' : ''}>${e}</option>`;
                        }).join('')}
                        ${ex.name && !(EXERCISE_DB[ex._muscle] || []).some(e => e.toLowerCase() === ex.name.toLowerCase()) 
                          ? `<option value="${ex.name}" selected>${ex.name}</option>` 
                          : ''}
                        <option value="__custom__">✍️ Scrivi esercizio a mano...</option>
                      </select>
                    </div>
                  `
                }
              </div>

              ${ex._multiReps ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px">
                  <div>
                    <div class="card-subtitle">Serie</div>
                    <input type="number" class="ex-sets" value="${ex.sets}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div class="card-subtitle">TUT (sec)</div>
                    <input type="text" class="ex-tut" placeholder="es. 40 o 3-1-2" value="${ex.tut || ''}" style="margin-bottom: 0">
                  </div>
                </div>
                <div style="margin-bottom: 12px">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">Reps fisse</button>
                  </div>
                  <div class="multi-reps-grid">
                    ${Array.from({ length: ex.sets }).map((_, si) => `
                      <input type="text" class="ex-reps-set-edit" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.reps) ? (ex.reps[si] || '10') : ex.reps}" placeholder="S${si+1}">
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: 0.7fr 1.25fr 1fr; gap: 10px; margin-bottom: 12px">
                  <div>
                    <div class="card-subtitle" style="margin-bottom: 5px">Serie</div>
                    <input type="number" class="ex-sets" value="${ex.sets}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                      <div class="card-subtitle">Reps</div>
                      <button class="toggle-multi-reps-edit" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.68rem; cursor:pointer">Variabili?</button>
                    </div>
                    <input type="text" class="ex-reps" value="${ex.reps}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div class="card-subtitle" style="margin-bottom: 5px">TUT (sec)</div>
                    <input type="text" class="ex-tut" placeholder="es. 40" value="${ex.tut || ''}" style="margin-bottom: 0">
                  </div>
                </div>
              `}

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
              ${i < editExercises.length - 1 ? `
                <label style="margin-top: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 0.8rem; font-weight: 700; color: #38bdf8;">
                  <span>🔗 Superset con il successivo</span>
                  <input type="checkbox" class="ex-superset-next-edit" data-index="${i}" ${ex.supersetWithNext ? 'checked' : ''} style="width: 17px; height: 17px; margin: 0; accent-color: #38bdf8; cursor: pointer;">
                </label>
              ` : ''}
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08)">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
                  <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-color)">📈 Incremento Automatico</div>
                  <label style="position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer">
                    <input type="checkbox" class="ex-auto-progression-toggle" data-index="${i}" ${ex.autoProgression !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
                    <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${ex.autoProgression !== false ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'}; border-radius: 22px; transition: 0.3s;"></span>
                    <span style="position: absolute; top: 3px; left: ${ex.autoProgression !== false ? '21px' : '3px'}; width: 16px; height: 16px; background: ${ex.autoProgression !== false ? '#000' : '#888'}; border-radius: 50%; transition: 0.3s;"></span>
                  </label>
                </div>
                
                <div class="ex-progression-settings-panel progression-rules-panel" style="display: ${ex.autoProgression !== false ? 'grid' : 'none'};">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px; color: #4ade80">✅ SE IL FEEDBACK È POSITIVO (👍)</div>
                    <select class="ex-prog-positive-action" data-index="${i}" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="weight_0.5" ${ex.progPositive === 'weight_0.5' ? 'selected' : ''}>Aumenta peso di 0.5 kg</option>
                      <option value="weight_1" ${ex.progPositive === 'weight_1' ? 'selected' : ''}>Aumenta peso di 1 kg</option>
                      <option value="weight_1.25" ${ex.progPositive === 'weight_1.25' ? 'selected' : ''}>Aumenta peso di 1.25 kg</option>
                      <option value="weight_2" ${ex.progPositive === 'weight_2' ? 'selected' : ''}>Aumenta peso di 2 kg</option>
                      <option value="weight_2.5" ${!ex.progPositive || ex.progPositive === 'weight_2.5' ? 'selected' : ''}>Aumenta peso di 2.5 kg</option>
                      <option value="weight_5" ${ex.progPositive === 'weight_5' ? 'selected' : ''}>Aumenta peso di 5 kg</option>
                      <option value="reps_1" ${ex.progPositive === 'reps_1' ? 'selected' : ''}>Aumenta di 1 Ripetizione</option>
                      <option value="reps_2" ${ex.progPositive === 'reps_2' ? 'selected' : ''}>Aumenta di 2 Ripetizioni</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px; color: #f87171">❌ SE IL FEEDBACK È NEGATIVO (👎)</div>
                    <select class="ex-prog-negative-action" data-index="${i}" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="maintain" ${ex.progNegative === 'maintain' ? 'selected' : ''}>Mantieni peso attuale</option>
                      <option value="decrease_10pct" ${!ex.progNegative || ex.progNegative === 'decrease_10pct' ? 'selected' : ''}>Riduci peso del 10% (Scarico)</option>
                      <option value="decrease_1" ${ex.progNegative === 'decrease_1' ? 'selected' : ''}>Riduci peso di 1 kg</option>
                      <option value="decrease_2.5" ${ex.progNegative === 'decrease_2.5' ? 'selected' : ''}>Riduci peso di 2.5 kg</option>
                      <option value="decrease_5" ${ex.progNegative === 'decrease_5' ? 'selected' : ''}>Riduci peso di 5 kg</option>
                    </select>
                  </div>
                </div>
              </div>
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
            </div>
          `; }).join('')}
        </div>

        ${extrasState.includeCooldown ? renderExtrasEditorBlockHtml('cooldown', extrasState.cooldownExercises) : ''}

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

    syncExtrasDomFn = bindRoutineExtrasLogic(extrasState, syncExercises, renderForm);
    document.querySelectorAll('.ex-superset-next-edit').forEach(chk => {
      chk.addEventListener('change', (e) => {
        syncExercises();
        syncExtrasDomFn();
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (editExercises[idx]) editExercises[idx].supersetWithNext = e.target.checked;
        renderForm();
      });
    });
    
    initSortable(document.getElementById('exercises-container'), () => {
      syncExercises();
      renderForm();
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
        if (editExercises[idx]) {
          if (e.target.value === '__custom__') {
            editExercises[idx]._manual = true;
            editExercises[idx].muscles = Array.isArray(editExercises[idx].muscles) ? editExercises[idx].muscles : (editExercises[idx]._muscle ? [editExercises[idx]._muscle] : []);
          } else {
            editExercises[idx]._muscle = e.target.value;
            editExercises[idx].muscles = e.target.value ? [e.target.value] : [];
            editExercises[idx].name = '';
          }
        }
        renderForm();
      });
    });

    document.querySelectorAll('.muscle-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(chip.getAttribute('data-index'));
        const muscle = chip.getAttribute('data-muscle');
        if (editExercises[idx] && muscle) {
          const list = Array.isArray(editExercises[idx].muscles)
            ? [...editExercises[idx].muscles]
            : (editExercises[idx]._muscle ? [editExercises[idx]._muscle] : []);
          const pos = list.indexOf(muscle);
          if (pos >= 0) list.splice(pos, 1);
          else list.push(muscle);
          editExercises[idx].muscles = list;
          editExercises[idx]._muscle = list[0] || '';
        }
        renderForm();
      });
    });

    document.querySelectorAll('.add-custom-muscle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        const card = btn.closest('.exercise-form-card');
        const input = card?.querySelector('.custom-muscle-input');
        const val = input?.value.trim();
        if (val && editExercises[idx]) {
          const list = Array.isArray(editExercises[idx].muscles)
            ? [...editExercises[idx].muscles]
            : (editExercises[idx]._muscle ? [editExercises[idx]._muscle] : []);
          if (!list.some(m => m.toLowerCase() === val.toLowerCase())) {
            list.push(val);
          }
          editExercises[idx].muscles = list;
          editExercises[idx]._muscle = list[0] || val;
          renderForm();
        }
      });
    });

    document.querySelectorAll('.open-picker-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        const cur = editExercises[idx];
        openExercisePickerModal(cur?._muscle || '', (name, muscle, isManual = false) => {
          if (editExercises[idx]) {
            editExercises[idx].name = name;
            editExercises[idx]._muscle = muscle || '';
            editExercises[idx].muscles = muscle ? [muscle] : [];
            editExercises[idx]._manual = !!isManual;
            renderForm();
          }
        });
      });
    });

    document.querySelectorAll('.preview-ex-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (editExercises[idx]?.name) openExerciseGuideModal(editExercises[idx].name);
      });
    });

    document.querySelectorAll('.toggle-manual-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (editExercises[idx]) editExercises[idx]._manual = !editExercises[idx]._manual;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-weight-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (editExercises[idx]) editExercises[idx]._multiWeight = !editExercises[idx]._multiWeight;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-reps-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (editExercises[idx]) editExercises[idx]._multiReps = !editExercises[idx]._multiReps;
        renderForm();
      });
    });

    document.querySelectorAll('.ex-auto-progression-toggle').forEach(tgl => {
      tgl.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (editExercises[idx]) {
          editExercises[idx].autoProgression = e.target.checked;
        }
        const card = e.target.closest('.exercise-form-card');
        if (card) {
          const panel = card.querySelector('.progression-rules-panel');
          if (panel) panel.style.display = e.target.checked ? 'grid' : 'none';
          const bg = e.target.nextElementSibling;
          const dot = bg ? bg.nextElementSibling : null;
          if (bg) bg.style.background = e.target.checked ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)';
          if (dot) {
            dot.style.left = e.target.checked ? '21px' : '3px';
            dot.style.background = e.target.checked ? '#000' : '#888';
          }
        }
      });
    });

    document.querySelectorAll('.ex-name').forEach(el => {
      const handleNameChange = (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const val = e.target.value.trim();
        if (val === '__custom__' && editExercises[idx]) {
          syncExercises();
          editExercises[idx]._manual = true;
          editExercises[idx].name = '';
          renderForm();
          return;
        }
        if (editExercises[idx] && val) {
          editExercises[idx].name = val;
        }
      };
      el.addEventListener('change', handleNameChange);
      el.addEventListener('input', handleNameChange);
    });

    document.querySelectorAll('.ex-prog-positive-action').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (editExercises[idx]) editExercises[idx].progPositive = e.target.value;
      });
    });

    document.querySelectorAll('.ex-prog-negative-action').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (editExercises[idx]) editExercises[idx].progNegative = e.target.value;
      });
    });

    document.getElementById('add-ex-row-edit').addEventListener('click', () => {
      syncExercises();
      editExercises.push({ name: '', sets: 3, reps: '10', tut: '', weight: 0, rest: 60, _muscle: '', muscles: [], _manual: false, autoProgression: true, progPositive: 'weight_2.5', progNegative: 'decrease_10pct', notes: '' });
      renderForm();
    });

    document.querySelectorAll('.remove-ex').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (idx >= 0 && idx < editExercises.length) {
          editExercises.splice(idx, 1);
        }
        renderForm();
      });
    });

    document.getElementById('save-edited-routine').addEventListener('click', () => {
      syncExercises();
      syncExtrasDomFn();
      const name = document.getElementById('edit-routine-name').value;
      const type = document.getElementById('edit-routine-type').value;
      const duration = parseInt(document.getElementById('edit-routine-duration').value) || 50;
      if (!name) return alert('Inserisci un nome per la scheda');
      
      const updatedRoutine = {
        id: routine.id,
        name,
        type,
        duration: type === 'circuit' ? duration : null,
        includeWarmup: extrasState.includeWarmup,
        warmupExercises: extrasState.includeWarmup ? extrasState.warmupExercises.filter(w => w.name && w.name.trim() !== '') : [],
        includeCooldown: extrasState.includeCooldown,
        cooldownExercises: extrasState.includeCooldown ? extrasState.cooldownExercises.filter(c => c.name && c.name.trim() !== '') : [],
        exercises: editExercises.filter(ex => ex.name && ex.name.trim() !== '').map((ex, idx, arr) => {
          const resolvedMuscles = Array.isArray(ex.muscles) && ex.muscles.length > 0
            ? ex.muscles.filter(Boolean)
            : (ex._muscle ? [ex._muscle] : [getMuscleGroup(ex.name)]);
          const exObj = {
            name: ex.name.trim(),
            sets: parseInt(ex.sets) || 3,
            reps: ex.reps || '10',
            tut: (ex.tut || '').trim(),
            weight: ex.weight !== undefined ? ex.weight : 0,
            rest: ex.rest !== undefined ? parseInt(ex.rest) : 60,
            notes: ex.notes || '',
            autoProgression: ex.autoProgression !== false,
            progPositive: ex.progPositive || 'weight_2.5',
            progNegative: ex.progNegative || 'decrease_10pct',
            supersetWithNext: idx < arr.length - 1 ? !!ex.supersetWithNext : false,
            _muscle: resolvedMuscles[0] || getMuscleGroup(ex.name),
            muscles: resolvedMuscles,
            _manual: !!ex._manual
          };
          if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
            exObj.repsRange = ex.reps;
          } else if (ex.repsRange) {
            exObj.repsRange = ex.repsRange;
          }
          return exObj;
        })
      };

      if (updatedRoutine.exercises.length === 0) return alert('Aggiungi e compila almeno un esercizio');

      const idx = routines.findIndex(r => String(r.id) === String(routine.id));
      if (idx !== -1) {
        routines[idx] = updatedRoutine;
      } else {
        routines.push(updatedRoutine);
      }
      storage.saveRoutines(routines);
      renderRoutines();
    });
  };

  const syncExercises = () => {
    const type = currentType;
    const container = document.getElementById('exercises-container');
    if (!container) return;
    const cards = container.querySelectorAll('.exercise-form-card');
    const newOrderExercises = [];
    
    cards.forEach((card, currentDOMIdx) => {
      const oldIdx = parseInt(card.getAttribute('data-index'));
      const prevEx = (oldIdx >= 0 && oldIdx < editExercises.length) ? editExercises[oldIdx] : {};
      const nameEl = card.querySelector('.ex-name');
      const repsEl = card.querySelector('.ex-reps');
      const notesEl = card.querySelector('.notes-input');
      
      const ex = { ...prevEx };
      const enteredName = nameEl ? nameEl.value : '';
      if (enteredName && enteredName.trim() !== '' && enteredName !== '__custom__') {
        ex.name = enteredName.trim();
      } else if (!ex.name) {
        ex.name = '';
      }
      const tutEl = card.querySelector('.ex-tut');
      if (tutEl) ex.tut = tutEl.value.trim();
      ex.notes = notesEl ? notesEl.value : (ex.notes || '');
      
      const autoProgEl = card.querySelector('.ex-auto-progression-toggle');
      const progPosEl = card.querySelector('.ex-prog-positive-action');
      const progNegEl = card.querySelector('.ex-prog-negative-action');
      
      if (autoProgEl) {
        ex.autoProgression = autoProgEl.checked;
      } else if (ex.autoProgression === undefined) {
        ex.autoProgression = true;
      }
      if (progPosEl) ex.progPositive = progPosEl.value;
      if (progNegEl) ex.progNegative = progNegEl.value;
      
      // Clean up old progression fields if they exist
      delete ex.progressionMode;
      delete ex.progressionType;
      delete ex.progressionStep;
      delete ex.repsThreshold;

      if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
        ex.repsRange = ex.reps;
      }

      if (type === 'circuit') {
        ex.reps = repsEl ? repsEl.value : (ex.reps || '10');
        ex.sets = 1;
        ex.rest = 0;
        const wVal = parseFloat(card.querySelector('.ex-weight-edit')?.value);
        ex.weight = !isNaN(wVal) ? wVal : (ex.weight || 0);
        ex._multiWeight = false;
        ex._multiReps = false;
      } else {
        const muscleEl = card.querySelector('.ex-muscle');
        if (muscleEl && muscleEl.value && muscleEl.value !== '__custom__') {
          ex._muscle = muscleEl.value;
          if (!Array.isArray(ex.muscles) || ex.muscles.length === 0) {
            ex.muscles = [muscleEl.value];
          }
        }
        const setsVal = parseInt(card.querySelector('.ex-sets')?.value);
        ex.sets = !isNaN(setsVal) ? setsVal : (ex.sets || 3);
        const restVal = parseInt(card.querySelector('.ex-rest')?.value);
        ex.rest = !isNaN(restVal) ? restVal : (ex.rest !== undefined ? ex.rest : 60);

        // Reps
        const multiRepsInputs = card.querySelectorAll('.ex-reps-set-edit');
        if (multiRepsInputs.length > 0) {
          ex.reps = Array.from(multiRepsInputs).map(inp => inp.value || '10');
          ex._multiReps = true;
        } else if (repsEl) {
          ex.reps = repsEl.value || '10';
          ex._multiReps = false;
        }

        // Weight
        const multiWeightInputs = card.querySelectorAll('.ex-weight-set-edit');
        if (multiWeightInputs.length > 0) {
          ex.weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
          ex._multiWeight = true;
        } else {
          const singleWeightInput = card.querySelector('.ex-weight-edit');
          if (singleWeightInput) {
            ex.weight = parseFloat(singleWeightInput.value) || 0;
            ex._multiWeight = false;
          }
        }
      }

      // Keep DOM data-index in sync with array position
      card.setAttribute('data-index', currentDOMIdx);
      card.querySelectorAll('[data-index]').forEach(el => el.setAttribute('data-index', currentDOMIdx));

      newOrderExercises.push(ex);
    });
    editExercises = newOrderExercises;
  };

  renderForm();
};

const renderAddRoutine = (initialExercises = null) => {
  let newExercises = initialExercises ? initialExercises.map(ex => {
    const muscle = ex._muscle || getMuscleGroup(ex.name);
    const muscles = Array.isArray(ex.muscles) && ex.muscles.length > 0
      ? [...ex.muscles]
      : (muscle ? [muscle] : []);
    const inDb = EXERCISE_DB[muscle] && EXERCISE_DB[muscle].includes(ex.name);
    return {
      ...ex,
      _muscle: muscle,
      muscles,
      tut: ex.tut || '',
      _manual: ex._manual !== undefined ? ex._manual : (ex.name ? !inDb : false),
      _multiWeight: Array.isArray(ex.weight),
      _multiReps: Array.isArray(ex.reps),
      notes: ex.notes || '',
      autoProgression: ex.autoProgression !== false,
      progPositive: ex.progPositive || 'weight_2.5',
      progNegative: ex.progNegative || 'decrease_10pct'
    };
  }) : [{ name: '', sets: 3, reps: '10', tut: '', weight: 0, rest: 60, _muscle: '', muscles: [], _manual: false, autoProgression: true, progPositive: 'weight_2.5', progNegative: 'decrease_10pct', notes: '' }];
  let currentType = 'standard';
  let currentDuration = 50;
  const extrasState = {
    includeWarmup: false,
    warmupExercises: [],
    includeCooldown: false,
    cooldownExercises: []
  };
  let syncExtrasDomFn = () => {};

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
          ${renderWarmupCooldownTogglesHtml(extrasState.includeWarmup, extrasState.includeCooldown)}
        </div>

        ${extrasState.includeWarmup ? renderExtrasEditorBlockHtml('warmup', extrasState.warmupExercises) : ''}

        <div id="exercises-container">
          ${newExercises.map((ex, i) => {
            const type = currentType;
            const isLinkedSuperset = type !== 'circuit' && (Boolean(ex.supersetWithNext) || (i > 0 && Boolean(newExercises[i - 1]?.supersetWithNext)));
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
                  <div style="display: grid; grid-template-columns: 1.4fr 1fr 0.8fr 0.7fr; gap: 8px">
                    <div>
                      <div class="card-subtitle">Nome</div>
                      <input type="text" class="ex-name" placeholder="es. Push up" value="${ex.name}">
                    </div>
                    <div>
                      <div class="card-subtitle">Reps/Tempo</div>
                      <input type="text" class="ex-reps" placeholder="10 o 2 min" value="${ex.reps}">
                    </div>
                    <div>
                      <div class="card-subtitle">TUT (s)</div>
                      <input type="text" class="ex-tut" placeholder="es. 40" value="${ex.tut || ''}">
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
            <div class="card exercise-form-card draggable-item ${isLinkedSuperset ? 'superset-card-linked' : ''}" data-index="${i}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div class="drag-handle" style="margin-right: 4px">⠿</div>
                  <span class="badge">Esercizio ${i + 1}</span>
                  ${isLinkedSuperset ? `<span class="superset-badge">🔗 Superset</span>` : ''}
                </div>
                <div style="display: flex; gap: 10px; align-items: center">
                  ${ex.name ? `<button type="button" class="preview-ex-add" data-index="${i}" title="Vedi esecuzione" style="background:rgba(200,255,0,0.12); border:1px solid rgba(200,255,0,0.3); color:var(--accent-color); border-radius:6px; padding:2px 6px; cursor:pointer; font-size: 0.72rem">👁️</button>` : ''}
                  <button type="button" class="open-picker-add" data-index="${i}" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#fff; border-radius:6px; padding:3px 7px; cursor:pointer; font-size: 0.7rem">🔍 Cerca</button>
                  <button class="toggle-manual" data-index="${i}" style="background:none; border:none; color:var(--accent-color); cursor:pointer; font-size: 0.7rem">${ex._manual ? 'Usa Lista' : 'Scrivi a mano'}</button>
                  ${newExercises.length > 1 ? `<button class="remove-ex" data-index="${i}" style="background:none; border:none; color:var(--danger); cursor:pointer">Rimuovi</button>` : ''}
                </div>
              </div>
              
              <div style="margin-bottom: 12px">
                ${ex._manual || ex._muscle === 'Altro'
                  ? renderManualMuscleAndNameHtml(ex, i)
                  : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
                      <select class="ex-muscle" data-index="${i}" style="margin: 0">
                        <option value="">Muscolo...</option>
                        ${Object.keys(EXERCISE_DB).map(m => `<option value="${m}" ${ex._muscle === m ? 'selected' : ''}>${m}</option>`).join('')}
                        <option value="__custom__">✍️ Inserisci a mano...</option>
                      </select>
                      <select class="ex-name" data-index="${i}" style="margin: 0">
                        <option value="">Esercizio...</option>
                        ${(EXERCISE_DB[ex._muscle] || []).map(e => {
                          const isSel = ex.name && (e.toLowerCase() === ex.name.toLowerCase());
                          return `<option value="${e}" ${isSel ? 'selected' : ''}>${e}</option>`;
                        }).join('')}
                        ${ex.name && !(EXERCISE_DB[ex._muscle] || []).some(e => e.toLowerCase() === ex.name.toLowerCase()) 
                          ? `<option value="${ex.name}" selected>${ex.name}</option>` 
                          : ''}
                        <option value="__custom__">✍️ Scrivi esercizio a mano...</option>
                      </select>
                    </div>
                  `
                }
              </div>

              ${ex._multiReps ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px">
                  <div>
                    <div class="card-subtitle">Serie</div>
                    <input type="number" class="ex-sets" value="${ex.sets}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div class="card-subtitle">TUT (sec)</div>
                    <input type="text" class="ex-tut" placeholder="es. 40 o 3-1-2" value="${ex.tut || ''}" style="margin-bottom: 0">
                  </div>
                </div>
                <div style="margin-bottom: 12px">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                    <div class="card-subtitle">Reps</div>
                    <button class="toggle-multi-reps" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.7rem; cursor:pointer">Reps fisse</button>
                  </div>
                  <div class="multi-reps-grid">
                    ${Array.from({ length: ex.sets }).map((_, si) => `
                      <input type="text" class="ex-reps-set" data-index="${i}" data-set="${si}" value="${Array.isArray(ex.reps) ? (ex.reps[si] || '10') : ex.reps}" placeholder="S${si+1}">
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: 0.7fr 1.25fr 1fr; gap: 10px; margin-bottom: 12px">
                  <div>
                    <div class="card-subtitle" style="margin-bottom: 5px">Serie</div>
                    <input type="number" class="ex-sets" value="${ex.sets}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
                      <div class="card-subtitle">Reps</div>
                      <button class="toggle-multi-reps" data-index="${i}" style="background:none; border:none; color:var(--accent-color); font-size: 0.68rem; cursor:pointer">Variabili?</button>
                    </div>
                    <input type="text" class="ex-reps" value="${ex.reps}" style="margin-bottom: 0">
                  </div>
                  <div>
                    <div class="card-subtitle" style="margin-bottom: 5px">TUT (sec)</div>
                    <input type="text" class="ex-tut" placeholder="es. 40" value="${ex.tut || ''}" style="margin-bottom: 0">
                  </div>
                </div>
              `}

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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
                  <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-color)">📈 Incremento Automatico</div>
                  <label style="position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer">
                    <input type="checkbox" class="ex-auto-progression-toggle" data-index="${i}" ${ex.autoProgression !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
                    <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${ex.autoProgression !== false ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'}; border-radius: 22px; transition: 0.3s;"></span>
                    <span style="position: absolute; top: 3px; left: ${ex.autoProgression !== false ? '21px' : '3px'}; width: 16px; height: 16px; background: ${ex.autoProgression !== false ? '#000' : '#888'}; border-radius: 50%; transition: 0.3s;"></span>
                  </label>
                </div>
                
                <div class="ex-progression-settings-panel progression-rules-panel" style="display: ${ex.autoProgression !== false ? 'grid' : 'none'};">
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px; color: #4ade80">✅ SE IL FEEDBACK È POSITIVO (👍)</div>
                    <select class="ex-prog-positive-action" data-index="${i}" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="weight_0.5" ${ex.progPositive === 'weight_0.5' ? 'selected' : ''}>Aumenta peso di 0.5 kg</option>
                      <option value="weight_1" ${ex.progPositive === 'weight_1' ? 'selected' : ''}>Aumenta peso di 1 kg</option>
                      <option value="weight_1.25" ${ex.progPositive === 'weight_1.25' ? 'selected' : ''}>Aumenta peso di 1.25 kg</option>
                      <option value="weight_2" ${ex.progPositive === 'weight_2' ? 'selected' : ''}>Aumenta peso di 2 kg</option>
                      <option value="weight_2.5" ${!ex.progPositive || ex.progPositive === 'weight_2.5' ? 'selected' : ''}>Aumenta peso di 2.5 kg</option>
                      <option value="weight_5" ${ex.progPositive === 'weight_5' ? 'selected' : ''}>Aumenta peso di 5 kg</option>
                      <option value="reps_1" ${ex.progPositive === 'reps_1' ? 'selected' : ''}>Aumenta di 1 Ripetizione</option>
                      <option value="reps_2" ${ex.progPositive === 'reps_2' ? 'selected' : ''}>Aumenta di 2 Ripetizioni</option>
                    </select>
                  </div>
                  <div>
                    <div class="card-subtitle" style="font-size: 0.65rem; margin-bottom: 4px; color: #f87171">❌ SE IL FEEDBACK È NEGATIVO (👎)</div>
                    <select class="ex-prog-negative-action" data-index="${i}" style="padding: 6px; font-size: 0.75rem; margin: 0">
                      <option value="maintain" ${ex.progNegative === 'maintain' ? 'selected' : ''}>Mantieni peso attuale</option>
                      <option value="decrease_10pct" ${!ex.progNegative || ex.progNegative === 'decrease_10pct' ? 'selected' : ''}>Riduci peso del 10% (Scarico)</option>
                      <option value="decrease_1" ${ex.progNegative === 'decrease_1' ? 'selected' : ''}>Riduci peso di 1 kg</option>
                      <option value="decrease_2.5" ${ex.progNegative === 'decrease_2.5' ? 'selected' : ''}>Riduci peso di 2.5 kg</option>
                      <option value="decrease_5" ${ex.progNegative === 'decrease_5' ? 'selected' : ''}>Riduci peso di 5 kg</option>
                    </select>
                  </div>
                </div>
              </div>
              <textarea class="notes-input" placeholder="Note per l'esercizio...">${ex.notes || ''}</textarea>
            </div>
          `; }).join('')}
        </div>

        ${extrasState.includeCooldown ? renderExtrasEditorBlockHtml('cooldown', extrasState.cooldownExercises) : ''}

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

    syncExtrasDomFn = bindRoutineExtrasLogic(extrasState, syncExercises, renderForm);
    document.querySelectorAll('.ex-superset-next-edit').forEach(chk => {
      chk.addEventListener('change', (e) => {
        syncExercises();
        syncExtrasDomFn();
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (newExercises[idx]) newExercises[idx].supersetWithNext = e.target.checked;
        renderForm();
      });
    });

    initSortable(document.getElementById('exercises-container'), () => {
      syncExercises();
      renderForm();
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
        if (newExercises[idx]) {
          if (e.target.value === '__custom__') {
            newExercises[idx]._manual = true;
            newExercises[idx].muscles = Array.isArray(newExercises[idx].muscles) ? newExercises[idx].muscles : (newExercises[idx]._muscle ? [newExercises[idx]._muscle] : []);
          } else {
            newExercises[idx]._muscle = e.target.value;
            newExercises[idx].muscles = e.target.value ? [e.target.value] : [];
            newExercises[idx].name = ''; 
          }
        }
        renderForm();
      });
    });

    document.querySelectorAll('.muscle-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(chip.getAttribute('data-index'));
        const muscle = chip.getAttribute('data-muscle');
        if (newExercises[idx] && muscle) {
          const list = Array.isArray(newExercises[idx].muscles)
            ? [...newExercises[idx].muscles]
            : (newExercises[idx]._muscle ? [newExercises[idx]._muscle] : []);
          const pos = list.indexOf(muscle);
          if (pos >= 0) list.splice(pos, 1);
          else list.push(muscle);
          newExercises[idx].muscles = list;
          newExercises[idx]._muscle = list[0] || '';
        }
        renderForm();
      });
    });

    document.querySelectorAll('.add-custom-muscle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        const card = btn.closest('.exercise-form-card');
        const input = card?.querySelector('.custom-muscle-input');
        const val = input?.value.trim();
        if (val && newExercises[idx]) {
          const list = Array.isArray(newExercises[idx].muscles)
            ? [...newExercises[idx].muscles]
            : (newExercises[idx]._muscle ? [newExercises[idx]._muscle] : []);
          if (!list.some(m => m.toLowerCase() === val.toLowerCase())) {
            list.push(val);
          }
          newExercises[idx].muscles = list;
          newExercises[idx]._muscle = list[0] || val;
          renderForm();
        }
      });
    });

    document.querySelectorAll('.open-picker-add').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        const cur = newExercises[idx];
        openExercisePickerModal(cur?._muscle || '', (name, muscle, isManual = false) => {
          if (newExercises[idx]) {
            newExercises[idx].name = name;
            newExercises[idx]._muscle = muscle || '';
            newExercises[idx].muscles = muscle ? [muscle] : [];
            newExercises[idx]._manual = !!isManual;
            renderForm();
          }
        });
      });
    });

    document.querySelectorAll('.preview-ex-add').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (newExercises[idx]?.name) openExerciseGuideModal(newExercises[idx].name);
      });
    });

    document.querySelectorAll('.toggle-manual').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (newExercises[idx]) newExercises[idx]._manual = !newExercises[idx]._manual;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-weight').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (newExercises[idx]) newExercises[idx]._multiWeight = !newExercises[idx]._multiWeight;
        renderForm();
      });
    });

    document.querySelectorAll('.toggle-multi-reps').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (newExercises[idx]) newExercises[idx]._multiReps = !newExercises[idx]._multiReps;
        renderForm();
      });
    });

    document.querySelectorAll('.ex-auto-progression-toggle').forEach(tgl => {
      tgl.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (newExercises[idx]) {
          newExercises[idx].autoProgression = e.target.checked;
        }
        const card = e.target.closest('.exercise-form-card');
        if (card) {
          const panel = card.querySelector('.progression-rules-panel');
          if (panel) panel.style.display = e.target.checked ? 'grid' : 'none';
          const bg = e.target.nextElementSibling;
          const dot = bg ? bg.nextElementSibling : null;
          if (bg) bg.style.background = e.target.checked ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)';
          if (dot) {
            dot.style.left = e.target.checked ? '21px' : '3px';
            dot.style.background = e.target.checked ? '#000' : '#888';
          }
        }
      });
    });

    document.querySelectorAll('.ex-name').forEach(el => {
      const handleNameChange = (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const val = e.target.value.trim();
        if (val === '__custom__' && newExercises[idx]) {
          syncExercises();
          newExercises[idx]._manual = true;
          newExercises[idx].name = '';
          renderForm();
          return;
        }
        if (newExercises[idx] && val) {
          newExercises[idx].name = val;
        }
      };
      el.addEventListener('change', handleNameChange);
      el.addEventListener('input', handleNameChange);
    });

    document.querySelectorAll('.ex-prog-positive-action').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (newExercises[idx]) newExercises[idx].progPositive = e.target.value;
      });
    });

    document.querySelectorAll('.ex-prog-negative-action').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (newExercises[idx]) newExercises[idx].progNegative = e.target.value;
      });
    });

    document.getElementById('add-ex-row').addEventListener('click', () => {
      syncExercises();
      newExercises.push({ name: '', sets: 3, reps: '10', tut: '', weight: 0, rest: 60, _muscle: '', muscles: [], _manual: false, autoProgression: true, progPositive: 'weight_2.5', progNegative: 'decrease_10pct', notes: '' });
      renderForm();
    });

    document.querySelectorAll('.remove-ex').forEach(btn => {
      btn.addEventListener('click', () => {
        syncExercises();
        const idx = parseInt(btn.getAttribute('data-index'));
        if (idx >= 0 && idx < newExercises.length) {
          newExercises.splice(idx, 1);
        }
        renderForm();
      });
    });

    document.getElementById('save-routine').addEventListener('click', () => {
      syncExercises();
      syncExtrasDomFn();
      const name = document.getElementById('routine-name-input').value;
      const type = document.getElementById('routine-type-select').value;
      const duration = parseInt(document.getElementById('routine-duration-input').value) || 50;
      if (!name) return alert('Inserisci un nome per la scheda');
      
      const newRoutine = {
        id: Date.now(),
        name,
        type,
        duration: type === 'circuit' ? duration : null,
        includeWarmup: extrasState.includeWarmup,
        warmupExercises: extrasState.includeWarmup ? extrasState.warmupExercises.filter(w => w.name && w.name.trim() !== '') : [],
        includeCooldown: extrasState.includeCooldown,
        cooldownExercises: extrasState.includeCooldown ? extrasState.cooldownExercises.filter(c => c.name && c.name.trim() !== '') : [],
        exercises: newExercises.filter(ex => ex.name && ex.name.trim() !== '').map((ex, idx, arr) => {
          const resolvedMuscles = Array.isArray(ex.muscles) && ex.muscles.length > 0
            ? ex.muscles.filter(Boolean)
            : (ex._muscle ? [ex._muscle] : [getMuscleGroup(ex.name)]);
          const exObj = {
            name: ex.name.trim(),
            sets: parseInt(ex.sets) || 3,
            reps: ex.reps || '10',
            tut: (ex.tut || '').trim(),
            weight: ex.weight !== undefined ? ex.weight : 0,
            rest: ex.rest !== undefined ? parseInt(ex.rest) : 60,
            notes: ex.notes || '',
            autoProgression: ex.autoProgression !== false,
            progPositive: ex.progPositive || 'weight_2.5',
            progNegative: ex.progNegative || 'decrease_10pct',
            supersetWithNext: idx < arr.length - 1 ? !!ex.supersetWithNext : false,
            _muscle: resolvedMuscles[0] || getMuscleGroup(ex.name),
            muscles: resolvedMuscles,
            _manual: !!ex._manual
          };
          if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
            exObj.repsRange = ex.reps;
          } else if (ex.repsRange) {
            exObj.repsRange = ex.repsRange;
          }
          return exObj;
        })
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
    
    const container = document.getElementById('exercises-container');
    if (!container) return;
    const cards = container.querySelectorAll('.exercise-form-card');
    const newOrderExercises = [];

    cards.forEach((card, currentDOMIdx) => {
      const oldIdx = parseInt(card.getAttribute('data-index'));
      const prevEx = (oldIdx >= 0 && oldIdx < newExercises.length) ? newExercises[oldIdx] : {};
      const nameEl = card.querySelector('.ex-name');
      const repsEl = card.querySelector('.ex-reps');
      const notesEl = card.querySelector('.notes-input');
      
      const ex = { ...prevEx };
      const enteredName = nameEl ? nameEl.value : '';
      if (enteredName && enteredName.trim() !== '' && enteredName !== '__custom__') {
        ex.name = enteredName.trim();
      } else if (!ex.name) {
        ex.name = '';
      }
      const tutEl = card.querySelector('.ex-tut');
      if (tutEl) ex.tut = tutEl.value.trim();
      ex.notes = notesEl ? notesEl.value : (ex.notes || '');
      
      const autoProgEl = card.querySelector('.ex-auto-progression-toggle');
      const progPosEl = card.querySelector('.ex-prog-positive-action');
      const progNegEl = card.querySelector('.ex-prog-negative-action');
      
      if (autoProgEl) {
        ex.autoProgression = autoProgEl.checked;
      } else if (ex.autoProgression === undefined) {
        ex.autoProgression = true;
      }
      if (progPosEl) ex.progPositive = progPosEl.value;
      if (progNegEl) ex.progNegative = progNegEl.value;
      
      // Clean up old progression fields if they exist
      delete ex.progressionMode;
      delete ex.progressionType;
      delete ex.progressionStep;
      delete ex.repsThreshold;

      if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
        ex.repsRange = ex.reps;
      }

      if (type === 'circuit') {
        ex.sets = 1;
        ex.rest = 0;
        ex.reps = repsEl ? repsEl.value : (ex.reps || '10');
        const wVal = parseFloat(card.querySelector('.ex-weight-init')?.value);
        ex.weight = !isNaN(wVal) ? wVal : (ex.weight || 0);
        ex._multiWeight = false;
        ex._multiReps = false;
      } else {
        const muscleEl = card.querySelector('.ex-muscle');
        if (muscleEl && muscleEl.value && muscleEl.value !== '__custom__') {
          ex._muscle = muscleEl.value;
          if (!Array.isArray(ex.muscles) || ex.muscles.length === 0) {
            ex.muscles = [muscleEl.value];
          }
        }
        const setsVal = parseInt(card.querySelector('.ex-sets')?.value);
        ex.sets = !isNaN(setsVal) ? setsVal : (ex.sets || 3);
        const restVal = parseInt(card.querySelector('.ex-rest')?.value);
        ex.rest = !isNaN(restVal) ? restVal : (ex.rest !== undefined ? ex.rest : 60);

        // Reps
        const multiRepsInputs = card.querySelectorAll('.ex-reps-set');
        if (multiRepsInputs.length > 0) {
          ex.reps = Array.from(multiRepsInputs).map(inp => inp.value || '10');
          ex._multiReps = true;
        } else if (repsEl) {
          ex.reps = repsEl.value || '10';
          ex._multiReps = false;
        }

        // Weight
        const multiWeightInputs = card.querySelectorAll('.ex-weight-set');
        if (multiWeightInputs.length > 0) {
          ex.weight = Array.from(multiWeightInputs).map(inp => parseFloat(inp.value) || 0);
          ex._multiWeight = true;
        } else {
          const singleWeightInput = card.querySelector('.ex-weight-init');
          if (singleWeightInput) {
            ex.weight = parseFloat(singleWeightInput.value) || 0;
            ex._multiWeight = false;
          }
        }
      }

      // Keep DOM data-index in sync with array position
      card.setAttribute('data-index', currentDOMIdx);
      card.querySelectorAll('[data-index]').forEach(el => el.setAttribute('data-index', currentDOMIdx));

      newOrderExercises.push(ex);
    });

    newExercises = newOrderExercises;
  };

  renderForm();
};

const drawRoundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const exportRoutineToImage = (routine) => {
  if (!routine) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = 1080;
  const rowHeight = 130;
  const headerHeight = 320;
  const footerHeight = 160;
  const height = Math.max(1080, headerHeight + (routine.exercises.length * rowHeight) + footerHeight);
  
  canvas.width = width;
  canvas.height = height;

  // Sfondo Dark Glassmorphism
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f0f14');
  bgGrad.addColorStop(1, '#1a1a24');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Bagliori radiali
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 500);
  glow1.addColorStop(0, 'rgba(204, 255, 0, 0.15)');
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width - 200, height - 200, 10, width - 200, height - 200, 600);
  glow2.addColorStop(0, 'rgba(0, 255, 136, 0.12)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Cornice principale
  drawRoundRect(ctx, 40, 40, width - 80, height - 80, 36);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.stroke();

  // Header
  ctx.font = '700 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ccff00';
  ctx.fillText('IRONTRACK • WORKOUT PLAN', 80, 110);

  ctx.font = '800 58px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(routine.name, 80, 185);

  ctx.font = '500 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  const infoText = routine.type === 'circuit' 
    ? `🔄 Circuito AMRAP • ${routine.duration || 50} min` 
    : `💪 Sessione Standard • ${routine.exercises.length} esercizi`;
  ctx.fillText(infoText, 80, 240);

  ctx.beginPath();
  ctx.moveTo(80, 275);
  ctx.lineTo(width - 80, 275);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Lista Esercizi
  let currentY = 320;
  routine.exercises.forEach((ex, idx) => {
    const cardW = width - 160;
    const cardH = 100;
    
    drawRoundRect(ctx, 80, currentY, cardW, cardH, 20);
    ctx.fillStyle = ex.hadPositiveFeedback ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = ex.hadPositiveFeedback ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    if (ex.hadPositiveFeedback) {
      drawRoundRect(ctx, 82, currentY + 2, 8, cardH - 4, 6);
      ctx.fillStyle = '#00ff88';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(140, currentY + cardH / 2, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(204, 255, 0, 0.15)';
    ctx.fill();
    ctx.font = '800 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ccff00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${idx + 1}`, 140, currentY + cardH / 2);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '700 36px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = ex.hadPositiveFeedback ? '#00ff88' : '#ffffff';
    let exTitle = ex.name;
    if (ex.hadPositiveFeedback) exTitle += ' ⚡ (Aumentare)';
    ctx.fillText(exTitle, 190, currentY + cardH / 2);

    ctx.textAlign = 'right';
    ctx.font = '700 34px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ccff00';
    let details = `${ex.sets || 3}x${ex.reps || 10}`;
    if (ex.weight && (typeof ex.weight === 'number' && ex.weight > 0 || Array.isArray(ex.weight))) {
      const wStr = Array.isArray(ex.weight) ? ex.weight[0] : ex.weight;
      details += ` • ${wStr} kg`;
    }
    ctx.fillText(details, width - 110, currentY + cardH / 2);

    currentY += rowHeight;
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 500 26px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#666677';
  ctx.fillText('Generato con IronTrack — Allenati con Intelligenza 🚀', width / 2, height - 80);

  // Esporta e Condividi
  canvas.toBlob((blob) => {
    if (!blob) return;
    const fileName = `irontrack_${routine.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: `IronTrack - ${routine.name}`,
        text: `Ecco la mia scheda "${routine.name}" creata con IronTrack! 💪`
      }).catch(() => {
        // Fallback in caso di annullamento o errore
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, 'image/png', 1.0);
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
        ${routine.includeWarmup && Array.isArray(routine.warmupExercises) && routine.warmupExercises.length > 0 ? `
          <div style="margin-bottom: 14px; padding: 10px 12px; border-radius: 12px; background: rgba(251, 146, 60, 0.08); border-left: 3px solid #fb923c;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #fb923c; text-transform: uppercase; margin-bottom: 6px;">🔥 Riscaldamento</div>
            ${routine.warmupExercises.map(w => `
              <div style="display: flex; justify-content: space-between; font-size: 0.84rem; color: #e2e8f0; margin-bottom: 3px;">
                <span>${w.name}</span>
                <span style="color: var(--text-secondary)">${w.duration || ''}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="card-subtitle" style="margin-bottom: 10px">Esercizi in programma:</div>
        ${routine.exercises.map((ex, idx, arr) => {
          const muscles = getExerciseMuscles(ex);
          const muscle = muscles[0] || getMuscleGroup(ex.name);
          const icon = getMuscleIcon(muscle);
          const tutStr = formatTut(ex.tut);
          const inSuperset = Boolean(ex.supersetWithNext) || (idx > 0 && Boolean(arr[idx - 1]?.supersetWithNext));
          return `
            <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 10px; font-size: 0.9rem; align-items: center; ${ex.hadPositiveFeedback ? 'background: rgba(0, 255, 136, 0.08); padding: 8px 12px; border-radius: 10px; border-left: 3px solid var(--success);' : (inSuperset ? 'padding: 6px 10px; border-radius: 10px; border-left: 3px solid #38bdf8; background: rgba(56,189,248,0.06);' : '')}">
              <div style="display: flex; align-items: center; min-width: 0; flex: 1;">
                <span class="ex-icon" style="font-size: 0.9rem; width: 24px; height: 24px; margin-right: 8px; background: rgba(255,255,255,0.03); flex-shrink: 0;">${icon}</span>
                <div style="min-width: 0;">
                  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                    <span style="font-weight: ${ex.hadPositiveFeedback ? '700' : '400'}; color: ${ex.hadPositiveFeedback ? '#00ff88' : 'white'}">${ex.name}</span>
                    <button type="button" class="btn-ex-info" data-exercise="${ex.name.replace(/"/g, '&quot;')}" title="Guida esercizio ed esecuzione">ⓘ</button>
                    ${inSuperset ? `<span class="superset-badge" style="font-size:0.58rem; padding:1px 6px;">🔗 Superset</span>` : ''}
                    ${ex.hadPositiveFeedback ? `<span class="easy-load-badge" style="margin-left: 4px; font-size: 0.6rem; padding: 1px 5px;">⚡ Carico Facile (Aumenta)</span>` : ''}
                  </div>
                  ${muscles.length > 1 ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 3px;">${muscles.map(m => `<span class="muscle-tag-mini">${m}</span>`).join('')}</div>` : ''}
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0;">
                <span style="color: var(--text-secondary)">${ex.sets}x${Array.isArray(ex.reps) ? ex.reps.join('-') : ex.reps}</span>
                ${tutStr ? `<span class="tut-badge">TUT ${tutStr}</span>` : ''}
              </div>
            </div>
          `;
        }).join('')}
        ${routine.includeCooldown && Array.isArray(routine.cooldownExercises) && routine.cooldownExercises.length > 0 ? `
          <div style="margin-top: 12px; padding: 10px 12px; border-radius: 12px; background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px;">🧘 Defaticamento / Stretching</div>
            ${routine.cooldownExercises.map(c => `
              <div style="display: flex; justify-content: space-between; font-size: 0.84rem; color: #e2e8f0; margin-bottom: 3px;">
                <span>${c.name}</span>
                <span style="color: var(--text-secondary)">${c.duration || ''}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
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
  `;

  document.getElementById('back-to-list').addEventListener('click', () => renderRoutines());
  const exportBtn = document.getElementById('export-preview-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportRoutineToImage(routine));
  }
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
  const processedData = data.map(ex => {
    const muscle = getMuscleGroup(ex.name);
    const inDb = EXERCISE_DB[muscle] && EXERCISE_DB[muscle].includes(ex.name);
    return {
      ...ex,
      _muscle: muscle,
      _manual: !inDb,
      autoProgression: true,
      progPositive: 'weight_2.5',
      progNegative: 'decrease_10pct'
    };
  });
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
                <div style="font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                  <span>${ex.name}</span>
                  <button type="button" class="btn-ex-info" data-exercise="${ex.name.replace(/"/g, '&quot;')}" title="Guida esercizio ed esecuzione">ⓘ</button>
                </div>
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

const getHistorical1RM = (exerciseName) => {
  const logsList = storage.getLogs() || [];
  let max1RM = 0;
  logsList.forEach(log => {
    if (log.exercises && Array.isArray(log.exercises)) {
      log.exercises.forEach(ex => {
        if (ex.name && ex.name.trim().toLowerCase() === exerciseName.trim().toLowerCase() && ex.sets) {
          ex.sets.forEach(s => {
            if (s.tag === 'warmup') return;
            const w = parseFloat(s.weight) || 0;
            const r = parseInt(s.reps) || 0;
            if (w > 0 && r > 0) {
              const epley = r === 1 ? w : Math.round(w * (1 + r / 30) * 10) / 10;
              if (epley > max1RM) max1RM = epley;
            }
          });
        }
      });
    }
  });
  return max1RM;
};

const showPRCelebrationModal = (exerciseName, new1RM, old1RM, weight, reps) => {
  const diff = Math.round((new1RM - old1RM) * 10) / 10;
  const overlay = document.createElement('div');
  overlay.className = 'pr-celebration-overlay';
  const performanceStr = weight && reps ? `<div style="font-size: 0.9rem; color: #ddd; margin-bottom: 8px;">Hai sollevato: <strong style="color: #fff">${weight}kg × ${reps} reps</strong></div>` : '';
  
  overlay.innerHTML = `
    <div class="pr-celebration-box">
      <div class="pr-trophy-icon">🏆</div>
      <div class="pr-title">Nuovo Record (1RM)!</div>
      <div class="pr-exercise-name">${exerciseName}</div>
      <div class="pr-stats-box">
        ${performanceStr}
        <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Massimale Teorico Stimato</div>
        <div class="pr-value">${new1RM} <span style="font-size: 1.2rem; color: #fff;">kg</span></div>
        <div class="pr-diff">+${diff} kg dal precedente PR (${old1RM} kg)!</div>
      </div>
      <button class="btn" id="close-pr-modal" style="background: linear-gradient(90deg, #ffd700, #ffaa00); color: #000; font-weight: 800; font-size: 1rem; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
        CONTINUA A SPINGERE 💪
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#close-pr-modal').addEventListener('click', () => {
    overlay.style.animation = 'slideDown 0.3s ease-in forwards';
    setTimeout(() => overlay.remove(), 300);
  });
};

const renderWorkoutSession = (routineId, isResume = false) => {
    const routine = routines.find(r => r.id == routineId);
    if (!routine) return;
    
    window.sessionPRs = {};
    
    // Avvia il keep-alive audio subito (siamo nel click handler → gesto utente valido)
    unlockAudio();
    startAudioKeepAlive();

    let sessionExercises = JSON.parse(JSON.stringify(routine.exercises)); // Deep copy
    if (isResume && pausedWorkout && pausedWorkout.type === 'standard' && pausedWorkout.routineId == routineId) {
      workoutStartTime = Date.now() - (pausedWorkout.elapsedSeconds * 1000);
    } else {
      workoutStartTime = Date.now();
      pausedWorkout = null;
      storage.savePausedWorkout(null);
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
    const warmupList = routine.includeWarmup && Array.isArray(routine.warmupExercises) ? routine.warmupExercises : [];
    const cooldownList = routine.includeCooldown && Array.isArray(routine.cooldownExercises) ? routine.cooldownExercises : [];
    const savedWarmupDone = (pausedWorkout && Array.isArray(pausedWorkout.warmupDone)) ? pausedWorkout.warmupDone : [];
    const savedCooldownDone = (pausedWorkout && Array.isArray(pausedWorkout.cooldownDone)) ? pausedWorkout.cooldownDone : [];

    // Calcola gruppi Superset consecutivi
    const supersetGroupOf = [];
    let curGroup = 0;
    for (let i = 0; i < sessionExercises.length; i++) {
      const prevLinked = i > 0 && Boolean(sessionExercises[i - 1]?.supersetWithNext);
      const nextLinked = i < sessionExercises.length - 1 && Boolean(sessionExercises[i]?.supersetWithNext);
      if (prevLinked) {
        supersetGroupOf[i] = supersetGroupOf[i - 1];
      } else if (nextLinked) {
        curGroup++;
        supersetGroupOf[i] = curGroup;
      } else {
        supersetGroupOf[i] = 0;
      }
    }

    app.innerHTML = `
      <div class="view">
        <header style="position: static; background: transparent; padding: 0 16px 20px; display: flex; justify-content: space-between; align-items: center">
          <button id="back-to-routines" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer">← Annulla</button>
          <div style="text-align: center">
            <h2 style="font-size: 1.1rem; margin: 0">${routine.name}</h2>
            <div id="workout-timer-display" style="font-size: 0.8rem; color: var(--accent-color); font-weight: 700; margin-top: 2px">00:00</div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button id="session-plate-calc" type="button" title="Calcolatore Dischi" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: var(--accent-color); border-radius: 8px; padding: 4px 7px; font-size: 0.9rem; cursor: pointer;">🏋️</button>
            <div id="rest-trigger" style="color: var(--text-secondary); font-size: 1.2rem; cursor: pointer">⏱️</div>
          </div>
        </header>

        ${warmupList.length > 0 ? `
          <div class="card" id="session-warmup-card" style="border-left: 3px solid #fb923c; margin-bottom: 12px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #fb923c; text-transform: uppercase; margin-bottom: 8px;">🔥 Riscaldamento</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${warmupList.map((w, wi) => `
                <label style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.86rem; color: #e2e8f0; cursor: pointer; padding: 6px 8px; border-radius: 8px; background: rgba(255,255,255,0.03);">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="warmup-check" data-idx="${wi}" ${savedWarmupDone.includes(w.name) ? 'checked' : ''} style="width: 17px; height: 17px; margin: 0; accent-color: #fb923c;">
                    <span>${w.name}</span>
                  </span>
                  <span style="color: var(--text-secondary); font-size: 0.78rem;">${w.duration || ''}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div id="active-exercises-list">
          ${sessionExercises.map((ex, idx) => {
            const muscles = getExerciseMuscles(ex);
            const muscle = muscles[0] || getMuscleGroup(ex.name);
            const icon = getMuscleIcon(muscle);
            const tutStr = formatTut(ex.tut);
            const hasPositiveFeedback = ex.hadPositiveFeedback === true;
            const isAutoEnabled = ex.autoProgression !== undefined ? ex.autoProgression : (user.progressionEnabled !== false);
            const savedEx = (pausedWorkout && pausedWorkout.savedExercises && pausedWorkout.savedExercises[idx]) ? pausedWorkout.savedExercises[idx] : null;
            const currentFeedback = savedEx?.feedback || (isResume && pausedWorkout ? 'neutral' : (ex.feedback || 'neutral'));
            const ssGroup = supersetGroupOf[idx];
            const isSupersetStart = ssGroup > 0 && (idx === 0 || supersetGroupOf[idx - 1] !== ssGroup);

            return `
              <div class="card draggable-item ${hasPositiveFeedback ? 'easy-load-card' : ''} ${ssGroup > 0 ? 'superset-card-linked' : ''}" data-idx="${idx}" data-feedback="${currentFeedback}" data-ss-group="${ssGroup}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
                  <div class="card-title" style="color: var(--accent-color); display: flex; align-items: center; gap: 10px; margin: 0; width: 100%">
                    <span class="ex-icon" style="background: var(--accent-glow); width: 32px; height: 32px; font-size: 1rem">${icon}</span>
                    <span style="flex: 1; display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span>${ex.name}</span>
                      <button type="button" class="btn-ex-info" data-exercise="${ex.name.replace(/"/g, '&quot;')}" title="Guida esercizio ed esecuzione">ⓘ</button>
                      <button type="button" class="btn-replace-ex" data-ex-idx="${idx}" title="Sostituisci esercizio" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); color:#cbd5e1; border-radius:6px; padding:1px 6px; font-size:0.72rem; cursor:pointer;">🔄</button>
                    </span>
                    ${hasPositiveFeedback ? `<span class="easy-load-badge">⚡ Carico Facile (Aumenta!)</span>` : ''}
                  </div>
                  <div class="drag-handle">⠿</div>
                </div>
                
                <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">
                  <span class="card-subtitle">${ex.sets} serie × ${Array.isArray(ex.reps) ? ex.reps.join('-') : ex.reps}</span>
                  ${ssGroup > 0 ? `<span class="superset-badge">🔗 Superset ${ssGroup}</span>` : ''}
                  ${isSupersetStart ? `<button type="button" class="mark-superset-round-btn" data-ss-group="${ssGroup}" style="background:rgba(56,189,248,0.16); border:1px solid rgba(56,189,248,0.4); color:#38bdf8; border-radius:999px; padding:2px 8px; font-size:0.66rem; font-weight:800; cursor:pointer;">✓ Segna Round</button>` : ''}
                  ${tutStr ? `<span class="tut-badge">TUT ${tutStr}</span>` : ''}
                  ${muscles.length > 1 ? muscles.map(m => `<span class="muscle-tag-mini">${m}</span>`).join('') : ''}
                </div>
                
                <div style="margin-top: 5px; margin-bottom: 10px;">
                  <textarea class="session-notes-input" style="width: 100%; font-size: 0.8rem; padding: 6px; border: 1px dashed rgba(255,255,255,0.15); background: rgba(0,0,0,0.2); color: var(--text-secondary); border-radius: 6px; resize: vertical; box-sizing: border-box;" placeholder="Appunti per l'esercizio...">${(savedEx && savedEx.notes !== undefined) ? savedEx.notes : (ex.notes || '')}</textarea>
                </div>

                <div style="margin-top: 15px">
                  <div style="display: grid; grid-template-columns: 38px 1fr 1fr 0.8fr 38px; gap: 6px; text-align: center; color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 5px">
                    <div title="Tocca per cambiare tag (W/D/F)">TAG</div>
                    <div>KG</div>
                    <div>REPS</div>
                    <div>TUT</div>
                    <div></div>
                  </div>
                  ${Array.from({ length: ex.sets }).map((_, i) => {
                    const savedSet = (savedEx && savedEx.sets && savedEx.sets[i]) ? savedEx.sets[i] : null;
                    const isCompleted = savedSet ? savedSet.completed : false;
                    const prevSavedSet = (savedEx && savedEx.sets && savedEx.sets[i - 1]) ? savedEx.sets[i - 1] : null;
                    const fallbackW = prevSavedSet ? prevSavedSet.weight : (Array.isArray(ex.weight) ? (ex.weight[i] || ex.weight[ex.weight.length - 1] || 0) : ex.weight);
                    const fallbackR = prevSavedSet ? prevSavedSet.reps : (Array.isArray(ex.reps) ? (ex.reps[i] || ex.reps[ex.reps.length - 1] || '10') : ex.reps);
                    const fallbackT = prevSavedSet && prevSavedSet.tut !== undefined ? prevSavedSet.tut : (ex.tut || '');
                    const w = savedSet ? savedSet.weight : fallbackW;
                    const r = savedSet ? savedSet.reps : fallbackR;
                    const t = savedSet && savedSet.tut !== undefined ? savedSet.tut : fallbackT;
                    const tag = (savedSet && savedSet.tag) ? savedSet.tag : 'normal';
                    const tagMeta = SET_TAG_META[tag] || SET_TAG_META.normal;
                    const dropW = savedSet && savedSet.dropWeight !== undefined ? savedSet.dropWeight : '';
                    const dropR = savedSet && savedSet.dropReps !== undefined ? savedSet.dropReps : '';
                    return `
                    <div class="set-row" data-ex-idx="${idx}" data-set-idx="${i}" data-tag="${tag}" style="margin-bottom: 8px; transition: opacity 0.3s; opacity: ${isCompleted ? '0.5' : '1'}">
                      <div style="display: grid; grid-template-columns: 38px 1fr 1fr 0.8fr 38px; gap: 6px;">
                        <button type="button" class="set-tag-btn" title="Tocca per cambiare tipo serie (Normale / W / D / F)" style="background: ${tagMeta.color}; color: ${tagMeta.textColor}; border: 1px solid ${tagMeta.border};">${tagMeta.short || (i + 1)}</button>
                        <input type="number" value="${w}" style="margin: 0; padding: 10px 6px; text-align: center; transition: background 0.3s; ${hasPositiveFeedback ? 'border-color: var(--success); background: rgba(0, 255, 136, 0.06); color: #fff; box-shadow: 0 0 6px rgba(0, 255, 136, 0.15);' : ''}" class="log-weight">
                        <input type="text" value="${r}" style="margin: 0; padding: 10px 6px; text-align: center; transition: background 0.3s" class="log-reps">
                        <input type="text" value="${t}" placeholder="sec" style="margin: 0; padding: 10px 4px; text-align: center; font-size: 0.82rem; transition: background 0.3s" class="log-tut">
                        <button class="check-set-btn" style="background: ${isCompleted ? 'var(--accent-color)' : 'transparent'}; border: 2px solid var(--accent-color); border-radius: 8px; color: ${isCompleted ? '#000' : 'var(--accent-color)'}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                        </button>
                      </div>
                      <div class="drop-set-extra" style="display: ${tag === 'dropset' ? 'grid' : 'none'}; grid-template-columns: auto 1fr auto 1fr; gap: 6px; align-items: center; margin-top: 5px; padding: 6px 8px; border-radius: 8px; background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.35);">
                        <span style="font-size: 0.72rem; font-weight: 800; color: #fbbf24;">↳ Drop:</span>
                        <input type="number" class="log-drop-weight" placeholder="kg" value="${dropW}" style="margin: 0; padding: 5px; text-align: center; font-size: 0.8rem;">
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">×</span>
                        <input type="text" class="log-drop-reps" placeholder="reps" value="${dropR}" style="margin: 0; padding: 5px; text-align: center; font-size: 0.8rem;">
                      </div>
                    </div>
                  `;
                  }).join('')}
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <button class="remove-set-btn" data-ex-idx="${idx}" style="background: rgba(255,0,0,0.1); border: 1px solid var(--danger); padding: 4px 8px; border-radius: 6px; color: var(--danger); cursor: pointer; font-size: 0.7rem;">- Rimuovi Serie</button>
                  <button class="add-set-btn" data-ex-idx="${idx}" style="background: rgba(0,255,136,0.1); border: 1px solid var(--success); padding: 4px 8px; border-radius: 6px; color: var(--success); cursor: pointer; font-size: 0.7rem;">+ Aggiungi Serie</button>
                </div>

                <div class="exercise-feedback" style="display: ${isAutoEnabled ? 'block' : 'none'}; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center">
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px">Valutazione & Smart Rest (+45s al 👎):</div>
                  <div style="display: flex; gap: 10px">
                    <button class="feedback-btn pos" style="flex: 1; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid var(--success); border-radius: 8px; color: var(--success); font-weight: 700; cursor: pointer; opacity: ${currentFeedback === 'positive' ? '1' : (currentFeedback === 'negative' ? '0.4' : '1')}">👍 Bene (Carico Facile)</button>
                    <button class="feedback-btn neg" style="flex: 1; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid var(--danger); border-radius: 8px; color: var(--danger); font-weight: 700; cursor: pointer; opacity: ${currentFeedback === 'negative' ? '1' : (currentFeedback === 'positive' ? '0.4' : '1')}">👎 Fatica (+45s Rest)</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${cooldownList.length > 0 ? `
          <div class="card" id="session-cooldown-card" style="border-left: 3px solid #38bdf8; margin-top: 12px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">🧘 Defaticamento / Stretching</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${cooldownList.map((c, ci) => `
                <label style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.86rem; color: #e2e8f0; cursor: pointer; padding: 6px 8px; border-radius: 8px; background: rgba(255,255,255,0.03);">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="cooldown-check" data-idx="${ci}" ${savedCooldownDone.includes(c.name) ? 'checked' : ''} style="width: 17px; height: 17px; margin: 0; accent-color: #38bdf8;">
                    <span>${c.name}</span>
                  </span>
                  <span style="color: var(--text-secondary); font-size: 0.78rem;">${c.duration || ''}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

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
            tut: row.querySelector('.log-tut')?.value || '',
            tag: row.dataset.tag || 'normal',
            dropWeight: row.querySelector('.log-drop-weight')?.value || '',
            dropReps: row.querySelector('.log-drop-reps')?.value || '',
            completed: row.style.opacity === '0.5'
          });
        });
        const notes = card.querySelector('.session-notes-input')?.value || '';
        const feedback = card.getAttribute('data-feedback') || 'neutral';
        savedExercises.push({ sets, notes, feedback });
      });
      const warmupDone = Array.from(document.querySelectorAll('.warmup-check:checked')).map(c => warmupList[parseInt(c.dataset.idx, 10)]?.name).filter(Boolean);
      const cooldownDone = Array.from(document.querySelectorAll('.cooldown-check:checked')).map(c => cooldownList[parseInt(c.dataset.idx, 10)]?.name).filter(Boolean);
      const elapsedSeconds = Math.floor((Date.now() - workoutStartTime) / 1000);
      pausedWorkout = { type: 'standard', routineId, elapsedSeconds, savedExercises, warmupDone, cooldownDone };
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

    document.getElementById('session-plate-calc')?.addEventListener('click', () => {
      const firstWeightInput = document.querySelector('#active-exercises-list .log-weight');
      const initW = firstWeightInput ? (parseFloat(firstWeightInput.value) || 60) : 60;
      openPlateCalculatorModal(initW, user.unit === 'lbs' ? 'lbs' : 'kg');
    });

    // Tag sulle serie (Normale -> Riscaldamento W -> Drop Set D -> Cedimento F)
    document.querySelectorAll('.set-tag-btn').forEach(tagBtn => {
      tagBtn.addEventListener('click', () => {
        const row = tagBtn.closest('.set-row');
        if (!row) return;
        const setNum = (parseInt(row.dataset.setIdx, 10) || 0) + 1;
        const curTag = row.dataset.tag || 'normal';
        const nextTag = SET_TAG_ORDER[(SET_TAG_ORDER.indexOf(curTag) + 1) % SET_TAG_ORDER.length];
        row.dataset.tag = nextTag;
        const meta = SET_TAG_META[nextTag] || SET_TAG_META.normal;
        tagBtn.style.background = meta.color;
        tagBtn.style.color = meta.textColor;
        tagBtn.style.borderColor = meta.border;
        tagBtn.textContent = meta.short || String(setNum);
        const dropBox = row.querySelector('.drop-set-extra');
        if (dropBox) dropBox.style.display = nextTag === 'dropset' ? 'grid' : 'none';
      });
    });

    // Sostituzione Esercizio al volo
    document.querySelectorAll('.btn-replace-ex').forEach(repBtn => {
      repBtn.addEventListener('click', () => {
        const exIdx = parseInt(repBtn.dataset.exIdx, 10);
        const currentEx = sessionExercises[exIdx];
        if (!currentEx) return;
        openReplaceExerciseModal(currentEx, EXERCISE_DB, getMuscleGroup, getExerciseImages, (newName, newMuscle, isPermanent) => {
          activeWorkoutHandler.pause();
          isResume = true;
          sessionExercises[exIdx].name = newName;
          sessionExercises[exIdx]._muscle = newMuscle;
          sessionExercises[exIdx].muscles = [newMuscle];
          if (isPermanent) {
            const orig = routines.find(r => r.id == routineId);
            if (orig && orig.exercises[exIdx]) {
              orig.exercises[exIdx].name = newName;
              orig.exercises[exIdx]._muscle = newMuscle;
              orig.exercises[exIdx].muscles = [newMuscle];
              storage.saveRoutines(routines);
            }
          }
          renderActiveSession();
        });
      });
    });

    // Bottone "Segna Round" per Superset
    document.querySelectorAll('.mark-superset-round-btn').forEach(ssBtn => {
      ssBtn.addEventListener('click', () => {
        unlockAudio();
        const ssGroup = ssBtn.dataset.ssGroup;
        const groupCards = Array.from(document.querySelectorAll(`#active-exercises-list .card[data-ss-group="${ssGroup}"]`));
        let lastRest = 60;
        let lastIsNeg = false;
        let markedAny = false;
        groupCards.forEach(card => {
          const exIdx = parseInt(card.dataset.idx, 10);
          const nextRow = Array.from(card.querySelectorAll('.set-row')).find(r => r.style.opacity !== '0.5');
          if (nextRow) {
            nextRow.style.opacity = '0.5';
            const cBtn = nextRow.querySelector('.check-set-btn');
            if (cBtn) {
              cBtn.style.background = 'var(--accent-color)';
              cBtn.style.color = '#000';
            }
            markedAny = true;
          }
          lastRest = sessionExercises[exIdx]?.rest || 60;
          lastIsNeg = card.getAttribute('data-feedback') === 'negative';
        });
        if (markedAny) {
          showRestTimer(lastIsNeg ? lastRest + 45 : lastRest, lastIsNeg);
        }
      });
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
          
          const exIdx = parseInt(row.getAttribute('data-ex-idx'), 10);
          const card = row.closest('.card');
          const isNeg = card && card.getAttribute('data-feedback') === 'negative';
          const restSeconds = sessionExercises[exIdx].rest || 60;
          const setTag = row.dataset.tag || 'normal';
          const isWarmupSet = setTag === 'warmup';
          
          // Verifica e celebrazione PR 1RM (escludendo le serie di riscaldamento)
          const exName = sessionExercises[exIdx]?.name || '';
          const w = parseFloat(row.querySelector('.log-weight').value) || 0;
          const r = parseInt(row.querySelector('.log-reps').value) || 0;
          if (!isWarmupSet && w > 0 && r > 0 && exName) {
            const current1RM = r === 1 ? w : Math.round(w * (1 + r / 30) * 10) / 10;
            const historicalBest = getHistorical1RM(exName);
            const sessionBest = window.sessionPRs?.[exName] || 0;
            const targetToBeat = Math.max(historicalBest, sessionBest);
            
            if (historicalBest > 0 && current1RM > targetToBeat) {
              if (!window.sessionPRs) window.sessionPRs = {};
              window.sessionPRs[exName] = current1RM;
              showPRCelebrationModal(exName, current1RM, historicalBest, w, r);
              playPRCelebrationSound();
              
              // Badge inline alla serie
              let setNumCell = row.querySelector('.set-tag-btn');
              if (setNumCell && !setNumCell.querySelector('.pr-badge-inline')) {
                setNumCell.innerHTML += `<span class="pr-badge-inline" style="margin-left:2px; font-size:0.65rem;">🏆</span>`;
              }
            } else if (targetToBeat === 0 && current1RM > 0 && !window.sessionPRs?.[exName]) {
              if (!window.sessionPRs) window.sessionPRs = {};
              window.sessionPRs[exName] = current1RM;
            }
          }

          // Superset: se l'esercizio è collegato al successivo, avvisa di passare al successivo invece di far partire il recupero
          if (sessionExercises[exIdx]?.supersetWithNext && !isWarmupSet) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:84px; left:50%; transform:translateX(-50%); z-index:99998; background:#0f172a; border:1px solid #38bdf8; color:#38bdf8; padding:8px 14px; border-radius:999px; font-size:0.8rem; font-weight:700; box-shadow:0 6px 20px rgba(0,0,0,0.6);';
            toast.textContent = '🔗 Superset: passa al prossimo esercizio!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2200);
          } else {
            showRestTimer(isNeg ? restSeconds + 45 : restSeconds, isNeg);
          }
        } else {
          row.style.opacity = '1';
          btn.style.background = 'transparent';
          btn.style.color = 'var(--accent-color)';
        }
      });
    });

    document.querySelectorAll('.feedback-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        card.querySelectorAll('.feedback-btn').forEach(b => b.style.opacity = '0.4');
        btn.style.opacity = '1';
        const isNeg = btn.classList.contains('neg');
        card.setAttribute('data-feedback', isNeg ? 'negative' : 'positive');
        if (isNeg) {
          triggerSmartRestAlert();
        }
      });
    });

    document.querySelectorAll('.add-set-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-ex-idx');
        activeWorkoutHandler.pause();
        isResume = true;
        sessionExercises[idx].sets++;
        renderActiveSession();
      });
    });

    document.querySelectorAll('.remove-set-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-ex-idx');
        if (sessionExercises[idx].sets > 1) {
          activeWorkoutHandler.pause();
          isResume = true;
          sessionExercises[idx].sets--;
          if (pausedWorkout && pausedWorkout.savedExercises[idx] && pausedWorkout.savedExercises[idx].sets) {
            pausedWorkout.savedExercises[idx].sets.pop();
          }
          renderActiveSession();
        }
      });
    });

    document.getElementById('finish-workout').addEventListener('click', () => {
      stopAudioKeepAlive(); // Ferma il keep-alive quando il workout finisce
      const exerciseData = [];
      
      document.querySelectorAll('#active-exercises-list .card').forEach((card) => {
        const exIdx = parseInt(card.getAttribute('data-idx'));
        const sessionExRef = sessionExercises[exIdx];
        const name = sessionExRef?.name || card.querySelector('.card-title')?.innerText.replace(/[^\x00-\x7F]/g, "").trim(); 
        if (!name) return;

        const sets = [];
        card.querySelectorAll('.set-row').forEach((row) => {
          if (row.style.opacity === '0.5') {
            const setTag = row.dataset.tag || 'normal';
            const setObj = {
              weight: parseFloat(row.querySelector('.log-weight').value) || 0,
              reps: row.querySelector('.log-reps').value || '0'
            };
            if (setTag !== 'normal') setObj.tag = setTag;
            if (setTag === 'dropset') {
              const dw = parseFloat(row.querySelector('.log-drop-weight')?.value);
              const dr = row.querySelector('.log-drop-reps')?.value?.trim();
              if (!isNaN(dw) && dw > 0) setObj.dropWeight = dw;
              if (dr) setObj.dropReps = dr;
            }
            const tutVal = row.querySelector('.log-tut')?.value?.trim() || '';
            if (tutVal) setObj.tut = tutVal;
            sets.push(setObj);
          }
        });

        const notes = card.querySelector('.session-notes-input')?.value || '';
        const muscles = getExerciseMuscles(sessionExRef || { name });
        const ssGroupNum = parseInt(card.getAttribute('data-ss-group'), 10) || 0;

        if (sets.length > 0) {
          const exEntry = {
            name,
            exIdx,
            muscles,
            sets,
            notes,
            feedback: card.getAttribute('data-feedback') || 'neutral'
          };
          if (ssGroupNum > 0) exEntry.supersetGroup = ssGroupNum;
          exerciseData.push(exEntry);
        }
      });

      if (exerciseData.length === 0) return alert('Non hai completato alcun esercizio!');

      clearInterval(workoutTimerInterval);
      activeTimerSyncFn = null;
      const totalTime = document.getElementById('workout-timer-display').innerText;
      const warmupDone = Array.from(document.querySelectorAll('.warmup-check:checked')).map(c => warmupList[parseInt(c.dataset.idx, 10)]?.name).filter(Boolean);
      const cooldownDone = Array.from(document.querySelectorAll('.cooldown-check:checked')).map(c => cooldownList[parseInt(c.dataset.idx, 10)]?.name).filter(Boolean);

      const newLogEntry = {
        routineName: routine.name,
        date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        timestamp: Date.now(),
        duration: totalTime,
        type: 'standard',
        exercises: exerciseData
      };
      if (warmupDone.length > 0) newLogEntry.warmupDone = warmupDone;
      if (cooldownDone.length > 0) newLogEntry.cooldownDone = cooldownDone;

      storage.saveLog(newLogEntry);

      // --- PERSISTENZA E PROGRESSIONE CARICHI ---
      const originalRoutine = routines.find(r => r.id == routineId);
      
      if (originalRoutine) {
        // Reset di tutti i feedback positivi della sessione precedente ("Usa e Getta": il verde vale solo la volta successiva)
        originalRoutine.exercises.forEach(ex => { ex.hadPositiveFeedback = false; });

        exerciseData.forEach(sessionEx => {
          const routineEx = originalRoutine.exercises.find(re => re.name === sessionEx.name);
          if (routineEx) {
            const isPositive = sessionEx.feedback === 'positive';
            const isNegative = sessionEx.feedback === 'negative';
            
            // Salva le note e il TUT aggiornati
            routineEx.notes = sessionEx.notes;
            const latestTut = sessionEx.sets.find(s => s.tut)?.tut;
            if (latestTut !== undefined) routineEx.tut = latestTut;
            
            // Salva il feedback per l'evidenziazione la volta successiva solo se valutato positivamente OGGI
            routineEx.hadPositiveFeedback = isPositive;

            // Memorizza le serie aggiornate/aggiunte durante l'allenamento
            const sessionExObj = (sessionEx.exIdx !== undefined && sessionExercises[sessionEx.exIdx])
              ? sessionExercises[sessionEx.exIdx]
              : sessionExercises.find(se => se.name === routineEx.name);
            const plannedSets = sessionExObj ? sessionExObj.sets : sessionEx.sets.length;
            const updatedSets = Math.max(plannedSets, sessionEx.sets.length);
            if (updatedSets > 0) {
              routineEx.sets = updatedSets;
            }

            const workingSets = sessionEx.sets.filter(s => s.tag !== 'warmup');
            const progSets = workingSets.length > 0 ? workingSets : sessionEx.sets;
            const sessionWeights = progSets.map(s => parseFloat(s.weight) || 0);
            const sessionReps = progSets.map(s => s.reps);

            // Logica Auto Progression
            const isAutoEnabled = routineEx.autoProgression !== undefined ? routineEx.autoProgression : (user.progressionEnabled !== false);

            if (!isAutoEnabled) {
              if (Array.isArray(routineEx.weight)) {
                const weights = [...sessionWeights];
                while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                routineEx.weight = weights.slice(0, routineEx.sets);
              } else {
                routineEx.weight = Math.max(...sessionWeights);
              }
              if (Array.isArray(routineEx.reps)) {
                const reps = [...sessionReps];
                while (reps.length < routineEx.sets) reps.push(reps[reps.length - 1] || '10');
                routineEx.reps = reps.slice(0, routineEx.sets);
              } else {
                routineEx.reps = sessionReps[0] || '10';
              }
              return;
            }

            if (isPositive) {
              let posAction = routineEx.progPositive;
              if (!posAction) {
                const muscle = getMuscleGroup(routineEx.name);
                posAction = ['Spalle', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'].includes(muscle) ? 'weight_0.5' : 'weight_2.5';
              }
              
              let weightIncr = 0;
              let repsIncr = 0;
              
              if (posAction.startsWith('weight_')) weightIncr = parseFloat(posAction.split('_')[1]);
              else if (posAction.startsWith('reps_')) repsIncr = parseInt(posAction.split('_')[1]);
              
              if (weightIncr > 0) {
                if (Array.isArray(routineEx.weight)) {
                  const weights = [...sessionWeights];
                  while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                  routineEx.weight = weights.slice(0, routineEx.sets).map(w => w + weightIncr);
                } else {
                  routineEx.weight = Math.max(...sessionWeights) + weightIncr;
                }
                if (Array.isArray(routineEx.reps)) {
                  const reps = [...sessionReps];
                  while (reps.length < routineEx.sets) reps.push(reps[reps.length - 1] || '10');
                  routineEx.reps = reps.slice(0, routineEx.sets);
                } else {
                  routineEx.reps = sessionReps[0] || '10';
                }
              } else if (repsIncr > 0) {
                if (Array.isArray(routineEx.weight)) {
                  const weights = [...sessionWeights];
                  while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                  routineEx.weight = weights.slice(0, routineEx.sets);
                } else {
                  routineEx.weight = Math.max(...sessionWeights);
                }
                if (Array.isArray(routineEx.reps)) {
                  const reps = [...sessionReps];
                  while (reps.length < routineEx.sets) reps.push(reps[reps.length - 1] || '10');
                  routineEx.reps = reps.slice(0, routineEx.sets).map(r => String(Math.min(20, (parseInt(r) || 0) + repsIncr)));
                } else {
                  routineEx.reps = String(Math.min(20, (parseInt(sessionReps[0]) || 0) + repsIncr));
                }
              }
            } else if (isNegative) {
              const negAction = routineEx.progNegative || 'decrease_10pct';
              if (negAction === 'maintain') {
                if (Array.isArray(routineEx.weight)) {
                  const weights = [...sessionWeights];
                  while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                  routineEx.weight = weights.slice(0, routineEx.sets);
                } else {
                  routineEx.weight = Math.max(...sessionWeights);
                }
              } else if (negAction === 'decrease_10pct') {
                if (Array.isArray(routineEx.weight)) {
                  const weights = [...sessionWeights];
                  while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                  routineEx.weight = weights.slice(0, routineEx.sets).map(w => Math.round(w * 0.9 * 2) / 2);
                } else {
                  routineEx.weight = Math.round(Math.max(...sessionWeights) * 0.9 * 2) / 2;
                }
              } else if (negAction.startsWith('decrease_')) {
                const dec = parseFloat(negAction.split('_')[1]);
                if (Array.isArray(routineEx.weight)) {
                  const weights = [...sessionWeights];
                  while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                  routineEx.weight = weights.slice(0, routineEx.sets).map(w => Math.max(0, w - dec));
                } else {
                  routineEx.weight = Math.max(0, Math.max(...sessionWeights) - dec);
                }
              }
              if (Array.isArray(routineEx.reps)) {
                const reps = [...sessionReps];
                while (reps.length < routineEx.sets) reps.push(reps[reps.length - 1] || '10');
                routineEx.reps = reps.slice(0, routineEx.sets);
              } else {
                routineEx.reps = sessionReps[0] || '10';
              }
            } else {
              if (Array.isArray(routineEx.weight)) {
                const weights = [...sessionWeights];
                while (weights.length < routineEx.sets) weights.push(weights[weights.length - 1] || 0);
                routineEx.weight = weights.slice(0, routineEx.sets);
              } else {
                routineEx.weight = Math.max(...sessionWeights);
              }
              if (Array.isArray(routineEx.reps)) {
                const reps = [...sessionReps];
                while (reps.length < routineEx.sets) reps.push(reps[reps.length - 1] || '10');
                routineEx.reps = reps.slice(0, routineEx.sets);
              } else {
                routineEx.reps = sessionReps[0] || '10';
              }
            }
            
            // Pulisci i vecchi campi non più necessari (opzionale)
            delete routineEx.consecutiveNegatives;
          }
        });
        storage.saveRoutines(routines);
      }
      // ----------------------------------------

      logs = storage.getLogs();
      pausedWorkout = null;
      storage.savePausedWorkout(null);
      activeWorkoutHandler = null;

      checkAndNotifyNewAwards(logs, routines, parseLogDate);
      alert('Allenamento salvato con successo! 🎉');
      switchView('dashboard');
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

      ${log.exercises.map(ex => {
        const muscles = Array.isArray(ex.muscles) && ex.muscles.length > 1 ? ex.muscles : [];
        const hasAnyTut = Array.isArray(ex.sets) && ex.sets.some(s => s.tut);
        return `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${muscles.length ? '6px' : '12px'}">
            <div class="card-title" style="font-size: 1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 0;">
              <span>${ex.name}</span>
              <button type="button" class="btn-ex-info" data-exercise="${ex.name.replace(/"/g, '&quot;')}" title="Guida esercizio ed esecuzione">ⓘ</button>
            </div>
            ${ex.feedback === 'positive' ? '<span style="color: var(--success); font-size: 1.2rem">👍</span>' : ''}
            ${ex.feedback === 'negative' ? '<span style="color: var(--danger); font-size: 1.2rem">👎</span>' : ''}
          </div>
          ${muscles.length ? `<div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">${muscles.map(m => `<span class="muscle-tag-mini">${m}</span>`).join('')}</div>` : ''}
          
          <div style="display: flex; flex-direction: column; gap: 8px">
            ${ex.sets.map((s, i) => {
              const tagMeta = s.tag && SET_TAG_META[s.tag] ? SET_TAG_META[s.tag] : SET_TAG_META.normal;
              const tagBadge = tagMeta.short ? ` <span style="font-size:0.7rem; padding:1px 5px; border-radius:5px; background:${tagMeta.color}; color:${tagMeta.textColor}; border:1px solid ${tagMeta.border}; margin-left:2px;">${tagMeta.short}</span>` : '';
              return `
              <div style="display: grid; grid-template-columns: 44px 1fr 1fr ${hasAnyTut ? '0.9fr' : ''}; gap: 8px; font-size: 0.9rem; color: var(--text-secondary); align-items: center;">
                <div style="color: var(--accent-color); font-weight: 800">${i + 1}${tagBadge}</div>
                <div>Peso: <strong>${s.weight} kg</strong>${s.dropWeight ? `<div style="font-size:0.74rem; color:#fbbf24;">↳ Drop: ${s.dropWeight}kg × ${s.dropReps || 0}</div>` : ''}</div>
                <div>Reps: <strong>${s.reps}</strong></div>
                ${hasAnyTut ? `<div>TUT: <strong>${s.tut ? formatTut(s.tut) : '—'}</strong></div>` : ''}
              </div>
            `;
            }).join('')}
          </div>
        </div>
      `; }).join('')}

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
                if (histEx.sets && histEx.sets.length > 0) {
                  routineEx.sets = histEx.sets.length;
                }
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
                if (Array.isArray(routineEx.reps)) {
                  const histReps = histEx.sets.map(s => String(s.reps || '10'));
                  const newReps = [];
                  for (let i = 0; i < routineEx.sets; i++) {
                    newReps.push(histReps[i] !== undefined ? histReps[i] : (histReps[histReps.length - 1] || '10'));
                  }
                  routineEx.reps = newReps;
                }
                updatedCount++;
              }
            });
            storage.saveRoutines(routines);
            alert(`Carichi e serie aggiornati con successo su "${log.routineName}" (${updatedCount} esercizi modificati)! 🎉`);
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
            <button id="open-plate-calc-prog" title="Calcolatore Dischi Bilanciere" style="background: rgba(255,255,255,0.05); border: none; color: var(--accent-color); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.95rem;">🏋️</button>
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

        <!-- Stato Recupero Muscoli -->
        <div class="card" id="muscle-recovery-card">
          <div class="card-title" style="margin-bottom: 5px">Stato Recupero Muscoli</div>
          <div class="card-subtitle">Tocca un muscolo per i dettagli del recupero.</div>
          
          <!-- Image + SVG overlay -->
          <div class="muscle-map-wrapper">
            <img class="muscle-base-img" src="${user.gender === 'female' ? import.meta.env.BASE_URL + 'muscle-map-female.png' : import.meta.env.BASE_URL + 'muscle-map.png'}" alt="Mappa muscolare" draggable="false" />
            <!-- 
              viewBox calibrata sull'immagine: 624x554 (sia Maschile che Femminile)
            -->
            <svg class="muscle-overlay-svg" viewBox="0 0 624 554" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              ${user.gender === 'female' ? `
                <!-- ===== FEMALE ANATOMY HOTSPOTS (624x554, calibrati su muscle-map-female.png) ===== -->
                <!-- SPALLE (Deltoids front) -->
                <path class="muscle-hotspot" data-muscle="Spalle" d="M96,100 C84,96 72,102 65,114 C61,124 63,134 69,138 C76,136 84,126 92,114 C96,108 98,103 96,100 Z" />
                <path class="muscle-hotspot" data-muscle="Spalle" d="M160,100 C172,96 184,102 191,114 C195,124 193,134 187,138 C180,136 172,126 164,114 C160,108 158,103 160,100 Z" />
                <!-- PETTO -->
                <path class="muscle-hotspot" data-muscle="Petto" d="M126,110 C114,102 96,102 88,114 C82,126 84,146 96,154 C108,160 120,156 126,148 Z" />
                <path class="muscle-hotspot" data-muscle="Petto" d="M130,110 C142,102 160,102 168,114 C174,126 172,146 160,154 C148,160 136,156 130,148 Z" />
                <!-- BICIPITI -->
                <path class="muscle-hotspot" data-muscle="Bicipiti" d="M82,134 C74,136 66,148 62,164 C60,176 62,186 68,188 C75,186 81,174 84,158 C86,146 85,137 82,134 Z" />
                <path class="muscle-hotspot" data-muscle="Bicipiti" d="M174,134 C182,136 190,148 194,164 C196,176 194,186 188,188 C181,186 175,174 172,158 C170,146 171,137 174,134 Z" />
                <!-- ADDOME (+ Obliqui) -->
                <path class="muscle-hotspot" data-muscle="Addome" d="M126,158 L108,160 C104,174 96,192 88,214 C92,226 100,232 108,232 C112,244 118,254 126,258 Z" />
                <path class="muscle-hotspot" data-muscle="Addome" d="M130,158 L148,160 C152,174 160,192 168,214 C164,226 156,232 148,232 C144,244 138,254 130,258 Z" />
                <!-- QUADRICIPITI -->
                <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M90,248 C100,250 110,268 116,296 C118,322 114,344 106,356 C94,358 84,342 78,314 C74,284 78,258 90,248 Z" />
                <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M166,248 C156,250 146,268 140,296 C138,322 142,344 150,356 C162,358 172,342 178,314 C182,284 178,258 166,248 Z" />
                <!-- TRAPEZI (back) -->
                <path class="muscle-hotspot" data-muscle="Trapezi" d="M488,60 C482,78 468,90 452,98 C468,108 478,136 496,170 C514,136 524,108 540,98 C524,90 510,78 504,60 Z" />
                <!-- SPALLE (rear) -->
                <path class="muscle-hotspot" data-muscle="Spalle" d="M454,100 C442,98 432,104 428,116 C426,124 430,132 438,134 C446,130 452,120 456,110 Z" />
                <path class="muscle-hotspot" data-muscle="Spalle" d="M538,100 C550,98 560,104 564,116 C566,124 562,132 554,134 C546,130 540,120 536,110 Z" />
                <!-- DORSALI (Upper Back / Lats) -->
                <path class="muscle-hotspot" data-muscle="Dorsali" d="M454,112 C450,132 454,164 468,202 C478,194 488,180 494,168 C484,142 472,118 454,112 Z" />
                <path class="muscle-hotspot" data-muscle="Dorsali" d="M538,112 C542,132 538,164 524,202 C514,194 504,180 498,168 C508,142 520,118 538,112 Z" />
                <!-- TRICIPITI -->
                <path class="muscle-hotspot" data-muscle="Tricipiti" d="M446,128 C436,134 426,148 424,168 C422,180 426,190 432,190 C440,186 446,172 448,154 C450,142 449,132 446,128 Z" />
                <path class="muscle-hotspot" data-muscle="Tricipiti" d="M546,128 C556,134 566,148 568,168 C570,180 566,190 560,190 C552,186 546,172 544,154 C542,142 543,132 546,128 Z" />
                <!-- LOMBARI (Lower Back) -->
                <path class="muscle-hotspot" data-muscle="Lombari" d="M496,176 C484,188 474,200 470,214 C480,224 488,232 496,236 C504,232 512,224 522,214 C518,200 508,188 496,176 Z" />
                <!-- GLUTEI -->
                <path class="muscle-hotspot" data-muscle="Glutei" d="M494,234 C484,224 464,224 452,240 C444,254 446,276 458,286 C472,286 488,278 494,268 Z" />
                <path class="muscle-hotspot" data-muscle="Glutei" d="M498,234 C508,224 528,224 540,240 C548,254 546,276 534,286 C520,286 504,278 498,268 Z" />
                <!-- FEMORALI (Hamstrings) -->
                <path class="muscle-hotspot" data-muscle="Femorali" d="M486,288 C472,288 456,294 450,308 C448,328 452,350 462,362 C474,362 484,348 486,328 Z" />
                <path class="muscle-hotspot" data-muscle="Femorali" d="M506,288 C520,288 536,294 542,308 C544,328 540,350 530,362 C518,362 508,348 506,328 Z" />
                <!-- POLPACCI (Calves) -->
                <path class="muscle-hotspot" data-muscle="Polpacci" d="M474,368 C462,366 450,376 446,396 C444,414 452,438 462,468 C470,456 476,432 478,408 C480,390 478,374 474,368 Z" />
                <path class="muscle-hotspot" data-muscle="Polpacci" d="M518,368 C530,366 542,376 546,396 C548,414 540,438 530,468 C522,456 516,432 514,408 C512,390 514,374 518,368 Z" />
              ` : `
                <!-- ===== MALE ANATOMY HOTSPOTS (624x554, calibrati su muscle-map.png) ===== -->
                <!-- SPALLE (Deltoids front) -->
                <path class="muscle-hotspot" data-muscle="Spalle" d="M100,92 C86,86 72,94 66,108 C62,120 65,130 72,134 C80,130 88,118 96,106 C100,100 102,95 100,92 Z" />
                <path class="muscle-hotspot" data-muscle="Spalle" d="M174,92 C188,86 202,94 208,108 C212,120 209,130 202,134 C194,130 186,118 178,106 C174,100 172,95 174,92 Z" />
                <!-- PETTO (Pectorals) -->
                <path class="muscle-hotspot" data-muscle="Petto" d="M135,102 C122,94 102,96 92,108 C86,120 90,138 104,144 C118,148 130,144 135,136 Z" />
                <path class="muscle-hotspot" data-muscle="Petto" d="M140,102 C153,94 173,96 183,108 C189,120 185,138 171,144 C157,148 145,144 140,136 Z" />
                <!-- BICIPITI -->
                <path class="muscle-hotspot" data-muscle="Bicipiti" d="M86,128 C76,130 68,144 65,160 C63,172 66,182 72,184 C80,180 86,166 88,150 C90,138 89,130 86,128 Z" />
                <path class="muscle-hotspot" data-muscle="Bicipiti" d="M188,128 C198,130 206,144 209,160 C211,172 208,182 202,184 C194,180 188,166 186,150 C184,138 185,130 188,128 Z" />
                <!-- ADDOME (+ Obliqui) -->
                <path class="muscle-hotspot" data-muscle="Addome" d="M135,146 L116,148 C110,168 102,184 96,204 C98,218 106,226 114,226 C120,238 128,248 135,252 Z" />
                <path class="muscle-hotspot" data-muscle="Addome" d="M140,146 L159,148 C165,168 173,184 179,204 C177,218 169,226 161,226 C155,238 147,248 140,252 Z" />
                <!-- QUADRICIPITI -->
                <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M100,242 C110,248 120,270 124,298 C126,322 122,344 114,352 C102,352 90,334 86,306 C82,276 88,252 100,242 Z" />
                <path class="muscle-hotspot" data-muscle="Quadricipiti" d="M174,242 C164,248 154,270 150,298 C148,322 152,344 160,352 C172,352 184,334 188,306 C192,276 186,252 174,242 Z" />
                <!-- TRAPEZI (back) -->
                <path class="muscle-hotspot" data-muscle="Trapezi" d="M489,52 C483,70 468,82 452,90 C468,100 480,130 497,164 C514,130 526,100 542,90 C526,82 511,70 505,52 Z" />
                <!-- SPALLE (rear) -->
                <path class="muscle-hotspot" data-muscle="Spalle" d="M454,92 C442,88 430,96 424,108 C422,118 426,126 434,128 C444,124 452,112 456,102 Z" />
                <path class="muscle-hotspot" data-muscle="Spalle" d="M540,92 C552,88 564,96 570,108 C572,118 568,126 560,128 C550,124 542,112 538,102 Z" />
                <!-- DORSALI (Upper Back / Lats) -->
                <path class="muscle-hotspot" data-muscle="Dorsali" d="M452,106 C446,128 452,164 468,204 C478,194 488,178 494,166 C484,138 470,114 452,106 Z" />
                <path class="muscle-hotspot" data-muscle="Dorsali" d="M542,106 C548,128 542,164 526,204 C516,194 506,178 500,166 C510,138 524,114 542,106 Z" />
                <!-- TRICIPITI -->
                <path class="muscle-hotspot" data-muscle="Tricipiti" d="M444,122 C434,128 424,142 420,162 C418,174 422,184 428,184 C436,180 444,166 446,148 C448,136 447,126 444,122 Z" />
                <path class="muscle-hotspot" data-muscle="Tricipiti" d="M550,122 C560,128 570,142 574,162 C576,174 572,184 566,184 C558,180 550,166 548,148 C546,136 547,126 550,122 Z" />
                <!-- LOMBARI (Lower Back) -->
                <path class="muscle-hotspot" data-muscle="Lombari" d="M497,172 C485,184 475,196 471,210 C481,220 489,228 497,232 C505,228 513,220 523,210 C519,196 509,184 497,172 Z" />
                <!-- GLUTEI -->
                <path class="muscle-hotspot" data-muscle="Glutei" d="M495,230 C485,222 466,222 456,238 C450,252 452,272 462,282 C474,280 488,274 495,264 Z" />
                <path class="muscle-hotspot" data-muscle="Glutei" d="M499,230 C509,222 528,222 538,238 C544,252 542,272 532,282 C520,280 506,274 499,264 Z" />
                <!-- FEMORALI (Hamstrings) -->
                <path class="muscle-hotspot" data-muscle="Femorali" d="M488,284 C474,284 458,290 452,306 C450,326 454,348 464,362 C476,360 486,346 488,324 Z" />
                <path class="muscle-hotspot" data-muscle="Femorali" d="M506,284 C520,284 536,290 542,306 C544,326 540,348 530,362 C518,360 508,346 506,324 Z" />
                <!-- POLPACCI (Calves) -->
                <path class="muscle-hotspot" data-muscle="Polpacci" d="M476,366 C464,364 452,374 448,394 C446,412 454,438 464,470 C472,456 478,432 480,406 C482,388 480,372 476,366 Z" />
                <path class="muscle-hotspot" data-muscle="Polpacci" d="M518,366 C530,364 542,374 546,394 C548,412 540,438 530,470 C522,456 516,432 514,406 C512,388 514,372 518,366 Z" />
              `}
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

        <!-- Calendario Annuale a Puntini / Mensile -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
            <div class="card-title" style="margin: 0">Calendario Allenamenti</div>
            <div class="segmented-control" id="calendar-view-switch">
              <button type="button" class="segmented-btn active" data-cal-view="annual">Anno</button>
              <button type="button" class="segmented-btn" data-cal-view="monthly">Mese</button>
            </div>
          </div>
          <div id="calendar-mount"></div>
        </div>

        <!-- Recap dell'Anno -->
        <div class="card recap-card" id="yearly-recap-card">
          <div id="yearly-recap-mount"></div>
        </div>

        <!-- Premi & Obiettivi (Awards) -->
        <div class="card" id="awards-card">
          <div id="awards-mount"></div>
        </div>

        <!-- Progressione Esercizio (Grafico Ridisegnato) -->
        <div class="card">
          <div class="chart-card-header">
            <div class="card-title" style="margin: 0">Progressione Esercizio</div>
            <div class="segmented-control" id="prog-metric-switch">
              <button type="button" class="segmented-btn active" data-metric="weight">Max</button>
              <button type="button" class="segmented-btn" data-metric="1rm">1RM</button>
              <button type="button" class="segmented-btn" data-metric="volume">Vol.</button>
            </div>
          </div>
          <select id="exercise-select" style="width: 100%; margin: 0 0 12px 0; padding: 10px 12px; font-size: 0.86rem; font-weight: 600; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;">
            <option value="">Seleziona Esercizio</option>
            ${getUniqueExercises().map(ex => `<option value="${ex.replace(/"/g, '&quot;')}">${ex}</option>`).join('')}
          </select>
          <div id="progress-chart-summary" class="chart-summary-strip" style="display: none;"></div>
          <div class="chart-wrapper">
            <canvas id="progressChart"></canvas>
          </div>
          <div id="no-data-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${getUniqueExercises().length > 0 ? 'display:none' : ''}">
            Registra un allenamento per vedere i dati qui.
          </div>
        </div>

        <!-- Volume Totale (Grafico Ridisegnato) -->
        <div class="card">
          <div class="chart-card-header">
            <div class="card-title" style="margin: 0">Volume Sollevato (${user.unit === 'lbs' ? 'lbs' : 'kg'})</div>
            <div class="segmented-control" id="vol-range-switch">
              <button type="button" class="segmented-btn active" data-range="10">10</button>
              <button type="button" class="segmented-btn" data-range="20">20</button>
              <button type="button" class="segmented-btn" data-range="year">Anno</button>
            </div>
          </div>
          <div id="volume-chart-summary" class="chart-summary-strip" style="display: none;"></div>
          <div class="chart-wrapper">
            <canvas id="volumeChart"></canvas>
          </div>
          <div id="no-volume-msg" class="card-subtitle" style="text-align: center; margin-top: 10px; ${logs.length > 0 ? 'display:none' : ''}">
            Nessun volume registrato.
          </div>
        </div>

      </div>
    `;

    const nowYear = new Date().getFullYear();
    let calendarMode = 'annual';
    let selectedYear = nowYear;
    let selectedProgressMetric = 'weight';
    let selectedVolumeRange = '10';

    const refreshCalendarAndRecap = () => {
      if (calendarMode === 'annual') {
        renderAnnualCalendar(selectedYear);
      } else {
        renderMonthlyCalendar();
      }
      renderYearlyRecap(selectedYear);
      if (selectedVolumeRange === 'year') {
        updateVolumeChart('year', selectedYear);
      }
    };

    refreshCalendarAndRecap();

    document.getElementById('open-plate-calc-prog')?.addEventListener('click', () => {
      openPlateCalculatorModal(60, user.unit === 'lbs' ? 'lbs' : 'kg');
    });

    const awardsMount = document.getElementById('awards-mount');
    if (awardsMount) {
      const awards = computeAwards(logs, routines, parseLogDate);
      const unlockedCount = awards.filter(a => a.unlocked).length;
      awardsMount.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="card-title" style="margin: 0">🏅 Premi & Obiettivi</div>
            <div class="card-subtitle">Traguardi sbloccati con i tuoi allenamenti</div>
          </div>
          <span class="badge">${unlockedCount} / ${awards.length}</span>
        </div>
        <div class="awards-grid">
          ${awards.map(a => `
            <div class="award-tile ${a.unlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
              <div style="font-size: 1.5rem; line-height: 1;">${a.icon}</div>
              <div style="font-size: 0.72rem; font-weight: 800; color: ${a.unlocked ? '#fff' : 'var(--text-secondary)'}; line-height: 1.15;">${a.title}</div>
              <div style="font-size: 0.64rem; color: ${a.unlocked ? 'var(--accent-color)' : 'var(--text-secondary)'};">${a.progress}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    document.querySelectorAll('#calendar-view-switch .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#calendar-view-switch .segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calendarMode = btn.getAttribute('data-cal-view');
        refreshCalendarAndRecap();
      });
    });

    // Applica classi di stato CSS ai muscoli della mappa corporea (image overlay)
    const recoveryStates = calculateMuscleRecovery();
    document.querySelectorAll('.muscle-hotspot').forEach(hotspot => {
      const muscle = hotspot.getAttribute('data-muscle');
      const state = recoveryStates[muscle];
      if (state) {
        hotspot.classList.add(`state-${state.status}`);
      }
    });

    // Aggiungi interattività click sugli hotspot muscoli
    document.querySelectorAll('.muscle-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', (e) => {
        const muscle = e.currentTarget.getAttribute('data-muscle');
        const state = recoveryStates[muscle];
        if (!state) return;
        
        // Evidenzia visivamente tutti gli hotspot associati a questo muscolo
        document.querySelectorAll('.muscle-hotspot').forEach(h => {
          h.classList.toggle('active', h.getAttribute('data-muscle') === muscle);
        });
        
        const detailPanel = document.getElementById('muscle-detail-panel');
        if (detailPanel) {
          const recoveryDurations = {
            "Petto": 48, "Dorsali": 48, "Trapezi": 36, "Lombari": 48,
            "Quadricipiti": 72, "Femorali": 72, "Glutei": 72, "Polpacci": 48,
            "Spalle": 48, "Bicipiti": 36, "Tricipiti": 36,
            "Addome": 24, "Altro": 24
          };
          
          let advice = "";
          if (state.percent >= 86) {
            advice = "Il muscolo è fresco e pronto per essere allenato ad alta intensità! 🦾";
          } else if (state.percent >= 50) {
            advice = `Il muscolo è in fase di recupero. Mancano circa <strong>${state.hoursLeft} ore</strong> al recupero totale. Puoi allenarlo con carichi moderati o focalizzarti su altri distretti.`;
          } else {
            advice = `<strong>Riposo consigliato!</strong> Il muscolo è congestionato. Mancano circa <strong>${state.hoursLeft} ore</strong> per ripristinare le fibre muscolari.`;
          }
          
          const icon = getMuscleIcon(muscle);
          
          detailPanel.style.textAlign = 'left';
          detailPanel.style.alignItems = 'flex-start';
          detailPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px">
              <span style="font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; gap: 6px">
                <span style="font-size: 1.3rem">${icon}</span> ${muscle.toUpperCase()}
              </span>
              <span class="badge" style="background: rgba(${state.status === 'fresh' ? '0,255,136' : (state.status === 'recovering' ? '255,179,0' : '255,77,77')}, 0.12); color: ${state.color}; border: 1px solid ${state.color}55">
                ${state.status === 'fresh' ? 'Fresco' : (state.status === 'recovering' ? 'Recupero' : 'Affaticato')}
              </span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); width: 100%">
              Stato di recupero: <strong>${state.percent}%</strong>
            </div>
            <div class="recovery-progress-bar">
              <div class="recovery-progress-fill" style="width: ${state.percent}%; background-color: ${state.color}"></div>
            </div>
            <div class="card-subtitle" style="margin-top: 10px; font-size: 0.8rem; line-height: 1.4; color: var(--text-primary)">
              ${advice}
            </div>
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.06); width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.72rem; color: var(--text-secondary)">
              <div>Ultimo allenamento:<br><strong style="color: var(--text-primary)">${state.lastTrainedStr}</strong></div>
              <div>Recupero standard:<br><strong style="color: var(--text-primary)">${recoveryDurations[muscle]} ore</strong></div>
            </div>
          `;
        }
      });
    });

    document.getElementById('show-changelog').addEventListener('click', () => renderChangelog());
    document.getElementById('open-settings').addEventListener('click', () => renderSettings());
    
    const select = document.getElementById('exercise-select');
    if (select) {
      const uniqueEx = getUniqueExercises();
      if (uniqueEx.length > 0) {
        // Scegli di default l'esercizio più allenato
        const freq = {};
        logs.forEach(l => (l.exercises || []).forEach(ex => {
          if (ex.name) freq[ex.name] = (freq[ex.name] || 0) + 1;
        }));
        const topEx = uniqueEx.slice().sort((a, b) => (freq[b] || 0) - (freq[a] || 0))[0];
        select.value = topEx;
        updateChart(topEx, selectedProgressMetric);
      }
      select.addEventListener('change', (e) => {
        updateChart(e.target.value, selectedProgressMetric);
      });
    }

    document.querySelectorAll('#prog-metric-switch .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#prog-metric-switch .segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedProgressMetric = btn.getAttribute('data-metric');
        if (select && select.value) updateChart(select.value, selectedProgressMetric);
      });
    });

    document.querySelectorAll('#vol-range-switch .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#vol-range-switch .segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedVolumeRange = btn.getAttribute('data-range');
        updateVolumeChart(selectedVolumeRange, selectedYear);
      });
    });

    updateVolumeChart(selectedVolumeRange, selectedYear);
  };

  const toLocalDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const calcLogVolume = (log) => {
    let vol = 0;
    if (log && log.exercises) {
      log.exercises.forEach(ex => {
        if (Array.isArray(ex.sets)) {
          ex.sets.forEach(s => {
            if (s.tag === 'warmup') return;
            vol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
            if (s.dropWeight && s.dropReps) {
              vol += (parseFloat(s.dropWeight) || 0) * (parseInt(s.dropReps) || 0);
            }
          });
        }
      });
    }
    return Math.round(vol);
  };

  const parseDurationMinutes = (dur) => {
    if (!dur) return 0;
    if (typeof dur === 'number') return dur;
    const str = String(dur).trim();
    const parts = str.split(':').map(n => parseInt(n, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] + parts[1] / 60;
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1] + (parts[2] || 0) / 60;
    }
    const m = str.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const formatCompactVolume = (v) => {
    const unit = user.unit === 'lbs' ? 'lbs' : 'kg';
    if (v >= 1000000) return `${(v / 1000000).toFixed(2).replace('.', ',')}M ${unit}`;
    if (v >= 10000) return `${(v / 1000).toFixed(1).replace('.', ',')}k ${unit}`;
    return `${Math.round(v).toLocaleString('it-IT')} ${unit}`;
  };

  const renderAnnualCalendar = (year) => {
    const mount = document.getElementById('calendar-mount');
    if (!mount) return;

    const now = new Date();
    const todayKey = toLocalDateKey(now);
    const currentYear = now.getFullYear();

    // Raggruppa i log per giorno (YYYY-MM-DD) nell'anno selezionato
    const logsByDay = {};
    const availableYears = new Set([currentYear]);
    logs.forEach(log => {
      const d = parseLogDate(log);
      if (!d) return;
      availableYears.add(d.getFullYear());
      if (d.getFullYear() !== year) return;
      const key = toLocalDateKey(d);
      if (!logsByDay[key]) logsByDay[key] = [];
      logsByDay[key].push(log);
    });

    const minYear = Math.min(...availableYears, currentYear - 1);
    const maxYear = Math.max(...availableYears, currentYear);

    const jan1 = new Date(year, 0, 1);
    const dec31 = new Date(year, 11, 31);
    const startOffset = (jan1.getDay() + 6) % 7; // 0=Lun .. 6=Dom
    const gridStart = new Date(year, 0, 1 - startOffset);
    const endOffset = 6 - ((dec31.getDay() + 6) % 7);
    const gridEnd = new Date(year, 11, 31 + endOffset);

    const totalDaysInGrid = Math.round((gridEnd - gridStart) / 86400000) + 1;
    const totalWeeks = Math.ceil(totalDaysInGrid / 7);

    const monthShort = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const monthColMap = {};
    for (let m = 0; m < 12; m++) {
      const firstOfMonth = new Date(year, m, 1);
      const diffDays = Math.round((firstOfMonth - gridStart) / 86400000);
      const col = Math.floor(diffDays / 7);
      monthColMap[col] = monthShort[m];
    }

    let dotsHtml = '';
    let yearWorkoutsCount = 0;
    let activeDaysCount = 0;

    for (let w = 0; w < totalWeeks; w++) {
      for (let r = 0; r < 7; r++) {
        const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + w * 7 + r);
        const inYear = cellDate.getFullYear() === year;
        if (!inYear) {
          dotsHtml += `<span class="heatmap-dot outside" aria-hidden="true"></span>`;
          continue;
        }
        const key = toLocalDateKey(cellDate);
        const dayLogs = logsByDay[key] || [];
        const isToday = key === todayKey;
        const isFuture = cellDate > now && !isToday;
        if (dayLogs.length > 0) {
          yearWorkoutsCount += dayLogs.length;
          activeDaysCount++;
        }
        const lvlClass = dayLogs.length >= 2 ? 'active-lvl-2' : (dayLogs.length === 1 ? 'active-lvl-1' : (isFuture ? 'future' : ''));
        dotsHtml += `<button type="button" class="heatmap-dot ${lvlClass} ${isToday ? 'is-today' : ''}" data-date="${key}" aria-label="${key}: ${dayLogs.length} allenamenti"></button>`;
      }
    }

    let monthsHtml = '';
    for (let w = 0; w < totalWeeks; w++) {
      monthsHtml += `<span class="year-heatmap-month-label">${monthColMap[w] || ''}</span>`;
    }

    mount.innerHTML = `
      <div class="year-heatmap-header">
        <div class="year-nav">
          <button type="button" class="year-nav-btn" id="year-prev-btn" ${year <= minYear ? 'disabled' : ''} aria-label="Anno precedente">‹</button>
          <span class="year-title">${year}</span>
          <button type="button" class="year-nav-btn" id="year-next-btn" ${year >= maxYear ? 'disabled' : ''} aria-label="Anno successivo">›</button>
        </div>
        <span class="badge">${yearWorkoutsCount} allenamenti · ${activeDaysCount} gg</span>
      </div>
      <div class="year-heatmap-scroll" id="year-heatmap-scroll">
        <div class="year-heatmap-inner">
          <div class="year-heatmap-months">${monthsHtml}</div>
          <div class="year-heatmap-body">
            <div class="year-heatmap-weekdays">
              <span>L</span><span></span><span>M</span><span></span><span>V</span><span></span><span>D</span>
            </div>
            <div class="year-heatmap-grid">${dotsHtml}</div>
          </div>
        </div>
      </div>
      <div class="heatmap-footer">
        <div class="heatmap-selected-info" id="heatmap-selected-info">
          Tocca un puntino per i dettagli del giorno.
        </div>
        <div class="heatmap-legend">
          <span>Riposo</span>
          <span class="heatmap-legend-box" style="background: rgba(255,255,255,0.08)"></span>
          <span class="heatmap-legend-box" style="background: var(--accent-color); opacity: 0.85"></span>
          <span class="heatmap-legend-box" style="background: var(--accent-color); box-shadow: 0 0 5px var(--accent-glow)"></span>
          <span>Attivo</span>
        </div>
      </div>
    `;

    // Scorri automaticamente verso il mese corrente se è l'anno in corso
    const scrollEl = document.getElementById('year-heatmap-scroll');
    if (scrollEl) {
      if (year === currentYear) {
        const ratio = Math.min(1, Math.max(0, (now.getMonth() + 1) / 12));
        scrollEl.scrollLeft = Math.max(0, (scrollEl.scrollWidth - scrollEl.clientWidth) * ratio);
      } else {
        scrollEl.scrollLeft = scrollEl.scrollWidth;
      }
    }

    document.getElementById('year-prev-btn')?.addEventListener('click', () => {
      if (year > minYear) {
        selectedYear = year - 1;
        refreshCalendarAndRecap();
      }
    });
    document.getElementById('year-next-btn')?.addEventListener('click', () => {
      if (year < maxYear) {
        selectedYear = year + 1;
        refreshCalendarAndRecap();
      }
    });

    const infoEl = document.getElementById('heatmap-selected-info');
    mount.querySelectorAll('.heatmap-dot[data-date]').forEach(dot => {
      dot.addEventListener('click', () => {
        mount.querySelectorAll('.heatmap-dot.selected').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        const key = dot.getAttribute('data-date');
        const [y, m, d] = key.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dateLabel = dateObj.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        const dayLogs = logsByDay[key] || [];
        if (dayLogs.length === 0) {
          infoEl.innerHTML = `<strong>${dateLabel}</strong> · Giorno di riposo`;
        } else {
          const names = dayLogs.map(l => l.routineName).join(', ');
          const dayVol = dayLogs.reduce((sum, l) => sum + calcLogVolume(l), 0);
          infoEl.innerHTML = `<strong>${dateLabel}</strong> · ${names}${dayVol > 0 ? ` (${formatCompactVolume(dayVol)})` : ''}`;
        }
      });
    });
  };

  const renderMonthlyCalendar = () => {
    const mount = document.getElementById('calendar-mount');
    if (!mount) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const workoutDates = new Set(logs.map(log => {
      const d = parseLogDate(log);
      return d ? toLocalDateKey(d) : null;
    }).filter(Boolean));

    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    let html = `
      <div class="calendar-container" style="padding: 4px 0 0;">
        <div class="calendar-header">
          <span style="font-weight: 700; text-transform: capitalize">${new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(now)}</span>
        </div>
        <div class="calendar-grid">
          ${dayNames.map(d => `<div class="calendar-day-name">${d}</div>`).join('')}
    `;

    const emptyDays = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < emptyDays; i++) {
      html += `<div class="calendar-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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

  const renderYearlyRecap = (year) => {
    const mount = document.getElementById('yearly-recap-mount');
    if (!mount) return;

    const yearLogs = logs.filter(log => {
      const d = parseLogDate(log);
      return d && d.getFullYear() === year;
    });

    const totalWorkouts = yearLogs.length;
    const now = new Date();
    const weeksElapsed = year === now.getFullYear()
      ? Math.max(1, Math.ceil((now - new Date(year, 0, 1)) / (7 * 86400000)))
      : 52;
    const avgPerWeek = (totalWorkouts / weeksElapsed).toFixed(1).replace('.', ',');

    let totalVolume = 0;
    let totalSets = 0;
    let totalMinutes = 0;
    const monthCounts = Array(12).fill(0);
    const muscleCounts = {};
    const weekSet = new Set();

    yearLogs.forEach(log => {
      const d = parseLogDate(log);
      if (d) {
        monthCounts[d.getMonth()]++;
        const jan1 = new Date(year, 0, 1);
        const weekNum = Math.floor(((d - jan1) / 86400000 + ((jan1.getDay() + 6) % 7)) / 7);
        weekSet.add(weekNum);
      }
      totalMinutes += parseDurationMinutes(log.duration);
      totalVolume += calcLogVolume(log);
      (log.exercises || []).forEach(ex => {
        const setsLen = Array.isArray(ex.sets) ? ex.sets.length : 0;
        totalSets += setsLen;
        const muscles = getExerciseMuscles(ex);
        muscles.forEach(m => {
          if (m && m !== 'Altro') {
            muscleCounts[m] = (muscleCounts[m] || 0) + Math.max(1, setsLen);
          }
        });
      });
    });

    // Calcola miglior streak di settimane consecutive attive
    const sortedWeeks = Array.from(weekSet).sort((a, b) => a - b);
    let bestWeekStreak = 0;
    let curStreak = 0;
    for (let i = 0; i < sortedWeeks.length; i++) {
      if (i === 0 || sortedWeeks[i] === sortedWeeks[i - 1] + 1) curStreak++;
      else curStreak = 1;
      if (curStreak > bestWeekStreak) bestWeekStreak = curStreak;
    }

    const monthNamesFull = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    let bestMonthIdx = -1;
    let bestMonthVal = 0;
    monthCounts.forEach((c, idx) => {
      if (c > bestMonthVal) { bestMonthVal = c; bestMonthIdx = idx; }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remMins = Math.round(totalMinutes % 60);
    const timeStr = totalHours > 0 ? `${totalHours}h ${remMins}m` : `${Math.round(totalMinutes)} min`;
    const avgMin = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    const sortedMuscles = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const totalMuscleSets = Object.values(muscleCounts).reduce((a, b) => a + b, 0) || 1;

    if (totalWorkouts === 0) {
      mount.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="card-title" style="margin: 0">🏆 Recap ${year}</div>
          <span class="badge">0 sessioni</span>
        </div>
        <div class="card-subtitle" style="margin-top: 8px">
          Nessun allenamento registrato nel ${year}. Completa la tua prima sessione per sbloccare le statistiche annuali!
        </div>
      `;
      return;
    }

    mount.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title" style="margin: 0">🏆 Recap ${year}</div>
          <div class="card-subtitle">Il tuo bilancio annuale in palestra</div>
        </div>
        <span class="badge">${weekSet.size} sett. attive</span>
      </div>

      <div class="recap-kpi-grid">
        <div class="recap-kpi">
          <span class="recap-kpi-label">Allenamenti</span>
          <span class="recap-kpi-value accent">${totalWorkouts}</span>
          <span class="recap-kpi-sub">Media ${avgPerWeek} / settimana</span>
        </div>
        <div class="recap-kpi">
          <span class="recap-kpi-label">Volume Totale</span>
          <span class="recap-kpi-value">${formatCompactVolume(totalVolume)}</span>
          <span class="recap-kpi-sub">${totalSets.toLocaleString('it-IT')} serie completate</span>
        </div>
        <div class="recap-kpi">
          <span class="recap-kpi-label">Tempo in Palestra</span>
          <span class="recap-kpi-value">${timeStr}</span>
          <span class="recap-kpi-sub">${avgMin > 0 ? `~${avgMin} min / sessione` : 'Durata registrata'}</span>
        </div>
        <div class="recap-kpi">
          <span class="recap-kpi-label">Costanza & Record</span>
          <span class="recap-kpi-value">${bestWeekStreak} sett.</span>
          <span class="recap-kpi-sub">${bestMonthIdx >= 0 ? `Top: ${monthNamesFull[bestMonthIdx].slice(0, 3)} (${bestMonthVal})` : 'Miglior serie'}</span>
        </div>
      </div>

      ${sortedMuscles.length > 0 ? `
        <div class="recap-muscle-bars">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.4px;">
            Muscoli più allenati (${year})
          </div>
          ${sortedMuscles.map(([m, count]) => {
            const pct = Math.round((count / totalMuscleSets) * 100);
            return `
              <div class="recap-muscle-row">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${getMuscleIcon(m)} ${m}</span>
                <div class="recap-muscle-bar-track">
                  <div class="recap-muscle-bar-fill" style="width: ${pct}%"></div>
                </div>
                <span style="text-align: right; color: var(--accent-color); font-weight: 700;">${pct}%</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    `;
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

  const hexToRgba = (color, alpha) => {
    const c = color.trim();
    if (c.startsWith('#')) {
      const hex = c.length === 4
        ? c.slice(1).split('').map(ch => ch + ch).join('')
        : c.slice(1, 7);
      const r = parseInt(hex.slice(0, 2), 16) || 204;
      const g = parseInt(hex.slice(2, 4), 16) || 255;
      const b = parseInt(hex.slice(4, 6), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(204, 255, 0, ${alpha})`;
  };

  const updateChart = (exerciseName, metric = 'weight') => {
    const summaryEl = document.getElementById('progress-chart-summary');
    const canvas = document.getElementById('progressChart');
    if (!exerciseName || !canvas) return;
    
    const unit = user.unit === 'lbs' ? 'lbs' : 'kg';
    const chartData = logs
      .filter(log => log.exercises && log.exercises.find(ex => ex.name === exerciseName))
      .map(log => {
        const ex = log.exercises.find(ex => ex.name === exerciseName);
        const sets = Array.isArray(ex.sets) ? ex.sets : [];
        let maxWeight = 0;
        let best1RM = 0;
        let exVol = 0;
        let bestSetStr = '';
        sets.forEach(s => {
          const w = parseFloat(s.weight) || 0;
          const r = parseInt(s.reps) || 0;
          if (w >= maxWeight) {
            maxWeight = w;
            bestSetStr = `${w} ${unit} × ${s.reps}`;
          }
          const est = r > 1 ? Math.round(w * (1 + r / 30) * 10) / 10 : w;
          if (est > best1RM) best1RM = est;
          exVol += w * r;
        });
        const value = metric === '1rm' ? best1RM : (metric === 'volume' ? Math.round(exVol) : maxWeight);
        return { date: log.date, value, maxWeight, best1RM, exVol: Math.round(exVol), bestSetStr };
      })
      .reverse();

    if (summaryEl) {
      if (chartData.length > 0) {
        const latest = chartData[chartData.length - 1].value;
        const first = chartData[0].value;
        const best = Math.max(...chartData.map(d => d.value));
        const delta = Math.round((latest - first) * 10) / 10;
        const deltaClass = delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '');
        const deltaText = `${delta > 0 ? '+' : ''}${delta} ${unit}`;
        summaryEl.style.display = 'grid';
        summaryEl.innerHTML = `
          <div class="chart-summary-pill">
            <div class="label">Ultimo</div>
            <div class="val accent">${latest} ${unit}</div>
          </div>
          <div class="chart-summary-pill">
            <div class="label">Record</div>
            <div class="val">${best} ${unit}</div>
          </div>
          <div class="chart-summary-pill">
            <div class="label">Progresso</div>
            <div class="val ${deltaClass}">${deltaText}</div>
          </div>
        `;
      } else {
        summaryEl.style.display = 'none';
      }
    }

    const ctx = canvas.getContext('2d');
    if (window.currentChart) window.currentChart.destroy();

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#ccff00';
    const gradient = ctx.createLinearGradient(0, 0, 0, 225);
    gradient.addColorStop(0, hexToRgba(accentColor, 0.36));
    gradient.addColorStop(1, hexToRgba(accentColor, 0.0));

    const metricLabel = metric === '1rm' ? `1RM Stimato (${unit})` : (metric === 'volume' ? `Volume (${unit})` : `Peso Max (${unit})`);

    window.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.date),
        datasets: [{
          label: metricLabel,
          data: chartData.map(d => d.value),
          borderColor: accentColor,
          backgroundColor: gradient,
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#121212',
          pointBorderColor: accentColor,
          pointBorderWidth: 2.5,
          pointRadius: chartData.length > 15 ? 3 : 4.5,
          pointHoverRadius: 6.5,
          pointHoverBackgroundColor: accentColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 17, 23, 0.94)',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: hexToRgba(accentColor, 0.45),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const pt = chartData[context.dataIndex];
                if (!pt) return `${context.parsed.y} ${unit}`;
                if (metric === '1rm') return `1RM stimato: ${pt.best1RM} ${unit}`;
                if (metric === 'volume') return `Volume esercizio: ${pt.exVol.toLocaleString('it-IT')} ${unit}`;
                return `Max: ${pt.maxWeight} ${unit}${pt.bestSetStr ? ` (${pt.bestSetStr})` : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            border: { display: false },
            grid: { color: 'rgba(255,255,255,0.06)', tickLength: 0 },
            ticks: {
              color: '#8e95a3',
              font: { size: 11, family: 'Outfit, sans-serif' },
              padding: 8,
              maxTicksLimit: 5,
              callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
            }
          },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: '#8e95a3',
              font: { size: 10, family: 'Outfit, sans-serif' },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            }
          }
        }
      }
    });
  };

  const updateVolumeChart = (range = '10', year = new Date().getFullYear()) => {
    const canvas = document.getElementById('volumeChart');
    const summaryEl = document.getElementById('volume-chart-summary');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const unit = user.unit === 'lbs' ? 'lbs' : 'kg';

    let labels = [];
    let values = [];
    let meta = [];

    if (range === 'year') {
      const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
      const totals = Array(12).fill(0);
      const counts = Array(12).fill(0);
      logs.forEach(log => {
        const d = parseLogDate(log);
        if (d && d.getFullYear() === year) {
          totals[d.getMonth()] += calcLogVolume(log);
          counts[d.getMonth()]++;
        }
      });
      labels = monthLabels;
      values = totals;
      meta = counts.map((c, idx) => `${monthLabels[idx]} ${year} · ${c} sessioni`);
    } else {
      const limit = parseInt(range, 10) || 10;
      const items = logs.map(log => {
        const setsCount = (log.exercises || []).reduce((acc, ex) => acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0);
        return {
          date: log.date,
          volume: calcLogVolume(log),
          routineName: log.routineName || 'Allenamento',
          setsCount
        };
      }).reverse().slice(-limit);
      labels = items.map(i => i.date);
      values = items.map(i => i.volume);
      meta = items.map(i => `${i.routineName} · ${i.setsCount} serie`);
    }

    if (summaryEl) {
      const nonZero = values.filter(v => v > 0);
      if (nonZero.length > 0) {
        const sum = nonZero.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / nonZero.length);
        const max = Math.max(...nonZero);
        summaryEl.style.display = 'grid';
        summaryEl.innerHTML = `
          <div class="chart-summary-pill">
            <div class="label">${range === 'year' ? 'Media/Mese' : 'Media'}</div>
            <div class="val accent">${formatCompactVolume(avg)}</div>
          </div>
          <div class="chart-summary-pill">
            <div class="label">Record</div>
            <div class="val">${formatCompactVolume(max)}</div>
          </div>
          <div class="chart-summary-pill">
            <div class="label">Totale</div>
            <div class="val">${formatCompactVolume(sum)}</div>
          </div>
        `;
      } else {
        summaryEl.style.display = 'none';
      }
    }

    if (window.volumeChartInstance) window.volumeChartInstance.destroy();

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#ccff00';
    const barGradient = ctx.createLinearGradient(0, 0, 0, 225);
    barGradient.addColorStop(0, hexToRgba(accentColor, 0.92));
    barGradient.addColorStop(1, hexToRgba(accentColor, 0.18));

    window.volumeChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Volume (${unit})`,
          data: values,
          backgroundColor: barGradient,
          borderColor: accentColor,
          borderWidth: 1,
          borderRadius: 7,
          borderSkipped: false,
          maxBarThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 17, 23, 0.94)',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: hexToRgba(accentColor, 0.45),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              title: (items) => meta[items[0].dataIndex] || items[0].label,
              label: (context) => `Volume: ${Math.round(context.parsed.y).toLocaleString('it-IT')} ${unit}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: 'rgba(255,255,255,0.06)', tickLength: 0 },
            ticks: {
              color: '#8e95a3',
              font: { size: 11, family: 'Outfit, sans-serif' },
              padding: 8,
              maxTicksLimit: 5,
              callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
            }
          },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: '#8e95a3',
              font: { size: 10, family: 'Outfit, sans-serif' },
              maxRotation: 0,
              autoSkip: range !== 'year',
              maxTicksLimit: range === 'year' ? 12 : 6
            }
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
          
          <div style="margin-top: 12px">
            <div class="card-subtitle">Genere (Influenza l'anatomia nei progressi)</div>
            <select id="edit-gender" style="margin: 0; padding: 10px; border-radius: 8px; border: 1px solid #333; background: #111; color: white; width: 100%;">
              <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Maschio (♂)</option>
              <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Femmina (♀)</option>
            </select>
          </div>
          
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
      user.gender = document.getElementById('edit-gender').value;
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
                  <option value="0.5" ${user.progressionStep === 0.5 ? 'selected' : ''}>+0.5 kg (Micro-carico)</option>
                  <option value="1" ${user.progressionStep === 1 ? 'selected' : ''}>+1 kg</option>
                  <option value="1.25" ${user.progressionStep === 1.25 ? 'selected' : ''}>+1.25 kg (Micro-carico)</option>
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

        <!-- Privacy -->
        <div class="card">
          <div class="card-title">Privacy e Community</div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; margin-bottom: 5px">
            <div style="font-weight: 700; font-size: 0.9rem">Mostra Progressi agli Amici</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="privacy-progress-toggle" ${user.privacy?.showProgressToFriends !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${user.privacy?.showProgressToFriends !== false ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${user.privacy?.showProgressToFriends !== false ? '25px' : '3px'};
                width: 22px; height: 22px; background: ${user.privacy?.showProgressToFriends !== false ? '#000' : '#888'};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 15px">Consenti ai tuoi amici di vedere le tue sessioni di allenamento nel feed.</div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px">
            <div style="font-weight: 700; font-size: 0.9rem">Partecipa alla Classifica Globale</div>
            <label style="position: relative; display: inline-block; width: 50px; height: 28px; cursor: pointer">
              <input type="checkbox" id="privacy-stats-toggle" ${user.privacy?.showStatsPublic !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0">
              <span style="
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: ${user.privacy?.showStatsPublic !== false ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)'};
                border-radius: 28px; transition: 0.3s;
              "></span>
              <span style="
                position: absolute; top: 3px; left: ${user.privacy?.showStatsPublic !== false ? '25px' : '3px'};
                width: 22px; height: 22px; background: ${user.privacy?.showStatsPublic !== false ? '#000' : '#888'};
                border-radius: 50%; transition: 0.3s;
              "></span>
            </label>
          </div>
          <div class="card-subtitle" style="margin-bottom: 12px">Mostra il tuo volume di allenamento nella Classifica Globale (anonimo o col tuo nome se visibile).</div>
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
          <button class="btn btn-primary" id="btn-force-cloud-sync" style="width: 100%; height: 40px; font-size: 0.8rem; margin-top: 10px; background-color: var(--accent-color); color: var(--bg-color)">
            <i class="fa-solid fa-cloud-arrow-up"></i> Forza Sincronizzazione Cloud
          </button>
          <p id="sync-status-text" style="text-align:center; font-size:0.72rem; color:var(--text-secondary); margin-top:6px; min-height:1em;"></p>
        </div>

        <!-- Installazione App Home -->
        <div class="card" id="settings-install-card">
          <div class="card-title">📲 Installazione App</div>
          <div class="card-subtitle" style="margin-bottom: 12px">Installa IronTrack sulla schermata Home del tuo smartphone per un'esperienza a tutto schermo, più fluida e veloce.</div>
          <button class="btn btn-secondary" id="btn-open-install-guide" style="width: 100%; height: 42px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px">
            <span>📲</span> Guida: Aggiungi alla Schermata Home
          </button>
        </div>

        <!-- Supporto & Feedback -->
        <div class="card" id="settings-feedback-card">
          <div class="card-title">💬 Supporto & Feedback</div>
          <div class="card-subtitle" style="margin-bottom: 12px">Hai trovato un bug o hai un'idea per migliorare l'app? Inviaci un messaggio diretto!</div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px">
            <button class="btn feedback-type-btn" id="fb-type-bug" data-type="bug" style="flex: 1; height: 38px; font-size: 0.8rem; font-weight: 700; background: rgba(var(--accent-rgb, 204,255,0), 0.15); border: 1px solid var(--accent-color); color: white">
              🐛 Segnala Bug
            </button>
            <button class="btn btn-secondary feedback-type-btn" id="fb-type-idea" data-type="idea" style="flex: 1; height: 38px; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary)">
              💡 Suggerimento
            </button>
          </div>
          <textarea id="feedback-text" placeholder="Descrivi cosa è successo o dove si è verificato l'errore..." style="width: 100%; min-height: 85px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: #111; color: white; font-family: inherit; font-size: 0.85rem; resize: vertical; margin-bottom: 10px; box-sizing: border-box"></textarea>
          <button class="btn" id="btn-send-feedback" style="width: 100%; height: 40px; font-size: 0.85rem; font-weight: 700; background: var(--accent-color); color: #000">
            Invia Segnalazione
          </button>
          <div id="feedback-status-msg" style="text-align: center; font-size: 0.75rem; margin-top: 8px; min-height: 1.2em"></div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.7rem; padding-bottom: 20px">
          IronTrack ${APP_VERSION} • Premium Workout Tracking
        </div>
      </div>
    `;

    document.getElementById('close-settings').addEventListener('click', () => renderProfile());
    document.getElementById('edit-profile-btn').addEventListener('click', () => renderEditForm());
    document.getElementById('btn-open-install-guide')?.addEventListener('click', () => renderInstallGuide('settings'));
    
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

    // Privacy toggles
    document.getElementById('privacy-progress-toggle').addEventListener('change', (e) => {
      user.privacy = user.privacy || {};
      user.privacy.showProgressToFriends = e.target.checked;
      storage.saveUser(user);
      renderSettings();
    });
    
    document.getElementById('privacy-stats-toggle').addEventListener('change', (e) => {
      user.privacy = user.privacy || {};
      user.privacy.showStatsPublic = e.target.checked;
      storage.saveUser(user);
      renderSettings();
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
      
      const enabled = user.progressionEnabled !== false;
      const mode = user.progressionMode || 'mixed';
      const type = user.progressionType || 'all';
      const rawStep = user.progressionStep !== undefined ? user.progressionStep : 'auto';
      const isAuto = rawStep === 'auto';
      
      let html = '';
      
      if (!enabled) {
        html = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px; margin-top: 15px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); color: var(--text-secondary); font-size: 0.8rem">
            <div>Progressione automatica disattivata</div>
            <div style="font-size: 0.65rem; opacity: 0.6; margin-top: 4px">I carichi rimarranno fissi sessione dopo sessione</div>
          </div>
        `;
      } else if (mode === 'reps-only') {
        // Solo Reps: incrementi di sole ripetizioni (+1 rep)
        html = `
          <div style="margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
              <span style="font-size: 0.7rem; color: #4da6ff; font-weight: 700">MODALITÀ REPS: +1 Ripetizione</span>
              <span style="font-size: 0.65rem; color: var(--text-secondary)">Pesi invariati</span>
            </div>
            <div style="height: 100px; display: flex; gap: 8px; justify-content: center; align-items: flex-end">
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
        `;
      } else if (isAuto) {
        // Split visuale per passo auto
        html = `
          <div style="margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04)">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
              <span style="font-size: 0.7rem; color: var(--accent-color); font-weight: 700">PASSO DINAMICO (AUTO)</span>
              <span style="font-size: 0.65rem; color: var(--text-secondary)">In base al gruppo muscolare</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
              <!-- Grandi Muscoli -->
              <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03)">
                <div style="font-size: 0.65rem; font-weight: 700; color: #fff; margin-bottom: 6px; text-align: center">Grandi: +2.5 kg</div>
                <div style="height: 60px; display: flex; gap: 4px; justify-content: center; align-items: flex-end">
                  ${[0, 1, 2, 3].map(i => {
                    let applyStep = false;
                    if (type === 'all') applyStep = true;
                    else if (type === 'last' && i === 3) applyStep = true;
                    else if (type === 'first' && i === 0) applyStep = true;
                    else if (type === 'alternate' && i % 2 === 0) applyStep = true;
                    
                    const baseHeight = 25 + i * 3;
                    return `
                      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                        <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                          ${applyStep ? `<div class="pulse" style="height: 12px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+2.5</div>` : ''}
                          <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${i+1}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
              
              <!-- Piccoli Muscoli -->
              <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03)">
                <div style="font-size: 0.65rem; font-weight: 700; color: #fff; margin-bottom: 6px; text-align: center">Piccoli: +1.0 kg</div>
                <div style="height: 60px; display: flex; gap: 4px; justify-content: center; align-items: flex-end">
                  ${[0, 1, 2, 3].map(i => {
                    let applyStep = false;
                    if (type === 'all') applyStep = true;
                    else if (type === 'last' && i === 3) applyStep = true;
                    else if (type === 'first' && i === 0) applyStep = true;
                    else if (type === 'alternate' && i % 2 === 0) applyStep = true;
                    
                    const baseHeight = 25 + i * 3;
                    return `
                      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%">
                        <div style="position: relative; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.05)">
                          ${applyStep ? `<div class="pulse" style="height: 12px; background: var(--success); display: flex; align-items: center; justify-content: center; color: #000; font-size: 0.45rem; font-weight: 800">+1</div>` : ''}
                          <div style="height: ${baseHeight}px; background: var(--accent-glow); border-top: 1px solid var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #a0a0a0">S${i+1}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
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
      renderSettings();
    });

    // Progression Mode Listener
    document.getElementById('setting-progression-mode').addEventListener('change', (e) => {
      user.progressionMode = e.target.value;
      storage.saveUser(user);
      updateSettingsProgressionPreview();
    });

    // Progression Type Listener
    document.getElementById('setting-progression-type').addEventListener('change', (e) => {
      user.progressionType = e.target.value;
      storage.saveUser(user);
      updateSettingsProgressionPreview();
    });

    // Progression Step Listener
    document.getElementById('setting-progression-step').addEventListener('change', (e) => {
      const val = e.target.value;
      user.progressionStep = val === 'auto' ? 'auto' : parseFloat(val);
      storage.saveUser(user);
      updateSettingsProgressionPreview();
    });

    document.getElementById('setting-reps-threshold').addEventListener('change', (e) => {
      user.repsThreshold = parseInt(e.target.value) || 8;
      storage.saveUser(user);
    });

    // Info Help Buttons
    document.querySelectorAll('.info-help-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.getAttribute('data-type');
        let title = '';
        let text = '';
        
        if (type === 'mode') {
          title = 'Logica di Progressione';
          text = '• Mista: aumenta prima le ripetizioni fino al limite, poi aumenta il peso e riparte dalle reps base.\n• Solo Peso: aumenta direttamente il carico ad ogni feedback positivo.\n• Solo Reps: aumenta solo le ripetizioni lasciando invariato il carico (ideale a corpo libero).';
        } else if (type === 'type') {
          title = 'Applicazione Peso';
          text = '• Tutte le serie: aumenta il peso uniformemente su ogni serie.\n• Ultima serie: aumenta solo l\'ultima serie come test del massimale.\n• Prima serie: aumenta solo la prima serie pesante (Drop-set).\n• Alternate: aumenta a serie alterne (1ª e 3ª serie).';
        } else if (type === 'step') {
          title = 'Passo di Incremento';
          text = '• Automatico (Consigliato): calcola l\'incremento scientifico in base al muscolo (+2.5 kg per Petto, Dorsali, Gambe; +1.0 kg per Braccia e Spalle).\n• Fisso (1, 2, 2.5, 5 kg): applica sempre lo stesso aumento fisso ad ogni esercizio.';
        }
        
        alert(`ℹ️ ${title}\n\n${text}`);
      });
    });

    // Export & Import listeners
    document.getElementById('export-btn-settings').addEventListener('click', () => exportData());
    document.getElementById('import-input-settings').addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) importData(e.target.files[0]);
    });

    // Feedback & Suggerimenti listeners
    let selectedFeedbackType = 'bug';
    const fbBugBtn = document.getElementById('fb-type-bug');
    const fbIdeaBtn = document.getElementById('fb-type-idea');
    const fbText = document.getElementById('feedback-text');
    const fbSendBtn = document.getElementById('btn-send-feedback');
    const fbStatus = document.getElementById('feedback-status-msg');

    if (fbBugBtn && fbIdeaBtn) {
      fbBugBtn.addEventListener('click', () => {
        selectedFeedbackType = 'bug';
        fbBugBtn.style.background = 'rgba(var(--accent-rgb, 204,255,0), 0.15)';
        fbBugBtn.style.border = '1px solid var(--accent-color)';
        fbBugBtn.style.color = 'white';
        fbIdeaBtn.style.background = 'rgba(255,255,255,0.05)';
        fbIdeaBtn.style.border = 'none';
        fbIdeaBtn.style.color = 'var(--text-secondary)';
        if (fbText) fbText.placeholder = "Descrivi cosa è successo o dove si è verificato l'errore...";
      });

      fbIdeaBtn.addEventListener('click', () => {
        selectedFeedbackType = 'idea';
        fbIdeaBtn.style.background = 'rgba(var(--accent-rgb, 204,255,0), 0.15)';
        fbIdeaBtn.style.border = '1px solid var(--accent-color)';
        fbIdeaBtn.style.color = 'white';
        fbBugBtn.style.background = 'rgba(255,255,255,0.05)';
        fbBugBtn.style.border = 'none';
        fbBugBtn.style.color = 'var(--text-secondary)';
        if (fbText) fbText.placeholder = "Quale nuova funzionalità vorresti vedere su IronTrack?";
      });
    }

    if (fbSendBtn) {
      fbSendBtn.addEventListener('click', async () => {
        const message = fbText ? fbText.value.trim() : '';
        if (!message) {
          alert("Inserisci un messaggio prima di inviare.");
          return;
        }

        fbSendBtn.disabled = true;
        const origText = fbSendBtn.innerText;
        fbSendBtn.innerText = "Invio in corso...";
        if (fbStatus) fbStatus.textContent = '';

        try {
          await addDoc(collection(db, 'feedback'), {
            type: selectedFeedbackType,
            message: message,
            userId: auth?.currentUser?.uid || 'anonimo',
            userEmail: auth?.currentUser?.email || user.email || 'non-disponibile',
            userName: user.nickname || user.name || auth?.currentUser?.displayName || 'Utente',
            appVersion: APP_VERSION,
            device: navigator.userAgent,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString()
          });

          if (fbText) fbText.value = '';
          if (fbStatus) {
            fbStatus.style.color = 'var(--success, #00e676)';
            fbStatus.textContent = selectedFeedbackType === 'bug'
              ? '✅ Segnalazione inviata! Grazie per l\'aiuto.'
              : '✅ Suggerimento inviato! Grazie per l\'idea.';
          }
          alert(selectedFeedbackType === 'bug'
            ? '✅ Segnalazione inviata con successo! Grazie per averci segnalato il problema.'
            : '✅ Suggerimento inviato con successo! Grazie per la tua idea.');
        } catch (err) {
          console.error("Errore invio feedback:", err);
          if (fbStatus) {
            fbStatus.style.color = '#ff5252';
            fbStatus.textContent = 'Errore invio: ' + err.message;
          }
          alert("Errore durante l'invio: " + err.message);
        } finally {
          fbSendBtn.disabled = false;
          fbSendBtn.innerText = origText;
        }
      });
    }

    const forceSyncBtn = document.getElementById('btn-force-cloud-sync');
    const syncStatusEl = document.getElementById('sync-status-text');

    if (forceSyncBtn) {
      forceSyncBtn.addEventListener('click', async () => {
        if (!user || !currentUser) {
          alert("Devi fare il login per caricare i dati sul cloud!");
          return;
        }

        const nLogs = logs ? logs.length : 0;
        const nRoutines = routines ? routines.length : 0;
        const dataKB = Math.round(JSON.stringify({ routines, logs }).length / 1024);

        forceSyncBtn.disabled = true;

        // Live elapsed-time counter
        let elapsed = 0;
        const updateBtn = () => {
          forceSyncBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Caricamento... ${elapsed}s`;
          if (syncStatusEl) syncStatusEl.textContent = `Invio di ${nLogs} allenamenti e ${nRoutines} schede (${dataKB} KB)…`;
        };
        updateBtn();
        const ticker = setInterval(() => { elapsed++; updateBtn(); }, 1000);

        // Safety timeout: 25 seconds
        const TIMEOUT_MS = 25000;
        let timedOut = false;
        const timeoutId = setTimeout(() => {
          timedOut = true;
          clearInterval(ticker);
          forceSyncBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Timeout — riprova';
          forceSyncBtn.disabled = false;
          if (syncStatusEl) syncStatusEl.textContent = 'Connessione lenta. Controlla la rete e riprova.';
        }, TIMEOUT_MS);

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          let totalVolume = 0;
          logs.forEach(l => {
            if (l.exercises) l.exercises.forEach(ex => {
              if (ex.sets) ex.sets.forEach(set => {
                totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
              });
            });
          });

          await setDoc(userRef, {
            routines: routines,
            logs: logs,
            userSettings: user,
            stats: { totalVolume, totalWorkouts: nLogs },
            lastUpdated: new Date().toISOString()
          }, { merge: true });

          if (timedOut) return; // UI already reset by timeout
          clearTimeout(timeoutId);
          clearInterval(ticker);

          forceSyncBtn.innerHTML = '<i class="fa-solid fa-check"></i> ✅ Completato!';
          if (syncStatusEl) syncStatusEl.textContent = `${nLogs} allenamenti e ${nRoutines} schede salvati nel cloud in ${elapsed}s.`;
          alert(`✅ Sincronizzazione riuscita!\n${nLogs} allenamenti e ${nRoutines} schede caricati nel cloud.`);
          setTimeout(() => {
            forceSyncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Forza Sincronizzazione Cloud';
            forceSyncBtn.disabled = false;
            if (syncStatusEl) syncStatusEl.textContent = '';
          }, 4000);
        } catch (e) {
          if (timedOut) return;
          clearTimeout(timeoutId);
          clearInterval(ticker);
          console.error("Errore durante la sincronizzazione forzata:", e);
          forceSyncBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Errore';
          if (syncStatusEl) syncStatusEl.textContent = 'Errore: ' + e.message;
          alert("❌ Errore durante il salvataggio:\n" + e.message);
          setTimeout(() => {
            forceSyncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Forza Sincronizzazione Cloud';
            forceSyncBtn.disabled = false;
            if (syncStatusEl) syncStatusEl.textContent = '';
          }, 4000);
        }
      });
    }
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

let sfideRenderSeq = 0;

const renderSfide = async () => {
  const renderToken = ++sfideRenderSeq;
  const mainContent = document.getElementById('main-content');
  const headerAction = document.getElementById('header-action');
  if (headerAction) headerAction.innerHTML = '';
  if (mainContent) {
    mainContent.innerHTML = `<div style="padding: 40px 16px; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">Caricamento Sfide...</div>`;
  }

  // ── Firestore imports ──────────────────────────────────────────────────────
  const _col = collection;
  const _doc = doc;
  const _getDocs = getDocs;
  const _setDoc = setDoc;
  const _q = query;
  const _ord = orderBy;
  const _lim = limit;
  const _db = db;

  const uid = currentUser?.uid;

  // ── Helper: calcola 1RM stimato (Epley) ───────────────────────────────────
  const calc1RM = (weight, reps) => reps === 1 ? weight : Math.round(weight * (1 + reps / 30));

  // ── Carica dati amici e richieste ──────────────────────────────────────────
  let friendsList = [];
  let pendingRequests = [];
  let sentRequests = [];
  let activeChallenges = [];

  if (uid) {
    try {
      // Amici
      const friendsSnap = await _getDocs(_col(_db, 'friends', uid, 'list'));
      friendsList = friendsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Richieste ricevute in attesa
      const reqSnap = await _getDocs(_q(_col(_db, 'friendRequests'),
        where('to', '==', uid), where('status', '==', 'pending')));
      pendingRequests = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Richieste inviate (per non mostrare "Aggiungi" di nuovo)
      const sentSnap = await _getDocs(_q(_col(_db, 'friendRequests'),
        where('from', '==', uid), where('status', '==', 'pending')));
      sentRequests = sentSnap.docs.map(d => d.data().to);

      // Sfide attive
      const chalSnap = await _getDocs(_q(_col(_db, 'challenges'),
        where('to', '==', uid), where('status', '==', 'pending')));
      activeChallenges = chalSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch(e) { console.error('Sfide load error:', e); }
  }

  const totalBadge = pendingRequests.length + activeChallenges.length;

  // ── Sfide Personali ───────────────────────────────────────────────────────
  const now = new Date();
  const currentLogs = storage.getLogs() || [];
  
  // Inizio mese corrente
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  // Obiettivo Settimanale (Lunedì come inizio settimana)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Lunedì, 6=Domenica
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
  
  let workoutsThisWeek = 0;
  currentLogs.forEach(l => {
    const d = parseLogDate(l);
    if (d && d >= startOfWeek) workoutsThisWeek++;
  });

  // Volume mese corrente
  let monthVolume = 0;
  currentLogs.forEach(l => {
    const d = parseLogDate(l);
    if (d && d >= startOfMonth) {
      l.exercises?.forEach(ex => ex.sets?.forEach(s => {
        monthVolume += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
      }));
    }
  });
  const monthTarget = Math.max(15000, Math.ceil((monthVolume + 1) / 10000) * 10000);

  // PR Hunt: esercizio con il PR più recente
  const exercisePRs = {};
  currentLogs.forEach(l => {
    l.exercises?.forEach(ex => {
      if (!ex.name) return;
      ex.sets?.forEach(s => {
        const rm = calc1RM(parseFloat(s.weight) || 0, parseInt(s.reps) || 1);
        if (!exercisePRs[ex.name] || rm > exercisePRs[ex.name]) exercisePRs[ex.name] = rm;
      });
    });
  });
  const prEntries = Object.entries(exercisePRs).sort((a, b) => b[1] - a[1]);
  const topPR = prEntries[0] || ['Nessun esercizio', 0];

  // Consistenza: settimane con ≥3 WO nelle ultime 4 settimane
  let consistenzaWeeks = 0;
  for (let w = 0; w < 4; w++) {
    const wStart = new Date(now); wStart.setDate(now.getDate() - (w + 1) * 7); wStart.setHours(0, 0, 0, 0);
    const wEnd = new Date(now); wEnd.setDate(now.getDate() - w * 7); wEnd.setHours(23, 59, 59, 999);
    const count = currentLogs.filter(l => {
      const d = parseLogDate(l);
      return d && d >= wStart && d <= wEnd;
    }).length;
    if (count >= 3) consistenzaWeeks++;
  }

  const progressBar = (value, max, color='var(--accent-color)') => {
    const pct = Math.min(100, Math.round((value / Math.max(max,1)) * 100));
    return `<div style="background:#222;border-radius:999px;height:8px;overflow:hidden;margin-top:8px">
      <div style="height:100%;width:${pct}%;background:${color};border-radius:999px;transition:width 0.6s"></div>
    </div><span style="font-size:0.72rem;color:var(--text-secondary)">${pct}%</span>`;
  };

  // Se l'utente ha cambiato scheda (es. tornato su Home) mentre Firestore caricava, interrompi il render
  if (currentView !== 'sfide' || renderToken !== sfideRenderSeq) return;

  // ── Render HTML ────────────────────────────────────────────────────────────
  mainContent.innerHTML = `
    <div style="padding:0 0 100px">

      <!-- Tab Bar -->
      <div id="sfide-tabs" style="display:flex;gap:0;border-bottom:2px solid #222;margin-bottom:1.5rem;position:sticky;top:0;background:var(--bg-color);z-index:10;padding-top:8px">
        <button class="sfide-tab active" data-tab="amici" style="flex:1;padding:12px 4px;background:none;border:none;color:var(--text-secondary);font-weight:700;font-size:0.82rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.2s">
          👥 Amici ${pendingRequests.length > 0 ? `<span style="background:red;color:#fff;border-radius:999px;padding:1px 6px;font-size:0.65rem;margin-left:4px">${pendingRequests.length}</span>` : ''}
        </button>
        <button class="sfide-tab" data-tab="sfide" style="flex:1;padding:12px 4px;background:none;border:none;color:var(--text-secondary);font-weight:700;font-size:0.82rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.2s">
          🏆 Sfide ${activeChallenges.length > 0 ? `<span style="background:red;color:#fff;border-radius:999px;padding:1px 6px;font-size:0.65rem;margin-left:4px">${activeChallenges.length}</span>` : ''}
        </button>
        <button class="sfide-tab" data-tab="classifica" style="flex:1;padding:12px 4px;background:none;border:none;color:var(--text-secondary);font-weight:700;font-size:0.82rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.2s">
          🌍 Classifica
        </button>
      </div>

      <!-- ═══ TAB AMICI ═══ -->
      <div id="tab-amici" class="sfide-tab-content" style="padding:0 1rem">

        <!-- Ricerca -->
        <div class="card" style="margin-bottom:1.2rem">
          <h3 style="margin-bottom:12px;font-size:1rem">🔍 Cerca atleta</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <input id="friend-search-input" type="text" placeholder="Nome o email..." style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid #333;background:#111;color:#fff;font-size:0.9rem">
            <button id="friend-search-btn" class="btn btn-primary" style="width:100%;padding:10px 16px;font-size:0.9rem">Cerca</button>
          </div>
          <div id="friend-search-results" style="margin-top:10px"></div>
        </div>

        <!-- Richieste ricevute -->
        ${pendingRequests.length > 0 ? `
        <div class="card" style="margin-bottom:1.2rem;border-left:3px solid var(--accent-color)">
          <h3 style="margin-bottom:12px;font-size:1rem">📥 Richieste ricevute</h3>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
            ${pendingRequests.map(r => `
              <li style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:600">💪 ${r.fromName || 'Atleta'}</span>
                <div style="display:flex;gap:8px">
                  <button class="btn" data-accept-req="${r.id}" data-from="${r.from}" data-fromname="${r.fromName||'Atleta'}" style="background:var(--accent-color);color:#000;font-size:0.8rem;padding:6px 12px">✓ Accetta</button>
                  <button class="btn" data-reject-req="${r.id}" style="background:#333;font-size:0.8rem;padding:6px 12px">✗</button>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>` : ''}

        <!-- Lista amici -->
        <div class="card">
          <h3 style="margin-bottom:12px;font-size:1rem">👥 I miei amici (${friendsList.length})</h3>
          ${friendsList.length === 0
            ? `<p style="color:var(--text-secondary);text-align:center;padding:1rem">Nessun amico ancora. Cerca un atleta e invia una richiesta!</p>`
            : `<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
                ${friendsList.map(f => `
                  <li style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid #222">
                    <span style="font-weight:600">💪 ${f.name || 'Atleta'}</span>
                    <div style="display:flex;gap:8px">
                      <button class="btn" data-compare-friend="${f.id}" data-compare-name="${f.name||'Amico'}" style="font-size:0.78rem;padding:6px 10px">📊 Confronta</button>
                      <button class="btn" data-challenge-friend="${f.id}" data-challenge-name="${f.name||'Amico'}" style="font-size:0.78rem;padding:6px 10px;background:#1a1a2e;border:1px solid var(--accent-color);color:var(--accent-color)">⚔️ Sfida</button>
                      <button class="btn" data-remove-friend="${f.id}" style="font-size:0.78rem;padding:6px 10px;background:#1a0000;color:#f55">✕</button>
                    </div>
                  </li>
                `).join('')}
              </ul>`
          }
        </div>
      </div>

      <!-- ═══ TAB SFIDE ═══ -->
      <div id="tab-sfide" class="sfide-tab-content" style="padding:0 1rem;display:none">

        <!-- Sfide ricevute da amici -->
        ${activeChallenges.length > 0 ? `
        <div class="card" style="margin-bottom:1.2rem;border-left:3px solid #ff6b35">
          <h3 style="margin-bottom:12px;font-size:1rem">⚔️ Sfide ricevute</h3>
          ${activeChallenges.map(c => {
            const metricLabel = c.metric === 'volume' ? 'Volume totale' : c.metric === 'workouts' ? 'N° allenamenti' : `PR: ${c.exercise}`;
            const end = new Date(c.endDate);
            const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
            return `
            <div style="padding:12px;background:#1a1a1a;border-radius:10px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-weight:700">⚔️ ${c.fromName} ti sfida</span>
                <span style="font-size:0.72rem;color:var(--text-secondary)">${daysLeft}gg rimasti</span>
              </div>
              <p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 10px">Metrica: <b>${metricLabel}</b> · Durata: ${c.durationDays} giorni</p>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary" data-accept-challenge="${c.id}" data-challenge-from="${c.from}" style="flex:1;font-size:0.8rem">✓ Accetta sfida</button>
                <button class="btn" data-decline-challenge="${c.id}" style="font-size:0.8rem;background:#333">✗ Rifiuta</button>
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}

        <!-- Sfide Personali -->
        <h3 style="font-size:1rem;margin-bottom:12px;padding:0 0">🎯 Le tue sfide personali</h3>

        <div style="display:flex;flex-direction:column;gap:12px">
          <!-- Obiettivo Settimanale -->
          <div class="card" style="border-left:3px solid #ff6b35">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;margin-bottom:4px">🔥 Obiettivo Settimanale</div>
                <div style="color:var(--text-secondary);font-size:0.82rem">Allenamenti completati</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.8rem;font-weight:900;color:${workoutsThisWeek >= 3 ? 'var(--accent-color)' : '#fff'}">${workoutsThisWeek}</div>
                <div style="font-size:0.72rem;color:var(--text-secondary)">/ 3 obiettivo</div>
              </div>
            </div>
            ${workoutsThisWeek >= 3 
              ? `<div style="margin-top:10px;font-size:0.8rem;color:var(--accent-color);font-weight:bold;">Obiettivo raggiunto! 🎉</div>` 
              : progressBar(workoutsThisWeek, 3, '#ff6b35')
            }
          </div>

          <!-- Volume mensile -->
          <div class="card" style="border-left:3px solid var(--accent-color)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;margin-bottom:4px">📦 Volume questo mese</div>
                <div style="color:var(--text-secondary);font-size:0.82rem">${(monthVolume/1000).toFixed(1)}k kg su ${(monthTarget/1000).toFixed(0)}k kg</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.4rem;font-weight:900;color:var(--accent-color)">${Math.round(monthVolume/1000)}k</div>
                <div style="font-size:0.72rem;color:var(--text-secondary)">kg totali</div>
              </div>
            </div>
            ${progressBar(monthVolume, monthTarget)}
          </div>

          <!-- PR Hunt -->
          <div class="card" style="border-left:3px solid #ffd700">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;margin-bottom:4px">💪 PR Hunt</div>
                <div style="color:var(--text-secondary);font-size:0.82rem">${topPR[0]} — Record attuale</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.4rem;font-weight:900;color:#ffd700">${topPR[1]} kg</div>
                <div style="font-size:0.72rem;color:var(--text-secondary)">1RM stimato</div>
              </div>
            </div>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin:8px 0 0">Obiettivo: supera <b>${Math.round(topPR[1] * 1.05)} kg</b> (+5%) 🎯</p>
          </div>

          <!-- Consistenza -->
          <div class="card" style="border-left:3px solid #a78bfa">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;margin-bottom:4px">🗓️ Consistenza</div>
                <div style="color:var(--text-secondary);font-size:0.82rem">≥ 3 WO/sett. × 4 settimane</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.8rem;font-weight:900;color:#a78bfa">${consistenzaWeeks}/4</div>
                <div style="font-size:0.72rem;color:var(--text-secondary)">settimane</div>
              </div>
            </div>
            ${progressBar(consistenzaWeeks, 4, '#a78bfa')}
          </div>
        </div>
      </div>

      <!-- ═══ TAB CLASSIFICA ═══ -->
      <div id="tab-classifica" class="sfide-tab-content" style="padding:0 1rem;display:none">
        <div style="display:flex;gap:8px;margin-bottom:1rem">
          <button id="lb-filter-global" class="btn btn-primary" style="flex:1;font-size:0.82rem">🌍 Globale</button>
          <button id="lb-filter-friends" class="btn" style="flex:1;font-size:0.82rem;background:#1a1a2e;border:1px solid #333">👥 Solo amici</button>
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h3 style="margin-bottom:1rem;display:flex;align-items:center;gap:8px;font-size:1rem">⚡ Volume Totale</h3>
          <ul id="leaderboard-volume" style="list-style:none;padding:0">
            <li style="text-align:center;color:var(--text-secondary);padding:1rem">Caricamento...</li>
          </ul>
        </div>

        <div class="card">
          <h3 style="margin-bottom:1rem;display:flex;align-items:center;gap:8px;font-size:1rem">🕐 Allenamenti Completati</h3>
          <ul id="leaderboard-workouts" style="list-style:none;padding:0">
            <li style="text-align:center;color:var(--text-secondary);padding:1rem">Caricamento...</li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Modal confronto esercizio -->
    <div id="compare-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;padding:20px">
      <div class="card" style="width:100%;max-width:500px;max-height:80vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="margin:0" id="compare-modal-title">Confronto esercizio</h3>
          <button id="compare-modal-close" style="background:none;border:none;color:var(--accent-color);font-weight:800;font-size:1.1rem;cursor:pointer">✕</button>
        </div>
        <div id="compare-modal-body"></div>
      </div>
    </div>

    <!-- Modal sfida amico -->
    <div id="challenge-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;padding:20px">
      <div class="card" style="width:100%;max-width:420px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="margin:0" id="challenge-modal-title">⚔️ Sfida</h3>
          <button id="challenge-modal-close" style="background:none;border:none;color:var(--accent-color);font-weight:800;font-size:1.1rem;cursor:pointer">✕</button>
        </div>
        <div id="challenge-modal-body">
          <p style="color:var(--text-secondary);margin-bottom:16px">Scegli il tipo di sfida e la durata. Vince chi ha il valore più alto al termine!</p>
          <label style="display:block;margin-bottom:8px;font-weight:600">Tipo di sfida</label>
          <select id="challenge-metric" style="width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;margin-bottom:12px">
            <option value="volume">⚡ Chi solleva più kg totali</option>
            <option value="workouts">🕐 Chi fa più allenamenti</option>
          </select>
          <label style="display:block;margin-bottom:8px;font-weight:600">Durata</label>
          <div style="display:flex;gap:8px;margin-bottom:16px">
            <button class="btn challenge-dur-btn active" data-days="7" style="flex:1;font-size:0.82rem">7 giorni</button>
            <button class="btn challenge-dur-btn" data-days="14" style="flex:1;font-size:0.82rem;background:#222">14 giorni</button>
            <button class="btn challenge-dur-btn" data-days="30" style="flex:1;font-size:0.82rem;background:#222">30 giorni</button>
          </div>
          <button id="challenge-send-btn" class="btn btn-primary" style="width:100%">⚔️ Invia sfida</button>
        </div>
      </div>
    </div>
  `;

  // ── Tab switching ──────────────────────────────────────────────────────────
  const tabs = mainContent.querySelectorAll('.sfide-tab');
  const tabContents = mainContent.querySelectorAll('.sfide-tab-content');
  const switchTab = (tabName) => {
    tabs.forEach(t => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle('active', active);
      t.style.color = active ? 'var(--accent-color)' : 'var(--text-secondary)';
      t.style.borderBottomColor = active ? 'var(--accent-color)' : 'transparent';
    });
    tabContents.forEach(c => c.style.display = c.id === `tab-${tabName}` ? 'block' : 'none');
    if (tabName === 'classifica') loadLeaderboard('global');
  };
  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  switchTab('amici');

  // ── Ricerca utenti ─────────────────────────────────────────────────────────
  const searchBtn = mainContent.querySelector('#friend-search-btn');
  const searchInput = mainContent.querySelector('#friend-search-input');
  const searchResults = mainContent.querySelector('#friend-search-results');

  const doSearch = async () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q || q.length < 2) return;
    searchResults.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem">Ricerca...</p>';
    try {
      // Cerca per nome (prefisso)
      const byName = await _getDocs(_q(_col(_db, 'users'),
        where('displayName', '>=', q), where('displayName', '<=', q + '\uf8ff'), _lim(10)));
      // Cerca per email esatta
      const byEmail = await _getDocs(_q(_col(_db, 'users'), where('email', '==', q), _lim(5)));

      const found = new Map();
      [...byName.docs, ...byEmail.docs].forEach(d => {
        if (d.id !== uid) found.set(d.id, { id: d.id, ...d.data() });
      });

      if (found.size === 0) {
        searchResults.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:8px">Nessun atleta trovato.</p>';
        return;
      }

      const friendIds = friendsList.map(f => f.id);
      searchResults.innerHTML = [...found.values()].map(u => {
        const isFriend = friendIds.includes(u.id);
        const sentReq = sentRequests.includes(u.id);
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #222">
            <div>
              <div style="font-weight:600">${u.userSettings?.name || u.displayName || 'Atleta'}</div>
              <div style="font-size:0.72rem;color:var(--text-secondary)">${u.stats?.totalWorkouts || 0} WO · ${Math.round((u.stats?.totalVolume||0)/1000)}k kg</div>
            </div>
            ${isFriend
              ? `<span style="color:var(--accent-color);font-size:0.8rem">✓ Amico</span>`
              : sentReq
              ? `<span style="color:var(--text-secondary);font-size:0.8rem">Richiesta inviata</span>`
              : `<button class="btn btn-primary" data-add-friend="${u.id}" data-add-name="${u.userSettings?.name||u.displayName||'Atleta'}" style="font-size:0.8rem;padding:6px 12px">+ Aggiungi</button>`
            }
          </div>`;
      }).join('');
    } catch(e) {
      searchResults.innerHTML = '<p style="color:red;font-size:0.85rem">Errore nella ricerca.</p>';
      console.error(e);
    }
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  // ── Event delegation: azioni amici e sfide ─────────────────────────────────
  let challengeTargetId = null, challengeTargetName = null;

  mainContent.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-add-friend],[data-accept-req],[data-reject-req],[data-remove-friend],[data-compare-friend],[data-challenge-friend],[data-accept-challenge],[data-decline-challenge]');
    if (!btn || !uid) return;

    // ── Aggiungi amico ──
    if (btn.dataset.addFriend) {
      const toId = btn.dataset.addFriend, toName = btn.dataset.addName;
      btn.disabled = true; btn.textContent = '…';
      await addDoc(_col(_db, 'friendRequests'), {
        from: uid, fromName: user?.name || currentUser?.displayName || 'Atleta',
        to: toId, status: 'pending', createdAt: new Date().toISOString()
      });
      btn.textContent = 'Richiesta inviata ✓';
      btn.style.background = '#333'; btn.style.color = 'var(--text-secondary)';
    }

    // ── Accetta richiesta ──
    if (btn.dataset.acceptReq) {
      const reqId = btn.dataset.acceptReq, fromId = btn.dataset.from, fromName = btn.dataset.fromname;
      btn.disabled = true;
      await _setDoc(_doc(_db, 'friends', uid, 'list', fromId), { name: fromName, addedAt: new Date().toISOString() });
      await _setDoc(_doc(_db, 'friends', fromId, 'list', uid), { name: user?.name || currentUser?.displayName || 'Atleta', addedAt: new Date().toISOString() });
      await updateDoc(_doc(_db, 'friendRequests', reqId), { status: 'accepted' });
      btn.closest('li')?.remove();
      alert(`✅ Ora sei amico con ${fromName}!`);
    }

    // ── Rifiuta richiesta ──
    if (btn.dataset.rejectReq) {
      await updateDoc(_doc(_db, 'friendRequests', btn.dataset.rejectReq), { status: 'rejected' });
      btn.closest('li')?.remove();
    }

    // ── Rimuovi amico ──
    if (btn.dataset.removeFriend) {
      if (!confirm('Rimuovere questo amico?')) return;
      const fId = btn.dataset.removeFriend;
      await deleteDoc(_doc(_db, 'friends', uid, 'list', fId));
      await deleteDoc(_doc(_db, 'friends', fId, 'list', uid));
      btn.closest('li')?.remove();
    }

    // ── Confronta esercizio ──
    if (btn.dataset.compareFriend) {
      const friendId = btn.dataset.compareFriend, friendName = btn.dataset.compareName;
      const modal = mainContent.querySelector('#compare-modal');
      const modalBody = mainContent.querySelector('#compare-modal-body');
      const modalTitle = mainContent.querySelector('#compare-modal-title');
      modalTitle.textContent = `📊 Tu vs ${friendName}`;
      modalBody.innerHTML = '<p style="color:var(--text-secondary)">Caricamento...</p>';
      modal.style.display = 'flex';

      try {
        const friendDoc = await getDoc(_doc(_db, 'users', friendId));
        if (!friendDoc.exists()) { modalBody.innerHTML = '<p style="color:red">Utente non trovato.</p>'; return; }
        const friendData = friendDoc.data();
        if (friendData.privacy?.showProgressToFriends === false) {
          modalBody.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem">🔒 Questo atleta ha impostato i progressi come privati.</p>';
          return;
        }

        // Estrai esercizi comuni
        const myExercises = {};
        logs?.forEach(l => l.exercises?.forEach(ex => {
          ex.sets?.forEach(s => {
            const rm = calc1RM(parseFloat(s.weight)||0, parseInt(s.reps)||1);
            if (!myExercises[ex.name] || rm > myExercises[ex.name]) myExercises[ex.name] = rm;
          });
        }));
        const friendExercises = {};
        friendData.logs?.forEach(l => l.exercises?.forEach(ex => {
          ex.sets?.forEach(s => {
            const rm = calc1RM(parseFloat(s.weight)||0, parseInt(s.reps)||1);
            if (!friendExercises[ex.name] || rm > friendExercises[ex.name]) friendExercises[ex.name] = rm;
          });
        }));

        const common = Object.keys(myExercises).filter(k => friendExercises[k]);
        if (common.length === 0) {
          modalBody.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem">Nessun esercizio in comune trovato.</p>';
          return;
        }

        const rows = common.slice(0, 10).map(ex => {
          const myVal = myExercises[ex], fVal = friendExercises[ex];
          const iWin = myVal >= fVal;
          const myPct = Math.round((myVal / Math.max(myVal,fVal)) * 100);
          const fPct = Math.round((fVal / Math.max(myVal,fVal)) * 100);
          return `
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px">
                <span style="font-weight:700">${ex}</span>
                <span style="color:${iWin?'var(--accent-color)':'var(--text-secondary)'}">${iWin?'Tu vinci 🏆':friendName+' vince'}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="font-size:0.75rem;color:var(--accent-color);width:24px">Tu</span>
                <div style="flex:1;height:10px;background:#222;border-radius:999px;overflow:hidden">
                  <div style="height:100%;width:${myPct}%;background:var(--accent-color);border-radius:999px"></div>
                </div>
                <span style="font-size:0.8rem;font-weight:700;width:60px;text-align:right">${myVal} kg</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:0.75rem;color:#a78bfa;width:24px">${friendName.split(' ')[0]}</span>
                <div style="flex:1;height:10px;background:#222;border-radius:999px;overflow:hidden">
                  <div style="height:100%;width:${fPct}%;background:#a78bfa;border-radius:999px"></div>
                </div>
                <span style="font-size:0.8rem;font-weight:700;width:60px;text-align:right">${fVal} kg</span>
              </div>
            </div>`;
        }).join('');

        modalBody.innerHTML = `
          <p style="color:var(--text-secondary);font-size:0.8rem;margin-bottom:16px">Confronto 1RM stimato (formula Epley) — ${common.length} esercizi in comune</p>
          ${rows}`;
      } catch(err) {
        modalBody.innerHTML = `<p style="color:red">Errore: ${err.message}</p>`;
      }
    }

    // ── Sfida amico — apri modal ──
    if (btn.dataset.challengeFriend) {
      challengeTargetId = btn.dataset.challengeFriend;
      challengeTargetName = btn.dataset.challengeName;
      mainContent.querySelector('#challenge-modal-title').textContent = `⚔️ Sfida ${challengeTargetName}`;
      mainContent.querySelector('#challenge-modal').style.display = 'flex';
    }

    // ── Accetta sfida ──
    if (btn.dataset.acceptChallenge) {
      const cId = btn.dataset.acceptChallenge;
      await updateDoc(_doc(_db, 'challenges', cId), { status: 'active', startDate: new Date().toISOString() });
      btn.closest('[style*="background:#1a1a1a"]')?.remove();
      alert('✅ Sfida accettata! Che vinca il migliore 💪');
    }

    // ── Rifiuta sfida ──
    if (btn.dataset.declineChallenge) {
      await updateDoc(_doc(_db, 'challenges', btn.dataset.declineChallenge), { status: 'rejected' });
      btn.closest('[style*="background:#1a1a1a"]')?.remove();
    }
  });

  // ── Chiudi modali ──────────────────────────────────────────────────────────
  mainContent.querySelector('#compare-modal-close')?.addEventListener('click', () => {
    mainContent.querySelector('#compare-modal').style.display = 'none';
  });
  mainContent.querySelector('#challenge-modal-close')?.addEventListener('click', () => {
    mainContent.querySelector('#challenge-modal').style.display = 'none';
  });

  // ── Durata sfida selector ──────────────────────────────────────────────────
  let selectedDays = 7;
  mainContent.querySelectorAll('.challenge-dur-btn').forEach(b => {
    b.addEventListener('click', () => {
      selectedDays = parseInt(b.dataset.days);
      mainContent.querySelectorAll('.challenge-dur-btn').forEach(x => {
        x.style.background = x === b ? 'var(--accent-color)' : '#222';
        x.style.color = x === b ? '#000' : '#fff';
      });
    });
  });

  // ── Invia sfida ───────────────────────────────────────────────────────────
  mainContent.querySelector('#challenge-send-btn')?.addEventListener('click', async () => {
    if (!challengeTargetId) return;
    const metric = mainContent.querySelector('#challenge-metric').value;
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + selectedDays * 86400000).toISOString();
    await addDoc(_col(_db, 'challenges'), {
      from: uid, fromName: user?.name || currentUser?.displayName || 'Atleta',
      to: challengeTargetId,
      metric, durationDays: selectedDays,
      startDate, endDate, status: 'pending',
      createdAt: new Date().toISOString()
    });
    mainContent.querySelector('#challenge-modal').style.display = 'none';
    alert(`✅ Sfida inviata a ${challengeTargetName}!`);
  });

  // ── Leaderboard ───────────────────────────────────────────────────────────
  const renderLeaderboardItem = (rank, name, value, suffix, isMe) => `
    <li style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #1a1a1a;align-items:center;background:${isMe?'rgba(200,255,0,0.06)':'transparent'}">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-weight:900;color:${rank<=3?'var(--accent-color)':'var(--text-secondary)'};width:24px;font-size:${rank<=3?'1rem':'0.85rem'}">${rank<=3?['🥇','🥈','🥉'][rank-1]:'#'+rank}</span>
        <span style="font-weight:${isMe?'800':'400'}">${name}${isMe?' (tu)':''}</span>
      </div>
      <span style="font-weight:700;color:${isMe?'var(--accent-color)':'#fff'}">${value} ${suffix}</span>
    </li>`;

  const loadLeaderboard = async (filter = 'global') => {
    const listVol = mainContent.querySelector('#leaderboard-volume');
    const listWO = mainContent.querySelector('#leaderboard-workouts');
    if (!listVol || !listWO) return;
    listVol.innerHTML = listWO.innerHTML = '<li style="text-align:center;color:var(--text-secondary);padding:1rem">Caricamento...</li>';
    try {
      let uidsToShow = null;
      if (filter === 'friends') {
        uidsToShow = [uid, ...friendsList.map(f => f.id)];
      }

      const qVol = _q(_col(_db, 'users'), _ord('stats.totalVolume', 'desc'), _lim(20));
      const qWO = _q(_col(_db, 'users'), _ord('stats.totalWorkouts', 'desc'), _lim(20));
      const [snapVol, snapWO] = await Promise.all([_getDocs(qVol), _getDocs(qWO)]);

      const renderList = (snap, field, suffix, listEl) => {
        let rank = 1; listEl.innerHTML = '';
        snap.docs.forEach(d => {
          if (uidsToShow && !uidsToShow.includes(d.id)) return;
          const data = d.data();
          if (data.privacy?.showStatsPublic === false && d.id !== uid) return;
          const name = data.userSettings?.name || 'Atleta Anonimo';
          const val = field === 'totalVolume'
            ? Math.round((data.stats?.totalVolume||0)/1000) + 'k'
            : (data.stats?.totalWorkouts||0);
          const sfx = field === 'totalVolume' ? 'kg' : 'WO';
          listEl.innerHTML += renderLeaderboardItem(rank++, name, val, sfx, d.id === uid);
        });
        if (listEl.innerHTML === '') listEl.innerHTML = '<li style="padding:1rem;text-align:center;color:var(--text-secondary)">Nessun dato.</li>';
      };

      renderList(snapVol, 'totalVolume', 'kg', listVol);
      renderList(snapWO, 'totalWorkouts', 'WO', listWO);
    } catch(e) {
      console.error('Leaderboard error:', e);
      if (listVol) listVol.innerHTML = '<li style="padding:1rem;text-align:center;color:var(--text-secondary)">Caricamento classifica non disponibile.</li>';
    }
  };

  mainContent.querySelector('#lb-filter-global')?.addEventListener('click', (e) => {
    e.target.classList.add('btn-primary'); 
    e.target.style.background = '';
    e.target.style.color = '';
    
    const friendsBtn = mainContent.querySelector('#lb-filter-friends');
    if (friendsBtn) {
      friendsBtn.classList.remove('btn-primary');
      friendsBtn.style.background = '#1a1a2e';
      friendsBtn.style.color = '#fff';
    }
    loadLeaderboard('global');
  });
  mainContent.querySelector('#lb-filter-friends')?.addEventListener('click', (e) => {
    e.target.style.background = 'var(--accent-color)'; 
    e.target.style.color = '#000';
    
    const globalBtn = mainContent.querySelector('#lb-filter-global');
    if (globalBtn) {
      globalBtn.classList.remove('btn-primary');
      globalBtn.style.background = '#1a1a2e';
      globalBtn.style.color = '#fff';
    }
    loadLeaderboard('friends');
  });
};


const switchView = (view) => {
  // Se l'utente non è ancora autenticato, non instradare le viste (login-screen è visibile)
  if (!currentUser) return;

  currentView = view;
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.style.display = 'flex';

  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === view);
  });

  const isNewUser = !user || !user.gender || !user.nickname;
  const isGuideDismissed = isNewUser
    ? (sessionStorage.getItem('pwa-guide-dismissed-session') || (currentUser && localStorage.getItem(`pwa-guide-dismissed-${currentUser.uid}`)))
    : (localStorage.getItem('pwa-guide-dismissed') || sessionStorage.getItem('pwa-guide-dismissed-session'));

  // Se non è ancora installata sulla schermata Home, mostra la guida per l'installazione
  if (!isStandalone() && !isGuideDismissed && (view === 'dashboard' || isNewUser)) {
    renderInstallGuide('dashboard');
    return;
  }

  if (isNewUser && view !== 'onboarding') {
    renderOnboarding();
    return;
  }

  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'routines': renderRoutines(); break;
    case 'history': renderHistory(); break;
    case 'progress': renderProgress(); break;
    case 'sfide': renderSfide(); break;
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

// Listener globale per apertura modale guida esercizio (omino stilizzato + YouTube)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-ex-info');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    const exName = btn.dataset.exercise;
    if (exName) {
      openExerciseGuideModal(exName);
    }
  }
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
    if (muscle === 'Petto' || muscle === 'Dorsali' || muscle === 'Quadricipiti' || muscle === 'Femorali' || muscle === 'Glutei' || muscle === 'Lombari') {
      step = 2.5;
    } else {
      step = 1;
    }
  } else {
    step = parseFloat(rawStep) || 1;
  }
  
  return { type, step, repsThresh, mode };
};

const calculateMuscleRecovery = () => {
  const logs = storage.getLogs();
  const now = Date.now();
  
  // Inizializza i timestamp dell'ultimo allenamento per ciascun gruppo muscolare
  const lastTrained = {
    "Petto": 0, "Dorsali": 0, "Trapezi": 0, "Lombari": 0,
    "Quadricipiti": 0, "Femorali": 0, "Glutei": 0, "Polpacci": 0,
    "Spalle": 0, "Bicipiti": 0, "Tricipiti": 0, "Addome": 0, "Altro": 0
  };
  
  // Trova il timestamp del log più recente in cui è stato allenato ciascun muscolo
  logs.forEach(log => {
    if (log.exercises && log.timestamp) {
      log.exercises.forEach(ex => {
        const muscles = getExerciseMuscles(ex);
        muscles.forEach(muscle => {
          if (muscle && lastTrained[muscle] === 0) {
            lastTrained[muscle] = log.timestamp;
          }
        });
      });
    }
  });
  
  // Ore di recupero necessarie per ciascun gruppo muscolare
  const recoveryDurations = {
    "Petto": 48, "Dorsali": 48, "Trapezi": 36, "Lombari": 48,
    "Quadricipiti": 72, "Femorali": 72, "Glutei": 72, "Polpacci": 48,
    "Spalle": 48, "Bicipiti": 36, "Tricipiti": 36,
    "Addome": 24, "Altro": 24
  };
  
  const recoveryStates = {};
  
  for (const muscle of Object.keys(recoveryDurations)) {
    const lastTime = lastTrained[muscle];
    const durationMs = recoveryDurations[muscle] * 3600 * 1000;
    
    if (lastTime === 0) {
      // Mai allenato -> 100% fresco
      recoveryStates[muscle] = {
        percent: 100,
        hoursLeft: 0,
        lastTrainedStr: "Mai allenato",
        status: "fresh",
        color: "#00ff88" // Verde
      };
    } else {
      const elapsed = now - lastTime;
      if (elapsed >= durationMs) {
        recoveryStates[muscle] = {
          percent: 100,
          hoursLeft: 0,
          lastTrainedStr: new Date(lastTime).toLocaleDateString('it-IT') + " " + new Date(lastTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'}),
          status: "fresh",
          color: "#00ff88"
        };
      } else {
        const percent = Math.floor((elapsed / durationMs) * 100);
        const hoursLeft = Math.ceil((durationMs - elapsed) / (3600 * 1000));
        const lastTrainedStr = new Date(lastTime).toLocaleDateString('it-IT') + " " + new Date(lastTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
        
        let status = "recovering";
        let color = "#ffb300"; // Giallo (50-85%)
        
        if (percent < 50) {
          status = "sore";
          color = "#ff4d4d"; // Rosso (<50%)
        } else if (percent >= 86) {
          status = "fresh";
          color = "#00ff88"; // Verde (86-100%)
        }
        
        recoveryStates[muscle] = {
          percent: percent,
          hoursLeft: hoursLeft,
          lastTrainedStr: lastTrainedStr,
          status: status,
          color: color
        };
      }
    }
  }
  
  return recoveryStates;
};

// Start the app only if auth is already verified
if (currentUser) {
  switchView('dashboard');
}

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

// --- Pull to Refresh (Forza Aggiornamento in PWA) ---
let pStartY = 0;
let pCurrentY = 0;
const pThreshold = 120; // distanza in px per attivare il refresh

document.addEventListener('touchstart', e => {
  if (window.scrollY === 0) {
    pStartY = e.touches[0].clientY;
  } else {
    pStartY = 0;
  }
}, { passive: true });

document.addEventListener('touchmove', e => {
  if (!pStartY) return;
  pCurrentY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!pStartY || !pCurrentY) return;
  const dy = pCurrentY - pStartY;
  if (dy > pThreshold && window.scrollY === 0) {
    // Tenta di svuotare le cache di servizio prima di ricaricare
    if ('caches' in window) {
      caches.keys().then(keys => {
        Promise.all(keys.map(key => caches.delete(key))).then(() => {
          window.location.reload(true);
        });
      }).catch(() => window.location.reload(true));
    } else {
      window.location.reload(true);
    }
  }
  pStartY = 0;
  pCurrentY = 0;
});
