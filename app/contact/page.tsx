import React from 'react';
import { getResumeData } from '@/lib/contentStore';
import ContactPageClient from '@/components/ContactPageClient';
import { ResumeData } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact | Vandan Patel',
  description: 'Get in touch with Vandan Patel for full-time roles, freelance projects, AI consulting, or research collaborations.',
};

export default async function ContactPage() {
  const resume = await getResumeData();
  return <ContactPageClient initialResume={resume as unknown as ResumeData} />;
}
