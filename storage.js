import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  ROUTINES: 'iron_track_routines',
  LOGS: 'iron_track_logs',
  USER_DATA: 'iron_track_user',
  THEME: 'iron_track_theme',
  MEASUREMENTS: 'iron_track_measurements',
  PAUSED_WORKOUT: 'iron_track_paused_workout',
  ALARM_SOUND: 'iron_track_alarm_sound',
  ALARM_ENABLED: 'iron_track_alarm_enabled',
  ALARM_DURATION: 'iron_track_alarm_duration'
};

const syncToCloud = async (field, data) => {
  if (auth && auth.currentUser) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        [field]: data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Errore sync Firestore:", e);
    }
  }
};

export const storage = {
  saveRoutines: (routines) => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    syncToCloud('routines', routines);
  },
  getRoutines: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  },
  saveLog: (log) => {
    const logs = storage.getLogs();
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    syncToCloud('logs', logs);
    
    // Calcola statistiche globali per la leaderboard
    let totalVolume = 0;
    logs.forEach(l => {
      if (l.exercises) {
        l.exercises.forEach(ex => {
          if (ex.sets) {
            ex.sets.forEach(set => {
              const w = parseFloat(set.weight) || 0;
              const r = parseInt(set.reps) || 0;
              totalVolume += (w * r);
            });
          }
        });
      }
    });
    syncToCloud('stats', { totalVolume, totalWorkouts: logs.length });
  },
  getLogs: () => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    syncToCloud('userSettings', user);
  },
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  saveTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'default';
  },
  savePausedWorkout: (data) => {
    if (!data) localStorage.removeItem(STORAGE_KEYS.PAUSED_WORKOUT);
    else localStorage.setItem(STORAGE_KEYS.PAUSED_WORKOUT, JSON.stringify(data));
  },
  getPausedWorkout: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PAUSED_WORKOUT);
    return data ? JSON.parse(data) : null;
  },
  saveAlarmSound: (sound) => {
    localStorage.setItem(STORAGE_KEYS.ALARM_SOUND, sound);
  },
  getAlarmSound: () => {
    return localStorage.getItem(STORAGE_KEYS.ALARM_SOUND) || 'classic';
  },
  saveAlarmEnabled: (enabled) => {
    localStorage.setItem(STORAGE_KEYS.ALARM_ENABLED, JSON.stringify(enabled));
  },
  getAlarmEnabled: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ALARM_ENABLED);
    return data !== null ? JSON.parse(data) : true;
  },
  saveAlarmDuration: (seconds) => {
    localStorage.setItem(STORAGE_KEYS.ALARM_DURATION, JSON.stringify(seconds));
  },
  getAlarmDuration: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ALARM_DURATION);
    return data !== null ? JSON.parse(data) : 5;
  },
  clearAll: () => {
    localStorage.clear();
  },
  
  // === SISTEMA DI MIGRAZIONE / SYNC CLOUD ===
  syncAuthLogin: async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        const localLogs = storage.getLogs();
        const localRoutines = storage.getRoutines();
        const localUser = storage.getUser();
        
        const cloudIsEmpty = (!cloudData.logs || cloudData.logs.length === 0) && (!cloudData.routines || cloudData.routines.length === 0);
        const localHasData = (localLogs && localLogs.length > 0) || (localRoutines && localRoutines.length > 0);
        
        if (cloudIsEmpty && localHasData) {
          // Smart Migration: il cloud è vuoto ma il telefono ha dati. Carichiamo i dati del telefono sul cloud!
          let totalVolume = 0;
          localLogs.forEach(l => {
            if (l.exercises) {
              l.exercises.forEach(ex => {
                if (ex.sets) {
                  ex.sets.forEach(set => {
                    totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
                  });
                }
              });
            }
          });
          
          await setDoc(userRef, {
            routines: localRoutines,
            logs: localLogs,
            userSettings: localUser,
            stats: { totalVolume, totalWorkouts: localLogs.length },
            lastUpdated: new Date().toISOString()
          }, { merge: true });
          return false;
        }

        // Se il cloud ha dati reali, sovrascriviamo quelli locali
        if (cloudData.routines && cloudData.routines.length > 0) localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(cloudData.routines));
        if (cloudData.logs && cloudData.logs.length > 0) localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(cloudData.logs));
        if (cloudData.userSettings) localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(cloudData.userSettings));
        return true; // Dati scaricati dal cloud
      } else {
        // Nessun dato in cloud -> PRIMO ACCESSO: Migrazione dati locali verso Firebase
        const localRoutines = storage.getRoutines();
        const localLogs = storage.getLogs();
        const localUser = storage.getUser();
        // Calcola statistiche iniziali per la migrazione
        let totalVolume = 0;
        localLogs.forEach(l => {
          if (l.exercises) {
            l.exercises.forEach(ex => {
              if (ex.sets) {
                ex.sets.forEach(set => {
                  totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
                });
              }
            });
          }
        });

        await setDoc(userRef, {
          routines: localRoutines,
          logs: localLogs,
          userSettings: localUser,
          stats: { totalVolume, totalWorkouts: localLogs.length },
          createdAt: new Date().toISOString()
        });
        return false; // Migrazione eseguita
      }
    } catch(e) {
      console.error("Sync Auth Error:", e);
    }
  }
};
