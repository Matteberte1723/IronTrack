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

export const storage = {
  saveRoutines: (routines) => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  },
  getRoutines: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  },
  saveLog: (log) => {
    const logs = storage.getLogs();
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },
  getLogs: () => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
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
    return data !== null ? JSON.parse(data) : true; // attivo di default
  },
  saveAlarmDuration: (seconds) => {
    localStorage.setItem(STORAGE_KEYS.ALARM_DURATION, JSON.stringify(seconds));
  },
  getAlarmDuration: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ALARM_DURATION);
    return data !== null ? JSON.parse(data) : 5; // 5 secondi di default
  },
  clearAll: () => {
    localStorage.clear();
  }
};
