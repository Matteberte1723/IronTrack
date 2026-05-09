const STORAGE_KEYS = {
  ROUTINES: 'iron_track_routines',
  LOGS: 'iron_track_logs',
  USER_DATA: 'iron_track_user'
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
  clearAll: () => {
    localStorage.clear();
  }
};
