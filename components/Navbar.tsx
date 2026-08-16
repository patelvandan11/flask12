'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] py-4 px-4 transition-all duration-200">
      <div className="flex items-center justify-between bg-white/70 dark:bg-[#030712]/75 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full px-6 py-2.5 max-w-5xl mx-auto shadow-glass-light dark:shadow-glass-dark transition-all duration-300">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight flex items-center gap-1.5 text-text-primaryLight dark:text-text-primaryDark">
          <span>Vandan</span>
          <span className="w-2 h-2 bg-cyber-cyan rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></span>
        </Link>

        {/* Navigation Links */}
        <ul className={`flex items-center gap-1 list-none max-md:fixed max-md:top-[4.75rem] max-md:left-4 max-md:right-4 max-md:bg-white/95 max-md:dark:bg-[#07090e]/95 max-md:backdrop-blur-2xl max-md:border max-md:border-cyber-cyan/30 max-md:rounded-2xl max-md:p-6 max-md:flex-col max-md:gap-3 max-md:shadow-2xl max-md:transition-all max-md:duration-300 ${
          mobileOpen ? 'max-md:translate-y-0 max-md:opacity-100 max-md:visible' : 'max-md:-translate-y-4 max-md:opacity-0 max-md:invisible'
        }`}>
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? pathname === '/'
                : pathname.startsWith(item.path);

            return (
              <li key={item.path} className="max-md:w-full">
                <Link
                  href={item.path}
                  className={`text-[0.92rem] font-semibold px-4 py-2 rounded-full transition-all duration-200 block max-md:text-center ${
                    isActive
                      ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                      : 'text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ThemeToggle />

          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-text-primaryLight dark:text-text-primaryDark md:hidden hover:border-cyber-cyan/40 hover:text-cyber-cyan transition-all duration-200 cursor-pointer shadow-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
