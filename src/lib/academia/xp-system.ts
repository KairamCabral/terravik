// src/lib/academia/xp-system.ts

import { Level } from './types';

export const XP_CONFIG = {
  actions: {
    completarLicao: 50,
    completarQuiz100: 100,    // 100% acerto
    completarQuiz80: 75,      // 80%+ acerto
    completarQuiz60: 50,      // 60%+ acerto
    completarCurso: 500,
    primeiraLicaoDoDia: 25,
    manterStreak: 30,
    conquistaDesbloqueada: 200,
  },
  
  levels: [
    { level: 1, name: 'Semente', minXP: 0, maxXP: 100, icon: '🌱' },
    { level: 2, name: 'Broto', minXP: 100, maxXP: 300, icon: '🌿' },
    { level: 3, name: 'Jardineiro Iniciante', minXP: 300, maxXP: 600, icon: '🪴' },
    { level: 4, name: 'Jardineiro', minXP: 600, maxXP: 1000, icon: '🌳' },
    { level: 5, name: 'Jardineiro Experiente', minXP: 1000, maxXP: 1500, icon: '🌲' },
    { level: 6, name: 'Mestre Jardineiro', minXP: 1500, maxXP: 2500, icon: '🏡' },
    { level: 7, name: 'Especialista', minXP: 2500, maxXP: 4000, icon: '🏆' },
    { level: 8, name: 'Guru do Jardim', minXP: 4000, maxXP: 6000, icon: '👑' },
    { level: 9, name: 'Lenda Verde', minXP: 6000, maxXP: 10000, icon: '⭐' },
    { level: 10, name: 'Mestre Supremo', minXP: 10000, maxXP: Infinity, icon: '💎' },
  ] as Level[],
};

export function calculateLevel(totalXP: number): Level {
  return XP_CONFIG.levels.find(l => totalXP >= l.minXP && totalXP < l.maxXP) 
    || XP_CONFIG.levels[XP_CONFIG.levels.length - 1];
}

export function calculateProgress(totalXP: number): number {
  const level = calculateLevel(totalXP);
  const xpInLevel = totalXP - level.minXP;
  const xpNeeded = level.maxXP - level.minXP;
  
  if (level.maxXP === Infinity) return 100;
  
  return Math.min((xpInLevel / xpNeeded) * 100, 100);
}

export function getXPForNextLevel(totalXP: number): number {
  const level = calculateLevel(totalXP);
  if (level.maxXP === Infinity) return 0;
  return level.maxXP - totalXP;
}

export function calculateQuizXP(score: number): number {
  if (score === 100) return XP_CONFIG.actions.completarQuiz100;
  if (score >= 80) return XP_CONFIG.actions.completarQuiz80;
  if (score >= 60) return XP_CONFIG.actions.completarQuiz60;
  return 0;
}
