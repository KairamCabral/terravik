// src/app/api/academia/seed/route.ts
// Seed dos cursos estáticos para o Supabase
// Rodar uma vez, logado como admin: POST /api/academia/seed

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const STATIC_COURSES = [
  {
    slug: 'fundamentos-do-gramado',
    title: 'Fundamentos do Gramado',
    description: 'Conceitos básicos: tipos de grama, solo, luz e água.',
    icon: '🌱',
    color: '#22C55E',
    difficulty: 'beginner' as const,
    estimated_duration_min: 45,
    is_featured: true,
    is_published: true,
    order: 1,
    badge_title: 'Conhecedor de Gramados',
    badge_icon: '🌿',
    metadata: {
      subtitle: 'Tudo para começar',
      tags: ['gramado', 'iniciante', 'fundamentos'],
      thumbnail_url: null,
      trailer_url: null,
    },
    lessons: [
      {
        slug: 'tipos-de-grama',
        title: 'Tipos de Grama no Brasil',
        duration_min: 8,
        xp_reward: 50,
        order: 1,
        content: {
          sections: [],
          type: 'video',
          description: 'Conheça as principais espécies de grama cultivadas no Brasil e suas características.',
        },
      },
      {
        slug: 'entendendo-o-solo',
        title: 'Entendendo o Solo',
        duration_min: 12,
        xp_reward: 60,
        order: 2,
        content: {
          sections: [],
          type: 'video',
          description: 'pH, nutrientes e como preparar o solo ideal para seu gramado.',
        },
      },
      {
        slug: 'agua-e-rega',
        title: 'Água e Rega Inteligente',
        duration_min: 10,
        xp_reward: 50,
        order: 3,
        content: {
          sections: [],
          type: 'video',
          description: 'Quantidade, frequência e técnicas de irrigação eficiente.',
        },
      },
    ],
  },
  {
    slug: 'adubacao-e-nutricao',
    title: 'Adubação e Nutrição',
    description: 'Domine NPK, timing e identificação de deficiências nutricionais.',
    icon: '🧪',
    color: '#F59E0B',
    difficulty: 'intermediate' as const,
    estimated_duration_min: 60,
    is_featured: true,
    is_published: true,
    order: 2,
    badge_title: 'Mestre em Nutrição',
    badge_icon: '🧪',
    metadata: {
      subtitle: 'Domine NPK',
      tags: ['adubação', 'npk', 'nutrição', 'intermediário'],
      thumbnail_url: null,
      trailer_url: null,
    },
    lessons: [
      {
        slug: 'entendendo-npk',
        title: 'Entendendo NPK',
        duration_min: 15,
        xp_reward: 70,
        order: 1,
        content: {
          sections: [],
          type: 'video',
          description: 'O que significa cada número na embalagem e quando usar cada formulação.',
        },
      },
    ],
  },
  {
    slug: 'problemas-e-solucoes',
    title: 'Problemas e Soluções',
    description: 'Identifique e corrija problemas comuns: amarelamento, pragas, doenças e deficiências.',
    icon: '🔍',
    color: '#EF4444',
    difficulty: 'intermediate' as const,
    estimated_duration_min: 50,
    is_featured: false,
    is_published: true,
    order: 3,
    badge_title: 'Doutor do Gramado',
    badge_icon: '🩺',
    metadata: {
      subtitle: 'Diagnostique e resolva',
      tags: ['problemas', 'diagnóstico', 'soluções'],
      thumbnail_url: null,
      trailer_url: null,
    },
    lessons: [
      {
        slug: 'gramado-amarelado',
        title: 'Gramado Amarelado',
        duration_min: 10,
        xp_reward: 60,
        order: 1,
        content: {
          sections: [],
          type: 'video',
          description: 'As 7 principais causas de amarelamento e como resolver cada uma delas.',
        },
      },
    ],
  },
];

export async function POST() {
  try {
    // Só admin logado: a rota grava com a chave de serviço.
    const sessao = createServerSupabaseClient();
    const { data: { user } } = await sessao.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const { data: perfil } = await sessao.from('profiles').select('role').eq('id', user.id).single();
    if (perfil?.role !== 'admin' && perfil?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    const results: any[] = [];

    for (const courseData of STATIC_COURSES) {
      const { lessons, ...courseFields } = courseData;

      // Upsert curso — apenas colunas que existem na tabela
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .upsert(
          {
            slug: courseFields.slug,
            title: courseFields.title,
            description: courseFields.description,
            icon: courseFields.icon,
            color: courseFields.color,
            difficulty: courseFields.difficulty,
            estimated_duration_min: courseFields.estimated_duration_min,
            is_featured: courseFields.is_featured,
            is_published: courseFields.is_published,
            order: courseFields.order,
            badge_title: courseFields.badge_title,
            badge_icon: courseFields.badge_icon,
            metadata: courseFields.metadata,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (courseError) {
        results.push({ course: courseFields.slug, error: courseError.message });
        continue;
      }

      // Para cada lição: verificar se já existe, senão inserir
      for (const lesson of lessons) {
        // Checar se já existe por course_id + slug
        const { data: existing } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', course.id)
          .eq('slug', lesson.slug)
          .maybeSingle();

        if (existing) {
          // Atualizar
          await supabase
            .from('lessons')
            .update({
              title: lesson.title,
              duration_min: lesson.duration_min,
              xp_reward: lesson.xp_reward,
              order: lesson.order,
              is_published: true,
              content: lesson.content,
              updated_at: new Date().toISOString(),
            } as any)
            .eq('id', existing.id);
        } else {
          // Inserir nova
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: course.id,
              slug: lesson.slug,
              title: lesson.title,
              duration_min: lesson.duration_min,
              xp_reward: lesson.xp_reward,
              order: lesson.order,
              is_published: true,
              content: lesson.content,
            } as any);

          if (lessonError) {
            results.push({ lesson: lesson.slug, error: lessonError.message });
          }
        }
      }

      results.push({
        course: courseFields.slug,
        id: course.id,
        lessons: lessons.length,
        status: 'ok',
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('[Seed] Erro:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
