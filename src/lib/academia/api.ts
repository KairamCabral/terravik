// src/lib/academia/api.ts
// API layer para Academia — busca dados do Supabase
import { createClient } from '@/lib/supabase/client';
import type { Course, Lesson, LessonMaterial } from './types';

function getSupabase() {
  return createClient();
}

// ─── Helper: normalizar dados do DB para o tipo Course ───
function normalizeCourse(row: any): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? row.metadata?.subtitle ?? null,
    description: row.description,
    icon: row.icon,
    color: row.color,
    thumbnail_url: row.thumbnail_url ?? row.metadata?.thumbnail_url ?? null,
    thumbnail_landscape: row.thumbnail_landscape ?? row.metadata?.thumbnail_landscape ?? null,
    thumbnail_portrait: row.thumbnail_portrait ?? row.metadata?.thumbnail_portrait ?? null,
    trailer_url: row.trailer_url ?? row.metadata?.trailer_url ?? null,
    difficulty: row.difficulty,
    estimated_duration_min: row.estimated_duration_min,
    tags: row.tags ?? row.metadata?.tags ?? [],
    prerequisites: row.prerequisites ?? [],
    badge_title: row.badge_title,
    badge_icon: row.badge_icon,
    order: row.order,
    is_featured: row.is_featured ?? false,
    is_published: row.is_published ?? false,
    metadata: row.metadata,
    created_at: row.created_at,
    updated_at: row.updated_at,
    published_at: row.published_at,
    lessons: row.lessons?.map(normalizeLesson),
    lessons_count: row.lessons_count?.[0]?.count ?? row.lessons?.length,
    enrolled_count: row.enrolled_count?.[0]?.count,
  };
}

function normalizeLesson(row: any): Lesson {
  const content = typeof row.content === 'string' ? JSON.parse(row.content) : (row.content ?? { sections: [] });
  return {
    id: row.id,
    course_id: row.course_id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? content.description ?? null,
    type: row.type ?? content.type ?? 'video',
    video_url: row.video_url ?? content.video_url ?? null,
    video_duration_sec: row.video_duration_sec ?? content.video_duration_sec ?? 0,
    thumbnail_url: row.thumbnail_url ?? content.thumbnail_url ?? null,
    content: {
      sections: content.sections ?? [],
      practicalTips: content.practicalTips,
      relatedProducts: content.relatedProducts,
    },
    xp_reward: row.xp_reward ?? 50,
    order: row.order ?? 0,
    duration_min: row.duration_min ?? 10,
    is_published: row.is_published ?? false,
    created_at: row.created_at,
    updated_at: row.updated_at,
    materials: row.materials ?? content.materials ?? [],
  };
}

// ─── Queries Públicas ───

export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons_count:lessons(count),
      enrolled_count:user_progress(count)
    `)
    .eq('is_published', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('[Academia] Erro ao buscar cursos:', error.message);
    return [];
  }
  return (data ?? []).map(normalizeCourse);
}

export async function getPublishedCoursesWithLessons(): Promise<Course[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(*),
      lessons_count:lessons(count),
      enrolled_count:user_progress(count)
    `)
    .eq('is_published', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('[Academia] Erro ao buscar cursos:', error.message);
    return [];
  }
  const courses = (data ?? []).map(normalizeCourse);
  courses.forEach(c => {
    if (c.lessons) c.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });
  return courses;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(*),
      enrolled_count:user_progress(count)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('[Academia] Erro ao buscar curso:', error.message);
    return null;
  }

  const course = normalizeCourse(data);
  if (course.lessons) {
    course.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    course.lessons_count = course.lessons.length;
  }
  return course;
}

export async function getLessonWithMaterials(courseSlug: string, lessonSlug: string): Promise<{
  course: Course;
  lesson: Lesson;
  materials: LessonMaterial[];
} | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.lessons) return null;

  const lesson = course.lessons.find(l => l.slug === lessonSlug);
  if (!lesson) return null;

  // Materiais vêm de content.materials (extraídos por normalizeLesson)
  const materials = lesson.materials ?? [];

  return { course, lesson, materials };
}

// ─── Progresso do Usuário ───

export async function getUserCourseProgress(userId: string, courseId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId);
  return data ?? [];
}

export async function getUserAllProgress(userId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
  return data ?? [];
}

export async function markLessonComplete(userId: string, courseId: string, lessonId: string, xpEarned: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      xp_earned: xpEarned,
    }, { onConflict: 'user_id,lesson_id' })
    .select()
    .single();

  if (error) {
    console.error('[Academia] Erro ao marcar lição:', error.message);
    return null;
  }

  // Adicionar XP ao perfil
  await supabase.rpc('add_user_xp', { p_user_id: userId, p_xp_amount: xpEarned });

  return data;
}

// ─── Queries Admin ───

export async function getAdminCourses() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons_count:lessons(count),
      enrolled_count:user_progress(count)
    `)
    .order('order', { ascending: true });

  if (error) {
    console.error('[Academia Admin] Erro:', error.message);
    return [];
  }
  return (data ?? []).map(normalizeCourse);
}

export async function getAdminCourse(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  const course = normalizeCourse(data);
  if (course.lessons) {
    course.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  return course;
}

export async function saveCourse(courseData: Partial<Course> & { id?: string }) {
  const supabase = getSupabase();

  // Campos extras vão no metadata (colunas podem não existir antes da migration)
  const metadata = {
    ...(courseData.metadata ?? {}),
    thumbnail_url: courseData.thumbnail_url ?? null,
    thumbnail_landscape: courseData.thumbnail_landscape ?? null,
    thumbnail_portrait: courseData.thumbnail_portrait ?? null,
    trailer_url: courseData.trailer_url ?? null,
    subtitle: courseData.subtitle ?? null,
    tags: courseData.tags ?? [],
  };

  // Apenas colunas que EXISTEM na tabela courses atual
  const payload: Record<string, unknown> = {
    title: courseData.title,
    slug: courseData.slug,
    description: courseData.description,
    icon: courseData.icon,
    color: courseData.color,
    difficulty: courseData.difficulty,
    estimated_duration_min: courseData.estimated_duration_min,
    badge_title: courseData.badge_title,
    badge_icon: courseData.badge_icon,
    order: courseData.order ?? 0,
    is_featured: courseData.is_featured ?? false,
    is_published: courseData.is_published ?? false,
    metadata,
    updated_at: new Date().toISOString(),
  };

  if (courseData.is_published && !courseData.published_at) {
    payload.published_at = new Date().toISOString();
  }

  if (courseData.id) {
    const { data, error } = await supabase
      .from('courses')
      .update(payload as any)
      .eq('id', courseData.id)
      .select()
      .single();
    if (error) {
      console.error('[API] Erro ao atualizar curso:', error);
      throw new Error(`Falha ao atualizar: ${error.message || error.code || 'erro desconhecido'}`);
    }
    return normalizeCourse(data);
  } else {
    const { data, error } = await supabase
      .from('courses')
      .insert(payload as any)
      .select()
      .single();
    if (error) {
      console.error('[API] Erro ao inserir curso:', error);
      throw new Error(`Falha ao criar: ${error.message || error.code || 'erro desconhecido'}`);
    }
    return normalizeCourse(data);
  }
}

export async function saveLesson(lessonData: Partial<Lesson> & { course_id: string; id?: string }) {
  const supabase = getSupabase();

  // Campos extras vão no content (JSONB) — colunas podem não existir antes da migration
  const content = {
    ...(typeof lessonData.content === 'object' ? lessonData.content : {}),
    video_url: lessonData.video_url ?? null,
    video_duration_sec: lessonData.video_duration_sec ?? 0,
    type: lessonData.type ?? 'video',
    thumbnail_url: lessonData.thumbnail_url ?? null,
    description: lessonData.description ?? null,
  };

  console.log('[API] saveLesson - Dados recebidos:', {
    id: lessonData.id,
    title: lessonData.title,
    type: lessonData.type,
    video_url: lessonData.video_url,
    description: lessonData.description,
  });

  // Apenas colunas que EXISTEM na tabela lessons atual
  const payload: Record<string, unknown> = {
    course_id: lessonData.course_id,
    title: lessonData.title,
    slug: lessonData.slug,
    type: lessonData.type ?? 'video',
    duration_min: lessonData.duration_min ?? 0,
    xp_reward: lessonData.xp_reward ?? 50,
    order: lessonData.order ?? 0,
    is_published: lessonData.is_published ?? false,
    content,
    updated_at: new Date().toISOString(),
  };

  console.log('[API] saveLesson - Payload final (content):', content);

  if (lessonData.id) {
    const { data, error } = await supabase
      .from('lessons')
      .update(payload as any)
      .eq('id', lessonData.id)
      .select()
      .single();
    if (error) {
      console.error('[API] Erro ao atualizar lição:', error);
      throw error;
    }
    console.log('[API] Lição atualizada com sucesso');
    return normalizeLesson(data);
  } else {
    const { data, error } = await supabase
      .from('lessons')
      .insert(payload as any)
      .select()
      .single();
    if (error) {
      console.error('[API] Erro ao inserir lição:', error);
      throw error;
    }
    console.log('[API] Lição criada com sucesso');
    return normalizeLesson(data);
  }
}

export async function deleteLesson(lessonId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}

export async function deleteCourse(courseId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  if (error) throw error;
}

export async function saveMaterial(materialData: Partial<LessonMaterial> & { lesson_id: string }) {
  const supabase = getSupabase();

  // Busca a lição para acessar o content JSONB
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons')
    .select('content')
    .eq('id', materialData.lesson_id)
    .single();

  if (fetchError || !lesson) throw fetchError || new Error('Lição não encontrada');

  const content = typeof lesson.content === 'string'
    ? JSON.parse(lesson.content)
    : (lesson.content ?? { sections: [] });

  const materials: LessonMaterial[] = content.materials ?? [];
  const materialId = materialData.id || crypto.randomUUID();

  if (materialData.id) {
    const idx = materials.findIndex((m) => m.id === materialData.id);
    if (idx >= 0) {
      materials[idx] = { ...materials[idx], ...materialData } as LessonMaterial;
    }
  } else {
    materials.push({
      id: materialId,
      lesson_id: materialData.lesson_id,
      title: materialData.title!,
      type: materialData.type ?? 'pdf',
      file_url: materialData.file_url!,
      file_size_bytes: materialData.file_size_bytes ?? 0,
      order: materialData.order ?? materials.length,
      created_at: new Date().toISOString(),
    });
  }

  const { error: updateError } = await supabase
    .from('lessons')
    .update({ content: { ...content, materials } })
    .eq('id', materialData.lesson_id);

  if (updateError) throw updateError;

  return materials.find((m) => m.id === materialId) ?? materials[materials.length - 1];
}

export async function deleteMaterial(materialId: string, lessonId: string) {
  const supabase = getSupabase();

  const { data: lesson, error: fetchError } = await supabase
    .from('lessons')
    .select('content')
    .eq('id', lessonId)
    .single();

  if (fetchError || !lesson) throw fetchError || new Error('Lição não encontrada');

  const content = typeof lesson.content === 'string'
    ? JSON.parse(lesson.content)
    : (lesson.content ?? { sections: [] });

  const materials = (content.materials ?? []).filter((m: any) => m.id !== materialId);

  const { error: updateError } = await supabase
    .from('lessons')
    .update({ content: { ...content, materials } })
    .eq('id', lessonId);

  if (updateError) throw updateError;
}

// ─── Slug helper ───

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
