import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_PROFILE } from '../lib/constants';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ThemeContext = createContext();
const ProfileContext = createContext();

export function AppProviders({ children }) {
  // Theme state
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'dark');

  // Profile state
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Firebase Auth & Firestore sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(DEFAULT_PROFILE);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateProfile = async (updatedFields) => {
    const newProfile = { ...profile, ...updatedFields };
    setProfile(newProfile);
    
    // Sync to Firestore if user is logged in
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), newProfile, { merge: true });
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ProfileContext.Provider value={{ profile, updateProfile, user, authLoading }}>
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
