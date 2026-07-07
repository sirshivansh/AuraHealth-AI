import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_PROFILE } from '../lib/constants';

const ThemeContext = createContext();
const ProfileContext = createContext();

export function AppProviders({ children }) {
  // Theme state
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'dark');

  // Profile state
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateProfile = (updatedFields) => {
    setProfile(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ProfileContext.Provider value={{ profile, updateProfile }}>
        {children}
      </ProfileContext.Provider>
    </ThemeContext.Provider>
  );
}

// Custom hooks to consume contexts
export function useTheme() {
  return useContext(ThemeContext);
}

export function useProfile() {
  return useContext(ProfileContext);
}
