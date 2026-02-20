'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, BookOpen, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'

/**
 * Meu Progresso nos Cursos
 * DONO: Supabase (100% Terravik)
 */

interface CourseProgress {
  id: string
  title: string
  description: string | null
  slug: string
  thumbnail_url: string | null
  totalLessons: number
  completedLessons: number
}

export default function AcademiaPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadProgress = async () => {
      const supabase = createClient()

      // Buscar cursos publicados com contagem de lições (thumbnail_url via metadata)
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          id, title, description, slug, metadata,
          lessons(id)
        `)
        .eq('is_published', true)
        .order('"order"', { ascending: true })

      if (!coursesData) {
        setIsLoading(false)
        return
      }

      // Buscar progresso do usuário
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('course_id, lesson_id, completed_at')
        .eq('user_id', user.id)

      const completedMap = new Map<string, Set<string>>()
      progressData?.forEach((p) => {
        if (p.completed_at) {
          const set = completedMap.get(p.course_id) || new Set()
          set.add(p.lesson_id)
          completedMap.set(p.course_id, set)
        }
      })

      const mapped: CourseProgress[] = coursesData.map((course) => {
        const lessons = (course.lessons as Array<{ id: string }>) || []
        const completed = completedMap.get(course.id)
        const metadata = course.metadata as Record<string, unknown> | null
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          slug: course.slug,
          thumbnail_url: (metadata?.thumbnail_url as string | undefined) ?? null,
          totalLessons: lessons.length,
          completedLessons: completed ? completed.size : 0,
        }
      })

      setCourses(mapped)
      setIsLoading(false)
    }

    loadProgress()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  const totalLessons = courses.reduce((a, c) => a + c.totalLessons, 0)
  const totalCompleted = courses.reduce((a, c) => a + c.completedLessons, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Meus Cursos</h1>
        <p className="text-neutral-500">Seu progresso nos cursos sobre gramados</p>
      </div>

      {/* Overall stats */}
      <div className="bg-white rounded-xl border border-neutral-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700">
            Progresso geral
          </span>
          <span className="text-sm text-neutral-500">
            {totalCompleted} de {totalLessons} lições
          </span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest rounded-full transition-all"
            style={{ width: totalLessons > 0 ? `${(totalCompleted / totalLessons) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Courses */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
          <GraduationCap className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-2">Nenhum curso disponível no momento</p>
          <Link
            href="/academia"
            className="text-sm text-forest font-medium hover:underline"
          >
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            const pct = course.totalLessons > 0
              ? Math.round((course.completedLessons / course.totalLessons) * 100)
              : 0
            const isComplete = pct === 100 && course.totalLessons > 0

            return (
              <Link
                key={course.id}
                href={`/academia/${course.slug}`}
                className="group block bg-white rounded-xl border border-neutral-100 p-5 hover:border-forest/20 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isComplete ? 'bg-emerald-100' : 'bg-forest/5'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-forest" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-neutral-900 group-hover:text-forest transition-colors truncate">
                        {course.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-forest flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    {course.description && (
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                        {course.description}
                      </p>
                    )}

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-500">
                          {course.completedLessons} de {course.totalLessons} lições
                        </span>
                        <span className={`font-medium ${isComplete ? 'text-emerald-600' : 'text-neutral-600'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-forest'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
