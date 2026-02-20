// src/lib/academia/storage.ts

import { UserProgress } from './types';

const STORAGE_KEY = 'terravik_academia_progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultProgress();
    
    const progress = JSON.parse(stored);
    
    // Resetar contador diário se mudou o dia
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = progress.lastActivityDate?.split('T')[0];
    
    if (lastActivity !== today) {
      progress.lessonsCompletedToday = 0;
    }
    
    return progress;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
}

export function getDefaultProgress(): UserProgress {
  return {
    totalXP: 0,
    lessonsCompleted: [],
    coursesCompleted: [],
    quizScores: {},
    perfectQuizzes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    achievements: [],
    lessonsCompletedToday: 0,
    createdAt: new Date().toISOString(),
  };
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = progress.lastActivityDate?.split('T')[0];
  
  if (!lastActivity) {
    return { 
      ...progress, 
      currentStreak: 1, 
      longestStreak: 1, 
      lastActivityDate: new Date().toISOString(),
    };
  }
  
  // Já estudou hoje
  if (lastActivity === today) {
    return progress;
  }
  
  const lastDate = new Date(lastActivity);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Estudou ontem (mantém streak)
  if (diffDays === 1) {
    const newStreak = progress.currentStreak + 1;
    return {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastActivityDate: new Date().toISOString(),
    };
  }
  
  // Quebrou o streak
  return { 
    ...progress, 
    currentStreak: 1, 
    lastActivityDate: new Date().toISOString(),
  };
}

export function addXP(progress: UserProgress, xp: number): UserProgress {
  return {
    ...progress,
    totalXP: progress.totalXP + xp,
  };
}

export function completeLesson(progress: UserProgress, lessonId: string): UserProgress {
  if (progress.lessonsCompleted.includes(lessonId)) {
    return progress;
  }
  
  return {
    ...progress,
    lessonsCompleted: [...progress.lessonsCompleted, lessonId],
    lessonsCompletedToday: progress.lessonsCompletedToday + 1,
  };
}

export function completeCourse(progress: UserProgress, courseId: string): UserProgress {
  if (progress.coursesCompleted.includes(courseId)) {
    return progress;
  }
  
  return {
    ...progress,
    coursesCompleted: [...progress.coursesCompleted, courseId],
  };
}

export function recordQuizScore(
  progress: UserProgress, 
  quizId: string, 
  score: number
): UserProgress {
  const newProgress = {
    ...progress,
    quizScores: {
      ...progress.quizScores,
      [quizId]: score,
    },
  };
  
  // Incrementar contador de quizzes perfeitos
  if (score === 100 && progress.quizScores[quizId] !== 100) {
    newProgress.perfectQuizzes = progress.perfectQuizzes + 1;
  }
  
  return newProgress;
}

export function unlockAchievement(progress: UserProgress, achievementId: string): UserProgress {
  if (progress.achievements.includes(achievementId)) {
    return progress;
  }
  
  return {
    ...progress,
    achievements: [...progress.achievements, achievementId],
  };
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
