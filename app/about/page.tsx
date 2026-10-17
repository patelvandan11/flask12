import React from 'react';
import { getResumeData } from '@/lib/contentStore';
import AboutContent from '@/components/AboutContent';
import { ResumeData } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Me | Vandan Patel',
  description: 'Learn more about Vandan Patel\'s background, education, work experience, technical skills, and hobbies.',
};

export default async function AboutPage() {
  const resume = await getResumeData();
  return <AboutContent initialResume={resume as unknown as ResumeData} />;
}
