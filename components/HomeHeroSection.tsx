'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from './AdminContext';
import { ResumeData } from '@/types/portfolio';
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
  BookOpen,
  Code2,
  Sparkles,
  Pencil,
  Plus,
  X,
  Save,
  Loader2,
} from 'lucide-react';

interface HomeHeroSectionProps {
  resume: ResumeData;
  onSave: (updated: ResumeData) => Promise<boolean>;
  onAddBadge: (badge: string) => Promise<boolean>;
  onRemoveBadge: (index: number) => Promise<boolean>;
  isSaving?: boolean;
}

export default function HomeHeroSection({
  resume,
  onSave,
  onAddBadge,
  onRemoveBadge,
  isSaving = false,
}: HomeHeroSectionProps) {
  const { isAdmin } = useAdmin();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [newBadgeText, setNewBadgeText] = useState('');
  const [submittingBadge, setSubmittingBadge] = useState(false);
  const [formData, setFormData] = useState<Partial<ResumeData>>({});

  const badges = resume.hero_badges?.length
    ? resume.hero_badges
    : [
        'LangChain',
        'FastAPI',
        'OpenAI API',
        'React.js / Next.js',
        'PyTorch',
        'ChromaDB',
        'OpenCV',
        'Docker',
      ];

  const coreStack = resume.core_stack_overview || {
    ai_ml: 'PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn',
    data: 'ChromaDB, Qdrant, FAISS, PostgreSQL, MongoDB',
    backend: 'Python, FastAPI, Docker, Microservices, REST APIs',
  };

  const handleOpenEdit = () => {
    setFormData({
      name: resume.name,
      title: resume.title,
      hero_bio: resume.hero_bio || resume.summary,
      cgpa: resume.cgpa,
      projects_count: resume.projects_count || '2+',
      projects_count_label: resume.projects_count_label || 'Production & Research Projects',
      metric_badge: resume.metric_badge || 'RAG • Agents • Vision',
      core_stack_overview: { ...coreStack },
      links: { ...resume.links },
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ResumeData = {
      ...resume,
      ...formData,
      core_stack_overview: formData.core_stack_overview || coreStack,
      links: formData.links || resume.links,
    } as ResumeData;

    const ok = await onSave(updated);
    if (ok) {
      setIsEditModalOpen(false);
    }
  };

  const handleAddBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeText.trim()) return;
    setSubmittingBadge(true);
    const ok = await onAddBadge(newBadgeText.trim());
    setSubmittingBadge(false);
    if (ok) {
      setNewBadgeText('');
      setIsBadgeModalOpen(false);
    }
  };

  return (
    <section id="home" className="pt-24 md:pt-28 scroll-mt-28">
      {/* Admin Floating Control Ribbon */}
      {isAdmin && (
        <div className="mb-4 flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-code font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>Hero &amp; Profile Section &middot; Live MongoDB Atlas</span>
          </div>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Pencil size={12} /> Edit Hero &amp; Metrics (Admin)
          </button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 max-md:flex max-md:flex-col">
        {/* Main Intro Card with Indigo/Violet Aesthetic Gradient Tint */}
        <div className="cyber-glass-card col-span-8 p-7 flex flex-col justify-between bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code mb-2">
              <span>01 / ABOUT</span>
              <span>&bull;</span>
              <span>{resume.title || 'AI & DATA SCIENCE ENGINEER'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3.5 text-slate-900 dark:text-slate-100">
              {resume.name || 'Vandan Patel'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              {resume.hero_bio ||
                resume.summary ||
                'Building intelligent applications with LLMs, RAG pipelines, AI agents, and computer vision. Software engineer focused on building commercial AI systems and scalable web architecture.'}
            </p>

            {/* Hero Tech Badges */}
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              {badges.map((badge, idx) => (
                <span key={idx} className="cyber-badge group/b relative inline-flex items-center gap-1.5">
                  <Brain size={13} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{badge}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onRemoveBadge(idx)}
                      disabled={isSaving}
                      className="ml-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title={`Remove ${badge}`}
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              ))}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsBadgeModalOpen(true)}
                  className="px-2.5 py-1 rounded-full border border-dashed border-indigo-400 text-indigo-600 dark:text-indigo-400 text-xs font-code font-bold flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add Badge
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
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
              href={resume.links?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-secondary text-xs px-4 py-2"
            >
              <Github size={14} /> GitHub ↗
            </a>
            <a
              href={resume.links?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-secondary text-xs px-4 py-2"
            >
              <Linkedin size={14} /> LinkedIn ↗
            </a>
            <a
              href={resume.links?.hashnode || 'https://hashnode.com/@vandan11'}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-secondary text-xs px-4 py-2"
            >
              <BookOpen size={14} /> Hashnode ↗
            </a>
            <a
              href={resume.links?.leetcode || 'https://leetcode.com/u/vandan_patel115/'}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-secondary text-xs px-4 py-2"
            >
              <Code2 size={14} /> LeetCode ↗
            </a>
            <Link href="/beyond-coding" className="cyber-btn-secondary text-xs px-4 py-2">
              <Sparkles size={14} /> Beyond Code ✨
            </Link>
            <a href="#contact" className="cyber-btn-secondary text-xs px-4 py-2">
              <Send size={14} /> Contact →
            </a>
          </div>
        </div>

        {/* Lake Portrait Photo Card (vandan_lake.png) */}
        <div className="cyber-glass-card col-span-4 p-0 overflow-hidden relative group min-h-[280px] border-purple-100 dark:border-purple-900/40">
          <Image
            src="/images/vandan_lake.png"
            alt={resume.name || 'Vandan Patel'}
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
                {resume.cgpa || '8.80'}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                CGPA &middot; AI &amp; Data Science
              </div>
            </div>
            <div className="border-t border-amber-200/60 dark:border-amber-900/40 my-0.5"></div>
            <div>
              <div className="text-4xl font-extrabold font-code text-indigo-600 dark:text-indigo-400 leading-none">
                {resume.projects_count || '2+'}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                {resume.projects_count_label || 'Production & Research Projects'}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="cyber-badge-amber w-full justify-center">
              <Layers size={13} /> {resume.metric_badge || 'RAG · Agents · Vision'}
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
                  {coreStack.ai_ml}
                </p>
              </div>

              <div>
                <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                  Data &amp; Vector Databases
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {coreStack.data}
                </p>
              </div>

              <div>
                <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                  Backend &amp; Infrastructure
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {coreStack.backend}
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
                href={resume.links?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                <Github size={13} className="text-indigo-600 dark:text-indigo-400" /> patelvandan11 ↗
              </a>
              <a
                href={resume.links?.hashnode || 'https://hashnode.com/@vandan11'}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-purple-300 dark:hover:border-purple-600"
              >
                <BookOpen size={13} className="text-purple-600 dark:text-purple-400" /> Hashnode @vandan11 ↗
              </a>
              <a
                href={resume.links?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-sky-300 dark:hover:border-sky-600"
              >
                <Linkedin size={13} className="text-sky-600 dark:text-sky-400" /> LinkedIn Profile ↗
              </a>
              <a
                href={resume.links?.leetcode || 'https://leetcode.com/u/vandan_patel115/'}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-amber-300 dark:hover:border-amber-600"
              >
                <Code2 size={13} className="text-amber-600 dark:text-amber-400" /> LeetCode Profile ↗
              </a>
              <a
                href={resume.links?.medium}
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

      {/* Modal: Add Badge */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-indigo-600" />
                Add Hero Tech Badge
              </h3>
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddBadgeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Badge Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LangGraph, Next.js, Ollama"
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBadgeModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBadge || !newBadgeText.trim()}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingBadge ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Modal: Edit Hero & Metrics */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pencil size={18} className="text-indigo-600" />
                Edit Hero Section &amp; Metrics (MongoDB Atlas)
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title / Role</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hero Bio Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.hero_bio || ''}
                  onChange={(e) => setFormData({ ...formData, hero_bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div>
                  <label className="font-bold text-amber-900 dark:text-amber-200 block mb-1">CGPA Value</label>
                  <input
                    type="text"
                    value={formData.cgpa || ''}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-900 dark:text-amber-200 block mb-1">Projects Count</label>
                  <input
                    type="text"
                    value={formData.projects_count || ''}
                    onChange={(e) => setFormData({ ...formData, projects_count: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-900 dark:text-amber-200 block mb-1">Metric Tag Badge</label>
                  <input
                    type="text"
                    value={formData.metric_badge || ''}
                    onChange={(e) => setFormData({ ...formData, metric_badge: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
              </div>

              {/* Core Stack Overview */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block uppercase font-code">
                  Core Stack Overview Card
                </span>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">AI &amp; ML Architecture</label>
                  <input
                    type="text"
                    value={formData.core_stack_overview?.ai_ml || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        core_stack_overview: {
                          ...(formData.core_stack_overview as any),
                          ai_ml: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">Data &amp; Vector Databases</label>
                  <input
                    type="text"
                    value={formData.core_stack_overview?.data || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        core_stack_overview: {
                          ...(formData.core_stack_overview as any),
                          data: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">Backend &amp; Infrastructure</label>
                  <input
                    type="text"
                    value={formData.core_stack_overview?.backend || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        core_stack_overview: {
                          ...(formData.core_stack_overview as any),
                          backend: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
                <span className="col-span-full font-bold text-sky-900 dark:text-sky-300 block uppercase font-code">
                  Profile &amp; Social Links
                </span>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.links?.github || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...(formData.links as any), github: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.links?.linkedin || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...(formData.links as any), linkedin: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">LeetCode URL</label>
                  <input
                    type="url"
                    value={formData.links?.leetcode || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...(formData.links as any), leetcode: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">Hashnode URL</label>
                  <input
                    type="url"
                    value={formData.links?.hashnode || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...(formData.links as any), hashnode: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-600 dark:text-slate-400 block mb-0.5">Medium URL</label>
                  <input
                    type="url"
                    value={formData.links?.medium || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...(formData.links as any), medium: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save to MongoDB Atlas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
