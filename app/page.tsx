import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/portfolio';
import {
  FileText,
  Github,
  Linkedin,
  Send,
  Brain,
  Zap,
  Bot as BotIcon,
  Flame,
  Database,
  Eye,
  Layers,
  BarChart3,
  Link as LinkIcon,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const projects: Project[] = projectsData;
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      {/* Bento Grid Hero Section */}
      <section className="mb-16">
        <div className="grid grid-cols-12 gap-5 max-md:flex max-md:flex-col">
          
          {/* 1. Main Intro Card (Spans 8 Cols) */}
          <div className="cyber-glass-card col-span-8 p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan block mb-2">
                AI &amp; Data Science Engineer
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">
                Vandan Patel
              </h1>
              <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base md:text-lg leading-relaxed mb-6">
                Building intelligent applications with LLMs, RAG pipelines, AI agents, and computer vision. Experienced in full-stack AI engineering, vector databases, and scalable web solutions.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="cyber-badge">
                  <Brain size={13} /> LangChain
                </span>
                <span className="cyber-badge">
                  <Zap size={13} /> FastAPI
                </span>
                <span className="cyber-badge">
                  <BotIcon size={13} /> OpenAI API
                </span>
                <span className="cyber-badge-violet">
                  <Zap size={13} /> React.js / Next.js
                </span>
                <span className="cyber-badge-violet">
                  <Flame size={13} /> PyTorch
                </span>
                <span className="cyber-badge">
                  <Database size={13} /> ChromaDB
                </span>
                <span className="cyber-badge">
                  <Eye size={13} /> OpenCV
                </span>
                <span className="cyber-badge-violet">
                  <Layers size={13} /> Docker
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://drive.google.com/file/d/1GzDOMeZzXpkl95ztqR5CXrPUbD3TYaHb/view"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary text-sm px-4.5 py-2.5"
              >
                <FileText size={15} /> Resume
              </a>
              <a
                href="https://github.com/patelvandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-sm px-4.5 py-2.5"
              >
                <Github size={15} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/patelvandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-sm px-4.5 py-2.5"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <Link href="/contact" className="cyber-btn-secondary text-sm px-4.5 py-2.5">
                <Send size={15} /> Contact
              </Link>
            </div>
          </div>

          {/* 2. Photo Card (Spans 4 Cols) */}
          <div className="cyber-glass-card col-span-4 p-0 overflow-hidden relative group min-h-[300px]">
            <Image
              src="/images/vaan.jpg"
              alt="Vandan Patel"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* 3. Key Metrics / Stats Card (Spans 4 Cols) */}
          <div className="cyber-glass-card col-span-4 p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div>
                <div className="text-4xl font-extrabold font-code text-text-primaryLight dark:text-text-primaryDark leading-none">
                  8.80
                </div>
                <div className="text-xs font-semibold text-text-muted mt-1.5">
                  CGPA &middot; AI &amp; Data Science
                </div>
              </div>
              <div className="border-t border-black/10 dark:border-white/10 my-1"></div>
              <div>
                <div className="text-4xl font-extrabold font-code text-text-primaryLight dark:text-text-primaryDark leading-none">
                  10+
                </div>
                <div className="text-xs font-semibold text-text-muted mt-1.5">
                  Production &amp; Research Projects
                </div>
              </div>
            </div>
            <div className="mt-6">
              <span className="cyber-badge-violet w-full justify-center">
                <Layers size={13} /> RAG &middot; Agents &middot; Vision
              </span>
            </div>
          </div>

          {/* 4. Top Skills Card (Spans 4 Cols) */}
          <div className="cyber-glass-card col-span-4 p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-5 flex items-center gap-1.5">
              <BarChart3 size={15} className="text-cyber-cyan" /> Core Expertise
            </h3>

            <div className="space-y-4">
              {[
                { title: 'Generative AI & LLMs', val: '90%' },
                { title: 'Full-Stack AI Solutions', val: '85%' },
                { title: 'Machine Learning & RAG', val: '83%' },
                { title: 'Deep Learning', val: '80%' },
                { title: 'Computer Vision', val: '78%' },
              ].map((skill) => (
                <div key={skill.title}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-text-secondaryLight dark:text-text-secondaryDark">{skill.title}</span>
                    <span className="text-cyber-cyan font-code">{skill.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet rounded-full transition-all duration-1000"
                      style={{ width: skill.val }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Quick Links Card (Spans 4 Cols) */}
          <div className="cyber-glass-card col-span-4 p-6 flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-5 flex items-center gap-1.5">
              <LinkIcon size={15} className="text-cyber-violet" /> Connect &amp; Profiles
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/patelvandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-sm !justify-start"
              >
                <Github size={15} className="text-cyber-cyan" /> patelvandan11
              </a>
              <a
                href="https://www.linkedin.com/in/patelvandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-sm !justify-start"
              >
                <Linkedin size={15} className="text-cyber-cyan" /> LinkedIn Profile
              </a>
              <a
                href="https://medium.com/@patelvandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-sm !justify-start"
              >
                <ExternalLink size={15} className="text-cyber-cyan" /> Medium Articles
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              Featured <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark text-sm mt-1">
              Highlighted AI &amp; Software Innovations
            </p>
          </div>
          <Link href="/projects" className="cyber-btn-secondary text-xs px-3.5 py-2">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, idx) => (
            <article key={idx} className="cyber-glass-card flex flex-col overflow-hidden h-full">
              <div className="h-44 relative bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
                  <Image
                    src={project.img_src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-contain transition-transform duration-500 hover:scale-103"
                  />
                </a>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark mb-2 leading-snug">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyber-cyan transition-colors">
                      {project.title}
                    </a>
                  </h3>
                  <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>
                <div className="flex justify-end pt-3 border-t border-black/10 dark:border-white/10 mt-auto">
                  <a
                    href={project.urlw}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan hover:border-cyber-cyan transition-colors cursor-pointer"
                    title="View Project"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
