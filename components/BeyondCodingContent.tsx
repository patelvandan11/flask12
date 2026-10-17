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
  const [formSticker, setFormSticker] = useState<string>('sparkle');
  const [formStickerText, setFormStickerText] = useState<string>('');
  const [formTapeColor, setFormTapeColor] = useState<'gold' | 'pink' | 'mint' | 'kraft' | 'lavender'>('gold');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formMood, setFormMood] = useState<string>('Joyful');

  const plannerSheetRef = useRef<HTMLDivElement>(null);

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
    // Trailing blanks to complete 35 or 42 grid
    while (days.length % 7 !== 0 || days.length < 35) {
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
    setFormImageUrl(mem.imageUrl || '');
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
    const newMemory: PlannerMemory = {
      id: editingMemoryId || `mem-${Date.now()}`,
      year: selectedYear,
      month: formMonth,
      day: formDay,
      title: formTitle.trim(),
      note: formNote.trim(),
      imageUrl: formImageUrl.trim(),
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

  const toggleFullscreen = () => {
    if (!plannerSheetRef.current) return;
    if (!isFullscreen) {
      if (plannerSheetRef.current.requestFullscreen) {
        plannerSheetRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] dark:bg-[#0c1017] text-slate-800 dark:text-slate-100 py-12 px-3 md:px-6 relative selection:bg-amber-200">
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
        {/* Top Floating Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-sm md:text-base font-bold font-planner-title tracking-wide text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Beyond Coding</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 font-handwriting text-sm font-bold">
                Digital Life Planner ✨
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-code font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Month Names (Spanish / English)"
            >
              <Languages size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'es' ? 'ES (diciembre)' : 'EN (December)'}</span>
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
              className={`relative rounded-3xl p-4 sm:p-7 md:p-9 shadow-2xl transition-all duration-300 overflow-hidden ${
                isFullscreen
                  ? 'fixed inset-0 z-[4000] p-6 bg-[#2d3748] flex items-center justify-center overflow-auto'
                  : 'bg-cover bg-center'
              }`}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')",
              }}
            >
              {/* Dim Palm Trees Atmosphere Overlay */}
              <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] pointer-events-none" />

              {/* TROPICAL HIBISCUS FLOWERS DECORATION (Top-Right Corner like screenshot) */}
              <div className="absolute top-2 right-4 sm:top-4 sm:right-7 z-30 select-none pointer-events-none drop-shadow-md">
                <span className="text-4xl sm:text-5xl">🌺</span>
                <span className="text-3xl sm:text-4xl -ml-3">🌸</span>
              </div>

              {/* VINTAGE BRASS BINDER CLIP (Top Center like screenshot) */}
              <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none select-none">
                <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] rounded-md shadow-lg border border-amber-600/60" />
                <div className="w-9 h-7 border-2 border-[#b45309] rounded-t-lg -mt-3.5 bg-black/10" />
              </div>

              {/* THE CREAM PAPER PLANNER SHEET */}
              <div className="relative z-20 w-full bg-[#fdfbf7] text-slate-800 rounded-2xl shadow-2xl p-4 sm:p-7 md:p-8 border border-amber-900/10 mt-3 sm:mt-4">
                {/* Vintage Paper Texture Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-900/5" />

                {/* Corner Washi Tape Accents */}
                <div className="absolute -top-3 left-6 w-14 h-4 bg-[#fde68a]/90 rotate-[-4deg] shadow-xs" />
                <div className="absolute -top-3 right-20 w-14 h-4 bg-[#fbcfe8]/90 rotate-[5deg] shadow-xs" />

                {/* Sheet Header: Month Number & Month Name (e.g. "12 diciembre") */}
                <div className="flex flex-wrap items-end justify-between border-b border-amber-900/15 pb-4 mb-4 gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-6xl font-planner-title font-extrabold text-slate-800 leading-none">
                      {String(selectedMonth).padStart(2, '0')}
                    </span>
                    <span className="text-2xl sm:text-4xl font-handwriting font-bold text-slate-700 lowercase tracking-wide">
                      {language === 'es'
                        ? MONTH_NAMES_ES[selectedMonth - 1]
                        : MONTH_NAMES_EN[selectedMonth - 1]}
                    </span>
                  </div>

                  {/* Navigation & Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer ml-1"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* Day of the Week Header Row (LUN, MAR, MIE...) */}
                <div className="grid grid-cols-7 text-center font-planner-title text-[0.68rem] sm:text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-amber-900/15 pb-2 mb-1">
                  {(language === 'es' ? DAYS_HEADER_ES : DAYS_HEADER_EN).map((dayName, idx) => (
                    <div key={idx} className={idx >= 5 ? 'text-amber-800 font-extrabold' : ''}>
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* CALENDAR CELLS GRID */}
                <div className="grid grid-cols-7 border-t border-l border-amber-900/15 bg-white/40">
                  {calendarDays.map((cell, idx) => {
                    const isBlank = !cell.isCurrentMonth || cell.dayNumber === null;
                    const dayMemories = !isBlank ? monthMemoriesMap.get(cell.dayNumber!) || [] : [];
                    const hasMemory = dayMemories.length > 0;
                    const primaryMem = hasMemory ? dayMemories[0] : null;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isBlank) handleDayClick(cell.dayNumber!);
                        }}
                        className={`min-h-[72px] sm:min-h-[92px] md:min-h-[105px] border-r border-b border-amber-900/15 p-1 sm:p-1.5 relative transition-all duration-200 flex flex-col justify-between group ${
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
                            {primaryMem.imageUrl ? (
                              <div className="relative w-full aspect-4/3 rounded-sm overflow-hidden bg-white shadow-xs border border-amber-900/15 p-0.5 rotate-[-1deg] group-hover:rotate-0 transition-transform">
                                <Image
                                  src={primaryMem.imageUrl}
                                  alt={primaryMem.title}
                                  fill
                                  sizes="80px"
                                  className="object-cover rounded-xs"
                                />

                                {/* Washi Tape on Photo */}
                                <div
                                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-xs opacity-85 shadow-2xs ${
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
                            {primaryMem.sticker && !primaryMem.imageUrl && !primaryMem.stickerText ? (
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

                {/* Bottom Paper Footer with Fullscreen Expand button like screenshot */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-amber-900/15 text-xs text-slate-500 font-handwriting">
                  <span className="text-base">
                    ✦ handwritten with love &middot; {selectedYear} life moments
                  </span>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-xl hover:bg-amber-100 text-slate-700 flex items-center gap-1 font-sans text-xs transition-colors cursor-pointer"
                    title="Fullscreen Sheet"
                  >
                    <Maximize2 size={16} />
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
              {selectedMemory.imageUrl ? (
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <Image
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>
              ) : null}

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

              {/* Image Uploader */}
              <div>
                <ImageDropzone
                  value={formImageUrl}
                  onChange={setFormImageUrl}
                  label="Memory Photo (Optional Polaroid Image)"
                />
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
