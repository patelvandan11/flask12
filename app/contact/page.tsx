import React from 'react';
import resumeData from '@/data/resume.json';
import ContactPageClient from '@/components/ContactPageClient';
import { ResumeData } from '@/types/portfolio';

export const metadata = {
  title: 'Contact | Vandan Patel',
  description: 'Get in touch with Vandan Patel for full-time roles, freelance projects, AI consulting, or research collaborations.',
};

export default function ContactPage() {
  return <ContactPageClient initialResume={resumeData as unknown as ResumeData} />;
}
