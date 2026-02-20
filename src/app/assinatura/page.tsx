// src/app/assinatura/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  SubscriptionBenefits, 
  SubscriptionCompare,
  TrustIndicators,
  SubscriptionCard 
} from '@/components/subscription';
import { MOCK_TESTIMONIALS, SUBSCRIPTION_FAQ, SUBSCRIPTION_STATS } from '@/lib/subscription/mock-data';
import { Sparkles, Check, ChevronRight, Star, Package, Calendar, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Assinatura Terravik | Gramado Perfeito no Piloto Automático',
  description: 'Receba seus fertilizantes automaticamente com até 18% de desconto. Cancele quando quiser, sem taxas.',
};

/**
 * Landing Page de Assinaturas
 * 
 * Estrutura otimizada para conversão:
 * 1. Hero com proposta de valor clara
 * 2. Prova social rápida
 * 3. Como funciona (3 passos)
 * 4. Benefícios
 * 5. Comparativo
 * 6. Produtos disponíveis
 * 7. Depoimentos
 * 8. FAQ
 * 9. Trust indicators
 * 10. CTA final
 */
export default function AssinaturaPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Economize até 18% + Frete Grátis</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Seu gramado perfeito, no piloto automático
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Receba os fertilizantes certos, na hora certa, com até <strong className="text-white">18% de economia</strong>.
              Cancele quando quiser, sem taxas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/calculadora">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 shadow-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar a Economizar
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Como Funciona
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-6 mt-12 text-green-100">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span className="text-sm">
                  <strong className="text-white">{SUBSCRIPTION_STATS.activeSubscribers.toLocaleString('pt-BR')}</strong> assinantes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm">
                  <strong className="text-white">{SUBSCRIPTION_STATS.averageRating}/5</strong> de avaliação
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm">Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#FBF7EE"/>
          </svg>
        </div>
      </section>

      {/* PROVA SOCIAL RÁPIDA */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <TrustIndicators variant="compact" className="max-w-6xl mx-auto px-6" />
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simples, automático e econômico
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Package,
                title: 'Escolha seus produtos',
                description: 'Selecione os fertilizantes ideais para seu gramado. Nossa calculadora ajuda!'
              },
              {
                step: '2',
                icon: Calendar,
                title: 'Defina a frequência',
                description: 'Escolha receber a cada 30, 45, 60 ou 90 dias. Quanto maior o intervalo, maior o desconto!'
              },
              {
                step: '3',
                icon: Check,
                title: 'Receba em casa, sempre',
                description: 'Entregas automáticas, frete grátis, lembretes de aplicação. Gramado perfeito, zero preocupação!'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-green-200 -z-10" />
                )}

                <div className="text-center">
                  {/* Step circle */}
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-6 shadow-lg">
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center text-sm font-bold shadow-md">
                      {item.step}
                    </div>
                    <item.icon className="w-12 h-12" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-neutral-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SubscriptionBenefits />
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SubscriptionCompare 
            basePrice={89.90} 
            frequency={45} 
            quantity={1}
          />
        </div>
      </section>

      {/* PRODUTOS DISPONÍVEIS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Produtos disponíveis para assinatura
            </h2>
            <p className="text-lg text-neutral-600">
              Todos com desconto e frete grátis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Produtos mock - em produção virá do Shopify */}
            {[
              {
                id: '1',
                handle: 'nutricao-completa',
                name: 'Terravik Nutrição Completa 5kg',
                description: 'Fórmula balanceada NPK 20-05-20 para manutenção regular',
                price: 89.90,
                image: '/images/produtos/nutricao-completa.jpg',
                coverage: 100
              },
              {
                id: '2',
                handle: 'gramado-novo',
                name: 'Terravik Gramado Novo 5kg',
                description: 'Rico em fósforo (NPK 11-52-00) para gramados novos',
                price: 94.90,
                image: '/images/produtos/gramado-novo.jpg',
                coverage: 100
              },
              {
                id: '3',
                handle: 'verde-rapido',
                name: 'Terravik Verde Rápido 3kg',
                description: 'Ação rápida para recuperação acelerada',
                price: 69.90,
                image: '/images/produtos/verde-rapido.jpg',
                coverage: 60
              }
            ].map(product => (
              <SubscriptionCard 
                key={product.id} 
                product={product}
                variant="default"
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/produtos">
              <Button variant="outline" size="lg">
                Ver Todos os Produtos
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              O que dizem nossos assinantes
            </h2>
            <p className="text-lg text-neutral-600">
              Mais de {SUBSCRIPTION_STATS.activeSubscribers.toLocaleString('pt-BR')} famílias confiam na Terravik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.slice(0, 3).map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-neutral-700 mb-4 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-600">{testimonial.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {testimonial.savings}
                    </div>
                    <div className="text-xs text-neutral-500">de economia</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {SUBSCRIPTION_FAQ.map((item, index) => (
              <details 
                key={index}
                className={`
                  group bg-white rounded-xl border-2 overflow-hidden transition-all
                  ${item.highlight ? 'border-green-300' : 'border-neutral-200'}
                `}
              >
                <summary className="p-5 cursor-pointer font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors list-none">
                  <div className="flex items-center justify-between">
                    <span>{item.question}</span>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-5 pb-5 text-neutral-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="py-12 px-6 bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <TrustIndicators variant="default" />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Comece agora e economize no primeiro pedido
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Frete grátis no primeiro mês + Desconto especial para novos assinantes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculadora">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 shadow-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                Calcular Minha Economia
              </Button>
            </Link>
            <Link href="/produtos">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ver Produtos
              </Button>
            </Link>
          </div>

          <p className="text-sm text-green-100 mt-6">
            <Check className="w-4 h-4 inline mr-1" />
            Cancele quando quiser, sem taxas ou perguntas
          </p>
        </div>
      </section>
    </div>
  );
}
