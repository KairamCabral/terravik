// src/lib/academia/types.ts
// Tipos da Academia Terravik — focado em vídeo-aulas

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  thumbnail_url: string | null; // Legacy/fallback
  thumbnail_landscape: string | null; // 1920x1080 para cards horizontais
  thumbnail_portrait: string | null; // 1080x1920 para cards verticais
  trailer_url: string | null;
  difficulty: Difficulty | null;
  estimated_duration_min: number | null;
  tags: string[];
  prerequisites: string[];
  badge_title: string | null;
  badge_icon: string | null;
  order: number | null;
  is_featured: boolean;
  is_published: boolean;
  metadata: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  // Computed / joined
  lessons?: Lesson[];
  lessons_count?: number;
  enrolled_count?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  type: 'video' | 'text' | 'interactive';
  video_url: string | null;
  video_duration_sec: number;
  thumbnail_url: string | null;
  content: LessonContent;
  xp_reward: number;
  order: number;
  duration_min: number;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
  // Computed / joined
  materials?: LessonMaterial[];
  is_completed?: boolean;
}

export interface LessonContent {
  sections: ContentSection[];
  practicalTips?: PracticalTip[];
  relatedProducts?: string[];
}

export interface ContentSection {
  type: 'text' | 'image' | 'callout' | 'comparison' | 'checklist';
  content: any;
}

export interface PracticalTip {
  icon: string;
  title: string;
  description: string;
  timing?: string;
}

export interface LessonMaterial {
  id: string;
  lesson_id: string;
  title: string;
  type: 'pdf' | 'link' | 'image' | 'spreadsheet' | 'other';
  file_url: string;
  file_size_bytes: number;
  order: number;
  created_at: string | null;
}

// Legacy quiz types (kept for backwards compatibility with old content)
export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}
export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  started_at: string | null;
  completed_at: string | null;
  time_spent: number;
  xp_earned: number;
}

// Difficulty helpers (includes legacy keys for static courses)
export const DIFFICULTY_CONFIG: Record<Difficulty | 'iniciante' | 'intermediario' | 'avancado', {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  beginner: {
    label: 'Iniciante',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  intermediate: {
    label: 'Intermediário',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  advanced: {
    label: 'Avançado',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  // Legacy keys (static courses)
  iniciante: {
    label: 'Iniciante',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  intermediario: {
    label: 'Intermediário',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  avancado: {
    label: 'Avançado',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

// Achievement types (mantidos)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'aprendizado' | 'consistencia' | 'maestria' | 'especial';
  condition: { type: string; value: any };
  xpReward: number;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
}

export interface UserProgress {
  totalXP: number;
  lessonsCompleted: string[];
  coursesCompleted: string[];
  quizScores: Record<string, number>;
  perfectQuizzes: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  achievements: string[];
  lessonsCompletedToday: number;
  createdAt: string;
}

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  icon: string;
}
