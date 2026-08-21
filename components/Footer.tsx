import React from 'react';
import { Github, Linkedin, BookOpen, Code, Instagram, Globe } from 'lucide-react';

export default function Footer() {
  const linkClasses =
    'w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400 text-sm transition-all duration-200 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 shadow-sm';

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 py-8 bg-zinc-50/50 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://hashnode.com/@vandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Hashnode Profile"
            >
              <BookOpen size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://medium.com/@patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Medium"
            >
              <Globe size={16} />
            </a>
            <a
              href="https://www.kaggle.com/patelvandan115"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Kaggle"
            >
              <span className="font-extrabold text-xs font-code">K</span>
            </a>
            <a
              href="https://leetcode.com/u/vandan_patel115/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="LeetCode"
            >
              <Code size={16} />
            </a>
            <a
              href="https://www.instagram.com/vandan_1_1/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide text-center font-code">
            &copy; {new Date().getFullYear()} Vandan Patel. Crafted with Next.js, Tailwind CSS &amp; TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
