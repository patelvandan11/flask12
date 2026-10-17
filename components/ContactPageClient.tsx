'use client';

import React from 'react';
import { ResumeData } from '@/types/portfolio';
import { useResumeData } from './useResumeData';
import ContactSection from './ContactSection';

export default function ContactPageClient({ initialResume }: { initialResume: ResumeData }) {
  const { resume, saveResume, isSaving } = useResumeData(initialResume);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <ContactSection
        resume={resume}
        onSave={saveResume}
        isSaving={isSaving}
        sectionPrefix="CONTACT & INQUIRIES"
        isStandalonePage={true}
      />
    </div>
  );
}
