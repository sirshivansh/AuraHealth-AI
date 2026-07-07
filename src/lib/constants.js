// App-wide constants — single source of truth

export const APP_NAME = 'AuraHealth AI';

// localStorage keys
export const STORAGE_KEYS = {
  THEME: 'aurahealth_theme',
  PROFILE: 'aurahealth_profile',
  WATER_LOG: 'aurahealth_water',
  SLEEP_LOG: 'aurahealth_sleep',
  BMI_LOG: 'aurahealth_bmi',
};

// API endpoints
export const API = {
  CHAT: '/api/chat',
  SYMPTOMS: '/api/analyze-symptoms',
  HEALTH: '/api/health',
};

// Default user profile template (for new signups)
export const DEFAULT_PROFILE = {
  name: '',
  age: '',
  gender: '',
  weight: '',
  height: '',
  waterTarget: 2500,
  sleepTarget: 8,
};
