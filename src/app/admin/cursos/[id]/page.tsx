'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Trash2,
  Edit,
  Plus,
  X,
  GripVertical,
  Video,
  FileText,
  BookOpen,
  Link2,
  Check,
  Upload,
  Loader2,
} from 'lucide-react';
import {
  getAdminCourse,
  saveCourse,
  saveLesson,
  deleteLesson,
  deleteCourse,
  saveMaterial,
  deleteMaterial,
  generateSlug,
} from '@/lib/academia/api';
import type { Course, Lesson, LessonMaterial, Difficulty } from '@/lib/academia/types';
import { DIFFICULTY_CONFIG } from '@/lib/academia/types';

const DIFFICULTY_OPTIONS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const LESSON_TYPES = [
  { value: 'video' as const, label: 'Vídeo', icon: Video },
  { value: 'text' as const, label: 'Texto', icon: FileText },
  { value: 'interactive' as const, label: 'Interativo', icon: BookOpen },
];
const MATERIAL_TYPES = [
  { value: 'pdf' as const, label: 'PDF' },
  { value: 'link' as const, label: 'Link' },
  { value: 'image' as const, label: 'Imagem' },
  { value: 'spreadsheet' as const, label: 'Planilha' },
  { value: 'other' as const, label: 'Outro' },
];

type Tab = 'detalhes' | 'licoes';

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('detalhes');
  const [form, setForm] = useState<Partial<Course>>({});
  const [slugLocked, setSlugLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLandscape, setIsUploadingLandscape] = useState(false);
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const landscapeInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  // Lesson form state
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
  const [lessonSlugLocked, setLessonSlugLocked] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Material form state
  const [addingMaterialLessonId, setAddingMaterialLessonId] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<{ lessonId: string; material: LessonMaterial } | null>(null);
  const [materialForm, setMaterialForm] = useState<Partial<LessonMaterial>>({});
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false);
  const materialFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  useEffect(() => {
    if (course) setForm({ ...course });
  }, [course]);

  useEffect(() => {
    if (!slugLocked && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(form.title!) }));
    }
  }, [form.title, slugLocked]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCourse(id);
      setCourse(data ?? null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao carregar curso.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Course, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'landscape' | 'portrait'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato inválido. Use JPG, PNG, WebP ou GIF.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande (máx 10MB).' });
      return;
    }

    const setUploading = type === 'landscape' ? setIsUploadingLandscape : setIsUploadingPortrait;
    const inputRef = type === 'landscape' ? landscapeInputRef : portraitInputRef;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `thumbnails/${type}`);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro no upload.' });
        return;
      }

      if (type === 'landscape') {
        setForm((f) => ({ ...f, thumbnail_landscape: data.url }));
      } else {
        setForm((f) => ({ ...f, thumbnail_portrait: data.url }));
      }
      setMessage({ type: 'success', text: `Thumbnail ${type === 'landscape' ? 'horizontal' : 'vertical'} enviada!` });
    } catch {
      setMessage({ type: 'error', text: 'Falha no upload. Tente novamente.' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    setForm((f) => ({ ...f, tags }));
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setMessage({ type: 'error', text: 'Título é obrigatório.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        id,
        slug: form.slug || generateSlug(form.title),
        tags: form.tags ?? [],
        thumbnail_url: form.thumbnail_url || null,
        thumbnail_landscape: form.thumbnail_landscape || null,
        thumbnail_portrait: form.thumbnail_portrait || null,
        trailer_url: form.trailer_url || null,
        subtitle: form.subtitle || null,
        description: form.description || null,
        icon: form.icon || null,
        color: form.color || null,
        badge_title: form.badge_title || null,
        badge_icon: form.badge_icon || null,
      };
      const saved = await saveCourse(payload);
      setCourse(saved);
      setForm({ ...saved });
      setMessage({ type: 'success', text: 'Curso salvo com sucesso!' });
    } catch (err: any) {
      console.error('[Admin] Erro ao salvar curso:', err);
      setMessage({ 
        type: 'error', 
        text: `Erro ao salvar curso: ${err.message || 'Tente novamente.'}` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm('Tem certeza que deseja excluir este curso? Todas as lições serão removidas. Esta ação não pode ser desfeita.'))
      return;
    try {
      await deleteCourse(id);
      setMessage({ type: 'success', text: 'Curso excluído.' });
      router.push('/admin/cursos');
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao excluir curso.' });
    }
  };

  // Lesson handlers
  const openAddLesson = () => {
    setAddingLesson(true);
    setEditingLessonId(null);
    setLessonForm({
      title: '',
      slug: '',
      description: '',
      type: 'video',
      video_url: '',
      video_duration_sec: 0,
      duration_min: 10,
      xp_reward: 50,
      order: course?.lessons?.length ?? 0,
      is_published: false,
      content: { sections: [] },
    });
    setLessonSlugLocked(false);
  };

  const openEditLesson = (lesson: Lesson) => {
    setAddingLesson(false);
    setEditingLessonId(lesson.id);
    setLessonForm({
      ...lesson,
      content: lesson.content ?? { sections: [] },
    });
    setLessonSlugLocked(true);
  };

  const closeLessonForm = () => {
    setEditingLessonId(null);
    setAddingLesson(false);
    setLessonForm({});
  };

  useEffect(() => {
    if (!lessonSlugLocked && lessonForm.title) {
      setLessonForm((f) => ({ ...f, slug: generateSlug(f.title!) }));
    }
  }, [lessonForm.title, lessonSlugLocked]);

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title?.trim()) {
      setMessage({ type: 'error', text: 'Título da lição é obrigatório.' });
      return;
    }
    try {
      const payload = {
        id: lessonForm.id,
        course_id: id,
        title: lessonForm.title,
        slug: lessonForm.slug || generateSlug(lessonForm.title),
        description: lessonForm.description ?? null,
        type: lessonForm.type ?? 'video',
        video_url: lessonForm.video_url ?? null,
        video_duration_sec: lessonForm.video_duration_sec ?? 0,
        thumbnail_url: lessonForm.thumbnail_url ?? null,
        xp_reward: lessonForm.xp_reward ?? 50,
        order: lessonForm.order ?? 0,
        duration_min: lessonForm.duration_min ?? 10,
        is_published: lessonForm.is_published ?? false,
        content: lessonForm.content ?? { sections: [] },
      };
      
      console.log('[Admin] Salvando lição:', payload);
      const result = await saveLesson(payload);
      console.log('[Admin] Lição salva:', result);
      
      setMessage({ type: 'success', text: addingLesson ? 'Aula criada!' : 'Aula atualizada!' });
      loadCourse();
      closeLessonForm();
    } catch (err: any) {
      console.error('[Admin] Erro ao salvar lição:', err);
      setMessage({ type: 'error', text: `Erro ao salvar aula: ${err.message || 'desconhecido'}` });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Excluir esta aula?')) return;
    try {
      await deleteLesson(lessonId);
      setMessage({ type: 'success', text: 'Aula excluída.' });
      loadCourse();
      closeLessonForm();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao excluir aula.' });
    }
  };

  // Material handlers
  const openAddMaterial = (lessonId: string) => {
    setAddingMaterialLessonId(lessonId);
    setEditingMaterial(null);
    setMaterialForm({
      title: '',
      type: 'pdf',
      file_url: '',
      file_size_bytes: 0,
      order: 0,
    });
  };

  const openEditMaterial = (lessonId: string, material: LessonMaterial) => {
    setAddingMaterialLessonId(null);
    setEditingMaterial({ lessonId, material });
    setMaterialForm({
      id: material.id,
      title: material.title,
      type: material.type,
      file_url: material.file_url,
      file_size_bytes: material.file_size_bytes ?? 0,
      order: material.order,
    });
  };

  const closeMaterialForm = () => {
    setAddingMaterialLessonId(null);
    setEditingMaterial(null);
    setMaterialForm({});
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato inválido. Use MP4, WebM, OGG ou MOV.' });
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande (máx 100MB).' });
      return;
    }

    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'videos');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro no upload.' });
        return;
      }

      setLessonForm((f) => ({ ...f, video_url: data.url }));
      setMessage({ type: 'success', text: 'Vídeo enviado!' });
    } catch {
      setMessage({ type: 'error', text: 'Falha no upload de vídeo.' });
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleMaterialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande (máx 10MB).' });
      return;
    }

    setIsUploadingMaterial(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'materials');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro no upload.' });
        return;
      }

      setMaterialForm((f) => ({
        ...f,
        file_url: data.url,
        file_size_bytes: data.size,
        title: f.title || file.name.replace(/\.[^.]+$/, ''),
      }));
      setMessage({ type: 'success', text: 'Arquivo enviado!' });
    } catch {
      setMessage({ type: 'error', text: 'Falha no upload.' });
    } finally {
      setIsUploadingMaterial(false);
      if (materialFileRef.current) materialFileRef.current.value = '';
    }
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const lessonId = addingMaterialLessonId ?? editingMaterial?.lessonId;
    if (!lessonId || !materialForm.title?.trim() || !materialForm.file_url?.trim()) {
      setMessage({ type: 'error', text: 'Título e arquivo/URL são obrigatórios.' });
      return;
    }
    try {
      const lesson = course?.lessons?.find((l) => l.id === lessonId);
      const order = editingMaterial
        ? editingMaterial.material.order
        : (lesson?.materials?.length ?? 0);
      await saveMaterial({
        ...(materialForm.id && { id: materialForm.id }),
        lesson_id: lessonId,
        title: materialForm.title,
        type: materialForm.type ?? 'pdf',
        file_url: materialForm.file_url,
        file_size_bytes: materialForm.file_size_bytes ?? 0,
        order,
      });
      setMessage({ type: 'success', text: editingMaterial ? 'Material atualizado!' : 'Material adicionado!' });
      loadCourse();
      closeMaterialForm();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao salvar material.' });
    }
  };

  const handleDeleteMaterial = async (materialId: string, lessonId: string) => {
    if (!confirm('Excluir este material?')) return;
    try {
      await deleteMaterial(materialId, lessonId);
      setMessage({ type: 'success', text: 'Material excluído.' });
      loadCourse();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao excluir material.' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500">Curso não encontrado.</p>
        <Link href="/admin/cursos" className="text-emerald-600 hover:underline mt-2 inline-block">
          Voltar aos cursos
        </Link>
      </div>
    );
  }

  const lessons = course.lessons ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/cursos" className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{course.title}</h1>
          <p className="text-neutral-500 text-sm">Editar curso e lições</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl px-4 py-3 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('detalhes')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
            activeTab === 'detalhes'
              ? 'bg-white border border-neutral-200 border-b-0 -mb-px text-emerald-700'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Detalhes do Curso
        </button>
        <button
          onClick={() => setActiveTab('licoes')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
            activeTab === 'licoes'
              ? 'bg-white border border-neutral-200 border-b-0 -mb-px text-emerald-700'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Aulas ({lessons.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'detalhes' && (
          <motion.div
            key="detalhes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <form onSubmit={handleSaveCourse} className="space-y-8">
              {/* Informações Básicas */}
              <section className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Informações Básicas</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Título *</label>
                    <input
                      type="text"
                      value={form.title ?? ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.slug ?? ''}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        onFocus={() => setSlugLocked(true)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setSlugLocked(false)}
                        className="px-3 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm"
                      >
                        Regenerar
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={form.subtitle ?? ''}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
                    <textarea
                      value={form.description ?? ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
                    <input
                      type="text"
                      value={(form.tags ?? []).join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </section>

              {/* Visual */}
              <section className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Visual</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Ícone</label>
                      <input
                        type="text"
                        value={form.icon ?? ''}
                        onChange={(e) => handleChange('icon', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Cor</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={form.color ?? '#22C55E'}
                          onChange={(e) => handleChange('color', e.target.value)}
                          className="w-12 h-10 rounded-lg border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.color ?? ''}
                          onChange={(e) => handleChange('color', e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Thumbnail Landscape */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Thumbnail Landscape (1920x1080) — Cards horizontais
                    </label>
                    {form.thumbnail_landscape ? (
                      <div className="relative w-full max-w-md aspect-video">
                        {(form.thumbnail_landscape.startsWith('blob:') || form.thumbnail_landscape.startsWith('data:')) ? (
                          <img
                            src={form.thumbnail_landscape}
                            alt="Thumbnail Landscape"
                            className="rounded-xl border border-neutral-200 object-cover w-full h-full"
                          />
                        ) : (
                          <Image
                            src={form.thumbnail_landscape}
                            alt="Thumbnail Landscape"
                            fill
                            className="rounded-xl border border-neutral-200 object-cover"
                            sizes="(max-width: 768px) 100vw, 448px"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, thumbnail_landscape: '' }))}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
                          title="Remover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => landscapeInputRef.current?.click()}
                        className="w-full max-w-md border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors aspect-video flex items-center justify-center"
                      >
                        {isUploadingLandscape ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <span className="text-sm text-neutral-500">Enviando...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-neutral-400" />
                            <span className="text-sm text-neutral-500">Horizontal 1920x1080</span>
                            <span className="text-xs text-neutral-400">JPG, PNG, WebP (máx 10MB)</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={landscapeInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleThumbnailUpload(e, 'landscape')}
                      className="hidden"
                    />
                  </div>

                  {/* Thumbnail Portrait */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Thumbnail Portrait (1080x1920) — Cards verticais (poster)
                    </label>
                    {form.thumbnail_portrait ? (
                      <div className="relative w-full max-w-[200px] aspect-[9/16]">
                        {(form.thumbnail_portrait.startsWith('blob:') || form.thumbnail_portrait.startsWith('data:')) ? (
                          <img
                            src={form.thumbnail_portrait}
                            alt="Thumbnail Portrait"
                            className="rounded-xl border border-neutral-200 object-cover w-full h-full"
                          />
                        ) : (
                          <Image
                            src={form.thumbnail_portrait}
                            alt="Thumbnail Portrait"
                            fill
                            className="rounded-xl border border-neutral-200 object-cover"
                            sizes="200px"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, thumbnail_portrait: '' }))}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
                          title="Remover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => portraitInputRef.current?.click()}
                        className="w-full max-w-[200px] border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors aspect-[9/16] flex items-center justify-center"
                      >
                        {isUploadingPortrait ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            <span className="text-xs text-neutral-500">Enviando...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-neutral-400" />
                            <span className="text-xs text-neutral-500">Vertical 1080x1920</span>
                            <span className="text-xs text-neutral-400">JPG, PNG (máx 10MB)</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={portraitInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleThumbnailUpload(e, 'portrait')}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Trailer URL</label>
                    <input
                      type="url"
                      value={form.trailer_url ?? ''}
                      onChange={(e) => handleChange('trailer_url', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Badge - Título</label>
                      <input
                        type="text"
                        value={form.badge_title ?? ''}
                        onChange={(e) => handleChange('badge_title', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Badge - Ícone</label>
                      <input
                        type="text"
                        value={form.badge_icon ?? ''}
                        onChange={(e) => handleChange('badge_icon', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Configurações */}
              <section className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Configurações</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Dificuldade</label>
                    <select
                      value={form.difficulty ?? 'beginner'}
                      onChange={(e) => handleChange('difficulty', e.target.value as Difficulty)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {DIFFICULTY_CONFIG[d].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Duração estimada (min)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.estimated_duration_min ?? ''}
                      onChange={(e) =>
                        handleChange('estimated_duration_min', e.target.value ? parseInt(e.target.value, 10) : null)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_published ?? false}
                        onChange={(e) => handleChange('is_published', e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">Publicado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_featured ?? false}
                        onChange={(e) => handleChange('is_featured', e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">Destaque</span>
                    </label>
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'licoes' && (
          <motion.div
            key="licoes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Aulas do curso</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Cada aula é uma unidade do curso (vídeo, texto ou interativo). Abaixo de cada aula você pode adicionar arquivos para download (PDF, imagens).
                  </p>
                </div>
                <button
                  onClick={openAddLesson}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  Nova Aula
                </button>
              </div>
            </div>

            {/* Add/Edit Lesson Form */}
            <AnimatePresence>
              {(addingLesson || editingLessonId) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <form onSubmit={handleSaveLesson} className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-neutral-900">
                        {addingLesson ? 'Nova Aula' : 'Editar Aula'}
                      </h3>
                      <button type="button" onClick={closeLessonForm} className="p-2 rounded-lg hover:bg-neutral-100">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Título da aula *</label>
                        <input
                          type="text"
                          value={lessonForm.title ?? ''}
                          onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Ex: Aula 1 - Introdução"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                        <input
                          type="text"
                          value={lessonForm.slug ?? ''}
                          onChange={(e) => setLessonForm((f) => ({ ...f, slug: e.target.value }))}
                          onFocus={() => setLessonSlugLocked(true)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
                      <textarea
                        value={lessonForm.description ?? ''}
                        onChange={(e) => setLessonForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Formato da aula</label>
                        <select
                          value={lessonForm.type ?? 'video'}
                          onChange={(e) =>
                            setLessonForm((f) => ({ ...f, type: e.target.value as Lesson['type'] }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          {LESSON_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Duração (min)</label>
                        <input
                          type="number"
                          min={0}
                          value={lessonForm.duration_min ?? ''}
                          onChange={(e) =>
                            setLessonForm((f) => ({
                              ...f,
                              duration_min: e.target.value ? parseInt(e.target.value, 10) : 0,
                            }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Vídeo (seg)</label>
                        <input
                          type="number"
                          min={0}
                          value={lessonForm.video_duration_sec ?? ''}
                          onChange={(e) =>
                            setLessonForm((f) => ({
                              ...f,
                              video_duration_sec: e.target.value ? parseInt(e.target.value, 10) : 0,
                            }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">XP</label>
                        <input
                          type="number"
                          min={0}
                          value={lessonForm.xp_reward ?? ''}
                          onChange={(e) =>
                            setLessonForm((f) => ({
                              ...f,
                              xp_reward: e.target.value ? parseInt(e.target.value, 10) : 50,
                            }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                      {(lessonForm.type === 'video' || lessonForm.type === 'interactive') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {lessonForm.type === 'video' ? 'Vídeo' : 'Vídeo ou URL'}
                        </label>
                        <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={isUploadingVideo}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
                          >
                            {isUploadingVideo ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload do computador
                              </>
                            )}
                          </button>
                          <span className="text-xs text-neutral-400">ou cole a URL externa abaixo</span>
                        </div>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <input
                          type="url"
                          value={lessonForm.video_url ?? ''}
                          onChange={(e) => setLessonForm((f) => ({ ...f, video_url: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="https://... ou upload acima"
                        />
                        </div>
                      </div>
                      )}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lessonForm.is_published ?? false}
                          onChange={(e) =>
                            setLessonForm((f) => ({ ...f, is_published: e.target.checked }))
                          }
                          className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium">Publicado</span>
                      </label>
                      <div className="flex gap-2">
                        <button type="button" onClick={closeLessonForm} className="px-4 py-2 rounded-xl border hover:bg-neutral-50">
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                        >
                          <Check className="w-4 h-4" />
                          Salvar
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lessons list */}
            <div className="space-y-4">
              {lessons.length === 0 && !addingLesson && (
                <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                  <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 mb-4">Nenhuma aula ainda</p>
                  <button
                    onClick={openAddLesson}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar primeira aula
                  </button>
                </div>
              )}
              {lessons.map((lesson, idx) => (
                <motion.div
                  key={lesson.id}
                  layout
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    <span className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {lesson.type === 'video' ? (
                          <Video className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        ) : lesson.type === 'interactive' ? (
                          <BookOpen className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        )}
                        <span className="font-medium text-neutral-900 truncate">{lesson.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {lesson.type === 'video' ? 'Vídeo' : lesson.type === 'interactive' ? 'Interativo' : 'Texto'}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            lesson.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {lesson.is_published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {lesson.duration_min} min · {lesson.xp_reward} XP
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditLesson(lesson)}
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Materials section */}
                  <div className="border-t border-neutral-100 bg-neutral-50/50 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-600">Arquivos para download</span>
                      {addingMaterialLessonId !== lesson.id && editingMaterial?.lessonId !== lesson.id ? (
                        <button
                          onClick={() => openAddMaterial(lesson.id)}
                          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      ) : null}
                    </div>
                    {(lesson.materials ?? []).length > 0 && (
                      <ul className="space-y-2 mb-3">
                        {lesson.materials!.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white border border-neutral-100"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Link2 className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                              <span className="text-sm truncate">{m.title}</span>
                              <span className="text-xs text-neutral-400">({m.type})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditMaterial(lesson.id, m)}
                                className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(m.id, lesson.id)}
                                className="p-1 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(addingMaterialLessonId === lesson.id || editingMaterial?.lessonId === lesson.id) && (
                      <form onSubmit={handleSaveMaterial} className="space-y-3 p-3 bg-white rounded-lg border border-neutral-200">
                        <p className="text-xs text-neutral-500 font-medium">
                          {editingMaterial ? 'Editar arquivo' : 'Adicionar arquivo (PDF, imagem, link)'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Título do material"
                            value={materialForm.title ?? ''}
                            onChange={(e) => setMaterialForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-emerald-500 focus:outline-none"
                            required
                          />
                          <div>
                            <label className="block text-xs text-neutral-500 mb-0.5">Tipo do material</label>
                            <select
                              value={materialForm.type ?? 'pdf'}
                              onChange={(e) =>
                                setMaterialForm((f) => ({
                                  ...f,
                                  type: e.target.value as LessonMaterial['type'],
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-emerald-500 focus:outline-none"
                            >
                              {MATERIAL_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Upload ou URL */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => materialFileRef.current?.click()}
                              disabled={isUploadingMaterial}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
                            >
                              {isUploadingMaterial ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Upload (PDF, imagem…)
                                </>
                              )}
                            </button>
                            <span className="text-xs text-neutral-400">ou cole a URL abaixo</span>
                          </div>
                          <input
                            ref={materialFileRef}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.xlsx,.xls,.doc,.docx,.csv,.txt"
                            onChange={handleMaterialFileUpload}
                            className="hidden"
                          />
                          <input
                            type="url"
                            placeholder="URL do arquivo ou link externo"
                            value={materialForm.file_url ?? ''}
                            onChange={(e) => setMaterialForm((f) => ({ ...f, file_url: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-emerald-500 focus:outline-none"
                            required
                          />
                          {materialForm.file_size_bytes ? (
                            <p className="text-xs text-neutral-400">
                              Tamanho: {(materialForm.file_size_bytes / 1024).toFixed(1)} KB
                            </p>
                          ) : null}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={closeMaterialForm}
                            className="px-3 py-1.5 text-sm rounded-lg border hover:bg-neutral-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isUploadingMaterial}
                            className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {editingMaterial ? 'Atualizar' : 'Salvar Material'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete course */}
      <div className="pt-8 border-t border-neutral-200">
        <button
          onClick={handleDeleteCourse}
          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Excluir Curso
        </button>
      </div>
    </div>
  );
}
