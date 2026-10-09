'use client'

import { MessageCircle, Mail, HelpCircle } from 'lucide-react'
import { linkWhatsapp } from '@/lib/utils/constants'

export function CheckoutHelp() {
  const whatsapp = linkWhatsapp()

  return (
    <div className="text-center py-6 border-t border-border-subtle mt-8">
      <p className="text-xs text-txt-muted mb-3">Precisa de ajuda?</p>
      <div className="flex items-center justify-center gap-4">
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-forest hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        )}
        <a
          href="mailto:contato@terravik.com.br"
          className="flex items-center gap-1.5 text-xs text-forest hover:underline"
        >
          <Mail className="w-3.5 h-3.5" />
          E-mail
        </a>
        <a
          href="/contato"
          className="flex items-center gap-1.5 text-xs text-forest hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          FAQ
        </a>
      </div>
    </div>
  )
}
