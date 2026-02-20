'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Play,
  Trophy,
  Users,
  GraduationCap,
} from 'lucide-react';
import { getCourseBySlug } from '@/lib/academia/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAcademia } from '@/contexts/AcademiaContext';
import {
  EpisodeList,
  XPBar,
  StreakCounter,
  ProgressRing,
} from '@/components/academia';
import type { Course } from '@/lib/academia/types';
import { DIFFICULTY_CONFIG } from '@/lib/academia/types';
import { cn } from '@/lib/utils/cn';

const DEFAULT_COLOR = '#1B4332';

function getCourseProgress(
  course: Course,
  isLessonCompleted: (id: string) => boolean
) {
  const lessons = course.lessons ?? [];
  const completed = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const total = lessons.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isLessonCompleted, isCourseCompleted } = useAcademia();

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    getCourseBySlug(slug).then((data) => {
      if (!cancelled) {
        setCourse(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Carregando...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Curso não encontrado
          </h1>
          <Link
            href="/academia"
            className="inline-flex items-center gap-2 text-[#1B4332] font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Academia
          </Link>
        </div>
      </div>
    );
  }

  const { completed, total, percentage } = getCourseProgress(
    course,
    isLessonCompleted
  );
  const isCompleted = isCourseCompleted(course.id);
  const sortedLessons = [...(course.lessons ?? [])].sort(
    (a, b) => a.order - b.order
  );
  const nextLesson = sortedLessons.find((l) => !isLessonCompleted(l.id));
  const completedLessonIds = sortedLessons
    .filter((l) => isLessonCompleted(l.id))
    .map((l) => l.id);
  const accentColor = course.color ?? DEFAULT_COLOR;
  const difficultyConfig = course.difficulty
    ? DIFFICULTY_CONFIG[course.difficulty]
    : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/academia"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Academia
            </Link>
            <div className="flex items-center gap-4">
              <StreakCounter />
              <div className="w-px h-8 bg-neutral-200" />
              <XPBar />
            </div>
          </div>
        </div>
      </header>

      {/* Hero — Course info with gradient */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0a0a0a 0%, ${accentColor}60 50%, #0a0a0a 100%)`,
        }}
      >
        {(course.thumbnail_landscape || course.thumbnail_url) && (
          <div className="absolute inset-0">
            <Image
              src={course.thumbnail_landscape || course.thumbnail_url || ''}
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {course.icon && (
                  <span className="text-5xl">{course.icon}</span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">
                    <Trophy className="w-4 h-4" />
                    Curso Concluído
                  </span>
                )}
                {difficultyConfig && (
                  <span
                    className={cn(
                      'inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold',
                      difficultyConfig.bgColor,
                      difficultyConfig.color
                    )}
                  >
                    {difficultyConfig.label}
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xl text-white/90 mb-4">{course.subtitle}</p>
              )}
              {course.description && (
                <p className="text-white/80 mb-6 max-w-2xl">
                  {course.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-6">
                {(course.estimated_duration_min ?? 0) > 0 && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {course.estimated_duration_min} min
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {total} {total === 1 ? 'lição' : 'lições'}
                </span>
                {(course.enrolled_count ?? 0) > 0 && (
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {course.enrolled_count} alunos
                  </span>
                )}
              </div>

              {!isCompleted && nextLesson && (
                <Link href={`/academia/cursos/${course.slug}/${nextLesson.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 font-semibold hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <Play className="h-5 w-5" fill="currentColor" />
                    {completed === 0 ? 'Começar Curso' : 'Continuar'}
                  </motion.button>
                </Link>
              )}

              {isCompleted && (
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                  <Trophy className="w-8 h-8 text-amber-300" />
                  <div>
                    <div className="font-bold text-white">
                      Curso Completo!
                    </div>
                    {course.badge_title && (
                      <div className="text-sm text-white/80">
                        Badge: {course.badge_title}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress sidebar */}
            {total > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 lg:w-56 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white">Progresso</span>
                  <ProgressRing
                    progress={percentage}
                    size={56}
                    color="#ffffff"
                  />
                </div>
                <div className="space-y-2 text-sm text-white/90">
                  <div className="flex justify-between">
                    <span>Concluídas</span>
                    <span className="font-bold">{completed}/{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restantes</span>
                    <span className="font-bold">{total - completed}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Episode list */}
      {sortedLessons.length > 0 && (
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6">
              Conteúdo do Curso
            </h2>
            <EpisodeList
              lessons={sortedLessons}
              courseSlug={course.slug}
              currentLessonId={nextLesson?.id}
              completedLessonIds={completedLessonIds}
            />
          </div>
        </section>
      )}
    </div>
  );
}
