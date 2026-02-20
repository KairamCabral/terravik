'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/**
 * SearchBar — Design System 2026
 *
 * - Ícone outline, borda sutil, estados polidos
 * - Ctrl/Cmd+K, Esc, click outside
 * - Tokens DS completos
 */

interface SearchResult {
  type: 'product' | 'article' | 'page'
  id: string
  title: string
  description?: string
  url: string
  category?: string
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch { setResults([]) }
      finally { setIsLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function handleClear() {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 0) }}
        className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-txt-muted transition-colors hover:border-border-medium hover:text-txt-secondary"
        aria-label="Buscar produtos"
      >
        <Search className="h-4 w-4" strokeWidth={1.5} />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden rounded border border-border-subtle px-1.5 py-0.5 text-[10px] font-medium text-txt-muted lg:inline">
          ⌘K
        </kbd>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg-dark/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed left-1/2 top-20 z-50 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-border-subtle bg-bg-surface p-4 shadow-xl sm:top-24"
          role="dialog"
          aria-label="Buscar"
        >
          {/* Input */}
          <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface-2 px-4 py-3">
            <Search className="h-5 w-5 text-txt-muted" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos, artigos..."
              className="flex-1 bg-transparent text-txt-primary placeholder:text-txt-muted focus:outline-none"
              aria-label="Buscar produtos e artigos"
              autoFocus
            />
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-txt-muted" />}
            {query && !isLoading && (
              <button
                onClick={handleClear}
                className="rounded-md p-1 text-txt-muted transition-colors hover:bg-bg-surface hover:text-txt-primary"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-3 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-bg-surface-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                            result.type === 'product' && 'border-forest/20 text-forest',
                            result.type === 'article' && 'border-gold/30 text-gold',
                            result.type === 'page' && 'border-border-subtle text-txt-muted'
                          )}
                        >
                          {result.type === 'product' && 'Produto'}
                          {result.type === 'article' && 'Artigo'}
                          {result.type === 'page' && 'Página'}
                        </span>
                        {result.category && (
                          <span className="text-[10px] text-txt-muted">{result.category}</span>
                        )}
                      </div>
                      <h4 className="mt-1 text-sm font-medium text-txt-primary">{result.title}</h4>
                      {result.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-txt-secondary">{result.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className="mt-3 rounded-lg bg-bg-surface-2 p-6 text-center">
              <p className="text-sm text-txt-muted">
                Nenhum resultado encontrado para &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {/* Suggestions */}
          {query.length === 0 && (
            <div className="mt-3 rounded-lg bg-bg-surface-2 p-4">
              <p className="mb-2 text-xs font-medium text-txt-secondary">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {['Gramado Novo', 'Verde Rápido', 'Fertilizante', 'Adubar'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-border-subtle px-3 py-1 text-xs text-txt-secondary transition-colors hover:bg-bg-surface hover:text-txt-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
