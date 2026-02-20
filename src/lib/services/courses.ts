// src/lib/services/courses.ts

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Course = Database['public']['Tables']['courses']['Row'];

export async function getCourses(publishedOnly = true) {
  const supabase = createClient();

  let query = supabase
    .from('courses')
    .select(`
      *,
      lessons:lessons(count)
    `)
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getCourseBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons:lessons(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single();

  if (!course) return null;

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourse(courseData: Partial<Course>) {
  const supabase = createClient();

  const { data: course, error } = await supabase
    .from('courses')
    .insert(courseData as Database['public']['Tables']['courses']['Insert'])
    .select()
    .single();

  if (error) throw error;
  return course;
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  const supabase = createClient();

  const { data: course, error } = await supabase
    .from('courses')
    .update({ ...courseData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return course;
}

export async function deleteCourse(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
