'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArtItem } from '@/types/portfolio';
import { useAdmin, getSafeImageUrl, ImageDropzone } from './AdminContext';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

interface ArtContentProps {
  initialArtworks: ArtItem[];
}

export default function ArtContent({ initialArtworks }: ArtContentProps) {
  const { isAdmin } = useAdmin();
  const [artworks, setArtworks] = useState<ArtItem[]>(initialArtworks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ArtItem>({
    title: '',
    description: '',
    image_file: 'art1.jpg',
  });

  useEffect(() => {
    fetchArt();
  }, []);

  const fetchArt = async () => {
    try {
      const res = await fetch('/api/art');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArtworks(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch art live:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      description: '',
      image_file: 'art1.jpg',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...artworks[index] });
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm(`Are you sure you want to delete "${artworks[index].title}"?`)) return;

    const updated = artworks.filter((_, i) => i !== index);
    setArtworks(updated);
    await saveToMongo(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updated: ArtItem[];
    if (editingIndex !== null) {
      updated = [...artworks];
      updated[editingIndex] = formData;
    } else {
      updated = [formData, ...artworks];
    }

    setArtworks(updated);
    const success = await saveToMongo(updated);
    setIsSaving(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const saveToMongo = async (dataToSave: ArtItem[]) => {
    try {
      const res = await fetch('/api/art/save', {
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
          Visual <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Creations</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding.
        </p>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={16} /> Add Artwork (Admin)
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((art, idx) => (
          <article key={idx} className="cyber-glass-card relative overflow-hidden aspect-[4/3] group cursor-pointer border border-black/10 dark:border-white/10 rounded-2xl shadow-md">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                <button
                  onClick={() => handleOpenEdit(idx)}
                  className="p-1.5 text-slate-300 hover:text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer"
                  title="Edit Artwork"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 text-slate-300 hover:text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Artwork"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            <div className="relative w-full h-full">
              <img
                src={getSafeImageUrl(art.image_file)}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/art1.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <h3 className="text-sm font-bold text-white mb-1">
                  {art.title}
                </h3>
                <p className="text-[0.78rem] text-white/80 leading-relaxed">
                  {art.description}
                </p>
              </div>
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
                {editingIndex !== null ? 'Edit Artwork' : 'Add New Artwork'}
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Artwork Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                />
              </div>

              <ImageDropzone
                label="Artwork Image"
                value={formData.image_file}
                onChange={(url) => setFormData({ ...formData, image_file: url })}
              />

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

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{editingIndex !== null ? 'Save Changes to MongoDB' : 'Add Artwork to MongoDB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
