'use client';

import React from 'react';
import { Button } from 'flowbite-react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useDarkMode } from '../DarkModeProvider/DarkModeProvider';

const DarkModeToggle = ({ variant = 'button', className = '' }) => {
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode();

  // Don't render until client-side hydration is complete
  if (!isLoaded) {
    return (
      <div className={`w-10 h-10 ${className}`}>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <HiSun className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
        <HiMoon className={`w-5 h-5 ${isDarkMode ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <Button
      onClick={toggleDarkMode}
      size="sm"
      color="gray"
      className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ${className}`}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? (
        <HiSun className="w-5 h-5 text-yellow-500" />
      ) : (
        <HiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}
    </Button>
  );
};

export default DarkModeToggle;