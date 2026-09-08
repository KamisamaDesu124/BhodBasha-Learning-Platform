'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP plugins safely on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TextRevealProps {
  items?: string[];
  scrollDistance?: string;
  perspective?: number;
  radiusOffset?: number;
  startRotation?: number;
  endRotation?: number;
  scrubSmoothing?: number;
  fontSize?: string;
  fontWeight?: number;
  gap?: number;
  className?: string;
  textClassName?: string;
  subtitle?: string;
}

export function TextReveal({
  items = [
    "India's Statistical Architecture",
    "Continuous Cadre Building",
    "Engineered for Real-World",
    "Field Realities"
  ],
  scrollDistance = '250vh',
  perspective = 900,
  radiusOffset = 0.16,
  startRotation = -15,
  endRotation = 65,
  scrubSmoothing = 1.8,
  fontSize = 'clamp(1.75rem, 3.8vw, 2.85rem)',
  fontWeight = 800,
  gap = 14,
  className,
  textClassName,
  subtitle = 'TECHNICAL ARCHITECTURE'
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState<number>(180);

  // Recalculate radius dynamically for tight, cinematic line spacing
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window === 'undefined') return;
      const vh = window.innerHeight;
      // Controlled radius so lines remain tightly spaced
      const calculatedRadius = (vh * radiusOffset) / Math.tan((gap * Math.PI) / 360);
      setRadius(Math.max(140, Math.min(calculatedRadius, 240)));
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, [gap, radiusOffset]);

  // GSAP ScrollTrigger animation with smoothed pacing
  useEffect(() => {
    if (!containerRef.current || !pinRef.current || !cylinderRef.current) return;

    // Set initial cylinder rotation
    gsap.set(cylinderRef.current, {
      rotationX: startRotation,
      transformStyle: 'preserve-3d',
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: pinRef.current,
      scrub: scrubSmoothing,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: gsap.to(cylinderRef.current, {
        rotationX: endRotation,
        ease: 'power1.out',
      }),
    });

    return () => {
      trigger.kill();
    };
  }, [scrollDistance, startRotation, endRotation, scrubSmoothing]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full select-none', className)}
    >
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-12 px-4 overflow-hidden bg-gradient-to-b from-slate-50/70 via-[#FCF9F8] to-slate-100/80"
      >
        {/* Top Header Label - Positioned well above the 3D rotating cylinder */}
        <div className="flex flex-col items-center gap-2 pt-2">
          {subtitle && (
            <span className="px-3.5 py-1 rounded-full border border-[#9F3E07]/25 bg-orange-50 text-[#9F3E07] text-[11px] font-mono font-bold uppercase tracking-widest shadow-2xs">
              {subtitle}
            </span>
          )}
          <p className="text-xs text-slate-500 font-sans font-medium">
            AI-Enabled Capacity Building for India's Statistical Cadres
          </p>
        </div>

        {/* 3D Scene Viewport */}
        <div
          className="relative w-full max-w-4xl h-[220px] sm:h-[260px] flex items-center justify-center my-auto"
          style={{
            perspective: `${perspective}px`,
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Rotating 3D Cylinder with tight line spacing */}
          <div
            ref={cylinderRef}
            className="w-full h-full flex items-center justify-center relative"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {items.map((item, index) => {
              const angle = index * gap;
              const isHighlight = index >= items.length - 2;

              return (
                <div
                  key={index}
                  className={cn(
                    'absolute w-full text-center px-4 leading-[1.2] tracking-tight font-serif transition-colors',
                    isHighlight ? 'text-[#9F3E07]' : 'text-slate-900',
                    textClassName
                  )}
                  style={{
                    fontSize,
                    fontWeight,
                    transform: `rotateX(${-angle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    textShadow: isHighlight 
                      ? '0 2px 14px rgba(159, 62, 7, 0.18)' 
                      : '0 2px 8px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Helper indicator - Clean and unobtrusive */}
        <div className="pb-4 flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9F3E07] animate-pulse" />
          <span>Scroll slowly to explore 3D field architecture</span>
        </div>
      </div>
    </div>
  );
}

export default TextReveal;
