'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CourseCarouselProps {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

export function CourseCarousel({ title, viewAllHref, children }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    );
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="group/carousel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Ver todos
          </Link>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={cn(
            'flex gap-4 overflow-x-auto overflow-y-hidden',
            'scroll-smooth scrollbar-hide',
            'snap-x snap-mandatory',
            '[&>*]:snap-start',
            'pb-2 -mx-1 px-1'
          )}
          style={{ scrollBehavior: 'smooth' }}
        >
          {children}
        </div>

        {/* Navigation arrows - desktop only, visible on hover */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between max-md:hidden">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'pointer-events-auto absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full',
              'bg-black/60 text-white shadow-lg backdrop-blur-sm',
              'transition-opacity hover:bg-black/80',
              'disabled:opacity-0 disabled:pointer-events-none',
              'opacity-0 group-hover/carousel:opacity-100'
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'pointer-events-auto absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full',
              'bg-black/60 text-white shadow-lg backdrop-blur-sm',
              'transition-opacity hover:bg-black/80',
              'disabled:opacity-0 disabled:pointer-events-none',
              'opacity-0 group-hover/carousel:opacity-100'
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
