'use client';

import React, {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export interface ScrollStackItem {
  eyebrow?: string;
  title?: string;
  body?: string;
  image?: string;
  accent?: string;
  icon?: React.ReactNode;
  tags?: string[];
}

export interface ScrollStackProps {
  items?: ScrollStackItem[];
  children?: React.ReactNode;
  variant?: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom' | 'reveal';
  scrollLength?: number;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  smooth?: number;
  depth?: number;
  cardWidth?: number;
  cardHeight?: number;
  borderRadius?: number;
  perspective?: number;
  showProgress?: boolean;
  showCounter?: boolean;
  onIndexChange?: (index: number) => void;
  className?: string;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const buildFilter = (progress: number, dim: number, blur: number) => {
  const parts: string[] = [];
  if (blur > 0.01) {
    parts.push(`blur(${(progress * blur).toFixed(2)}px)`);
  }
  if (dim > 0.001) {
    parts.push(`brightness(${(1 - progress * dim).toFixed(3)})`);
  }
  return parts.length ? parts.join(' ') : 'none';
};

interface AnimationConfig {
  peek: number;
  scaleStep: number;
  blur: number;
  dim: number;
  radius: number;
  enter: number;
}

const computeCardStyle = (
  variant: string,
  offset: number,
  index: number,
  config: AnimationConfig
) => {
  const clip = `inset(0 0 0 0 round ${config.radius}px)`;
  const sign = index % 2 === 0 ? 1 : -1;

  // 1. Card entering from below (offset < 0)
  if (offset < 0) {
    const rawEnter = clamp(offset + 1, 0, 1);
    const enterEased = smoothstep(rawEnter);

    switch (variant) {
      case 'fade':
        return {
          transform: `translate3d(0,0,0) scale(${(1.06 - 0.06 * enterEased).toFixed(4)})`,
          opacity: enterEased,
          filter: 'none',
          clip,
        };
      case 'flip':
        return {
          transform: `translate3d(0,${((1 - enterEased) * 26).toFixed(2)}%,0) rotateX(${(-((1 - enterEased) * 72)).toFixed(2)}deg)`,
          opacity: clamp(1.6 * enterEased, 0, 1),
          filter: 'none',
          clip,
        };
      case 'zoom':
        return {
          transform: `translate3d(0,0,0) scale(${(0.52 + 0.48 * enterEased).toFixed(4)})`,
          opacity: clamp(1.4 * enterEased, 0, 1),
          filter: config.blur > 0.01 ? `blur(${((1 - enterEased) * config.blur).toFixed(2)}px)` : 'none',
          clip,
        };
      case 'reveal':
        return {
          transform: 'translate3d(0,0,0)',
          opacity: 1,
          filter: 'none',
          clip: `inset(${((1 - rawEnter) * 100).toFixed(2)}% 0 0 0 round ${config.radius}px)`,
        };
      case 'deck':
        return {
          transform: `translate3d(0,${((1 - rawEnter) * (config.enter + 6)).toFixed(2)}%,0) rotate(${((1 - enterEased) * 4 * sign).toFixed(2)}deg)`,
          opacity: 1,
          filter: 'none',
          clip,
        };
      case 'stack':
      default:
        return {
          transform: `translate3d(0,${((1 - rawEnter) * config.enter).toFixed(2)}%,0)`,
          opacity: 1,
          filter: 'none',
          clip,
        };
    }
  }

  // 2. Card covered or stacked (offset >= 0)
  const coveredEased = smoothstep(clamp(offset, 0, 1));

  switch (variant) {
    case 'fade':
      return {
        transform: `translate3d(0,0,0) scale(${(1 - 0.06 * coveredEased).toFixed(4)})`,
        opacity: 1 - coveredEased,
        filter: buildFilter(coveredEased, config.dim, config.blur),
        clip,
      };
    case 'flip':
      return {
        transform: `translate3d(0,${(-(26 * coveredEased)).toFixed(2)}%,0) rotateX(${(72 * coveredEased).toFixed(2)}deg)`,
        opacity: 1 - coveredEased,
        filter: buildFilter(coveredEased, config.dim, 0),
        clip,
      };
    case 'zoom':
      return {
        transform: `translate3d(0,0,0) scale(${(1 + 0.42 * coveredEased).toFixed(4)})`,
        opacity: 1 - coveredEased,
        filter: config.blur > 0.01 ? `blur(${(coveredEased * config.blur * 1.4).toFixed(2)}px)` : 'none',
        clip,
      };
    case 'reveal':
      return {
        transform: `translate3d(0,${(-offset * config.peek * 0.5).toFixed(2)}px,0) scale(${(1 - offset * config.scaleStep * 0.7).toFixed(4)})`,
        opacity: 1,
        filter: buildFilter(offset, config.dim, config.blur),
        clip,
      };
    case 'deck':
      return {
        transform: `translate3d(0,${(-offset * config.peek * 0.75).toFixed(2)}px,0) rotate(${(4.5 * offset * sign).toFixed(2)}deg) scale(${(1 - offset * config.scaleStep * 0.85).toFixed(4)})`,
        opacity: 1,
        filter: buildFilter(offset, config.dim, config.blur),
        clip,
      };
    case 'stack':
    default:
      return {
        transform: `translate3d(0,${(-offset * config.peek).toFixed(2)}px,0) scale(${(1 - offset * config.scaleStep).toFixed(4)})`,
        opacity: 1,
        filter: buildFilter(offset, config.dim, config.blur),
        clip,
      };
  }
};

export function ScrollStack({
  items = [],
  children,
  variant = 'deck',
  scrollLength = 1.0,
  peek = 28,
  scaleStep = 0.06,
  blur = 3,
  dim = 0.18,
  smooth = 0.16,
  depth = 3,
  cardWidth = 840,
  cardHeight = 0.58,
  borderRadius = 20,
  perspective = 1400,
  showProgress = true,
  showCounter = true,
  onIndexChange,
  className,
}: ScrollStackProps) {
  const customCards = useMemo(
    () => Children.toArray(children).filter(isValidElement),
    [children]
  );
  const cardList = customCards.length > 0 ? customCards : items;
  const totalCards = cardList.length;

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLSpanElement>(null);

  const currentScrollProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameIdRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastReportedIndexRef = useRef(-1);
  const onIndexChangeRef = useRef(onIndexChange);

  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const animConfig = useMemo<AnimationConfig>(
    () => ({
      peek: Math.max(0, peek),
      scaleStep: clamp(scaleStep, 0, 0.4),
      blur: reducedMotion ? 0 : Math.max(0, blur),
      dim: clamp(dim, 0, 1),
      radius: Math.max(0, borderRadius),
      enter: ((1 + 1 / clamp(cardHeight, 0.2, 0.95)) / 2) * 100 + 3,
    }),
    [peek, scaleStep, blur, dim, borderRadius, reducedMotion, cardHeight]
  );

  const applyFrameTransforms = useCallback(
    (progress: number) => {
      const maxDepth = Math.max(1, Math.round(depth));

      for (let i = 0; i < totalCards; i += 1) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const offset = progress - i;
        if (offset < -1.0005 || offset > maxDepth) {
          if (cardEl.style.visibility !== 'hidden') {
            cardEl.style.visibility = 'hidden';
          }
          continue;
        }

        if (cardEl.style.visibility === 'hidden') {
          cardEl.style.visibility = '';
        }

        const style = computeCardStyle(variant, offset, i, animConfig);
        cardEl.style.transform = style.transform;
        cardEl.style.opacity = style.opacity.toString();
        cardEl.style.filter = style.filter;
        cardEl.style.clipPath = style.clip;
      }

      if (progressBarRef.current && totalCards > 1) {
        const fill = clamp(progress / (totalCards - 1), 0, 1);
        progressBarRef.current.style.transform = `scaleX(${fill.toFixed(4)})`;
      }

      const activeIdx = clamp(Math.round(progress), 0, totalCards - 1);
      if (activeIdx !== lastReportedIndexRef.current) {
        lastReportedIndexRef.current = activeIdx;
        setActiveIndex(activeIdx);
        onIndexChangeRef.current?.(activeIdx);
      }
    },
    [totalCards, depth, variant, animConfig]
  );

  const calculateTargetProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section || totalCards < 1) return 0;

    const win = section.ownerDocument.defaultView;
    const viewHeight = win ? win.innerHeight : 0;
    const rect = section.getBoundingClientRect();
    const scrollableDistance = rect.height - viewHeight;

    if (scrollableDistance <= 0) return 0;
    return clamp(-rect.top / scrollableDistance, 0, 1) * (totalCards - 1);
  }, [totalCards]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const doc = section.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;

    const damp = reducedMotion ? 0 : clamp(smooth, 0, 0.95);

    const step = (now: number) => {
      const prevTime = lastTimeRef.current || now;
      const dt = Math.min(0.05, Math.max(0, (now - prevTime) / 1000));
      lastTimeRef.current = now;

      const targetProgress = calculateTargetProgress();
      const current = currentScrollProgressRef.current;
      const next =
        current + (targetProgress - current) * (damp > 0 ? 1 - Math.pow(1 - damp, 60 * dt) : 1);

      currentScrollProgressRef.current = next;
      applyFrameTransforms(next);

      if (Math.abs(targetProgress - next) > 0.0004) {
        animFrameIdRef.current = win.requestAnimationFrame(step);
      } else {
        currentScrollProgressRef.current = targetProgress;
        applyFrameTransforms(targetProgress);
        isAnimatingRef.current = false;
      }
    };

    const handleScrollOrResize = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        lastTimeRef.current = 0;
        animFrameIdRef.current = win.requestAnimationFrame(step);
      }
    };

    currentScrollProgressRef.current = calculateTargetProgress();
    applyFrameTransforms(currentScrollProgressRef.current);

    win.addEventListener('scroll', handleScrollOrResize, { passive: true });
    doc.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    win.addEventListener('resize', handleScrollOrResize);

    const resizeObserver = new ResizeObserver(handleScrollOrResize);
    resizeObserver.observe(section);

    return () => {
      win.cancelAnimationFrame(animFrameIdRef.current);
      isAnimatingRef.current = false;
      win.removeEventListener('scroll', handleScrollOrResize);
      doc.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      win.removeEventListener('resize', handleScrollOrResize);
      resizeObserver.disconnect();
    };
  }, [calculateTargetProgress, applyFrameTransforms, smooth, reducedMotion]);

  const totalScrollHeightVh = 100 + Math.max(0, totalCards - 1) * Math.max(0.3, scrollLength) * 100;

  return (
    <section
      ref={sectionRef}
      aria-label="Scrolling card stack"
      className={cn('relative w-full', className)}
      style={{ height: `${totalScrollHeightVh}vh` }}
    >
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-8"
        style={{ perspective: `${Math.max(200, perspective)}px` }}
      >
        <div
          className="relative w-full"
          style={{
            maxWidth: `${Math.max(200, cardWidth)}px`,
            height: `${100 * clamp(cardHeight, 0.2, 0.95)}vh`,
          }}
        >
          {cardList.map((card, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity]"
              style={{ zIndex: idx }}
            >
              {customCards.length > 0 ? (
                (card as React.ReactNode)
              ) : (
                <DefaultCardLayout
                  item={card as ScrollStackItem}
                  index={idx}
                  total={totalCards}
                  radius={animConfig.radius}
                />
              )}
            </div>
          ))}
        </div>

        {/* Floating progress and counter indicator */}
        {(showProgress || showCounter) && totalCards > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 px-6 sm:bottom-8">
            {showProgress && (
              <span className="relative h-1 w-28 overflow-hidden rounded-full bg-slate-300/60 sm:w-44">
                <span
                  ref={progressBarRef}
                  className="absolute inset-0 origin-left rounded-full bg-[#9F3E07]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            )}
            {showCounter && (
              <span className="text-xs font-mono font-bold tracking-widest text-[#9F3E07] bg-white/90 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function DefaultCardLayout({
  item,
  index,
  total,
  radius,
}: {
  item: ScrollStackItem;
  index: number;
  total: number;
  radius: number;
}) {
  return (
    <article
      className="relative flex h-full w-full flex-col justify-between overflow-hidden border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)] transition-all"
      style={{
        borderRadius: `${radius}px`,
        borderLeft: item.accent ? `5px solid ${item.accent}` : undefined,
      }}
    >
      {/* Top row with icon & index badge */}
      <div className="flex items-center justify-between">
        {item.icon && (
          <div
            className="p-3.5 rounded-xl w-fit shadow-2xs transition-colors"
            style={
              item.accent
                ? { color: item.accent, backgroundColor: `${item.accent}18` }
                : { color: '#9F3E07', backgroundColor: '#fff7ed' }
            }
          >
            {item.icon}
          </div>
        )}
        <span className="text-xs font-mono font-semibold tracking-wider text-slate-400">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Main card body */}
      <div className="space-y-3 sm:space-y-4">
        {item.eyebrow && (
          <span
            className="text-xs font-mono font-semibold uppercase tracking-widest text-[#9F3E07]"
            style={item.accent ? { color: item.accent } : undefined}
          >
            {item.eyebrow}
          </span>
        )}
        {item.title && (
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {item.title}
          </h3>
        )}
        {item.body && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {item.body}
          </p>
        )}
      </div>

      {/* Tags or metadata chips */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {item.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default ScrollStack;
