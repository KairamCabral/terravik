import {
  FreeShippingBar, 
  DiscountBar, 
  LaunchBar, 
  RotatingAnnouncementBar 
} from '@/components/layout'
import { Container } from '@/components/ui'

/**
 * Página de demonstração das variantes do AnnouncementBar
 * 
 * Acesse: http://localhost:3000/demo-announcement
 */

export default function AnnouncementDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-hero py-20">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-playfair text-5xl font-bold text-forest">
              Announcement Bar Premium
            </h1>
            <p className="font-inter text-lg text-neutral-700">
              Todas as variantes com técnicas de psicologia de conversão
            </p>
          </div>

          {/* Variantes */}
          <div className="space-y-8">
            {/* Free Shipping */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-2xl font-semibold text-neutral-900">
                  1. Free Shipping
                </h2>
                <span className="px-3 py-1 bg-leaf/10 text-leaf rounded-full text-sm font-semibold">
                  Valor + Threshold
                </span>
              </div>
              <p className="font-inter text-neutral-700">
                <strong>Psicologia:</strong> Incentiva aumentar o carrinho para atingir o valor mínimo
              </p>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <FreeShippingBar />
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-2xl font-semibold text-neutral-900">
                  2. Discount
                </h2>
                <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                  Urgência + Exclusividade
                </span>
              </div>
              <p className="font-inter text-neutral-700">
                <strong>Psicologia:</strong> Cria senso de oportunidade única para novos clientes
              </p>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <DiscountBar />
              </div>
            </div>

            {/* Launch */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-2xl font-semibold text-neutral-900">
                  3. Launch
                </h2>
                <span className="px-3 py-1 bg-forest/10 text-forest rounded-full text-sm font-semibold">
                  Novidade + Valor
                </span>
              </div>
              <p className="font-inter text-neutral-700">
                <strong>Psicologia:</strong> Desperta curiosidade e posiciona como inovador
              </p>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <LaunchBar />
              </div>
            </div>

            {/* Rotating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-2xl font-semibold text-neutral-900">
                  4. Rotating ✨
                </h2>
                <span className="px-3 py-1 bg-gradient-brand text-white rounded-full text-sm font-semibold">
                  Máxima Exposição
                </span>
              </div>
              <p className="font-inter text-neutral-700">
                <strong>Psicologia:</strong> Variedade entre páginas, sem texto trocando sozinho
              </p>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <RotatingAnnouncementBar />
              </div>
              <p className="font-inter text-sm text-neutral-700 italic">
                💡 O anúncio é escolhido pelo caminho da página e fica parado durante a leitura
              </p>
            </div>
          </div>

          {/* Características */}
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            <h2 className="font-playfair text-3xl font-semibold text-forest">
              Características Premium
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-inter text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  ✨ Animações
                </h3>
                <ul className="font-inter text-neutral-700 space-y-1 text-sm">
                  <li>• Shimmer background sutil</li>
                  <li>• Icon pulse suave</li>
                  <li>• Highlight scale (1 → 1.05 → 1)</li>
                  <li>• CTA hover com scale</li>
                  <li>• Progress bar linear</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-inter text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  🎯 Interatividade
                </h3>
                <ul className="font-inter text-neutral-700 space-y-1 text-sm">
                  <li>• Fechável com X (salva preferência)</li>
                  <li>• LocalStorage integrado</li>
                  <li>• Hover states em todos elementos</li>
                  <li>• Responsive mobile/desktop</li>
                  <li>• Auto-rotate opcional</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-inter text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  ♿ Acessibilidade
                </h3>
                <ul className="font-inter text-neutral-700 space-y-1 text-sm">
                  <li>• ARIA labels completos</li>
                  <li>• Navegação por teclado</li>
                  <li>• Contraste WCAG AA</li>
                  <li>• Prefers-reduced-motion</li>
                  <li>• Semantic HTML</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-inter text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  📊 Conversão
                </h3>
                <ul className="font-inter text-neutral-700 space-y-1 text-sm">
                  <li>• Escassez (oferta limitada)</li>
                  <li>• Urgência (tempo/ação)</li>
                  <li>• Valor (benefício claro)</li>
                  <li>• CTA direto</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Uso */}
          <div className="bg-forest text-white rounded-2xl p-8 space-y-4">
            <h2 className="font-playfair text-3xl font-semibold">
              Como Usar
            </h2>
            
            <div className="space-y-4 font-mono text-sm bg-black/20 rounded-lg p-4">
              <p className="text-gold">{'// Importar a variante desejada'}</p>
              <p>
                <span className="text-grass">import</span>{' '}
                {'{ '}
                <span className="text-gold-light">FreeShippingBar</span>
                {' } '}
                <span className="text-grass">from</span>{' '}
                <span className="text-gold-light">{'\u0027'}@/components/layout{'\u0027'}</span>
              </p>
              
              <p className="text-gold">{'// Usar no layout ou página'}</p>
              <p>
                {'<'}
                <span className="text-grass">FreeShippingBar</span>
                {' />'}
              </p>
            </div>

            <p className="font-inter text-white/80">
              Atualmente usando <strong>RotatingAnnouncementBar</strong> no layout principal
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
