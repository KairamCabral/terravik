// src/app/admin/customizacao/PhotoTestimonialsTab.tsx
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
  Camera,
  Star,
  MapPin,
  Quote,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PhotoTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  months: number;
  image_url: string;
  order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface PhotoForm {
  name: string;
  location: string;
  rating: number;
  text: string;
  months: number;
  image_url: string;
}

const EMPTY_FORM: PhotoForm = {
  name: '',
  location: '',
  rating: 5,
  text: '',
  months: 1,
  image_url: '',
};

// ─── Upload de Foto ─────────────────────────────────

function PhotoUploader({
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
      const fileName = `photo-testimonials/${uploadId}-${Date.now()}.${ext}`;

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
        Foto do gramado *
      </label>
      <p className="text-xs text-neutral-400 mb-2">Foto do resultado do gramado do cliente</p>

      {currentUrl ? (
        <div className="relative group w-48">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
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
            w-48 aspect-[4/3] cursor-pointer rounded-xl border-2 border-dashed transition-colors
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

// ─── Seletor de Estrelas ────────────────────────────

function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Avaliação *
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-neutral-200 text-neutral-200'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────

export function PhotoTestimonialsTab() {
  const [items, setItems] = useState<PhotoTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<PhotoForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await (supabase as any)
      .from('photo_testimonials')
      .select('*')
      .order('"order"', { ascending: true });

    if (data) setItems(data as PhotoTestimonial[]);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.name || !form.text || !form.image_url || !form.location) {
      alert('Preencha o nome, localização, depoimento e faça upload da foto.');
      return;
    }
    setIsSaving(true);
    const supabase = createClient();
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;

    const { error } = await (supabase as any).from('photo_testimonials').insert({
      name: form.name,
      location: form.location,
      rating: form.rating,
      text: form.text,
      months: form.months,
      image_url: form.image_url,
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

  const startEditing = (item: PhotoTestimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      location: item.location,
      rating: item.rating,
      text: item.text,
      months: item.months,
      image_url: item.image_url,
    });
    setIsCreating(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !form.name || !form.text || !form.image_url) return;
    setIsSaving(true);
    const supabase = createClient();

    const { error } = await (supabase as any)
      .from('photo_testimonials')
      .update({
        name: form.name,
        location: form.location,
        rating: form.rating,
        text: form.text,
        months: form.months,
        image_url: form.image_url,
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

  const toggleActive = async (item: PhotoTestimonial) => {
    const supabase = createClient();
    await (supabase as any)
      .from('photo_testimonials')
      .update({ is_active: !item.is_active, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    await load();
  };

  const deleteItem = async (item: PhotoTestimonial) => {
    if (!confirm(`Excluir o depoimento de ${item.name}?`)) return;
    const supabase = createClient();
    await (supabase as any).from('photo_testimonials').delete().eq('id', item.id);
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
      db.from('photo_testimonials').update({ order: target.order }).eq('id', current.id),
      db.from('photo_testimonials').update({ order: current.order }).eq('id', target.id),
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
          <h2 className="text-lg font-semibold text-neutral-900">Fotos Depoimentos</h2>
          <p className="text-sm text-neutral-500">
            Seção &ldquo;O que dizem nossos clientes&rdquo; — cards com foto, texto e avaliação
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Depoimento
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
                  {editingId ? 'Editar Depoimento' : 'Novo Depoimento'}
                </h3>
                <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-neutral-100">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-6">
                {/* Campos */}
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Nome do cliente *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Carlos Silva"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Localização *
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Ex: São Paulo, SP"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Depoimento *
                    </label>
                    <textarea
                      value={form.text}
                      onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="O que o cliente disse sobre o produto..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <RatingSelector
                      value={form.rating}
                      onChange={(v) => setForm(prev => ({ ...prev, rating: v }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Há quantos meses? *
                      </label>
                      <input
                        type="number"
                        value={form.months}
                        onChange={(e) => setForm(prev => ({ ...prev, months: parseInt(e.target.value) || 1 }))}
                        min={1}
                        max={120}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Foto */}
                <PhotoUploader
                  currentUrl={form.image_url}
                  onUpload={(url) => setForm(prev => ({ ...prev, image_url: url }))}
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
                  disabled={isSaving || !form.name || !form.text || !form.image_url || !form.location}
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

              {/* Foto */}
              <div className="relative w-20 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span className="text-xs text-neutral-400">Há {item.months} meses</span>
                </div>
                <p className="text-sm text-neutral-500 mt-1 truncate">
                  <Quote className="w-3 h-3 inline mr-1 text-neutral-300" />
                  {item.text}
                </p>
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
            <Camera className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-2">Nenhum depoimento com foto cadastrado</p>
            <button
              onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar primeiro depoimento
            </button>
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Fotos no formato 4:3 (paisagem) ficam melhores nos cards.
          Esses depoimentos aparecem na seção &ldquo;O que dizem nossos clientes&rdquo; da home.
        </p>
      </div>
    </div>
  );
}
