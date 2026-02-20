'use client'

import Link from 'next/link'
import { Lock, ArrowLeft } from 'lucide-react'

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-bg-surface/95 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: back */}
        <Link
          href="/produtos"
          className="flex items-center gap-1.5 text-sm text-txt-muted hover:text-txt-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>

        {/* Center: logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="font-heading text-xl font-semibold text-forest tracking-tight">
            Terravik
          </span>
        </Link>

        {/* Right: trust signal */}
        <div className="flex items-center gap-1.5 text-xs text-txt-muted">
          <Lock className="w-3.5 h-3.5 text-forest" />
          <span className="hidden sm:inline">Compra 100% segura</span>
          <span className="sm:hidden">Seguro</span>
        </div>
      </div>
    </header>
  )
}
