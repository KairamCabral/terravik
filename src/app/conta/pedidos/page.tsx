'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  Loader2,
  ShoppingBag,
  ExternalLink,
  Truck,
  FileText,
  MessageCircle,
  Award,
  Zap,
  Target,
  HelpCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { getUserOrders, type OrderDisplay } from '@/lib/services/orders'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

/**
 * Meus Pedidos — Arquitetura Híbrida Inteligente
 * 
 * SEÇÃO 1: Lista de Pedidos (Shopify Cache + Actions)
 * SEÇÃO 2: Suporte & FAQ (Híbrido)
 * SEÇÃO 3: Recompensas por Compras (Supabase)
 * 
 * DONO: Shopify (cache no Supabase via orders_sync)
 */

const WHATSAPP_NUMBER = '5511999999999' // Atualizar com número real
const WHATSAPP_MESSAGE = 'Olá! Preciso de ajuda com meu pedido na Terravik.'

const FAQ_ITEMS = [
  {
    question: 'Quanto tempo demora a entrega?',
    answer: 'A entrega varia de 5 a 15 dias úteis dependendo da sua região. Você recebe o código de rastreamento por e-mail assim que o pedido é despachado.',
  },
  {
    question: 'Como rastrear minha entrega?',
    answer: 'Clique no botão "Rastrear Pedido" ao lado do seu pedido. O código de rastreamento também é enviado por e-mail.',
  },
  {
    question: 'Posso cancelar ou trocar meu pedido?',
    answer: 'Sim! Entre em contato conosco via WhatsApp em até 24h após a compra para cancelamentos. Trocas podem ser solicitadas em até 7 dias após o recebimento.',
  },
  {
    question: 'Como emitir nota fiscal?',
    answer: 'A nota fiscal é enviada automaticamente por e-mail após a confirmação do pagamento. Você também pode baixá-la clicando no botão "Nota Fiscal".',
  },
]

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusLabel(status: string) {
  const map: Record<string, { label: string; color: string; icon: any }> = {
    paid: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    refunded: { label: 'Reembolsado', color: 'bg-neutral-100 text-neutral-600 border-neutral-200', icon: CheckCircle2 },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200', icon: ExternalLink },
  }
  return map[status] || { label: status, color: 'bg-neutral-100 text-neutral-600 border-neutral-200', icon: Clock }
}

function fulfillmentLabel(status: string | null) {
  if (!status) return { label: 'Aguardando envio', color: 'bg-neutral-100 text-neutral-500 border-neutral-200', icon: Clock }
  const map: Record<string, { label: string; color: string; icon: any }> = {
    fulfilled: { label: 'Enviado', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
    partial: { label: 'Parcialmente enviado', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Truck },
    unfulfilled: { label: 'Aguardando envio', color: 'bg-neutral-100 text-neutral-500 border-neutral-200', icon: Clock },
  }
  return map[status] || { label: status, color: 'bg-neutral-100 text-neutral-500 border-neutral-200', icon: Clock }
}

function calculateXPFromOrder(total: number): number {
  // 1 XP para cada R$ 10 gastos
  return Math.floor(total / 10)
}

export default function MeusPedidosPage() {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState<OrderDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  useEffect(() => {
    if (user?.id) {
      getUserOrders(user.id)
        .then(setOrders)
        .finally(() => setIsLoading(false))
    }
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Meus Pedidos</h1>
          <p className="text-neutral-500">Acompanhe seus pedidos e histórico de compras</p>
        </div>

        {/* Skeleton Loading */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-100 p-5 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-neutral-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-48" />
                </div>
                <div className="h-8 bg-neutral-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0)
  const totalXP = orders.reduce((acc, order) => acc + calculateXPFromOrder(order.total), 0)
  const currentLevel = profile?.level || 1
  const currentXP = profile?.xp_total || 0
  const nextLevelXP = currentLevel * 1000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Meus Pedidos</h1>
        <p className="text-neutral-500">
          Acompanhe seus pedidos e histórico de compras
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 1: LISTA DE PEDIDOS (SHOPIFY CACHE) */}
      {/* ═══════════════════════════════════════════════════════ */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-2">Nenhum pedido encontrado</p>
          <p className="text-sm text-neutral-400 mb-6">
            Seus pedidos da loja Shopify aparecerão aqui automaticamente.
          </p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabel(order.status)
            const fulfillment = fulfillmentLabel(order.fulfillmentStatus)
            const StatusIcon = status.icon
            const FulfillmentIcon = fulfillment.icon
            const orderXP = calculateXPFromOrder(order.total)

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:border-neutral-200 transition-colors"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    {/* Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-semibold text-neutral-900 text-lg">
                            Pedido #{order.orderNumber}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${fulfillment.color}`}>
                            <FulfillmentIcon className="w-3 h-3" />
                            {fulfillment.label}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mb-2">
                          {formatDate(order.date)} · {order.itemCount} {order.itemCount === 1 ? 'item' : 'itens'}
                        </p>
                        {/* Items preview */}
                        {order.items.length > 0 && (
                          <p className="text-xs text-neutral-400">
                            {order.items.map(i => i.title).slice(0, 2).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} itens`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Valor + XP */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-bold text-neutral-900">
                        {formatPrice(order.total)}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3" />
                        +{orderXP} XP
                      </div>
                    </div>
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Rastreamento</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        {order.trackingCompany && <span className="font-medium">{order.trackingCompany}: </span>}
                        <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.shopifyUrl && (
                      <a
                        href={order.shopifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Ver no Shopify
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Rastrear Pedido
                      </a>
                    )}

                    {order.shopifyUrl && (
                      <a
                        href={`${order.shopifyUrl}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Nota Fiscal
                      </a>
                    )}

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${WHATSAPP_MESSAGE}\n\nPedido: #${order.orderNumber}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Suporte
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 2: SUPORTE & FAQ */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-neutral-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Precisa de Ajuda?</h2>
            <p className="text-sm text-neutral-500">Estamos aqui para você</p>
          </div>
        </div>

        {/* Botões de Suporte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
          >
            <MessageCircle className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-medium text-neutral-900">WhatsApp</p>
              <p className="text-xs text-neutral-500">Resposta rápida</p>
            </div>
          </a>

          <Link
            href="/contato"
            className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
          >
            <HelpCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-medium text-neutral-900">Central de Ajuda</p>
              <p className="text-xs text-neutral-500">FAQ completo</p>
            </div>
          </Link>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">Perguntas Frequentes</h3>
          {FAQ_ITEMS.map((faq, index) => (
            <div
              key={index}
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left"
              >
                <span className="font-medium text-neutral-900 text-sm">{faq.question}</span>
                <HelpCircle
                  className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-neutral-200 bg-neutral-50"
                  >
                    <p className="p-4 text-sm text-neutral-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 3: RECOMPENSAS E GAMIFICAÇÃO */}
      {/* ═══════════════════════════════════════════════════════ */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Suas Recompensas</h2>
              <p className="text-sm text-neutral-600">Continue comprando para ganhar mais benefícios</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Gasto */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total Investido</p>
                  <p className="text-xl font-bold text-neutral-900">{formatPrice(totalSpent)}</p>
                </div>
              </div>
            </div>

            {/* XP Ganho */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">XP de Compras</p>
                  <p className="text-xl font-bold text-neutral-900">+{totalXP} XP</p>
                </div>
              </div>
            </div>

            {/* Pedidos */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total de Pedidos</p>
                  <p className="text-xl font-bold text-neutral-900">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progresso de Nível */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-neutral-900">
                  Nível {currentLevel}
                </span>
              </div>
              <span className="text-sm text-neutral-600">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((currentXP / nextLevelXP) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
              />
            </div>

            <p className="text-xs text-neutral-500 text-center">
              {nextLevelXP - currentXP > 0
                ? `Faltam ${nextLevelXP - currentXP} XP para o próximo nível`
                : 'Parabéns! Você alcançou o nível máximo atual'}
            </p>
          </div>

          {/* Dica */}
          <div className="mt-4 bg-white/50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-neutral-700">
              <strong className="text-purple-700">💡 Dica:</strong> Cada R$ 10 em compras = 1 XP.
              Complete cursos da Academia para ganhar ainda mais XP!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
