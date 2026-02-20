'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy, Flame, BookOpen, Award, TrendingUp, Calendar } from 'lucide-react';
import { useAcademia } from '@/contexts/AcademiaContext';
import { calculateLevel, XP_CONFIG } from '@/lib/academia/xp-system';
import { ACHIEVEMENTS } from '@/lib/academia/achievements';
import { COURSES } from '@/lib/academia/courses';
import { XPBar, StreakCounter } from '@/components/academia';
import { Button } from '@/components/ui/Button';

export default function PerfilPage() {
  const { progress } = useAcademia();
  
  const level = calculateLevel(progress.totalXP);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => progress.achievements.includes(a.id));
  const completedCourses = COURSES.filter(c => progress.coursesCompleted.includes(c.id));

  const stats = [
    {
      icon: Trophy,
      label: 'XP Total',
      value: progress.totalXP.toLocaleString('pt-BR'),
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: BookOpen,
      label: 'Lições Completas',
      value: progress.lessonsCompleted.length,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Award,
      label: 'Cursos Completos',
      value: progress.coursesCompleted.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Flame,
      label: 'Streak Atual',
      value: `${progress.currentStreak} ${progress.currentStreak === 1 ? 'dia' : 'dias'}`,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: TrendingUp,
      label: 'Maior Streak',
      value: `${progress.longestStreak} ${progress.longestStreak === 1 ? 'dia' : 'dias'}`,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      icon: Trophy,
      label: 'Conquistas',
      value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

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
                  Academia
                </Button>
              </Link>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Meu Perfil
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Nível e XP */}
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl">
              {level.icon}
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-4xl font-bold mb-1">
                Nível {level.level}
              </h2>
              <p className="text-2xl text-white/90 mb-4">
                {level.name}
              </p>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ 
                    width: `${level.maxXP === Infinity ? 100 : ((progress.totalXP - level.minXP) / (level.maxXP - level.minXP)) * 100}%` 
                  }}
                />
              </div>
              <p className="text-sm text-white/80 mt-2">
                {level.maxXP === Infinity 
                  ? 'Nível Máximo Alcançado!' 
                  : `${progress.totalXP - level.minXP} / ${level.maxXP - level.minXP} XP`
                }
              </p>
            </div>
          </div>

          {/* Níveis restantes */}
          {level.level < XP_CONFIG.levels.length && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/80 mb-2">Próximos Níveis:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {XP_CONFIG.levels
                  .filter(l => l.level > level.level && l.level <= level.level + 3)
                  .map(nextLevel => (
                    <div 
                      key={nextLevel.level}
                      className="flex-shrink-0 bg-white/10 rounded-lg p-3 text-center min-w-[100px]"
                    >
                      <div className="text-3xl mb-1">{nextLevel.icon}</div>
                      <div className="text-xs font-semibold">Nível {nextLevel.level}</div>
                      <div className="text-xs text-white/70">{nextLevel.minXP} XP</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6">
            Estatísticas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neutral-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cursos Completos */}
        {completedCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6">
              Cursos Completados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCourses.map(course => (
                <div 
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{course.icon}</span>
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900 mb-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-2 py-1 rounded-full inline-flex">
                    <span>{course.badge.icon}</span>
                    <span className="font-semibold">{course.badge.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conquistas Recentes */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Conquistas Recentes
              </h2>
              <Link href="/academia/conquistas">
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {unlockedAchievements.slice(-8).reverse().map(achievement => (
                <div 
                  key={achievement.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200"
                >
                  <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                  <h3 className="font-bold text-sm text-neutral-900 text-center mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-neutral-600 text-center">
                    +{achievement.xpReward} XP
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações da Conta */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">
            Informações da Conta
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Membro desde</span>
              <span className="font-semibold text-neutral-900">
                {new Date(progress.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Última atividade</span>
              <span className="font-semibold text-neutral-900">
                {progress.lastActivityDate 
                  ? new Date(progress.lastActivityDate).toLocaleDateString('pt-BR')
                  : 'Nunca'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Quizzes perfeitos</span>
              <span className="font-semibold text-neutral-900">
                {progress.perfectQuizzes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
