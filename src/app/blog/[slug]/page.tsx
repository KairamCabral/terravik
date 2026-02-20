import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { breadcrumbSchema, articleSchema } from '@/lib/seo/metadata'
import { Container, Badge, Button } from '@/components/ui'
import { ArticleCard } from '@/components/blog'
import {
  getArticleBySlug,
  getRelatedArticles,
  BLOG_ARTICLES,
} from '@/lib/blog/articles'
import { formatDate } from '@/lib/utils/formatters'
import { Clock, User, ArrowLeft } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Artigo não encontrado',
    }
  }

  return {
    title: `${article.title} — Blog Terravik`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  }
}

const categoryColors = {
  'como-fazer': 'bg-terravik-green/10 text-terravik-green-700',
  'produto': 'bg-terravik-gold/10 text-terravik-gold-700',
  'dicas': 'bg-terravik-brown/10 text-terravik-brown-700',
}

export default function BlogArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = getRelatedArticles(params.slug, 2)

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: article.title, url: `/blog/${article.slug}` },
            ])
          ),
        }}
      />

      {/* Breadcrumbs visuais */}
      <Container className="py-6">
        <nav className="flex items-center gap-2 text-sm text-terravik-brown/60">
          <Link href="/" className="hover:text-terravik-green">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-terravik-green">
            Blog
          </Link>
          <span>/</span>
          <span className="text-terravik-brown">{article.title}</span>
        </nav>
      </Container>

      <article>
        {/* Header */}
        <Container className="pb-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm text-terravik-green hover:text-terravik-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o blog
            </Link>

            <Badge
              className={`mb-4 ${categoryColors[article.category]}`}
              size="sm"
            >
              {article.categoryLabel}
            </Badge>

            <h1 className="mb-4 font-display text-3xl font-bold text-terravik-brown md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-terravik-brown/60">
              <time
                dateTime={article.publishedAt}
                className="flex items-center gap-1"
              >
                {formatDate(article.publishedAt)}
              </time>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readingTime} min de leitura
              </span>
            </div>
          </div>
        </Container>

        {/* Conteúdo */}
        <Container className="pb-12">
          <div
            className="prose prose-lg prose-terravik mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Container>

        {/* Tags */}
        {article.tags.length > 0 && (
          <Container className="border-t border-terravik-brown/10 py-8">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-3 text-sm font-medium text-terravik-brown/60">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    size="sm"
                    className="bg-terravik-brown/10 text-terravik-brown"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Container>
        )}
      </article>

      {/* CTA */}
      <section className="bg-terravik-green py-12 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Quer saber a dose certa para o seu gramado?
            </h2>
            <p className="mt-3 text-white/90">
              Use nossa calculadora gratuita e receba um plano personalizado em
              menos de 1 minuto.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-6"
              asChild
            >
              <Link href="/calculadora">Calcular agora</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Artigos relacionados */}
      {relatedArticles.length > 0 && (
        <Container spacing="lg">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-terravik-brown md:text-3xl">
            Leia também
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      )}
    </>
  )
}
