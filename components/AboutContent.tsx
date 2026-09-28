'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from './AdminContext';
import { Mail, Phone, MapPin, Lightbulb, Palette, Briefcase, Code2, GraduationCap, Pencil, X, Save, Loader2 } from 'lucide-react';

interface AboutContentProps {
  initialResume: any;
}

export default function AboutContent({ initialResume }: AboutContentProps) {
  const { isAdmin } = useAdmin();
  const [resume, setResume] = useState<any>(initialResume);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>(initialResume);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setResume(data);
          setFormData(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch resume live:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setResume(formData);

    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setIsModalOpen(false);
      } else {
        alert('Failed to save resume data.');
      }
    } catch (err) {
      alert('Error saving resume to MongoDB');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-12 relative">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          About <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Vandan Patel</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          AI &amp; Data Science Engineer passionate about building intelligent, scalable, and impact-driven technology.
        </p>

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setFormData(JSON.parse(JSON.stringify(resume)));
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Pencil size={15} /> Edit Resume &amp; Profile (Admin)
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Soft Skills */}
        <div className="flex flex-col gap-6">
          <div className="cyber-glass-card p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
              <Image
                src="/images/van.jpg"
                alt="Vandan Patel"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark mb-1">
              {resume.name || 'Vandan Patel'}
            </h2>
            <p className="text-cyber-cyan text-xs font-bold uppercase tracking-wider mb-3">
              AI &amp; Data Science Engineer
            </p>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark text-xs leading-relaxed mb-5">
              Graduate in Artificial Intelligence &amp; Data Science from A.D. Patel Institute of Technology. Experienced in LLM applications, RAG pipelines, and deep learning.
            </p>

            <div className="flex flex-col gap-3 text-left bg-black/5 dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={15} className="text-cyber-cyan" />
                <a href={`mailto:${resume.email}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan transition-colors underline truncate">
                  {resume.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={15} className="text-cyber-violet" />
                <a href={`tel:${resume.phone}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan transition-colors">
                  {resume.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin size={15} className="text-cyber-emerald" />
                <span className="text-text-secondaryLight dark:text-text-secondaryDark truncate">{resume.location}</span>
              </div>
            </div>
          </div>

          {/* Soft Skills & Hobbies Card */}
          <div className="cyber-glass-card p-6">
            <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark mb-4 flex items-center gap-2">
              <Lightbulb size={17} className="text-cyber-cyan" /> Soft Skills &amp; Interests
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="cyber-badge">Critical Thinking</span>
              <span className="cyber-badge">Problem Solving</span>
              <span className="cyber-badge">Creative Thinking</span>
            </div>

            <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark mb-4 flex items-center gap-2">
              <Palette size={17} className="text-cyber-violet" /> Hobbies
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="cyber-badge-violet">Tech Exploration</span>
              <span className="cyber-badge-violet">Painting &amp; Digital Art</span>
              <span className="cyber-badge-violet">Storytelling</span>
            </div>
          </div>
        </div>

        {/* Right Column: Work Experience, Skills & Education */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Work Experience */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-6 flex items-center gap-2.5">
              <Briefcase size={22} className="text-cyber-cyan" /> Work Experience
            </h2>

            <div className="relative pl-6 border-l-2 border-cyber-cyan/30 space-y-8">
              {resume.work_experience?.map((exp: any, index: number) => (
                <div key={index} className="relative">
                  <span className="absolute left-[-1.85rem] top-1.5 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.7)]"></span>
                  <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark leading-snug">
                    {exp.role} &middot;{' '}
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-cyan hover:underline"
                    >
                      {exp.company}
                    </a>
                  </h3>
                  <p className="text-xs font-semibold font-code text-cyber-cyan/80 my-1">{exp.duration}</p>
                  <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-6 flex items-center gap-2.5">
              <Code2 size={22} className="text-cyber-violet" /> Technical Expertise
            </h2>

            <div className="space-y-5">
              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Languages
                </span>
                <div className="flex flex-wrap gap-2">
                  {resume.technical_skills?.programming_languages?.map((lang: string, i: number) => (
                    <span key={i} className="cyber-badge">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Frameworks &amp; Web
                </span>
                <div className="flex flex-wrap gap-2">
                  {resume.technical_skills?.frameworks?.map((fw: string, i: number) => (
                    <span key={i} className="cyber-badge-violet">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  AI / ML / Data Libraries
                </span>
                <div className="flex flex-wrap gap-2">
                  {resume.technical_skills?.ai_ml_libraries?.map((lib: string, i: number) => (
                    <span key={i} className="cyber-badge">
                      {lib}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-5 flex items-center gap-2.5">
              <GraduationCap size={22} className="text-cyber-emerald" /> Education
            </h2>
            <div>
              <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark leading-tight">{resume.degree}</h3>
              <p className="text-cyber-cyan text-sm font-semibold mt-1">
                {resume.institution}
              </p>
              <p className="text-text-secondaryLight dark:text-text-secondaryDark text-xs mt-2 font-medium">
                {resume.graduation_year} &middot; <strong className="text-text-primaryLight dark:text-text-primaryDark">CGPA: {resume.cgpa}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Resume Profile
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Degree</label>
                <input
                  type="text"
                  required
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CGPA</label>
                <input
                  type="text"
                  required
                  value={formData.cgpa || ''}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
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
                  <span>Save Resume Profile to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
