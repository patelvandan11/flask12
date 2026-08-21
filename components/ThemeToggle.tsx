'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkClass = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (isDarkClass ? 'dark' : 'light');
    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const btnClasses =
    'w-9 h-9 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer shadow-sm';

  if (!mounted) {
    return (
      <button className={btnClasses} aria-label="Toggle theme">
        <Moon className="w-4 h-4 text-zinc-600" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={btnClasses}
      aria-label="Toggle Light / Dark Mode"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700" />
      )}
    </button>
  );
}
