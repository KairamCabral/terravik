'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Target, Calendar, Star } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/academia/achievements';
import { useAcademia } from '@/contexts/AcademiaContext';
import { AchievementCard, XPBar, StreakCounter } from '@/components/academia';
import { Button } from '@/components/ui/Button';

export default function ConquistasPage() {
  const { progress, hasAchievement } = useAcademia();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const unlockedCount = progress.achievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', name: 'Todas', icon: Trophy },
    { id: 'aprendizado', name: 'Aprendizado', icon: Target },
    { id: 'consistencia', name: 'Consistência', icon: Calendar },
    { id: 'maestria', name: 'Maestria', icon: Star },
    { id: 'especial', name: 'Especial', icon: Trophy },
  ];

  let filteredAchievements = ACHIEVEMENTS;

  // Filtrar por categoria
  if (categoryFilter !== 'all') {
    filteredAchievements = filteredAchievements.filter(a => a.category === categoryFilter);
  }

  // Filtrar por desbloqueado/bloqueado
  if (filter === 'unlocked') {
    filteredAchievements = filteredAchievements.filter(a => hasAchievement(a.id));
  } else if (filter === 'locked') {
    filteredAchievements = filteredAchievements.filter(a => !hasAchievement(a.id));
  }

  // Ordenar: desbloqueados primeiro
  filteredAchievements = filteredAchievements.sort((a, b) => {
    const aUnlocked = hasAchievement(a.id);
    const bUnlocked = hasAchievement(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

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
                Conquistas
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
        {/* Progresso Geral */}
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">
                {unlockedCount} de {totalCount} Conquistas
              </h2>
              <p className="text-white/90">
                Continue explorando para desbloquear todas!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-1">{percentage}%</div>
              <div className="text-sm text-white/80">Completo</div>
            </div>
          </div>
          
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          {/* Filtro de Status */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              Todas ({ACHIEVEMENTS.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unlocked'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'locked'
                  ? 'bg-neutral-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              Bloqueadas ({totalCount - unlockedCount})
            </button>
          </div>

          {/* Filtro de Categoria */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = ACHIEVEMENTS.filter(a => 
                category.id === 'all' || a.category === category.id
              ).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    categoryFilter === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Conquistas */}
        {filteredAchievements.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={hasAchievement(achievement.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2">
              Nenhuma conquista encontrada
            </h3>
            <p className="text-neutral-600">
              Tente ajustar os filtros para ver mais conquistas.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
            Continue Aprendendo!
          </h3>
          <p className="text-neutral-600 mb-6">
            Complete mais lições para desbloquear conquistas exclusivas.
          </p>
          <Link href="/academia/cursos">
            <Button variant="primary" size="lg">
              Ver Cursos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
