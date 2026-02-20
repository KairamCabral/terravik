'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Play,
  ArrowRight,
  Clock,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { getPublishedCoursesWithLessons } from '@/lib/academia/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAcademia } from '@/contexts/AcademiaContext';
import {
  CourseCard,
  CourseCarousel,
  XPBar,
  StreakCounter,
} from '@/components/academia';
import type { Course } from '@/lib/academia/types';

const DEFAULT_HERO_COLOR = '#1B4332';

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

export default function AcademiaPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isLessonCompleted } = useAcademia();

  useEffect(() => {
    let cancelled = false;
    getPublishedCoursesWithLessons().then((data) => {
      if (!cancelled) {
        setCourses(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredCourse = courses.find((c) => c.is_featured) ?? courses[0];
  const featuredCourses = courses.filter((c) => c.is_featured);
  const beginnerCourses = courses.filter((c) => c.difficulty === 'beginner');
  const intermediateCourses = courses.filter(
    (c) => c.difficulty === 'intermediate'
  );
  const advancedCourses = courses.filter((c) => c.difficulty === 'advanced');

  const continueWatching = courses.filter((c) => {
    if (!user) return false;
    const { percentage } = getCourseProgress(c, isLessonCompleted);
    return percentage > 0 && percentage < 100;
  });

  const totalLessons = courses.reduce(
    (acc, c) => acc + (c.lessons?.length ?? c.lessons_count ?? 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white/60">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Video background with dark overlay */}
      <section
        className="relative min-h-[70vh] overflow-hidden bg-[#0a0a0a]"
      >
        {/* Background video em loop (sempre visível) */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-25"
          >
            <source src="/video/trailler-terravik.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Course thumbnail landscape como layer adicional (se disponível) */}
        {featuredCourse?.thumbnail_landscape && (
          <div className="absolute inset-0">
            <Image
              src={featuredCourse.thumbnail_landscape}
              alt=""
              fill
              className="object-cover opacity-15"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Gradient overlays para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-5 border-b border-white/10">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              Voltar ao site
            </Link>
            <div className="flex items-center gap-4">
              <StreakCounter />
              <XPBar />
            </div>
          </div>

          <div className="py-16 lg:py-24 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
                100% gratuito
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
              {featuredCourse ? (
                <>
                  {featuredCourse.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-200">
                    {featuredCourse.subtitle ?? 'Aprenda no seu ritmo'}
                  </span>
                </>
              ) : (
                <>
                  Academia Terravik
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-200">
                    Aprenda a cuidar do seu gramado
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              {featuredCourse?.description ??
                'Cursos práticos e diretos ao ponto. Sem enrolação, sem custo.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-10">
              {(featuredCourse?.lessons_count ?? featuredCourse?.lessons?.length ?? 0) > 0 && (
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {featuredCourse?.lessons_count ?? featuredCourse?.lessons?.length}{' '}
                  lições
                </span>
              )}
              {(featuredCourse?.estimated_duration_min ?? 0) > 0 && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {featuredCourse?.estimated_duration_min} min
                </span>
              )}
            </div>

            {featuredCourse && (
              <Link href={`/academia/cursos/${featuredCourse.slug}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-semibold hover:bg-white/90 transition-colors shadow-xl"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Começar
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content sections — light background */}
      <div className="bg-white -mt-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
          {/* Continue Assistindo — only when logged in + has progress */}
          {user && continueWatching.length > 0 && (
            <CourseCarousel title="Continue Assistindo">
              {continueWatching.map((course) => {
                const { percentage } = getCourseProgress(course, isLessonCompleted);
                return (
                  <div key={course.id} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                    <CourseCard
                      course={course}
                      variant="landscape"
                      progress={percentage}
                    />
                  </div>
                );
              })}
            </CourseCarousel>
          )}

          {/* Recomendados — featured courses */}
          {featuredCourses.length > 0 && (
            <CourseCarousel title="Recomendados">
              {featuredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px]"
                >
                  <CourseCard course={course} variant="landscape" />
                </div>
              ))}
            </CourseCarousel>
          )}

          {/* Para Iniciantes */}
          {beginnerCourses.length > 0 && (
            <CourseCarousel title="Para Iniciantes">
              {beginnerCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[160px] sm:w-[180px]"
                >
                  <CourseCard course={course} variant="poster" />
                </div>
              ))}
            </CourseCarousel>
          )}

          {/* Nível Intermediário */}
          {intermediateCourses.length > 0 && (
            <CourseCarousel title="Nível Intermediário">
              {intermediateCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[160px] sm:w-[180px]"
                >
                  <CourseCard course={course} variant="poster" />
                </div>
              ))}
            </CourseCarousel>
          )}

          {/* Avançado */}
          {advancedCourses.length > 0 && (
            <CourseCarousel title="Avançado">
              {advancedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[160px] sm:w-[180px]"
                >
                  <CourseCard course={course} variant="poster" />
                </div>
              ))}
            </CourseCarousel>
          )}
        </div>

        {/* Footer CTA */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B4332]/10 mb-6">
              <Zap className="h-7 w-7 text-[#1B4332]" />
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Pronto para começar?
            </h2>
            <div className="flex items-center justify-center gap-8 mb-8 text-neutral-600">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#1B4332]" />
                <strong className="text-neutral-900">{courses.length}</strong>{' '}
                cursos
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1B4332]" />
                <strong className="text-neutral-900">{totalLessons}</strong>{' '}
                lições
              </span>
            </div>
            <p className="text-neutral-500 text-lg mb-8 max-w-lg mx-auto">
              Escolha um curso e comece sua jornada. Sem cadastro, sem custo.
            </p>
            <Link
              href="/academia/cursos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#0f2e1f] transition-colors shadow-lg"
            >
              Explorar todos os cursos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
