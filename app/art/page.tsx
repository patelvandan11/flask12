import React from 'react';
import Image from 'next/image';
import artData from '@/data/art.json';
import { ArtItem } from '@/types/portfolio';

export const metadata = {
  title: 'Creations & Art | Vandan Patel',
  description:
    'A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding by Vandan Patel.',
};

export default function ArtPage() {
  const artworks: ArtItem[] = artData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Visual <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Creations</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((art, idx) => (
          <article key={idx} className="cyber-glass-card relative overflow-hidden aspect-[4/3] group cursor-pointer border border-black/10 dark:border-white/10 rounded-2xl shadow-md">
            <div className="relative w-full h-full">
              <Image
                src={`/images/${art.image_file}`}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <h3 className="text-sm font-bold text-white mb-1">
                  {art.title}
                </h3>
                <p className="text-[0.78rem] text-white/80 leading-relaxed">
                  {art.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
