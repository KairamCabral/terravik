'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
} from 'lucide-react'

interface Loja {
  id: string
  nome: string
  tipo: 'online' | 'fisica'
  endereco?: string
  cidade?: string
  estado?: string
  telefone?: string
  website?: string
  horario?: string
  logo?: string
  destaque?: boolean
}

const LOJAS_ONLINE: Loja[] = [
  { id: '1', nome: 'Amazon', tipo: 'online', website: 'https://www.amazon.com.br', destaque: true },
  { id: '2', nome: 'Mercado Livre', tipo: 'online', website: 'https://www.mercadolivre.com.br', destaque: true },
  { id: '3', nome: 'Magazine Luiza', tipo: 'online', website: 'https://www.magazineluiza.com.br', destaque: true },
  { id: '4', nome: 'Carrefour', tipo: 'online', website: 'https://www.carrefour.com.br' },
  { id: '5', nome: 'MadeiraMadeira', tipo: 'online', website: 'https://www.madeiramadeira.com.br' },
]

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
]

const ESTADOS = [
  'Todos',
  'SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'GO', 'DF',
]

interface ApiStore {
  id: string
  name: string
  type: string | null
  address?: string
  address_number?: string | null
  city?: string
  state?: string
  phone?: string | null
  website?: string | null
  logo_url?: string | null
  is_featured?: boolean | null
  business_hours?: unknown
}

function mapApiStoreToLoja(s: ApiStore): Loja {
  const isOnline = s.type === 'online'
  let horario: string | undefined
  if (typeof s.business_hours === 'string') {
    horario = s.business_hours
  } else if (s.business_hours && typeof s.business_hours === 'object') {
    const bh = s.business_hours as Record<string, unknown>
    horario = (bh.horario as string) ?? (bh.text as string)
  }
  const endereco = [s.address, s.address_number].filter(Boolean).join(', ') || s.address
  return {
    id: s.id,
    nome: s.name,
    tipo: isOnline ? 'online' : 'fisica',
    endereco,
    cidade: s.city,
    estado: s.state,
    telefone: s.phone || undefined,
    website: s.website || undefined,
    horario,
    logo: s.logo_url || undefined,
    destaque: s.is_featured ?? false,
  }
}

function getLojaInitials(nome: string) {
  return nome
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getLojaColor(nome: string) {
  const colors = ['bg-forest', 'bg-forest-ink', 'bg-gold', 'bg-forest', 'bg-forest-ink', 'bg-gold', 'bg-forest']
  const index = nome.charCodeAt(0) % colors.length
  return colors[index]
}

function LojaAvatar({ loja }: { loja: Loja }) {
  const [logoError, setLogoError] = useState(false)
  const showLogo = loja.logo && !logoError

  if (showLogo) {
    const isLocalPath = loja.logo!.startsWith('/lojas/')
    return (
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface-2 border border-border-subtle">
        <Image
          src={loja.logo!}
          alt={loja.nome}
          fill
          className="object-contain p-1"
          sizes="56px"
          unoptimized={isLocalPath}
          onError={() => setLogoError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={`
        w-14 h-14 rounded-xl flex items-center justify-center text-bg-primary font-bold text-lg flex-shrink-0
        ${getLojaColor(loja.nome)}
      `}
    >
      {getLojaInitials(loja.nome)}
    </div>
  )
}

export function OndeEncontrarContent() {
  const [mounted, setMounted] = useState(false)
  const [lojasOnline, setLojasOnline] = useState<Loja[]>(LOJAS_ONLINE)
  const [lojasFisicas, setLojasFisicas] = useState<Loja[]>(LOJAS_FISICAS)
  const [activeTab, setActiveTab] = useState<'online' | 'fisica'>('online')
  const [searchQuery, setSearchQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/stores')
        if (!res.ok) return
        const data: ApiStore[] = await res.json()
        if (!Array.isArray(data) || data.length === 0) return

        const lojas = data.map(mapApiStoreToLoja)
        const online = lojas.filter((l) => l.tipo === 'online')
        const fisicas = lojas.filter((l) => l.tipo === 'fisica')

        if (online.length > 0) setLojasOnline(online)
        if (fisicas.length > 0) setLojasFisicas(fisicas)
      } catch {
        // Manter fallback (LOJAS_ONLINE / LOJAS_FISICAS)
      }
    }
    fetchStores()
  }, [])

  const lojasFiltradas =
    activeTab === 'online'
      ? lojasOnline.filter((loja) =>
          loja.nome.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : lojasFisicas.filter((loja) => {
          const matchSearch =
            loja.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loja.cidade?.toLowerCase().includes(searchQuery.toLowerCase())
          const matchEstado =
            estadoFilter === 'Todos' || loja.estado === estadoFilter
          return matchSearch && matchEstado
        })

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-surface-2">
        <div className="container-main py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-bg-surface rounded-xl w-64 mx-auto" />
            <div className="h-6 bg-bg-surface rounded w-96 mx-auto" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-bg-surface rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-surface-2">
      {/* Hero */}
      <section className="bg-forest text-bg-primary py-16">
        <div className="container-main text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl font-bold mb-4"
          >
            Onde Encontrar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-forest-soft max-w-2xl mx-auto"
          >
            Encontre os produtos Terravik nas melhores lojas do Brasil
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-main py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-bg-surface rounded-xl p-1 shadow-sm border border-border-subtle">
            <button
              onClick={() => setActiveTab('online')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${activeTab === 'online'
                  ? 'bg-forest text-bg-primary shadow-md'
                  : 'text-txt-muted hover:text-txt-primary'
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
                  ? 'bg-forest text-bg-primary shadow-md'
                  : 'text-txt-muted hover:text-txt-primary'
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
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'online'
                  ? 'Buscar loja...'
                  : 'Buscar por nome ou cidade...'
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-subtle text-txt-primary placeholder:text-txt-muted focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 bg-bg-surface"
            />
          </div>

          {activeTab === 'fisica' && (
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-border-subtle text-txt-primary focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 bg-bg-surface"
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
                bg-bg-surface rounded-xl border overflow-hidden hover:shadow-lg transition-shadow
                ${loja.destaque ? 'border-forest/30 ring-2 ring-forest/10' : 'border-border-subtle'}
              `}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <LojaAvatar loja={loja} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-txt-primary">{loja.nome}</h3>
                      {loja.destaque && (
                        <span className="px-2 py-0.5 bg-forest/10 text-forest text-xs font-medium rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-txt-muted">
                      {loja.tipo === 'online'
                        ? 'Loja Online'
                        : `${loja.cidade}, ${loja.estado}`}
                    </p>
                  </div>
                </div>

                {loja.tipo === 'fisica' && (
                  <div className="mt-4 space-y-2">
                    {loja.endereco && (
                      <p className="flex items-center gap-2 text-sm text-txt-secondary">
                        <MapPin className="w-4 h-4 text-txt-muted" />
                        {loja.endereco}
                      </p>
                    )}
                    {loja.telefone && (
                      <p className="flex items-center gap-2 text-sm text-txt-secondary">
                        <Phone className="w-4 h-4 text-txt-muted" />
                        {loja.telefone}
                      </p>
                    )}
                    {loja.horario && (
                      <p className="flex items-center gap-2 text-sm text-txt-secondary">
                        <Clock className="w-4 h-4 text-txt-muted" />
                        {loja.horario}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-bg-surface-2 border-t border-border-subtle">
                {loja.tipo === 'online' ? (
                  <a
                    href={loja.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-forest text-bg-primary rounded-lg font-medium hover:bg-forest-ink transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Visitar Loja
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${loja.telefone?.replace(/\D/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-forest text-forest rounded-lg font-medium hover:bg-forest/5 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`${loja.nome} ${loja.endereco} ${loja.cidade} ${loja.estado}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-forest text-bg-primary rounded-lg font-medium hover:bg-forest-ink transition-colors"
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
            <Store className="w-16 h-16 text-txt-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-txt-primary mb-2">
              Nenhuma loja encontrada
            </h3>
            <p className="text-txt-muted">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* CTA Revendedor */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl border border-forest/20 bg-forest-soft/30 p-8">
            <h3 className="text-xl font-bold text-txt-primary mb-2">
              Quer vender produtos Terravik?
            </h3>
            <p className="text-txt-secondary mb-4">
              Seja um revendedor autorizado e faça parte da nossa rede
            </p>
            <a
              href="/contato?assunto=revenda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-bg-primary rounded-xl font-medium hover:bg-forest-ink transition-colors"
            >
              Quero ser revendedor
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
