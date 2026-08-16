import React from 'react';
import Image from 'next/image';
import resumeData from '@/data/resume.json';
import { Mail, Phone, MapPin, Lightbulb, Palette, Briefcase, Code2, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'About Me | Vandan Patel',
  description: 'Learn more about Vandan Patel\'s background, education, work experience, technical skills, and hobbies.',
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          About <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Vandan Patel</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          AI &amp; Data Science Engineer passionate about building intelligent, scalable, and impact-driven technology.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Soft Skills */}
        <div className="flex flex-col gap-6">
          <div className="cyber-glass-card p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
              <Image
                src="/images/van.jpg"
                alt="Vandan Patel"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark mb-1">Vandan Patel</h2>
            <p className="text-cyber-cyan text-xs font-bold uppercase tracking-wider mb-3">
              AI &amp; Data Science Engineer
            </p>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark text-xs leading-relaxed mb-5">
              Graduate in Artificial Intelligence &amp; Data Science from A.D. Patel Institute of Technology. Experienced in LLM applications, RAG pipelines, and deep learning.
            </p>

            <div className="flex flex-col gap-3 text-left bg-black/5 dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={15} className="text-cyber-cyan" />
                <a href={`mailto:${resumeData.email}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan transition-colors underline truncate">
                  {resumeData.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={15} className="text-cyber-violet" />
                <a href={`tel:${resumeData.phone}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan transition-colors">
                  {resumeData.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin size={15} className="text-cyber-emerald" />
                <span className="text-text-secondaryLight dark:text-text-secondaryDark truncate">{resumeData.location}</span>
              </div>
            </div>
          </div>

          {/* Soft Skills & Hobbies Card */}
          <div className="cyber-glass-card p-6">
            <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark mb-4 flex items-center gap-2">
              <Lightbulb size={17} className="text-cyber-cyan" /> Soft Skills &amp; Interests
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="cyber-badge">Critical Thinking</span>
              <span className="cyber-badge">Problem Solving</span>
              <span className="cyber-badge">Creative Thinking</span>
            </div>

            <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark mb-4 flex items-center gap-2">
              <Palette size={17} className="text-cyber-violet" /> Hobbies
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="cyber-badge-violet">Tech Exploration</span>
              <span className="cyber-badge-violet">Painting &amp; Digital Art</span>
              <span className="cyber-badge-violet">Storytelling</span>
            </div>
          </div>
        </div>

        {/* Right Column: Work Experience, Skills & Education */}
        <div className="col-span-2 flex flex-col gap-6">
          
          {/* Work Experience */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-6 flex items-center gap-2.5">
              <Briefcase size={22} className="text-cyber-cyan" /> Work Experience
            </h2>

            <div className="relative pl-6 border-l-2 border-cyber-cyan/30 space-y-8">
              {resumeData.work_experience.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <span className="absolute left-[-1.85rem] top-1.5 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.7)]"></span>
                  
                  <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark leading-snug">
                    {exp.role} &middot;{' '}
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-cyan hover:underline"
                    >
                      {exp.company}
                    </a>
                  </h3>
                  <p className="text-xs font-semibold font-code text-cyber-cyan/80 my-1">{exp.duration}</p>
                  <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-6 flex items-center gap-2.5">
              <Code2 size={22} className="text-cyber-violet" /> Technical Expertise
            </h2>

            <div className="space-y-5">
              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Languages
                </span>
                <div className="flex flex-wrap gap-2">
                  {resumeData.technical_skills.programming_languages.map((lang, i) => (
                    <span key={i} className="cyber-badge">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Frameworks &amp; Web
                </span>
                <div className="flex flex-wrap gap-2">
                  {resumeData.technical_skills.frameworks.map((fw, i) => (
                    <span key={i} className="cyber-badge-violet">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  AI / ML / Data Libraries
                </span>
                <div className="flex flex-wrap gap-2">
                  {resumeData.technical_skills.ai_ml_libraries.map((lib, i) => (
                    <span key={i} className="cyber-badge">
                      {lib}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="cyber-glass-card p-8">
            <h2 className="text-xl font-extrabold text-text-primaryLight dark:text-text-primaryDark mb-5 flex items-center gap-2.5">
              <GraduationCap size={22} className="text-cyber-emerald" /> Education
            </h2>
            <div>
              <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark leading-tight">{resumeData.degree}</h3>
              <p className="text-cyber-cyan text-sm font-semibold mt-1">
                {resumeData.institution}
              </p>
              <p className="text-text-secondaryLight dark:text-text-secondaryDark text-xs mt-2 font-medium">
                {resumeData.graduation_year} &middot; <strong className="text-text-primaryLight dark:text-text-primaryDark">CGPA: {resumeData.cgpa}</strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
