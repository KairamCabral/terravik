import Link from 'next/link'
import Image from 'next/image'
import type { BlogArticle } from '@/lib/blog/articles'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils/formatters'
import { Clock } from 'lucide-react'

interface ArticleCardProps {
  article: BlogArticle
}

const categoryColors = {
  'como-fazer': 'bg-terravik-green/10 text-terravik-green-700',
  'produto': 'bg-terravik-gold/10 text-terravik-gold-700',
  'dicas': 'bg-terravik-brown/10 text-terravik-brown-700',
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block overflow-hidden rounded-2xl border-2 border-terravik-brown/10 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Imagem */}
      <div className="relative aspect-video overflow-hidden bg-terravik-cream-100">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            🌱
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Badge de categoria */}
        <Badge
          className={`mb-3 ${categoryColors[article.category]}`}
          size="sm"
        >
          {article.categoryLabel}
        </Badge>

        {/* Título */}
        <h3 className="mb-2 font-display text-xl font-bold text-terravik-brown line-clamp-2 group-hover:text-terravik-green">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-sm text-terravik-brown/70 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-terravik-brown/60">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
