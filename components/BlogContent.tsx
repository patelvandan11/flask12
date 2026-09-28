'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types/portfolio';
import { useAdmin } from './AdminContext';
import { Calendar, User, ExternalLink, Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

interface BlogContentProps {
  initialPosts: BlogPost[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const { isAdmin } = useAdmin();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BlogPost>({
    id: Date.now(),
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Vandan Patel',
    description: '',
    link: '',
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch blog live:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      id: Date.now(),
      title: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Vandan Patel',
      description: '',
      link: 'https://medium.com/@patelvandan11',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...posts[index] });
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm(`Are you sure you want to delete "${posts[index].title}"?`)) return;

    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    await saveToMongo(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updated: BlogPost[];
    if (editingIndex !== null) {
      updated = [...posts];
      updated[editingIndex] = formData;
    } else {
      updated = [formData, ...posts];
    }

    setPosts(updated);
    const success = await saveToMongo(updated);
    setIsSaving(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const saveToMongo = async (dataToSave: BlogPost[]) => {
    try {
      const res = await fetch('/api/blog/save', {
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
          Technical <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Articles</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          In-depth guides and articles on LLM fine-tuning, RAG architecture, backpropagation, and foundation models.
        </p>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={16} /> Add Article (Admin)
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <article key={idx} className="cyber-glass-card p-6 flex flex-col justify-between relative group">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                <button
                  onClick={() => handleOpenEdit(idx)}
                  className="p-1.5 text-slate-300 hover:text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer"
                  title="Edit Article"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 text-slate-300 hover:text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center gap-4 text-[0.75rem] font-semibold text-text-muted mb-3.5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-cyber-cyan" /> {post.date}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <User size={13} className="text-cyber-violet" /> {post.author}
                </span>
              </div>

              <h2 className="text-lg font-bold leading-snug mb-3 text-text-primaryLight dark:text-text-primaryDark hover:text-cyber-cyan transition-colors duration-150">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h2>

              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-6">
                {post.description}
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs py-2.5"
              >
                Read Full Article on Medium <ExternalLink size={13} className="ml-1.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingIndex !== null ? 'Edit Article' : 'Add New Article'}
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date (e.g. Mar 10, 2026)</label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description / Summary</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Article Link (Medium / Hashnode)</label>
                <input
                  type="text"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
                  <span>{editingIndex !== null ? 'Save Changes to MongoDB' : 'Add Article to MongoDB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
