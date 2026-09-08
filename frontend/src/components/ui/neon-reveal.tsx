'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface NeonRevealProps {
  revealDelay?: number;
  revealDuration?: number;
  verticalOffset?: number;
  direction?: 'horizontal' | 'vertical';
  color?: number; // Hue 0-360 degrees (e.g. 26 for Terracotta / Saffron Gold)
  barWidth?: number;
  barHeight?: number;
  mirrored?: boolean;
  expandFrom?: 'center' | 'left' | 'right';
  animateOnScroll?: boolean;
  scrollThreshold?: number;
  intensity?: number;
  glowSpread?: number;
  followCursor?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function NeonReveal({
  revealDelay = 150,
  revealDuration = 2000,
  verticalOffset = 0.72,
  direction = 'horizontal',
  color = 26, // Academic Terracotta & Saffron Gold (matches #9F3E07)
  barWidth = 0.85,
  barHeight = 0.003,
  mirrored = false,
  expandFrom = 'center',
  animateOnScroll = false,
  scrollThreshold = 0.2,
  intensity = 1.0,
  glowSpread = 1.0,
  followCursor = false,
  onStart,
  onComplete,
  className,
  children,
}: NeonRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isStartedRef = useRef(false);
  const isCompletedRef = useRef(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [inView, setInView] = useState(!animateOnScroll);

  // IntersectionObserver for animateOnScroll
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: scrollThreshold }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOnScroll, scrollThreshold]);

  // Handle cursor tracking if enabled
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!followCursor || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, [followCursor]);

  // Main canvas render loop simulating realistic, clean neon beam
  useEffect(() => {
    if (!inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + revealDelay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (!isStartedRef.current) {
        isStartedRef.current = true;
        onStart?.();
      }

      // Normalized progress with smooth ease-out-cubic
      const rawProgress = Math.min(1, elapsed / revealDuration);
      const progress = 1 - Math.pow(1 - rawProgress, 3);

      ctx.clearRect(0, 0, width, height);

      const drawBar = (yOffset: number) => {
        const actualY = height * yOffset;
        const totalSpan = width * barWidth * progress;

        let startX = 0;
        let endX = width;

        if (expandFrom === 'center') {
          const halfSpan = totalSpan / 2;
          const centerX = width * 0.5;
          startX = centerX - halfSpan;
          endX = centerX + halfSpan;
        } else if (expandFrom === 'left') {
          startX = (width * (1 - barWidth)) / 2;
          endX = startX + totalSpan;
        } else if (expandFrom === 'right') {
          endX = width - (width * (1 - barWidth)) / 2;
          startX = endX - totalSpan;
        }

        const barLen = Math.max(0, endX - startX);
        if (barLen <= 2) return;

        ctx.save();

        // Feathered horizontal opacity gradient to eliminate sharp rectangular ends
        const hGrad = ctx.createLinearGradient(startX, 0, endX, 0);
        hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        hGrad.addColorStop(0.08, 'rgba(255, 255, 255, 1)');
        hGrad.addColorStop(0.92, 'rgba(255, 255, 255, 1)');
        hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // 1. Wide Ambient Volumetric Bloom (Warm Saffron / Terracotta)
        const ambientBloom = ctx.createLinearGradient(0, actualY - 28 * glowSpread, 0, actualY + 28 * glowSpread);
        ambientBloom.addColorStop(0, 'rgba(234, 88, 12, 0)');
        ambientBloom.addColorStop(0.5, `rgba(234, 88, 12, ${0.14 * intensity * progress})`);
        ambientBloom.addColorStop(1, 'rgba(234, 88, 12, 0)');

        ctx.fillStyle = ambientBloom;
        ctx.fillRect(startX, actualY - 28 * glowSpread, barLen, 56 * glowSpread);

        // 2. Focused Chromatic Halo
        const haloGrad = ctx.createLinearGradient(0, actualY - 8 * glowSpread, 0, actualY + 8 * glowSpread);
        haloGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
        haloGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.45 * intensity * progress})`);
        haloGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');

        ctx.fillStyle = haloGrad;
        ctx.fillRect(startX, actualY - 8 * glowSpread, barLen, 16 * glowSpread);

        // 3. Crisp Glowing Core Filament (1.5px to 2.5px thickness)
        const coreThickness = Math.max(1.5, Math.min(2.5, height * barHeight));
        ctx.shadowColor = `rgba(234, 88, 12, ${0.75 * intensity})`;
        ctx.shadowBlur = 10 * glowSpread;
        ctx.fillStyle = `rgba(255, 248, 240, ${0.95 * progress})`;
        ctx.fillRect(startX, actualY - coreThickness / 2, barLen, coreThickness);

        ctx.restore();
      };

      drawBar(verticalOffset);

      if (mirrored) {
        drawBar(1.0 - verticalOffset);
      }

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          onComplete?.();
        }
        // Subtle resting warmth pulse
        const pulse = Math.sin(timestamp * 0.002) * 0.05 + 0.95;
        ctx.save();
        ctx.globalAlpha = pulse;
        drawBar(verticalOffset);
        if (mirrored) drawBar(1.0 - verticalOffset);
        ctx.restore();
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    inView,
    revealDelay,
    revealDuration,
    verticalOffset,
    direction,
    color,
    barWidth,
    barHeight,
    mirrored,
    expandFrom,
    intensity,
    glowSpread,
    onStart,
    onComplete
  ]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative w-full overflow-hidden', className)}
    >
      {/* Background Neon Glow Canvas Layer - pointer-events-none */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Foreground Content - Completely accessible & interactive */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

export default NeonReveal;
