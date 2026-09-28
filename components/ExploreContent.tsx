'use client';

import React, { useState, useEffect, useRef } from 'react';
import { explorations, ExplorationItem } from '@/data/explorations';
import ProjectFlowchart from '@/components/ProjectFlowcharts';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Palette,
  Layers,
  Activity,
  PlusCircle,
  Zap,
  ScanFace,
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Code2,
  BarChart2,
  Info,
  GitFork,
  Lock,
  Unlock,
} from 'lucide-react';
import AdminLoginModal from '@/components/AdminLoginModal';

import { useAdmin } from '@/components/AdminContext';

export default function ExploreContent() {
  const featuredProject = explorations.find((item) => item.featured) || explorations[0];
  const secondaryProjects = explorations.filter((item) => item.id !== featuredProject.id);

  // In-depth details modal state
  const [selectedProject, setSelectedProject] = useState<ExplorationItem | null>(null);

  // Unified Admin Context
  const { isAdmin, openAdminModal, logoutAdmin } = useAdmin();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-16 pt-28 md:pt-32">
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-3 relative">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-[0.7rem] font-bold tracking-widest uppercase font-code">
            <Sparkles size={12} className="animate-pulse text-indigo-500" />
            <span>EXPLORE</span>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold font-code uppercase tracking-wider border transition-all cursor-pointer bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-200"
            >
              <Unlock size={12} /> Admin Mode (Click to Exit)
            </button>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Explore What I Build
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A collection of experiments, products, websites, creative projects, and ideas I'm bringing to life.
        </p>
      </div>

      {/* 2. FEATURED PROJECT (AI CIVILIZATION SIMULATOR) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs font-code font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Zap size={14} /> FEATURED EXPERIMENT
          </span>
          <span className="hidden sm:inline">STANDALONE AI SIMULATION</span>
        </div>

        <ProjectCard
          project={featuredProject}
          isFeatured={true}
          onOpenDetails={(p) => setSelectedProject(p)}
        />
      </section>

      {/* 3. PRODUCTS & CREATIONS GRID (TOTAL 4 WEBSITES) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs font-code font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Layers size={14} className="text-indigo-600 dark:text-indigo-400" /> PRODUCTS &amp; CREATIONS
          </span>
          <span>{explorations.length} WEBSITES &amp; SHOWCASE PROJECTS</span>
        </div>

        {/* 3-Column Grid for Secondary Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryProjects.map((item) => (
            <ProjectCard
              key={item.id}
              project={item}
              isFeatured={false}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. MORE COMING SOON FOOTER CARD */}
      <section className="pt-4">
        <div className="cyber-glass-card p-8 text-center bg-gradient-to-r from-indigo-50/50 via-slate-50 to-purple-50/50 dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-900/80 border-dashed border-slate-300/80 dark:border-slate-800">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <PlusCircle size={20} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-code mb-1">
            MORE COMING SOON
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">
            More experiments, products and ideas will appear here. Stay tuned for new builds!
          </p>
        </div>
      </section>

      {/* 5. IN-DEPTH PROJECT DETAILS MODAL */}
      {selectedProject && (
        <InDepthDetailsModal
          project={selectedProject}
          isAdmin={isAdmin}
          onRequireAdminLogin={openAdminModal}
          onLogout={logoutAdmin}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

{/* PROJECT CARD COMPONENT WITH 3D TILT & PARALLAX */}
function ProjectCard({
  project,
  isFeatured,
  onOpenDetails,
}: {
  project: ExplorationItem;
  isFeatured: boolean;
  onOpenDetails: (project: ExplorationItem) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOrReducedMotion, setIsMobileOrReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouchDevice) {
      setIsMobileOrReducedMotion(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileOrReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 8;
    const rotateY = (x - 0.5) * 8;

    const px = x - 0.5;
    const py = y - 0.5;

    setTilt({ rotateX, rotateY, scale: 1.015 });
    setParallax({ x: px, y: py });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isMobileOrReducedMotion) {
      setTilt((prev) => ({ ...prev, scale: 1.015 }));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    setParallax({ x: 0, y: 0 });
  };

  const cardBaseClasses = isFeatured
    ? 'group block cyber-glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 dark:from-[#0d1326] dark:via-[#111827] dark:to-[#17132e] border-indigo-200/80 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-600 transition-shadow duration-300 shadow-md hover:shadow-xl cursor-pointer'
    : `group flex flex-col justify-between cyber-glass-card p-5 relative overflow-hidden transition-shadow duration-300 shadow-md hover:shadow-xl cursor-pointer ${
        project.previewType === 'meivan'
          ? 'bg-gradient-to-br from-sky-50/80 via-white to-slate-50/70 dark:from-[#0b1626] dark:via-[#111827] dark:to-[#0f1f33] border-sky-200/70 dark:border-sky-900/40 hover:border-sky-400 dark:hover:border-sky-600'
          : project.previewType === 'meivan-art'
          ? 'bg-gradient-to-br from-purple-50/80 via-white to-rose-50/70 dark:from-[#1b0b26] dark:via-[#111827] dark:to-[#240e28] border-purple-200/70 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-600'
          : 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/70 dark:from-[#24130b] dark:via-[#111827] dark:to-[#26160d] border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600'
      }`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDetails(project)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: isMobileOrReducedMotion
          ? 'none'
          : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
        transition: isHovered
          ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
          : 'transform 0.5s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      className={cardBaseClasses}
    >
      {isFeatured ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`${project.badgeStyle} font-semibold`}>
                  <Bot size={13} /> {project.category}
                </span>
                <span className="text-[0.7rem] font-code text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full font-medium">
                  Featured
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Specs & Link Buttons */}
            <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(project);
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-code"
              >
                <Info size={14} /> In-Depth Architecture &amp; Flowchart &rarr;
              </button>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="cyber-btn-primary text-xs px-4 py-2 font-semibold group/btn"
              >
                <span>{project.buttonText}</span>
                <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[3px]">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Pure Image-Based 3D Stack */}
          <div className="md:col-span-6">
            <ImageStackPreview
              project={project}
              isCardHovered={isHovered}
              parallax={parallax}
              isMobileOrReduced={isMobileOrReducedMotion}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Category */}
            <div className="flex items-center justify-between gap-2">
              <span className={`${project.badgeStyle} font-semibold`}>
                {project.previewType === 'meivan' ? (
                  <ShieldCheck size={13} />
                ) : project.previewType === 'meivan-art' ? (
                  <Palette size={13} />
                ) : (
                  <ScanFace size={13} />
                )}
                {project.category}
              </span>

              <span className="text-[0.65rem] font-code text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                {project.tagline}
              </span>
            </div>

            {/* Pure Image-Based 3D Stack */}
            <ImageStackPreview
              project={project}
              isCardHovered={isHovered}
              parallax={parallax}
              isMobileOrReduced={isMobileOrReducedMotion}
            />

            {/* Content */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(project);
              }}
              className="text-[0.72rem] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-code flex items-center gap-1"
            >
              <Info size={13} /> Details &rarr;
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="cyber-btn-secondary text-[0.72rem] px-3 py-1 font-medium group-hover:border-slate-400 dark:group-hover:border-slate-500"
            >
              <span>{project.buttonText}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
                ↗
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

{/* PURE IMAGE-BASED 3D LAYERED SCREENSHOT STACK */}
function ImageStackPreview({
  project,
  isCardHovered,
  parallax,
  isMobileOrReduced,
}: {
  project: ExplorationItem;
  isCardHovered: boolean;
  parallax: { x: number; y: number };
  isMobileOrReduced: boolean;
}) {
  const images = project.images && project.images.length > 0 ? project.images : ['/images/AI_civic.png'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const intervalTime = isCardHovered ? 1600 : 2600;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 300);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isCardHovered, images.length]);

  const zRotations = [-2, 2, -3, 3];

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group-hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
      <div
        className="relative w-full h-full aspect-square overflow-hidden p-3 flex items-center justify-center bg-slate-50 dark:bg-[#0c121e]"
        style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      >
        {/* Layer 2 (Back Card) */}
        <div
          className="absolute inset-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 pointer-events-none opacity-50"
          style={{
            transform: `rotateZ(${zRotations[(activeIndex + 2) % zRotations.length]}deg) scale(${
              isCardHovered ? 0.93 : 0.9
            }) translateZ(0px) translate3d(${parallax.x * 2}px, ${parallax.y * 2}px, 0)`,
          }}
        >
          <RenderImageSlide
            imageUrl={images[(activeIndex + 2) % images.length]}
            altText={`${project.title} Screenshot ${(activeIndex + 2) % images.length + 1}`}
            fallbackType={project.previewType}
          />
        </div>

        {/* Layer 1 (Middle Card) */}
        <div
          className="absolute inset-3 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md transition-all duration-500 pointer-events-none opacity-80"
          style={{
            transform: `rotateZ(${zRotations[(activeIndex + 1) % zRotations.length]}deg) scale(${
              isCardHovered ? 0.98 : 0.95
            }) translateZ(${isCardHovered ? '12px' : '8px'}) translate3d(${parallax.x * 4}px, ${
              parallax.y * 4
            }px, 0)`,
          }}
        >
          <RenderImageSlide
            imageUrl={images[(activeIndex + 1) % images.length]}
            altText={`${project.title} Screenshot ${(activeIndex + 1) % images.length + 1}`}
            fallbackType={project.previewType}
          />
        </div>

        {/* Layer 0 (Top Active Card) */}
        <div
          className="absolute inset-3 rounded-xl overflow-hidden border-2 border-indigo-500/70 dark:border-indigo-400/70 shadow-lg transition-all duration-500 pointer-events-none"
          style={{
            transform: isTransitioning
              ? 'rotateY(-15deg) translateX(20px) scale(0.95)'
              : `rotateZ(${zRotations[activeIndex % zRotations.length]}deg) scale(${
                  isCardHovered ? 1.03 : 1
                }) translateZ(${isCardHovered ? '28px' : '20px'}) translate3d(${
                  parallax.x * 6
                }px, ${parallax.y * 6}px, 0)`,
            opacity: 1,
          }}
        >
          <RenderImageSlide
            imageUrl={images[activeIndex]}
            altText={`${project.title} Screenshot ${activeIndex + 1}`}
            fallbackType={project.previewType}
          />
        </div>

        {/* Floating Stack Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === activeIndex ? 'bg-indigo-600 dark:bg-indigo-400 w-3' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

{/* RENDER PURE IMAGE SLIDE */}
function RenderImageSlide({
  imageUrl,
  altText,
  fallbackType,
}: {
  imageUrl: string;
  altText: string;
  fallbackType: ExplorationItem['previewType'];
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [imageUrl]);

  const defaultFallbackImages: Record<string, string> = {
    'ai-sim': '/images/AI_civic.png',
    meivan: '/images/full1.png',
    'meivan-art': '/images/gridAIchemy.png',
    deepfake: '/images/unmasked.png',
  };

  const primarySrc = imageUrl || defaultFallbackImages[fallbackType] || '/images/AI_civic.png';

  return (
    <div className="relative w-full h-full bg-white dark:bg-[#111827] flex items-center justify-center overflow-hidden">
      <img
        src={imgFailed ? (defaultFallbackImages[fallbackType] || '/images/AI_civic.png') : primarySrc}
        alt={altText}
        loading="lazy"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover object-center rounded-xl transition-all duration-300"
      />
    </div>
  );
}

{/* IN-DEPTH DETAILS MODAL COMPONENT */}
function InDepthDetailsModal({
  project,
  isAdmin = false,
  onRequireAdminLogin,
  onLogout,
  onClose,
}: {
  project: ExplorationItem;
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
  onLogout?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <span className={project.badgeStyle}>
              <Bot size={14} /> {project.category}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* 3D Image Preview Area */}
          <div className="w-full max-w-lg mx-auto">
            <ImageStackPreview
              project={project}
              isCardHovered={false}
              parallax={{ x: 0, y: 0 }}
              isMobileOrReduced={false}
            />
          </div>

          {/* Project In-Depth Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code flex items-center gap-2">
              <Info size={16} /> Overview &amp; System Purpose
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* PROJECT-SPECIFIC INDIVIDUAL FLOWCHART COMPONENT */}
          <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-code flex items-center gap-2">
              <GitFork size={16} className="text-indigo-500" /> Project Architecture Flowchart
            </h3>
            <ProjectFlowchart
              projectId={project.id}
              isAdmin={isAdmin}
              onRequireAdminLogin={onRequireAdminLogin}
              onLogout={onLogout}
            />
          </div>

          {/* Project Key Performance Metrics */}
          {project.stats && project.stats.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-code flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-500" /> Key Metrics &amp; Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-code mb-1">
                      {stat.label}
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-code">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features & Innovations Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-code flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-500" /> Key Features &amp; Innovations
            </h3>
            <ul className="space-y-2.5">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200/60 dark:border-indigo-800/60 font-bold text-xs">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Stack Badges */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-code flex items-center gap-2">
              <Code2 size={16} className="text-violet-500" /> Technologies &amp; Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold font-code"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <Github size={14} /> Source Code ↗
              </a>
            )}
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-btn-primary text-xs px-5 py-2.5 font-semibold flex items-center gap-2"
          >
            <span>Launch Live {project.title}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
