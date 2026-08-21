import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/portfolio';
import { ExternalLink, Github } from 'lucide-react';

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
          Featured Projects &amp; Demos
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          A showcase of AI systems, LLM agents, SaaS applications, computer vision models, and web tools built by Vandan Patel.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => {
          const targetUrl = project.live_demo || project.github_url || project.url;
          const isInternal = targetUrl.startsWith('/');

          return (
            <article key={idx} className="cyber-glass-card flex flex-col overflow-hidden h-full">
              <div className="h-44 relative bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
                {isInternal ? (
                  <Link href={targetUrl} className="relative w-full h-full block">
                    <Image
                      src={project.img_src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-contain transition-transform duration-500 hover:scale-103"
                    />
                  </Link>
                ) : (
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
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
                    {isInternal ? (
                      <Link href={targetUrl} className="hover:underline transition-colors">
                        {project.title}
                      </Link>
                    ) : (
                      <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">
                        {project.title}
                      </a>
                    )}
                  </h3>
                  <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-black/10 dark:border-white/10 mt-auto">
                  {/* Code / Github Link */}
                  {(project.github_url || project.url) && (
                    (project.github_url || project.url).startsWith('/') ? (
                      <Link
                        href={project.github_url || project.url}
                        className="cyber-btn-secondary text-xs !px-3 !py-1.5 flex items-center gap-1.5"
                        title="View Code"
                      >
                        <Github size={13} /> Code
                      </Link>
                    ) : (
                      <a
                        href={project.github_url || project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-btn-secondary text-xs !px-3 !py-1.5 flex items-center gap-1.5"
                        title="View Source Code"
                      >
                        <Github size={13} /> Code
                      </a>
                    )
                  )}

                  {/* Live Demo Option */}
                  {project.live_demo ? (
                    project.live_demo.startsWith('/') ? (
                      <Link
                        href={project.live_demo}
                        className="cyber-btn-primary text-xs !px-3.5 !py-1.5 flex items-center gap-1.5 font-medium"
                        title="Open Live Demo"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Live Demo
                      </Link>
                    ) : (
                      <a
                        href={project.live_demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-btn-primary text-xs !px-3.5 !py-1.5 flex items-center gap-1.5 font-medium"
                        title="Open Live Demo"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Live Demo <ExternalLink size={11} />
                      </a>
                    )
                  ) : (
                    <span className="text-[0.72rem] font-medium text-text-muted px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
                      Demo N/A
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
