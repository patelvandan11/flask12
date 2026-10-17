import type { Metadata } from 'next';
import BeyondCodingContent from '@/components/BeyondCodingContent';
import { getBeyondCodingData } from '@/lib/contentStore';

export const metadata: Metadata = {
  title: 'Beyond Coding — Digital Scrapbook & Life Planner | Vandan Patel',
  description:
    'Explore Vandan Patel’s soft cozy digital scrapbook calendar and memory planner capturing everyday moments, travels, art, and life beyond software engineering.',
};

export const dynamic = 'force-dynamic';

export default async function BeyondCodingPage() {
  const initialData = await getBeyondCodingData();
  return <BeyondCodingContent initialData={initialData} />;
}
