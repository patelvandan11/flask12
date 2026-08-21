export interface Project {
  title: string;
  url: string;
  urlw: string;
  github_url?: string | null;
  live_demo?: string | null;
  description: string;
  img_src: string;
  img_srcset: string;
}

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  author: string;
  description: string;
}

export interface ArtItem {
  title: string;
  description: string;
  image_file: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  company_url: string;
  duration: string;
  details: string;
}

export interface TechnicalSkills {
  programming_languages: string[];
  frameworks: string[];
  ai_ml_libraries: string[];
}

export interface Links {
  github: string;
  linkedin: string;
  medium: string;
  hashnode?: string;
  kaggle: string;
  leetcode: string;
  instagram: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  degree: string;
  institution: string;
  graduation_year: string;
  cgpa: string;
  technical_skills: TechnicalSkills;
  work_experience: WorkExperience[];
  featured_projects: Array<{
    title: string;
    description: string;
  }>;
  links: Links;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
