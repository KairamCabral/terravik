'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Play, BookOpen } from 'lucide-react';
import type { Course, Difficulty } from '@/lib/academia/types';
import type { LegacyCourse } from '@/lib/academia/courses';
import { DIFFICULTY_CONFIG } from '@/lib/academia/types';
import { cn } from '@/lib/utils/cn';

const DEFAULT_COLOR = '#1B4332';

interface CourseCardProps {
  course: Course | LegacyCourse;
  variant?: 'poster' | 'landscape';
  progress?: number;
  href?: string;
}

export function CourseCard({
  course,
  variant = 'poster',
  progress,
  href,
}: CourseCardProps) {
  const linkHref = href ?? `/academia/cursos/${course.slug}`;
  const accentColor = typeof course.color === 'string'
    ? course.color
    : (course as LegacyCourse).color?.primary ?? DEFAULT_COLOR;
  const lessonsCount = ('lessons_count' in course ? course.lessons_count : undefined)
    ?? course.lessons?.length ?? 0;
  const difficultyConfig = course.difficulty
    ? DIFFICULTY_CONFIG[course.difficulty as keyof typeof DIFFICULTY_CONFIG]
    : null;

  // Selecionar thumbnail baseado no variant (garantir string para next/image)
  const rawThumb = 'thumbnail_landscape' in course
    ? (variant === 'landscape' ? course.thumbnail_landscape : course.thumbnail_portrait)
    : ('thumbnail_url' in course ? course.thumbnail_url : null);
  const thumbnailUrl = typeof rawThumb === 'string' && rawThumb ? rawThumb : null;

  return (
    <Link href={linkHref} className="block group">
      <motion.article
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'relative overflow-hidden rounded-lg',
          'ring-2 ring-transparent transition-all duration-300 group-hover:ring-[var(--accent)]',
          variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video'
        )}
        style={{
          ['--accent' as string]: accentColor,
          ['--tw-ring-color' as string]: accentColor,
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ backgroundColor: accentColor }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* Badges row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {difficultyConfig && (
              <span
                className={cn(
                  'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  difficultyConfig.bgColor,
                  difficultyConfig.color
                )}
              >
                {difficultyConfig.label}
              </span>
            )}
            {lessonsCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/80">
                <BookOpen className="h-3 w-3" />
                {lessonsCount} {lessonsCount === 1 ? 'lição' : 'lições'}
              </span>
            )}
          </div>

          <h3 className="font-heading text-lg font-bold text-white line-clamp-2">
            {course.title}
          </h3>

          {/* Hover: show description + play button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            className="mt-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            {course.description && (
              <p className="line-clamp-2 text-sm text-white/80 mb-3">
                {course.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                style={{ color: accentColor }}
              >
                <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
              </span>
              Assistir
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        )}
      </motion.article>
    </Link>
  );
}
