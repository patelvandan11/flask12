import React from 'react';
import { getProjectsData } from '@/lib/contentStore';
import { Project } from '@/types/portfolio';
import ProjectsContent from '@/components/ProjectsContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | Vandan Patel',
  description: 'Explore Vandan Patel\'s portfolio of AI, Machine Learning, RAG, SaaS, and Data Science projects.',
};

export default async function ProjectsPage() {
  const projects = (await getProjectsData()) as Project[];
  return <ProjectsContent initialProjects={projects || []} />;
}
