'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Palette, Upload, X, Loader2 } from 'lucide-react';
import { saveCourse, generateSlug } from '@/lib/academia/api';
import type { Course, Difficulty } from '@/lib/academia/types';
import { DIFFICULTY_CONFIG } from '@/lib/academia/types';

const DIFFICULTY_OPTIONS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export default function NovoCursoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLandscape, setIsUploadingLandscape] = useState(false);
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slugLocked, setSlugLocked] = useState(false);
  const landscapeInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Partial<Course>>({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    icon: '📚',
    color: '#22C55E',
    difficulty: 'beginner',
    estimated_duration_min: null,
    tags: [],
    thumbnail_url: '',
    trailer_url: '',
    badge_title: '',
    badge_icon: '',
    is_featured: false,
    is_published: false,
  });

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
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setMessage({ type: 'error', text: 'Título é obrigatório.' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        tags: form.tags?.length ? form.tags : [],
        thumbnail_url: form.thumbnail_url || null,
        trailer_url: form.trailer_url || null,
        subtitle: form.subtitle || null,
        description: form.description || null,
        icon: form.icon || null,
        color: form.color || null,
        badge_title: form.badge_title || null,
        badge_icon: form.badge_icon || null,
      };
      const saved = await saveCourse(payload);
      setMessage({ type: 'success', text: 'Curso criado com sucesso!' });
      router.push(`/admin/cursos/${saved.id}`);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao salvar curso. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cursos"
          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Novo Curso</h1>
          <p className="text-neutral-500 text-sm">Preencha os dados do curso</p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
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
                placeholder="Ex: Introdução à Agricultura Regenerativa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug (URL)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug ?? ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  onFocus={() => setSlugLocked(true)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="introducao-agricultura-regenerativa"
                />
                <button
                  type="button"
                  onClick={() => setSlugLocked(false)}
                  className="px-3 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm text-neutral-600"
                >
                  Regenerar
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Gerado automaticamente a partir do título</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Subtítulo</label>
              <input
                type="text"
                value={form.subtitle ?? ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Curta descrição do curso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                placeholder="Descrição completa do curso..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={(form.tags ?? []).join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="agricultura, regenerativa, solo"
              />
            </div>
          </div>
        </section>

        {/* Visual */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-600" />
            Visual
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Ícone (emoji)</label>
                <input
                  type="text"
                  value={form.icon ?? ''}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="📚"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Cor</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color ?? '#22C55E'}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-neutral-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color ?? '#22C55E'}
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">URL do Trailer (YouTube/Vimeo)</label>
              <input
                type="url"
                value={form.trailer_url ?? ''}
                onChange={(e) => handleChange('trailer_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="https://youtube.com/..."
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
                  placeholder="Ex: Certificado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Badge - Ícone</label>
                <input
                  type="text"
                  value={form.badge_icon ?? ''}
                  onChange={(e) => handleChange('badge_icon', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="🏆"
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">Duração estimada (minutos)</label>
              <input
                type="number"
                min={0}
                value={form.estimated_duration_min ?? ''}
                onChange={(e) =>
                  handleChange('estimated_duration_min', e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="120"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published ?? false}
                  onChange={(e) => handleChange('is_published', e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-neutral-700">Publicado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured ?? false}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-neutral-700">Destaque</span>
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Salvando...' : 'Salvar Curso'}
          </button>
        </div>
      </form>
    </div>
  );
}
