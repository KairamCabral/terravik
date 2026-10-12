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
import { SUBSCRIPTION_FAQ } from '@/lib/subscription/mock-data';
import { getCatalogo } from '@/lib/shopify/catalogo';
import { intervaloDaAssinatura } from '@/lib/produtos/assinatura';
import { Sparkles, Check, ChevronRight, Package, Calendar, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Assinatura Terravik | Gramado Perfeito no Piloto Automático',
  description: 'Receba o Resistência Total a cada 60 dias, o intervalo de aplicação do rótulo, com 15% de desconto. Cancele quando quiser, sem taxas.',
};

/**
 * Landing Page de Assinaturas
 *
 * Estrutura otimizada para conversão:
 * 1. Hero com proposta de valor clara
 * 2. Garantias em uma linha
 * 3. Como funciona (3 passos)
 * 4. Benefícios
 * 5. Comparativo
 * 6. Produtos disponíveis
 * 7. (depoimentos: só com depoimento real)
 * 8. FAQ
 * 9. Trust indicators
 * 10. CTA final
 */
// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

export default async function AssinaturaPage() {
  // Nome, peso, foto e preço vêm do catálogo: nada de produto escrito à mão.
  const catalogo = await getCatalogo('assinatura');
  const produtos = catalogo
    // Só o produto de uso contínuo do rótulo. Raiz Forte é uso pontual e
    // Verde Rápido só se repete enquanto o gramado estiver amarelado.
    .filter((p) => p.available && p.featuredImage && intervaloDaAssinatura(p.handle) !== null)
    .map((p) => {
      const variante = p.variants.find((v) => v.available) ?? p.variants[0];
      // Produto de variante única na Shopify chega como "Default Title".
      const peso = variante?.title && variante.title !== 'Default Title' ? ` ${variante.title}` : '';
      return {
        id: p.id,
        handle: p.handle,
        name: `Terravik ${p.title}${peso}`,
        description: p.description,
        price: variante?.price ?? p.price,
        image: p.featuredImage!.url,
      };
    });
  // O comparativo usa o preço de um produto real: o primeiro do catálogo.
  const precoDoComparativo = produtos[0]?.price;

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
              <span className="text-sm font-semibold">15% de desconto + Frete Grátis</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Seu gramado perfeito, no piloto automático
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Receba o Resistência Total a cada 60 dias, o intervalo de aplicação do rótulo, com <strong className="text-white">15% de desconto</strong>.
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

      {/* GARANTIAS EM UMA LINHA */}
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
                title: 'Calcule a quantidade',
                description: 'A calculadora diz quantos sacos de Resistência Total a sua área pede em cada aplicação.'
              },
              {
                step: '2',
                icon: Calendar,
                title: 'Entrega a cada 60 dias',
                description: 'É o intervalo de aplicação do rótulo: cada entrega chega na hora de aplicar de novo.'
              },
              {
                step: '3',
                icon: Check,
                title: 'Receba em casa, sempre',
                description: 'Entregas automáticas e frete grátis. Pause ou cancele quando quiser.'
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
      {precoDoComparativo !== undefined && (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SubscriptionCompare
            basePrice={precoDoComparativo}
            frequency={60}
            quantity={1}
          />
        </div>
      </section>
      )}

      {/* PRODUTOS DISPONÍVEIS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Produto disponível para assinatura
            </h2>
            <p className="text-lg text-neutral-600">
              O produto de uso contínuo da linha, com desconto e frete grátis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {produtos.map(product => (
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

      {/* Depoimentos: a seção saiu (H-06). Os textos eram inventados. Só
          volta com depoimento real e autorizado de assinante. */}

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
            Resistência Total a cada 60 dias, com 15% de desconto e frete grátis
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
