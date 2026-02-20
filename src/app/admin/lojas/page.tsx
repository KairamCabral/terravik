// src/app/admin/lojas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Globe,
  Edit,
  Trash2,
  Eye,
  Map,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Store = Database['public']['Tables']['stores']['Row'];

const STORE_TYPE_LABELS: Record<string, string> = {
  garden_center: 'Garden Center',
  pet_shop: 'Pet Shop',
  agricultural: 'Agropecuária',
  online: 'Online',
  other: 'Outro',
};

const STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    loadStores();
  }, [stateFilter]);

  const loadStores = async () => {
    const supabase = createClient();

    let query = supabase
      .from('stores')
      .select('*')
      .order('name', { ascending: true });

    if (stateFilter) {
      query = query.eq('state', stateFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setStores(data);
    }
    setIsLoading(false);
  };

  const toggleActive = async (storeId: string, isActive: boolean) => {
    const supabase = createClient();

    await supabase
      .from('stores')
      .update({ is_active: !isActive })
      .eq('id', storeId);

    loadStores();
  };

  const deleteStore = async (storeId: string) => {
    if (!confirm('Tem certeza que deseja excluir este ponto de venda?')) {
      return;
    }

    const supabase = createClient();
    await supabase.from('stores').delete().eq('id', storeId);
    loadStores();
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pontos de Venda</h1>
          <p className="text-neutral-500">
            {stores.length} {stores.length === 1 ? 'ponto cadastrado' : 'pontos cadastrados'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/lojas/mapa"
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
          >
            <Map className="w-5 h-5" />
            Ver Mapa
          </Link>
          <Link
            href="/admin/lojas/nova"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Ponto de Venda
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Todos os estados</option>
          {STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Stores Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
          >
            {/* Logo/Header */}
            <div className="relative h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              {store.logo_url ? (
                <Image
                  src={store.logo_url}
                  alt={store.name}
                  width={64}
                  height={64}
                  className="object-contain max-h-16 w-auto"
                />
              ) : (
                <MapPin className="w-12 h-12 text-emerald-400" />
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-neutral-900 mb-1">{store.name}</h3>

              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  {store.city}, {store.state}
                </p>
                {store.phone && (
                  <p className="flex items-center gap-2 text-sm text-neutral-600">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    {store.phone}
                  </p>
                )}
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <Globe className="w-4 h-4" />
                    Ver site
                  </a>
                )}
              </div>

              {/* Type badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                  {store.type ? STORE_TYPE_LABELS[store.type] || store.type : 'Não definido'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(store.id, store.is_active ?? true)}
                    className={`p-2 rounded-lg hover:bg-neutral-100 ${
                      store.is_active ? 'text-emerald-600' : 'text-neutral-400'
                    }`}
                    title={store.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/admin/lojas/${store.id}`}
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteStore(store.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {filteredStores.length === 0 && (
          <div className="col-span-full text-center py-12">
            <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Nenhum ponto de venda encontrado</p>
            <Link
              href="/admin/lojas/nova"
              className="inline-flex items-center gap-2 mt-4 text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar primeiro ponto de venda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
