'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if there's a saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved preference or system preference
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDarkMode(shouldBeDark);
    setIsLoaded(true);
    
    // Apply the theme to the document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Apply to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLightMode = () => {
    setIsDarkMode(false);
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  };

  const setDarkModeOn = () => {
    setIsDarkMode(true);
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    setLightMode,
    setDarkMode: setDarkModeOn,
    isLoaded
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};