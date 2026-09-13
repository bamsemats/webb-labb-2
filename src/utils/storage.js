import { INITIAL_DEMO_TASKS } from '../data/defaultTasks.js';
import { getCurrentISOWeek, getWeekDays } from './dateUtils.js';

const STORAGE_KEYS = {
  SETTINGS: 'hemplan_settings',
  TASKS: 'hemplan_tasks',
  HISTORY: 'hemplan_history',
  USER: 'hemplan_user'
};

export const DEFAULT_SETTINGS = {
  name: 'Anna',
  weekStartsOn: 'monday',
  timeFormat: '24h',
  viewMode: 'standard',
  showCompleted: true,
  defaultCategory: 'Städning'
};

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  const currentWeek = getCurrentISOWeek();
  const weekDays = getWeekDays(currentWeek.year, currentWeek.weekNum);

  return tasks.map(task => {
    let completedDates = Array.isArray(task.completedDates) ? [...task.completedDates] : [];
    if (completedDates.length === 0 && task.completed) {
      const dayObj = weekDays.find(d => d.id === task.day);
      if (dayObj && dayObj.date) {
        completedDates.push(dayObj.date);
      }
    }

    return {
      ...task,
      completedDates
    };
  });
}

export function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function loadTasks(userId = 'u-1') {
  try {
    const key = `${STORAGE_KEYS.TASKS}_${userId}`;
    const saved = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.TASKS);
    let taskList;
    if (!saved) {
      taskList = INITIAL_DEMO_TASKS;
    } else {
      taskList = JSON.parse(saved);
    }
    const normalized = normalizeTasks(taskList);
    saveTasks(normalized, userId);
    return normalized;
  } catch (e) {
    return normalizeTasks(INITIAL_DEMO_TASKS);
  }
}

export function saveTasks(tasks, userId = 'u-1') {
  try {
    const key = `${STORAGE_KEYS.TASKS}_${userId}`;
    localStorage.setItem(key, JSON.stringify(tasks));
    // Also update base key for legacy fallback
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

export function loadHistory(userId = 'u-1') {
  try {
    const key = `${STORAGE_KEYS.HISTORY}_${userId}`;
    const saved = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'hist-1',
        taskName: 'Dammsuga',
        category: 'Städning',
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        formattedDate: '13 september 2026 kl. 14:15'
      },
      {
        id: 'hist-2',
        taskName: 'Tvätta kläder',
        category: 'Tvätt',
        completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        formattedDate: '12 september 2026 kl. 18:30'
      }
    ];
  } catch (e) {
    return [];
  }
}

export function saveHistory(history, userId = 'u-1') {
  try {
    const key = `${STORAGE_KEYS.HISTORY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(history));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : { id: 'u-1', name: 'Anna', email: 'anna@example.com', isLoggedIn: true };
  } catch (e) {
    return { id: 'u-1', name: 'Anna', email: 'anna@example.com', isLoggedIn: true };
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user:', e);
  }
}

export function resetAllData() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('hemplan_')) {
      localStorage.removeItem(key);
    }
  });
}
