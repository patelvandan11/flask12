'use client';

import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { ResumeData } from '@/types/portfolio';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  BookOpen,
  Code2,
  Pencil,
  X,
  Save,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ContactSectionProps {
  resume: ResumeData;
  onSave?: (updated: ResumeData) => Promise<boolean>;
  isSaving?: boolean;
  sectionPrefix?: string;
  isStandalonePage?: boolean;
}

export default function ContactSection({
  resume,
  onSave,
  isSaving = false,
  sectionPrefix = '06 / TALK & CONTACT',
  isStandalonePage = false,
}: ContactSectionProps) {
  const { isAdmin } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: resume.email || '',
    phone: resume.phone || '',
    location: resume.location || '',
    github: resume.links?.github || '',
    linkedin: resume.links?.linkedin || '',
    hashnode: resume.links?.hashnode || '',
    leetcode: resume.links?.leetcode || '',
    medium: resume.links?.medium || '',
  });

  const socialLinkClasses =
    'w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 shadow-sm bg-white/80 dark:bg-slate-800/70';

  const handleOpenModal = () => {
    setFormData({
      email: resume.email || '',
      phone: resume.phone || '',
      location: resume.location || '',
      github: resume.links?.github || '',
      linkedin: resume.links?.linkedin || '',
      hashnode: resume.links?.hashnode || '',
      leetcode: resume.links?.leetcode || '',
      medium: resume.links?.medium || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;

    const updated: ResumeData = {
      ...resume,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      links: {
        ...resume.links,
        github: formData.github,
        linkedin: formData.linkedin,
        hashnode: formData.hashnode,
        leetcode: formData.leetcode,
        medium: formData.medium,
      },
    };

    const ok = await onSave(updated);
    if (ok) {
      setIsModalOpen(false);
    }
  };

  return (
    <section id="contact" className={`scroll-mt-28 ${isStandalonePage ? 'py-12' : ''}`}>
      <div className="text-center mb-8 relative">
        {sectionPrefix && (
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
            {sectionPrefix}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Get in Touch
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Have a project idea, AI opportunity, or collaboration inquiry? Feel free to reach out directly.
        </p>

        {isAdmin && onSave && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pencil size={12} /> Edit Contact Info (Admin &middot; MongoDB)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Contact Information Card */}
        <div className="cyber-glass-card p-5 flex flex-col justify-between min-h-[300px] bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 font-code uppercase">
              Contact Information
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Open to full-time roles, freelance projects, AI consulting, and research collaborations.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase font-code">
                    Email
                  </span>
                  <a
                    href={`mailto:${resume.email}`}
                    className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline block truncate"
                  >
                    {resume.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase font-code">
                    Phone
                  </span>
                  <a
                    href={`tel:${resume.phone}`}
                    className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline block"
                  >
                    {resume.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase font-code">
                    Location
                  </span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                    {resume.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 mt-5">
            <div className="flex gap-2 justify-center flex-wrap">
              {resume.links?.github && (
                <a
                  href={resume.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="GitHub"
                >
                  <Github size={15} />
                </a>
              )}
              {resume.links?.hashnode && (
                <a
                  href={resume.links.hashnode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="Hashnode"
                >
                  <BookOpen size={15} />
                </a>
              )}
              {resume.links?.linkedin && (
                <a
                  href={resume.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              )}
              {resume.links?.leetcode && (
                <a
                  href={resume.links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="LeetCode"
                >
                  <Code2 size={15} />
                </a>
              )}
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
              <input
                type="text"
                id="name"
                name="name"
                className="cyber-input text-xs"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="cyber-input text-xs"
                placeholder="e.g. john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="cyber-input text-xs"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button type="submit" className="cyber-btn-primary w-full text-xs py-2.5">
              Send Message <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pencil size={15} className="text-indigo-600" />
                Edit Contact Info (MongoDB Atlas)
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Social URLs</span>
                <div>
                  <label className="text-[0.7rem] text-slate-500 block mb-0.5">GitHub</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-500 block mb-0.5">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-500 block mb-0.5">LeetCode</label>
                  <input
                    type="url"
                    value={formData.leetcode}
                    onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-500 block mb-0.5">Hashnode</label>
                  <input
                    type="url"
                    value={formData.hashnode}
                    onChange={(e) => setFormData({ ...formData, hashnode: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-slate-500 block mb-0.5">Medium</label>
                  <input
                    type="url"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
