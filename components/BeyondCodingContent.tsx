'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BeyondCodingData, QuoteItem, BookItem } from '@/types/portfolio';
import { useAdmin, getSafeImageUrl, ImageDropzone } from './AdminContext';
import {
  BookOpen,
  Quote,
  Star,
  Sparkles,
  Search,
  Filter,
  Bookmark,
  Check,
  Copy,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Loader2,
  Compass,
  Shuffle,
  Flame,
  Brain,
  Zap,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Library,
  ArrowUpRight,
  Layers,
  Code2,
  CheckCircle2,
  FileImage,
  Maximize2,
} from 'lucide-react';

interface BeyondCodingContentProps {
  initialData?: BeyondCodingData;
}

const colorThemeClasses: Record<string, { bg: string; border: string; text: string; badgeBg: string; quoteIcon: string }> = {
  purple: {
    bg: 'from-purple-500/10 via-slate-900/90 to-indigo-950/40 dark:from-purple-950/50 dark:via-slate-900/95 dark:to-indigo-950/40',
    border: 'border-purple-300/40 dark:border-purple-800/40 hover:border-purple-500/80',
    text: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-100/90 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-300/50 dark:border-purple-700/50',
    quoteIcon: 'text-purple-400/20 dark:text-purple-500/20',
  },
  amber: {
    bg: 'from-amber-500/10 via-slate-900/90 to-orange-950/40 dark:from-amber-950/50 dark:via-slate-900/95 dark:to-orange-950/40',
    border: 'border-amber-300/40 dark:border-amber-800/40 hover:border-amber-500/80',
    text: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100/90 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50',
    quoteIcon: 'text-amber-400/20 dark:text-amber-500/20',
  },
  indigo: {
    bg: 'from-indigo-500/10 via-slate-900/90 to-blue-950/40 dark:from-indigo-950/50 dark:via-slate-900/95 dark:to-blue-950/40',
    border: 'border-indigo-300/40 dark:border-indigo-800/40 hover:border-indigo-500/80',
    text: 'text-indigo-700 dark:text-indigo-300',
    badgeBg: 'bg-indigo-100/90 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300/50 dark:border-indigo-700/50',
    quoteIcon: 'text-indigo-400/20 dark:text-indigo-500/20',
  },
  emerald: {
    bg: 'from-emerald-500/10 via-slate-900/90 to-teal-950/40 dark:from-emerald-950/50 dark:via-slate-900/95 dark:to-teal-950/40',
    border: 'border-emerald-300/40 dark:border-emerald-800/40 hover:border-emerald-500/80',
    text: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50',
    quoteIcon: 'text-emerald-400/20 dark:text-emerald-500/20',
  },
  rose: {
    bg: 'from-rose-500/10 via-slate-900/90 to-pink-950/40 dark:from-rose-950/50 dark:via-slate-900/95 dark:to-pink-950/40',
    border: 'border-rose-300/40 dark:border-rose-800/40 hover:border-rose-500/80',
    text: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100/90 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-300/50 dark:border-rose-700/50',
    quoteIcon: 'text-rose-400/20 dark:text-rose-500/20',
  },
  sky: {
    bg: 'from-sky-500/10 via-slate-900/90 to-cyan-950/40 dark:from-sky-950/50 dark:via-slate-900/95 dark:to-cyan-950/40',
    border: 'border-sky-300/40 dark:border-sky-800/40 hover:border-sky-500/80',
    text: 'text-sky-700 dark:text-sky-300',
    badgeBg: 'bg-sky-100/90 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-300/50 dark:border-sky-700/50',
    quoteIcon: 'text-sky-400/20 dark:text-sky-500/20',
  },
};

export default function BeyondCodingContent({ initialData }: BeyondCodingContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<BeyondCodingData>(
    initialData || {
      quotes: [],
      books: [],
      personalStats: {
        booksReadThisYear: 3,
        yearlyGoal: 6,
        favoriteCategory: 'AI Engineering & Deep Learning',
        mindsetQuote: 'Compose models, data pipelines, and feedback loops into reliable systems.',
      },
    }
  );

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'quotes' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Extract all images for the slideshow
  const slides = useMemo(() => {
    const list: Array<{ src: string; title: string; subtitle: string }> = [];

    // From Books
    data.books.forEach((b) => {
      if (b.notesImage) {
        list.push({
          src: b.notesImage,
          title: `${b.title} — Book Notes`,
          subtitle: `by ${b.author} | ${b.genre}`,
        });
      }
      if (b.coverImage && !b.notesImage) {
        list.push({
          src: b.coverImage,
          title: b.title,
          subtitle: `by ${b.author} | ${b.genre}`,
        });
      }
    });

    // From Quotes / Pins
    data.quotes.forEach((q) => {
      const pic = q.noteImage || q.bgImage;
      if (pic) {
        list.push({
          src: pic,
          title: q.source || `${q.author}'s Notes`,
          subtitle: q.quote,
        });
      }
    });

    return list;
  }, [data]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-slideshow timer (4 seconds delay)
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds delay
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Modals
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);
  const [selectedNoteModalImage, setSelectedNoteModalImage] = useState<{ src: string; title: string; subtitle?: string } | null>(null);

  // Modals for Admin
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingQuoteIndex, setEditingQuoteIndex] = useState<number | null>(null);
  const [editingBookIndex, setEditingBookIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Quote Form state
  const [quoteForm, setQuoteForm] = useState<QuoteItem>({
    id: '',
    quote: '',
    author: '',
    source: '',
    category: 'AI Engineering',
    colorTheme: 'purple',
    noteImage: '',
    bgImage: '',
    pinned: false,
    tags: [],
  });
  const [quoteTagsInput, setQuoteTagsInput] = useState('');

  // Book Form state
  const [bookForm, setBookForm] = useState<BookItem>({
    id: '',
    title: '',
    author: '',
    coverImage: '',
    notesImage: '',
    status: 'Completed',
    rating: 5,
    keyTakeaway: '',
    favoriteQuote: '',
    genre: 'AI Engineering',
    yearRead: '2025',
  });

  useEffect(() => {
    fetchData();
    try {
      const savedPins = localStorage.getItem('vandan_pinned_items');
      if (savedPins) {
        setPinnedIds(JSON.parse(savedPins));
      }
    } catch (e) {}
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/beyond-coding');
      if (res.ok) {
        const liveData = await res.json();
        if (liveData && (liveData.quotes || liveData.books)) {
          setData(liveData);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live beyond-coding data:', err);
    }
  };

  const saveToStore = async (updatedData: BeyondCodingData) => {
    try {
      const res = await fetch('/api/beyond-coding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      const resData = await res.json();
      return res.ok && resData.success;
    } catch (err) {
      alert('Failed to save changes.');
      return false;
    }
  };

  const handleCopyQuote = (quote: QuoteItem) => {
    const textToCopy = `"${quote.quote}" — ${quote.author}${quote.source ? ` (${quote.source})` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(quote.id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const togglePin = (id: string) => {
    let updated: string[];
    if (pinnedIds.includes(id)) {
      updated = pinnedIds.filter((item) => item !== id);
    } else {
      updated = [...pinnedIds, id];
    }
    setPinnedIds(updated);
    try {
      localStorage.setItem('vandan_pinned_items', JSON.stringify(updated));
    } catch (e) {}
  };

  // --- Quote Handlers ---
  const handleOpenAddQuote = () => {
    setEditingQuoteIndex(null);
    setQuoteForm({
      id: `q_${Date.now()}`,
      quote: '',
      author: '',
      source: '',
      category: 'AI Engineering',
      colorTheme: 'purple',
      noteImage: '',
      bgImage: '',
      pinned: false,
      tags: [],
    });
    setQuoteTagsInput('');
    setIsQuoteModalOpen(true);
  };

  const handleOpenEditQuote = (index: number) => {
    setEditingQuoteIndex(index);
    const item = data.quotes[index];
    setQuoteForm({ ...item });
    setQuoteTagsInput(item.tags ? item.tags.join(', ') : '');
    setIsQuoteModalOpen(true);
  };

  const handleDeleteQuote = async (index: number) => {
    if (!confirm(`Delete quote "${data.quotes[index].quote.substring(0, 30)}..."?`)) return;
    const updatedQuotes = data.quotes.filter((_, i) => i !== index);
    const updatedData = { ...data, quotes: updatedQuotes };
    setData(updatedData);
    await saveToStore(updatedData);
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const processedTags = quoteTagsInput
      ? quoteTagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const finalQuoteItem = { ...quoteForm, tags: processedTags };
    let updatedQuotes = [...data.quotes];
    if (editingQuoteIndex !== null) {
      updatedQuotes[editingQuoteIndex] = finalQuoteItem;
    } else {
      updatedQuotes = [finalQuoteItem, ...updatedQuotes];
    }

    const updatedData = { ...data, quotes: updatedQuotes };
    setData(updatedData);
    const success = await saveToStore(updatedData);
    setIsSaving(false);
    if (success) setIsQuoteModalOpen(false);
  };

  // --- Book Handlers ---
  const handleOpenAddBook = () => {
    setEditingBookIndex(null);
    setBookForm({
      id: `b_${Date.now()}`,
      title: '',
      author: '',
      coverImage: '',
      notesImage: '',
      status: 'Completed',
      rating: 5,
      keyTakeaway: '',
      favoriteQuote: '',
      genre: 'AI Engineering',
      yearRead: '2025',
    });
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (index: number) => {
    setEditingBookIndex(index);
    setBookForm({ ...data.books[index] });
    setIsBookModalOpen(true);
  };

  const handleDeleteBook = async (index: number) => {
    if (!confirm(`Delete book "${data.books[index].title}"?`)) return;
    const updatedBooks = data.books.filter((_, i) => i !== index);
    const updatedData = { ...data, books: updatedBooks };
    setData(updatedData);
    await saveToStore(updatedData);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updatedBooks = [...data.books];
    if (editingBookIndex !== null) {
      updatedBooks[editingBookIndex] = bookForm;
    } else {
      updatedBooks = [bookForm, ...updatedBooks];
    }

    const updatedData = { ...data, books: updatedBooks };
    setData(updatedData);
    const success = await saveToStore(updatedData);
    setIsSaving(false);
    if (success) setIsBookModalOpen(false);
  };

  // Categories extraction
  const allCategories = ['All', 'AI Engineering', 'Deep Learning', 'Machine Learning', 'Philosophy', 'Tech & Life', 'Growth', 'Creativity'];

  // Filtering
  const filteredQuotes = data.quotes.filter((q) => {
    if (activeTab === 'books') return false;
    if (activeTab === 'favorites' && !pinnedIds.includes(q.id) && !q.pinned) return false;
    if (selectedCategory !== 'All' && q.category !== selectedCategory && !q.tags?.includes(selectedCategory)) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchQuote = q.quote.toLowerCase().includes(query);
      const matchAuthor = q.author.toLowerCase().includes(query);
      const matchSource = q.source?.toLowerCase().includes(query);
      const matchTag = q.tags?.some((t) => t.toLowerCase().includes(query));
      return matchQuote || matchAuthor || matchSource || matchTag;
    }
    return true;
  });

  const filteredBooks = data.books.filter((b) => {
    if (activeTab === 'quotes') return false;
    if (activeTab === 'favorites' && !pinnedIds.includes(b.id) && b.status !== 'Favorite') return false;
    if (selectedCategory !== 'All' && b.genre !== selectedCategory && !b.genre.includes(selectedCategory)) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(query);
      const matchAuthor = b.author.toLowerCase().includes(query);
      const matchTakeaway = b.keyTakeaway.toLowerCase().includes(query);
      const matchGenre = b.genre.toLowerCase().includes(query);
      return matchTitle || matchAuthor || matchTakeaway || matchGenre;
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12 pt-24 md:pt-28">
      {/* Copy Toast */}
      {copiedQuoteId && (
        <div className="fixed bottom-6 right-6 z-[2000] bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold animate-bounce border border-indigo-500/40">
          <Check size={16} className="text-emerald-400 dark:text-emerald-600" />
          <span>Quote text copied to clipboard!</span>
        </div>
      )}

      {/* 1. HERO MAGAZINE HEADER */}
      <section className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950/90 text-white shadow-2xl border border-indigo-500/30 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span>BEYOND CODE &bull; INTELLECTUAL SANCTUARY</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Beyond Coding <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">✨</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
              A curated space dedicated strictly to foundational books I read and timeless philosophy, AI engineering principles, and visual book notes that shape my technical vision.
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                <Brain size={16} className="text-indigo-400" />
                <span>3 Essential AI/ML Books Read</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                <FileImage size={16} className="text-emerald-400" />
                <span>Visual Book Notes &amp; Diagrams</span>
              </div>
            </div>
          </div>

          {/* Pure Visual Auto Slideshow Box (4 Seconds Delay) */}
          <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex flex-col justify-between relative group hover:border-indigo-400/50 transition-all duration-300">
            {/* Header Badge & Controls */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 flex items-center gap-1.5">
                <FileImage size={13} className="text-indigo-400 animate-pulse" />
                <span>NOTE PICS SLIDESHOW</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 text-[0.68rem] font-mono font-semibold rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? '4s Loop' : 'Paused'}</span>
                </button>

                {slides.length > 0 && (
                  <>
                    <button
                      onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
                      title="Previous Note Pic"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <button
                      onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
                      title="Next Note Pic"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Slideshow Display Area */}
            {slides.length > 0 ? (
              <div
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
                onClick={() =>
                  setSelectedNoteModalImage({
                    src: slides[currentSlideIndex].src,
                    title: slides[currentSlideIndex].title,
                    subtitle: slides[currentSlideIndex].subtitle,
                  })
                }
                className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20 cursor-pointer group/slide"
              >
                <img
                  key={slides[currentSlideIndex].src}
                  src={getSafeImageUrl(slides[currentSlideIndex].src)}
                  alt={slides[currentSlideIndex].title}
                  className="w-full h-full object-cover group-hover/slide:scale-105 transition-all duration-700 ease-out"
                />

                {/* Ambient Bottom Gradient & Title Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <span className="text-[0.65rem] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                      {currentSlideIndex + 1} / {slides.length}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white leading-snug drop-shadow-md">
                      {slides[currentSlideIndex].title}
                    </h4>
                    <p className="text-[0.72rem] text-indigo-200 line-clamp-1 mt-0.5 opacity-90">
                      {slides[currentSlideIndex].subtitle}
                    </p>
                    <div className="flex items-center gap-1 text-[0.65rem] font-mono text-indigo-300 mt-1 font-semibold">
                      <Maximize2 size={11} /> Click to enlarge 🔍
                    </div>
                  </div>
                </div>

                {/* Progress Bar (4 seconds animation) */}
                {isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      key={currentSlideIndex}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[progress_4s_linear]"
                      style={{ animationDuration: '4000ms' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <FileImage size={32} className="mb-2 text-indigo-400" />
                <p className="text-xs font-semibold">No Note Pics Available</p>
              </div>
            )}

            {/* Slide Dots Indicator */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentSlideIndex
                        ? 'w-6 bg-indigo-400'
                        : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Buttons */}
        {isAdmin && (
          <div className="relative z-10 flex flex-wrap gap-2.5 pt-6 mt-6 border-t border-white/10">
            <button
              onClick={handleOpenAddQuote}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Plus size={14} /> Add Quote / Note Pic Pin
            </button>
            <button
              onClick={handleOpenAddBook}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <BookOpen size={14} /> Add Book &amp; Note Pic
            </button>
          </div>
        )}
      </section>

      {/* 2. NAVIGATION CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Main View Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass size={14} /> All Board Pins &amp; Note Pics
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'books'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen size={14} /> Bookshelf &amp; Notes 📚 ({data.books.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'quotes'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileImage size={14} /> Note Pics &amp; Quotes 🖼️ ({data.quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark size={14} /> Saved ⭐
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search books, notes, quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter size={13} /> Filter:
          </span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED BOOKSHELF & NOTES PICS */}
      {(activeTab === 'all' || activeTab === 'books') && filteredBooks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
                <span>My Read Books &amp; Book Notes Pics</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Hands-on Machine Learning, Deep Learning, and AI Engineering note pictures.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              {filteredBooks.length} BOOKS READ
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, idx) => {
              const originalIndex = data.books.findIndex((b) => b.id === book.id);
              const isBookPinned = pinnedIds.includes(book.id);

              return (
                <div
                  key={book.id || idx}
                  className="cyber-glass-card group p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 border-indigo-200/60 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/50 to-indigo-50/30 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 relative rounded-3xl overflow-hidden"
                >
                  {/* Top Status & Pin */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span
                        className={`text-[0.7rem] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          book.status === 'Currently Reading'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                        }`}
                      >
                        {book.status === 'Currently Reading' ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ) : (
                          <CheckCircle2 size={12} className="text-indigo-500" />
                        )}
                        {book.status}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePin(book.id)}
                          className={`p-2 rounded-full transition-all ${
                            isBookPinned
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title="Bookmark book"
                        >
                          <Bookmark size={16} className={isBookPinned ? 'fill-amber-500' : ''} />
                        </button>

                        {isAdmin && originalIndex !== -1 && (
                          <>
                            <button
                              onClick={() => handleOpenEditBook(originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Book Cover Visual & Title */}
                    <div className="space-y-3 mb-4">
                      {book.coverImage && (
                        <div className="w-full h-48 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700/80 group-hover:scale-[1.02] transition-transform duration-300">
                          <img
                            src={getSafeImageUrl(book.coverImage)}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span className="text-[0.65rem] font-mono uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md">
                              {book.genre}
                            </span>
                            {book.notesImage && (
                              <button
                                onClick={() =>
                                  setSelectedNoteModalImage({
                                    src: book.notesImage || '',
                                    title: `${book.title} — Reading Notes Pic`,
                                    subtitle: book.keyTakeaway,
                                  })
                                }
                                className="text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-500"
                              >
                                <FileImage size={10} /> View Note Pic 🖼️
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        by <span className="text-slate-800 dark:text-slate-200">{book.author}</span>
                      </p>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={
                              s <= book.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Key Architectural Takeaway */}
                    <div className="bg-slate-100/90 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1.5 mb-4">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[0.65rem] block">
                        KEY TAKEAWAY NOTE:
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        "{book.keyTakeaway}"
                      </p>
                    </div>
                  </div>

                  {/* Open Detail Drawer Button */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedBookModal(book)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Read Full Notes &amp; Quotes</span>
                      <ArrowUpRight size={14} />
                    </button>
                    <span className="text-[0.7rem] font-mono text-slate-400">READ {book.yearRead}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. VISUAL NOTE PICS & QUOTE PINS MOODBOARD */}
      {(activeTab === 'all' || activeTab === 'quotes') && filteredQuotes.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <FileImage className="text-purple-600 dark:text-purple-400" size={24} />
                <span>Book Notes Pictures &amp; Key Quotes Pins</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Visual notes, handwritten diagrams, and highlighted quotes from books.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              {filteredQuotes.length} PINS
            </span>
          </div>

          {/* Staggered Editorial Pinterest Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredQuotes.map((q, idx) => {
              const originalIndex = data.quotes.findIndex((item) => item.id === q.id);
              const theme = colorThemeClasses[q.colorTheme || 'purple'] || colorThemeClasses.purple;
              const isQuotePinned = pinnedIds.includes(q.id) || q.pinned;
              const notePic = q.noteImage || q.bgImage;

              return (
                <div
                  key={q.id || idx}
                  className={`break-inside-avoid rounded-3xl p-6 bg-gradient-to-br ${theme.bg} border ${theme.border} transition-all duration-300 shadow-md hover:shadow-2xl relative overflow-hidden group flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Tag & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[0.68rem] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${theme.badgeBg}`}>
                        {q.category}
                      </span>

                      <div className="flex items-center gap-1.5 z-10">
                        <button
                          onClick={() => handleCopyQuote(q)}
                          className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                          title="Copy quote"
                        >
                          <Copy size={13} />
                        </button>

                        <button
                          onClick={() => togglePin(q.id)}
                          className={`p-2 rounded-full transition-all shadow-sm ${
                            isQuotePinned
                              ? 'bg-amber-500 text-white'
                              : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title={isQuotePinned ? 'Unpin' : 'Pin to favorites'}
                        >
                          <Bookmark size={13} className={isQuotePinned ? 'fill-white' : ''} />
                        </button>

                        {isAdmin && originalIndex !== -1 && (
                          <>
                            <button
                              onClick={() => handleOpenEditQuote(originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Book Note Picture preview */}
                    {notePic && (
                      <div
                        onClick={() =>
                          setSelectedNoteModalImage({
                            src: notePic,
                            title: q.source || q.author,
                            subtitle: q.quote,
                          })
                        }
                        className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md border border-white/20 cursor-pointer group/note mb-4"
                      >
                        <img
                          src={getSafeImageUrl(notePic)}
                          alt={q.source || 'Book note'}
                          className="w-full h-full object-cover group-hover/note:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[0.65rem] font-mono text-white font-semibold flex items-center gap-1">
                            <Maximize2 size={11} /> View Note Pic 🖼️
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quote text */}
                    <blockquote className="text-base font-serif italic text-slate-900 dark:text-slate-100 leading-relaxed mb-4">
                      "{q.quote}"
                    </blockquote>

                    {/* Author & Source */}
                    <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          — {q.author}
                        </div>
                        {q.source && (
                          <div className="text-[0.72rem] text-slate-500 dark:text-slate-400 italic">
                            {q.source}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-2">
                      {q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.65rem] font-mono text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FULL NOTE PIC LIGHTBOX MODAL */}
      {selectedNoteModalImage && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-indigo-500/40 shadow-2xl p-4 flex flex-col items-center">
            <button
              onClick={() => setSelectedNoteModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl mb-4 bg-black">
              <img
                src={getSafeImageUrl(selectedNoteModalImage.src)}
                alt={selectedNoteModalImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="w-full text-center text-white px-4 pb-2">
              <h4 className="text-lg font-extrabold text-indigo-300">{selectedNoteModalImage.title}</h4>
              {selectedNoteModalImage.subtitle && (
                <p className="text-xs text-slate-300 italic mt-1 max-w-xl mx-auto">"{selectedNoteModalImage.subtitle}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOOK DETAIL MODAL DRAWER */}
      {selectedBookModal && (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="cyber-glass-card w-full max-w-2xl p-8 bg-white dark:bg-slate-900 border-indigo-500/40 shadow-2xl relative rounded-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBookModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex gap-5 items-start mb-6">
              {selectedBookModal.coverImage && (
                <img
                  src={getSafeImageUrl(selectedBookModal.coverImage)}
                  alt={selectedBookModal.title}
                  className="w-24 h-36 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
                />
              )}
              <div>
                <span className="text-[0.7rem] font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {selectedBookModal.genre}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                  {selectedBookModal.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  by {selectedBookModal.author}
                </p>
              </div>
            </div>

            {/* Note Picture if present */}
            {selectedBookModal.notesImage && (
              <div
                onClick={() =>
                  setSelectedNoteModalImage({
                    src: selectedBookModal.notesImage || '',
                    title: `${selectedBookModal.title} — Book Notes Picture`,
                    subtitle: selectedBookModal.keyTakeaway,
                  })
                }
                className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg border border-indigo-300/40 cursor-pointer mb-6 group/modalpic"
              >
                <img
                  src={getSafeImageUrl(selectedBookModal.notesImage)}
                  alt="Book Note Pic"
                  className="w-full h-full object-cover group-hover/modalpic:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-mono text-white font-bold flex items-center gap-1.5">
                    <Maximize2 size={14} /> Click to View Full Note Picture 🔍
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase text-[0.68rem] block">
                  KEY TAKEAWAY NOTE:
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm">
                  "{selectedBookModal.keyTakeaway}"
                </p>
              </div>

              {selectedBookModal.favoriteQuote && (
                <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 space-y-1">
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300 uppercase text-[0.68rem] block">
                    FAVORITE BOOK QUOTE:
                  </span>
                  <blockquote className="text-slate-800 dark:text-slate-100 italic text-sm">
                    "{selectedBookModal.favoriteQuote}"
                  </blockquote>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT QUOTE MODAL --- */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="cyber-glass-card w-full max-w-lg p-6 bg-white dark:bg-slate-900 border-indigo-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileImage size={18} className="text-purple-600" />
                <span>{editingQuoteIndex !== null ? 'Edit Note / Quote Pin' : 'Add Note / Quote Pin'}</span>
              </h3>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quote / Note Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quoteForm.quote}
                  onChange={(e) => setQuoteForm({ ...quoteForm, quote: e.target.value })}
                  placeholder="e.g. AI engineering is about composing models..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Author / Source *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.author}
                    onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })}
                    placeholder="e.g. Chip Huyen"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Book / Chapter Note Title
                  </label>
                  <input
                    type="text"
                    value={quoteForm.source || ''}
                    onChange={(e) => setQuoteForm({ ...quoteForm, source: e.target.value })}
                    placeholder="e.g. AI Engineering Notes"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={quoteForm.category}
                    onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Tech &amp; Life">Tech &amp; Life</option>
                    <option value="Growth">Growth</option>
                    <option value="Creativity">Creativity</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Theme
                  </label>
                  <select
                    value={quoteForm.colorTheme || 'purple'}
                    onChange={(e) => setQuoteForm({ ...quoteForm, colorTheme: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="purple">Purple</option>
                    <option value="amber">Amber</option>
                    <option value="indigo">Indigo</option>
                    <option value="emerald">Emerald</option>
                    <option value="rose">Rose</option>
                    <option value="sky">Sky</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageDropzone
                  label="Book Notes Picture (Upload Handwritten or Digital Note Pic)"
                  value={quoteForm.noteImage || ''}
                  onChange={(url) => setQuoteForm({ ...quoteForm, noteImage: url })}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={quoteTagsInput}
                  onChange={(e) => setQuoteTagsInput(e.target.value)}
                  placeholder="AI Engineering, LLMs, Systems"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="cyber-btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cyber-btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Note Pin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BOOK MODAL --- */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="cyber-glass-card w-full max-w-lg p-6 bg-white dark:bg-slate-900 border-indigo-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <span>{editingBookIndex !== null ? 'Edit Book & Notes' : 'Add New Book & Notes'}</span>
              </h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="e.g. AI Engineering"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Chip Huyen"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={bookForm.status}
                    onChange={(e) => setBookForm({ ...bookForm, status: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Favorite">Favorite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={bookForm.rating}
                    onChange={(e) => setBookForm({ ...bookForm, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year Read
                  </label>
                  <input
                    type="text"
                    value={bookForm.yearRead || '2025'}
                    onChange={(e) => setBookForm({ ...bookForm, yearRead: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Genre / Category
                </label>
                <input
                  type="text"
                  value={bookForm.genre}
                  onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
                  placeholder="AI Engineering / Deep Learning"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <ImageDropzone
                  label="Book Cover Image (Upload or Drop File)"
                  value={bookForm.coverImage || ''}
                  onChange={(url) => setBookForm({ ...bookForm, coverImage: url })}
                />
              </div>

              <div>
                <ImageDropzone
                  label="Book Notes Picture (Upload Handwritten/Digital Notes Pic)"
                  value={bookForm.notesImage || ''}
                  onChange={(url) => setBookForm({ ...bookForm, notesImage: url })}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Takeaway Note *
                </label>
                <textarea
                  required
                  rows={3}
                  value={bookForm.keyTakeaway}
                  onChange={(e) => setBookForm({ ...bookForm, keyTakeaway: e.target.value })}
                  placeholder="Key lessons..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="cyber-btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cyber-btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Book &amp; Notes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
