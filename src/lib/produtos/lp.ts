/**
 * Conteúdo das páginas de produto (landing pages).
 *
 * TUDO aqui vem do rótulo das embalagens: ver docs/produtos-fatos-do-rotulo.md.
 * Não acrescente número, prazo, composição ou promessa que o rótulo não traz.
 *
 * Arquivo de dados, sem React: a página (servidor) lê daqui e também monta o
 * dado estruturado de perguntas frequentes com as mesmas perguntas da tela.
 *
 * ── COMO COLOCAR O VÍDEO DA SEGUNDA SEÇÃO ──────────────────────────────
 * 1. Salve o vídeo em public/video/, em MP4, com nome sem espaço nem acento
 *    (ex.: public/video/raiz-forte.mp4). Alvo: até 5 MB, 720p.
 * 2. Salve a capa (um quadro do vídeo) em public/images/produtos/<handle>/
 *    (ex.: video-capa.webp), na proporção 16:9.
 * 3. Preencha o campo `video` do produto abaixo:
 *      video: {
 *        src: '/video/raiz-forte.mp4',
 *        capa: '/images/produtos/raiz-forte/video-capa.webp',
 *        descricao: 'O que o vídeo mostra, em uma frase',
 *      },
 * Sem `video`, a seção aparece só com o texto; a moldura reservada só é
 * desenhada fora de produção, para ninguém ver um quadro vazio no site.
 */

export interface VideoDaLp {
  /** Caminho do MP4 em public/. */
  src: string
  /** Imagem de capa, 16:9. */
  capa: string
  /** Descrição do que o vídeo mostra (acessibilidade). */
  descricao: string
}

export interface PerguntaDaLp {
  pergunta: string
  resposta: string
}

export interface GarantiaDaLp {
  nutriente: string
  minimo: string
}

export interface ConteudoDaLp {
  /** Posição na linha do tempo do gramado (1, 2 ou 3). */
  etapa: 1 | 2 | 3
  /** O papel do produto na linha do tempo. */
  papel: string
  /** Frase de identificação, logo abaixo do nome. */
  paraQuem: string
  /** Segunda seção: a promessa central e o espaço do vídeo. */
  destaque: {
    sobretitulo: string
    titulo: string
    texto: string
    video: VideoDaLp | null
  }
  /** O porquê, com o texto do verso da embalagem. */
  porque: {
    titulo: string
    paragrafos: string[]
    /** Frase técnica em destaque. */
    diferencial?: string
  }
  beneficios: Array<{ titulo: string; texto: string }>
  /**
   * O trabalho específico do grânulo deste produto, para o argumento da
   * fórmula concentrada ("cada grânulo tem um trabalho específico").
   */
  trabalho: string
  /**
   * true quando a dose por m² é baixa o bastante para sustentar a comparação
   * com fórmulas comuns e a resposta à objeção de preço. O Raiz Forte, de
   * dose mais alta, fica de fora.
   */
  compararDose: boolean
  rendimento: {
    /** Área que um saco de 1,6 kg cobre, em m². */
    m2PorSaco: number
    /** Área que um dosador raso cobre, em m². */
    m2PorDosador: number
    /** true quando a cobertura do dosador é dedução, não leitura do rótulo. */
    dosadorEstimado?: boolean
  }
  /** Quando usar e com que frequência. */
  quandoUsar: { titulo: string; texto: string }
  /** Composição declarada. Ausente quando o rótulo lido não traz. */
  ficha?: {
    classificacao: string
    natureza: string
    garantias: GarantiaDaLp[]
  }
  perguntas: PerguntaDaLp[]
}

/** Peso líquido do saco, igual nos três produtos. */
export const PESO_DO_SACO = '1,6 kg'
const GRAMAS_DO_SACO = 1600

/**
 * Argumento da fórmula concentrada (texto do dono, arquivo
 * terravik-copy-formula-concentrada.md). Os números que acompanham este texto
 * nas telas são CALCULADOS a partir do rendimento e do preço de cada produto:
 * mudou o rendimento ou o preço, a frase acompanha.
 */
export const ARGUMENTO = {
  sobretitulo: 'Fórmula concentrada',
  titulo: 'Você não paga pelo saco. Paga pelo que ele faz no seu gramado.',
  paragrafos: [
    'A maioria dos fertilizantes de jardim usa misturas genéricas, com nutrientes diluídos. Para ter resultado, você precisa aplicar mais produto em cada metro quadrado.',
    'A Terravik faz o caminho contrário: cada grânulo tem um trabalho específico.',
  ],
  /** Só aparece nos produtos com `compararDose`. Comparação sem citar marca. */
  comparacao: 'Fórmulas comuns costumam pedir 30 g/m² ou mais.',
} as const

export const A_CONTA = {
  sobretitulo: 'A conta que ninguém faz',
  titulo: 'Preço por saco engana. Compare o preço por metro quadrado.',
  texto:
    'Um fertilizante mais barato na prateleira pode sair mais caro no gramado, porque você precisa usar mais. Com a dose certa, você aplica a quantidade exata, sem sobra parada na garagem e sem desperdício.',
} as const

export const DOSADOR_INCLUSO = {
  titulo: 'A dose certa, sem adivinhar',
  texto:
    'Excesso de fertilizante queima a grama. Pouco produto não dá resultado. É por isso que todo saco Terravik vem com dosador: você mede, espalha e pronto. Sem balança e sem cálculo.',
} as const

export const CHAMADA_FINAL = 'Seu gramado não precisa de mais adubo. Precisa do adubo certo.'

const OBJECAO_DE_PRECO: PerguntaDaLp = {
  pergunta: 'Por que custa mais que o adubo do mercado?',
  resposta:
    'Porque rende mais. Você aplica menos produto por m² e trata uma área grande com um único saco. O que importa é o preço por metro quadrado tratado, não o preço da embalagem.',
}

/** Gramas por m², derivadas do rendimento do saco. */
export function gramasPorM2(rendimento: { m2PorSaco: number }): number {
  return Math.round(GRAMAS_DO_SACO / rendimento.m2PorSaco)
}

/** Custo por m² tratado, em reais. null sem preço. */
export function custoPorM2(preco: number, rendimento: { m2PorSaco: number }): number | null {
  if (!Number.isFinite(preco) || preco <= 0 || rendimento.m2PorSaco <= 0) return null
  return preco / rendimento.m2PorSaco
}

/** Atributos da Tecnologia Grânulo Uniforme, impressos nas três embalagens. */
export const GRANULO_UNIFORME = {
  titulo: 'Tecnologia Grânulo Uniforme',
  texto: 'Todos os nutrientes juntos em cada grânulo.',
  atributos: ['Absorção constante', 'Fórmula concentrada', 'Distribuição equilibrada'],
} as const

/** Modo de usar, igual nos rótulos. */
export const COMO_USAR = [
  {
    titulo: 'Pegue o dosador',
    texto: 'Ele vem dentro da embalagem. Calcule quantos dosadores rasos sua área precisa.',
  },
  {
    titulo: 'Espalhe por igual',
    texto: 'Distribua os grânulos sobre o gramado, sem deixar montinhos.',
  },
  {
    titulo: 'Regue em seguida',
    texto: 'A água dissolve os grânulos e leva a nutrição até a raiz. Nunca pule essa etapa.',
  },
] as const

/** Limitações e cuidados, como no rótulo. */
export const CUIDADOS = [
  'Espalhe por igual, sem deixar montinhos: grânulos acumulados podem queimar a grama.',
  'Não exceda a dose recomendada. O excesso queima a grama.',
  'Aplique com a grama seca, de manhã ou no fim da tarde. Evite o sol forte do meio-dia.',
  'Evite aplicar com vento forte.',
  'Evite aplicar sobre piso molhado ou onde possa escorrer para ralos e corpos d’água.',
  'Mantenha crianças e animais afastados durante a aplicação. Depois de aplicar, regue e aguarde secar antes de liberar o acesso.',
  'Em caso de contato com olhos ou pele, lave abundantemente com água. Em caso de ingestão, procure orientação médica.',
] as const

export const ARMAZENAMENTO =
  'Mantenha na embalagem original, bem fechada, em local seco, ventilado e ao abrigo do sol, longe de alimentos e rações e fora do alcance de crianças e animais. Validade de 36 meses após a fabricação.'

/** A linha do tempo do gramado, impressa nas três embalagens. */
export const LINHA_DO_TEMPO = [
  { etapa: 1, handle: 'raiz-forte', nome: 'Raiz Forte', papel: 'Firmar raiz' },
  { etapa: 2, handle: 'verde-rapido', nome: 'Verde Rápido', papel: 'Devolver cor' },
  { etapa: 3, handle: 'resistencia-total', nome: 'Resistência Total', papel: 'Recuperar vigor' },
] as const

const PERGUNTAS_COMUNS: PerguntaDaLp[] = [
  {
    pergunta: 'Serve para qualquer tipo de grama?',
    resposta: 'Sim. O rótulo indica o uso em todo tipo de grama de gramado residencial.',
  },
  {
    pergunta: 'Preciso regar depois de aplicar?',
    resposta:
      'Sim, logo em seguida. A água dissolve os grânulos e leva a nutrição até a raiz. Sem regar, os grânulos ficam sobre a grama e podem queimar as folhas.',
  },
  {
    pergunta: 'Qual o melhor horário para aplicar?',
    resposta:
      'Com a grama seca, de manhã ou no fim da tarde. Evite o sol forte do meio-dia e os dias de vento forte.',
  },
  {
    pergunta: 'É seguro para crianças e animais de estimação?',
    resposta:
      'Mantenha crianças e animais afastados durante a aplicação. Depois de aplicar, regue e aguarde secar antes de liberar o acesso ao gramado.',
  },
]

export const LP_POR_HANDLE: Record<string, ConteudoDaLp> = {
  'raiz-forte': {
    etapa: 1,
    papel: 'Firmar raiz',
    paraQuem: 'Vai plantar, reformar ou recuperar as falhas do gramado? Este é o seu produto.',
    destaque: {
      sobretitulo: 'A base do plantio',
      titulo: 'Gramado forte começa embaixo da terra',
      texto:
        'Raiz Forte prepara o solo e firma a raiz para o gramado crescer forte. É o primeiro passo de um gramado que pega de vez.',
      video: null,
    },
    porque: {
      titulo: 'A parte mais importante do gramado é a que você não vê',
      paragrafos: [
        'Antes de pensar na cor, pense na raiz. É ela que segura a grama no chão, busca água lá no fundo e decide se o gramado vinga ou morre no primeiro calor.',
        'Raiz Forte entrega fósforo e cálcio, os nutrientes que constroem raiz e estrutura desde o plantio. Grama que enraíza fundo, pega de vez. E gramado que pega de vez, dura.',
      ],
      diferencial:
        'O fósforo quase não se move no solo: jogado por cima, nunca chega na raiz. Por isso o Raiz Forte é feito para ser incorporado à terra, colocando fósforo e cálcio direto na zona das raízes, onde a grama nova constrói sua estrutura.',
    },
    beneficios: [
      {
        titulo: 'Fósforo e cálcio',
        texto: 'O alicerce que a grama nova precisa para formar raiz e estrutura.',
      },
      {
        titulo: 'Raiz que busca água no fundo',
        texto: 'Grama que enraíza fundo se segura no chão e aguenta melhor o primeiro calor.',
      },
      {
        titulo: 'Uso pontual',
        texto: 'No plantio, na reforma ou quando o gramado estiver muito falhado. Não precisa repetir todo mês.',
      },
    ],
    trabalho: 'Fósforo e cálcio. É o que a grama nova usa para formar raiz e estrutura.',
    compararDose: false,
    rendimento: { m2PorSaco: 32, m2PorDosador: 2 },
    quandoUsar: {
      titulo: 'Uso pontual',
      texto:
        'Use no plantio, na reforma ou quando o gramado estiver muito falhado. Não precisa repetir todo mês.',
    },
    ficha: {
      classificacao: 'Fertilizante mineral simples, aplicação via solo',
      natureza: 'Superfosfato simples granulado',
      garantias: [
        { nutriente: 'Fósforo (P₂O₅) solúvel em CNA + água', minimo: '21,0%' },
        { nutriente: 'Fósforo (P₂O₅) solúvel em água', minimo: '17,0%' },
        { nutriente: 'Cálcio (Ca) total', minimo: '16,0%' },
        { nutriente: 'Enxofre (S) total', minimo: '10,0%' },
      ],
    },
    perguntas: [
      {
        pergunta: 'Quando devo usar o Raiz Forte?',
        resposta:
          'No plantio de um gramado novo, na reforma ou quando o gramado estiver muito falhado. É um produto de uso pontual: não precisa repetir todo mês.',
      },
      {
        pergunta: 'Quanto rende um saco?',
        resposta:
          'O saco de 1,6 kg rende até 32 m². Um dosador raso cobre cerca de 2 m². O dosador vem dentro da embalagem.',
      },
      {
        pergunta: 'Por que incorporar à terra em vez de só jogar por cima?',
        resposta:
          'Porque o fósforo quase não se move no solo. Jogado por cima, ele não chega na raiz. Incorporado à terra, fica na zona das raízes, onde a grama nova constrói sua estrutura.',
      },
      ...PERGUNTAS_COMUNS,
    ],
  },

  'verde-rapido': {
    etapa: 2,
    papel: 'Devolver cor',
    paraQuem: 'Seu gramado está amarelado ou sem vida? Este é o seu produto.',
    destaque: {
      sobretitulo: 'Nutrição de verdade',
      titulo: 'O verde de volta, sem pintura',
      texto:
        'Verde Rápido recupera o gramado amarelado e devolve a cor em poucas semanas. Não é tinta: é verde que vem da raiz.',
      video: null,
    },
    porque: {
      titulo: 'Por que seu gramado fica amarelado ou perde a cor?',
      paragrafos: [
        'Falta nitrogênio. É o nutriente que dá a cor verde e o crescimento. Quando ele acaba no solo, a grama perde força, clareia e fica ralinha.',
        'Verde Rápido repõe esse nitrogênio com um reforço de enxofre, a dupla que forma clorofila e intensifica o verde. É o gramado realmente saudável de novo, verde de dentro para fora.',
      ],
      diferencial:
        'O enxofre potencializa a ação do nitrogênio, intensificando o verde pela formação real de clorofila, não apenas pelo efeito superficial do nitrogênio puro.',
    },
    beneficios: [
      {
        titulo: 'Nitrogênio com enxofre',
        texto: 'A dupla que forma clorofila e intensifica o verde do gramado.',
      },
      {
        titulo: 'Verde que vem da raiz',
        texto: 'Clorofila de verdade, não efeito de superfície. Sem tinta e sem pintura.',
      },
      {
        titulo: 'Cor em poucas semanas',
        texto: 'Recupera o gramado amarelado. Se precisar, repita a cada 30 a 45 dias até o verde voltar.',
      },
    ],
    trabalho:
      '21% de nitrogênio e 24% de enxofre. É o que a grama usa para produzir verde, sem enchimento.',
    compararDose: true,
    rendimento: { m2PorSaco: 96, m2PorDosador: 6 },
    quandoUsar: {
      titulo: 'Recuperação',
      texto:
        'Use quando o gramado estiver amarelado ou sem cor. Se precisar, repita a cada 30 a 45 dias até o verde voltar.',
    },
    ficha: {
      classificacao: 'Fertilizante mineral simples, aplicação via solo',
      natureza: 'Sulfato de amônio granulado, 21-00-00 + 24S',
      garantias: [
        { nutriente: 'Nitrogênio (N) total', minimo: '21,0%' },
        { nutriente: 'Enxofre (S) total', minimo: '24,0%' },
      ],
    },
    perguntas: [
      {
        pergunta: 'Em quanto tempo o gramado volta a ficar verde?',
        resposta:
          'O rótulo indica que a cor volta em poucas semanas. O resultado depende da rega depois da aplicação e do estado do gramado.',
      },
      {
        pergunta: 'Posso repetir a aplicação?',
        resposta:
          'Sim. Se precisar, repita a cada 30 a 45 dias até o verde voltar. Não aplique mais do que a dose recomendada: o excesso queima a grama.',
      },
      {
        pergunta: 'Quanto rende um saco?',
        resposta:
          'O saco de 1,6 kg rende até 96 m². Um dosador raso cobre cerca de 6 m². O dosador vem dentro da embalagem.',
      },
      OBJECAO_DE_PRECO,
      {
        pergunta: 'O Verde Rápido é uma tinta para grama?',
        resposta:
          'Não. É um fertilizante: repõe o nitrogênio e o enxofre que a grama usa para formar clorofila. O verde vem da planta saudável, não de pigmento.',
      },
      ...PERGUNTAS_COMUNS,
    ],
  },

  'resistencia-total': {
    etapa: 3,
    papel: 'Recuperar vigor',
    paraQuem: 'Seu gramado precisa de força e beleza em todas as estações? Este é o seu produto.',
    destaque: {
      sobretitulo: 'Nutrição completa com potássio',
      titulo: 'Seu gramado forte o ano inteiro',
      texto:
        'Resistência Total deixa a grama resistente à seca, ao sol e ao pisoteio. É a nutrição de quem quer o gramado bonito em todas as estações.',
      video: null,
    },
    porque: {
      titulo: 'Força e beleza em todas as estações',
      paragrafos: [
        'Sol forte, falta de chuva e pisoteio castigam o gramado ao longo do ano. Resistência Total é a nutrição completa com potássio que deixa a grama resistente à seca, ao sol e ao pisoteio.',
        'Uma seleção especial de nutrientes, a escolha por trás dos gramados que impressionam.',
      ],
    },
    beneficios: [
      {
        titulo: 'Nutrição completa com potássio',
        texto: 'Para a grama resistir à seca, ao sol e ao pisoteio.',
      },
      {
        titulo: 'O ano inteiro',
        texto: 'Para o gramado que precisa de força e beleza em todas as estações.',
      },
      {
        titulo: 'Seleção especial de nutrientes',
        texto: 'A escolha por trás dos gramados que impressionam.',
      },
    ],
    // O rótulo lido (frente) dá o rendimento. A cobertura do dosador é
    // DEDUÇÃO: nos outros dois produtos o saco equivale a 16 dosadores rasos.
    // Confirmar no verso da embalagem da Resistência Total.
    trabalho:
      'Nutrição completa com potássio, o nutriente que a grama usa para aguentar sol, pisoteio e seca.',
    compararDose: true,
    rendimento: { m2PorSaco: 64, m2PorDosador: 4, dosadorEstimado: true },
    quandoUsar: {
      titulo: 'Manutenção',
      texto: 'Para o gramado estabelecido que precisa de força e beleza em todas as estações.',
    },
    // Sem `ficha`: a composição só está no verso da embalagem, que ainda não
    // foi fornecido. Não declarar garantia sem ler o rótulo.
    perguntas: [
      {
        pergunta: 'Para que serve o Resistência Total?',
        resposta:
          'É a nutrição completa com potássio que deixa a grama resistente à seca, ao sol e ao pisoteio. É o terceiro passo da linha do tempo do gramado: recuperar o vigor.',
      },
      {
        pergunta: 'Quanto rende um saco?',
        resposta: 'O saco de 1,6 kg rende até 64 m². O dosador vem dentro da embalagem.',
      },
      OBJECAO_DE_PRECO,
      ...PERGUNTAS_COMUNS,
    ],
  },
}

export function conteudoDaLp(handle: string): ConteudoDaLp | null {
  return LP_POR_HANDLE[handle] ?? null
}

/** Quantos sacos e dosadores uma área precisa. Sempre arredonda para cima. */
export function calcularParaArea(
  areaM2: number,
  rendimento: ConteudoDaLp['rendimento']
): { sacos: number; dosadores: number } | null {
  if (!Number.isFinite(areaM2) || areaM2 <= 0) return null
  return {
    sacos: Math.ceil(areaM2 / rendimento.m2PorSaco),
    dosadores: Math.ceil(areaM2 / rendimento.m2PorDosador),
  }
}
