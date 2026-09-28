'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { useAdmin, getSafeImageUrl, ImageDropzone } from './AdminContext';
import { ExternalLink, Github, Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

interface ProjectsContentProps {
  initialProjects: Project[];
}

export default function ProjectsContent({ initialProjects }: ProjectsContentProps) {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    img_src: '',
    img_srcset: '',
    url: '',
    urlw: '',
    github_url: '',
    live_demo: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch projects live:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      description: '',
      img_src: '/images/full1.png',
      img_srcset: '',
      url: '',
      urlw: '',
      github_url: '',
      live_demo: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...projects[index] });
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm(`Are you sure you want to delete "${projects[index].title}"?`)) return;

    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    await saveToMongo(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updated: Project[];
    if (editingIndex !== null) {
      updated = [...projects];
      updated[editingIndex] = formData;
    } else {
      updated = [formData, ...projects];
    }

    setProjects(updated);
    const success = await saveToMongo(updated);
    setIsSaving(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const saveToMongo = async (dataToSave: Project[]) => {
    try {
      const res = await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataToSave }),
      });
      const resData = await res.json();
      return res.ok && resData.success;
    } catch (err) {
      alert('Failed to save changes to MongoDB.');
      return false;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-12 relative">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Featured Projects &amp; Demos
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          A showcase of AI systems, LLM agents, SaaS applications, computer vision models, and web tools built by Vandan Patel.
        </p>

        {/* Admin Add Button (Only when Admin) */}
        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={16} /> Add New Project (Admin)
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => {
          const targetUrl = project.live_demo || project.github_url || project.url || '#';
          const isInternal = targetUrl.startsWith('/');

          return (
            <article key={idx} className="cyber-glass-card flex flex-col overflow-hidden h-full relative group">
              {/* Admin Card Action Buttons (Edit / Delete) */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                  <button
                    onClick={() => handleOpenEdit(idx)}
                    className="p-1.5 text-slate-300 hover:text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 text-slate-300 hover:text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}

              <div className="h-44 relative bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
                {isInternal ? (
                  <Link href={targetUrl} className="relative w-full h-full block">
                    <img
                      src={getSafeImageUrl(project.img_src)}
                      alt={project.title}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-103"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/full1.png';
                      }}
                    />
                  </Link>
                ) : (
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
                    <img
                      src={getSafeImageUrl(project.img_src)}
                      alt={project.title}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-103"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/full1.png';
                      }}
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

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <ImageDropzone
                label="Project Screenshot / Cover Image"
                value={formData.img_src}
                onChange={(url) => setFormData({ ...formData, img_src: url, img_srcset: url })}
              />

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value, url: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Live Demo URL (Leave blank if none)</label>
                <input
                  type="text"
                  value={formData.live_demo || ''}
                  onChange={(e) => setFormData({ ...formData, live_demo: e.target.value, urlw: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{editingIndex !== null ? 'Save Changes to MongoDB' : 'Add Project to MongoDB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
