import { fraseDoFreteGratis } from '@/lib/shipping/config'
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
  const frase = fraseDoFreteGratis()
  return frase ? ` ${frase}.` : ''
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
      'Não falta. São três produtos, um para cada momento do gramado: Raiz Forte para firmar a raiz, Verde Rápido para devolver a cor e Resistência Total para recuperar o vigor. Menos escolha = menos erro = melhor resultado.',
  },
  {
    id: 'frequencia',
    pergunta: 'Vou precisar aplicar todo mês?',
    resposta:
      'Depende do produto. Raiz Forte é de uso pontual: no plantio, na reforma ou quando o gramado estiver muito falhado, e não precisa repetir todo mês. Verde Rápido é de recuperação: use quando o gramado estiver amarelado e, se precisar, repita a cada 30 a 45 dias até o verde voltar.',
    acao: { texto: 'Ver frequência recomendada', href: '/calculadora' },
  },
  {
    id: 'seguranca',
    pergunta: 'É seguro para crianças e pets?',
    resposta:
      'São fertilizantes granulados, não são pesticidas. Mantenha crianças e animais afastados durante a aplicação. Depois de aplicar, regue e aguarde secar antes de liberar o acesso. Guarde o produto fora do alcance de crianças e animais.',
  },
  {
    id: 'aplicacao',
    pergunta: 'É difícil aplicar? Preciso de equipamento especial?',
    resposta:
      'É simples: espalhe e regue. Cada saco traz um dosador de 100 ml. Calcule quantos dosadores sua área precisa, espalhe os grânulos por igual, sem deixar montinhos, e regue imediatamente após a aplicação. Não precisa dissolver nem misturar.',
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
      'Cada produto tem seu momento na linha do tempo do gramado: Raiz Forte para firmar a raiz, Verde Rápido para devolver a cor e Resistência Total para recuperar o vigor. Se a calculadora recomendar mais de um, siga o plano que ela monta e não exceda a dose de cada um.',
  },
  {
    id: 'dose',
    pergunta: 'E se eu aplicar dose errada?',
    resposta:
      'Se aplicar menos, terá menos resultado. Não exceda a dose recomendada: o excesso queima a grama, assim como grânulos acumulados em montinhos. Use o dosador que vem na embalagem, espalhe por igual e regue logo depois.',
  },
]
