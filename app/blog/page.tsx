import React from 'react';
import { getBlogData } from '@/lib/contentStore';
import { BlogPost } from '@/types/portfolio';
import BlogContent from '@/components/BlogContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog & Articles | Vandan Patel',
  description: 'Technical articles and deep dives written by Vandan Patel on LLM fine-tuning, RAG systems, and neural networks.',
};

export default async function BlogPage() {
  const posts = (await getBlogData()) as BlogPost[];
  return <BlogContent initialPosts={posts || []} />;
}
