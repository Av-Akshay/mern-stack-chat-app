import React from 'react';
import { useTheme } from './ThemeProvider';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 dark:hover:bg-slate-600/50 transition-all duration-300"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FaSun className="text-base sm:text-lg text-yellow-300 hover:text-yellow-200" />
      ) : (
        <FaMoon className="text-base sm:text-lg text-blue-200 hover:text-blue-100" />
      )}
    </button>
  );
};

export default ThemeToggle; 