'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Play } from 'lucide-react';
import type { Lesson } from '@/lib/academia/types';
import { cn } from '@/lib/utils/cn';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return min > 0 ? `${h}h ${min}min` : `${h}h`;
  }
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

interface EpisodeListProps {
  lessons: Lesson[];
  courseSlug: string;
  currentLessonId?: string;
  completedLessonIds?: string[];
}

export function EpisodeList({
  lessons,
  courseSlug,
  currentLessonId,
  completedLessonIds = [],
}: EpisodeListProps) {
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-1">
      {sortedLessons.map((lesson, index) => {
        const isCompleted = completedLessonIds.includes(lesson.id);
        const isCurrent = lesson.id === currentLessonId;
        const isNext =
          !currentLessonId &&
          !isCompleted &&
          (index === 0 || completedLessonIds.includes(sortedLessons[index - 1]?.id));

        return (
          <Link
            key={lesson.id}
            href={`/academia/cursos/${courseSlug}/${lesson.slug}`}
            className={cn(
              'group flex items-center gap-4 rounded-lg p-3 transition-colors',
              'hover:bg-neutral-100',
              isCurrent && 'bg-emerald-50 ring-1 ring-emerald-200'
            )}
          >
            {/* Order / status icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
              {isCompleted ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </div>
              ) : isCurrent || isNext ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </div>
              ) : (
                <span className="text-sm font-semibold text-neutral-400">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded bg-neutral-200">
              {lesson.thumbnail_url ? (
                <Image
                  src={lesson.thumbnail_url}
                  alt=""
                  width={96}
                  height={56}
                  className="h-full w-full object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-300">
                  <Play className="h-5 w-5 text-neutral-500" />
                </div>
              )}
            </div>

            {/* Title, duration, description */}
            <div className="min-w-0 flex-1">
              <h4
                className={cn(
                  'font-medium text-neutral-900 truncate',
                  (isCurrent || isNext) && 'text-emerald-700'
                )}
              >
                {lesson.title}
              </h4>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
                <span>{formatDuration(lesson.video_duration_sec)}</span>
                {lesson.description && (
                  <span className="truncate">{lesson.description}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
