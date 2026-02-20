// src/app/admin/customizacao/BannersTab.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Monitor,
  Smartphone,
  Link2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  ExternalLink,
  Pencil,
  Upload,
  Loader2,
  ShoppingBag,
  Globe,
  Ban,
  Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data';
import type { Product } from '@/types/product';

type Banner = Database['public']['Tables']['banners']['Row'];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

interface BannerForm {
  title: string;
  alt_text: string;
  desktop_image_url: string;
  mobile_image_url: string;
  link_url: string;
}

const EMPTY_FORM: BannerForm = {
  title: '',
  alt_text: '',
  desktop_image_url: '',
  mobile_image_url: '',
  link_url: '',
};

// ─── Componente de Upload de Imagem ──────────────────

function ImageUploader({
  label,
  hint,
  icon: Icon,
  currentUrl,
  onUpload,
  uploadPath,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  currentUrl: string;
  onUpload: (url: string) => void;
  uploadPath: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WebP).');
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
      const fileName = `${uploadPath}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        alert(`Erro no upload: ${error.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      onUpload(urlData.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <p className="text-xs text-neutral-400 mb-2">{hint}</p>

      {currentUrl ? (
        <div className="relative group">
          <div className={`rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 ${
            uploadPath.includes('desktop') ? 'aspect-[1920/800]' : 'aspect-[1080/1350] max-w-[240px]'
          }`}>
            <img
              src={currentUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-white">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Trocar imagem</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-colors
            flex flex-col items-center justify-center py-10 px-6
            ${dragOver
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-neutral-300 bg-neutral-50 hover:border-emerald-400 hover:bg-emerald-50/50'
            }
            ${uploadPath.includes('desktop') ? 'aspect-[1920/800] max-h-[200px]' : 'aspect-[1080/1350] max-w-[240px] max-h-[300px]'}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
              <p className="text-sm text-emerald-600 font-medium">Enviando...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-600 font-medium">
                Arraste a imagem aqui
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                ou clique para selecionar (JPG, PNG, WebP — max 5MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

// ─── Seletor de Link (Produto / URL / Nenhum) ────────

type LinkMode = 'none' | 'product' | 'custom';

function LinkSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const getMode = (): LinkMode => {
    if (!value) return 'none';
    if (value.startsWith('/produtos/')) return 'product';
    return 'custom';
  };

  const [mode, setMode] = useState<LinkMode>(getMode);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        setProducts(MOCK_PRODUCTS);
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (mode === 'product') {
      loadProducts();
    }
  }, [mode]);

  const handleModeChange = (newMode: LinkMode) => {
    setMode(newMode);
    if (newMode === 'none') {
      onChange('');
    } else if (newMode === 'custom') {
      if (!value || value.startsWith('/produtos/')) {
        onChange('');
      }
    }
  };

  const selectedHandle = value.startsWith('/produtos/')
    ? value.replace('/produtos/', '')
    : '';

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
        <Link2 className="w-4 h-4" />
        Link ao clicar (opcional)
      </label>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleModeChange('none')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            mode === 'none'
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <Ban className="w-4 h-4" />
          Sem link
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('product')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            mode === 'product'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-emerald-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Produto da loja
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('custom')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            mode === 'custom'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-blue-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          URL personalizada
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'product' && (
          <motion.div
            key="product"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {isLoadingProducts ? (
              <div className="flex items-center gap-2 py-4 text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando produtos...</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((product) => {
                  const isSelected = selectedHandle === product.handle;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => onChange(`/produtos/${product.handle}`)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      {product.featuredImage && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.alt}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 text-sm truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          A partir de R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {value && (
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {value}
              </p>
            )}
          </motion.div>
        )}

        {mode === 'custom' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/pagina-destino ou https://exemplo.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Use caminhos relativos (ex: /sobre) ou URLs completas (ex: https://...)
            </p>
          </motion.div>
        )}

        {mode === 'none' && (
          <motion.div
            key="none"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <p className="text-sm text-neutral-400 py-2">
              O banner não será clicável.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────

export function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const loadBanners = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('"order"', { ascending: true });

    if (!error && data) {
      setBanners(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleCreate = async () => {
    if (!form.title || !form.desktop_image_url || !form.mobile_image_url) {
      alert('Preencha o título e faça upload das duas imagens (desktop e mobile).');
      return;
    }
    setIsSaving(true);

    const supabase = createClient();
    const maxOrder = banners.length > 0
      ? Math.max(...banners.map(b => b.order)) + 1
      : 0;

    const { error } = await supabase.from('banners').insert({
      title: form.title,
      alt_text: form.alt_text || form.title,
      desktop_image_url: form.desktop_image_url,
      mobile_image_url: form.mobile_image_url,
      link_url: form.link_url || null,
      order: maxOrder,
      is_active: true,
    });

    if (!error) {
      setForm(EMPTY_FORM);
      setIsCreating(false);
      await loadBanners();
    } else {
      alert(`Erro ao criar banner: ${error.message}`);
    }
    setIsSaving(false);
  };

  const startEditing = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      alt_text: banner.alt_text,
      desktop_image_url: banner.desktop_image_url,
      mobile_image_url: banner.mobile_image_url,
      link_url: banner.link_url || '',
    });
    setIsCreating(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !form.title || !form.desktop_image_url || !form.mobile_image_url) return;
    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('banners')
      .update({
        title: form.title,
        alt_text: form.alt_text || form.title,
        desktop_image_url: form.desktop_image_url,
        mobile_image_url: form.mobile_image_url,
        link_url: form.link_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId);

    if (!error) {
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadBanners();
    }
    setIsSaving(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
  };

  const toggleActive = async (banner: Banner) => {
    const supabase = createClient();
    await supabase
      .from('banners')
      .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
      .eq('id', banner.id);
    await loadBanners();
  };

  const deleteBanner = async (banner: Banner) => {
    if (!confirm('Tem certeza que deseja excluir este banner? A imagem também será removida.')) return;

    const supabase = createClient();
    for (const url of [banner.desktop_image_url, banner.mobile_image_url]) {
      if (url.includes(SUPABASE_URL)) {
        const path = url.split('/storage/v1/object/public/banners/')[1];
        if (path) {
          await supabase.storage.from('banners').remove([path]);
        }
      }
    }

    await supabase.from('banners').delete().eq('id', banner.id);
    await loadBanners();
  };

  const moveBanner = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const supabase = createClient();
    const current = banners[index];
    const target = banners[targetIndex];

    await Promise.all([
      supabase.from('banners').update({ order: target.order }).eq('id', current.id),
      supabase.from('banners').update({ order: current.order }).eq('id', target.id),
    ]);

    await loadBanners();
  };

  const uploadId = editingId || `new-${Date.now()}`;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Banners da Home</h2>
          <p className="text-sm text-neutral-500">
            Gerencie o carousel — faça upload das imagens para Desktop e Mobile
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Banner
          </button>
        )}
      </div>

      {/* Formulário (Criar ou Editar) */}
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
                  {editingId ? 'Editar Banner' : 'Novo Banner'}
                </h3>
                <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-neutral-100">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Título do Banner *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Promoção de Verão"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Texto Alternativo (acessibilidade)
                  </label>
                  <input
                    type="text"
                    value={form.alt_text}
                    onChange={(e) => setForm(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Descrição da imagem para leitores de tela"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <ImageUploader
                  label="Imagem Desktop *"
                  hint="Proporção 1920 x 800px (paisagem)"
                  icon={Monitor}
                  currentUrl={form.desktop_image_url}
                  uploadPath={`desktop/${uploadId}`}
                  onUpload={(url) => setForm(prev => ({ ...prev, desktop_image_url: url }))}
                />
                <ImageUploader
                  label="Imagem Mobile *"
                  hint="Proporção 1080 x 1350px (retrato)"
                  icon={Smartphone}
                  currentUrl={form.mobile_image_url}
                  uploadPath={`mobile/${uploadId}`}
                  onUpload={(url) => setForm(prev => ({ ...prev, mobile_image_url: url }))}
                />
              </div>

              <LinkSelector
                value={form.link_url}
                onChange={(url) => setForm(prev => ({ ...prev, link_url: url }))}
              />

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isSaving || !form.title || !form.desktop_image_url || !form.mobile_image_url}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Salvando...' : editingId ? 'Atualizar Banner' : 'Criar Banner'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Banners */}
      <div className="space-y-3">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border transition-colors ${
              !banner.is_active
                ? 'border-neutral-200 opacity-60'
                : 'border-neutral-200'
            }`}
          >
            <div className="flex items-stretch">
              <div className="flex items-center gap-3 p-4 border-r border-neutral-100">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveBanner(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  </button>
                  <div className="flex items-center justify-center">
                    <GripVertical className="w-4 h-4 text-neutral-300" />
                  </div>
                  <button
                    onClick={() => moveBanner(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                <div className="hidden sm:block">
                  <p className="text-[10px] text-neutral-400 mb-1 text-center">Desktop</p>
                  <div className="relative w-36 aspect-[1920/800] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                    <Image
                      src={banner.desktop_image_url}
                      alt={banner.alt_text}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                </div>

                <div className="hidden sm:block">
                  <p className="text-[10px] text-neutral-400 mb-1 text-center">Mobile</p>
                  <div className="relative w-12 aspect-[1080/1350] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                    <Image
                      src={banner.mobile_image_url}
                      alt={banner.alt_text}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900 truncate">{banner.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      banner.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {banner.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-500">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 truncate">{banner.alt_text}</p>
                  {banner.link_url && (
                    <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                      {banner.link_url.startsWith('/produtos/') ? (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          {MOCK_PRODUCTS.find(p => `/produtos/${p.handle}` === banner.link_url)?.title || banner.link_url}
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3 h-3" />
                          {banner.link_url}
                        </>
                      )}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`p-2 rounded-lg hover:bg-neutral-100 transition-colors ${
                      banner.is_active ? 'text-emerald-600' : 'text-neutral-400'
                    }`}
                    title={banner.is_active ? 'Desativar' : 'Ativar'}
                  >
                    {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEditing(banner)}
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBanner(banner)}
                    className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-2">Nenhum banner cadastrado</p>
            <button
              onClick={() => { setIsCreating(true); setForm(EMPTY_FORM); }}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Criar primeiro banner
            </button>
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Tamanhos recomendados:</strong> Desktop <strong>1920 x 800px</strong> | Mobile <strong>1080 x 1350px</strong>.
          Formatos aceitos: JPG, PNG, WebP (max 5MB). As imagens são armazenadas no Supabase Storage.
        </p>
      </div>
    </div>
  );
}
