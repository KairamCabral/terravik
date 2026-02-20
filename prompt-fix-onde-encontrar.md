# CORREÇÃO - PÁGINA "ONDE ENCONTRAR"

## PROBLEMAS IDENTIFICADOS

### 1. Imagens não encontradas (400 Bad Request)
```
GET /lojas/carrefour.png 400 (Bad Request)
GET /lojas/amazon.png 400 (Bad Request)
GET /lojas/madeira-madeira.png 400 (Bad Request)
GET /lojas/magalu.png 400 (Bad Request)
GET /lojas/mercado-livre.png 400 (Bad Request)
```
**Causa:** As imagens estão sendo referenciadas mas não existem na pasta `public/lojas/`

### 2. Erro de Hydration
```
Hydration failed because the initial UI does not match what was rendered on the server
```
**Causa:** Provavelmente algum componente usando `useState` ou dados dinâmicos que diferem entre server e client

---

# SOLUÇÃO COMPLETA

## PASSO 1: Criar pasta e placeholder para imagens

Primeiro, crie a pasta `public/lojas/` se não existir.

Opção A: Usar imagens reais das lojas
Opção B: Remover referência às imagens e usar ícones/iniciais

---

## PASSO 2: Corrigir o componente da página

Substitua o conteúdo de `src/app/(public)/onde-encontrar/page.tsx` (ou similar) por:

```tsx
// src/app/(public)/onde-encontrar/page.tsx

import { Metadata } from 'next';
import { OndeEncontrarContent } from '@/components/onde-encontrar/OndeEncontrarContent';

export const metadata: Metadata = {
  title: 'Onde Encontrar | Terravik',
  description: 'Encontre os produtos Terravik nas melhores lojas do Brasil',
};

export default function OndeEncontrarPage() {
  return <OndeEncontrarContent />;
}
```

---

## PASSO 3: Criar componente Client separado

Crie o arquivo `src/components/onde-encontrar/OndeEncontrarContent.tsx`:

```tsx
// src/components/onde-encontrar/OndeEncontrarContent.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  ExternalLink,
  Phone,
  Clock,
  Navigation,
  Store,
  ShoppingBag,
  Globe,
  ChevronDown,
  Loader2,
} from 'lucide-react';

// Tipos
interface Loja {
  id: string;
  nome: string;
  tipo: 'online' | 'fisica';
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  website?: string;
  horario?: string;
  logo?: string;
  destaque?: boolean;
}

// Dados mock das lojas (em produção, buscar do Supabase)
const LOJAS_ONLINE: Loja[] = [
  {
    id: '1',
    nome: 'Amazon',
    tipo: 'online',
    website: 'https://www.amazon.com.br',
    destaque: true,
  },
  {
    id: '2',
    nome: 'Mercado Livre',
    tipo: 'online',
    website: 'https://www.mercadolivre.com.br',
    destaque: true,
  },
  {
    id: '3',
    nome: 'Magazine Luiza',
    tipo: 'online',
    website: 'https://www.magazineluiza.com.br',
    destaque: true,
  },
  {
    id: '4',
    nome: 'Carrefour',
    tipo: 'online',
    website: 'https://www.carrefour.com.br',
  },
  {
    id: '5',
    nome: 'MadeiraMadeira',
    tipo: 'online',
    website: 'https://www.madeiramadeira.com.br',
  },
];

const LOJAS_FISICAS: Loja[] = [
  {
    id: '101',
    nome: 'Garden Center Terravik',
    tipo: 'fisica',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '(11) 99999-9999',
    horario: 'Seg-Sáb: 8h-18h',
    destaque: true,
  },
  {
    id: '102',
    nome: 'Agropecuária Verde Campo',
    tipo: 'fisica',
    endereco: 'Rua das Flores, 500',
    cidade: 'Campinas',
    estado: 'SP',
    telefone: '(19) 98888-8888',
    horario: 'Seg-Sex: 8h-17h',
  },
  {
    id: '103',
    nome: 'Casa & Jardim',
    tipo: 'fisica',
    endereco: 'Av. Brasil, 2000',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    telefone: '(21) 97777-7777',
    horario: 'Seg-Sáb: 9h-19h',
  },
];

const ESTADOS = [
  'Todos',
  'SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'GO', 'DF',
];

export function OndeEncontrarContent() {
  // Estados com valores iniciais fixos para evitar hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'online' | 'fisica'>('online');
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(false);

  // Marcar como mounted após o primeiro render (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtrar lojas
  const lojasFiltradas = activeTab === 'online'
    ? LOJAS_ONLINE.filter(loja =>
        loja.nome.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : LOJAS_FISICAS.filter(loja => {
        const matchSearch = loja.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loja.cidade?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEstado = estadoFilter === 'Todos' || loja.estado === estadoFilter;
        return matchSearch && matchEstado;
      });

  // Função para obter iniciais da loja (substitui imagem)
  const getLojaInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Função para obter cor baseada no nome
  const getLojaColor = (nome: string) => {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-rose-500',
      'bg-teal-500',
      'bg-indigo-500',
    ];
    const index = nome.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Skeleton para loading inicial
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-neutral-200 rounded-xl w-64 mx-auto" />
            <div className="h-6 bg-neutral-200 rounded w-96 mx-auto" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-neutral-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Onde Encontrar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto"
          >
            Encontre os produtos Terravik nas melhores lojas do Brasil
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-neutral-200">
            <button
              onClick={() => setActiveTab('online')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${activeTab === 'online'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
                }
              `}
            >
              <Globe className="w-5 h-5" />
              Lojas Online
            </button>
            <button
              onClick={() => setActiveTab('fisica')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${activeTab === 'fisica'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
                }
              `}
            >
              <Store className="w-5 h-5" />
              Lojas Físicas
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'online' ? 'Buscar loja...' : 'Buscar por nome ou cidade...'}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Estado Filter (apenas para lojas físicas) */}
          {activeTab === 'fisica' && (
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado === 'Todos' ? 'Todos os estados' : estado}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Lojas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lojasFiltradas.map((loja, index) => (
            <motion.div
              key={loja.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow
                ${loja.destaque ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-neutral-200'}
              `}
            >
              {/* Header com "logo" (iniciais) */}
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {/* Logo placeholder com iniciais */}
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg
                    ${getLojaColor(loja.nome)}
                  `}>
                    {getLojaInitials(loja.nome)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-neutral-900">{loja.nome}</h3>
                      {loja.destaque && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {loja.tipo === 'online' ? 'Loja Online' : `${loja.cidade}, ${loja.estado}`}
                    </p>
                  </div>
                </div>

                {/* Info para lojas físicas */}
                {loja.tipo === 'fisica' && (
                  <div className="mt-4 space-y-2">
                    {loja.endereco && (
                      <p className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        {loja.endereco}
                      </p>
                    )}
                    {loja.telefone && (
                      <p className="flex items-center gap-2 text-sm text-neutral-600">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        {loja.telefone}
                      </p>
                    )}
                    {loja.horario && (
                      <p className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        {loja.horario}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
                {loja.tipo === 'online' ? (
                  <a
                    href={loja.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Visitar Loja
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${loja.telefone?.replace(/\D/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`${loja.nome} ${loja.endereco} ${loja.cidade} ${loja.estado}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Como Chegar
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {lojasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Nenhuma loja encontrada
            </h3>
            <p className="text-neutral-500">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Quer vender produtos Terravik?
            </h3>
            <p className="text-neutral-600 mb-4">
              Seja um revendedor autorizado e faça parte da nossa rede
            </p>
            <a
              href="/contato?assunto=revenda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Quero ser revendedor
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## PASSO 4: Criar a pasta de componentes (se não existir)

```bash
mkdir -p src/components/onde-encontrar
```

---

## RESUMO DAS MUDANÇAS

### Problema 1: Imagens não encontradas
**Solução:** Removemos a dependência de imagens das lojas e usamos iniciais coloridas como placeholder. Isso:
- Elimina erros 400
- Não precisa criar/baixar logos
- Fica visualmente agradável

### Problema 2: Hydration Mismatch
**Solução:** 
1. Separamos a página em Server Component (page.tsx) + Client Component (OndeEncontrarContent.tsx)
2. Adicionamos `mounted` state para garantir que o conteúdo dinâmico só renderize no client
3. Mostramos skeleton durante o primeiro render

---

## ALTERNATIVA: Se quiser usar imagens reais

Se preferir manter as imagens das lojas:

1. Crie a pasta `public/lojas/`
2. Adicione as imagens com os nomes corretos:
   - `public/lojas/amazon.png`
   - `public/lojas/carrefour.png`
   - `public/lojas/magalu.png`
   - `public/lojas/mercado-livre.png`
   - `public/lojas/madeira-madeira.png`

3. Use URLs externas (mais fácil):
```tsx
const LOJAS_ONLINE = [
  {
    id: '1',
    nome: 'Amazon',
    tipo: 'online',
    website: 'https://www.amazon.com.br',
    logo: 'https://logo.clearbit.com/amazon.com.br', // API de logos
  },
  // ...
];
```

---

## COMANDO PARA O CURSOR

```
Corrija a página "Onde Encontrar" que está com dois erros:

1. ERRO DE IMAGENS: As imagens das lojas (/lojas/*.png) não existem.
   Solução: Remova as referências às imagens e use iniciais coloridas como placeholder.

2. ERRO DE HYDRATION: "Hydration failed because the initial UI does not match..."
   Solução: Separe em Server Component + Client Component e use estado "mounted".

Crie/atualize os arquivos:
- src/app/(public)/onde-encontrar/page.tsx (Server Component simples)
- src/components/onde-encontrar/OndeEncontrarContent.tsx (Client Component com toda a lógica)

Use o padrão de mostrar skeleton até o componente estar mounted no client.
```
