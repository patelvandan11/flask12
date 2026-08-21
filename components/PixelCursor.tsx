'use client';

import React, { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

// Sage Green Palette from design image
const COLORS = [
  '#718355', // Deep Sage
  '#87986A', // Deep Medium Sage
  '#97A97C', // Medium Sage
  '#B5C99A', // Medium Light Sage
  '#CFE1B9', // Soft Light Sage
];

export default function PixelCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });
  const pixelsRef = useRef<Pixel[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = Math.floor(Math.random() * 3) + 4;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.3;

        pixelsRef.current.push({
          x: e.clientX + (Math.random() * 10 - 5),
          y: e.clientY + (Math.random() * 10 - 5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          color,
          alpha: 0.85,
          decay: Math.random() * 0.035 + 0.025,
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current.active) {
        const mx = Math.floor(mouseRef.current.x / 4) * 4;
        const my = Math.floor(mouseRef.current.y / 4) * 4;

        ctx.strokeStyle = 'rgba(113, 131, 85, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mx - 5, my - 5, 10, 10);

        ctx.fillStyle = 'rgba(181, 201, 154, 0.9)';
        ctx.fillRect(mx - 2, my - 2, 4, 4);
      }

      const pixels = pixelsRef.current;
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          pixels.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        const px = Math.floor(p.x / 2) * 2;
        const py = Math.floor(p.y / 2) * 2;
        ctx.fillRect(px, py, p.size, p.size);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
