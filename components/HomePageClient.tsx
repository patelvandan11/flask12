'use client';

import React from 'react';
import { Project, BlogPost, ResumeData } from '@/types/portfolio';
import { useResumeData } from './useResumeData';
import HomeHeroSection from './HomeHeroSection';
import TechStackSection from './TechStackSection';
import ProjectsContent from './ProjectsContent';
import AboutContent from './AboutContent';
import BlogContent from './BlogContent';
import ContactSection from './ContactSection';

interface HomePageClientProps {
  initialProjects: Project[];
  initialPosts: BlogPost[];
  initialResume: ResumeData;
}

export default function HomePageClient({
  initialProjects,
  initialPosts,
  initialResume,
}: HomePageClientProps) {
  const {
    resume,
    isSaving,
    saveResume,
    addTechStackItem,
    removeTechStackItem,
    addHeroBadge,
    removeHeroBadge,
  } = useResumeData(initialResume);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* 1. HERO SECTION (#home) */}
      <HomeHeroSection
        resume={resume}
        onSave={saveResume}
        onAddBadge={addHeroBadge}
        onRemoveBadge={removeHeroBadge}
        isSaving={isSaving}
      />

      {/* 2. TECH STACK SECTION (#stack) */}
      <TechStackSection
        stack={resume.stack_section}
        onAddItem={addTechStackItem}
        onRemoveItem={removeTechStackItem}
        isSaving={isSaving}
      />

      {/* 3. PROJECTS SECTION (#projects) */}
      <section id="projects" className="scroll-mt-28">
        <ProjectsContent initialProjects={initialProjects} sectionPrefix="03 / PORTFOLIO & LAB" hidePadding={true} />
      </section>

      {/* 4. ABOUT SECTION (#about) */}
      <section id="about" className="scroll-mt-28">
        <AboutContent initialResume={resume} sectionPrefix="04 / BIOGRAPHY" isStandalonePage={false} />
      </section>

      {/* 5. BLOG SECTION (#blog) */}
      <section id="blog" className="scroll-mt-28">
        <BlogContent initialPosts={initialPosts} sectionPrefix="05 / WRITING & ARTICLES" hidePadding={true} />
      </section>

      {/* 6. CONTACT SECTION (#contact) */}
      <ContactSection
        resume={resume}
        onSave={saveResume}
        isSaving={isSaving}
        sectionPrefix="06 / TALK & CONTACT"
      />
    </div>
  );
}
