'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  BeyondCodingData,
  PlannerMemory,
  MonthScrapbook,
  PlannerSticker,
  MonthChecklistItem,
  DayChecklistItem,
  CanvasSticker,
} from '@/types/portfolio';
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
  Check,
  Square,
  CheckSquare,
  ListTodo,
  Move,
  RotateCw,
  Paperclip,
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
  flower: '🌸',
  coffee: '☕',
  sparkle: '✨',
  heart: '💛',
  cat: '🐱',
  sun: '☀️',
  plant: '🌿',
  croissant: '🥐',
  art: '🎨',
  camera: '📷',
  pizza: '🍕',
  star: '⭐',
  letter: '💌',
  music: '🎧',
  book: '📖',
  candle: '🕯️',
  cake: '🧁',
  travel: '✈️',
  pin: '📌',
  tape: '🏷️',
  smiley: '😊',
  hibiscus: '🌺',
  tea: '🍵',
  rainbow: '🌈',
};

const resolveStickerIcon = (stickerKey?: string): string => {
  if (!stickerKey) return '✨';
  if (STICKER_ICONS[stickerKey]) return STICKER_ICONS[stickerKey];
  return stickerKey;
};

const getWashiTapeClass = (color?: string) => {
  switch (color) {
    case 'pink':
      return 'washi-pattern-pink';
    case 'mint':
      return 'washi-pattern-mint';
    case 'lavender':
      return 'washi-pattern-lavender';
    case 'kraft':
      return 'washi-pattern-kraft';
    case 'sky':
      return 'washi-pattern-sky';
    case 'peach':
      return 'washi-pattern-peach';
    case 'gold':
    default:
      return 'washi-pattern-gold';
  }
};

const getCardBgThemeClass = (theme?: string) => {
  switch (theme) {
    case 'pink':
      return 'bg-[#fff1f2] dark:bg-pink-950/40 border-pink-300 dark:border-pink-900/60 text-pink-950 dark:text-pink-100';
    case 'mint':
      return 'bg-[#ecfdf5] dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100';
    case 'lavender':
      return 'bg-[#faf5ff] dark:bg-purple-950/40 border-purple-300 dark:border-purple-900/60 text-purple-950 dark:text-purple-100';
    case 'peach':
      return 'bg-[#fff7ed] dark:bg-orange-950/40 border-orange-300 dark:border-orange-900/60 text-orange-950 dark:text-orange-100';
    case 'sky':
      return 'bg-[#f0f9ff] dark:bg-sky-950/40 border-sky-300 dark:border-sky-900/60 text-sky-950 dark:text-sky-100';
    case 'amber':
      return 'bg-[#fefce8] dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-100';
    case 'cream':
    default:
      return 'bg-[#fdfbf7] dark:bg-slate-800/90 border-amber-900/20 dark:border-slate-700 text-slate-800 dark:text-slate-100';
  }
};

const DEFAULT_MONTH_EMOJIS: Record<number, string[]> = {
  1: ['❄️', '☕', '✨'],
  2: ['💌', '🍫', '🕯️'],
  3: ['🌱', '☀️', '🌸'],
  4: ['🌷', '🚲', '📖'],
  5: ['🌻', '🎨', '🍵'],
  6: ['🏖️', '🌊', '🍉'],
  7: ['☀️', '🍦', '🏕️'],
  8: ['🌴', '✈️', '📸'],
  9: ['🍂', '🎒', '📚'],
  10: ['🎃', '🍁', '☕'],
  11: ['🥧', '🧶', '✨'],
  12: ['🎄', '🎁', '❄️'],
};

const DEFAULT_MONTH_GOALS: Record<number, string[]> = {
  1: ['Set 2026 goals', 'Cozy reading routine', 'Drink 2L water'],
  2: ['Learn a new AI tool', 'Weekend gallery walk', 'Daily gratitude'],
  3: ['Spring refresh', '30-min daily walk', 'Deploy side project'],
  4: ['Read 2 books', 'Outdoor sketch session', 'Cook a new recipe'],
  5: ['Finish portfolio updates', 'Visit a new cafe', 'Capture spring flowers'],
  6: ['Morning run 3x/week', 'Tech blog post', 'Sunset picnic'],
  7: ['Camping trip ⛺', 'Read sci-fi novel', 'Try gelato flavors 🍦'],
  8: ['Photography walk 📸', 'Learn Three.js', 'Summer road trip'],
  9: ['Autumn study mood 🍂', 'Read 2 research papers', 'Organize workspace'],
  10: ['Autumn photography 🍁', 'Pumpkin spice latte', 'Hackathon project'],
  11: ['Cozy sweater season 🧶', 'Gratitude journal', 'Prep holiday plans'],
  12: ['Year in review ✨', 'Celebrate milestones', 'Winter holiday cozy 🎄'],
};

export default function BeyondCodingContent({ initialData }: BeyondCodingContentProps) {
  const { isAdmin, openAdminModal } = useAdmin();
  const [data, setData] = useState<BeyondCodingData>(initialData || {
    year: 2026,
    title: 'Life Logs — Digital Scrapbook & Planner',
    subtitle: 'A soft, cozy memory calendar capturing everyday moments, art, travels, and little joys — personal life logs.',
    months: [],
    memories: [],
  });

  // Real-time current day, month and year
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(() => data.year || new Date().getFullYear());
  const [language, setLanguage] = useState<'es' | 'en'>('es'); // Default to Spanish to match screenshot
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<PlannerMemory | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);
  const [isLightboxSlideshowPlaying, setIsLightboxSlideshowPlaying] = useState<boolean>(true);
  const [slideTick, setSlideTick] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Month Checklist Ribbon State
  const [isMonthChecklistExpanded, setIsMonthChecklistExpanded] = useState<boolean>(false);
  const [quickNewGoalText, setQuickNewGoalText] = useState<string>('');

  // Admin Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

  // Form State (initialized to real-time current date)
  const [formMonth, setFormMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [formDay, setFormDay] = useState<number>(() => new Date().getDate());
  const [formTitle, setFormTitle] = useState<string>('');
  const [formNote, setFormNote] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>('');
  const [formSticker, setFormSticker] = useState<string>('sparkle');
  const [formStickerText, setFormStickerText] = useState<string>('');
  const [formTapeColor, setFormTapeColor] = useState<'gold' | 'pink' | 'mint' | 'kraft' | 'lavender' | 'sky' | 'peach'>('gold');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formMood, setFormMood] = useState<string>('Joyful');

  // Day Checklist State in Add/Edit Modal
  const [formMode, setFormMode] = useState<'photo' | 'checklist' | 'hybrid'>('photo');
  const [formChecklist, setFormChecklist] = useState<DayChecklistItem[]>([]);
  const [newDayChecklistInput, setNewDayChecklistInput] = useState<string>('');

  // Dedicated Sticker & Washi Tape Studio State (initialized to real-time date)
  const [isStickerStudioOpen, setIsStickerStudioOpen] = useState<boolean>(false);
  const [stickerStudioMonth, setStickerStudioMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [stickerStudioDay, setStickerStudioDay] = useState<number>(() => new Date().getDate());
  const [stickerStudioTapeColor, setStickerStudioTapeColor] = useState<'gold' | 'pink' | 'mint' | 'kraft' | 'lavender' | 'sky' | 'peach'>('pink');
  const [stickerStudioChoice, setStickerStudioChoice] = useState<string>('flower');
  const [stickerStudioText, setStickerStudioText] = useState<string>('cozy moments 🌸');
  const [stickerStudioNote, setStickerStudioNote] = useState<string>('');

  // Dedicated Month Cover Photo & Theme Studio State
  const [isCoverModalOpen, setIsCoverModalOpen] = useState<boolean>(false);
  const [coverModalMonth, setCoverModalMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [coverModeTab, setCoverModeTab] = useState<'photo' | 'nopic'>('photo');
  const [coverNoPicMode, setCoverNoPicMode] = useState<boolean>(false);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string>('');
  const [customCoverUrlInput, setCustomCoverUrlInput] = useState<string>('');
  const [coverVibeText, setCoverVibeText] = useState<string>('');
  const [coverStickers, setCoverStickers] = useState<string[]>([]);
  const [coverEmojiVibe, setCoverEmojiVibe] = useState<string[]>(['✨', '💛', '☕']);
  const [coverChecklist, setCoverChecklist] = useState<MonthChecklistItem[]>([]);
  const [newMonthGoalInput, setNewMonthGoalInput] = useState<string>('');
  const [coverCardTheme, setCoverCardTheme] = useState<'cream' | 'pink' | 'mint' | 'lavender' | 'peach' | 'sky' | 'amber'>('cream');

  // FREEFORM CANVAS STICKERS LAYER STATE (matching Image 2)
  const [isCanvasStudioOpen, setIsCanvasStudioOpen] = useState<boolean>(false);
  const [canvasStudioTab, setCanvasStudioTab] = useState<'photo' | 'cutouts' | 'notes' | 'emojis' | 'upload'>('photo');
  const [isCanvasEditMode, setIsCanvasEditMode] = useState<boolean>(true); // default true so user can immediately drag & reposition
  const [activeSelectedStickerId, setActiveSelectedStickerId] = useState<string | null>(null);
  const [isDraggingStickerId, setIsDraggingStickerId] = useState<string | null>(null);
  const [canvasDoodleInput, setCanvasDoodleInput] = useState<string>('festa con camping ⛺');
  const [canvasSelectedPhoto, setCanvasSelectedPhoto] = useState<string>('');
  const [canvasFrameStyle, setCanvasFrameStyle] = useState<'polaroid' | 'cutout' | 'paperclip' | 'tape'>('polaroid');
  const [canvasCustomImageUrl, setCanvasCustomImageUrl] = useState<string>('');

  const plannerSheetRef = useRef<HTMLDivElement>(null);
  const plannerCanvasRef = useRef<HTMLDivElement>(null);
  const hasActuallyDraggedStickerRef = useRef<boolean>(false);

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
    // Automatically open on the current real-time month and day
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setFormMonth(now.getMonth() + 1);
    setFormDay(now.getDate());
    setStickerStudioMonth(now.getMonth() + 1);
    setStickerStudioDay(now.getDate());
    setCoverModalMonth(now.getMonth() + 1);
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

  const openAddMemoryModal = (dayNumber?: number) => {
    setEditingMemoryId(null);
    setFormMonth(selectedMonth);
    const dayToUse =
      dayNumber !== undefined
        ? dayNumber
        : selectedMonth === new Date().getMonth() + 1
        ? new Date().getDate()
        : 1;
    setFormDay(dayToUse);
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
    setFormMode('photo');
    setFormChecklist([]);
    setNewDayChecklistInput('');
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
    setFormMode(
      mem.noPicMode
        ? 'checklist'
        : mem.checklist && mem.checklist.length > 0
        ? 'hybrid'
        : 'photo'
    );
    setFormChecklist(mem.checklist || []);
    setNewDayChecklistInput('');
    setSelectedMemory(null);
    setIsAddModalOpen(true);
  };

  const handleSaveMemoryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = formImages.map((img) => img.trim()).filter((img) => img.length > 0);
    if (formImageUrl.trim() && !cleanImages.includes(formImageUrl.trim())) {
      cleanImages.unshift(formImageUrl.trim());
    }

    const isNoPic = formMode === 'checklist';
    const finalImages = isNoPic ? undefined : cleanImages.length > 0 ? cleanImages : undefined;
    const finalImageUrl = isNoPic ? undefined : (cleanImages[0] || formImageUrl.trim() || undefined);

    const newMemory: PlannerMemory = {
      id: editingMemoryId || `mem-${Date.now()}`,
      year: selectedYear,
      month: formMonth,
      day: formDay,
      title: formTitle.trim() || (isNoPic ? `Day ${formDay} Checklist` : 'Planner moment'),
      note: formNote.trim(),
      imageUrl: finalImageUrl,
      images: finalImages,
      sticker: formSticker,
      stickerText: formStickerText.trim(),
      tapeColor: formTapeColor,
      location: formLocation.trim(),
      mood: formMood.trim(),
      noPicMode: isNoPic,
      checklist: formChecklist.length > 0 ? formChecklist : undefined,
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

  const openStickerStudio = (preselectedSticker?: string, preselectedDay?: number) => {
    setStickerStudioMonth(selectedMonth);
    const dayToUse =
      preselectedDay !== undefined
        ? preselectedDay
        : selectedMonth === new Date().getMonth() + 1
        ? new Date().getDate()
        : 1;
    setStickerStudioDay(dayToUse);
    if (preselectedSticker) {
      setStickerStudioChoice(preselectedSticker);
      if (preselectedSticker === 'flower' || preselectedSticker === '🌸') setStickerStudioText('cherry blossom vibes 🌸');
      else if (preselectedSticker === 'coffee' || preselectedSticker === '☕') setStickerStudioText('cozy coffee time ☕');
      else if (preselectedSticker === 'sparkle' || preselectedSticker === '✨') setStickerStudioText('magical day ✨');
      else if (preselectedSticker === 'heart' || preselectedSticker === '💛') setStickerStudioText('happy heart 💛');
      else if (preselectedSticker === 'cat' || preselectedSticker === '🐱') setStickerStudioText('kitty naps 🐱');
      else if (preselectedSticker === 'croissant' || preselectedSticker === '🥐') setStickerStudioText('bakery treats 🥐');
      else if (preselectedSticker === 'art' || preselectedSticker === '🎨') setStickerStudioText('art afternoon 🎨');
    }
    setIsStickerStudioOpen(true);
  };

  const handleSaveStickerStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Please log in with admin privileges to save stickers to MongoDB Atlas.');
      openAdminModal();
      return;
    }

    const cleanText = stickerStudioText.trim();
    const cleanNote = stickerStudioNote.trim();

    let updatedList = [...(data.memories || [])];
    const existingIndex = updatedList.findIndex(
      (m) => m.month === stickerStudioMonth && m.day === stickerStudioDay && (m.year === selectedYear || !m.year)
    );

    if (existingIndex >= 0) {
      // Merge into existing memory
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        sticker: stickerStudioChoice,
        stickerText: cleanText || updatedList[existingIndex].stickerText,
        tapeColor: stickerStudioTapeColor,
        note: cleanNote || updatedList[existingIndex].note,
      };
    } else {
      const newMemory: PlannerMemory = {
        id: `sticker-${Date.now()}`,
        year: selectedYear,
        month: stickerStudioMonth,
        day: stickerStudioDay,
        title: cleanText || `${stickerStudioChoice} sticker`,
        note: cleanNote || undefined,
        sticker: stickerStudioChoice,
        stickerText: cleanText || undefined,
        tapeColor: stickerStudioTapeColor,
        mood: 'Cozy',
      };
      updatedList.push(newMemory);
    }

    const updatedData: BeyondCodingData = {
      ...data,
      memories: updatedList,
    };

    const ok = await saveToMongoDB(updatedData);
    if (ok) {
      setIsStickerStudioOpen(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
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

  // Broken image tracker to guarantee zero broken image icons
  const [brokenMonthImages, setBrokenMonthImages] = useState<Record<number, boolean>>({});

  // Resolve active cover image for a month (custom cover or first uploaded photo in days 1 to 31)
  const getMonthCoverImage = (monthNum: number): string => {
    if (brokenMonthImages[monthNum]) return '';
    const existing = (data.months || []).find((m) => m.month === monthNum);
    if (existing?.noPicMode) {
      return '';
    }
    if (existing?.coverImages && existing.coverImages.length > 0) {
      const first = existing.coverImages[0]?.trim();
      if (first && first !== 'none' && first !== 'null' && first !== 'undefined' && first !== '') {
        return first;
      }
    }
    // Check if any memories uploaded in this month (days 1 to 31) have photos
    const monthMems = (data.memories || []).filter((mem) => mem.month === monthNum);
    for (const mem of monthMems) {
      if (mem.imageUrl && mem.imageUrl.trim()) return mem.imageUrl.trim();
      if (mem.images && mem.images.length > 0 && mem.images[0]?.trim()) return mem.images[0].trim();
    }
    // NO images during month -> return empty string to show beautiful emoji & checklist card
    return '';
  };

  // Normalized 12 months array (Jan to Dec) with guaranteed cover images & metadata
  const normalizedMonths: MonthScrapbook[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const existing = (data.months || []).find((m) => m.month === monthNum);
      const cover = getMonthCoverImage(monthNum);
      const defaultEmojis = DEFAULT_MONTH_EMOJIS[monthNum] || ['✨', '💛', '☕'];
      const defaultGoals = (DEFAULT_MONTH_GOALS[monthNum] || ['Cozy moments', 'Daily joy']).map(
        (g, idx) => ({ id: `g-${monthNum}-${idx}`, text: g, completed: false })
      );

      const hasValidPhoto = Boolean(
        cover && cover.trim().length > 0 && !brokenMonthImages[monthNum] && !existing?.noPicMode
      );

      if (existing) {
        return {
          ...existing,
          coverImages: hasValidPhoto ? [cover] : [],
          noPicMode: existing.noPicMode !== undefined ? existing.noPicMode : !hasValidPhoto,
          emojiVibe:
            existing.emojiVibe && existing.emojiVibe.length > 0
              ? existing.emojiVibe
              : existing.stickers && existing.stickers.length > 0
              ? existing.stickers
              : defaultEmojis,
          checklist:
            existing.checklist !== undefined && Array.isArray(existing.checklist)
              ? existing.checklist
              : [],
          cardBgTheme: existing.cardBgTheme || 'cream',
          canvasStickers: existing.canvasStickers || [],
        };
      }
      return {
        month: monthNum,
        name: MONTH_NAMES_EN[i].substring(0, 3),
        fullSpanishName: MONTH_NAMES_ES[i],
        fullEnglishName: MONTH_NAMES_EN[i],
        coverImages: hasValidPhoto ? [cover] : [],
        noPicMode: !hasValidPhoto,
        vibeText: 'Cozy moments',
        stickers: defaultEmojis,
        emojiVibe: defaultEmojis,
        checklist: [],
        cardBgTheme: 'cream',
        canvasStickers: [],
      };
    });
  }, [data.months, data.memories, brokenMonthImages]);

  // Open Month Cover Photo & Theme Studio modal
  const openEditCoverModal = (monthNum: number) => {
    setCoverModalMonth(monthNum);
    const existingMonth = (data.months || []).find((m) => m.month === monthNum);
    const cover = getMonthCoverImage(monthNum);
    setSelectedCoverUrl(cover);
    setCustomCoverUrlInput('');
    const isNoPic = Boolean(existingMonth?.noPicMode || !cover || cover.trim() === '');
    setCoverNoPicMode(isNoPic);
    setCoverModeTab(isNoPic ? 'nopic' : 'photo');
    setCoverVibeText(existingMonth?.vibeText || 'Cozy moments');
    const defaultEmojis = DEFAULT_MONTH_EMOJIS[monthNum] || ['✨', '💛', '☕'];
    setCoverStickers(
      existingMonth?.stickers && existingMonth.stickers.length > 0 ? existingMonth.stickers : defaultEmojis
    );
    setCoverEmojiVibe(
      existingMonth?.emojiVibe && existingMonth.emojiVibe.length > 0
        ? existingMonth.emojiVibe
        : existingMonth?.stickers && existingMonth.stickers.length > 0
        ? existingMonth.stickers
        : defaultEmojis
    );
    setCoverChecklist(
      existingMonth?.checklist !== undefined && Array.isArray(existingMonth.checklist)
        ? existingMonth.checklist
        : []
    );
    setCoverCardTheme(existingMonth?.cardBgTheme || 'cream');
    setNewMonthGoalInput('');
    setIsCoverModalOpen(true);
  };

  const handleSwitchCoverModalMonth = (newMonth: number) => {
    setCoverModalMonth(newMonth);
    const cover = getMonthCoverImage(newMonth);
    setSelectedCoverUrl(cover);
    setCustomCoverUrlInput('');
    const existingMonth = (data.months || []).find((m) => m.month === newMonth);
    const isNoPic = Boolean(existingMonth?.noPicMode || !cover || cover.trim() === '');
    setCoverNoPicMode(isNoPic);
    setCoverModeTab(isNoPic ? 'nopic' : 'photo');
    setCoverVibeText(existingMonth?.vibeText || 'Cozy moments');
    const defaultEmojis = DEFAULT_MONTH_EMOJIS[newMonth] || ['✨', '💛', '☕'];
    setCoverStickers(
      existingMonth?.stickers && existingMonth.stickers.length > 0 ? existingMonth.stickers : defaultEmojis
    );
    setCoverEmojiVibe(
      existingMonth?.emojiVibe && existingMonth.emojiVibe.length > 0
        ? existingMonth.emojiVibe
        : existingMonth?.stickers && existingMonth.stickers.length > 0
        ? existingMonth.stickers
        : defaultEmojis
    );
    setCoverChecklist(
      existingMonth?.checklist !== undefined && Array.isArray(existingMonth.checklist)
        ? existingMonth.checklist
        : []
    );
    setCoverCardTheme(existingMonth?.cardBgTheme || 'cream');
  };

  // Toggle Month Checklist Item (Admin Only)
  const toggleMonthChecklistItem = async (monthNum: number, itemId: string) => {
    if (!isAdmin) return;
    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === monthNum);
    if (existingIdx < 0) return;

    const targetMonth = currentMonths[existingIdx];
    const updatedChecklist = (targetMonth.checklist || []).map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedMonthObj: MonthScrapbook = {
      ...targetMonth,
      checklist: updatedChecklist,
    };

    const newMonthsList = currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m));
    const updatedData: BeyondCodingData = {
      ...data,
      months: newMonthsList,
    };
    setData(updatedData);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.5 } });
    await saveToMongoDB(updatedData);
  };

  // Toggle Day Checklist Item (Admin Only)
  const toggleDayChecklistItem = async (memoryId: string, itemId: string) => {
    if (!isAdmin) return;
    let updatedList = (data.memories || []).map((m) => {
      if (m.id === memoryId && m.checklist) {
        return {
          ...m,
          checklist: m.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return m;
    });

    const updatedData: BeyondCodingData = {
      ...data,
      memories: updatedList,
    };
    setData(updatedData);
    await saveToMongoDB(updatedData);
  };

  // Add a Quick Goal to Current Month
  const addQuickMonthGoal = async (monthNum: number, text: string) => {
    if (!text.trim()) return;
    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === monthNum);
    const existingMonth = existingIdx >= 0 ? currentMonths[existingIdx] : null;

    const newGoal: MonthChecklistItem = {
      id: `mgoal-${Date.now()}`,
      text: text.trim(),
      completed: false,
    };

    const updatedChecklist = [...(existingMonth?.checklist || []), newGoal];
    const updatedMonthObj: MonthScrapbook = {
      month: monthNum,
      name: existingMonth?.name || MONTH_NAMES_EN[monthNum - 1].substring(0, 3),
      fullSpanishName: existingMonth?.fullSpanishName || MONTH_NAMES_ES[monthNum - 1],
      fullEnglishName: existingMonth?.fullEnglishName || MONTH_NAMES_EN[monthNum - 1],
      coverImages: existingMonth?.coverImages || [],
      vibeText: existingMonth?.vibeText || 'Cozy moments',
      stickers: existingMonth?.stickers || ['✨', '💛'],
      noPicMode: existingMonth?.noPicMode,
      emojiVibe: existingMonth?.emojiVibe,
      checklist: updatedChecklist,
      cardBgTheme: existingMonth?.cardBgTheme,
      canvasStickers: existingMonth?.canvasStickers,
    };

    let newMonthsList: MonthScrapbook[];
    if (existingIdx >= 0) {
      newMonthsList = currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m));
    } else {
      newMonthsList = [...currentMonths, updatedMonthObj];
    }

    const updatedData: BeyondCodingData = {
      ...data,
      months: newMonthsList,
    };
    setData(updatedData);
    setQuickNewGoalText('');
    await saveToMongoDB(updatedData);
  };

  // ACTIVE CANVAS STICKERS FOR CURRENT MONTH (matching Image 2)
  const currentMonthCanvasStickers: CanvasSticker[] = useMemo(() => {
    const currentMonthObj = (data.months || []).find((m) => m.month === selectedMonth);
    if (currentMonthObj?.canvasStickers !== undefined && Array.isArray(currentMonthObj.canvasStickers)) {
      return currentMonthObj.canvasStickers;
    }
    const globalMatches = (data.canvasStickers || []).filter(
      (s) => s.month === selectedMonth && (s.year === selectedYear || !s.year)
    );
    if (globalMatches.length > 0) return globalMatches;

    // Default sample collage for July matching Image 2 "Luglio 2025"
    if (selectedMonth === 7) {
      return [
        {
          id: 'sample-jul-camera',
          month: 7,
          type: 'scrapbook',
          content: 'retro-camera',
          x: 90,
          y: 19,
          rotation: 3,
          scale: 1.15,
          zIndex: 25,
        },
        {
          id: 'sample-jul-dog',
          month: 7,
          type: 'scrapbook',
          content: 'dog-polaroid',
          x: 11,
          y: 22,
          rotation: -4,
          scale: 1.05,
          frameStyle: 'paperclip',
          zIndex: 20,
        },
        {
          id: 'sample-jul-phone',
          month: 7,
          type: 'scrapbook',
          content: 'phone-player',
          x: 88,
          y: 80,
          rotation: 2,
          scale: 1,
          zIndex: 25,
        },
        {
          id: 'sample-jul-star',
          month: 7,
          type: 'scrapbook',
          content: 'star-doodle',
          x: 27,
          y: 24,
          rotation: 8,
          scale: 1.2,
          zIndex: 15,
        },
        {
          id: 'sample-jul-qrcode',
          month: 7,
          type: 'scrapbook',
          content: 'qr-clip',
          x: 43,
          y: 38,
          rotation: -5,
          scale: 0.95,
          zIndex: 22,
        },
        {
          id: 'sample-jul-flower',
          month: 7,
          type: 'scrapbook',
          content: 'blue-flower',
          x: 48,
          y: 43,
          rotation: 12,
          scale: 1,
          zIndex: 23,
        },
        {
          id: 'sample-jul-sandwich',
          month: 7,
          type: 'scrapbook',
          content: 'sandwich-tape',
          x: 52,
          y: 27,
          rotation: -6,
          scale: 1.1,
          tapeColor: 'kraft',
          zIndex: 24,
        },
        {
          id: 'sample-jul-sunscreen',
          month: 7,
          type: 'scrapbook',
          content: 'sunscreen',
          x: 80,
          y: 47,
          rotation: 4,
          scale: 1,
          zIndex: 22,
        },
        {
          id: 'sample-jul-note1',
          month: 7,
          type: 'text',
          content: 'festa con camping ⛺',
          x: 70,
          y: 36,
          rotation: -3,
          scale: 1,
          zIndex: 18,
        },
        {
          id: 'sample-jul-note2',
          month: 7,
          type: 'text',
          content: 'degustazione + enoteca 🍷',
          x: 26,
          y: 66,
          rotation: -6,
          scale: 1,
          zIndex: 18,
        },
      ];
    }
    return [];
  }, [data.months, data.canvasStickers, selectedMonth, selectedYear]);

  // Handle saving canvas stickers to MongoDB Atlas
  const handleSaveCanvasStickers = async (updatedStickers: CanvasSticker[]) => {
    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === selectedMonth);
    const existingMonth = existingIdx >= 0 ? currentMonths[existingIdx] : null;

    const updatedMonthObj: MonthScrapbook = {
      month: selectedMonth,
      name: existingMonth?.name || MONTH_NAMES_EN[selectedMonth - 1].substring(0, 3),
      fullSpanishName: existingMonth?.fullSpanishName || MONTH_NAMES_ES[selectedMonth - 1],
      fullEnglishName: existingMonth?.fullEnglishName || MONTH_NAMES_EN[selectedMonth - 1],
      coverImages: existingMonth?.coverImages || [],
      vibeText: existingMonth?.vibeText || 'Cozy moments',
      stickers: existingMonth?.stickers || ['✨', '💛'],
      noPicMode: existingMonth?.noPicMode,
      emojiVibe: existingMonth?.emojiVibe,
      checklist: existingMonth?.checklist,
      cardBgTheme: existingMonth?.cardBgTheme,
      canvasStickers: updatedStickers,
    };

    let newMonthsList: MonthScrapbook[];
    if (existingIdx >= 0) {
      newMonthsList = currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m));
    } else {
      newMonthsList = [...currentMonths, updatedMonthObj];
    }

    const otherStickers = (data.canvasStickers || []).filter((s) => s.month !== selectedMonth);
    const updatedAllStickers = [...otherStickers, ...updatedStickers];

    const updatedData: BeyondCodingData = {
      ...data,
      months: newMonthsList,
      canvasStickers: updatedAllStickers,
    };

    setData(updatedData);
    await saveToMongoDB(updatedData);
  };

  // Add a new canvas sticker
  const handleAddCanvasSticker = async (newSticker: Omit<CanvasSticker, 'id' | 'month' | 'year'>) => {
    const created: CanvasSticker = {
      ...newSticker,
      id: `cstk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      month: selectedMonth,
      year: selectedYear,
      x: newSticker.x ?? 50,
      y: newSticker.y ?? 50,
      rotation: newSticker.rotation ?? Math.floor(Math.random() * 16 - 8),
      scale: newSticker.scale ?? 1,
      zIndex: (currentMonthCanvasStickers.length || 0) + 20,
    };

    const nextStickers = [...currentMonthCanvasStickers, created];
    setActiveSelectedStickerId(created.id);
    await handleSaveCanvasStickers(nextStickers);
    confetti({ particleCount: 30, spread: 50, origin: { x: (created.x || 50) / 100, y: (created.y || 50) / 100 } });
  };

  // Delete a canvas sticker
  const handleDeleteCanvasSticker = async (stickerId: string) => {
    const nextStickers = currentMonthCanvasStickers.filter((s) => s.id !== stickerId);
    if (activeSelectedStickerId === stickerId) setActiveSelectedStickerId(null);
    await handleSaveCanvasStickers(nextStickers);
  };

  // Rotate canvas sticker
  const handleRotateSticker = async (stickerId: string, delta: number) => {
    const nextStickers = currentMonthCanvasStickers.map((s) =>
      s.id === stickerId ? { ...s, rotation: ((s.rotation || 0) + delta) % 360 } : s
    );
    await handleSaveCanvasStickers(nextStickers);
  };

  // Scale canvas sticker
  const handleScaleSticker = async (stickerId: string, delta: number) => {
    const nextStickers = currentMonthCanvasStickers.map((s) => {
      if (s.id === stickerId) {
        const nextScale = Math.max(0.5, Math.min(2.5, Number(((s.scale || 1) + delta).toFixed(2))));
        return { ...s, scale: nextScale };
      }
      return s;
    });
    await handleSaveCanvasStickers(nextStickers);
  };

  // Bring canvas sticker to front
  const handleBringToFront = async (stickerId: string) => {
    const maxZ = Math.max(20, ...currentMonthCanvasStickers.map((s) => s.zIndex || 20));
    const nextStickers = currentMonthCanvasStickers.map((s) =>
      s.id === stickerId ? { ...s, zIndex: maxZ + 2 } : s
    );
    await handleSaveCanvasStickers(nextStickers);
  };

  // Photos uploaded during the month being edited (days 1 to 31)
  const modalMonthPhotos = useMemo(() => {
    const list: { url: string; day: number; title: string; memoryId: string }[] = [];
    (data.memories || []).forEach((mem) => {
      if (mem.month === coverModalMonth && (mem.year === selectedYear || !mem.year)) {
        if (mem.images && Array.isArray(mem.images)) {
          mem.images.forEach((img) => {
            if (img && !list.some((item) => item.url === img)) {
              list.push({
                url: img,
                day: mem.day,
                title: mem.title || `Day ${mem.day}`,
                memoryId: mem.id,
              });
            }
          });
        }
        if (mem.imageUrl && !list.some((item) => item.url === mem.imageUrl)) {
          list.push({
            url: mem.imageUrl,
            day: mem.day,
            title: mem.title || `Day ${mem.day}`,
            memoryId: mem.id,
          });
        }
      }
    });
    return list.sort((a, b) => a.day - b.day);
  }, [data.memories, coverModalMonth, selectedYear]);

  // Save updated month cover photo / theme to MongoDB Atlas
  const handleSaveMonthCover = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAdmin) {
      alert('Please log in with admin privileges to save changes to MongoDB Atlas.');
      openAdminModal();
      return;
    }

    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === coverModalMonth);
    const existingMonth = existingIdx >= 0 ? currentMonths[existingIdx] : null;

    const isNoPic = coverModeTab === 'nopic' || coverNoPicMode;
    let updatedCoverImages: string[] = [];

    if (!isNoPic) {
      if (selectedCoverUrl && selectedCoverUrl.trim()) {
        const otherImages = (existingMonth?.coverImages || []).filter((img) => img !== selectedCoverUrl);
        updatedCoverImages = [selectedCoverUrl, ...otherImages];
      }
    }

    const updatedMonthObj: MonthScrapbook = {
      month: coverModalMonth,
      name: existingMonth?.name || MONTH_NAMES_EN[coverModalMonth - 1].substring(0, 3),
      fullSpanishName: existingMonth?.fullSpanishName || MONTH_NAMES_ES[coverModalMonth - 1],
      fullEnglishName: existingMonth?.fullEnglishName || MONTH_NAMES_EN[coverModalMonth - 1],
      coverImages: updatedCoverImages,
      vibeText: coverVibeText || existingMonth?.vibeText || 'Cozy moments',
      stickers: coverStickers && coverStickers.length > 0 ? coverStickers : (existingMonth?.stickers || ['✨', '💛']),
      noPicMode: isNoPic,
      emojiVibe: coverEmojiVibe.length > 0 ? coverEmojiVibe : (existingMonth?.emojiVibe || ['✨', '💛']),
      checklist: coverChecklist,
      cardBgTheme: coverCardTheme,
      canvasStickers: existingMonth?.canvasStickers || [],
    };

    let newMonthsList: MonthScrapbook[];
    if (existingIdx >= 0) {
      newMonthsList = currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m));
    } else {
      newMonthsList = [...currentMonths, updatedMonthObj];
    }

    const updatedData: BeyondCodingData = {
      ...data,
      months: newMonthsList,
    };

    const ok = await saveToMongoDB(updatedData);
    if (ok) {
      setIsCoverModalOpen(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Directly set a memory photo as month cover from the lightbox
  const handleSetMemoryAsCover = async (mem: PlannerMemory, photoUrl: string) => {
    if (!isAdmin) {
      alert('Please log in with admin privileges to update month cover.');
      openAdminModal();
      return;
    }

    const targetMonth = mem.month;
    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === targetMonth);
    const existingMonth = existingIdx >= 0 ? currentMonths[existingIdx] : null;

    const otherImages = (existingMonth?.coverImages || []).filter((img) => img !== photoUrl);
    const updatedCoverImages = [photoUrl, ...otherImages];

    const updatedMonthObj: MonthScrapbook = {
      month: targetMonth,
      name: existingMonth?.name || MONTH_NAMES_EN[targetMonth - 1].substring(0, 3),
      fullSpanishName: existingMonth?.fullSpanishName || MONTH_NAMES_ES[targetMonth - 1],
      fullEnglishName: existingMonth?.fullEnglishName || MONTH_NAMES_EN[targetMonth - 1],
      coverImages: updatedCoverImages,
      vibeText: existingMonth?.vibeText || 'Cozy moments',
      stickers: existingMonth?.stickers || ['✨', '💛'],
    };

    let newMonthsList: MonthScrapbook[];
    if (existingIdx >= 0) {
      newMonthsList = currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m));
    } else {
      newMonthsList = [...currentMonths, updatedMonthObj];
    }

    const updatedData: BeyondCodingData = {
      ...data,
      months: newMonthsList,
    };

    const ok = await saveToMongoDB(updatedData);
    if (ok) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
      alert(`Set as ${MONTH_NAMES_EN[targetMonth - 1]} cover photo!`);
    }
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
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Dragging event handlers for canvas stickers
  const handleStickerPointerDown = (stickerId: string, e: React.PointerEvent) => {
    if (!isCanvasEditMode) return;
    e.stopPropagation();
    setActiveSelectedStickerId(stickerId);
    setIsDraggingStickerId(stickerId);
    hasActuallyDraggedStickerRef.current = false;
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingStickerId || !plannerCanvasRef.current) return;
    hasActuallyDraggedStickerRef.current = true;
    const rect = plannerCanvasRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(4, Math.min(96, rawX)));
    const clampedY = Math.round(Math.max(4, Math.min(96, rawY)));

    const nextStickers = currentMonthCanvasStickers.map((s) =>
      s.id === isDraggingStickerId ? { ...s, x: clampedX, y: clampedY } : s
    );

    const currentMonths = [...(data.months && data.months.length > 0 ? data.months : normalizedMonths)];
    const existingIdx = currentMonths.findIndex((m) => m.month === selectedMonth);
    const existingMonth = existingIdx >= 0 ? currentMonths[existingIdx] : null;

    const updatedMonthObj: MonthScrapbook = {
      month: selectedMonth,
      name: existingMonth?.name || MONTH_NAMES_EN[selectedMonth - 1]?.substring(0, 3) || 'Month',
      fullSpanishName: existingMonth?.fullSpanishName || MONTH_NAMES_ES[selectedMonth - 1] || 'Mes',
      fullEnglishName: existingMonth?.fullEnglishName || MONTH_NAMES_EN[selectedMonth - 1] || 'Month',
      coverImages: existingMonth?.coverImages || [],
      vibeText: existingMonth?.vibeText || 'Cozy moments',
      stickers: existingMonth?.stickers || ['✨', '💛'],
      noPicMode: existingMonth?.noPicMode,
      emojiVibe: existingMonth?.emojiVibe,
      checklist: existingMonth?.checklist,
      cardBgTheme: existingMonth?.cardBgTheme,
      canvasStickers: nextStickers,
    };

    const newMonthsList =
      existingIdx >= 0
        ? currentMonths.map((m, idx) => (idx === existingIdx ? updatedMonthObj : m))
        : [...currentMonths, updatedMonthObj];

    setData({ ...data, months: newMonthsList });
  };

  const handleCanvasPointerUp = async () => {
    if (isDraggingStickerId) {
      const wasDragged = hasActuallyDraggedStickerRef.current;
      setIsDraggingStickerId(null);
      hasActuallyDraggedStickerRef.current = false;
      if (wasDragged) {
        await handleSaveCanvasStickers(currentMonthCanvasStickers);
      }
    }
  };

  const renderCanvasStickerContent = (stk: CanvasSticker) => {
    // 1. Photo sticker related to pic
    if (stk.type === 'photo') {
      return (
        <div className="relative group/canvasPhoto">
          {stk.frameStyle === 'paperclip' ? (
            <div className="relative bg-white p-1.5 pb-3 rounded-lg shadow-lg border border-slate-200">
              <div className="absolute -top-3.5 -left-2 z-30 drop-shadow-md select-none pointer-events-none">
                <div className="w-3.5 h-8 border-2 border-slate-500 rounded-full bg-transparent rotate-[-15deg]" />
              </div>
              <div className="relative w-20 sm:w-24 h-16 sm:h-20 rounded overflow-hidden bg-slate-100">
                <Image src={stk.content} alt={stk.label || 'Canvas sticker'} fill sizes="100px" className="object-cover" />
              </div>
              {stk.label && (
                <span className="block mt-1 text-[0.6rem] font-handwriting font-bold text-center text-slate-800 leading-tight">
                  {stk.label}
                </span>
              )}
            </div>
          ) : stk.frameStyle === 'tape' ? (
            <div className="relative bg-white p-1 rounded-lg shadow-md border border-slate-200">
              <div className={`absolute -top-1.5 left-1 w-6 h-2 rounded-xs shadow-2xs rotate-[-8deg] z-20 pointer-events-none ${getWashiTapeClass(stk.tapeColor || 'pink')}`} />
              <div className={`absolute -bottom-1.5 right-1 w-6 h-2 rounded-xs shadow-2xs rotate-[6deg] z-20 pointer-events-none ${getWashiTapeClass(stk.tapeColor || 'pink')}`} />
              <div className="relative w-20 sm:w-24 h-16 sm:h-20 rounded overflow-hidden bg-slate-100">
                <Image src={stk.content} alt={stk.label || 'Canvas sticker'} fill sizes="100px" className="object-cover" />
              </div>
              {stk.label && (
                <span className="block mt-0.5 text-[0.58rem] font-handwriting font-bold text-center text-slate-800">
                  {stk.label}
                </span>
              )}
            </div>
          ) : stk.frameStyle === 'cutout' ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-black/10">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-slate-100">
                <Image src={stk.content} alt={stk.label || 'Cutout sticker'} fill sizes="80px" className="object-cover" />
              </div>
            </div>
          ) : (
            /* Default Polaroid with Tape */
            <div className="relative bg-white p-1.5 pb-2.5 rounded-lg shadow-lg border border-slate-200">
              <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 rounded-xs shadow-2xs rotate-[-2deg] z-20 pointer-events-none ${getWashiTapeClass(stk.tapeColor || 'gold')}`} />
              <div className="relative w-20 sm:w-24 h-16 sm:h-20 rounded overflow-hidden bg-slate-100">
                <Image src={stk.content} alt={stk.label || 'Polaroid'} fill sizes="100px" className="object-cover" />
              </div>
              {stk.label && (
                <span className="block mt-0.5 text-[0.6rem] font-handwriting font-bold text-center text-slate-800 leading-tight">
                  {stk.label}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    // 2. Handwritten Doodle Text Note
    if (stk.type === 'text') {
      return (
        <div className="px-2 py-0.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xs border border-amber-900/15 shadow-xs">
          <span className="font-handwriting font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {stk.content}
          </span>
        </div>
      );
    }

    // 3. Emoji Sticker
    if (stk.type === 'emoji') {
      return (
        <span className="text-2xl sm:text-3xl filter drop-shadow-md select-none block">
          {stk.content}
        </span>
      );
    }

    // 4. Authentic Scrapbook Cutouts matching Image 2!
    if (stk.type === 'scrapbook') {
      switch (stk.content) {
        case 'retro-camera':
          return (
            <div className="relative w-20 sm:w-24 bg-[#1f242b] p-1.5 rounded-xl shadow-2xl border-2 border-slate-700 text-white flex flex-col items-center">
              <div className="w-full flex items-center justify-between px-0.5 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <div className="flex gap-0.5">
                  <div className="w-2 h-1.5 bg-slate-500 rounded-xs" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>
              <div className="relative w-full h-12 rounded overflow-hidden bg-slate-900 border border-slate-600">
                <Image src="/images/art4.jpg" alt="Camera snapshot" fill sizes="80px" className="object-cover" />
              </div>
              <span className="text-[0.48rem] font-code text-slate-400 mt-0.5 uppercase tracking-widest font-bold">
                NIKON 35MM
              </span>
            </div>
          );

        case 'phone-player':
          return (
            <div className="w-24 sm:w-28 bg-slate-900/95 text-white p-1.5 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md flex flex-col space-y-0.5">
              <div className="relative w-full h-10 rounded overflow-hidden bg-slate-800">
                <Image src="/images/art1.jpg" alt="Album artwork" fill sizes="80px" className="object-cover" />
              </div>
              <div className="px-0.5">
                <p className="text-[0.55rem] font-bold font-planner-title leading-tight truncate">
                  Adesso che fai 🎵
                </p>
                <p className="text-[0.45rem] text-slate-400 font-sans truncate">Vandan & friends</p>
              </div>
              <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-amber-400 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[0.42rem] font-code text-slate-400 px-0.5">
                <span>2:14</span>
                <span>3:42</span>
              </div>
            </div>
          );

        case 'qr-clip':
          return (
            <div className="relative bg-white p-1.5 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-pink-400 rounded-md border border-pink-600 shadow-xs z-30" />
              <div className="w-9 h-9 bg-slate-100 border border-slate-300 rounded p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[radial-gradient(#1e293b_1.8px,transparent_1.8px)] [background-size:5px_5px]" />
              </div>
              <span className="text-[0.45rem] font-code font-bold text-slate-500 mt-0.5">SCAN ME</span>
            </div>
          );

        case 'dog-polaroid':
          return (
            <div className="relative bg-white p-1 pb-1.5 rounded-lg shadow-lg border border-slate-200">
              <div className="absolute -top-2.5 left-1 w-3 h-6 border-2 border-slate-400 rounded-full rotate-[-10deg] shadow-xs pointer-events-none" />
              <div className="relative w-16 h-16 rounded overflow-hidden bg-slate-100">
                <Image src="/images/art2.jpg" alt="Dog with paw" fill sizes="70px" className="object-cover" />
              </div>
              <span className="block text-[0.5rem] font-handwriting font-bold text-center text-slate-700 mt-0.5">
                pup joy 🐾
              </span>
            </div>
          );

        case 'sandwich-tape':
          return (
            <div className="relative bg-white/95 p-1 rounded-xl shadow-md border border-amber-900/10">
              <div className="absolute -top-1.5 left-1 w-7 h-2 washi-pattern-gold rotate-[-8deg] shadow-xs rounded-xs" />
              <div className="w-16 h-12 rounded bg-amber-50 flex items-center justify-center text-xl">
                🥪 🥐
              </div>
              <span className="block text-[0.48rem] font-handwriting font-bold text-center text-amber-900">
                panino picnic
              </span>
            </div>
          );

        case 'sunscreen':
          return (
            <div className="w-10 sm:w-11 bg-gradient-to-b from-amber-600 to-amber-800 text-amber-100 p-1 rounded-lg shadow-lg border border-amber-500/60 flex flex-col items-center">
              <div className="w-3 h-2 bg-amber-300 rounded-t-sm -mt-2 mb-0.5" />
              <span className="text-[0.48rem] font-bold font-planner-title">SOLEIL</span>
              <span className="text-[0.55rem] font-extrabold font-code text-white">30+</span>
              <span className="text-[0.4rem] font-sans text-amber-200">protect</span>
            </div>
          );

        case 'star-doodle':
          return (
            <div className="text-2xl sm:text-3xl filter drop-shadow-xs select-none">
              ✦
            </div>
          );

        case 'blue-flower':
          return (
            <div className="text-2xl sm:text-3xl filter drop-shadow-md select-none text-sky-500">
              🌸
            </div>
          );

        case 'croissant':
          return (
            <div className="relative bg-white/80 p-0.5 rounded-lg shadow-sm">
              <span className="text-2xl select-none">🥐</span>
            </div>
          );

        default:
          return (
            <div className="p-1.5 bg-white rounded-lg shadow-md">
              <span>✨</span>
            </div>
          );
      }
    }

    // 5. Custom image sticker
    return (
      <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden shadow-md bg-white p-0.5">
        <div className="relative w-full h-full rounded overflow-hidden">
          <Image src={stk.content} alt="Sticker" fill sizes="80px" className="object-cover" />
        </div>
      </div>
    );
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
        .washi-pattern-gold {
          background-color: #fef08a;
          background-image: radial-gradient(#d97706 14%, transparent 15%);
          background-size: 6px 6px;
          border-left: 2px dashed rgba(217, 119, 6, 0.4);
          border-right: 2px dashed rgba(217, 119, 6, 0.4);
        }
        .washi-pattern-pink {
          background-color: #fbcfe8;
          background-image: repeating-linear-gradient(45deg, rgba(236, 72, 153, 0.18), rgba(236, 72, 153, 0.18) 4px, transparent 4px, transparent 8px);
          border-left: 2px dashed rgba(236, 72, 153, 0.4);
          border-right: 2px dashed rgba(236, 72, 153, 0.4);
        }
        .washi-pattern-mint {
          background-color: #a7f3d0;
          background-image: linear-gradient(rgba(5, 150, 105, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(5, 150, 105, 0.18) 1px, transparent 1px);
          background-size: 6px 6px;
          border-left: 2px dashed rgba(5, 150, 105, 0.4);
          border-right: 2px dashed rgba(5, 150, 105, 0.4);
        }
        .washi-pattern-lavender {
          background-color: #e9d5ff;
          background-image: repeating-linear-gradient(-45deg, rgba(147, 51, 234, 0.18), rgba(147, 51, 234, 0.18) 5px, transparent 5px, transparent 10px);
          border-left: 2px dashed rgba(147, 51, 234, 0.4);
          border-right: 2px dashed rgba(147, 51, 234, 0.4);
        }
        .washi-pattern-kraft {
          background-color: #fed7aa;
          background-image: repeating-linear-gradient(0deg, rgba(180, 83, 9, 0.15), rgba(180, 83, 9, 0.15) 2px, transparent 2px, transparent 5px);
          border-left: 2px dashed rgba(180, 83, 9, 0.4);
          border-right: 2px dashed rgba(180, 83, 9, 0.4);
        }
        .washi-pattern-sky {
          background-color: #bae6fd;
          background-image: radial-gradient(rgba(2, 132, 199, 0.2) 15%, transparent 16%);
          background-size: 7px 7px;
          border-left: 2px dashed rgba(2, 132, 199, 0.4);
          border-right: 2px dashed rgba(2, 132, 199, 0.4);
        }
        .washi-pattern-peach {
          background-color: #ffedd5;
          background-image: repeating-linear-gradient(45deg, rgba(234, 88, 12, 0.18), rgba(234, 88, 12, 0.18) 4px, transparent 4px, transparent 8px);
          border-left: 2px dashed rgba(234, 88, 12, 0.4);
          border-right: 2px dashed rgba(234, 88, 12, 0.4);
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Top Floating Control Bar with Tagline View */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2.5">
          {/* Authentic Washi Tape Accents Taped on Top Bar */}
          <div className="absolute -top-3 left-10 w-16 sm:w-20 h-4 washi-pattern-pink rotate-[-3deg] shadow-xs rounded-xs pointer-events-none opacity-90 z-20" />
          <div className="absolute -top-3 right-16 sm:right-28 w-16 sm:w-20 h-4 washi-pattern-gold rotate-[4deg] shadow-xs rounded-xs pointer-events-none opacity-90 z-20" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold font-planner-title tracking-wide text-slate-800 dark:text-slate-100">
                  Life Logs
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 font-handwriting text-sm font-bold">
                  Digital Life Planner & Memories ✨
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

              {/* Admin-Only Features: Add Memory, Add Stickers & Washi Tape */}
              {isAdmin && (
                <>
                  {/* Admin Add Memory Button */}
                  <button
                    onClick={() => openAddMemoryModal()}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-code flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Memory / Photo (MongoDB)</span>
                  </button>

                  {/* Dedicated Add Stickers / Washi Tape Button (Admin Only) */}
                  <button
                    type="button"
                    onClick={() => openStickerStudio()}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-400 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white text-xs font-bold font-code flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                    title="Add Stickers & Washi Tape to Planner (MongoDB Atlas)"
                  >
                    <Sparkles size={14} className="text-amber-100 animate-pulse" />
                    <span>+ Add Stickers / Washi Tape</span>
                  </button>

                  {/* Dedicated Edit Month Cover Button (Admin Only) */}
                  <button
                    type="button"
                    onClick={() => openEditCoverModal(selectedMonth)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white text-xs font-bold font-code flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                    title={`Edit ${MONTH_NAMES_EN[selectedMonth - 1]} Cover Photo (select from month photos or upload)`}
                  >
                    <Camera size={14} className="text-sky-100" />
                    <span>🖼️ Edit Month Cover</span>
                  </button>

                  {/* Creative Washi Tape & Sticker Accents for Creative Scrapbook Feelings (Admin Only) */}
                  <div className="flex items-center gap-1.5 pl-1.5 py-0.5 border-l border-slate-200/80 dark:border-slate-700/80">
                    <div
                      onClick={() => openStickerStudio()}
                      className="px-2 py-0.5 rounded-sm washi-pattern-mint rotate-[-2deg] text-[0.68rem] font-handwriting font-bold text-emerald-950 shadow-2xs flex items-center gap-1 select-none cursor-pointer hover:rotate-0 hover:scale-105 transition-all"
                      title="Washi Tape Studio"
                    >
                      <span>🏷️</span>
                      <span>washi</span>
                    </div>
                    <div className="flex items-center -space-x-1 select-none" title="Click any sticker to stamp on planner">
                      <span
                        onClick={() => openStickerStudio('flower')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Cherry Blossom Sticker (🌸)"
                      >
                        🌸
                      </span>
                      <span
                        onClick={() => openStickerStudio('coffee')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Warm Coffee Sticker (☕)"
                      >
                        ☕
                      </span>
                      <span
                        onClick={() => openStickerStudio('sparkle')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Magic Sparkle Sticker (✨)"
                      >
                        ✨
                      </span>
                      <span
                        onClick={() => openStickerStudio('heart')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Cozy Heart Sticker (💛)"
                      >
                        💛
                      </span>
                      <span
                        onClick={() => openStickerStudio('cat')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Cute Kitty Sticker (🐱)"
                      >
                        🐱
                      </span>
                      <span
                        onClick={() => openStickerStudio('croissant')}
                        className="text-base hover:scale-130 transition-transform cursor-pointer drop-shadow-xs"
                        title="Bakery Croissant Sticker (🥐)"
                      >
                        🥐
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cozy Tagline View */}
          <div className="border-t border-slate-200/70 dark:border-slate-800/70 pt-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-handwriting">
            <span className="text-amber-500 font-sans text-xs">✦</span>
            <p className="leading-snug">
              {data.subtitle || 'A soft, cozy memory calendar capturing everyday moments, art, travels, and personal life logs.'}
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
              {normalizedMonths.map((m) => {
                const isSelected = selectedMonth === m.month;
                const memoryCount = (data.memories || []).filter((mem) => mem.month === m.month).length;
                const coverImageSrc = getMonthCoverImage(m.month);

                return (
                  <div
                    key={m.month}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedMonth(m.month);
                      confetti({ particleCount: 20, spread: 40, origin: { x: 0.3, y: 0.6 } });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedMonth(m.month);
                      }
                    }}
                    className={`group relative flex flex-col p-2.5 rounded-2xl transition-all duration-300 text-left cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 shadow-md scale-102 ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-amber-300 hover:shadow-sm hover:scale-101'
                    }`}
                  >
                    {/* Month Label & Action */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-100 group-hover:text-amber-700">
                          {m.name}
                        </span>
                        {m.month === (new Date().getMonth() + 1) && (
                          <span className="text-[0.55rem] font-code px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-extrabold shadow-2xs">
                            now
                          </span>
                        )}
                      </div>
                      {isSelected ? (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      ) : (
                        <span className="text-[0.6rem] font-code text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {String(m.month).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Mini Scrapbook Box: Photo OR Cozy Emoji & Checklist */}
                    {coverImageSrc && !m.noPicMode && !brokenMonthImages[m.month] ? (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700">
                        <Image
                          src={coverImageSrc}
                          alt={m.name}
                          fill
                          sizes="100px"
                          onError={() => setBrokenMonthImages((prev) => ({ ...prev, [m.month]: true }))}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Cute Tape Sticker on Top */}
                        <div className="absolute top-1 left-2 w-7 h-2 bg-amber-200/90 dark:bg-amber-400/70 rotate-[-8deg] shadow-xs rounded-xs pointer-events-none" />

                        {/* Memory Count Badge */}
                        {memoryCount > 0 && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white font-code text-[0.6rem] font-bold backdrop-blur-xs pointer-events-none">
                            {memoryCount} {memoryCount === 1 ? 'pic' : 'pics'}
                          </span>
                        )}

                        {/* Dedicated Change Cover Photo Button - Admin Only */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditCoverModal(m.month);
                            }}
                            className="absolute top-1 right-1 p-1 sm:p-1.2 rounded-lg bg-slate-900/85 hover:bg-amber-500 text-white backdrop-blur-xs transition-all duration-200 shadow-md z-20 cursor-pointer opacity-85 hover:opacity-100 hover:scale-110"
                            title={`Edit ${m.name} Cover or switch to Emoji & Checklist Mode`}
                          >
                            <Camera size={11} className="drop-shadow-xs" />
                          </button>
                        )}
                      </div>
                    ) : (
                      /* NO PIC MODE: COZY EMOJI & CHECKLIST SCRAPBOOK CARD */
                      <div
                        className={`relative w-full aspect-square rounded-xl p-2 border flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-200 ${getCardBgThemeClass(
                          m.cardBgTheme
                        )}`}
                      >
                        {/* Washi Tape Strip on Top */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-amber-300/80 dark:bg-amber-400/60 rotate-[-2deg] rounded-xs shadow-2xs pointer-events-none" />

                        {/* Prominent Aesthetic Emojis */}
                        <div className="flex-1 flex flex-col items-center justify-center pt-1.5 select-none">
                          <div className="flex items-center gap-1 text-2xl sm:text-3xl filter drop-shadow-xs hover:scale-110 transition-transform">
                            {(m.emojiVibe && m.emojiVibe.length > 0 ? m.emojiVibe : m.stickers || ['✨', '💛']).slice(0, 3).map((em, eIdx) => (
                              <span key={eIdx}>{em}</span>
                            ))}
                          </div>
                          <span className="text-[0.6rem] font-handwriting font-bold text-amber-900/80 dark:text-amber-200/80 line-clamp-1 mt-0.5">
                            {m.vibeText || 'Cozy vibes'}
                          </span>
                        </div>

                        {/* Checklist Goals Text added via Admin */}
                        <div className="border-t border-amber-900/15 dark:border-amber-100/15 pt-1 space-y-0.5">
                          {m.checklist && m.checklist.length > 0 ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-between text-[0.55rem] font-code font-bold text-amber-800 dark:text-amber-300">
                                <span className="flex items-center gap-0.5">
                                  <ListTodo size={8} /> Goals
                                </span>
                                <span>
                                  {m.checklist.filter((c) => c.completed).length}/{m.checklist.length}
                                </span>
                              </div>
                              {/* Mini Progress Bar */}
                              <div className="w-full h-1 bg-amber-200/60 dark:bg-amber-900/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                  style={{
                                    width: `${Math.round(
                                      (m.checklist.filter((c) => c.completed).length / m.checklist.length) * 100
                                    )}%`,
                                  }}
                                />
                              </div>
                              {/* First checklist item with clickable checkbox */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isAdmin) {
                                    toggleMonthChecklistItem(m.month, m.checklist![0].id);
                                  }
                                }}
                                className={`flex items-center gap-1 text-[0.52rem] font-handwriting truncate text-slate-800 dark:text-slate-200 ${
                                  isAdmin ? 'cursor-pointer hover:text-indigo-600 transition-colors' : ''
                                }`}
                              >
                                {m.checklist[0].completed ? (
                                  <CheckSquare size={9} className="text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <Square size={9} className="text-amber-700/70 flex-shrink-0" />
                                )}
                                <span className={`truncate ${m.checklist[0].completed ? 'line-through text-slate-400' : 'font-bold'}`}>
                                  {m.checklist[0].text}
                                </span>
                              </div>
                            </div>
                          ) : isAdmin ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCoverModal(m.month);
                              }}
                              className="w-full text-[0.52rem] font-handwriting text-center text-amber-800/70 dark:text-amber-300/70 italic hover:text-amber-900 cursor-pointer"
                            >
                              + Add checklist
                            </button>
                          ) : null}
                        </div>

                        {/* Dedicated Admin Edit Button - Admin Only */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditCoverModal(m.month);
                            }}
                            className="absolute top-1 right-1 p-1 sm:p-1.2 rounded-lg bg-slate-900/80 hover:bg-amber-500 text-white backdrop-blur-xs transition-all shadow-md z-20 cursor-pointer opacity-85 hover:opacity-100 hover:scale-110"
                            title={`Customize ${m.name} Emojis & Checklist (Admin)`}
                          >
                            <Pencil size={10} className="drop-shadow-xs" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stickers Footer */}
                    <div className="flex items-center gap-1 mt-1.5 text-[0.7rem] select-none">
                      {m.stickers?.slice(0, 3).map((stk, sIdx) => (
                        <span key={sIdx}>{stk}</span>
                      ))}
                    </div>
                  </div>
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
              className={`relative rounded-3xl shadow-2xl transition-all duration-300 ${
                isFullscreen
                  ? 'fixed inset-0 z-[4000] p-2 sm:p-4 bg-[#1a202c] flex items-center justify-center overflow-y-auto'
                  : 'p-4 sm:p-7 md:p-9 bg-cover bg-center overflow-hidden'
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
                ref={plannerCanvasRef}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onClick={() => {
                  if (activeSelectedStickerId) setActiveSelectedStickerId(null);
                }}
                className={`relative z-20 w-full bg-[#fdfbf7] text-slate-800 rounded-2xl shadow-2xl border border-amber-900/15 transition-all flex flex-col justify-between ${
                  isFullscreen
                    ? 'max-w-6xl h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] p-3 sm:p-5 md:p-6'
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
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5">
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

                    {/* Real-time Month & Day Indicator */}
                    {selectedMonth === new Date().getMonth() + 1 && selectedYear === new Date().getFullYear() && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[0.68rem] font-bold font-code flex items-center gap-1 border border-emerald-300 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Today: Day {new Date().getDate()}
                      </span>
                    )}

                    {/* Admin Only Controls: Month Cover / Theme, Canvas Stickers Studio, Move Stickers Mode */}
                    {isAdmin && (
                      <>
                        {/* Quick Month Cover / Theme Button */}
                        {!isFullscreen && (
                          <button
                            type="button"
                            onClick={() => openEditCoverModal(selectedMonth)}
                            className="ml-1 px-2.5 py-1 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-[0.7rem] font-bold font-code flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                            title={`Edit ${MONTH_NAMES_EN[selectedMonth - 1]} Cover, Emojis or Checklist`}
                          >
                            <Camera size={12} className="text-amber-700" />
                            <span className="hidden sm:inline">Cover / Theme</span>
                          </button>
                        )}

                        {/* Canvas Stickers Studio Button (matching Image 2) */}
                        <button
                          type="button"
                          onClick={() => setIsCanvasStudioOpen(true)}
                          className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white text-[0.7rem] font-bold font-code flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title="Paste Stickers on Month Canvas (Photos, Cutouts, Notes)"
                        >
                          <Sparkles size={11} className="text-amber-100 animate-pulse" />
                          <span>🎨 Canvas ({currentMonthCanvasStickers.length})</span>
                        </button>

                        {/* Move Stickers Mode Toggle */}
                        {currentMonthCanvasStickers.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsCanvasEditMode(!isCanvasEditMode)}
                            className={`px-2 py-1 rounded-xl text-[0.68rem] font-bold font-code flex items-center gap-1 cursor-pointer transition-colors ${
                              isCanvasEditMode
                                ? 'bg-amber-200/90 text-amber-900 ring-1 ring-amber-400'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Toggle Draggable Stickers Mode"
                          >
                            <Move size={10} />
                            <span>{isCanvasEditMode ? 'Move: ON' : 'Move: OFF'}</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* Month Goals & Checklist Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => setIsMonthChecklistExpanded(!isMonthChecklistExpanded)}
                      className="px-2.5 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200 text-amber-900 text-[0.7rem] font-bold font-code flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="Toggle Month Checklist Ribbon"
                    >
                      <ListTodo size={12} className="text-amber-700" />
                      <span>
                        Goals (
                        {(normalizedMonths[selectedMonth - 1]?.checklist || []).filter((c) => c.completed).length}/
                        {(normalizedMonths[selectedMonth - 1]?.checklist || []).length})
                      </span>
                    </button>
                  </div>

                  {/* Navigation & Controls */}
                  <div className="flex items-center gap-1.5 relative z-20">
                    {/* Jump to Today button if navigated away from current month */}
                    {(selectedMonth !== new Date().getMonth() + 1 || selectedYear !== new Date().getFullYear()) && (
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          setSelectedMonth(now.getMonth() + 1);
                          setSelectedYear(now.getFullYear());
                        }}
                        className="px-2.5 py-1 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-slate-800 text-[0.7rem] font-bold font-planner-title transition-colors cursor-pointer shadow-2xs flex items-center gap-1 mr-1"
                        title="Jump back to real-time month and day"
                      >
                        <span className="text-amber-700">✦</span>
                        <span>Today</span>
                      </button>
                    )}

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

                {/* EXPANDABLE MONTH GOALS & CHECKLIST RIBBON */}
                {isMonthChecklistExpanded && (
                  <div className="relative z-20 mb-3 p-3 bg-amber-50/95 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-800/60 rounded-2xl shadow-inner space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ListTodo size={14} className="text-amber-700 dark:text-amber-400" />
                        <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-100">
                          {MONTH_NAMES_EN[selectedMonth - 1]} Goals & Checklist
                        </span>
                        <span className="text-[0.62rem] font-code px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                          {(normalizedMonths[selectedMonth - 1]?.checklist || []).filter((c) => c.completed).length} /{' '}
                          {(normalizedMonths[selectedMonth - 1]?.checklist || []).length} completed
                        </span>
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openEditCoverModal(selectedMonth)}
                          className="text-[0.68rem] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil size={10} /> Edit in Studio
                        </button>
                      )}
                    </div>

                    {/* Goals List with Clickable Checkboxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(normalizedMonths[selectedMonth - 1]?.checklist || []).map((goal) => (
                        <div
                          key={goal.id}
                          onClick={() => {
                            if (isAdmin) toggleMonthChecklistItem(selectedMonth, goal.id);
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                            isAdmin ? 'cursor-pointer hover:border-amber-400' : ''
                          } ${
                            goal.completed
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-500'
                              : 'bg-white dark:bg-slate-800 border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {goal.completed ? (
                            <CheckSquare size={13} className="text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Square size={13} className="text-amber-600 flex-shrink-0" />
                          )}
                          <span className={`text-xs font-handwriting truncate ${goal.completed ? 'line-through text-slate-400' : 'font-bold'}`}>
                            {goal.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Inline Quick Add Goal */}
                    {isAdmin && (
                      <div className="flex gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                        <input
                          type="text"
                          placeholder={`+ Add a new goal or to-do for ${MONTH_NAMES_EN[selectedMonth - 1]}...`}
                          value={quickNewGoalText}
                          onChange={(e) => setQuickNewGoalText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addQuickMonthGoal(selectedMonth, quickNewGoalText);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-handwriting"
                        />
                        <button
                          type="button"
                          onClick={() => addQuickMonthGoal(selectedMonth, quickNewGoalText)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          + Add Goal
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* FREEFORM SCRAPBOOK CANVAS STICKERS LAYER (matching Image 2) */}
                <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
                  {currentMonthCanvasStickers.map((stk) => {
                    const isSelected = activeSelectedStickerId === stk.id;
                    return (
                      <div
                        key={stk.id}
                        style={{
                          left: `${stk.x}%`,
                          top: `${stk.y}%`,
                          transform: `translate(-50%, -50%) rotate(${stk.rotation || 0}deg) scale(${stk.scale || 1})`,
                          zIndex: isSelected ? 50 : (stk.zIndex || 20),
                        }}
                        onPointerDown={(e) => {
                          if (isAdmin) handleStickerPointerDown(stk.id, e);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAdmin) {
                            setActiveSelectedStickerId(isSelected ? null : stk.id);
                          }
                        }}
                        className={`absolute pointer-events-auto select-none transition-shadow ${
                          isAdmin && isCanvasEditMode ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-amber-400 rounded-xl' : ''
                        } ${isSelected && isAdmin ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}
                      >
                        {renderCanvasStickerContent(stk)}

                        {/* Selected Floating Toolbar - Admin Only */}
                        {isSelected && isCanvasEditMode && isAdmin && (
                          <div
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              transform: `translateX(-50%) rotate(-${stk.rotation || 0}deg) scale(${1 / (stk.scale || 1)})`,
                              transformOrigin: (stk.y ?? 50) < 14 ? 'top center' : 'bottom center',
                            }}
                            className={`absolute left-1/2 flex items-center gap-1 p-1 bg-slate-900/95 text-white rounded-xl shadow-2xl backdrop-blur-md text-xs z-[60] whitespace-nowrap border border-white/20 select-none cursor-default ${
                              (stk.y ?? 50) < 14 ? 'top-full mt-2.5' : '-top-12'
                            }`}
                          >
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRotateSticker(stk.id, -15);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-90 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
                              title="Rotate Left (-15°)"
                            >
                              ⟲
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRotateSticker(stk.id, 15);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-90 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
                              title="Rotate Right (+15°)"
                            >
                              ⟳
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScaleSticker(stk.id, -0.15);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-90 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
                              title="Smaller (−)"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScaleSticker(stk.id, 0.15);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-90 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
                              title="Larger (+)"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBringToFront(stk.id);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-90 text-white transition-all cursor-pointer shadow-xs"
                              title="Bring to Front"
                            >
                              <Layers size={13} />
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerUp={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCanvasSticker(stk.id);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-950/80 hover:bg-rose-600 active:scale-90 text-rose-200 hover:text-white transition-all cursor-pointer shadow-xs"
                              title="Delete Sticker"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                    isFullscreen ? 'flex-1 min-h-0 grid-rows-6' : ''
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

                    const now = new Date();
                    const isToday =
                      !isBlank &&
                      cell.dayNumber === now.getDate() &&
                      selectedMonth === now.getMonth() + 1 &&
                      selectedYear === now.getFullYear();

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isBlank) handleDayClick(cell.dayNumber!);
                        }}
                        className={`border-r border-b border-amber-900/15 p-1 sm:p-1.5 relative transition-all duration-200 flex flex-col justify-between group ${
                          isFullscreen
                            ? 'h-full min-h-0 overflow-hidden'
                            : 'min-h-[76px] sm:min-h-[96px] md:min-h-[110px]'
                        } ${
                          isBlank
                            ? 'bg-amber-50/20 opacity-30 select-none'
                            : isToday
                            ? 'bg-amber-100/60 hover:bg-amber-100/90 ring-2 ring-amber-500/70 ring-inset cursor-pointer shadow-xs z-10'
                            : 'hover:bg-amber-50/50 cursor-pointer'
                        }`}
                      >
                        {/* Day Number */}
                        {!isBlank && (
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[0.65rem] sm:text-xs font-bold font-planner-title ${
                                isToday
                                  ? 'bg-amber-600 text-white px-1.5 py-0.2 rounded-full shadow-xs'
                                  : 'text-slate-600 group-hover:text-amber-800'
                              }`}
                            >
                              {cell.dayNumber}
                            </span>
                            {isToday && (
                              <span className="text-[0.52rem] font-code font-bold text-amber-800 bg-amber-200/90 px-1 py-0.2 rounded border border-amber-400 shadow-2xs uppercase tracking-tighter">
                                today
                              </span>
                            )}
                            {/* Admin Quick Add Icon on empty days */}
                            {isAdmin && !hasMemory && !isToday && (
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
                          <div className="flex-1 min-h-0 flex flex-col justify-center items-center my-0.5 relative group-hover:scale-103 transition-transform overflow-hidden">
                            {/* Photo Polaroid Thumbnail if image exists */}
                            {hasPhotos && activePhotoUrl ? (
                              <div
                                className={`relative w-full rounded-md overflow-hidden bg-white shadow-xs border border-amber-900/20 p-0.5 sm:p-1 rotate-[-1deg] group-hover:rotate-0 transition-all duration-300 ${
                                  isFullscreen
                                    ? 'h-8 sm:h-10 md:h-11 lg:h-13 max-h-[52px]'
                                    : 'h-14 sm:h-16 md:h-20'
                                }`}
                              >
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
                                    className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded-xs bg-slate-900/85 backdrop-blur-xs text-[0.5rem] font-code font-bold text-white flex items-center gap-0.5 shadow-xs select-none z-10"
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
                                  className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-xs opacity-90 shadow-2xs z-10 pointer-events-none ${getWashiTapeClass(primaryMem.tapeColor)} ${
                                    isFullscreen ? 'w-5 sm:w-6 h-1 sm:h-1.5' : 'w-6 sm:w-8 h-2'
                                  }`}
                                />

                                {/* Floating Sticker Accent on Photo */}
                                {primaryMem.sticker && (
                                  <div
                                    className={`absolute -bottom-1 -right-1 select-none filter drop-shadow-xs rotate-[6deg] z-20 ${
                                      isFullscreen ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                                    }`}
                                  >
                                    {resolveStickerIcon(primaryMem.sticker)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Pure Washi Tape + Sticker when no photo */
                              <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-0.5 relative">
                                {/* Washi Tape Strip at top of cell */}
                                {primaryMem.tapeColor && (
                                  <div
                                    className={`rounded-xs shadow-2xs rotate-[-2deg] mb-0.5 pointer-events-none ${getWashiTapeClass(primaryMem.tapeColor)} ${
                                      isFullscreen ? 'w-6 sm:w-8 h-1 sm:h-1.5' : 'w-10 sm:w-14 h-2.5 sm:h-3'
                                    }`}
                                  />
                                )}

                                {/* Cozy Sticker Emoji */}
                                {primaryMem.sticker && (
                                  <div
                                    className={`select-none filter drop-shadow-xs rotate-[3deg] hover:scale-115 transition-transform my-0.5 ${
                                      isFullscreen ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
                                    }`}
                                  >
                                    {resolveStickerIcon(primaryMem.sticker)}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Day Checklist Tasks with Interactive Checkboxes */}
                            {primaryMem.checklist && primaryMem.checklist.length > 0 && (
                              <div
                                className="w-full space-y-0.5 my-0.5 px-0.5 select-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {primaryMem.checklist.slice(0, 2).map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isAdmin) {
                                        toggleDayChecklistItem(primaryMem.id, item.id);
                                      }
                                    }}
                                    className={`w-full flex items-center gap-1 text-left group/dtask rounded px-0.5 py-0.2 transition-colors ${
                                      isAdmin ? 'cursor-pointer hover:bg-amber-100/60 dark:hover:bg-amber-900/40' : ''
                                    }`}
                                    title={isAdmin ? (item.completed ? 'Mark incomplete' : 'Mark completed') : undefined}
                                  >
                                    {item.completed ? (
                                      <CheckSquare size={10} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    ) : (
                                      <Square size={10} className="text-amber-700/80 dark:text-amber-400/80 flex-shrink-0" />
                                    )}
                                    <span
                                      className={`text-[0.55rem] sm:text-[0.6rem] truncate leading-tight ${
                                        item.completed
                                          ? 'line-through text-slate-400 font-sans'
                                          : 'text-slate-800 dark:text-slate-200 font-handwriting font-bold'
                                      }`}
                                    >
                                      {item.text}
                                    </span>
                                  </button>
                                ))}
                                {primaryMem.checklist.length > 2 && (
                                  <span className="text-[0.48rem] font-code text-amber-700 dark:text-amber-400 font-bold px-0.5 block">
                                    +{primaryMem.checklist.length - 2} more tasks
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Handwritten Note / Doodle Sticker Text */}
                            {primaryMem.stickerText ? (
                              <span
                                className={`font-handwriting font-bold leading-none text-center px-0.5 truncate max-w-full ${
                                  isFullscreen ? 'text-[0.55rem] sm:text-[0.62rem] mt-0.5' : 'text-[0.62rem] sm:text-xs mt-0.5'
                                } ${
                                  primaryMem.stickerText.includes('happy')
                                    ? 'text-rose-600 font-extrabold'
                                    : primaryMem.stickerText.includes('mudanza')
                                    ? 'text-amber-700'
                                    : 'text-slate-800'
                                }`}
                              >
                                {primaryMem.stickerText}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Paper Footer */}
                <div className="flex items-center justify-between pt-2 sm:pt-2.5 mt-0.5 sm:mt-1 border-t border-amber-900/15 text-xs text-slate-500 font-handwriting flex-shrink-0">
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
      {selectedMemory && (() => {
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
        const monthCover = getMonthCoverImage(selectedMemory.month);
        const isCurrentCover = activeModalPhoto && monthCover === activeModalPhoto;

        return (
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
                {activeModalPhoto && (
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
                )}

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
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-900/10">
                {activeModalPhoto && (
                  <button
                    type="button"
                    onClick={() => handleSetMemoryAsCover(selectedMemory, activeModalPhoto)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-code flex items-center gap-1 cursor-pointer shadow-xs transition-colors ${
                      isCurrentCover
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title={`Set this photo as the cover for ${MONTH_NAMES_EN[selectedMemory.month - 1]}`}
                  >
                    <Camera size={12} />
                    <span>
                      {isCurrentCover
                        ? `✓ Active ${MONTH_NAMES_EN[selectedMemory.month - 1].substring(0, 3)} Cover`
                        : `Set as ${MONTH_NAMES_EN[selectedMemory.month - 1].substring(0, 3)} Cover`}
                    </span>
                  </button>
                )}
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
        );
      })()}

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
              {/* Memory Mode Switcher */}
              <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setFormMode('photo')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formMode === 'photo'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Camera size={13} />
                  <span>Photo Memory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('checklist')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formMode === 'checklist'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ListTodo size={13} />
                  <span>Emoji & Checklist (No Pic)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('hybrid')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formMode === 'hybrid'
                      ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Both (Photo + Tasks)</span>
                </button>
              </div>

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
                  placeholder="e.g. Sunset at the Lake, Finals done, Cafe brunch, or Daily Checklist"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              {/* Day Checklist & Tasks Manager (No Pic or Both mode) */}
              {(formMode === 'checklist' || formMode === 'hybrid') && (
                <div className="space-y-2 p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ListTodo size={14} className="text-amber-600" />
                      <span>Day Checklist & To-Dos ({formChecklist.length})</span>
                    </label>
                    <span className="text-[0.65rem] font-code text-slate-500">
                      Shows directly in day cell on calendar
                    </span>
                  </div>

                  {/* Existing tasks list */}
                  {formChecklist.length > 0 && (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {formChecklist.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-700"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setFormChecklist((prev) =>
                                prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                              )
                            }
                            className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckSquare size={13} className="text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Square size={13} className="text-slate-400 flex-shrink-0" />
                            )}
                            <span
                              className={`text-xs font-handwriting ${
                                task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-bold'
                              }`}
                            >
                              {task.text}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormChecklist((prev) => prev.filter((t) => t.id !== task.id))
                            }
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove task"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add task input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. Morning walk, Read research paper, Deploy app..."
                      value={newDayChecklistInput}
                      onChange={(e) => setNewDayChecklistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newDayChecklistInput.trim()) {
                            setFormChecklist((prev) => [
                              ...prev,
                              { id: `dtask-${Date.now()}`, text: newDayChecklistInput.trim(), completed: false },
                            ]);
                            setNewDayChecklistInput('');
                          }
                        }
                      }}
                      className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-handwriting"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDayChecklistInput.trim()) {
                          setFormChecklist((prev) => [
                            ...prev,
                            { id: `dtask-${Date.now()}`, text: newDayChecklistInput.trim(), completed: false },
                          ]);
                          setNewDayChecklistInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Add Task
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Handwritten Note / Story
                </label>
                <textarea
                  rows={2}
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
                    <option value="gold">Yellow / Gold Shimmer Washi</option>
                    <option value="pink">Sakura Pink Floral Tape</option>
                    <option value="mint">Sage Mint Grid Tape</option>
                    <option value="lavender">Lavender Pastel Tape</option>
                    <option value="kraft">Kraft Vintage Paper Tape</option>
                    <option value="sky">Sky Blue Clouds Tape</option>
                    <option value="peach">Warm Peach Polka Tape</option>
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
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

      {/* ========================================================= */}
      {/* COZY STICKERS & WASHI TAPE STUDIO MODAL (ADMIN ONLY)     */}
      {/* ========================================================= */}
      {isAdmin && isStickerStudioOpen && (
        <div className="fixed inset-0 z-[4700] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#fdfbf7] dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 border border-amber-900/20 dark:border-slate-800 max-h-[92vh] overflow-y-auto rotate-[-0.5deg]">
            {/* Top Washi Tapes Taped on Studio Modal */}
            <div className="absolute -top-3 left-10 w-20 h-4 washi-pattern-pink rotate-[-3deg] shadow-xs rounded-xs pointer-events-none opacity-90" />
            <div className="absolute -top-3 right-16 w-20 h-4 washi-pattern-gold rotate-[4deg] shadow-xs rounded-xs pointer-events-none opacity-90" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                <div>
                  <h3 className="text-base font-bold font-planner-title text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    Cozy Stickers & Washi Tape Studio
                    <span className="text-amber-500 font-normal text-xs font-handwriting">✨ aesthetic</span>
                  </h3>
                  <p className="text-xs font-handwriting text-slate-500 dark:text-slate-400">
                    Stamp cozy washi tapes, stickers & handwritten doodle notes onto any day
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStickerStudioOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStickerStudio} className="space-y-4 text-xs">
              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-900/10 dark:border-slate-800">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 font-planner-title">
                    Planner Month
                  </label>
                  <select
                    value={stickerStudioMonth}
                    onChange={(e) => setStickerStudioMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans cursor-pointer"
                  >
                    {MONTH_NAMES_EN.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {idx + 1} - {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 font-planner-title">
                    Day (1 - 31)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={stickerStudioDay}
                    onChange={(e) => setStickerStudioDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-code font-bold"
                  />
                </div>
              </div>

              {/* 1. Washi Tape Style Palette */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5 font-planner-title flex items-center justify-between">
                  <span>1. Choose Washi Tape Pattern</span>
                  <span className="text-[0.68rem] font-handwriting text-amber-700 dark:text-amber-400">
                    authentic stationery tape textures
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'gold', name: 'Gold Dots', class: 'washi-pattern-gold' },
                    { id: 'pink', name: 'Sakura Pink', class: 'washi-pattern-pink' },
                    { id: 'mint', name: 'Sage Grid', class: 'washi-pattern-mint' },
                    { id: 'lavender', name: 'Lavender', class: 'washi-pattern-lavender' },
                    { id: 'kraft', name: 'Kraft Paper', class: 'washi-pattern-kraft' },
                    { id: 'sky', name: 'Sky Clouds', class: 'washi-pattern-sky' },
                    { id: 'peach', name: 'Peach Polka', class: 'washi-pattern-peach' },
                  ].map((tape) => (
                    <button
                      key={tape.id}
                      type="button"
                      onClick={() => setStickerStudioTapeColor(tape.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        stickerStudioTapeColor === tape.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-400/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300'
                      }`}
                    >
                      <div className={`w-full h-4 rounded-xs shadow-2xs ${tape.class}`} />
                      <span className="text-[0.65rem] font-code font-bold text-slate-700 dark:text-slate-300">
                        {tape.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Cozy Stickers Collection Picker */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5 font-planner-title flex items-center justify-between">
                  <span>2. Pick Cute Scrapbook Sticker</span>
                  <span className="text-[0.68rem] font-handwriting text-amber-700 dark:text-amber-400">
                    tap any icon to stamp
                  </span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-900/10 dark:border-slate-800 max-h-36 overflow-y-auto">
                  {Object.entries(STICKER_ICONS).map(([key, icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setStickerStudioChoice(key);
                        if (!stickerStudioText || stickerStudioText === 'cozy moments 🌸') {
                          if (key === 'coffee') setStickerStudioText('cozy coffee time ☕');
                          else if (key === 'flower') setStickerStudioText('cherry blossom vibes 🌸');
                          else if (key === 'sparkle') setStickerStudioText('magical day ✨');
                          else if (key === 'heart') setStickerStudioText('happy heart 💛');
                          else if (key === 'cat') setStickerStudioText('kitty naps 🐱');
                          else if (key === 'croissant') setStickerStudioText('bakery treats 🥐');
                          else if (key === 'art') setStickerStudioText('art afternoon 🎨');
                          else if (key === 'music') setStickerStudioText('lo-fi tunes 🎧');
                          else if (key === 'book') setStickerStudioText('reading journal 📖');
                        }
                      }}
                      className={`h-11 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                        stickerStudioChoice === key
                          ? 'bg-amber-200 dark:bg-amber-900/80 scale-110 shadow-sm ring-2 ring-amber-400'
                          : 'bg-white dark:bg-slate-800 hover:scale-105 hover:bg-amber-100/50'
                      }`}
                      title={`${key} sticker`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Handwritten Note / Doodle Caption */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title">
                  3. Handwritten Sticker Text / Doodle Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. coffee morning ☕, happy moments ✨, mudanza!!, art day 🎨"
                  value={stickerStudioText}
                  onChange={(e) => setStickerStudioText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-handwriting text-base"
                />

                {/* Quick Inspiration Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'cozy coffee ☕',
                    'happy moments ✨',
                    'cherry blossom 🌸',
                    'reading & tea 📖',
                    'art afternoon 🎨',
                    'sunset walk 🌅',
                    'sweet croissant 🥐',
                    'lo-fi beats 🎧',
                    'finals done! 🎓',
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setStickerStudioText(phrase)}
                      className="px-2.5 py-0.5 rounded-full bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-handwriting text-xs transition-colors cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Optional Longer Journal Story */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title">
                  Optional Journal Story / Memory Note
                </label>
                <textarea
                  rows={2}
                  placeholder="What made this day cozy or special?"
                  value={stickerStudioNote}
                  onChange={(e) => setStickerStudioNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              {/* 5. Live Scrapbook Cell Preview */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-amber-900/15 dark:border-slate-700 space-y-1.5 text-center">
                <span className="text-[0.65rem] font-code font-bold uppercase tracking-wider text-slate-400">
                  ✦ Live Scrapbook Cell Preview ✦
                </span>
                <div className="w-28 sm:w-36 h-24 mx-auto bg-[#fdfbf7] dark:bg-slate-900 rounded-xl p-2 border border-amber-900/20 shadow-xs flex flex-col items-center justify-between relative rotate-[-1deg]">
                  {/* Washi Tape Strip */}
                  <div
                    className={`w-14 h-2.5 rounded-xs shadow-2xs rotate-[-1deg] ${getWashiTapeClass(
                      stickerStudioTapeColor
                    )}`}
                  />

                  {/* Sticker Emoji */}
                  <div className="text-3xl select-none filter drop-shadow-xs rotate-[3deg] my-0.5">
                    {resolveStickerIcon(stickerStudioChoice)}
                  </div>

                  {/* Handwritten Text */}
                  <span className="text-xs font-handwriting font-bold leading-tight line-clamp-1 text-slate-800 dark:text-slate-100">
                    {stickerStudioText || 'cozy moment ✨'}
                  </span>

                  <span className="absolute bottom-1 right-1.5 text-[0.55rem] font-code font-bold text-slate-400">
                    {stickerStudioMonth}/{stickerStudioDay}
                  </span>
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsStickerStudioOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isAdmin ? 'Save to Planner (MongoDB Atlas)' : 'Log in as Admin to Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MONTH COVER PHOTO STUDIO MODAL                            */}
      {/* ========================================================= */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-[4700] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#fdfbf7] dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 border border-amber-900/20 dark:border-slate-800 max-h-[92vh] overflow-y-auto rotate-[-0.3deg]">
            {/* Top Washi Tapes Accents */}
            <div className="absolute -top-3 left-10 w-24 h-4 washi-pattern-gold rotate-[-3deg] shadow-xs rounded-xs pointer-events-none opacity-90" />
            <div className="absolute -top-3 right-16 w-20 h-4 washi-pattern-pink rotate-[4deg] shadow-xs rounded-xs pointer-events-none opacity-90" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🖼️</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-planner-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Month Cover Photo Studio
                    <span className="text-amber-500 font-normal text-xs font-handwriting">
                      ✦ 12-month scrapbook
                    </span>
                  </h3>
                  <p className="text-xs font-handwriting text-slate-500 dark:text-slate-400">
                    Select a cover photo from memories uploaded in this month (Days 1–31) or upload a custom image
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Month Switcher Dropdown */}
            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-900/10 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-amber-600" />
                <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-200">
                  Select Month to Customize:
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <select
                  value={coverModalMonth}
                  onChange={(e) => handleSwitchCoverModalMonth(Number(e.target.value))}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold font-planner-title cursor-pointer shadow-2xs"
                >
                  {MONTH_NAMES_EN.map((mName, idx) => (
                    <option key={idx} value={idx + 1}>
                      {idx + 1} - {mName} ({MONTH_NAMES_ES[idx]})
                    </option>
                  ))}
                </select>
                <span className="text-[0.68rem] font-code px-2 py-1 rounded-lg bg-amber-200/70 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold whitespace-nowrap">
                  1 to {new Date(selectedYear, coverModalMonth, 0).getDate()} days
                </span>
              </div>
            </div>

            {/* Mode Switcher: Photo Cover vs Aesthetic Emoji & Checklist Mode */}
            <div className="flex p-1 rounded-2xl bg-amber-100/70 dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setCoverModeTab('photo');
                  setCoverNoPicMode(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold font-planner-title flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  coverModeTab === 'photo'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera size={14} />
                <span>🖼️ Photo Cover Mode</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCoverModeTab('nopic');
                  setCoverNoPicMode(true);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold font-planner-title flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  coverModeTab === 'nopic'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>📝 Emoji & Checklist Mode (No Pic)</span>
              </button>
            </div>

            {/* TAB 1: PHOTO COVER MODE */}
            {coverModeTab === 'photo' && (
              <div className="space-y-4">
                {/* SECTION 1: Photos uploaded during this month (Days 1 to 31) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-planner-title text-xs sm:text-sm">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>
                        Photos Uploaded in {MONTH_NAMES_EN[coverModalMonth - 1]} (Days 1–{new Date(selectedYear, coverModalMonth, 0).getDate()})
                      </span>
                    </label>
                    <span className="text-[0.68rem] font-code px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                      {modalMonthPhotos.length} {modalMonthPhotos.length === 1 ? 'photo uploaded' : 'photos uploaded'}
                    </span>
                  </div>

                  {modalMonthPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-2.5 bg-amber-50/40 dark:bg-slate-800/40 rounded-2xl border border-amber-900/10 dark:border-slate-800">
                      {modalMonthPhotos.map((photo, pIdx) => {
                        const isChosen = selectedCoverUrl === photo.url;
                        return (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedCoverUrl(photo.url)}
                            className={`group/item relative rounded-xl overflow-hidden border p-1.5 transition-all cursor-pointer ${
                              isChosen
                                ? 'border-amber-500 bg-amber-100/70 dark:bg-amber-950/60 ring-2 ring-amber-400 shadow-md scale-102'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-300 hover:scale-101'
                            }`}
                          >
                            <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-100">
                              <Image
                                src={photo.url}
                                alt={photo.title}
                                fill
                                sizes="(max-width: 640px) 140px, 180px"
                                className="object-cover group-hover/item:scale-105 transition-transform"
                              />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white font-code text-[0.62rem] font-bold backdrop-blur-xs">
                                Day {photo.day}
                              </span>
                              {isChosen && (
                                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-code text-[0.62rem] font-bold shadow-xs flex items-center gap-0.5">
                                  <Check size={10} /> Active Cover
                                </span>
                              )}
                            </div>
                            <div className="mt-1 px-1 flex items-center justify-between text-[0.68rem]">
                              <span className="font-handwriting font-bold truncate max-w-[110px] text-slate-800 dark:text-slate-200">
                                {photo.title}
                              </span>
                              <span
                                className={`text-[0.65rem] font-bold ${
                                  isChosen ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400'
                                }`}
                              >
                                {isChosen ? 'Selected' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-dashed border-amber-300/80 dark:border-slate-700 text-center space-y-2">
                      <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300 text-base">
                        No memory photos uploaded for {MONTH_NAMES_EN[coverModalMonth - 1]} yet (Days 1–{new Date(selectedYear, coverModalMonth, 0).getDate()}).
                      </p>
                      <p className="text-[0.7rem] text-slate-400 font-sans">
                        You can upload a custom cover photo below, or switch to <strong>Emoji & Checklist Mode</strong> above!
                      </p>
                    </div>
                  )}
                </div>

                {/* SECTION 2: Upload or enter custom URL */}
                <div className="space-y-2.5 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-planner-title text-xs sm:text-sm">
                    <Camera size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Upload New Cover Photo (Drag & Drop or File)</span>
                  </label>

                  <ImageDropzone
                    value={selectedCoverUrl}
                    onChange={(uploadedUrl) => {
                      if (uploadedUrl) {
                        setSelectedCoverUrl(uploadedUrl);
                      }
                    }}
                    label={`Upload Cover Photo for ${MONTH_NAMES_EN[coverModalMonth - 1]}`}
                  />

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /images/art1.jpg or Cloudinary URL)"
                      value={customCoverUrlInput}
                      onChange={(e) => setCustomCoverUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-code"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customCoverUrlInput.trim()) {
                          setSelectedCoverUrl(customCoverUrlInput.trim());
                          setCustomCoverUrlInput('');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>

                {/* SECTION 3: Quick Preset Portfolio Photos */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block text-[0.7rem] font-planner-title">
                    Quick Preset Portfolio Artwork & Photos:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { url: '/images/vandan_lake.png', label: 'Lake' },
                      { url: '/images/vandan.jpg', label: 'Sunlight Tree' },
                      { url: '/images/art1.jpg', label: 'Autumn Tree' },
                      { url: '/images/art2.jpg', label: 'Travel Books' },
                      { url: '/images/art3.jpg', label: 'Scatter Plot' },
                      { url: '/images/art4.jpg', label: 'Sunset Trees' },
                      { url: '/images/art5.jpg', label: 'Art 5' },
                      { url: '/images/art6.jpg', label: 'Art 6' },
                      { url: '/images/vaan.jpg', label: 'Portrait' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCoverUrl(preset.url)}
                        className={`relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          selectedCoverUrl === preset.url
                            ? 'ring-2 ring-amber-500 scale-105 border-amber-500 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <Image src={preset.url} alt={preset.label} fill sizes="48px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EMOJI & CHECKLIST MODE (NO PIC) */}
            {coverModeTab === 'nopic' && (
              <div className="space-y-4">
                {/* Info Alert */}
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs flex items-start gap-2.5">
                  <span className="text-xl">✨</span>
                  <div>
                    <h4 className="font-bold font-planner-title text-amber-900 dark:text-amber-300">
                      Cozy No-Picture Mode Active for {MONTH_NAMES_EN[coverModalMonth - 1]}
                    </h4>
                    <p className="text-[0.72rem] font-handwriting text-slate-700 dark:text-slate-300">
                      When a month has no photos, it renders as a cozy bullet journal card with custom mood emojis, interactive checklist goals, and authentic stationery paper!
                    </p>
                  </div>
                </div>

                {/* 1. Emoji Vibe Selector */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 font-planner-title text-xs sm:text-sm flex items-center gap-1.5">
                      <span>😊 Month Mood Emojis</span>
                      <span className="text-[0.68rem] font-code text-amber-600 font-normal">
                        ({coverEmojiVibe.length} active)
                      </span>
                    </label>
                    <span className="text-[0.65rem] font-handwriting text-slate-500">
                      tap emoji to remove or add
                    </span>
                  </div>

                  {/* Active Selected Emojis */}
                  <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-amber-50/50 dark:bg-slate-900 border border-amber-900/10">
                    {coverEmojiVibe.map((em, eIdx) => (
                      <span
                        key={eIdx}
                        onClick={() => setCoverEmojiVibe((prev) => prev.filter((_, idx) => idx !== eIdx))}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-lg flex items-center gap-1 cursor-pointer hover:bg-rose-50 hover:border-rose-300 shadow-2xs group transition-all"
                        title="Click to remove"
                      >
                        <span>{em}</span>
                        <X size={10} className="text-slate-400 group-hover:text-rose-500" />
                      </span>
                    ))}
                    {coverEmojiVibe.length === 0 && (
                      <span className="text-xs text-slate-400 font-handwriting">
                        No emojis selected yet — choose from presets or palette below!
                      </span>
                    )}
                  </div>

                  {/* Quick Preset Vibes */}
                  <div>
                    <span className="text-[0.68rem] font-code font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Quick Aesthetic Vibe Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '🍂 Autumn Study', emojis: ['🍂', '☕', '📚'], text: 'autumn study season 🍂' },
                        { label: '☕ Cozy Coffee', emojis: ['☕', '🥐', '✨'], text: 'cozy coffee mornings ☕' },
                        { label: '🌸 Spring Blossom', emojis: ['🌸', '🍃', '☀️'], text: 'cherry blossom vibes 🌸' },
                        { label: '☀️ Summer Sun', emojis: ['☀️', '🍉', '🌊'], text: 'summer sunshine & joy ☀️' },
                        { label: '❄️ Winter Warmth', emojis: ['❄️', '🧣', '🕯️'], text: 'winter tea & candles ❄️' },
                        { label: '🎨 Creative Studio', emojis: ['🎨', '🎧', '✨'], text: 'creative flow & art 🎨' },
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setCoverEmojiVibe(preset.emojis);
                            setCoverVibeText(preset.text);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-handwriting font-bold transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 36+ Clickable Aesthetic Emoji Palette */}
                  <div>
                    <span className="text-[0.68rem] font-code font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Tap to Add Aesthetic Emojis:
                    </span>
                    <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-32 overflow-y-auto">
                      {[
                        '🌸', '☕', '✨', '💛', '🍂', '🥐', '🎧', '📖', '🎨', '🌿', '🕯️', '⛺',
                        '🐾', '🥪', '☀️', '🌊', '🍉', '🍎', '✏️', '🧣', '❄️', '🧶', '🍓', '🪴',
                        '🚲', '🌻', '🌙', '🥑', '🥞', '🍵', '🐶', '🐱', '📸', '🏷️', '💌', '🥂'
                      ].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            if (!coverEmojiVibe.includes(em)) {
                              setCoverEmojiVibe((prev) => [...prev, em]);
                            }
                          }}
                          className="h-8 rounded-lg flex items-center justify-center text-lg hover:scale-120 hover:bg-amber-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                          title={`Add ${em}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Handwritten Vibe Tagline */}
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title text-xs">
                      Handwritten Month Tagline / Vibe
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. cozy study days, seaside holiday, creative season ✨"
                      value={coverVibeText}
                      onChange={(e) => setCoverVibeText(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-handwriting text-base"
                    />
                  </div>
                </div>

                {/* 2. Monthly Goals & Checklist Manager */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 font-planner-title text-xs sm:text-sm flex items-center gap-1.5">
                      <ListTodo size={14} className="text-amber-600" />
                      <span>Monthly Goals & Checklist</span>
                      <span className="text-[0.62rem] font-code px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">
                        Optional
                      </span>
                      {coverChecklist.length > 0 && (
                        <span className="text-[0.68rem] font-code text-slate-500 font-normal">
                          ({coverChecklist.filter((c) => c.completed).length}/{coverChecklist.length} completed)
                        </span>
                      )}
                    </label>
                    {coverChecklist.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCoverChecklist([])}
                        className="text-[0.68rem] font-code text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        title="Remove all goals (keep checklist empty)"
                      >
                        <Trash2 size={11} />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  {/* Add Goal Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`+ Add a new goal or to-do for ${MONTH_NAMES_EN[coverModalMonth - 1]} (optional)...`}
                      value={newMonthGoalInput}
                      onChange={(e) => setNewMonthGoalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newMonthGoalInput.trim()) {
                            setCoverChecklist((prev) => [
                              ...prev,
                              { id: `goal-${Date.now()}`, text: newMonthGoalInput.trim(), completed: false },
                            ]);
                            setNewMonthGoalInput('');
                          }
                        }
                      }}
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-handwriting"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMonthGoalInput.trim()) {
                          setCoverChecklist((prev) => [
                            ...prev,
                            { id: `goal-${Date.now()}`, text: newMonthGoalInput.trim(), completed: false },
                          ]);
                          setNewMonthGoalInput('');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Add Goal
                    </button>
                  </div>

                  {/* Checklist Items List */}
                  {coverChecklist.length > 0 ? (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {coverChecklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 gap-2"
                        >
                          <div
                            onClick={() => {
                              setCoverChecklist((prev) =>
                                prev.map((g) => (g.id === item.id ? { ...g, completed: !g.completed } : g))
                              );
                            }}
                            className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                          >
                            {item.completed ? (
                              <CheckSquare size={14} className="text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Square size={14} className="text-amber-600 flex-shrink-0" />
                            )}
                            <span
                              className={`text-xs font-handwriting truncate ${
                                item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-bold'
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCoverChecklist((prev) => prev.filter((g) => g.id !== item.id))}
                            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 px-2 rounded-xl bg-amber-50/40 dark:bg-slate-900 border border-dashed border-amber-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-handwriting">
                        ✨ Checklist is completely optional! Leave it empty if you only want emojis and aesthetic vibe.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Paper Background Theme Palette */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 font-planner-title text-xs sm:text-sm flex items-center justify-between">
                    <span>Stationery Paper Background Theme</span>
                    <span className="text-[0.68rem] font-code font-bold text-amber-600 uppercase">
                      active: {coverCardTheme}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'cream', name: 'Warm Cream', bg: 'bg-[#fdfbf7]', border: 'border-amber-300' },
                      { id: 'pink', name: 'Sakura Pink', bg: 'bg-[#fff1f2]', border: 'border-pink-300' },
                      { id: 'mint', name: 'Sage Mint', bg: 'bg-[#ecfdf5]', border: 'border-emerald-300' },
                      { id: 'lavender', name: 'Lavender', bg: 'bg-[#faf5ff]', border: 'border-purple-300' },
                      { id: 'peach', name: 'Warm Peach', bg: 'bg-[#fff7ed]', border: 'border-orange-300' },
                      { id: 'sky', name: 'Sky Blue', bg: 'bg-[#f0f9ff]', border: 'border-sky-300' },
                      { id: 'amber', name: 'Golden Amber', bg: 'bg-[#fefce8]', border: 'border-amber-400' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setCoverCardTheme(theme.id as any)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          coverCardTheme === theme.id
                            ? 'ring-2 ring-amber-500 border-amber-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md ${theme.bg} ${theme.border} border shadow-2xs`} />
                        <span className="text-[0.68rem] font-planner-title font-bold text-slate-800 dark:text-slate-200">
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Live Scrapbook Card Preview */}
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/50 border border-amber-900/15 dark:border-slate-700 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[0.65rem] font-code font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  ✦ Live Month Card Preview
                </span>
                <p className="text-xs font-handwriting text-slate-700 dark:text-slate-300 text-sm">
                  This is how {MONTH_NAMES_EN[coverModalMonth - 1]} will display in your 12-month overview grid.
                </p>
                {coverModeTab === 'photo' && selectedCoverUrl && (
                  <p className="text-[0.68rem] font-code text-slate-500 dark:text-slate-400 truncate max-w-xs">
                    Image: {selectedCoverUrl}
                  </p>
                )}
                {coverModeTab === 'nopic' && (
                  <p className="text-[0.68rem] font-code text-amber-700 dark:text-amber-400 font-bold">
                    Theme: {coverCardTheme} &middot; {coverEmojiVibe.join(' ')} &middot; {coverChecklist.length} goals
                  </p>
                )}
              </div>

              {/* Dynamic Live Card Preview */}
              {coverModeTab === 'nopic' ? (
                /* Emoji & Checklist Card Preview */
                <div
                  className={`w-32 sm:w-36 p-2 rounded-2xl border-2 shadow-md flex flex-col justify-between pointer-events-none rotate-[1.5deg] flex-shrink-0 ${getCardBgThemeClass(
                    coverCardTheme
                  )}`}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 washi-pattern-gold shadow-2xs rotate-[-3deg] rounded-xs" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-planner-title">
                      {MONTH_NAMES_EN[coverModalMonth - 1].substring(0, 3)}
                    </span>
                    <span className="text-[0.6rem] font-code text-amber-700 font-bold">
                      {coverChecklist.length > 0
                        ? `${coverChecklist.filter((c) => c.completed).length}/${coverChecklist.length}`
                        : 'No goals'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-base my-1">
                    {coverEmojiVibe.slice(0, 3).map((em, idx) => (
                      <span key={idx}>{em}</span>
                    ))}
                  </div>
                  <p className="text-[0.55rem] font-handwriting font-bold truncate text-center mb-1">
                    {coverVibeText || 'Cozy moments'}
                  </p>
                  {coverChecklist.length > 0 && (
                    <div className="w-full h-1 bg-amber-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.round(
                            (coverChecklist.filter((c) => c.completed).length / coverChecklist.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Polaroid Photo Card Preview */
                <div className="w-24 sm:w-28 p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 shadow-md flex flex-col pointer-events-none rotate-[1.5deg] flex-shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-100">
                      {MONTH_NAMES_EN[coverModalMonth - 1].substring(0, 3)}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-amber-900/20">
                    {selectedCoverUrl ? (
                      <Image src={selectedCoverUrl} alt="Cover preview" fill sizes="100px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-sans">
                        No image
                      </div>
                    )}
                    <div className="absolute top-1 left-2 w-6 h-2 bg-amber-200/90 rotate-[-8deg] shadow-xs rounded-xs" />
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[0.65rem] select-none">
                    {coverStickers?.slice(0, 3).map((stk, sIdx) => (
                      <span key={sIdx}>{stk}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMonthCover}
                disabled={isSaving || (coverModeTab === 'photo' && !selectedCoverUrl)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>
                  {isAdmin
                    ? `Save ${MONTH_NAMES_EN[coverModalMonth - 1].substring(0, 3)} ${
                        coverModeTab === 'nopic' ? 'Mood & Goals' : 'Cover'
                      } (MongoDB Atlas)`
                    : 'Log in as Admin to Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FREEFORM CANVAS STICKERS STUDIO MODAL (MATCHING IMAGE 2) */}
      {/* ========================================================= */}
      {isCanvasStudioOpen && (
        <div className="fixed inset-0 z-[4750] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#fdfbf7] dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 border border-amber-900/20 dark:border-slate-800 max-h-[92vh] overflow-y-auto rotate-[-0.3deg]">
            {/* Top Washi Tape Accents */}
            <div className="absolute -top-3 left-10 w-24 h-4 washi-pattern-gold rotate-[-3deg] shadow-xs rounded-xs pointer-events-none opacity-90" />
            <div className="absolute -top-3 right-16 w-20 h-4 washi-pattern-pink rotate-[4deg] shadow-xs rounded-xs pointer-events-none opacity-90" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-planner-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Month Canvas Sticker Studio
                    <span className="text-amber-500 font-normal text-xs font-handwriting">
                      ✦ {MONTH_NAMES_EN[selectedMonth - 1]} collage
                    </span>
                  </h3>
                  <p className="text-xs font-handwriting text-slate-500 dark:text-slate-400">
                    Paste polaroids, scrapbook cutouts, doodle notes & stickers anywhere on your monthly calendar canvas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCanvasStudioOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1 bg-amber-100/60 dark:bg-slate-800/80 rounded-2xl border border-amber-900/10 dark:border-slate-700 text-xs font-bold font-planner-title">
              <button
                type="button"
                onClick={() => setCanvasStudioTab('photo')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  canvasStudioTab === 'photo'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera size={13} />
                <span>Photos ("Related to Pic")</span>
              </button>
              <button
                type="button"
                onClick={() => setCanvasStudioTab('cutouts')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  canvasStudioTab === 'cutouts'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles size={13} />
                <span>Scrapbook Cutouts</span>
              </button>
              <button
                type="button"
                onClick={() => setCanvasStudioTab('notes')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  canvasStudioTab === 'notes'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>✍️ Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setCanvasStudioTab('emojis')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  canvasStudioTab === 'emojis'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>😊 Emojis</span>
              </button>
              <button
                type="button"
                onClick={() => setCanvasStudioTab('upload')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  canvasStudioTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>📤 Custom URL</span>
              </button>
            </div>

            {/* TAB 1: PHOTO STICKER ("Related to Pic") */}
            {canvasStudioTab === 'photo' && (
              <div className="space-y-3">
                <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300">
                  Select a photo memory from {MONTH_NAMES_EN[selectedMonth - 1]} or presets, pick a frame style (washi tape, paperclip, or cutout), and stamp it freely anywhere on the month canvas!
                </p>

                {/* Framing Style Choice */}
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title text-xs">
                    Choose Polaroid Framing Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'polaroid', name: 'Polaroid + Tape', icon: '🖼️' },
                      { id: 'paperclip', name: 'With Paperclip', icon: '📎' },
                      { id: 'tape', name: 'Angled Washi Tape', icon: '📐' },
                      { id: 'cutout', name: 'Clean Cutout', icon: '✂️' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setCanvasFrameStyle(fmt.id as any)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                          canvasFrameStyle === fmt.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-400'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-sm">{fmt.icon}</span>
                        <span className="text-[0.68rem] font-bold text-slate-800 dark:text-slate-200">
                          {fmt.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Caption */}
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title text-xs">
                    Handwritten Caption / Note on Polaroid
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. golden hour ✨, lake days, beautiful sunset"
                    value={canvasDoodleInput}
                    onChange={(e) => setCanvasDoodleInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-handwriting text-sm"
                  />
                </div>

                {/* Select Photo from Month Memories */}
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5 font-planner-title text-xs">
                    Select Photo from {MONTH_NAMES_EN[selectedMonth - 1]} or Presets:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-amber-50/40 dark:bg-slate-800/40 rounded-2xl border border-amber-900/10">
                    {[
                      '/images/vandan_lake.png',
                      '/images/vandan.jpg',
                      '/images/art1.jpg',
                      '/images/art2.jpg',
                      '/images/art3.jpg',
                      '/images/art4.jpg',
                      '/images/art5.jpg',
                      '/images/art6.jpg',
                      '/images/vaan.jpg',
                    ].map((imgUrl, iIdx) => (
                      <div
                        key={iIdx}
                        onClick={() => setCanvasSelectedPhoto(imgUrl)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          (canvasSelectedPhoto || '/images/vandan_lake.png') === imgUrl
                            ? 'border-amber-500 ring-2 ring-amber-400 scale-105 shadow-md'
                            : 'border-slate-200 dark:border-slate-700 hover:scale-102'
                        }`}
                      >
                        <Image src={imgUrl} alt="Choice" fill sizes="70px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stamp Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    const chosen = canvasSelectedPhoto || '/images/vandan_lake.png';
                    handleAddCanvasSticker({
                      type: 'photo',
                      content: chosen,
                      frameStyle: canvasFrameStyle,
                      tapeColor: stickerStudioTapeColor,
                      label: canvasDoodleInput.trim() || undefined,
                      x: 35 + Math.floor(Math.random() * 30),
                      y: 35 + Math.floor(Math.random() * 30),
                      rotation: Math.floor(Math.random() * 16 - 8),
                      scale: 1,
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Sparkles size={16} />
                  <span>+ Stamp Polaroid onto Month Canvas</span>
                </button>
              </div>
            )}

            {/* TAB 2: SCRAPBOOK CUTOUTS (Matching Image 2 "Luglio 2025") */}
            {canvasStudioTab === 'cutouts' && (
              <div className="space-y-3">
                <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300">
                  Authentic vintage scrapbook elements inspired by your journal reference! Tap any cutout to stamp it immediately onto your canvas.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                  {[
                    { id: 'retro-camera', title: 'Vintage 35mm Camera', icon: '📷', sub: 'Retro black film camera' },
                    { id: 'phone-player', title: 'Music Player (Adesso che fai)', icon: '📱', sub: 'Cozy Spotify track card' },
                    { id: 'qr-clip', title: 'QR Clip Badge', icon: '📎', sub: 'Paperclip with scan card' },
                    { id: 'dog-polaroid', title: 'Pup Joy Polaroid', icon: '🐾', sub: 'Mini dog snapshot + clip' },
                    { id: 'sandwich-tape', title: 'Panino Picnic Tape', icon: '🥪', sub: 'Lunch treats with gold tape' },
                    { id: 'sunscreen', title: 'French Soleil SPF 30+', icon: '☀️', sub: 'Summer protection tube' },
                    { id: 'star-doodle', title: 'Gold Doodle Star', icon: '✦', sub: 'Hand-drawn sparkle star' },
                    { id: 'blue-flower', title: 'Pastel Cherry Blossom', icon: '🌸', sub: 'Cozy pressed flower' },
                    { id: 'croissant', title: 'Bakery Croissant', icon: '🥐', sub: 'Fresh butter croissant' },
                  ].map((cutout) => (
                    <button
                      key={cutout.id}
                      type="button"
                      onClick={() => {
                        handleAddCanvasSticker({
                          type: 'scrapbook',
                          content: cutout.id,
                          x: 35 + Math.floor(Math.random() * 30),
                          y: 35 + Math.floor(Math.random() * 30),
                          rotation: Math.floor(Math.random() * 16 - 8),
                          scale: 1,
                        });
                      }}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 transition-all flex flex-col items-center text-center gap-1 shadow-2xs hover:shadow-md hover:scale-102 cursor-pointer group"
                    >
                      <span className="text-3xl group-hover:scale-115 transition-transform">{cutout.icon}</span>
                      <span className="text-xs font-bold font-planner-title text-slate-800 dark:text-slate-100 mt-1">
                        {cutout.title}
                      </span>
                      <span className="text-[0.62rem] font-sans text-slate-400 leading-tight">
                        {cutout.sub}
                      </span>
                      <span className="mt-1 text-[0.6rem] font-code font-bold text-amber-600 dark:text-amber-400">
                        + Stamp Cutout
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: HANDWRITTEN DOODLE NOTES */}
            {canvasStudioTab === 'notes' && (
              <div className="space-y-3">
                <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300">
                  Stamp cute handwritten doodle captions and memories across your month calendar (like "mero & more", "degustazione", or your own words).
                </p>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1 font-planner-title text-xs">
                    Write Custom Handwritten Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mero & more, degustazione 🍷, festa con camping ⛺"
                    value={canvasDoodleInput}
                    onChange={(e) => setCanvasDoodleInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-900/15 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-handwriting text-base"
                  />
                </div>

                {/* Preset Quotes from Reference Screenshot */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 font-planner-title text-xs">
                    Quick Italian & Scrapbook Script Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'mero & more',
                      'degustazione + enoteca 🍷',
                      'festa con camping ⛺',
                      'tante tantissime ortiche 🌿',
                      'colazione da tris ☕🥐',
                      'weekend getaway 🚂',
                      'cozy rainy afternoon 🌧️',
                      'summer sunset ✨',
                    ].map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => {
                          setCanvasDoodleInput(phrase);
                          handleAddCanvasSticker({
                            type: 'text',
                            content: phrase,
                            x: 35 + Math.floor(Math.random() * 30),
                            y: 35 + Math.floor(Math.random() * 30),
                            rotation: Math.floor(Math.random() * 12 - 6),
                            scale: 1,
                          });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-handwriting text-xs font-bold transition-colors cursor-pointer"
                      >
                        + {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (canvasDoodleInput.trim()) {
                      handleAddCanvasSticker({
                        type: 'text',
                        content: canvasDoodleInput.trim(),
                        x: 35 + Math.floor(Math.random() * 30),
                        y: 35 + Math.floor(Math.random() * 30),
                        rotation: Math.floor(Math.random() * 12 - 6),
                        scale: 1,
                      });
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>+ Stamp Note on Canvas</span>
                </button>
              </div>
            )}

            {/* TAB 4: AESTHETIC EMOJIS PALETTE */}
            {canvasStudioTab === 'emojis' && (
              <div className="space-y-3">
                <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300">
                  Tap any cozy stationery emoji to stamp it onto the month canvas!
                </p>

                <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-900/15 dark:border-slate-700 max-h-64 overflow-y-auto">
                  {[
                    '🌸', '☕', '✨', '💛', '🥐', '🎧', '📖', '🎨', '🌿', '🕯️', '⛺', '🐾',
                    '🥪', '☀️', '🌊', '🍉', '🍎', '✏️', '🧣', '❄️', '🧶', '🍓', '🪴', '🚲',
                    '🌻', '🌙', '🥑', '🥞', '🍵', '🐶', '🐱', '📸', '🏷️', '💌', '🥂', '🍦',
                    '🏖️', '🧳', '🏕️', '🍕', '🍰', '🍩', '🍒', '🍇', '🍋', '🥨', '🥞', '🥯'
                  ].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        handleAddCanvasSticker({
                          type: 'emoji',
                          content: em,
                          x: 30 + Math.floor(Math.random() * 40),
                          y: 30 + Math.floor(Math.random() * 40),
                          rotation: Math.floor(Math.random() * 16 - 8),
                          scale: 1,
                        });
                      }}
                      className="h-10 rounded-xl flex items-center justify-center text-2xl hover:scale-125 hover:bg-amber-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                      title={`Stamp ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOM IMAGE / URL */}
            {canvasStudioTab === 'upload' && (
              <div className="space-y-3">
                <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300">
                  Paste any custom image URL to stamp as a freeform canvas sticker.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. /images/art3.jpg or Web URL)"
                    value={canvasCustomImageUrl}
                    onChange={(e) => setCanvasCustomImageUrl(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-code text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (canvasCustomImageUrl.trim()) {
                        handleAddCanvasSticker({
                          type: 'photo',
                          content: canvasCustomImageUrl.trim(),
                          frameStyle: canvasFrameStyle,
                          tapeColor: stickerStudioTapeColor,
                          x: 50,
                          y: 50,
                        });
                        setCanvasCustomImageUrl('');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    + Stamp Custom
                  </button>
                </div>
              </div>
            )}

            {/* Footer Helper & Done */}
            <div className="pt-2 border-t border-amber-900/15 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[0.68rem] font-handwriting text-amber-800 dark:text-amber-400">
                💡 Tip: Turn on <strong>Move: ON</strong> in the sheet header to drag, rotate (⟲ ⟳), and scale (− +) stickers!
              </span>
              <button
                type="button"
                onClick={() => setIsCanvasStudioOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer shadow-xs transition-colors"
              >
                Done Styling Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
