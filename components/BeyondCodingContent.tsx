'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { BeyondCodingData, PlannerMemory, MonthScrapbook, PlannerSticker } from '@/types/portfolio';
import { useAdmin, getSafeImageUrl, ImageDropzone } from './AdminContext';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Sparkles,
  Camera,
  Heart,
  Calendar as CalendarIcon,
  MapPin,
  Smile,
  Sun,
  Coffee,
  Volume2,
  VolumeX,
  Languages,
  Play,
  Pause,
  Layers,
} from 'lucide-react';

interface BeyondCodingContentProps {
  initialData?: BeyondCodingData;
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const DAYS_HEADER_ES = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
const DAYS_HEADER_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const STICKER_ICONS: Record<string, string> = {
  sun: '☀️',
  smiley: '😊',
  sparkle: '✨',
  coffee: '☕',
  cat: '🐱',
  flower: '🌺',
  pizza: '🍕',
  camera: '📷',
  art: '🎨',
  heart: '💛',
  plant: '🌿',
  pin: '📌',
  tape: '🏷️',
  star: '⭐',
};

export default function BeyondCodingContent({ initialData }: BeyondCodingContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<BeyondCodingData>(initialData || {
    year: 2026,
    title: 'Beyond Coding — Digital Scrapbook & Planner',
    subtitle: 'A soft, cozy memory calendar capturing everyday moments, art, travels, and little joys beyond software engineering.',
    months: [],
    memories: [],
  });

  const [selectedMonth, setSelectedMonth] = useState<number>(12); // Default to December as in screenshot
  const [selectedYear, setSelectedYear] = useState<number>(data.year || 2026);
  const [language, setLanguage] = useState<'es' | 'en'>('es'); // Default to Spanish to match screenshot
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<PlannerMemory | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);
  const [isLightboxSlideshowPlaying, setIsLightboxSlideshowPlaying] = useState<boolean>(true);
  const [slideTick, setSlideTick] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Admin Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

  // Form State
  const [formMonth, setFormMonth] = useState<number>(12);
  const [formDay, setFormDay] = useState<number>(1);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formNote, setFormNote] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>('');
  const [formSticker, setFormSticker] = useState<string>('sparkle');
  const [formStickerText, setFormStickerText] = useState<string>('');
  const [formTapeColor, setFormTapeColor] = useState<'gold' | 'pink' | 'mint' | 'kraft' | 'lavender'>('gold');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formMood, setFormMood] = useState<string>('Joyful');

  const plannerSheetRef = useRef<HTMLDivElement>(null);

  // Global 2-second slideshow ticker for days with multiple photos
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Lightbox 2-second slideshow ticker
  useEffect(() => {
    if (!selectedMemory || !isLightboxSlideshowPlaying) return;
    const photos: string[] = [];
    if (selectedMemory.images && Array.isArray(selectedMemory.images)) {
      selectedMemory.images.forEach((img) => {
        if (img && !photos.includes(img)) photos.push(img);
      });
    }
    if (selectedMemory.imageUrl && !photos.includes(selectedMemory.imageUrl)) {
      photos.push(selectedMemory.imageUrl);
    }
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      setLightboxPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [selectedMemory, isLightboxSlideshowPlaying]);

  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    try {
      const res = await fetch('/api/beyond-coding');
      if (res.ok) {
        const liveData = await res.json();
        if (liveData && liveData.memories) {
          setData(liveData);
          if (liveData.year) setSelectedYear(liveData.year);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch beyond coding data live:', err);
    }
  };

  const saveToMongoDB = async (updated: BeyondCodingData): Promise<boolean> => {
    setIsSaving(true);
    setData(updated);
    try {
      const res = await fetch('/api/beyond-coding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updated }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        return true;
      } else {
        alert(resData.error || 'Failed to save planner data to MongoDB.');
        return false;
      }
    } catch (err) {
      alert('Network error while saving to MongoDB.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Month navigation
  const prevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Calendar Grid Calculation
  const calendarDays = useMemo(() => {
    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    // In LUN - DOM format: Monday is 0, Sunday is 6
    const startOffset = (firstDay + 6) % 7;
    const totalDaysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const days = [];
    // Leading blanks
    for (let i = 0; i < startOffset; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }
    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({ dayNumber: d, isCurrentMonth: true });
    }
    // Trailing blanks: ALWAYS fill to exactly 42 cells (6 full rows x 7 days)
    // so every single month has identical 6-row geometry, height, and layout in fullscreen mode!
    while (days.length < 42) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }
    return days;
  }, [selectedYear, selectedMonth]);

  // Memories for current month indexed by day
  const monthMemoriesMap = useMemo(() => {
    const map = new Map<number, PlannerMemory[]>();
    (data.memories || []).forEach((m) => {
      if (m.month === selectedMonth && (m.year === selectedYear || !m.year)) {
        const list = map.get(m.day) || [];
        list.push(m);
        map.set(m.day, list);
      }
    });
    return map;
  }, [data.memories, selectedMonth, selectedYear]);

  // Handle Day Click
  const handleDayClick = (dayNumber: number) => {
    const memories = monthMemoriesMap.get(dayNumber);
    if (memories && memories.length > 0) {
      setSelectedMemory(memories[0]);
      setLightboxPhotoIndex(0);
      setIsLightboxSlideshowPlaying(true);
      if (memories[0].day === 31 || memories[0].stickerText?.includes('happy new year')) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else if (isAdmin) {
      openAddMemoryModal(dayNumber);
    }
  };

  const openAddMemoryModal = (dayNumber: number = 1) => {
    setEditingMemoryId(null);
    setFormMonth(selectedMonth);
    setFormDay(dayNumber);
    setFormTitle('');
    setFormNote('');
    setFormImageUrl('');
    setFormImages([]);
    setNewImageUrlInput('');
    setFormSticker('sun');
    setFormStickerText('');
    setFormTapeColor('gold');
    setFormLocation('');
    setFormMood('Cozy');
    setIsAddModalOpen(true);
  };

  const openEditMemoryModal = (mem: PlannerMemory) => {
    setEditingMemoryId(mem.id);
    setFormMonth(mem.month);
    setFormDay(mem.day);
    setFormTitle(mem.title || '');
    setFormNote(mem.note || '');
    const imgs: string[] = [];
    if (mem.images && Array.isArray(mem.images)) {
      mem.images.forEach((img) => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    if (mem.imageUrl && !imgs.includes(mem.imageUrl)) {
      imgs.unshift(mem.imageUrl);
    }
    setFormImages(imgs);
    setFormImageUrl(mem.imageUrl || imgs[0] || '');
    setNewImageUrlInput('');
    setFormSticker(mem.sticker || 'sparkle');
    setFormStickerText(mem.stickerText || '');
    setFormTapeColor(mem.tapeColor || 'gold');
    setFormLocation(mem.location || '');
    setFormMood(mem.mood || 'Cozy');
    setSelectedMemory(null);
    setIsAddModalOpen(true);
  };

  const handleSaveMemoryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = formImages.map((img) => img.trim()).filter((img) => img.length > 0);
    if (formImageUrl.trim() && !cleanImages.includes(formImageUrl.trim())) {
      cleanImages.unshift(formImageUrl.trim());
    }

    const newMemory: PlannerMemory = {
      id: editingMemoryId || `mem-${Date.now()}`,
      year: selectedYear,
      month: formMonth,
      day: formDay,
      title: formTitle.trim(),
      note: formNote.trim(),
      imageUrl: cleanImages[0] || formImageUrl.trim() || undefined,
      images: cleanImages.length > 0 ? cleanImages : undefined,
      sticker: formSticker,
      stickerText: formStickerText.trim(),
      tapeColor: formTapeColor,
      location: formLocation.trim(),
      mood: formMood.trim(),
    };

    let updatedList = [...(data.memories || [])];
    if (editingMemoryId) {
      updatedList = updatedList.map((m) => (m.id === editingMemoryId ? newMemory : m));
    } else {
      updatedList.push(newMemory);
    }

    const updatedData: BeyondCodingData = {
      ...data,
      memories: updatedList,
    };

    const ok = await saveToMongoDB(updatedData);
    if (ok) {
      setIsAddModalOpen(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Remove this memory from the planner?')) return;
    const updatedList = (data.memories || []).filter((m) => m.id !== id);
    const updatedData: BeyondCodingData = {
      ...data,
      memories: updatedList,
    };
    await saveToMongoDB(updatedData);
    setSelectedMemory(null);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!plannerSheetRef.current) return;
    if (!isFullscreen) {
      if (plannerSheetRef.current.requestFullscreen) {
        plannerSheetRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] dark:bg-[#0c1017] text-slate-800 dark:text-slate-100 pt-28 md:pt-32 pb-16 px-3 md:px-6 relative selection:bg-amber-200">
      {/* Bullet Journal Dot Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-45 dark:opacity-20 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:22px_22px] z-0" />

      {/* Google Fonts Preconnect for Authentic Cozy Handwriting & Scrapbook Typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Patrick+Hand&family=Homemade+Apple&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
        .font-planner-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sketch {
          font-family: 'Patrick Hand', cursive;
        }
        .font-signature {
          font-family: 'Homemade Apple', cursive;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Top Floating Control Bar with Tagline View */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold font-planner-title tracking-wide text-slate-800 dark:text-slate-100">
                  Beyond Coding
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 font-handwriting text-sm font-bold">
                  Digital Life Planner ✨
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-code font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Toggle Month Names (Spanish / English)"
              >
                <Languages size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'es' ? 'ES (diciembre)' : 'EN (December)'}</span>
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-code flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Toggle Fullscreen Mode"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>

              {/* Admin Add Button */}
              {isAdmin && (
                <button
                  onClick={() => openAddMemoryModal(1)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-code flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Memory / Sticker (MongoDB)</span>
                </button>
              )}
            </div>
          </div>

          {/* Cozy Tagline View */}
          <div className="border-t border-slate-200/70 dark:border-slate-800/70 pt-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-handwriting">
            <span className="text-amber-500 font-sans text-xs">✦</span>
            <p className="leading-snug">
              {data.subtitle || 'A soft, cozy memory calendar capturing everyday moments, art, travels, and little joys beyond software engineering.'}
            </p>
          </div>
        </div>

        {/* MAIN PLANNER WORKSPACE (Split Left Months Scrapbook + Right Large Planner Sheet) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 12-Month Scrapbook Overview Strip (Jan - Dec) */}
          {/* ========================================================= */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Year Pill Header like in screenshot */}
            <div className="flex items-center justify-between px-2">
              <div className="relative inline-block">
                <span className="px-5 py-1.5 bg-[#fef08a] dark:bg-amber-900/70 text-amber-900 dark:text-amber-100 font-extrabold text-2xl font-planner-title rounded-2xl shadow-sm rotate-[-2deg] inline-block border border-amber-300">
                  {selectedYear}
                </span>
                <span className="absolute -top-2 -right-3 text-lg select-none">✨</span>
              </div>
              <p className="text-xs font-handwriting text-slate-500 dark:text-slate-400 text-right text-base leading-tight">
                Click any month to view<br />
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">memory journal &rarr;</span>
              </p>
            </div>

            {/* 12 Months Scrapbook Cards Grid (3 columns on desktop) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 p-3 bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-inner max-h-[85vh] overflow-y-auto">
              {(data.months && data.months.length > 0
                ? data.months
                : Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    name: MONTH_NAMES_EN[i].substring(0, 3),
                    fullSpanishName: MONTH_NAMES_ES[i],
                    fullEnglishName: MONTH_NAMES_EN[i],
                    coverImages: ['/images/vandan_lake.png'],
                    vibeText: 'Cozy moments',
                    stickers: ['✨', '💛'],
                  }))
              ).map((m) => {
                const isSelected = selectedMonth === m.month;
                const memoryCount = (data.memories || []).filter((mem) => mem.month === m.month).length;

                return (
                  <button
                    key={m.month}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(m.month);
                      confetti({ particleCount: 20, spread: 40, origin: { x: 0.3, y: 0.6 } });
                    }}
                    className={`group relative flex flex-col p-2.5 rounded-2xl transition-all duration-300 text-left cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 shadow-md scale-102 ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-amber-300 hover:shadow-sm hover:scale-101'
                    }`}
                  >
                    {/* Month Label */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-100 group-hover:text-amber-700">
                        {m.name}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </div>

                    {/* Mini Scrapbook Photo Collage Box */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700">
                      <Image
                        src={
                          m.coverImages && m.coverImages.length > 0
                            ? m.coverImages[0]
                            : '/images/vandan_lake.png'
                        }
                        alt={m.name}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Cute Tape Sticker on Top */}
                      <div className="absolute top-1 left-2 w-7 h-2 bg-amber-200/90 dark:bg-amber-400/70 rotate-[-8deg] shadow-xs rounded-xs" />

                      {/* Memory Count Badge */}
                      {memoryCount > 0 && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white font-code text-[0.6rem] font-bold backdrop-blur-xs">
                          {memoryCount} {memoryCount === 1 ? 'pic' : 'pics'}
                        </span>
                      )}
                    </div>

                    {/* Stickers Footer */}
                    <div className="flex items-center gap-1 mt-1.5 text-[0.7rem] select-none">
                      {m.stickers?.slice(0, 3).map((stk, sIdx) => (
                        <span key={sIdx}>{stk}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: The Large Digital Planner Calendar Sheet     */}
          {/* ========================================================= */}
          <div className="col-span-12 lg:col-span-8">
            <div
              ref={plannerSheetRef}
              className={`relative rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden ${
                isFullscreen
                  ? 'fixed inset-0 z-[4000] p-3 sm:p-5 md:p-6 bg-[#1a202c] flex items-center justify-center overflow-y-auto'
                  : 'p-4 sm:p-7 md:p-9 bg-cover bg-center'
              }`}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')",
              }}
            >
              {/* Dim Palm Trees Atmosphere Overlay */}
              <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] pointer-events-none" />

              {/* THE CREAM PAPER PLANNER SHEET */}
              <div
                className={`relative z-20 w-full bg-[#fdfbf7] text-slate-800 rounded-2xl shadow-2xl border border-amber-900/15 transition-all flex flex-col justify-between ${
                  isFullscreen
                    ? 'max-w-6xl h-[94vh] max-h-[94vh] p-4 sm:p-6 md:p-7 mt-5 sm:mt-6'
                    : 'p-4 sm:p-7 md:p-8 mt-3 sm:mt-4'
                }`}
              >
                {/* Vintage Paper Texture Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-900/5 rounded-t-2xl" />

                {/* Corner Washi Tape Accents (Anchored directly to Paper Sheet) */}
                <div className="absolute -top-3 left-6 sm:left-10 w-14 h-4 bg-[#fde68a]/90 rotate-[-4deg] shadow-xs z-30 rounded-xs pointer-events-none" />
                <div className="absolute -top-3 right-16 sm:right-28 w-14 h-4 bg-[#fbcfe8]/90 rotate-[5deg] shadow-xs z-30 rounded-xs pointer-events-none" />

                {/* TROPICAL HIBISCUS FLOWERS DECORATION (Anchored to top-right corner of Paper Sheet) */}
                <div className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-40 select-none pointer-events-none drop-shadow-md">
                  <span className="text-3xl sm:text-4xl md:text-5xl">🌺</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl -ml-2.5">🌸</span>
                </div>

                {/* VINTAGE BRASS BINDER CLIP (Anchored to top center of Paper Sheet) */}
                <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none select-none">
                  <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] rounded-md shadow-lg border border-amber-600/60" />
                  <div className="w-9 h-7 border-2 border-[#b45309] rounded-t-lg -mt-3.5 bg-black/10" />
                </div>

                {/* Sheet Header: Month Number & Month Name (e.g. "12 diciembre") */}
                <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 mb-2 gap-2 flex-shrink-0">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-5xl font-planner-title font-extrabold text-slate-800 leading-none">
                      {String(selectedMonth).padStart(2, '0')}
                    </span>
                    <span className="text-2xl sm:text-3xl font-handwriting font-bold text-slate-700 lowercase tracking-wide">
                      {language === 'es'
                        ? MONTH_NAMES_ES[selectedMonth - 1]
                        : MONTH_NAMES_EN[selectedMonth - 1]}
                    </span>
                    <span className="text-xs font-handwriting text-slate-400">
                      ({selectedYear})
                    </span>
                  </div>

                  {/* Navigation & Controls */}
                  <div className="flex items-center gap-1.5 relative z-20">
                    {/* Quick Month Switcher in Fullscreen */}
                    {isFullscreen && (
                      <div className="hidden md:flex items-center gap-1 p-1 bg-amber-100/70 rounded-xl mr-1 shadow-2xs">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((mNum) => (
                          <button
                            key={mNum}
                            type="button"
                            onClick={() => setSelectedMonth(mNum)}
                            className={`w-6 h-6 rounded-lg text-[0.68rem] font-bold font-planner-title transition-all cursor-pointer ${
                              selectedMonth === mNum
                                ? 'bg-amber-400 text-slate-900 shadow-xs scale-105 ring-1 ring-amber-500/40'
                                : 'text-slate-600 hover:bg-amber-200 hover:text-slate-900'
                            }`}
                            title={language === 'es' ? MONTH_NAMES_ES[mNum - 1] : MONTH_NAMES_EN[mNum - 1]}
                          >
                            {mNum}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Previous Month"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Next Month"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer ml-1 shadow-xs"
                      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Sheet'}
                    >
                      {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* Day of the Week Header Row (LUN, MAR, MIE...) */}
                <div className="grid grid-cols-7 text-center font-planner-title text-[0.68rem] sm:text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-amber-900/15 pb-2 mb-1 flex-shrink-0">
                  {(language === 'es' ? DAYS_HEADER_ES : DAYS_HEADER_EN).map((dayName, idx) => (
                    <div key={idx} className={idx >= 5 ? 'text-amber-800 font-extrabold' : ''}>
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* CALENDAR CELLS GRID */}
                <div
                  className={`grid grid-cols-7 border-t border-l border-amber-900/15 bg-white/40 ${
                    isFullscreen ? 'flex-1 grid-rows-6' : ''
                  }`}
                >
                  {calendarDays.map((cell, idx) => {
                    const isBlank = !cell.isCurrentMonth || cell.dayNumber === null;
                    const dayMemories = !isBlank ? monthMemoriesMap.get(cell.dayNumber!) || [] : [];
                    const hasMemory = dayMemories.length > 0;
                    const primaryMem = hasMemory ? dayMemories[0] : null;

                    // Aggregate all photos for this day cell
                    const dayPhotos: string[] = [];
                    dayMemories.forEach((m) => {
                      if (m.images && Array.isArray(m.images)) {
                        m.images.forEach((img) => {
                          if (img && !dayPhotos.includes(img)) dayPhotos.push(img);
                        });
                      }
                      if (m.imageUrl && !dayPhotos.includes(m.imageUrl)) {
                        dayPhotos.push(m.imageUrl);
                      }
                    });

                    const hasPhotos = dayPhotos.length > 0;
                    const activePhotoIndex = hasPhotos ? (slideTick % dayPhotos.length) : 0;
                    const activePhotoUrl = hasPhotos ? dayPhotos[activePhotoIndex] : null;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isBlank) handleDayClick(cell.dayNumber!);
                        }}
                        className={`border-r border-b border-amber-900/15 p-1 sm:p-1.5 relative transition-all duration-200 flex flex-col justify-between group ${
                          isFullscreen
                            ? 'h-full min-h-[60px] sm:min-h-[75px]'
                            : 'min-h-[76px] sm:min-h-[96px] md:min-h-[110px]'
                        } ${
                          isBlank
                            ? 'bg-amber-50/20 opacity-30 select-none'
                            : 'hover:bg-amber-50/50 cursor-pointer'
                        }`}
                      >
                        {/* Day Number */}
                        {!isBlank && (
                          <div className="flex items-center justify-between">
                            <span className="text-[0.68rem] sm:text-xs font-bold font-planner-title text-slate-600 group-hover:text-amber-800">
                              {cell.dayNumber}
                            </span>
                            {/* Admin Quick Add Icon on empty days */}
                            {isAdmin && !hasMemory && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAddMemoryModal(cell.dayNumber!);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800 text-[0.65rem] p-0.5"
                                title="Add memory"
                              >
                                +
                              </button>
                            )}
                          </div>
                        )}

                        {/* CELL CONTENT (Photo snapshot, sticker, doodle text) */}
                        {!isBlank && hasMemory && primaryMem && (
                          <div className="flex-1 flex flex-col justify-center items-center my-0.5 relative group-hover:scale-103 transition-transform">
                            {/* Photo Polaroid Thumbnail if image exists */}
                            {hasPhotos && activePhotoUrl ? (
                              <div className="relative w-full h-14 sm:h-16 md:h-20 rounded-md overflow-hidden bg-white shadow-xs border border-amber-900/20 p-1 rotate-[-1deg] group-hover:rotate-0 transition-all duration-300">
                                <div className="relative w-full h-full rounded-2xs overflow-hidden bg-slate-100">
                                  <Image
                                    key={activePhotoUrl}
                                    src={activePhotoUrl}
                                    alt={primaryMem.title || 'Planner moment'}
                                    fill
                                    sizes="(max-width: 640px) 70px, (max-width: 768px) 95px, 115px"
                                    className="object-cover rounded-2xs transition-opacity duration-500 ease-in-out"
                                  />
                                </div>

                                {/* Multi-photo 2-second Slideshow indicator badge */}
                                {dayPhotos.length > 1 && (
                                  <div
                                    className="absolute bottom-1 right-1 px-1 py-0.5 rounded-xs bg-slate-900/85 backdrop-blur-xs text-[0.55rem] font-code font-bold text-white flex items-center gap-0.5 shadow-xs select-none z-10"
                                    title="2s slideshow active"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>
                                      {activePhotoIndex + 1}/{dayPhotos.length}
                                    </span>
                                  </div>
                                )}

                                {/* Washi Tape on Photo */}
                                <div
                                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-1.5 rounded-xs opacity-85 shadow-2xs z-10 pointer-events-none ${
                                    primaryMem.tapeColor === 'pink'
                                      ? 'bg-pink-300'
                                      : primaryMem.tapeColor === 'mint'
                                      ? 'bg-emerald-300'
                                      : primaryMem.tapeColor === 'lavender'
                                      ? 'bg-purple-300'
                                      : primaryMem.tapeColor === 'kraft'
                                      ? 'bg-amber-400'
                                      : 'bg-yellow-300'
                                  }`}
                                />
                              </div>
                            ) : null}

                            {/* Handwritten Note / Doodle Sticker Text */}
                            {primaryMem.stickerText ? (
                              <span
                                className={`text-[0.65rem] sm:text-xs font-handwriting font-bold leading-none text-center mt-0.5 line-clamp-1 ${
                                  primaryMem.stickerText.includes('happy')
                                    ? 'text-rose-600 font-extrabold text-xs sm:text-sm'
                                    : primaryMem.stickerText.includes('mudanza')
                                    ? 'text-amber-700'
                                    : 'text-slate-800'
                                }`}
                              >
                                {primaryMem.stickerText}
                              </span>
                            ) : null}

                            {/* Sticker Emoji */}
                            {primaryMem.sticker && !hasPhotos && !primaryMem.stickerText ? (
                              <div className="text-xl sm:text-2xl select-none filter drop-shadow-xs rotate-[4deg]">
                                {STICKER_ICONS[primaryMem.sticker] || '✨'}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Paper Footer */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-amber-900/15 text-xs text-slate-500 font-handwriting flex-shrink-0">
                  <span className="text-sm sm:text-base">
                    ✦ handwritten with love &middot; {selectedYear} life moments
                  </span>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-xl hover:bg-amber-100 text-slate-700 flex items-center gap-1 font-sans text-xs transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Sheet'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POLAROID MEMORY LIGHTBOX MODAL                             */}
      {/* ========================================================= */}
      {selectedMemory && (
        <div className="fixed inset-0 z-[4500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#fdfbf7] text-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 border border-amber-900/20 rotate-[-1deg]">
            {/* Top Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#fde68a] shadow-xs rotate-[2deg] rounded-xs" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>

            {/* Polaroid Frame */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
              {(() => {
                const modalPhotos: string[] = [];
                if (selectedMemory.images && Array.isArray(selectedMemory.images)) {
                  selectedMemory.images.forEach((img) => {
                    if (img && !modalPhotos.includes(img)) modalPhotos.push(img);
                  });
                }
                if (selectedMemory.imageUrl && !modalPhotos.includes(selectedMemory.imageUrl)) {
                  modalPhotos.push(selectedMemory.imageUrl);
                }
                const activeModalPhoto = modalPhotos[lightboxPhotoIndex] || modalPhotos[0];

                if (!activeModalPhoto) return null;

                return (
                  <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 mb-3 group/slide">
                    <Image
                      key={activeModalPhoto}
                      src={activeModalPhoto}
                      alt={selectedMemory.title}
                      fill
                      sizes="(max-width: 640px) 380px, 480px"
                      className="object-cover transition-opacity duration-500 ease-in-out"
                    />

                    {/* Multi-photo Slideshow Controls & Badge in Lightbox */}
                    {modalPhotos.length > 1 && (
                      <>
                        {/* Top-Right Badge: 2s Slideshow Status & Play/Pause */}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[0.68rem] font-code text-white flex items-center gap-1.5 shadow-md z-10 select-none">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLightboxSlideshowPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <span>
                            {lightboxPhotoIndex + 1} / {modalPhotos.length}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLightboxSlideshowPlaying(!isLightboxSlideshowPlaying);
                            }}
                            className="ml-1 p-0.5 text-slate-300 hover:text-white cursor-pointer transition-colors"
                            title={isLightboxSlideshowPlaying ? 'Pause 2s slideshow' : 'Play 2s slideshow'}
                          >
                            {isLightboxSlideshowPlaying ? <Pause size={10} /> : <Play size={10} />}
                          </button>
                        </div>

                        {/* Left Arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhotoIndex(
                              (prev) => (prev - 1 + modalPhotos.length) % modalPhotos.length
                            );
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer z-10"
                          title="Previous photo"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {/* Right Arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhotoIndex((prev) => (prev + 1) % modalPhotos.length);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer z-10"
                          title="Next photo"
                        >
                          <ChevronRight size={16} />
                        </button>

                        {/* Bottom Dots Indicator */}
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-xs z-10">
                          {modalPhotos.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxPhotoIndex(pIdx);
                              }}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                pIdx === lightboxPhotoIndex
                                  ? 'w-5 bg-amber-400'
                                  : 'w-2 bg-white/60 hover:bg-white'
                              }`}
                              title={`Photo ${pIdx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between text-xs font-code text-slate-500 border-b border-slate-100 pb-2 mb-2">
                <span>
                  {selectedMemory.day}{' '}
                  {MONTH_NAMES_EN[selectedMemory.month - 1]} {selectedMemory.year || selectedYear}
                </span>
                {selectedMemory.location && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin size={12} className="text-rose-500" />
                    {selectedMemory.location}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold font-planner-title text-slate-900 mb-1">
                {selectedMemory.title}
              </h3>

              {selectedMemory.note && (
                <p className="text-base font-handwriting text-slate-700 leading-relaxed">
                  {selectedMemory.note}
                </p>
              )}

              {selectedMemory.stickerText && (
                <div className="mt-2 text-sm font-handwriting font-bold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 inline-block">
                  {selectedMemory.stickerText}
                </div>
              )}
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/10">
                <button
                  type="button"
                  onClick={() => openEditMemoryModal(selectedMemory)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-code flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={12} /> Edit Memory
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMemory(selectedMemory.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold font-code flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADMIN ADD / EDIT MEMORY MODAL                              */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[4600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                {editingMemoryId ? 'Edit Memory / Sticker' : 'Add Memory to Planner (MongoDB Atlas)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMemoryForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Month</label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                  >
                    {MONTH_NAMES_EN.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {idx + 1} - {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Day (1 - 31)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={formDay}
                    onChange={(e) => setFormDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-code"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset at the Lake, Finals done, Cafe brunch"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Handwritten Note / Story
                </label>
                <textarea
                  rows={3}
                  placeholder="What made this moment cozy, memorable, or fun?"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              {/* Image Uploader & Multi-photo Slideshow Manager */}
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Camera size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Memory Photos ({formImages.length} {formImages.length === 1 ? 'photo' : 'photos'})</span>
                  </label>
                  {formImages.length > 1 && (
                    <span className="text-[0.65rem] font-code px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      2s slideshow active
                    </span>
                  )}
                </div>

                {/* Existing Photos Thumbnails Grid */}
                {formImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formImages.map((imgUrl, iIdx) => (
                      <div
                        key={iIdx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group/img bg-slate-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Photo ${iIdx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = formImages.filter((_, idx) => idx !== iIdx);
                            setFormImages(filtered);
                            setFormImageUrl(filtered[0] || '');
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="Remove photo"
                        >
                          <X size={10} />
                        </button>
                        <span className="absolute bottom-0.5 left-1 text-[0.55rem] font-code font-bold text-white bg-black/60 px-1 rounded-xs">
                          #{iIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload or Drop New Image */}
                <ImageDropzone
                  value=""
                  onChange={(uploadedUrl) => {
                    if (uploadedUrl) {
                      setFormImages((prev) => [...prev, uploadedUrl]);
                      if (!formImageUrl) setFormImageUrl(uploadedUrl);
                    }
                  }}
                  label="Upload / Drag New Photo to Slideshow"
                />

                {/* Or Paste Image URL */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. /images/art1.jpg)"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-code"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrlInput.trim()) {
                        setFormImages((prev) => [...prev, newImageUrlInput.trim()]);
                        if (!formImageUrl) setFormImageUrl(newImageUrlInput.trim());
                        setNewImageUrlInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              {/* Sticker Text & Sticker Emoji */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Handwritten Sticker Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mudanza!!, happy new year!, finals ✨"
                    value={formStickerText}
                    onChange={(e) => setFormStickerText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-handwriting text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sticker Icon
                  </label>
                  <select
                    value={formSticker}
                    onChange={(e) => setFormSticker(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                  >
                    {Object.entries(STICKER_ICONS).map(([key, icon]) => (
                      <option key={key} value={key}>
                        {icon} {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tape Color</label>
                  <select
                    value={formTapeColor}
                    onChange={(e) => setFormTapeColor(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                  >
                    <option value="gold">Yellow / Gold Washi</option>
                    <option value="pink">Pink Pastel Tape</option>
                    <option value="mint">Mint Green Tape</option>
                    <option value="kraft">Kraft Brown Paper Tape</option>
                    <option value="lavender">Lavender Tape</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Park, Botanical Cafe"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
    </div>
  );
}
