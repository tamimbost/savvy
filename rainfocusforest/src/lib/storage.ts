export type StorageKey =
  | 'tasks_data'
  | 'prayer_times'
  | 'media_history'
  | 'reports_data'
  | 'habit_data'
  | 'timer_sessions'
  | 'user_profile'
  | 'settings_theme'
  | 'settings_language'
  | 'notifications_data'
  | 'dashboard_stats'
  | 'settings_accent'
  | 'isLoggedIn';

export function readLS<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLS<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

