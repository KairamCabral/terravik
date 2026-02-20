/**
 * GraphQL queries para Blog/Artigos do Shopify
 */

import { shopifyFetch } from '../client'

interface BlogArticle {
  id: string
  handle: string
  title: string
  contentHtml: string
  excerpt: string | null
  publishedAt: string
  image: {
    url: string
    altText: string | null
    width: number
    height: number
  } | null
  author: {
    name: string
  }
  seo: {
    title: string | null
    description: string | null
  }
}

const GET_BLOG_ARTICLES = `
  query GetBlogArticles($blogHandle: String!, $first: Int = 20) {
    blog(handle: $blogHandle) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            handle
            title
            contentHtml
            excerpt
            publishedAt
            image {
              url
              altText
              width
              height
            }
            author {
              name
            }
            seo {
              title
              description
            }
          }
        }
      }
    }
  }
`

const GET_ARTICLE_BY_HANDLE = `
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        handle
        title
        contentHtml
        excerpt
        publishedAt
        image {
          url
          altText
          width
          height
        }
        author {
          name
        }
        seo {
          title
          description
        }
      }
    }
  }
`

export async function getBlogArticles(
  blogHandle = 'blog',
  first = 20
): Promise<BlogArticle[]> {
  const data = await shopifyFetch<{
    blog: { articles: { edges: Array<{ node: BlogArticle }> } } | null
  }>({
    query: GET_BLOG_ARTICLES,
    variables: { blogHandle, first },
    tags: ['blog'],
    revalidate: 300,
  })

  if (!data.blog) return []
  return data.blog.articles.edges.map((edge) => edge.node)
}

export async function getArticleByHandle(
  articleHandle: string,
  blogHandle = 'blog'
): Promise<BlogArticle | null> {
  const data = await shopifyFetch<{
    blog: { articleByHandle: BlogArticle | null } | null
  }>({
    query: GET_ARTICLE_BY_HANDLE,
    variables: { blogHandle, articleHandle },
    tags: ['blog', `article-${articleHandle}`],
    revalidate: 300,
  })

  return data.blog?.articleByHandle || null
}
