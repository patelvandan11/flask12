'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from './AdminContext';
import { ResumeData, WorkExperience, TechnicalSkills, EMPTY_RESUME } from '@/types/portfolio';
import {
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  Palette,
  Briefcase,
  Code2,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
  X,
  Save,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface AboutContentProps {
  initialResume?: ResumeData;
  sectionPrefix?: string;
  isStandalonePage?: boolean;
}

export default function AboutContent({
  initialResume,
  sectionPrefix,
  isStandalonePage = true,
}: AboutContentProps) {
  const { isAdmin } = useAdmin();
  const [resume, setResume] = useState<ResumeData>(initialResume || EMPTY_RESUME);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState<keyof TechnicalSkills>('programming_languages');
  const [newSkillName, setNewSkillName] = useState('');
  const [isSoftSkillModalOpen, setIsSoftSkillModalOpen] = useState(false);
  const [softSkillType, setSoftSkillType] = useState<'soft_skills' | 'hobbies'>('soft_skills');
  const [newTagText, setNewTagText] = useState('');
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  // Forms
  const [profileForm, setProfileForm] = useState({
    name: resume.name || '',
    title: resume.title || '',
    about_bio: resume.about_bio || resume.summary || '',
    email: resume.email || '',
    phone: resume.phone || '',
    location: resume.location || '',
  });

  const [experienceForm, setExperienceForm] = useState<WorkExperience>({
    company: '',
    company_url: '',
    role: '',
    duration: '',
    details: '',
  });

  const [educationForm, setEducationForm] = useState({
    degree: resume.degree || '',
    institution: resume.institution || '',
    graduation_year: resume.graduation_year || '',
    cgpa: resume.cgpa || '',
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && data.name) {
          setResume(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch resume live from MongoDB:', err);
    }
  };

  const saveToMongoDB = async (updated: ResumeData): Promise<boolean> => {
    setIsSaving(true);
    setResume(updated);
    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updated }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        return true;
      } else {
        alert(resData.error || 'Failed to save resume to MongoDB.');
        return false;
      }
    } catch (err) {
      alert('Network error while saving to MongoDB.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // --- Profile Handler ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ResumeData = {
      ...resume,
      name: profileForm.name,
      title: profileForm.title,
      about_bio: profileForm.about_bio,
      email: profileForm.email,
      phone: profileForm.phone,
      location: profileForm.location,
    };
    const ok = await saveToMongoDB(updated);
    if (ok) setIsProfileModalOpen(false);
  };

  // --- Work Experience Handlers ---
  const handleOpenAddExperience = () => {
    setEditingExperienceIndex(null);
    setExperienceForm({
      company: '',
      company_url: '',
      role: '',
      duration: '',
      details: '',
    });
    setIsExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (index: number) => {
    setEditingExperienceIndex(index);
    const exp = (resume.work_experience || [])[index];
    if (exp) {
      setExperienceForm({ ...exp });
      setIsExperienceModalOpen(true);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = [...(resume.work_experience || [])];
    if (editingExperienceIndex !== null) {
      list[editingExperienceIndex] = experienceForm;
    } else {
      list.unshift(experienceForm);
    }
    const updated: ResumeData = {
      ...resume,
      work_experience: list,
    };
    const ok = await saveToMongoDB(updated);
    if (ok) setIsExperienceModalOpen(false);
  };

  const handleDeleteExperience = async (index: number) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;
    const list = [...(resume.work_experience || [])];
    list.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      work_experience: list,
    };
    await saveToMongoDB(updated);
  };

  // --- Technical Skills Handlers ---
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    const skills = resume.technical_skills || {
      programming_languages: [],
      frameworks: [],
      ai_ml_libraries: [],
    };
    const currentList = skills[activeSkillCategory] || [];
    if (currentList.includes(trimmed)) {
      alert(`"${trimmed}" is already in this list.`);
      return;
    }
    const updatedSkills: TechnicalSkills = {
      ...skills,
      [activeSkillCategory]: [...currentList, trimmed],
    };
    const updated: ResumeData = {
      ...resume,
      technical_skills: updatedSkills,
    };
    const ok = await saveToMongoDB(updated);
    if (ok) {
      setNewSkillName('');
      setIsSkillModalOpen(false);
    }
  };

  const handleRemoveSkill = async (category: keyof TechnicalSkills, index: number) => {
    const skills = resume.technical_skills || {
      programming_languages: [],
      frameworks: [],
      ai_ml_libraries: [],
    };
    const currentList = [...(skills[category] || [])];
    currentList.splice(index, 1);
    const updatedSkills: TechnicalSkills = {
      ...skills,
      [category]: currentList,
    };
    const updated: ResumeData = {
      ...resume,
      technical_skills: updatedSkills,
    };
    await saveToMongoDB(updated);
  };

  // --- Soft Skills & Hobbies Handlers ---
  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTagText.trim();
    if (!trimmed) return;
    const currentList = resume[softSkillType] || [];
    if (currentList.includes(trimmed)) return;
    const updated: ResumeData = {
      ...resume,
      [softSkillType]: [...currentList, trimmed],
    };
    const ok = await saveToMongoDB(updated);
    if (ok) {
      setNewTagText('');
      setIsSoftSkillModalOpen(false);
    }
  };

  const handleRemoveTag = async (type: 'soft_skills' | 'hobbies', index: number) => {
    const currentList = [...(resume[type] || [])];
    currentList.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      [type]: currentList,
    };
    await saveToMongoDB(updated);
  };

  // --- Education Handler ---
  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ResumeData = {
      ...resume,
      degree: educationForm.degree,
      institution: educationForm.institution,
      graduation_year: educationForm.graduation_year,
      cgpa: educationForm.cgpa,
    };
    const ok = await saveToMongoDB(updated);
    if (ok) setIsEducationModalOpen(false);
  };

  const softSkills = resume.soft_skills?.length
    ? resume.soft_skills
    : ['Critical Thinking', 'Problem Solving', 'Creative Thinking'];

  const hobbies = resume.hobbies?.length
    ? resume.hobbies
    : ['Tech Exploration', 'Painting & Digital Art', 'Storytelling'];

  const technicalSkills = resume.technical_skills || {
    programming_languages: ['Python', 'JavaScript', 'C++', 'Java'],
    frameworks: ['React.js', 'FastAPI', 'Flask', 'Streamlit'],
    ai_ml_libraries: [
      'LangChain',
      'LangGraph',
      'OpenAI API',
      'PyTorch',
      'TensorFlow',
      'Keras',
      'OpenCV',
      'HuggingFace',
      'ChromaDB',
      'FastMCP',
      'Pydantic',
      'Selenium',
      'NLTK',
    ],
  };

  return (
    <div className={`w-full ${isStandalonePage ? 'max-w-5xl mx-auto px-6 py-20' : ''}`}>
      <header className="text-center mb-10 relative">
        {sectionPrefix ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            {sectionPrefix}
          </span>
        ) : isStandalonePage ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            BIOGRAPHY &amp; PROFILE
          </span>
        ) : null}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100 text-center">
          About
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          AI &amp; Data Science Engineer dedicated to constructing intelligent, scalable, and impact-driven technology.
        </p>

        {/* Admin Status Pill */}
        {isAdmin && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 font-code flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} className="text-amber-500 animate-pulse" />
              Admin Mode: Click any edit or add button to update Live MongoDB Atlas
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Soft Skills */}
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <div className="cyber-glass-card p-6 text-center relative group">
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setProfileForm({
                    name: resume.name || '',
                    title: resume.title || '',
                    about_bio: resume.about_bio || resume.summary || '',
                    email: resume.email || '',
                    phone: resume.phone || '',
                    location: resume.location || '',
                  });
                  setIsProfileModalOpen(true);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Edit Profile"
              >
                <Pencil size={12} /> Edit
              </button>
            )}

            <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
              <Image
                src="/images/van.jpg"
                alt={resume.name || 'Vandan Patel'}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-0.5">
              {resume.name || 'Vandan Patel'}
            </h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 font-code">
              {resume.title || 'AI & DATA SCIENCE ENGINEER'}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-5">
              {resume.about_bio ||
                resume.summary ||
                'Graduate in Artificial Intelligence & Data Science from A.D. Patel Institute of Technology. Experienced in LLM applications, RAG pipelines, and deep learning.'}
            </p>

            <div className="flex flex-col gap-2.5 text-left bg-slate-100/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <a
                  href={`mailto:${resume.email}`}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors underline truncate block"
                >
                  {resume.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <a
                  href={`tel:${resume.phone}`}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors block"
                >
                  {resume.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 truncate">{resume.location}</span>
              </div>
            </div>
          </div>

          {/* Soft Skills & Hobbies Card */}
          <div className="cyber-glass-card p-6">
            {/* Soft Skills */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lightbulb size={17} className="text-indigo-600 dark:text-indigo-400" /> Soft Skills &amp; Interests
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setSoftSkillType('soft_skills');
                    setNewTagText('');
                    setIsSoftSkillModalOpen(true);
                  }}
                  className="p-1 rounded bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[0.68rem] font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {softSkills.map((skill, i) => (
                <span key={i} className="cyber-badge group/tag inline-flex items-center gap-1">
                  <span>{skill}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag('soft_skills', i)}
                      disabled={isSaving}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Hobbies */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Palette size={17} className="text-purple-600 dark:text-purple-400" /> Hobbies
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setSoftSkillType('hobbies');
                    setNewTagText('');
                    setIsSoftSkillModalOpen(true);
                  }}
                  className="p-1 rounded bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-[0.68rem] font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, i) => (
                <span key={i} className="cyber-badge-violet group/tag inline-flex items-center gap-1">
                  <span>{hobby}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag('hobbies', i)}
                      disabled={isSaving}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Work Experience, Skills & Education */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Work Experience */}
          <div className="cyber-glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <Briefcase size={22} className="text-indigo-600 dark:text-indigo-400" /> Work Experience
              </h2>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddExperience}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Experience (Admin)
                </button>
              )}
            </div>

            <div className="space-y-6">
              {(resume.work_experience || []).map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-5 border-l-2 border-indigo-200 dark:border-indigo-900/60 group/exp"
                >
                  <span className="absolute left-[-0.38rem] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {exp.role} &middot;{' '}
                      {exp.company_url ? (
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-indigo-600 dark:text-indigo-400"
                        >
                          {exp.company} ↗
                        </a>
                      ) : (
                        <span className="text-indigo-600 dark:text-indigo-400">{exp.company}</span>
                      )}
                    </h3>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-0 group-hover/exp:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEditExperience(index)}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                          title="Edit Experience"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(index)}
                          className="p-1 rounded bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-500 cursor-pointer"
                          title="Delete Experience"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-semibold font-code text-slate-500 dark:text-slate-400 my-1">
                    {exp.duration}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Expertise Card */}
          <div className="cyber-glass-card p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2.5">
              <Code2 size={22} className="text-purple-600 dark:text-purple-400" /> Technical Expertise
            </h2>

            <div className="space-y-5">
              {/* Languages */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.75rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-code">
                    Languages
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSkillCategory('programming_languages');
                        setNewSkillName('');
                        setIsSkillModalOpen(true);
                      }}
                      className="p-1 rounded bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[0.68rem] font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={11} /> Add Skill
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.programming_languages.map((lang: string, i: number) => (
                    <span key={i} className="cyber-badge group/item inline-flex items-center gap-1">
                      <span>{lang}</span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('programming_languages', i)}
                          disabled={isSaving}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frameworks & Web */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.75rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-code">
                    Frameworks &amp; Web
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSkillCategory('frameworks');
                        setNewSkillName('');
                        setIsSkillModalOpen(true);
                      }}
                      className="p-1 rounded bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-[0.68rem] font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={11} /> Add Skill
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.frameworks.map((fw: string, i: number) => (
                    <span key={i} className="cyber-badge-violet group/item inline-flex items-center gap-1">
                      <span>{fw}</span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('frameworks', i)}
                          disabled={isSaving}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI / ML / Data Libraries */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.75rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-code">
                    AI / ML / Data Libraries
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSkillCategory('ai_ml_libraries');
                        setNewSkillName('');
                        setIsSkillModalOpen(true);
                      }}
                      className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[0.68rem] font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={11} /> Add Skill
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.ai_ml_libraries.map((lib: string, i: number) => (
                    <span key={i} className="cyber-badge-emerald group/item inline-flex items-center gap-1">
                      <span>{lib}</span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('ai_ml_libraries', i)}
                          disabled={isSaving}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer ml-0.5"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="cyber-glass-card p-6 md:p-8 relative">
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEducationForm({
                    degree: resume.degree || '',
                    institution: resume.institution || '',
                    graduation_year: resume.graduation_year || '',
                    cgpa: resume.cgpa || '',
                  });
                  setIsEducationModalOpen(true);
                }}
                className="absolute top-6 right-6 p-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Edit Education"
              >
                <Pencil size={12} /> Edit
              </button>
            )}

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2.5">
              <GraduationCap size={22} className="text-emerald-600 dark:text-emerald-400" /> Education
            </h2>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {resume.degree}
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mt-1">
                {resume.institution}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-medium font-code">
                {resume.graduation_year} &middot;{' '}
                <strong className="text-slate-900 dark:text-slate-100 font-bold">
                  CGPA: {resume.cgpa}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Edit Profile */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Bio &amp; Profile (MongoDB)
              </h3>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">About Bio</label>
                <textarea
                  rows={3}
                  required
                  value={profileForm.about_bio}
                  onChange={(e) => setProfileForm({ ...profileForm, about_bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
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
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Work Experience */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-600" />
                {editingExperienceIndex !== null ? 'Edit Work Experience' : 'Add New Work Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setIsExperienceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExperienceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Corp8.ai, eSparkBiz"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={experienceForm.company_url}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role / Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GenAI Engineer, Prompt Engineering Intern"
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. May 2025 – Oct 2025"
                  value={experienceForm.duration}
                  onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Details / Accomplishments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your contributions, tools used, and results achieved..."
                  value={experienceForm.details}
                  onChange={(e) => setExperienceForm({ ...experienceForm, details: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsExperienceModalOpen(false)}
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
                  <span>Save Experience to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Technical Skill */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-purple-600" />
                Add Skill to {activeSkillCategory === 'programming_languages' ? 'Languages' : activeSkillCategory === 'frameworks' ? 'Frameworks & Web' : 'AI / ML / Data Libraries'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSkillSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Skill / Library Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TypeScript, PyTorch, GraphQL"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newSkillName.trim()}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Soft Skill or Hobby */}
      {isSoftSkillModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-indigo-600" />
                Add {softSkillType === 'soft_skills' ? 'Soft Skill' : 'Hobby'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSoftSkillModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleTagSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={softSkillType === 'soft_skills' ? 'e.g. Critical Thinking' : 'e.g. Photography'}
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSoftSkillModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newTagText.trim()}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Edit Education */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600" />
                Edit Education (MongoDB Atlas)
              </h3>
              <button
                type="button"
                onClick={() => setIsEducationModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleEducationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Degree</label>
                <input
                  type="text"
                  required
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Graduation Year / Duration</label>
                <input
                  type="text"
                  required
                  value={educationForm.graduation_year}
                  onChange={(e) => setEducationForm({ ...educationForm, graduation_year: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CGPA</label>
                <input
                  type="text"
                  required
                  value={educationForm.cgpa}
                  onChange={(e) => setEducationForm({ ...educationForm, cgpa: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEducationModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
