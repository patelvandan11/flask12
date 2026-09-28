import React from 'react';
import resumeData from '@/data/resume.json';
import AboutContent from '@/components/AboutContent';

export const metadata = {
  title: 'About Me | Vandan Patel',
  description: 'Learn more about Vandan Patel\'s background, education, work experience, technical skills, and hobbies.',
};

export default function AboutPage() {
  return <AboutContent initialResume={resumeData} />;
}
