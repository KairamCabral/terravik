import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/shopify/queries/products'
import { BLOG_ARTICLES } from '@/lib/blog/articles'
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data'

interface SearchResult {
  type: 'product' | 'article' | 'page'
  id: string
  title: string
  description?: string
  url: string
  category?: string
  relevance: number
}

// Páginas estáticas para busca
const STATIC_PAGES = [
  {
    id: 'calculadora',
    title: 'Calculadora de Fertilizante',
    description: 'Calcule a dose exata para o seu gramado em menos de 1 minuto',
    url: '/calculadora',
    keywords: ['calculadora', 'calcular', 'dose', 'quanto', 'quantidade'],
  },
  {
    id: 'sobre',
    title: 'Sobre a Terravik',
    description: 'Conheça nossa história, valores e o que nos diferencia',
    url: '/sobre',
    keywords: ['sobre', 'empresa', 'história', 'quem somos'],
  },
  {
    id: 'contato',
    title: 'Contato',
    description: 'Entre em contato conosco por WhatsApp, email ou telefone',
    url: '/contato',
    keywords: ['contato', 'falar', 'whatsapp', 'email', 'telefone'],
  },
  {
    id: 'onde-encontrar',
    title: 'Onde Encontrar',
    description: 'Encontre pontos de venda Terravik perto de você',
    url: '/onde-encontrar',
    keywords: ['onde', 'encontrar', 'comprar', 'loja', 'ponto de venda'],
  },
  {
    id: 'representantes',
    title: 'Representantes',
    description: 'Encontre um representante Terravik ou seja um',
    url: '/representantes',
    keywords: ['representante', 'revenda', 'parceiro'],
  },
]

function calculateRelevance(searchTerm: string, item: any): number {
  const term = searchTerm.toLowerCase()
  let score = 0

  // Título exato = 10 pontos
  if (item.title?.toLowerCase() === term) {
    score += 10
  }
  // Título contém = 5 pontos
  else if (item.title?.toLowerCase().includes(term)) {
    score += 5
  }

  // Descrição contém = 2 pontos
  if (item.description?.toLowerCase().includes(term)) {
    score += 2
  }

  // Keywords contém = 3 pontos
  if (item.keywords?.some((k: string) => k.toLowerCase().includes(term))) {
    score += 3
  }

  // Tags contém = 2 pontos
  if (item.tags?.some((t: string) => t.toLowerCase().includes(term))) {
    score += 2
  }

  return score
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const results: SearchResult[] = []

    // 1. Buscar produtos
    try {
      const products = await getProducts()
      
      products.forEach((product) => {
        const relevance = calculateRelevance(query, {
          title: product.title,
          description: product.description,
          tags: product.tags,
        })

        if (relevance > 0) {
          results.push({
            type: 'product',
            id: product.id,
            title: product.title,
            description: product.description?.substring(0, 150),
            url: `/produtos/${product.handle}`,
            relevance,
          })
        }
      })
    } catch (error) {
      // Fallback para mock products
      MOCK_PRODUCTS.forEach((product) => {
        const relevance = calculateRelevance(query, {
          title: product.title,
          description: product.description,
          tags: product.tags,
        })

        if (relevance > 0) {
          results.push({
            type: 'product',
            id: product.id,
            title: product.title,
            description: product.description?.substring(0, 150),
            url: `/produtos/${product.handle}`,
            relevance,
          })
        }
      })
    }

    // 2. Buscar artigos do blog
    BLOG_ARTICLES.forEach((article) => {
      const relevance = calculateRelevance(query, {
        title: article.title,
        description: article.excerpt,
        tags: article.tags,
        keywords: [article.category],
      })

      if (relevance > 0) {
        results.push({
          type: 'article',
          id: article.slug,
          title: article.title,
          description: article.excerpt,
          url: `/blog/${article.slug}`,
          category: article.category,
          relevance,
        })
      }
    })

    // 3. Buscar páginas estáticas
    STATIC_PAGES.forEach((page) => {
      const relevance = calculateRelevance(query, page)

      if (relevance > 0) {
        results.push({
          type: 'page',
          id: page.id,
          title: page.title,
          description: page.description,
          url: page.url,
          relevance,
        })
      }
    })

    // Ordenar por relevância e limitar a 10 resultados
    const sortedResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10)
      .map(({ relevance, ...rest }) => rest) // Remove relevance do resultado final

    return NextResponse.json({ results: sortedResults })
  } catch (error) {
    console.error('Erro na busca:', error)
    return NextResponse.json(
      { error: 'Erro ao realizar busca' },
      { status: 500 }
    )
  }
}
