/**
 * Artigos do Blog (mock data)
 * Quando Shopify estiver configurado, migrar para Shopify Blog API
 */

export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  content: string // HTML
  publishedAt: string // ISO date
  author: string
  category: 'como-fazer' | 'produto' | 'dicas'
  categoryLabel: string
  readingTime: number // minutos
  featuredImage: string | null
  tags: string[]
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'como-adubar-gramado',
    title: 'Como adubar o gramado: guia completo para iniciantes',
    excerpt:
      'Aprenda quando e como aplicar fertilizante no seu gramado para mantê-lo verde e saudável o ano todo.',
    content: `
      <p>Adubar o gramado não precisa ser complicado. Com a dose certa e o momento adequado, você garante um gramado verde, denso e resistente.</p>

      <h2>Por que adubar?</h2>
      <p>O fertilizante repõe os nutrientes que o solo perde naturalmente. Nitrogênio para crescimento e cor, fósforo para raízes fortes, e potássio para resistência ao calor e pisoteio.</p>

      <h2>Quando adubar?</h2>
      <p>O momento ideal é quando o gramado está crescendo ativamente — geralmente na primavera e no verão. Evite adubar em períodos de seca extrema ou frio intenso.</p>

      <h2>Como aplicar?</h2>
      <ol>
        <li><strong>Meça a área:</strong> Multiplique largura × comprimento em metros para calcular a dose exata.</li>
        <li><strong>Distribua uniformemente:</strong> Use a mão ou um espargidor. Faça passes cruzados para cobrir bem.</li>
        <li><strong>Regue após aplicar:</strong> A água ativa o fertilizante e evita queima nas folhas.</li>
      </ol>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Aplicar demais:</strong> Excesso queima o gramado. Siga sempre a dose recomendada.</li>
        <li><strong>Não regar depois:</strong> Sem água, o fertilizante não penetra no solo.</li>
        <li><strong>Ignorar a área:</strong> "Chutar" a quantidade resulta em desperdício ou falta de efeito.</li>
      </ul>

      <p>Com esses cuidados básicos, você terá um gramado bonito sem complicação. Quer saber a dose exata para sua área? Use nossa <a href="/calculadora">calculadora gratuita</a>.</p>
    `,
    publishedAt: '2024-01-15T10:00:00.000Z',
    author: 'Equipe Terravik',
    category: 'como-fazer',
    categoryLabel: 'Como Fazer',
    readingTime: 4,
    featuredImage: null,
    tags: ['adubação', 'gramado', 'iniciante', 'fertilizante'],
  },
  {
    slug: 'quando-aplicar-fertilizante',
    title: 'Quando aplicar fertilizante no gramado? O momento certo faz diferença',
    excerpt:
      'Descubra a melhor época para adubar e como o clima influencia no resultado.',
    content: `
      <p>Aplicar fertilizante no momento errado é jogar dinheiro fora. O gramado só aproveita o adubo quando está crescendo ativamente.</p>

      <h2>Clima importa mais que estação do ano</h2>
      <p>No Brasil, não dá para seguir o calendário de países frios. Cada região tem seu ritmo. O segredo é observar o clima:</p>
      <ul>
        <li><strong>Quente e chuvoso:</strong> Melhor momento. O gramado cresce rápido e absorve tudo.</li>
        <li><strong>Quente e seco:</strong> Funciona, mas precisa regar bastante após aplicar.</li>
        <li><strong>Ameno:</strong> Crescimento moderado. Bom para manutenção.</li>
        <li><strong>Frio:</strong> Gramado "dorme". Evite adubar — o produto fica no solo sem ser usado.</li>
      </ul>

      <h2>Sinais de que o gramado precisa de adubo</h2>
      <p>Seu gramado "pede ajuda" quando:</p>
      <ul>
        <li>Fica amarelado mesmo com sol e água</li>
        <li>Cresce devagar ou para de crescer</li>
        <li>Fica ralo ou com falhas</li>
        <li>Não aguenta pisoteio</li>
      </ul>

      <h2>Frequência ideal</h2>
      <p>Depende do produto e do objetivo. Gramados em crescimento pedem adubação a cada 4-8 semanas. Gramados em manutenção, a cada 8-12 semanas.</p>

      <p>Quer um plano personalizado? Nossa <a href="/calculadora">calculadora</a> monta o cronograma certo para você.</p>
    `,
    publishedAt: '2024-01-20T10:00:00.000Z',
    author: 'Equipe Terravik',
    category: 'dicas',
    categoryLabel: 'Dicas',
    readingTime: 3,
    featuredImage: null,
    tags: ['fertilizante', 'época', 'aplicação', 'clima'],
  },
  {
    slug: 'gramado-novo-primeiros-30-dias',
    title: 'Gramado novo: o que fazer nos primeiros 30 dias',
    excerpt:
      'Os primeiros 30 dias definem se o gramado vai pegar bem ou dar problema. Veja o passo a passo.',
    content: `
      <p>Implantar gramado (seja tapete, muda ou semente) é um investimento. Os primeiros 30 dias são críticos para o enraizamento.</p>

      <h2>Dia 0-7: Enraizamento inicial</h2>
      <ul>
        <li><strong>Regar 2-3× por dia:</strong> Solo sempre úmido, mas sem encharcar.</li>
        <li><strong>Não pisar:</strong> As raízes ainda estão se fixando.</li>
        <li><strong>Adubo de implantação:</strong> Aplique fertilizante rico em fósforo (como o Gramado Novo P1) logo após plantar.</li>
      </ul>

      <h2>Dia 8-21: Primeiras raízes</h2>
      <ul>
        <li><strong>Reduzir rega gradualmente:</strong> Passe para 1× ao dia, mas aumente a quantidade.</li>
        <li><strong>Observar pegamento:</strong> O tapete deve estar firme, as mudas devem mostrar crescimento.</li>
        <li><strong>Ainda não cortar:</strong> Aguarde pelo menos 15-20 dias.</li>
      </ul>

      <h2>Dia 22-30: Consolidação</h2>
      <ul>
        <li><strong>Primeiro corte:</strong> Se o gramado atingiu 5-7 cm, pode cortar levemente (máximo 1/3 da altura).</li>
        <li><strong>Segunda adubação:</strong> Aplique fertilizante de crescimento para estimular o verde e o adensamento.</li>
        <li><strong>Pisar com cuidado:</strong> Já pode usar levemente, mas evite tráfego intenso por mais 30 dias.</li>
      </ul>

      <h2>Erros que matam o gramado novo</h2>
      <ul>
        <li><strong>Falta de água:</strong> Solo seco = raízes que não pegam.</li>
        <li><strong>Cortar cedo demais:</strong> Arranca as mudas que ainda não fixaram.</li>
        <li><strong>Não adubar na implantação:</strong> Sem fósforo, as raízes demoram para crescer.</li>
      </ul>

      <p>Precisa de ajuda para calcular a dose de fertilizante? Use nossa <a href="/calculadora">calculadora gratuita</a>.</p>
    `,
    publishedAt: '2024-02-01T10:00:00.000Z',
    author: 'Equipe Terravik',
    category: 'como-fazer',
    categoryLabel: 'Como Fazer',
    readingTime: 3,
    featuredImage: null,
    tags: ['implantação', 'gramado novo', 'tapete', 'semente'],
  },
  {
    slug: 'gramado-amarelado-causas',
    title: 'Gramado amarelado? 5 causas e como resolver',
    excerpt:
      'Gramado amarelo não é sempre falta de adubo. Descubra as causas mais comuns e as soluções.',
    content: `
      <p>Gramado amarelado frustra qualquer dono de casa. Mas antes de sair adubando, é importante diagnosticar a causa certa.</p>

      <h2>1. Falta de nitrogênio</h2>
      <p><strong>Sintoma:</strong> Amarelamento uniforme, crescimento lento.</p>
      <p><strong>Solução:</strong> Aplicar fertilizante rico em nitrogênio, como o Verde Rápido (21-0-0). Resultado em 7-10 dias.</p>

      <h2>2. Excesso de água</h2>
      <p><strong>Sintoma:</strong> Amarelamento + solo encharcado + raízes podres.</p>
      <p><strong>Solução:</strong> Reduzir rega, melhorar drenagem. Fertilizante não resolve se o problema é água.</p>

      <h2>3. Compactação do solo</h2>
      <p><strong>Sintoma:</strong> Amarelamento em áreas de tráfego intenso, solo duro.</p>
      <p><strong>Solução:</strong> Aeração do solo (furar com garfo ou aerador) + adubo para recuperação.</p>

      <h2>4. Doença fúngica</h2>
      <p><strong>Sintoma:</strong> Manchas amarelas irregulares, às vezes com borda marrom.</p>
      <p><strong>Solução:</strong> Fungicida específico + reduzir umidade. Adubo ajuda na recuperação após tratamento.</p>

      <h2>5. Sombra excessiva</h2>
      <p><strong>Sintoma:</strong> Amarelamento em áreas com pouco sol, crescimento ralo.</p>
      <p><strong>Solução:</strong> Gramado precisa de pelo menos 4-6h de sol. Se não tem, considere reduzir árvores ou trocar por espécie de sombra.</p>

      <h2>Como diagnosticar?</h2>
      <p>Observe o padrão: amarelo uniforme = falta de nutriente. Amarelo em manchas = doença ou problema localizado. Solo encharcado = excesso de água.</p>

      <p>Se o problema for nutricional, nossa <a href="/calculadora">calculadora</a> indica a dose exata para recuperar o verde.</p>
    `,
    publishedAt: '2024-02-10T10:00:00.000Z',
    author: 'Equipe Terravik',
    category: 'dicas',
    categoryLabel: 'Dicas',
    readingTime: 3,
    featuredImage: null,
    tags: ['amarelado', 'problemas', 'diagnóstico', 'nitrogênio'],
  },
  {
    slug: 'produtos-terravik-quando-usar',
    title: 'Conheça os 3 produtos Terravik e quando usar cada um',
    excerpt:
      'P1, P2 ou P3? Entenda a diferença entre os produtos Terravik e monte seu plano ideal.',
    content: `
      <p>A Terravik tem três produtos — cada um resolve um problema específico do gramado. Não tem "melhor" ou "pior", tem o certo para o seu momento.</p>

      <h2>P1 — Gramado Novo (MAP 11-52-00)</h2>
      <p><strong>Para que serve:</strong> Enraizamento forte na implantação.</p>
      <p><strong>Quando usar:</strong> Logo após plantar tapete, mudas ou sementes. O fósforo (52%) estimula as raízes a crescerem rápido e fixarem no solo.</p>
      <p><strong>Resultado esperado:</strong> Gramado "pega" em 7-15 dias, raízes profundas, resistência ao arranque.</p>

      <h2>P2 — Verde Rápido (Sulfato de Amônio 21-0-0 + 24S)</h2>
      <p><strong>Para que serve:</strong> Recuperar o verde e acelerar o crescimento.</p>
      <p><strong>Quando usar:</strong> Gramado amarelado, fraco, crescendo devagar, ou após o inverno. Alta carga de nitrogênio (21%) dá resposta rápida.</p>
      <p><strong>Resultado esperado:</strong> Verde volta em 5-7 dias, crescimento acelerado, gramado denso.</p>

      <h2>P3 — Resistência Total (NPK 19-4-19)</h2>
      <p><strong>Para que serve:</strong> Proteção contra estresse (calor, pisoteio, uso intenso).</p>
      <p><strong>Quando usar:</strong> Verão escaldante, gramado com tráfego pesado (crianças, pets, churrasqueira), ou para manutenção equilibrada.</p>
      <p><strong>Resultado esperado:</strong> Gramado aguenta calor sem queimar, resiste ao pisoteio, mantém cor e vigor.</p>

      <h2>Fluxo ideal</h2>
      <ol>
        <li><strong>Implantação:</strong> Comece com P1 para enraizar bem.</li>
        <li><strong>Crescimento:</strong> Use P2 para recuperar cor e densidade.</li>
        <li><strong>Manutenção:</strong> Alterne P2 (crescimento) e P3 (resistência) conforme a necessidade.</li>
      </ol>

      <p>Não sabe qual usar ou quanto aplicar? Nossa <a href="/calculadora">calculadora</a> monta o plano completo personalizado para você.</p>
    `,
    publishedAt: '2024-02-15T10:00:00.000Z',
    author: 'Equipe Terravik',
    category: 'produto',
    categoryLabel: 'Produto',
    readingTime: 3,
    featuredImage: null,
    tags: ['produtos', 'gramado novo', 'verde rápido', 'resistência total'],
  },
]

// Helper functions
export function getArticles(): BlogArticle[] {
  return BLOG_ARTICLES.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getArticleBySlug(slug: string): BlogArticle | null {
  return BLOG_ARTICLES.find((article) => article.slug === slug) || null
}

export function getRelatedArticles(
  slug: string,
  limit: number = 2
): BlogArticle[] {
  const current = getArticleBySlug(slug)
  if (!current) return []

  // Encontrar artigos com tags em comum
  const related = BLOG_ARTICLES.filter((article) => {
    if (article.slug === slug) return false
    return article.tags.some((tag) => current.tags.includes(tag))
  })

  // Se não houver relacionados por tag, retornar os mais recentes
  if (related.length === 0) {
    return getArticles()
      .filter((a) => a.slug !== slug)
      .slice(0, limit)
  }

  return related.slice(0, limit)
}
