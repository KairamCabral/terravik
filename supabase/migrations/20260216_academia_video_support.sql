-- ============================================================
-- Migration: Suporte a vídeo-aulas na Academia Terravik
-- Data: 2026-02-16
-- Descrição: Adiciona campos de vídeo, thumbnail, materiais
-- ============================================================

-- 1. Courses: campos visuais (Netflix-style)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS trailer_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 2. Lessons: suporte a vídeo e materiais
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_duration_sec integer DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type text DEFAULT 'video';

-- 3. Tabela de materiais complementares
CREATE TABLE IF NOT EXISTS lesson_materials (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'pdf',
  file_url text NOT NULL,
  file_size_bytes bigint DEFAULT 0,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Índices úteis
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, "order");
CREATE INDEX IF NOT EXISTS idx_lesson_materials_lesson ON lesson_materials(lesson_id, "order");
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, "order");
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);

-- 5. Unique constraint para evitar progresso duplicado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_unique_lesson'
  ) THEN
    ALTER TABLE user_progress ADD CONSTRAINT user_progress_unique_lesson
      UNIQUE (user_id, lesson_id);
  END IF;
END $$;
