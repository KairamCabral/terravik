'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getLessonWithMaterials } from '@/lib/academia/api';
import { markLessonComplete } from '@/lib/academia/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAcademia } from '@/contexts/AcademiaContext';
import {
  VideoPlayer,
  EpisodeList,
  MaterialsList,
  XPBar,
} from '@/components/academia';
import { Button } from '@/components/ui/Button';
import type { Lesson, LessonMaterial, ContentSection } from '@/lib/academia/types';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params?.slug as string;
  const lessonSlug = params?.lessonSlug as string;

  const [data, setData] = useState<{
    course: { id: string; slug: string; title: string; icon?: string | null; lessons?: Lesson[] };
    lesson: Lesson;
    materials: LessonMaterial[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [showXPCelebration, setShowXPCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const { user } = useAuth();
  const { isLessonCompleted, completeLesson } = useAcademia();

  useEffect(() => {
    if (!courseSlug || !lessonSlug) return;
    let cancelled = false;
    getLessonWithMaterials(courseSlug, lessonSlug).then((result) => {
      if (!cancelled && result) {
        setData(result);
      }
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonSlug]);

  const handleMarkComplete = async () => {
    if (!data) return;
    const { course, lesson } = data;
    if (isLessonCompleted(lesson.id)) return;

    setMarkingComplete(true);

    if (user) {
      const xp = lesson.xp_reward ?? 50;
      await markLessonComplete(user.id, course.id, lesson.id, xp);
      setXpEarned(xp);
      setShowXPCelebration(true);
      completeLesson(lesson.id, course.id);
    } else {
      const result = completeLesson(lesson.id, course.id);
      setXpEarned(result.xpGained);
      setShowXPCelebration(true);
    }

    setMarkingComplete(false);

    setTimeout(() => {
      setShowXPCelebration(false);
      const lessons = [...(course.lessons ?? [])].sort(
        (a, b) => a.order - b.order
      );
      const idx = lessons.findIndex((l) => l.slug === lessonSlug);
      const next = lessons[idx + 1];
      if (next) {
        router.push(`/academia/cursos/${courseSlug}/${next.slug}`);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Carregando...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Lição não encontrada
          </h1>
          <Link href="/academia">
            <Button>Voltar para Academia</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { course, lesson, materials } = data;
  const sortedLessons = [...(course.lessons ?? [])].sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = sortedLessons[currentIndex - 1];
  const nextLesson = sortedLessons[currentIndex + 1];
  const completedLessonIds = sortedLessons
    .filter((l) => isLessonCompleted(l.id))
    .map((l) => l.id);
  const isCompleted = isLessonCompleted(lesson.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/academia/cursos/${courseSlug}`}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {course.title}
            </Link>
            <XPBar />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Video */}
            <div className="mb-6">
              <VideoPlayer
                videoUrl={lesson.video_url}
                thumbnailUrl={lesson.thumbnail_url}
                title={lesson.title}
                autoPlay={false}
              />
            </div>

            {/* Lesson title & description */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
                  {lesson.title}
                </h1>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Concluída
                  </span>
                )}
              </div>
              {lesson.description && (
                <p className="text-neutral-600">{lesson.description}</p>
              )}
            </div>

            {/* Mark complete button */}
            {!isCompleted && (
              <div className="mb-8">
                <Button
                  onClick={handleMarkComplete}
                  disabled={markingComplete}
                  size="lg"
                  className="gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {markingComplete ? 'Marcando...' : 'Marcar como concluída'}
                </Button>
              </div>
            )}

            {/* XP Celebration toast */}
            <AnimatePresence>
              {showXPCelebration && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                    +{xpEarned}
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">
                      XP ganho!
                    </div>
                    <div className="text-sm text-emerald-700">
                      Indo para a próxima lição...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lesson content sections */}
            {lesson.content?.sections && lesson.content.sections.length > 0 && (
              <div className="prose prose-lg max-w-none mb-8">
                {lesson.content.sections.map((section: ContentSection, idx: number) => (
                  <div key={idx} className="mb-6">
                    {section.type === 'text' && typeof section.content === 'string' && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-heading font-bold text-neutral-900 mb-3 mt-6">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-heading font-bold text-neutral-900 mb-2 mt-4">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-neutral-700 leading-relaxed mb-4">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-6 space-y-2 mb-4">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-6 space-y-2 mb-4">
                                {children}
                              </ol>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold text-neutral-900">
                                {children}
                              </strong>
                            ),
                            code: ({ children }) => (
                              <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {section.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {section.type === 'callout' && section.content && (
                      <div
                        className={`p-5 rounded-xl border-2 ${
                          (section.content as any).type === 'tip'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {(section.content as any).type === 'tip' ? '💡' : '⚠️'}
                          </span>
                          <div>
                            <h4
                              className={`font-bold mb-1 ${
                                (section.content as any).type === 'tip'
                                  ? 'text-blue-900'
                                  : 'text-amber-900'
                              }`}
                            >
                              {(section.content as any).title}
                            </h4>
                            <p
                              className={
                                (section.content as any).type === 'tip'
                                  ? 'text-blue-800'
                                  : 'text-amber-800'
                              }
                            >
                              {(section.content as any).text}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Materials */}
            {materials.length > 0 && (
              <div className="mb-8">
                <MaterialsList materials={materials} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-neutral-200">
              {prevLesson ? (
                <Link href={`/academia/cursos/${courseSlug}/${prevLesson.slug}`}>
                  <Button variant="ghost" size="lg" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Lição anterior
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/academia/cursos/${courseSlug}/${nextLesson.slug}`}>
                  <Button size="lg" className="gap-2">
                    Próxima lição
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/academia/cursos/${courseSlug}`}>
                  <Button size="lg" className="gap-2">
                    Voltar ao curso
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar — Episode list */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-heading text-lg font-bold text-neutral-900 mb-4">
                Episódios
              </h3>
              <EpisodeList
                lessons={sortedLessons}
                courseSlug={courseSlug}
                currentLessonId={lesson.id}
                completedLessonIds={completedLessonIds}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
