'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Home', path: '#home', id: 'home' },
  { label: 'Stack', path: '#stack', id: 'stack' },
  { label: 'Projects', path: '#projects', id: 'projects' },
  { label: 'About', path: '#about', id: 'about' },
  { label: 'Blog', path: '#blog', id: 'blog' },
  { label: 'Contact', path: '#contact', id: 'contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      setMobileOpen(false);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(targetId);
      }
    } else {
      setMobileOpen(false);
      router.push(`/#${targetId}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] py-4 px-4 transition-all duration-200">
      <div className="flex items-center justify-between bg-white/85 dark:bg-[#111827]/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 rounded-full px-6 py-2.5 max-w-5xl mx-auto shadow-sm transition-all duration-300">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          <span>Vandan Patel</span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </a>

        {/* Navigation Links */}
        <ul className={`flex items-center gap-1 list-none max-md:fixed max-md:top-[4.75rem] max-md:left-4 max-md:right-4 max-md:bg-white/95 max-md:dark:bg-[#111827]/95 max-md:backdrop-blur-2xl max-md:border max-md:border-slate-200 max-md:dark:border-slate-800 max-md:rounded-2xl max-md:p-6 max-md:flex-col max-md:gap-3 max-md:shadow-2xl max-md:transition-all max-md:duration-300 ${
          mobileOpen ? 'max-md:translate-y-0 max-md:opacity-100 max-md:visible' : 'max-md:-translate-y-4 max-md:opacity-0 max-md:invisible'
        }`}>
          {navItems.map((item) => {
            const isActive = pathname === '/' ? activeSection === item.id : false;

            return (
              <li key={item.id} className="max-md:w-full">
                <a
                  href={`/#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 block max-md:text-center cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ThemeToggle />

          <button
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 md:hidden hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
