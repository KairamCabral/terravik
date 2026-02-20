// src/hooks/useProgress.ts

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export function useProgress() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const recordLessonStart = useCallback(async (courseId: string, lessonId: string) => {
    if (!user) return;

    const supabase = createClient();

    // Verificar se já existe progresso para esta lição
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (!existing) {
      await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          started_at: new Date().toISOString(),
        });
    }
  }, [user]);

  const recordLessonComplete = useCallback(async (
    courseId: string,
    lessonId: string,
    xpReward: number,
    quizScore?: number
  ) => {
    if (!user) return;
    setIsLoading(true);

    const supabase = createClient();

    try {
      // Verificar se já existe progresso
      const { data: existing } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existing) {
        // Atualizar progresso existente
        const { error } = await supabase
          .from('user_progress')
          .update({
            completed_at: new Date().toISOString(),
            quiz_score: quizScore ?? null,
            xp_earned: xpReward,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Criar novo progresso completo
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            quiz_score: quizScore ?? null,
            xp_earned: xpReward,
          });

        if (error) throw error;
      }

      // Verificar conquistas
      await checkAchievements();

      return { success: true };
    } catch (error) {
      console.error('Error recording progress:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getUserProgress = useCallback(async () => {
    if (!user) return null;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        course:courses(*),
        lesson:lessons(*)
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  }, [user]);

  const checkAchievements = useCallback(async () => {
    if (!user) return;

    const supabase = createClient();

    // Buscar estatísticas do usuário
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, quiz_score')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null);

    const lessonsCompleted = progress?.length || 0;
    const perfectQuizzes = progress?.filter(p => p.quiz_score === 100).length || 0;

    // Buscar achievements não desbloqueados
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true);

    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id);

    const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id));

    // Verificar cada achievement
    for (const achievement of achievements || []) {
      if (unlockedIds.has(achievement.id)) continue;

      const condition = achievement.unlock_condition as Record<string, unknown> | null;
      if (!condition) continue;

      let shouldUnlock = false;

      switch (condition.type) {
        case 'lessons_completed':
          shouldUnlock = lessonsCompleted >= (condition.count as number);
          break;
        case 'quiz_perfect':
          shouldUnlock = perfectQuizzes >= (condition.count as number);
          break;
      }

      if (shouldUnlock) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
          });

        // Adicionar XP via RPC
        if (achievement.xp_reward) {
          await supabase.rpc('add_user_xp', {
            p_user_id: user.id,
            p_xp_amount: achievement.xp_reward,
          });
        }
      }
    }
  }, [user]);

  return {
    isLoading,
    recordLessonStart,
    recordLessonComplete,
    getUserProgress,
  };
}
