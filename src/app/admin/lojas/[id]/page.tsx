// src/app/admin/lojas/[id]/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  MapPin,
  Phone,
  Globe,
  Mail,
  Tag,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Store = Database['public']['Tables']['stores']['Row'];

interface StoreForm {
  name: string;
  slug: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  latitude: string;
  longitude: string;
  type: string;
  tags: string[];
  logo_url: string;
  is_active: boolean;
  is_featured: boolean;
}

const STORE_TYPES = [
  { value: 'garden_center', label: 'Garden Center' },
  { value: 'pet_shop', label: 'Pet Shop' },
  { value: 'agricultural', label: 'Agropecuária' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Outro' },
];

const STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

const AVAILABLE_TAGS = [
  'Entrega',
  'Estacionamento',
  'WhatsApp',
  'Cartão',
  'Pix',
  'Boleto',
  'Loja Oficial',
  'Pronta Entrega',
];

function storeToForm(s: Store): StoreForm {
  return {
    name: s.name ?? '',
    slug: s.slug ?? '',
    phone: s.phone ?? '',
    whatsapp: s.whatsapp ?? '',
    email: s.email ?? '',
    website: s.website ?? '',
    address: s.address ?? '',
    address_number: s.address_number ?? '',
    complement: s.complement ?? '',
    neighborhood: s.neighborhood ?? '',
    city: s.city ?? '',
    state: s.state ?? 'SP',
    cep: s.cep ?? '',
    latitude: s.latitude?.toString() ?? '',
    longitude: s.longitude?.toString() ?? '',
    type: s.type ?? 'garden_center',
    tags: (s.tags as string[]) ?? [],
    logo_url: s.logo_url ?? '',
    is_active: s.is_active ?? true,
    is_featured: s.is_featured ?? false,
  };
}

export default function EditarLojaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<StoreForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isFetchingCEP, setIsFetchingCEP] = useState(false);
  const [error, setError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    setForm((prev) =>
      prev
        ? { ...prev, name, slug: prev.slug || generateSlug(name) }
        : prev
    );
  };

  const handleCEPBlur = async () => {
    if (!form?.cep) return;
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setIsFetchingCEP(true);
    setError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }

      setForm((prev) =>
        prev
          ? {
              ...prev,
              address: data.logradouro || prev.address,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
            }
          : prev
      );
    } catch {
      setError('Erro ao buscar CEP');
    } finally {
      setIsFetchingCEP(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens');
      return;
    }
    if (!form) return;

    setIsUploadingLogo(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `stores/${form.slug || id}-logo.${ext}`;

      const { error } = await supabase.storage
        .from('banners')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      setForm((prev) => (prev ? { ...prev, logo_url: urlData.publicUrl } : prev));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload do logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadStore = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Ponto de venda não encontrado');
        setIsLoading(false);
        return;
      }

      setForm(storeToForm(data));
      setIsLoading(false);
    };

    loadStore();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    setError('');

    if (!form.name || !form.city || !form.state) {
      setError('Preencha os campos obrigatórios: Nome, Cidade e Estado');
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('stores')
        .update({
          name: form.name,
          slug: form.slug || generateSlug(form.name),
          phone: form.phone || null,
          whatsapp: form.whatsapp || null,
          email: form.email || null,
          website: form.website || null,
          address: form.address,
          address_number: form.address_number || null,
          complement: form.complement || null,
          neighborhood: form.neighborhood || null,
          city: form.city,
          state: form.state,
          cep: form.cep || null,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          type: form.type as Database['public']['Enums']['store_type'],
          tags: form.tags,
          logo_url: form.logo_url || null,
          is_active: form.is_active,
          is_featured: form.is_featured,
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/lojas');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar ponto de venda'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/lojas"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-medium">{error || 'Ponto de venda não encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/lojas"
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Editar Ponto de Venda
          </h1>
          <p className="text-neutral-500">{form.name}</p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Informações Básicas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nome do estabelecimento *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Garden Center São Paulo"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Slug (URL amigável)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, slug: e.target.value } : prev))
                }
                placeholder="garden-center-sao-paulo"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Tipo
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, type: e.target.value } : prev))
                }
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {STORE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev ? { ...prev, is_active: e.target.checked } : prev
                    )
                  }
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-neutral-700">Ativo</span>
              </label>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev ? { ...prev, is_featured: e.target.checked } : prev
                    )
                  }
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-neutral-700">Destacado</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Logo
            </label>
            {form.logo_url ? (
              <div className="relative group w-48 h-24">
                {(form.logo_url.startsWith('blob:') || form.logo_url.startsWith('data:')) ? (
                  <img
                    src={form.logo_url}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-xl border border-neutral-200 bg-white p-2"
                  />
                ) : (
                  <Image
                    src={form.logo_url}
                    alt="Logo"
                    fill
                    className="object-contain rounded-xl border border-neutral-200 bg-white p-2"
                    sizes="192px"
                  />
                )}
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="w-48 h-24 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
              >
                {isUploadingLogo ? (
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                    <span className="text-xs text-neutral-500">Clique para enviar</span>
                  </>
                )}
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            <MapPin className="w-5 h-5 inline mr-2" />
            Endereço
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                CEP
              </label>
              <input
                type="text"
                value={form.cep}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, cep: e.target.value } : prev))
                }
                onBlur={handleCEPBlur}
                placeholder="00000-000"
                maxLength={9}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {isFetchingCEP && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Buscando CEP...
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Endereço
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, address: e.target.value } : prev))
                }
                placeholder="Rua, Avenida, etc"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Número
              </label>
              <input
                type="text"
                value={form.address_number}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, address_number: e.target.value } : prev
                  )
                }
                placeholder="123"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Complemento
              </label>
              <input
                type="text"
                value={form.complement}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, complement: e.target.value } : prev
                  )
                }
                placeholder="Apto, Sala, etc"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Bairro
              </label>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, neighborhood: e.target.value } : prev
                  )
                }
                placeholder="Centro"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Cidade *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, city: e.target.value } : prev))
                }
                placeholder="São Paulo"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Estado *
              </label>
              <select
                value={form.state}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, state: e.target.value } : prev))
                }
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Latitude
              </label>
              <input
                type="text"
                value={form.latitude}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, latitude: e.target.value } : prev))
                }
                placeholder="-23.550520"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Longitude
              </label>
              <input
                type="text"
                value={form.longitude}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, longitude: e.target.value } : prev))
                }
                placeholder="-46.633308"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            <Phone className="w-5 h-5 inline mr-2" />
            Contato
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Telefone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, phone: e.target.value } : prev))
                }
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                WhatsApp
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, whatsapp: e.target.value } : prev))
                }
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <Mail className="w-4 h-4 inline mr-1" />
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, email: e.target.value } : prev))
                }
                placeholder="contato@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <Globe className="w-4 h-4 inline mr-1" />
                Site
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, website: e.target.value } : prev))
                }
                placeholder="https://exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            <Tag className="w-5 h-5 inline mr-2" />
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: isSelected
                              ? prev.tags.filter((t) => t !== tag)
                              : [...prev.tags, tag],
                          }
                        : prev
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/lojas"
            className="px-6 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
