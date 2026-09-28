import React from 'react';
import blogData from '@/data/blog.json';
import { BlogPost } from '@/types/portfolio';
import BlogContent from '@/components/BlogContent';

export const metadata = {
  title: 'Blog & Articles | Vandan Patel',
  description: 'Technical articles and deep dives written by Vandan Patel on LLM fine-tuning, RAG systems, and neural networks.',
};

export default function BlogPage() {
  const posts: BlogPost[] = blogData;
  return <BlogContent initialPosts={posts} />;
}
