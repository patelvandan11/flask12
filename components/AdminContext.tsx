'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AdminLoginModal from './AdminLoginModal';
import {
  ShieldCheck,
  LogOut,
  ChevronUp,
  PlusCircle,
  FileText,
  Palette,
  Layers,
  GitFork,
  X,
  Save,
  Loader2,
  Trash2,
  CheckCircle2,
  UploadCloud,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminContextType {
  isAdmin: boolean;
  openAdminModal: () => void;
  openAddProjectModal: () => void;
  openDeleteProjectsModal: () => void;
  openAddBlogModal: () => void;
  openDeleteBlogsModal: () => void;
  openAddArtModal: () => void;
  openAddExploreModal: () => void;
  logoutAdmin: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  openAdminModal: () => {},
  openAddProjectModal: () => {},
  openDeleteProjectsModal: () => {},
  openAddBlogModal: () => {},
  openDeleteBlogsModal: () => {},
  openAddArtModal: () => {},
  openAddExploreModal: () => {},
  logoutAdmin: async () => {},
  checkSession: async () => {},
});

export function getSafeImageUrl(src: string): string {
  if (!src) return '/images/full1.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/')) {
    return src;
  }
  return `/images/${src}`;
}

export function ImageDropzone({
  value,
  onChange,
  label = 'Project Image',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select or drop an image file (PNG, JPG, WEBP, GIF, SVG)');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64Data = e.target.result as string;
        try {
          // Upload directly to Cloudinary via serverless API
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileData: base64Data }),
          });

          const resData = await res.json();
          if (res.ok && resData.url) {
            onChange(resData.url);
          } else {
            onChange(base64Data);
          }
        } catch (uploadErr) {
          onChange(base64Data);
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="font-bold text-slate-700 dark:text-slate-300 block text-xs flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[0.65rem] text-indigo-500 font-code">Cloudinary Drag &amp; Drop Upload</span>
      </label>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/80 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {isUploading ? (
          <div className="flex items-center justify-center gap-2 py-3 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-code animate-pulse">
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading image to Cloudinary...</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 shadow-sm">
              <img
                src={getSafeImageUrl(value)}
                alt="Image Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/full1.png';
                }}
              />
            </div>
            <div className="text-left flex-1 min-w-0 font-code text-[0.68rem]">
              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                {value.includes('cloudinary.com') ? '☁️ Stored in Cloudinary CDN' : '✅ Image Uploaded'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 truncate block mt-0.5 max-w-[240px]">
                {value}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block mt-1 font-bold">
                Click or drop another image to replace
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-1">
            <div className="w-9 h-9 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud size={18} />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag &amp; Drop image here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
            </p>
            <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-code">
              Auto-uploads to Cloudinary CDN
            </p>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Or paste Cloudinary image URL directly (e.g. https://res.cloudinary.com/...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-code mt-1.5"
      />
    </div>
  );
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Dropdown Menu State
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Modals State
  const [activeModal, setActiveModal] = useState<
    'add-project' | 'delete-projects' | 'add-blog' | 'delete-blogs' | 'add-art' | 'add-explore' | null
  >(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // List Data for Delete Modals
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);

  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    img_src: '',
    github_url: '',
    live_demo: '',
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Vandan Patel',
    description: '',
    link: 'https://medium.com/@patelvandan11',
  });

  const [artForm, setArtForm] = useState({
    title: '',
    description: '',
    image_file: '',
  });

  const [exploreForm, setExploreForm] = useState({
    title: '',
    category: 'AI Experiment',
    tagline: '',
    description: '',
    longDescription: '',
    url: '',
    githubUrl: '',
    image: '',
  });

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(!!data.isAdmin);
      }
    } catch (err) {
      console.warn('Failed to check admin session');
    }
  };

  useEffect(() => {
    checkSession();

    // Secret trigger: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    // Close dropdown on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openAdminModal = () => setIsLoginModalOpen(true);

  const logoutAdmin = async () => {
    try {
      await fetch('/api/admin/session', { method: 'POST' });
      setIsAdmin(false);
      setIsDropdownOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Openers for Global Modals
  const openAddProjectModal = () => {
    setProjectForm({ title: '', description: '', img_src: '', github_url: '', live_demo: '' });
    setIsDropdownOpen(false);
    setActiveModal('add-project');
  };

  const openDeleteProjectsModal = async () => {
    setIsDropdownOpen(false);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjectsList(await res.json());
    } catch (e) {}
    setActiveModal('delete-projects');
  };

  const openAddBlogModal = () => {
    setBlogForm({
      title: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Vandan Patel',
      description: '',
      link: 'https://medium.com/@patelvandan11',
    });
    setIsDropdownOpen(false);
    setActiveModal('add-blog');
  };

  const openDeleteBlogsModal = async () => {
    setIsDropdownOpen(false);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) setBlogsList(await res.json());
    } catch (e) {}
    setActiveModal('delete-blogs');
  };

  const openAddArtModal = () => {
    setArtForm({ title: '', description: '', image_file: '' });
    setIsDropdownOpen(false);
    setActiveModal('add-art');
  };

  const openAddExploreModal = () => {
    setExploreForm({
      title: '',
      category: 'AI Experiment',
      tagline: '',
      description: '',
      longDescription: '',
      url: '',
      githubUrl: '',
      image: '',
    });
    setIsDropdownOpen(false);
    setActiveModal('add-explore');
  };

  // Delete Action Handlers
  const handleDeleteProjectItem = async (index: number) => {
    const itemToDelete = projectsList[index];
    if (!confirm(`Are you sure you want to delete project "${itemToDelete.title}" from MongoDB?`)) return;

    const updated = projectsList.filter((_, i) => i !== index);
    setProjectsList(updated);

    try {
      await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updated }),
      });
      router.refresh();
    } catch (e) {
      alert('Failed to delete project');
    }
  };

  const handleDeleteBlogItem = async (index: number) => {
    const itemToDelete = blogsList[index];
    if (!confirm(`Are you sure you want to delete blog "${itemToDelete.title}" from MongoDB?`)) return;

    const updated = blogsList.filter((_, i) => i !== index);
    setBlogsList(updated);

    try {
      await fetch('/api/blog/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updated }),
      });
      router.refresh();
    } catch (e) {
      alert('Failed to delete blog article');
    }
  };

  // Submit Handlers (Save to MongoDB Atlas)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const getRes = await fetch('/api/projects');
      const currentList = getRes.ok ? await getRes.json() : [];

      const newProjectItem = {
        title: projectForm.title,
        description: projectForm.description,
        img_src: projectForm.img_src || '/images/full1.png',
        img_srcset: projectForm.img_src || '/images/full1.png',
        url: projectForm.github_url || projectForm.live_demo || 'https://github.com/patelvandan11',
        urlw: projectForm.live_demo || projectForm.github_url || 'https://github.com/patelvandan11',
        github_url: projectForm.github_url || null,
        live_demo: projectForm.live_demo || null,
      };

      const updatedList = [newProjectItem, ...currentList];

      const saveRes = await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedList }),
      });

      if (saveRes.ok) {
        setSaveSuccessMsg('Project saved to MongoDB successfully!');
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setActiveModal(null);
          router.push('/projects');
          router.refresh();
        }, 1200);
      } else {
        alert('Failed to save project to MongoDB');
      }
    } catch (err) {
      alert('Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const getRes = await fetch('/api/blog');
      const currentList = getRes.ok ? await getRes.json() : [];

      const newBlogItem = {
        id: Date.now(),
        title: blogForm.title,
        date: blogForm.date,
        author: blogForm.author,
        description: blogForm.description,
        link: blogForm.link,
      };

      const updatedList = [newBlogItem, ...currentList];

      const saveRes = await fetch('/api/blog/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedList }),
      });

      if (saveRes.ok) {
        setSaveSuccessMsg('Blog article saved to MongoDB successfully!');
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setActiveModal(null);
          router.push('/blog');
          router.refresh();
        }, 1200);
      } else {
        alert('Failed to save blog to MongoDB');
      }
    } catch (err) {
      alert('Error saving blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const getRes = await fetch('/api/art');
      const currentList = getRes.ok ? await getRes.json() : [];

      const newArtItem = {
        title: artForm.title,
        description: artForm.description,
        image_file: artForm.image_file || 'art1.jpg',
      };

      const updatedList = [newArtItem, ...currentList];

      const saveRes = await fetch('/api/art/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedList }),
      });

      if (saveRes.ok) {
        setSaveSuccessMsg('Artwork saved to MongoDB successfully!');
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setActiveModal(null);
          router.push('/art');
          router.refresh();
        }, 1200);
      } else {
        alert('Failed to save artwork to MongoDB');
      }
    } catch (err) {
      alert('Error saving artwork');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const getRes = await fetch('/api/explorations');
      const currentList = getRes.ok ? await getRes.json() : [];

      const newId = `exp_${Date.now().toString().slice(-5)}`;
      const newExploreItem = {
        id: newId,
        title: exploreForm.title,
        category: exploreForm.category || 'AI Experiment',
        tagline: exploreForm.tagline || exploreForm.title,
        description: exploreForm.description,
        longDescription: exploreForm.longDescription || exploreForm.description,
        url: exploreForm.url || 'https://github.com/patelvandan11',
        githubUrl: exploreForm.githubUrl || 'https://github.com/patelvandan11',
        buttonText: 'Explore',
        featured: false,
        previewType: 'default',
        badgeStyle: 'cyber-badge',
        accentGradient: 'from-indigo-600 via-purple-500 to-emerald-600',
        cardGlow: 'indigo',
        images: [exploreForm.image || '/images/AI_civic.png'],
        features: ['Interactive System Architecture', 'Dynamic Flowchart Node Graph', 'Cloud Sync & Telemetry'],
        techStack: ['Python', 'FastAPI', 'Next.js', 'MongoDB', 'Tailwind CSS'],
        diagram: {
          diagramType: 'components',
          runtimeLabel: `${exploreForm.title} Runtime`,
          title: `Components of ${exploreForm.title}`,
          subtitle: exploreForm.description,
          connectionLabel: 'connects to',
          subsystems: [
            {
              id: 'core_module',
              title: 'System Core Engine',
              icon: 'brain',
              badgeColor: 'mint',
              sections: [
                {
                  sectionTitle: 'Core Logic',
                  blocks: [
                    { id: 'b1', label: 'Processing Unit', subtext: 'System Engine', color: 'mint' },
                    { id: 'b2', label: 'State Sync', subtext: 'Telemetry Buffer', color: 'mint' },
                  ],
                },
              ],
            },
          ],
        },
      };

      const updatedList = [newExploreItem, ...currentList];

      const saveRes = await fetch('/api/explorations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedList }),
      });

      if (saveRes.ok) {
        setSaveSuccessMsg('Explore Experiment saved to MongoDB successfully!');
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setActiveModal(null);
          router.push('/explore');
          router.refresh();
        }, 1200);
      } else {
        alert('Failed to save experiment to MongoDB');
      }
    } catch (err) {
      alert('Error saving explore experiment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        openAdminModal,
        openAddProjectModal,
        openDeleteProjectsModal,
        openAddBlogModal,
        openDeleteBlogsModal,
        openAddArtModal,
        openAddExploreModal,
        logoutAdmin,
        checkSession,
      }}
    >
      {children}

      {/* Admin Secret Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setIsLoginModalOpen(false);
        }}
      />

      {/* FLOATING ADMIN PILL WITH DROPDOWN MENU */}
      {isAdmin && (
        <div ref={dropdownRef} className="fixed bottom-5 left-5 z-[3000] flex flex-col items-start font-sans">
          {/* Dropdown Popup Menu */}
          {isDropdownOpen && (
            <div className="mb-3 w-72 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-2 space-y-1 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs">
              <div className="px-3 py-2 border-b border-slate-800 text-[0.68rem] font-bold font-code text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                <span>Admin Control Menu</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* 1. PROJECTS */}
              <button
                onClick={openAddProjectModal}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:text-white hover:bg-indigo-600/60 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Layers size={14} className="text-indigo-400 shrink-0" />
                <span>Add Project (Cloudinary)</span>
              </button>

              <button
                onClick={openDeleteProjectsModal}
                className="w-full px-3 py-2 rounded-xl text-left text-red-300 hover:text-white hover:bg-red-600/50 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Trash2 size={14} className="text-red-400 shrink-0" />
                <span>Delete / Manage Projects</span>
              </button>

              {/* 2. BLOGS */}
              <button
                onClick={openAddBlogModal}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:text-white hover:bg-purple-600/60 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <FileText size={14} className="text-purple-400 shrink-0" />
                <span>Add Blog Article</span>
              </button>

              <button
                onClick={openDeleteBlogsModal}
                className="w-full px-3 py-2 rounded-xl text-left text-red-300 hover:text-white hover:bg-red-600/50 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Trash2 size={14} className="text-red-400 shrink-0" />
                <span>Delete / Manage Blogs</span>
              </button>

              {/* 3. ARTWORK */}
              <button
                onClick={openAddArtModal}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:text-white hover:bg-rose-600/60 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Palette size={14} className="text-rose-400 shrink-0" />
                <span>Add Artwork (Cloudinary)</span>
              </button>

              {/* 4. EXPLORE EXPERIMENT */}
              <button
                onClick={openAddExploreModal}
                className="w-full px-3 py-2 rounded-xl text-left text-amber-300 hover:text-white hover:bg-amber-600/60 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400 shrink-0" />
                <span>Add Explore Experiment</span>
              </button>

              {/* 5. FLOWCHARTS */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push('/explore');
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:text-white hover:bg-emerald-600/60 font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <GitFork size={14} className="text-emerald-400 shrink-0" />
                <span>Manage Flowchart Canvas</span>
              </button>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={logoutAdmin}
                  className="w-full px-3 py-1.5 rounded-xl text-left text-red-400 hover:text-white hover:bg-red-600/80 font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Exit Admin Mode</span>
                </button>
              </div>
            </div>
          )}

          {/* Floating Pill Trigger Bar */}
          <div className="flex items-center gap-1.5 p-2 px-3.5 bg-slate-900/95 text-white rounded-full shadow-2xl border border-indigo-500/50 backdrop-blur-md">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:text-indigo-300 transition-colors cursor-pointer group"
              title="Click to toggle Admin Menu"
            >
              <ShieldCheck size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold font-code tracking-wide">ADMIN MODE</span>
              <ChevronUp
                size={14}
                className={`text-indigo-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <button
              onClick={logoutAdmin}
              className="ml-1 px-2.5 py-1 text-[0.7rem] bg-red-600/80 hover:bg-red-600 rounded-full text-white font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              title="Log Out Admin Mode"
            >
              <LogOut size={12} /> Exit
            </button>
          </div>
        </div>
      )}

      {/* 1. GLOBAL ADD PROJECT MODAL */}
      {activeModal === 'add-project' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Project</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Saves directly to MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                <CheckCircle2 size={18} />
                <span>{saveSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scalable AI Platform"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide overview of architecture & purpose"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <ImageDropzone
                  label="Project Screenshot / Cover Image"
                  value={projectForm.img_src}
                  onChange={(url) => setProjectForm({ ...projectForm, img_src: url })}
                />

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/patelvandan11/your-repo"
                    value={projectForm.github_url}
                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://your-app.vercel.app/"
                    value={projectForm.live_demo}
                    onChange={(e) => setProjectForm({ ...projectForm, live_demo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Project to MongoDB Atlas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. GLOBAL DELETE PROJECTS MODAL */}
      {activeModal === 'delete-projects' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete / Manage Projects</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Deletes directly from MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-code">
              {projectsList.length === 0 ? (
                <p className="text-center py-6 text-slate-500">No projects found in database.</p>
              ) : (
                projectsList.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">{p.title}</span>
                      <span className="text-[0.68rem] text-slate-500 truncate block">{p.description}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteProjectItem(idx)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. GLOBAL ADD BLOG MODAL */}
      {activeModal === 'add-blog' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Blog Article</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Saves directly to MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                <CheckCircle2 size={18} />
                <span>{saveSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveBlog} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fine-Tuning LLMs & PEFT Strategies"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Publication Date</label>
                  <input
                    type="text"
                    required
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Summary / Abstract</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Summary of technical concepts covered in article..."
                    value={blogForm.description}
                    onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Article Link (Medium / Hashnode)</label>
                  <input
                    type="text"
                    required
                    placeholder="https://medium.com/@patelvandan11/your-article"
                    value={blogForm.link}
                    onChange={(e) => setBlogForm({ ...blogForm, link: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Article to MongoDB Atlas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. GLOBAL DELETE BLOGS MODAL */}
      {activeModal === 'delete-blogs' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete / Manage Blogs</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Deletes directly from MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-code">
              {blogsList.length === 0 ? (
                <p className="text-center py-6 text-slate-500">No blog articles found in database.</p>
              ) : (
                blogsList.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">{b.title}</span>
                      <span className="text-[0.68rem] text-slate-500 truncate block">{b.date} &bull; {b.author}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteBlogItem(idx)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. GLOBAL ADD ARTWORK MODAL */}
      {activeModal === 'add-art' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Artwork</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Saves directly to MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                <CheckCircle2 size={18} />
                <span>{saveSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveArt} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Artwork Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Nebula"
                    value={artForm.title}
                    onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <ImageDropzone
                  label="Artwork Image"
                  value={artForm.image_file}
                  onChange={(url) => setArtForm({ ...artForm, image_file: url })}
                />

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Visual description of the painting or digital artwork..."
                    value={artForm.description}
                    onChange={(e) => setArtForm({ ...artForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Artwork to MongoDB Atlas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. GLOBAL ADD EXPLORE EXPERIMENT MODAL */}
      {activeModal === 'add-explore' && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Explore Experiment</h3>
                  <p className="text-[0.68rem] text-slate-500 font-code">Appears on /explore &amp; MongoDB</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                <CheckCircle2 size={18} />
                <span>{saveSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveExplore} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Experiment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Agent Telemetry Engine"
                    value={exploreForm.title}
                    onChange={(e) => setExploreForm({ ...exploreForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category &amp; Tagline</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Category (e.g. AI Vision)"
                      value={exploreForm.category}
                      onChange={(e) => setExploreForm({ ...exploreForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                    />
                    <input
                      type="text"
                      placeholder="Tagline (e.g. Real-Time Neural Net)"
                      value={exploreForm.tagline}
                      onChange={(e) => setExploreForm({ ...exploreForm, tagline: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short overview shown on card..."
                    value={exploreForm.description}
                    onChange={(e) => setExploreForm({ ...exploreForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>

                <ImageDropzone
                  label="Experiment Cover Image"
                  value={exploreForm.image}
                  onChange={(url) => setExploreForm({ ...exploreForm, image: url })}
                />

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Live URL / GitHub URL</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="https://your-demo.vercel.app/"
                      value={exploreForm.url}
                      onChange={(e) => setExploreForm({ ...exploreForm, url: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                    />
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={exploreForm.githubUrl}
                      onChange={(e) => setExploreForm({ ...exploreForm, githubUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Experiment to MongoDB Atlas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
