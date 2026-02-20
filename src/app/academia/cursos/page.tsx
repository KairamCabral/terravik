import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COURSES } from '@/lib/academia/courses';
import { CourseCard, XPBar, StreakCounter } from '@/components/academia';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Cursos - Terravik',
  description: 'Explore todos os cursos disponíveis sobre cuidados com gramados.',
};

export default function CursosPage() {
  const iniciante = COURSES.filter(c => c.difficulty === 'iniciante');
  const intermediario = COURSES.filter(c => c.difficulty === 'intermediario');
  const avancado = COURSES.filter(c => c.difficulty === 'avancado');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/academia">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Todos os Cursos
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <StreakCounter />
              <div className="w-px h-8 bg-neutral-200" />
              <XPBar />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Iniciante */}
        {iniciante.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Iniciante
              </h2>
              <span className="text-sm text-neutral-500">
                Perfeito para começar
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {iniciante.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Intermediário */}
        {intermediario.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Intermediário
              </h2>
              <span className="text-sm text-neutral-500">
                Aprofunde seus conhecimentos
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediario.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Avançado */}
        {avancado.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Avançado
              </h2>
              <span className="text-sm text-neutral-500">
                Para especialistas
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {avancado.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
