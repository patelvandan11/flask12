import React from 'react';
import blogData from '@/data/blog.json';
import { BlogPost } from '@/types/portfolio';
import { Calendar, User, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Blog & Articles | Vandan Patel',
  description: 'Technical articles and deep dives written by Vandan Patel on LLM fine-tuning, RAG systems, and neural networks.',
};

export default function BlogPage() {
  const posts: BlogPost[] = blogData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Technical <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Articles</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          In-depth guides and articles on LLM fine-tuning, RAG architecture, backpropagation, and foundation models.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <article key={idx} className="cyber-glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-[0.75rem] font-semibold text-text-muted mb-3.5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-cyber-cyan" /> {post.date}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <User size={13} className="text-cyber-violet" /> {post.author}
                </span>
              </div>

              <h2 className="text-lg font-bold leading-snug mb-3 text-text-primaryLight dark:text-text-primaryDark hover:text-cyber-cyan transition-colors duration-150">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h2>

              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-6">
                {post.description}
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-secondary w-full text-xs py-2.5"
              >
                Read Full Article on Medium <ExternalLink size={13} className="ml-1.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
