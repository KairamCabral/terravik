// src/app/admin/customizacao/VideoTestimonialsTab.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Save,
  X,
  Pencil,
  Upload,
  Loader2,
  Video,
  Play,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface VideoTestimonial {
  id: string;
  handle: string;
  thumbnail_url: string;
  video_url: string | null;
  product_name: string;
  order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface VideoForm {
  handle: string;
  thumbnail_url: string;
  video_url: string;
  product_name: string;
}

const EMPTY_FORM: VideoForm = {
  handle: '',
  thumbnail_url: '',
  video_url: '',
  product_name: '',
};

// ─── Upload de Thumbnail ────────────────────────────

function ThumbnailUploader({
  currentUrl,
  onUpload,
  uploadId,
}: {
  currentUrl: string;
  onUpload: (url: string) => void;
  uploadId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `video-testimonials/${uploadId}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('banners')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) {
        alert(`Erro no upload: ${error.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      onUpload(urlData.publicUrl);
    } catch {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Thumbnail (imagem de capa) *
      </label>
      <p className="text-xs text-neutral-400 mb-2">Formato 9:16 (vertical, tipo Reels)</p>

      {currentUrl ? (
        <div className="relative group w-32">
          <div className="aspect-[9/16] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
            <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-white">
              <Upload className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs font-medium">Trocar</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-32 aspect-[9/16] cursor-pointer rounded-xl border-2 border-dashed transition-colors
            flex flex-col items-center justify-center
            ${dragOver
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-neutral-300 bg-neutral-50 hover:border-emerald-400'
            }
          `}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-neutral-400 mb-1" />
              <p className="text-[10px] text-neutral-500 text-center px-2">Arraste ou clique</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        className="hidden"
      />
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────

export function VideoTestimonialsTab() {
  const [items, setItems] = useState<VideoTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<VideoForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await (supabase as any)
      .from('video_testimonials')
      .select('*')
      .order('"order"', { ascending: true });

    if (data) setItems(data as VideoTestimonial[]);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.handle || !form.thumbnail_url || !form.product_name) {
      alert('Preencha o @handle, faça upload da thumbnail e informe o produto.');
      return;
    }
    setIsSaving(true);
    const supabase = createClient();
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;

    const { error } = await (supabase as any).from('video_testimonials').insert({
      handle: form.handle,
      thumbnail_url: form.thumbnail_url,
      video_url: form.video_url || null,
      product_name: form.product_name,
      order: maxOrder,
      is_active: true,
    });

    if (!error) {
      setForm(EMPTY_FORM);
      setIsCreating(false);
      await load();
    } else {
      alert(`Erro: ${error.message}`);
    }
    setIsSaving(false);
  };

  const startEditing = (item: VideoTestimonial) => {
    setEditingId(item.id);
    setForm({
      handle: item.handle,
      thumbnail_url: item.thumbnail_url,
      video_url: item.video_url || '',
      product_name: item.product_name,
    });
    setIsCreating(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !form.handle || !form.thumbnail_url || !form.product_name) return;
    setIsSaving(true);
    const supabase = createClient();

    const { error } = await (supabase as any)
      .from('video_testimonials')
      .update({
        handle: form.handle,
        thumbnail_url: form.thumbnail_url,
        video_url: form.video_url || null,
        product_name: form.product_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId);

    if (!error) {
      setEditingId(null);
      setForm(EMPTY_FORM);
      await load();
    }
    setIsSaving(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
  };

  const toggleActive = async (item: VideoTestimonial) => {
    const supabase = createClient();
    await (supabase as any)
      .from('video_testimonials')
      .update({ is_active: !item.is_active, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    await load();
  };

  const deleteItem = async (item: VideoTestimonial) => {
    if (!confirm(`Excluir o depoimento de ${item.handle}?`)) return;
    const supabase = createClient();
    await (supabase as any).from('video_testimonials').delete().eq('id', item.id);
    await load();
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const supabase = createClient();
    const current = items[index];
    const target = items[targetIndex];

    const db = supabase as any;
    await Promise.all([
      db.from('video_testimonials').update({ order: target.order }).eq('id', current.id),
      db.from('video_testimonials').update({ order: current.order }).eq('id', target.id),
    ]);
    await load();
  };

  const uploadId = editingId || `new-${Date.now()}`;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Vídeos Depoimentos</h2>
          <p className="text-sm text-neutral-500">
            Seção &ldquo;Resultados reais&rdquo; — vídeos estilo Reels com thumbnail
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Vídeo
          </button>
        )}
      </div>

      {/* Formulário */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {editingId ? 'Editar Vídeo Depoimento' : 'Novo Vídeo Depoimento'}
                </h3>
                <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-neutral-100">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="grid md:grid-cols-[1fr_1fr_auto] gap-6">
                {/* Campos */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      @Handle (Instagram) *
                    </label>
                    <input
                      type="text"
                      value={form.handle}
                      onChange={(e) => setForm(prev => ({ ...prev, handle: e.target.value }))}
                      placeholder="@usuario_exemplo"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Produto utilizado *
                    </label>
                    <input
                      type="text"
                      value={form.product_name}
                      onChange={(e) => setForm(prev => ({ ...prev, product_name: e.target.value }))}
                      placeholder="Ex: Gramado Novo — 1 kg"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    URL do vídeo (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.video_url}
                    onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://... (.mp4, YouTube, etc)"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Se vazio, será exibido apenas a thumbnail com ícone de play
                  </p>
                </div>

                {/* Thumbnail */}
                <ThumbnailUploader
                  currentUrl={form.thumbnail_url}
                  onUpload={(url) => setForm(prev => ({ ...prev, thumbnail_url: url }))}
                  uploadId={uploadId}
                />
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isSaving || !form.handle || !form.thumbnail_url || !form.product_name}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border transition-colors ${
              !item.is_active ? 'border-neutral-200 opacity-60' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Reorder */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                </button>
                <GripVertical className="w-4 h-4 text-neutral-300 mx-auto" />
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="relative w-16 aspect-[9/16] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
                <Image src={item.thumbnail_url} alt={item.handle} fill className="object-cover" sizes="64px" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900">{item.handle}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">{item.product_name}</p>
                {item.video_url && (
                  <p className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                    <Video className="w-3 h-3" />
                    Vídeo vinculado
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`p-2 rounded-lg hover:bg-neutral-100 transition-colors ${
                    item.is_active ? 'text-emerald-600' : 'text-neutral-400'
                  }`}
                  title={item.is_active ? 'Desativar' : 'Ativar'}
                >
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startEditing(item)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteItem(item)}
                  className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <Video className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-2">Nenhum vídeo depoimento cadastrado</p>
            <button
              onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar primeiro vídeo
            </button>
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Use thumbnails no formato 9:16 (vertical, estilo Reels/Stories).
          Esses vídeos aparecem na seção &ldquo;Resultados reais&rdquo; da home.
        </p>
      </div>
    </div>
  );
}
