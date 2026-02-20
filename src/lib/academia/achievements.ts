// src/lib/academia/achievements.ts

import { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // APRENDIZADO
  {
    id: 'primeira-licao',
    name: 'Primeiro Passo',
    description: 'Complete sua primeira lição',
    icon: '👣',
    category: 'aprendizado',
    condition: { type: 'lessons_completed', value: 1 },
    xpReward: 100,
    rarity: 'comum',
  },
  {
    id: 'estudante-dedicado',
    name: 'Estudante Dedicado',
    description: 'Complete 10 lições',
    icon: '📚',
    category: 'aprendizado',
    condition: { type: 'lessons_completed', value: 10 },
    xpReward: 300,
    rarity: 'raro',
  },
  {
    id: 'biblioteca-pessoal',
    name: 'Biblioteca Pessoal',
    description: 'Complete 25 lições',
    icon: '📖',
    category: 'aprendizado',
    condition: { type: 'lessons_completed', value: 25 },
    xpReward: 500,
    rarity: 'epico',
  },
  {
    id: 'primeiro-curso',
    name: 'Formatura',
    description: 'Complete seu primeiro curso',
    icon: '🎓',
    category: 'aprendizado',
    condition: { type: 'courses_completed', value: 1 },
    xpReward: 500,
    rarity: 'raro',
  },
  {
    id: 'todos-cursos',
    name: 'Mestre Completo',
    description: 'Complete todos os cursos disponíveis',
    icon: '🏆',
    category: 'aprendizado',
    condition: { type: 'all_courses_completed', value: true },
    xpReward: 2000,
    rarity: 'lendario',
  },
  
  // CONSISTÊNCIA
  {
    id: 'streak-3',
    name: 'Aquecendo',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '🔥',
    category: 'consistencia',
    condition: { type: 'streak', value: 3 },
    xpReward: 150,
    rarity: 'comum',
  },
  {
    id: 'streak-7',
    name: 'Semana Perfeita',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '📅',
    category: 'consistencia',
    condition: { type: 'streak', value: 7 },
    xpReward: 350,
    rarity: 'raro',
  },
  {
    id: 'streak-14',
    name: 'Duas Semanas Fortes',
    description: 'Mantenha uma sequência de 14 dias',
    icon: '💪',
    category: 'consistencia',
    condition: { type: 'streak', value: 14 },
    xpReward: 600,
    rarity: 'epico',
  },
  {
    id: 'streak-30',
    name: 'Mês de Ouro',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🌟',
    category: 'consistencia',
    condition: { type: 'streak', value: 30 },
    xpReward: 1000,
    rarity: 'epico',
  },
  {
    id: 'streak-100',
    name: 'Centenário',
    description: 'Mantenha uma sequência de 100 dias',
    icon: '💯',
    category: 'consistencia',
    condition: { type: 'streak', value: 100 },
    xpReward: 5000,
    rarity: 'lendario',
  },
  
  // MAESTRIA
  {
    id: 'quiz-perfeito',
    name: 'Resposta Perfeita',
    description: 'Acerte 100% em um quiz',
    icon: '💯',
    category: 'maestria',
    condition: { type: 'perfect_quiz', value: 1 },
    xpReward: 200,
    rarity: 'comum',
  },
  {
    id: 'cinco-perfeitos',
    name: 'Consistência Perfeita',
    description: 'Acerte 100% em 5 quizzes',
    icon: '🎯',
    category: 'maestria',
    condition: { type: 'perfect_quiz', value: 5 },
    xpReward: 500,
    rarity: 'raro',
  },
  {
    id: 'dez-perfeitos',
    name: 'Infalível',
    description: 'Acerte 100% em 10 quizzes',
    icon: '🏅',
    category: 'maestria',
    condition: { type: 'perfect_quiz', value: 10 },
    xpReward: 1000,
    rarity: 'epico',
  },
  
  // ESPECIAIS
  {
    id: 'madrugador',
    name: 'Madrugador',
    description: 'Complete uma lição antes das 7h',
    icon: '🌅',
    category: 'especial',
    condition: { type: 'time_of_day', value: 'early_morning' },
    xpReward: 200,
    rarity: 'raro',
  },
  {
    id: 'coruja',
    name: 'Coruja Noturna',
    description: 'Complete uma lição depois das 23h',
    icon: '🦉',
    category: 'especial',
    condition: { type: 'time_of_day', value: 'late_night' },
    xpReward: 200,
    rarity: 'raro',
  },
  {
    id: 'velocista',
    name: 'Velocista',
    description: 'Complete 3 lições em um único dia',
    icon: '🚀',
    category: 'especial',
    condition: { type: 'lessons_in_day', value: 3 },
    xpReward: 300,
    rarity: 'raro',
  },
  {
    id: 'maratonista',
    name: 'Maratonista',
    description: 'Complete 5 lições em um único dia',
    icon: '⚡',
    category: 'especial',
    condition: { type: 'lessons_in_day', value: 5 },
    xpReward: 600,
    rarity: 'epico',
  },
];

export const RARITY_COLORS = {
  comum: { 
    bg: 'bg-neutral-100', 
    border: 'border-neutral-300', 
    text: 'text-neutral-700',
    glow: 'shadow-sm',
  },
  raro: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-300', 
    text: 'text-blue-700',
    glow: 'shadow-md shadow-blue-200',
  },
  epico: { 
    bg: 'bg-purple-50', 
    border: 'border-purple-300', 
    text: 'text-purple-700',
    glow: 'shadow-lg shadow-purple-300',
  },
  lendario: { 
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', 
    border: 'border-amber-400', 
    text: 'text-amber-700',
    glow: 'shadow-xl shadow-amber-300',
  },
};

export function checkAchievement(achievement: Achievement, progress: any): boolean {
  const { type, value } = achievement.condition;
  
  switch (type) {
    case 'lessons_completed':
      return progress.lessonsCompleted.length >= value;
    
    case 'courses_completed':
      return progress.coursesCompleted.length >= value;
    
    case 'all_courses_completed':
      // Será verificado comparando com total de cursos disponíveis
      return value && progress.coursesCompleted.length >= 3; // Ajustar conforme número de cursos
    
    case 'streak':
      return progress.currentStreak >= value;
    
    case 'perfect_quiz':
      return progress.perfectQuizzes >= value;
    
    case 'lessons_in_day':
      return progress.lessonsCompletedToday >= value;
    
    case 'time_of_day':
      const hour = new Date().getHours();
      if (value === 'early_morning') return hour < 7;
      if (value === 'late_night') return hour >= 23;
      return false;
    
    default:
      return false;
  }
}
