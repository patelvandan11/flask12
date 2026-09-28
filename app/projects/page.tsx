import React from 'react';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/portfolio';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata = {
  title: 'Projects | Vandan Patel',
  description: 'Explore Vandan Patel\'s portfolio of AI, Machine Learning, RAG, SaaS, and Data Science projects.',
};

export default function ProjectsPage() {
  const projects: Project[] = projectsData;
  return <ProjectsContent initialProjects={projects} />;
}
