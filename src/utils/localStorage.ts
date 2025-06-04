import { UserPreferences, User, ProcessingOptions } from '../types';

// Claves para localStorage
const KEYS = {
  AUTH_USER: 'excelcleaner_auth_user',
  AUTH_TOKEN: 'excelcleaner_auth_token',
  USER_PREFERENCES: 'excelcleaner_user_preferences',
  RECENT_FILES: 'excelcleaner_recent_files'
};

// Valores por defecto
const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = {
  removeDuplicates: true,
  trimWhitespace: true,
  convertToLowercase: false,
  convertToUppercase: false,
  removeEmptyRows: true,
  formatNumbers: false,
  formatDates: false,
  customReplacements: []
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  defaultProcessingOptions: DEFAULT_PROCESSING_OPTIONS,
  recentFiles: []
};

// Funciones para autenticación
export const saveUser = (user: User, token: string): void => {
  localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
  localStorage.setItem(KEYS.AUTH_TOKEN, token);
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(KEYS.AUTH_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem(KEYS.AUTH_TOKEN);
};

export const removeAuth = (): void => {
  localStorage.removeItem(KEYS.AUTH_USER);
  localStorage.removeItem(KEYS.AUTH_TOKEN);
};

// Funciones para preferencias de usuario
export const savePreferences = (preferences: Partial<UserPreferences>): void => {
  const currentPrefs = getPreferences();
  const updatedPrefs = { ...currentPrefs, ...preferences };
  localStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
};

export const getPreferences = (): UserPreferences => {
  const prefsStr = localStorage.getItem(KEYS.USER_PREFERENCES);
  return prefsStr ? { ...DEFAULT_PREFERENCES, ...JSON.parse(prefsStr) } : DEFAULT_PREFERENCES;
};

// Funciones para archivos recientes
export const addRecentFile = (fileName: string): void => {
  const prefs = getPreferences();
  const recentFiles = [fileName, ...prefs.recentFiles.filter(f => f !== fileName)].slice(0, 5);
  savePreferences({ recentFiles });
};

export const getRecentFiles = (): string[] => {
  return getPreferences().recentFiles;
};