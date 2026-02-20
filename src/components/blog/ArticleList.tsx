import type { BlogArticle } from '@/lib/blog/articles'
import { ArticleCard } from './ArticleCard'

interface ArticleListProps {
  articles: BlogArticle[]
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-terravik-brown/70">
          Nenhum artigo encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  )
}
