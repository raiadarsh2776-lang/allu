
import { User, ExamRecord } from '../types';

const DB_KEYS = {
  USER: 'neet_mastery_user',
  EXAMS: 'neet_mastery_exams',
  SETTINGS: 'neet_mastery_settings',
  THEME: 'neet_mastery_theme'
};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`LocalStorage access denied for key: ${key}`);
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`LocalStorage set failed for key: ${key}`);
  }
};

const safeRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`LocalStorage remove failed for key: ${key}`);
  }
};

export const DB = {
  // User Management
  saveUser: (user: User) => {
    safeSetItem(DB_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const data = safeGetItem(DB_KEYS.USER);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    safeRemoveItem(DB_KEYS.USER);
  },

  // Theme Management
  setTheme: (isDark: boolean) => {
    safeSetItem(DB_KEYS.THEME, isDark ? 'dark' : 'light');
  },

  getTheme: (): boolean => {
    return safeGetItem(DB_KEYS.THEME) === 'dark';
  },

  // Exam Records
  saveExamResult: (record: ExamRecord) => {
    const existing = DB.getExamResults();
    existing.push(record);
    safeSetItem(DB_KEYS.EXAMS, JSON.stringify(existing));
  },

  getExamResults: (): ExamRecord[] => {
    const data = safeGetItem(DB_KEYS.EXAMS);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getChapterBestScore: (chapterId: string): number => {
    const results = DB.getExamResults();
    const chapterResults = results.filter(r => r.chapterId === chapterId);
    if (chapterResults.length === 0) return 0;
    return Math.max(...chapterResults.map(r => r.score));
  }
};
