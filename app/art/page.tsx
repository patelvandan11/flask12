import React from 'react';
import artData from '@/data/art.json';
import { ArtItem } from '@/types/portfolio';
import ArtContent from '@/components/ArtContent';

export const metadata = {
  title: 'Creations & Art | Vandan Patel',
  description:
    'A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding by Vandan Patel.',
};

export default function ArtPage() {
  const artworks: ArtItem[] = artData;
  return <ArtContent initialArtworks={artworks} />;
}
