import React from 'react';
import { Github, Linkedin, BookOpen, Code, Instagram } from 'lucide-react';

export default function Footer() {
  const linkClasses = "w-10 h-10 rounded-full bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark text-lg transition-all duration-200 hover:text-cyber-cyan hover:border-cyber-cyan/55 hover:-translate-y-0.5 hover:shadow-glow-cyan shadow-sm";

  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10 py-10 bg-white/40 dark:bg-[#030712]/40 backdrop-blur-md transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://medium.com/@patelvandan11"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Medium"
            >
              <BookOpen size={18} />
            </a>
            <a
              href="https://www.kaggle.com/patelvandan115"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Kaggle"
            >
              <span className="font-extrabold text-sm">K</span>
            </a>
            <a
              href="https://leetcode.com/u/vandan_patel115/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="LeetCode"
            >
              <Code size={18} />
            </a>
            <a
              href="https://www.instagram.com/vandan_1_1/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              title="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
          <p className="text-xs text-text-muted tracking-wide text-center">
            &copy; {new Date().getFullYear()} Vandan Patel. Crafted with Next.js, Tailwind CSS &amp; TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
