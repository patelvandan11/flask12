import React from 'react';
import { getProjectsData, getBlogData, getResumeData } from '@/lib/contentStore';
import { Project, BlogPost, ResumeData } from '@/types/portfolio';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [projects, posts, resume] = await Promise.all([
    getProjectsData(),
    getBlogData(),
    getResumeData(),
  ]);

  return (
    <HomePageClient
      initialProjects={projects as Project[]}
      initialPosts={posts as BlogPost[]}
      initialResume={resume as unknown as ResumeData}
    />
  );
}
