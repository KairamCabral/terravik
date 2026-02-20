'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProgress, Achievement } from '@/lib/academia/types';
import { ACHIEVEMENTS, checkAchievement } from '@/lib/academia/achievements';
import { calculateLevel, XP_CONFIG } from '@/lib/academia/xp-system';
import {
  getProgress,
  saveProgress,
  updateStreak,
  addXP,
  completeLesson as completeLocalLesson,
  completeCourse,
  unlockAchievement,
  resetProgress,
} from '@/lib/academia/storage';
import { useAuth } from '@/components/auth/AuthProvider';
import { markLessonComplete, getUserAllProgress } from '@/lib/academia/api';

interface AcademiaContextType {
  progress: UserProgress;
  isLessonCompleted: (lessonId: string) => boolean;
  isCourseCompleted: (courseId: string) => boolean;
  hasAchievement: (achievementId: string) => boolean;
  completeLesson: (lessonId: string, courseId: string) => { newAchievements: Achievement[]; xpGained: number };
  getCourseProgress: (courseId: string, totalLessons?: number) => { completed: number; total: number; percentage: number };
  resetAllProgress: () => void;
  loading: boolean;
}

const AcademiaContext = createContext<AcademiaContextType | undefined>(undefined);

export function AcademiaProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(getProgress);
  const [loading, setLoading] = useState(true);
  const [dbLessonIds, setDbLessonIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Carregar progresso: localStorage + Supabase (se logado)
  useEffect(() => {
    const localProgress = getProgress();
    setProgress(localProgress);

    if (user) {
      getUserAllProgress(user.id).then((dbProgress) => {
        if (dbProgress.length > 0) {
          const completedFromDb = dbProgress
            .filter((p) => p.completed_at)
            .map((p) => p.lesson_id);
          setDbLessonIds(new Set(completedFromDb));

          // Merge DB progress into local
          const merged = { ...localProgress };
          for (const id of completedFromDb) {
            if (!merged.lessonsCompleted.includes(id)) {
              merged.lessonsCompleted.push(id);
            }
          }
          const totalDbXP = dbProgress.reduce((acc: number, p: any) => acc + (p.xp_earned ?? 0), 0);
          if (totalDbXP > merged.totalXP) {
            merged.totalXP = totalDbXP;
          }
          setProgress(merged);
          saveProgress(merged);
        }
      }).catch(() => {});
    }

    setLoading(false);
  }, [user]);

  // Salvar progresso localmente
  useEffect(() => {
    if (!loading) {
      saveProgress(progress);
    }
  }, [progress, loading]);

  const checkAndUnlockAchievements = useCallback((newProgress: UserProgress): Achievement[] => {
    const unlockedAchievements: Achievement[] = [];
    for (const achievement of ACHIEVEMENTS) {
      if (newProgress.achievements.includes(achievement.id)) continue;
      if (checkAchievement(achievement, newProgress)) {
        unlockedAchievements.push(achievement);
        newProgress = unlockAchievement(newProgress, achievement.id);
        newProgress = addXP(newProgress, achievement.xpReward);
      }
    }
    return unlockedAchievements;
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string) =>
      progress.lessonsCompleted.includes(lessonId) || dbLessonIds.has(lessonId),
    [progress.lessonsCompleted, dbLessonIds]
  );

  const isCourseCompleted = useCallback(
    (courseId: string) => progress.coursesCompleted.includes(courseId),
    [progress.coursesCompleted]
  );

  const hasAchievement = useCallback(
    (achievementId: string) => progress.achievements.includes(achievementId),
    [progress.achievements]
  );

  const handleCompleteLesson = useCallback(
    (lessonId: string, courseId: string) => {
      if (isLessonCompleted(lessonId)) {
        return { newAchievements: [] as Achievement[], xpGained: 0 };
      }

      let newProgress = { ...progress };
      newProgress = updateStreak(newProgress);

      const baseXP = 50;
      let totalXP = baseXP;

      if (newProgress.lessonsCompletedToday === 0) {
        totalXP += XP_CONFIG.actions.primeiraLicaoDoDia;
      }
      if (newProgress.currentStreak > 1) {
        totalXP += XP_CONFIG.actions.manterStreak;
      }

      newProgress = completeLocalLesson(newProgress, lessonId);
      newProgress = addXP(newProgress, totalXP);

      const newAchievements = checkAndUnlockAchievements(newProgress);
      setProgress(newProgress);

      // Sync to Supabase if logged in
      if (user) {
        markLessonComplete(user.id, courseId, lessonId, totalXP).catch(() => {});
        setDbLessonIds((prev) => new Set(prev).add(lessonId));
      }

      return { newAchievements, xpGained: totalXP };
    },
    [progress, isLessonCompleted, checkAndUnlockAchievements, user]
  );

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons?: number) => {
      const total = totalLessons ?? 0;
      if (total === 0) return { completed: 0, total: 0, percentage: 0 };

      // We don't have course-lesson mapping here easily, so we rely on total being passed
      const completed = progress.lessonsCompleted.filter((id) => {
        // For now, count all completed lessons
        return true;
      }).length;

      // This is a simplified version — the real count comes from the course page
      return { completed: Math.min(completed, total), total, percentage: total > 0 ? Math.round((Math.min(completed, total) / total) * 100) : 0 };
    },
    [progress.lessonsCompleted]
  );

  const handleResetProgress = useCallback(() => {
    resetProgress();
    setProgress(getProgress());
    setDbLessonIds(new Set());
  }, []);

  const value: AcademiaContextType = {
    progress,
    isLessonCompleted,
    isCourseCompleted,
    hasAchievement,
    completeLesson: handleCompleteLesson,
    getCourseProgress,
    resetAllProgress: handleResetProgress,
    loading,
  };

  return <AcademiaContext.Provider value={value}>{children}</AcademiaContext.Provider>;
}

export function useAcademia() {
  const context = useContext(AcademiaContext);
  if (context === undefined) {
    throw new Error('useAcademia deve ser usado dentro de um AcademiaProvider');
  }
  return context;
}
