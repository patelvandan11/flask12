import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/portfolio';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Projects | Vandan Patel',
  description: 'Explore Vandan Patel\'s portfolio of AI, Machine Learning, RAG, SaaS, and Data Science projects.',
};

export default function ProjectsPage() {
  const projects: Project[] = projectsData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Featured <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Projects</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          A showcase of AI systems, LLM agents, SaaS applications, computer vision models, and web tools built by Vandan Patel.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <article key={idx} className="cyber-glass-card flex flex-col overflow-hidden h-full">
            <div className="h-44 relative bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
              {project.url.startsWith('/') ? (
                <Link href={project.url} className="relative w-full h-full block">
                  <Image
                    src={project.img_src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-contain transition-transform duration-500 hover:scale-103"
                  />
                </Link>
              ) : (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
                  <Image
                    src={project.img_src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-contain transition-transform duration-500 hover:scale-103"
                  />
                </a>
              )}
            </div>
            
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark mb-2 leading-snug">
                  {project.url.startsWith('/') ? (
                    <Link href={project.url} className="hover:text-cyber-cyan transition-colors">
                      {project.title}
                    </Link>
                  ) : (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyber-cyan transition-colors">
                      {project.title}
                    </a>
                  )}
                </h3>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-black/10 dark:border-white/10 mt-auto">
                {project.urlw.startsWith('/') ? (
                  <Link
                    href={project.urlw}
                    className="text-xs font-semibold px-4 py-2 border border-black/10 dark:border-white/10 rounded-full hover:text-cyber-cyan hover:border-cyber-cyan transition-colors block text-center bg-white/40 dark:bg-white/5"
                  >
                    Learn More <ExternalLink size={12} className="inline ml-1" />
                  </Link>
                ) : (
                  <a
                    href={project.urlw}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-2 border border-black/10 dark:border-white/10 rounded-full hover:text-cyber-cyan hover:border-cyber-cyan transition-colors block text-center bg-white/40 dark:bg-white/5"
                  >
                    Learn More <ExternalLink size={12} className="inline ml-1" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
