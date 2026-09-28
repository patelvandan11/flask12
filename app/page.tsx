import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import resumeData from '@/data/resume.json';
import blogData from '@/data/blog.json';
import { Project, BlogPost } from '@/types/portfolio';
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
  Link as LinkIcon,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  Palette,
  Briefcase,
  Code2,
  GraduationCap,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';

export default function HomePage() {
  const projects: Project[] = projectsData;
  const posts: BlogPost[] = blogData;
  const socialLinkClasses =
    'w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 shadow-sm bg-white/80 dark:bg-slate-800/70';

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* 1. HERO SECTION (#home) with ample clearance under floating navbar */}
      <section id="home" className="pt-24 md:pt-28 scroll-mt-28">
        <div className="grid grid-cols-12 gap-4 max-md:flex max-md:flex-col">
          {/* Main Intro Card with Indigo/Violet Aesthetic Gradient Tint */}
          <div className="cyber-glass-card col-span-8 p-7 flex flex-col justify-between bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/40">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code mb-2">
                <span>01 / ABOUT</span>
                <span>&bull;</span>
                <span>AI &amp; DATA SCIENCE ENGINEER</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3.5 text-slate-900 dark:text-slate-100">
                Vandan Patel
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                Building intelligent applications with LLMs, RAG pipelines, AI agents, and computer vision. Software engineer focused on building commercial AI systems and scalable web architecture.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="cyber-badge">
                  <Brain size={13} /> LangChain
                </span>
                <span className="cyber-badge-emerald">
                  <Zap size={13} /> FastAPI
                </span>
                <span className="cyber-badge-violet">
                  <BotIcon size={13} /> OpenAI API
                </span>
                <span className="cyber-badge-teal">
                  <Zap size={13} /> React.js / Next.js
                </span>
                <span className="cyber-badge-amber">
                  <Flame size={13} /> PyTorch
                </span>
                <span className="cyber-badge">
                  <Database size={13} /> ChromaDB
                </span>
                <span className="cyber-badge-emerald">
                  <Eye size={13} /> OpenCV
                </span>
                <span className="cyber-badge-violet">
                  <Layers size={13} /> Docker
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://drive.google.com/file/d/1GzDOMeZzXpkl95ztqR5CXrPUbD3TYaHb/view"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary text-xs px-4 py-2"
              >
                <FileText size={14} /> Resume ↗
              </a>
              <a
                href={resumeData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-xs px-4 py-2"
              >
                <Github size={14} /> GitHub ↗
              </a>
              <a
                href={resumeData.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-xs px-4 py-2"
              >
                <Linkedin size={14} /> LinkedIn ↗
              </a>
              <a
                href="https://hashnode.com/@vandan11"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-xs px-4 py-2"
              >
                <BookOpen size={14} /> Hashnode ↗
              </a>
              <a href="#contact" className="cyber-btn-secondary text-xs px-4 py-2">
                <Send size={14} /> Contact →
              </a>
            </div>
          </div>

          {/* Lake Portrait Photo Card (vandan_lake.png) */}
          <div className="cyber-glass-card col-span-4 p-0 overflow-hidden relative group min-h-[280px] border-purple-100 dark:border-purple-900/40">
            <Image
              src="/images/vandan_lake.png"
              alt="Vandan Patel"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Key Metrics / Stats Card with Amber Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 dark:from-amber-950/40 dark:via-slate-900/90 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/40">
            <div className="flex flex-col gap-3.5">
              <div>
                <div className="text-4xl font-extrabold font-code text-amber-600 dark:text-amber-400 leading-none">
                  {resumeData.cgpa}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                  CGPA &middot; AI &amp; Data Science
                </div>
              </div>
              <div className="border-t border-amber-200/60 dark:border-amber-900/40 my-0.5"></div>
              <div>
                <div className="text-4xl font-extrabold font-code text-indigo-600 dark:text-indigo-400 leading-none">
                  2+
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                  Production &amp; Research Projects
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="cyber-badge-amber w-full justify-center">
                <Layers size={13} /> RAG &middot; Agents &middot; Vision
              </span>
            </div>
          </div>

          {/* Core Stack Overview Card with Emerald Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/40">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5 font-code">
                <Code2 size={15} /> Core Stack Overview
              </h3>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                    AI &amp; ML Architecture
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn
                  </p>
                </div>

                <div>
                  <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                    Data &amp; Vector Databases
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ChromaDB, Qdrant, FAISS, PostgreSQL, MongoDB
                  </p>
                </div>

                <div>
                  <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                    Backend &amp; Infrastructure
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Python, FastAPI, Docker, Microservices, REST APIs
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/40">
              <a href="#stack" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Explore Full Stack &rarr;
              </a>
            </div>
          </div>

          {/* Quick Links Card with Sky/Indigo Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/60 dark:from-sky-950/40 dark:via-slate-900/90 dark:to-indigo-950/30 border-sky-100 dark:border-sky-900/40">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-3 flex items-center gap-1.5 font-code">
                <LinkIcon size={15} /> Connect &amp; Profiles
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href={resumeData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-indigo-300 dark:hover:border-indigo-600"
                >
                  <Github size={13} className="text-indigo-600 dark:text-indigo-400" /> patelvandan11 ↗
                </a>
                <a
                  href="https://hashnode.com/@vandan11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <BookOpen size={13} className="text-purple-600 dark:text-purple-400" /> Hashnode @vandan11 ↗
                </a>
                <a
                  href={resumeData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-sky-300 dark:hover:border-sky-600"
                >
                  <Linkedin size={13} className="text-sky-600 dark:text-sky-400" /> LinkedIn Profile ↗
                </a>
                <a
                  href={resumeData.links.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-emerald-300 dark:hover:border-emerald-600"
                >
                  <ExternalLink size={13} className="text-emerald-600 dark:text-emerald-400" /> Medium Articles ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COLORFUL AESTHETIC TECH STACK SECTION (#stack) */}
      <section id="stack" className="scroll-mt-28 py-4 relative">
        {/* Header & Precision Ruler Ticks Bar */}
        <div className="relative mb-6">
          <div className="flex justify-between items-center text-[0.72rem] font-code tracking-widest text-slate-500 dark:text-slate-400 mb-2 uppercase">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">02 / 06</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">STACK</span>
            </div>
            <span>WHAT I REACH FOR</span>
          </div>

          {/* Precision Ruler Ticks Line (Colorful Gradient Ticks) */}
          <div className="w-full relative h-3 border-t border-indigo-200 dark:border-indigo-900/50 flex justify-between items-start pt-0.5 overflow-hidden opacity-85">
            {Array.from({ length: 65 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] ${
                  i % 5 === 0
                    ? 'h-2.5 bg-gradient-to-b from-indigo-500 to-violet-500'
                    : 'h-1.5 bg-indigo-200 dark:bg-indigo-900/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Faint Background Number '02' */}
        <div className="relative">
          <div className="absolute -top-12 -left-4 text-9xl font-black font-code text-indigo-500/[0.04] dark:text-indigo-400/[0.04] select-none pointer-events-none z-0">
            02
          </div>

          {/* 4 Category Columns with Soft Aesthetic Gradient Tints */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative z-10">
            {/* AI & ML Column */}
            <div className="cyber-glass-card p-5 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
              <h4 className="text-xs font-bold font-code tracking-wider text-indigo-700 dark:text-indigo-400 uppercase mb-3 border-b border-indigo-200/70 dark:border-indigo-900/40 pb-2">
                AI &amp; ML
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">PyTorch</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">TensorFlow</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">LangChain</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">LangGraph</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">scikit-learn</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">XGBoost</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">OpenCV</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">HuggingFace</li>
              </ul>
            </div>

            {/* DATA Column */}
            <div className="cyber-glass-card p-5 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900/90 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold font-code tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mb-3 border-b border-emerald-200/70 dark:border-emerald-900/40 pb-2">
                DATA
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">PostgreSQL</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">MongoDB</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">Neo4j graph</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">Qdrant</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">ChromaDB</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">FAISS</li>
                <li className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">Pandas / NumPy</li>
              </ul>
            </div>

            {/* BACKEND Column */}
            <div className="cyber-glass-card p-5 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 dark:from-purple-950/30 dark:via-slate-900/90 dark:to-pink-950/20 border-purple-100 dark:border-purple-900/40">
              <h4 className="text-xs font-bold font-code tracking-wider text-purple-700 dark:text-purple-400 uppercase mb-3 border-b border-purple-200/70 dark:border-purple-900/40 pb-2">
                BACKEND
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">Python</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">FastAPI</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">Flask / Django</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">REST / ORM</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">Microservices</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">JavaScript / TS</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">React / Next.js</li>
              </ul>
            </div>

            {/* INFRA Column */}
            <div className="cyber-glass-card p-5 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-slate-900/90 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/40">
              <h4 className="text-xs font-bold font-code tracking-wider text-amber-700 dark:text-amber-400 uppercase mb-3 border-b border-amber-200/70 dark:border-amber-900/40 pb-2">
                INFRA
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Docker</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Kubernetes</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">AWS</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Databricks</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Supabase</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Git / GitHub</li>
                <li className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">Postman / FastMCP</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION (#projects) */}
      <section id="projects" className="scroll-mt-28">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            03 / PORTFOLIO &amp; LAB
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Featured Projects &amp; Demos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Explore AI systems, multi-agent simulations, SaaS applications, and interactive tools built by Vandan Patel. Live links available for supported projects!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project, idx) => {
            const targetUrl = project.live_demo || project.github_url || project.url;
            const isInternal = targetUrl.startsWith('/');

            return (
              <article key={idx} className="cyber-glass-card flex flex-col overflow-hidden h-full">
                <div className="h-44 relative bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/40 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
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
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
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
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-auto">
                    {/* Code Link */}
                    {(project.github_url || project.url) && (
                      (project.github_url || project.url).startsWith('/') ? (
                        <Link
                          href={project.github_url || project.url}
                          className="cyber-btn-secondary text-xs !px-3 !py-1.5 flex items-center gap-1.5"
                          title="View Code"
                        >
                          <Github size={13} /> Code →
                        </Link>
                      ) : (
                        <a
                          href={project.github_url || project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cyber-btn-secondary text-xs !px-3 !py-1.5 flex items-center gap-1.5"
                          title="View Source Code"
                        >
                          <Github size={13} /> Code ↗
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
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                          Live Demo →
                        </Link>
                      ) : (
                        <a
                          href={project.live_demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cyber-btn-primary text-xs !px-3.5 !py-1.5 flex items-center gap-1.5 font-medium"
                          title="Open Live Demo"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                          Live Demo ↗
                        </a>
                      )
                    ) : (
                      <span className="text-[0.72rem] font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-full flex items-center gap-1.5 font-code">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Demo N/A
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. ABOUT SECTION (#about) */}
      <section id="about" className="scroll-mt-28">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            04 / BIOGRAPHY
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            About Vandan Patel
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            AI &amp; Data Science Engineer dedicated to constructing intelligent, scalable, and impact-driven technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Column: Profile Card (van.jpg) & Soft Skills */}
          <div className="flex flex-col gap-5">
            <div className="cyber-glass-card p-5 text-center bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
              <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-sm">
                <Image src="/images/van.jpg" alt="Vandan Patel" fill sizes="96px" className="object-cover" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-0.5">Vandan Patel</h3>
              <p className="text-indigo-600 dark:text-indigo-400 text-[0.72rem] font-semibold uppercase tracking-wider mb-2.5 font-code">
                AI &amp; Data Science Engineer
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Graduate in Artificial Intelligence &amp; Data Science from A.D. Patel Institute of Technology. Experienced in LLM applications, RAG pipelines, and deep learning.
              </p>

              <div className="flex flex-col gap-2.5 text-left bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <a href={`mailto:${resumeData.email}`} className="text-slate-600 dark:text-slate-300 hover:underline truncate">
                    {resumeData.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <a href={`tel:${resumeData.phone}`} className="text-slate-600 dark:text-slate-300">
                    {resumeData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{resumeData.location}</span>
                </div>
              </div>
            </div>

            {/* Soft Skills & Hobbies Card */}
            <div className="cyber-glass-card p-5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
                <Lightbulb size={15} className="text-indigo-600 dark:text-indigo-400" /> Soft Skills &amp; Interests
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="cyber-badge">Critical Thinking</span>
                <span className="cyber-badge-emerald">Problem Solving</span>
                <span className="cyber-badge-violet">Creative Thinking</span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
                <Palette size={15} className="text-indigo-600 dark:text-indigo-400" /> Hobbies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <span className="cyber-badge-amber">Tech Exploration</span>
                <span className="cyber-badge-teal">Painting &amp; Digital Art</span>
                <span className="cyber-badge">Storytelling</span>
              </div>
            </div>
          </div>

          {/* Right Column: Work Experience, Skills & Education */}
          <div className="col-span-2 flex flex-col gap-5">
            {/* Work Experience */}
            <div className="cyber-glass-card p-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2 font-code uppercase">
                <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" /> Work Experience
              </h3>

              <div className="relative pl-5 border-l-2 border-indigo-200 dark:border-indigo-900/50 space-y-6">
                {resumeData.work_experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <span className="absolute left-[-1.6rem] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {exp.role} &middot;{' '}
                      <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-400">
                        {exp.company} ↗
                      </a>
                    </h4>
                    <p className="text-xs font-semibold font-code text-slate-500 dark:text-slate-400 my-0.5">{exp.duration}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills Breakdown */}
            <div className="cyber-glass-card p-6 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 font-code uppercase">
                <Code2 size={20} className="text-indigo-600 dark:text-indigo-400" /> Technical Expertise
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    Languages
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.technical_skills.programming_languages.map((lang, i) => (
                      <span key={i} className="cyber-badge">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    Frameworks &amp; Web
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.technical_skills.frameworks.map((fw, i) => (
                      <span key={i} className="cyber-badge-emerald">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    AI / ML / Data Libraries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.technical_skills.ai_ml_libraries.map((lib, i) => (
                      <span key={i} className="cyber-badge-violet">
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="cyber-glass-card p-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
                <GraduationCap size={20} className="text-indigo-600 dark:text-indigo-400" /> Education
              </h3>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {resumeData.degree}
                </h4>
                <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mt-0.5">{resumeData.institution}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
                  {resumeData.graduation_year} &middot;{' '}
                  <strong className="text-slate-900 dark:text-slate-100">CGPA: {resumeData.cgpa}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BLOG SECTION (#blog) */}
      <section id="blog" className="scroll-mt-28">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            05 / WRITING &amp; ARTICLES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Technical Articles &amp; Writing
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            In-depth technical publications on LLM fine-tuning, RAG architecture, neural networks, and AI engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post, idx) => (
            <article key={idx} className="cyber-glass-card p-5 flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
              <div>
                <div className="flex items-center gap-4 text-[0.72rem] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1.5 font-code">
                    <Calendar size={13} className="text-indigo-600 dark:text-indigo-400" /> {post.date}
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} className="text-indigo-600 dark:text-indigo-400" /> {post.author}
                  </span>
                </div>

                <h3 className="text-base font-bold leading-snug mb-2.5 text-slate-900 dark:text-slate-100 hover:underline transition-colors duration-150">
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {post.description}
                </p>
              </div>

              <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 mt-auto">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary w-full text-xs py-2.5 hover:border-indigo-300 dark:hover:border-indigo-600"
                >
                  Read Full Article on Medium ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CONTACT SECTION (#contact) */}
      <section id="contact" className="scroll-mt-28">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            06 / TALK &amp; CONTACT
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Get in Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Have a project idea, AI opportunity, or collaboration inquiry? Feel free to reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Contact Info Side Card */}
          <div className="cyber-glass-card p-5 flex flex-col justify-between bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 min-h-[340px]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Contact Information
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Open to full-time roles, freelance projects, AI consulting, and research collaborations.
              </p>

              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                    <Mail size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                      Email
                    </span>
                    <a
                      href={`mailto:${resumeData.email}`}
                      className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline truncate block"
                    >
                      {resumeData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <Phone size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                      Phone
                    </span>
                    <a
                      href={`tel:${resumeData.phone}`}
                      className="font-semibold text-xs text-slate-900 dark:text-slate-100 block"
                    >
                      {resumeData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                    <MapPin size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                      Location
                    </span>
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                      {resumeData.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 mt-5">
              <div className="flex gap-2.5 justify-center">
                <a
                  href={resumeData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="GitHub"
                >
                  <Github size={15} />
                </a>
                <a
                  href="https://hashnode.com/@vandan11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="Hashnode"
                >
                  <BookOpen size={15} />
                </a>
                <a
                  href={resumeData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="cyber-glass-card p-5 md:col-span-2">
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-3.5">
              <input type="hidden" name="access_key" value="5b038aeb-d553-42aa-b4ad-a244fd5aac2a" />
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input type="text" id="name" name="name" className="cyber-input text-xs" placeholder="e.g. John Doe" required />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input type="email" id="email" name="email" className="cyber-input text-xs" placeholder="e.g. john@example.com" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea id="message" name="message" className="cyber-input min-h-[100px] text-xs resize-y" placeholder="Write your message here..." required></textarea>
              </div>

              <button type="submit" className="cyber-btn-primary w-full py-2.5 text-xs mt-1">
                Send Message <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
