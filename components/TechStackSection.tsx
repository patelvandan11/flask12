'use client';

import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { StackSection } from '@/types/portfolio';
import { Plus, X, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface TechStackSectionProps {
  stack?: StackSection;
  onAddItem: (category: keyof StackSection, item: string) => Promise<boolean>;
  onRemoveItem: (category: keyof StackSection, index: number) => Promise<boolean>;
  isSaving?: boolean;
}

const DEFAULT_STACK: StackSection = {
  ai_ml: [
    'PyTorch',
    'TensorFlow',
    'LangChain',
    'LangGraph',
    'scikit-learn',
    'XGBoost',
    'OpenCV',
    'HuggingFace',
  ],
  data: [
    'PostgreSQL',
    'MongoDB',
    'Neo4j graph',
    'Qdrant',
    'ChromaDB',
    'FAISS',
    'Pandas / NumPy',
  ],
  backend: [
    'Python',
    'FastAPI',
    'Flask / Django',
    'REST / ORM',
    'Microservices',
    'JavaScript / TS',
    'React / Next.js',
  ],
  infra: [
    'Docker',
    'Kubernetes',
    'AWS',
    'Databricks',
    'Supabase',
    'Git / GitHub',
    'Postman / FastMCP',
  ],
};

export default function TechStackSection({
  stack = DEFAULT_STACK,
  onAddItem,
  onRemoveItem,
  isSaving = false,
}: TechStackSectionProps) {
  const { isAdmin } = useAdmin();
  const [activeCategoryModal, setActiveCategoryModal] = useState<keyof StackSection | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeStack: StackSection = {
    ai_ml: stack.ai_ml?.length ? stack.ai_ml : DEFAULT_STACK.ai_ml,
    data: stack.data?.length ? stack.data : DEFAULT_STACK.data,
    backend: stack.backend?.length ? stack.backend : DEFAULT_STACK.backend,
    infra: stack.infra?.length ? stack.infra : DEFAULT_STACK.infra,
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategoryModal || !newItemName.trim()) return;
    setSubmitting(true);
    const success = await onAddItem(activeCategoryModal, newItemName.trim());
    setSubmitting(false);
    if (success) {
      setNewItemName('');
      setActiveCategoryModal(null);
    }
  };

  const categoryTitles: Record<keyof StackSection, string> = {
    ai_ml: 'AI & ML',
    data: 'DATA',
    backend: 'BACKEND',
    infra: 'INFRA',
  };

  return (
    <section id="stack" className="scroll-mt-28 py-4 relative">
      {/* Header & Precision Ruler Ticks Bar */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center text-[0.72rem] font-code tracking-widest text-slate-500 dark:text-slate-400 mb-2 uppercase">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">02 / 06</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">STACK</span>
          </div>
          <div className="flex items-center gap-3">
            <span>WHAT I REACH FOR</span>
            {isAdmin && (
              <span className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 font-code flex items-center gap-1">
                <Sparkles size={11} /> Admin Editable (MongoDB)
              </span>
            )}
          </div>
        </div>

        {/* Precision Ruler Ticks Line */}
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
          {/* 1. AI & ML Column */}
          <div className="cyber-glass-card p-5 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-indigo-200/70 dark:border-indigo-900/40 pb-2 mb-3">
                <h4 className="text-xs font-bold font-code tracking-wider text-indigo-700 dark:text-indigo-400 uppercase">
                  AI &amp; ML
                </h4>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryModal('ai_ml')}
                    className="p-1 rounded-md bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer text-[0.68rem] font-bold flex items-center gap-0.5"
                    title="Add technology to AI & ML"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {activeStack.ai_ml.map((item, idx) => (
                  <li
                    key={idx}
                    className="group/item flex items-center justify-between hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem('ai_ml', idx)}
                        disabled={isSaving}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                        title={`Remove ${item}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. DATA Column */}
          <div className="cyber-glass-card p-5 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900/90 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-200/70 dark:border-emerald-900/40 pb-2 mb-3">
                <h4 className="text-xs font-bold font-code tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
                  DATA
                </h4>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryModal('data')}
                    className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer text-[0.68rem] font-bold flex items-center gap-0.5"
                    title="Add technology to DATA"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {activeStack.data.map((item, idx) => (
                  <li
                    key={idx}
                    className="group/item flex items-center justify-between hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem('data', idx)}
                        disabled={isSaving}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                        title={`Remove ${item}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. BACKEND Column */}
          <div className="cyber-glass-card p-5 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 dark:from-purple-950/30 dark:via-slate-900/90 dark:to-pink-950/20 border-purple-100 dark:border-purple-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-purple-200/70 dark:border-purple-900/40 pb-2 mb-3">
                <h4 className="text-xs font-bold font-code tracking-wider text-purple-700 dark:text-purple-400 uppercase">
                  BACKEND
                </h4>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryModal('backend')}
                    className="p-1 rounded-md bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer text-[0.68rem] font-bold flex items-center gap-0.5"
                    title="Add technology to BACKEND"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {activeStack.backend.map((item, idx) => (
                  <li
                    key={idx}
                    className="group/item flex items-center justify-between hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem('backend', idx)}
                        disabled={isSaving}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                        title={`Remove ${item}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. INFRA Column */}
          <div className="cyber-glass-card p-5 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-slate-900/90 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-200/70 dark:border-amber-900/40 pb-2 mb-3">
                <h4 className="text-xs font-bold font-code tracking-wider text-amber-700 dark:text-amber-400 uppercase">
                  INFRA
                </h4>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryModal('infra')}
                    className="p-1 rounded-md bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300 transition-colors cursor-pointer text-[0.68rem] font-bold flex items-center gap-0.5"
                    title="Add technology to INFRA"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {activeStack.infra.map((item, idx) => (
                  <li
                    key={idx}
                    className="group/item flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem('infra', idx)}
                        disabled={isSaving}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                        title={`Remove ${item}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Technology to Category */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-[3600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-indigo-600" />
                Add to {categoryTitles[activeCategoryModal]}
              </h3>
              <button
                type="button"
                onClick={() => setActiveCategoryModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Technology / Tool Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ollama, Redis, Kafka, Rust"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newItemName.trim()}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Add to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
