'use client';

/**
 * Landing Page de Assinaturas - Otimizada para Conversão
 * 
 * Estrutura baseada em princípios de psicologia comportamental
 * para maximizar conversões de forma ética.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  PurchaseToggle,
  FrequencySelector,
  SavingsCalculator,
  SubscriptionBenefits,
  SubscriptionTimeline,
  SmartRecommendation,
  SubscriptionCompare,
  TrustIndicators,
} from '@/components/subscription';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data';
import { calculateSubscriptionPrice } from '@/lib/subscription/pricing';
import { SUBSCRIPTION_FAQ, MOCK_TESTIMONIALS, SUBSCRIPTION_STATS } from '@/lib/subscription/mock-data';
import { useSubscription } from '@/hooks/useSubscription';
import { useCalculator } from '@/hooks/useCalculator';

export function SubscriptionLandingPage() {
  const { state, setMode, setFrequency } = useSubscription();
  const { mode, frequency } = state;
  const lawnData = null; // SmartRecommendation requer dados da calculadora - usar fallback
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  
  const savings = {
    amount: 173.44,
    percent: 12,
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* ====================================================================
          1. HERO SECTION
          ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green via-green-600 to-green-700 text-white py-16 md:py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Seu gramado perfeito,<br />
                no piloto automático
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-50">
                Receba os fertilizantes certos, na hora certa, com até <strong>18% de economia</strong>
              </p>
              
              {/* CTAs principais */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={() => {
                    const element = document.getElementById('produtos');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="primary"
                  className="bg-white text-brand-green hover:bg-green-50 text-lg px-8 py-4"
                >
                  Começar a economizar
                </Button>
                <Button
                  onClick={() => {
                    const element = document.getElementById('calculadora');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-green text-lg px-8 py-4"
                >
                  Calcular minha economia
                </Button>
              </div>
              
              {/* Benefícios inline */}
              <SubscriptionBenefits maxItems={3} variant="compact" />
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* ====================================================================
          2. PROVA SOCIAL RÁPIDA
          ==================================================================== */}
      <section className="border-b border-gray-200 bg-gray-50 py-4">
        <Container>
          <TrustIndicators variant="compact" />
        </Container>
      </section>
      
      {/* ====================================================================
          3. COMO FUNCIONA (3 passos)
          ==================================================================== */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Três passos simples para um gramado sempre verde
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: '1',
                icon: '🛒',
                title: 'Escolha seus produtos',
                description: 'Selecione os fertilizantes ideais para seu gramado ou use nossa calculadora para recomendação personalizada.',
              },
              {
                step: '2',
                icon: '📅',
                title: 'Defina a frequência',
                description: 'Escolha a cada quantos dias quer receber (30, 45, 60 ou 90 dias). Quanto maior o intervalo, maior o desconto!',
              },
              {
                step: '3',
                icon: '🏠',
                title: 'Receba em casa, sempre',
                description: 'Entregas automáticas com frete grátis. Você recebe lembretes de quando aplicar. Pause ou cancele quando quiser.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green text-white text-2xl font-bold mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* ====================================================================
          4. CALCULADORA DE ECONOMIA / RECOMENDAÇÃO INTELIGENTE
          ==================================================================== */}
      <section id="calculadora" className="py-16 md:py-24 bg-gray-50">
        <Container>
          {lawnData ? (
            <SmartRecommendation
              lawnData={lawnData}
              onAccept={(rec) => {
                setFrequency(rec.recommendedFrequency);
                const produtos = document.getElementById('produtos');
                produtos?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCustomize={() => {
                window.location.href = '/calculadora';
              }}
            />
          ) : (
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Calcule sua economia personalizada
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Use nossa calculadora para receber uma recomendação baseada no seu gramado
              </p>
              <Link href="/calculadora">
                <Button variant="primary" className="text-lg px-8 py-4">
                  🧮 Usar calculadora de gramado
                </Button>
              </Link>
              
              <div className="mt-12">
                <SavingsCalculator basePrice={89.90} />
              </div>
            </div>
          )}
        </Container>
      </section>
      
      {/* ====================================================================
          5. BENEFÍCIOS COMPLETOS
          ==================================================================== */}
      <section className="py-16 md:py-24">
        <Container>
          <SubscriptionBenefits />
        </Container>
      </section>
      
      {/* ====================================================================
          6. COMPARATIVO
          ==================================================================== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <SubscriptionCompare
            basePrice={89.90}
            frequency={frequency}
            quantity={1}
          />
        </Container>
      </section>
      
      {/* ====================================================================
          7. PRODUTOS DISPONÍVEIS
          ==================================================================== */}
      <section id="produtos" className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha seus produtos
            </h2>
            <p className="text-lg text-gray-600">
              Todos os produtos disponíveis com desconto de assinante
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <SubscriptionCard
                key={product.id}
                product={{
                  id: product.id,
                  handle: product.handle,
                  name: product.title,
                  description: product.description ?? '',
                  price: product.variants[0]?.price ?? 0,
                  image: product.featuredImage?.url ?? '',
                }}
                onAddToCart={(prod, mode) => {
                  console.log('Adicionar ao carrinho:', prod, mode);
                  // TODO: Implementar lógica de adicionar ao carrinho
                }}
              />
            ))}
          </div>
        </Container>
      </section>
      
      {/* ====================================================================
          8. TIMELINE VISUAL
          ==================================================================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <Container>
          <SubscriptionTimeline
            frequency={frequency}
            products={[{
              productId: MOCK_PRODUCTS[0].id,
              variantId: MOCK_PRODUCTS[0].variants[0]?.id ?? '',
              name: MOCK_PRODUCTS[0].title,
              image: MOCK_PRODUCTS[0].featuredImage?.url ?? '',
              basePrice: MOCK_PRODUCTS[0].variants[0]?.price ?? 0,
              subscriptionPrice: calculateSubscriptionPrice(MOCK_PRODUCTS[0].variants[0]?.price ?? 0, frequency),
              quantity: 1,
              frequency,
            }]}
            monthsToShow={6}
          />
        </Container>
      </section>
      
      {/* ====================================================================
          9. DEPOIMENTOS
          ==================================================================== */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que dizem nossos assinantes
            </h2>
            <p className="text-lg text-gray-600">
              Mais de {SUBSCRIPTION_STATS.activeSubscribers.toLocaleString('pt-BR')} famílias já confiam na Terravik
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.slice(0, 3).map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                  <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {testimonial.savings}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* ====================================================================
          10. FAQ
          ==================================================================== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Perguntas frequentes
              </h2>
              <p className="text-lg text-gray-600">
                Tudo o que você precisa saber sobre a assinatura
              </p>
            </div>
            
            <div className="space-y-3">
              {SUBSCRIPTION_FAQ.map((faq, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    faq.highlight ? 'border-brand-green' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left"
                  >
                    <span className={`font-bold text-gray-900 pr-4 ${faq.highlight ? 'text-brand-green' : ''}`}>
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        openFaqId === idx ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === idx && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      {/* ====================================================================
          11. TRUST INDICATORS
          ==================================================================== */}
      <section className="py-8 border-y border-gray-200 bg-white">
        <Container>
          <TrustIndicators variant="compact" />
        </Container>
      </section>
      
      {/* ====================================================================
          12. CTA FINAL
          ==================================================================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-brand-green to-green-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Comece agora e economize<br />no primeiro pedido
            </h2>
            <p className="text-xl mb-2 text-green-50">
              Frete grátis no primeiro mês para novos assinantes
            </p>
            <p className="text-lg mb-8 text-green-100">
              Sem compromisso. Cancele quando quiser.
            </p>
            <Button
              onClick={() => {
                const produtos = document.getElementById('produtos');
                produtos?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="primary"
              className="bg-white text-brand-green hover:bg-green-50 text-lg px-12 py-4 shadow-xl"
            >
              Começar minha assinatura
            </Button>
            <p className="mt-6 text-sm text-green-200">
              Junte-se a {SUBSCRIPTION_STATS.activeSubscribers.toLocaleString('pt-BR')} famílias satisfeitas
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
