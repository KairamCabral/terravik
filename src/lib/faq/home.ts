import { FREE_SHIPPING_CONFIG } from '@/lib/shipping/config'
import { formatCurrency } from '@/lib/utils/formatters'

/**
 * Perguntas frequentes da home.
 *
 * Ficam fora do componente porque a FAQSection é client component e o JSON-LD
 * de FAQPage precisa sair no HTML inicial. O servidor (src/app/page.tsx) emite
 * a marcação e o componente desenha a MESMA lista, então as duas versões não
 * têm como divergir.
 *
 * Este módulo não importa React nem ícones: só o `id`, que casa com o mapa de
 * ícones da FAQSection. Assim um server component pode lê-lo sem arrastar o
 * bundle do cliente.
 */

export interface PerguntaFrequente {
  /** Estável: vira o id do painel (`faq-<id>`) e a chave do ícone. */
  id: string
  pergunta: string
  resposta: string
  acao?: { texto: string; href: string }
}

/**
 * Frase do frete grátis, lida do config em vez de escrita à mão: o valor e os
 * estados são os mesmos que src/lib/shipping/calculator.ts aplica no carrinho.
 * Devolve string vazia se o frete grátis estiver desligado.
 */
function fraseFreteGratis(): string {
  if (!FREE_SHIPPING_CONFIG.enabled) return ''

  const estados = FREE_SHIPPING_CONFIG.regions ?? []
  const onde =
    estados.length > 0
      ? new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(estados)
      : 'todo o Brasil'

  return ` Acima de ${formatCurrency(FREE_SHIPPING_CONFIG.threshold)}, frete grátis para ${onde}.`
}

export const FAQ_HOME: PerguntaFrequente[] = [
  {
    id: 'calculadora',
    pergunta: 'A calculadora realmente funciona para qualquer gramado?',
    resposta:
      'Sim. Nossa calculadora considera 8 variáveis (área, clima, tipo de grama, irrigação, pisoteio, objetivo, etc.) e gera um plano personalizado com margem de segurança.',
  },
  {
    id: 'produtos',
    pergunta: 'Por que só 3 produtos? Não falta algo?',
    resposta:
      'Ao contrário. A maioria das marcas tem 15+ produtos porque vendem ingredientes separados. Nós formulamos produtos completos: um para cada fase do gramado. Menos escolha = menos erro = melhor resultado.',
  },
  {
    id: 'frequencia',
    pergunta: 'Vou precisar aplicar todo mês?',
    resposta:
      'Não. Nossos fertilizantes são de liberação lenta. Verde Rápido dura 4-6 semanas. Resistência Total dura 6-8 semanas. Você aplica menos vezes e ainda economiza tempo e dinheiro comparado a produtos líquidos semanais.',
    acao: { texto: 'Ver frequência recomendada', href: '/calculadora' },
  },
  {
    id: 'seguranca',
    pergunta: 'É seguro para crianças e pets?',
    resposta:
      'Totalmente. São fertilizantes granulados de liberação controlada, não são pesticidas. Após regar (1-2h), o produto já está absorvido pelo solo e o gramado pode ser usado normalmente. Usamos as mesmas fórmulas de campos de golfe profissionais.',
  },
  {
    id: 'aplicacao',
    pergunta: 'É difícil aplicar? Preciso de equipamento especial?',
    resposta:
      'É simples como regar. Distribua os grânulos uniformemente (pode ser a lanço, com espalhador ou até com a mão), depois regue. Não precisa dissolver, misturar ou calcular proporções. O produto já vem na concentração certa.',
  },
  {
    id: 'frete',
    pergunta: 'Onde compro e quanto custa o frete?',
    resposta: `Vendemos online com frete calculado no checkout (PAC ou SEDEX) ou em pontos físicos parceiros.${fraseFreteGratis()} Entregamos para todo Brasil.`,
    acao: { texto: 'Ver pontos de venda', href: '/onde-encontrar' },
  },
  {
    id: 'combinar',
    pergunta: 'Posso usar 2 produtos ao mesmo tempo?',
    resposta:
      'Não na mesma aplicação. Se sua calculadora recomenda mais de um produto, aplique com intervalo mínimo de 7 dias. Isso evita sobrecarga de nutrientes e garante absorção ideal de cada fórmula.',
  },
  {
    id: 'dose',
    pergunta: 'E se eu aplicar dose errada?',
    resposta:
      'A calculadora já considera margem de segurança. Se aplicar menos, terá menos resultado (não há risco). Se aplicar até 2x a dose, regue bastante para diluir. Nossa fórmula é segura mesmo com pequenos excessos.',
  },
]
