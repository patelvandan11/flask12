import React from 'react';
import { getArtData } from '@/lib/contentStore';
import { ArtItem } from '@/types/portfolio';
import ArtContent from '@/components/ArtContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Creations & Art | Vandan Patel',
  description:
    'A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding by Vandan Patel.',
};

export default async function ArtPage() {
  const artworks = (await getArtData()) as ArtItem[];
  return <ArtContent initialArtworks={artworks || []} />;
}
