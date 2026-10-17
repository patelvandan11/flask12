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
  id?: number;
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

export interface StackSection {
  ai_ml: string[];
  data: string[];
  backend: string[];
  infra: string[];
}

export interface CoreStackOverview {
  ai_ml: string;
  data: string;
  backend: string;
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
  summary?: string;
  hero_bio?: string;
  hero_badges?: string[];
  projects_count?: string;
  projects_count_label?: string;
  metric_badge?: string;
  core_stack_overview?: CoreStackOverview;
  stack_section?: StackSection;
  soft_skills?: string[];
  hobbies?: string[];
  about_bio?: string;
  technical_skills: TechnicalSkills;
  work_experience: WorkExperience[];
  featured_projects: Array<{
    title: string;
    description: string;
  }>;
  links: Links;
}

export const EMPTY_RESUME: ResumeData = {
  name: 'Vandan Patel',
  title: 'AI Engineer & Full-Stack Developer',
  email: 'vandan11patel@gmail.com',
  phone: '+91 8849767223',
  location: 'Ahmedabad, India',
  degree: 'B.Tech in Information Technology',
  institution: 'CHARUSAT',
  graduation_year: '2026',
  cgpa: '8.76',
  summary: '',
  hero_bio: '',
  about_bio: '',
  hero_badges: [],
  soft_skills: [],
  hobbies: [],
  core_stack_overview: { ai_ml: '', data: '', backend: '' },
  stack_section: { ai_ml: [], data: [], backend: [], infra: [] },
  technical_skills: { programming_languages: [], frameworks: [], ai_ml_libraries: [] },
  work_experience: [],
  featured_projects: [],
  links: {
    github: 'https://github.com/patelvandan11',
    linkedin: 'https://linkedin.com/in/vandan-patel11',
    medium: 'https://medium.com/@vandanpatel',
    kaggle: 'https://kaggle.com/vandanpatel',
    leetcode: 'https://leetcode.com/u/vandanpatel11/',
    instagram: 'https://instagram.com/vandan_patel',
  },
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  source?: string;
  category: 'AI Engineering' | 'Deep Learning' | 'Machine Learning' | 'Philosophy' | 'Mindset' | 'Creativity' | 'Tech & Life' | 'Growth' | 'Art';
  colorTheme?: 'indigo' | 'purple' | 'amber' | 'emerald' | 'rose' | 'sky';
  bgImage?: string;
  noteImage?: string;
  pinned?: boolean;
  tags: string[];
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  notesImage?: string;
  status: 'Currently Reading' | 'Completed' | 'Favorite' | 'Want to Read';
  rating: number;
  keyTakeaway: string;
  favoriteQuote?: string;
  genre: string;
  yearRead?: string;
}

export interface PersonalStats {
  booksReadThisYear: number;
  yearlyGoal: number;
  favoriteCategory: string;
  mindsetQuote: string;
}

export type PlannerSticker =
  | 'sun'
  | 'smiley'
  | 'sparkle'
  | 'coffee'
  | 'cat'
  | 'flower'
  | 'pizza'
  | 'camera'
  | 'art'
  | 'heart'
  | 'plant'
  | 'pin'
  | 'tape'
  | 'star'
  | 'custom';

export interface PlannerMemory {
  id: string;
  year: number;
  month: number; // 1 - 12
  day: number; // 1 - 31
  title: string;
  note?: string;
  imageUrl?: string;
  images?: string[]; // Multiple photos support for 2s slideshow
  sticker?: PlannerSticker | string;
  stickerText?: string;
  tapeColor?: 'gold' | 'pink' | 'mint' | 'kraft' | 'lavender';
  location?: string;
  mood?: string;
  pinned?: boolean;
}

export interface MonthScrapbook {
  month: number;
  name: string;
  fullSpanishName: string;
  fullEnglishName: string;
  coverImages: string[];
  vibeText?: string;
  stickers: string[];
}

export interface BeyondCodingData {
  year: number;
  title: string;
  subtitle: string;
  memories: PlannerMemory[];
  months: MonthScrapbook[];
  quotes?: QuoteItem[];
  books?: BookItem[];
  personalStats?: PersonalStats;
}

