import type { Metadata } from 'next';
import BeyondCodingContent from '@/components/BeyondCodingContent';
import { getBeyondCodingData } from '@/lib/contentStore';

export const metadata: Metadata = {
  title: 'Beyond Coding — Books, Philosophy & Inspirations | Vandan Patel',
  description:
    'Explore Vandan Patel’s bookshelf, timeless quotes, Pinterest-style pins, mental models, and life philosophy beyond software engineering.',
};

export const dynamic = 'force-dynamic';

export default async function BeyondCodingPage() {
  const initialData = await getBeyondCodingData();
  return <BeyondCodingContent initialData={initialData} />;
}
