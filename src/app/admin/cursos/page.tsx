'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Star,
} from 'lucide-react';
import { getAdminCourses, saveCourse, deleteCourse } from '@/lib/academia/api';
import type { Course } from '@/lib/academia/types';
import { DIFFICULTY_CONFIG } from '@/lib/academia/types';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao carregar cursos.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublished = async (course: Course) => {
    setActionLoading(course.id);
    try {
      await saveCourse({ ...course, is_published: !course.is_published });
      setMessage({ type: 'success', text: course.is_published ? 'Curso despublicado.' : 'Curso publicado!' });
      loadCourses();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao atualizar publicação.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) return;
    setActionLoading(courseId);
    try {
      await deleteCourse(courseId);
      setMessage({ type: 'success', text: 'Curso excluído.' });
      loadCourses();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao excluir curso.' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons_count ?? 0), 0);
  const totalEnrolled = courses.reduce((acc, c) => acc + (c.enrolled_count ?? 0), 0);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl px-4 py-3 flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <span className="text-emerald-600">✓</span>
            ) : (
              <span className="text-red-600">✕</span>
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Cursos da Academia</h1>
          <p className="text-neutral-500 mt-0.5">Gerencie os cursos da plataforma Terravik</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Curso
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{courses.length}</p>
            <p className="text-sm text-neutral-500">Total de cursos</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{totalLessons}</p>
            <p className="text-sm text-neutral-500">Total de lições</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{totalEnrolled}</p>
            <p className="text-sm text-neutral-500">Inscrições</p>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar cursos..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
        />
      </div>

      {/* Courses table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nenhum curso encontrado</h3>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              {searchQuery ? 'Tente outra busca.' : 'Comece criando seu primeiro curso da Academia.'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/cursos/novo"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar primeiro curso
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Curso</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 hidden md:table-cell">Dificuldade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Lições</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 hidden sm:table-cell">Inscritos</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, index) => {
                    const diff = course.difficulty ? DIFFICULTY_CONFIG[course.difficulty] : null;
                    return (
                      <motion.tr
                        key={course.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                              style={{ backgroundColor: course.color || '#22C55E' }}
                            >
                              {course.thumbnail_url ? (
                                <Image
                                  src={course.thumbnail_url}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <span className="text-2xl">{course.icon || '📚'}</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-900">{course.title}</span>
                                {course.is_featured && (
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                )}
                              </div>
                              {course.subtitle && (
                                <p className="text-sm text-neutral-500 truncate max-w-[200px]">
                                  {course.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {diff ? (
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${diff.bgColor} ${diff.color}`}
                            >
                              {diff.label}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-neutral-700">{course.lessons_count ?? 0}</span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span className="text-neutral-700">{course.enrolled_count ?? 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                              course.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {course.is_published ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => togglePublished(course)}
                              disabled={actionLoading === course.id}
                              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 disabled:opacity-50"
                              title={course.is_published ? 'Despublicar' : 'Publicar'}
                            >
                              {course.is_published ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <Link
                              href={`/admin/cursos/${course.id}`}
                              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              disabled={actionLoading === course.id}
                              className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 disabled:opacity-50"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
