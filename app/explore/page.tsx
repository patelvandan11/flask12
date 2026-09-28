import type { Metadata } from 'next';
import ExploreContent from '@/components/ExploreContent';

export const metadata: Metadata = {
  title: 'Explore — Vandan Patel',
  description:
    "Explore Vandan Patel's AI experiments, products, websites, creative projects, and things he's building.",
};

export default function ExplorePage() {
  return <ExploreContent />;
}
