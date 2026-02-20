import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Leaf } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/utils/constants'

/**
 * Footer Premium — Design System 2026
 *
 * - Fundo forest (bg-dark)
 * - Mini manifesto
 * - Links organizados — "Onde Encontrar" e "Academia" destacados
 * - Selos discretos, sem imagem cafona
 */

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    produtos: [
      { label: 'Gramado Novo', href: '/produtos/gramado-novo' },
      { label: 'Verde Rápido', href: '/produtos/verde-rapido' },
      { label: 'Resistência Total', href: '/produtos/resistencia-total' },
      { label: 'Ver Todos', href: '/produtos' },
    ],
    recursos: [
      { label: 'Calculadora de Dose', href: '/calculadora', highlight: true },
      { label: 'Cursos Terravik', href: '/academia', highlight: true },
      { label: 'Onde Encontrar', href: '/onde-encontrar' },
    ],
    'empresa & suporte': [
      { label: 'Sobre a Terravik', href: '/sobre' },
      { label: 'Trocas e Devoluções', href: '/trocas-devolucoes' },
      { label: 'Falar com a Equipe', href: '/contato' },
      { label: 'Seja Representante', href: '/representantes' },
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
    ],
  }

  const socialIcons = [
    { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
    { icon: MessageCircle, href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp' },
  ]

  return (
    <footer className="bg-bg-dark text-txt-on-dark">
      <div className="container-main">
        {/* Main */}
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
          {/* Brand + manifesto */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/logo/Logo-terravik-horizontal-png.png"
                alt="Terravik"
                width={160}
                height={36}
                className="h-9 w-auto brightness-0 invert transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Mini manifesto */}
            <p className="mt-6 max-w-md text-sm leading-relaxed text-txt-on-dark-muted">
              Gramados impecáveis começam com nutrição inteligente.
              Desenvolvemos fertilizantes com dose certa, resultado previsível
              e aplicação simples — para quem leva o cuidado do gramado a sério.
            </p>

            {/* Social */}
            <div className="mt-8 flex items-center gap-3">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-txt-on-dark-muted transition-all duration-200 hover:border-white/25 hover:text-txt-on-dark"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2 text-sm text-txt-on-dark-muted">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold" />
                <a href="mailto:contato@terravik.com.br" className="hover:text-txt-on-dark transition-colors">
                  contato@terravik.com.br
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gold" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gold">
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${
                        'highlight' in link && link.highlight
                          ? 'font-medium text-txt-on-dark hover:text-gold'
                          : 'text-txt-on-dark-muted hover:text-txt-on-dark'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Grupo CTA */}
        <div className="border-t border-white/10 py-8">
          <div className="mx-auto max-w-md text-center">
            <h3 className="text-sm font-semibold text-txt-on-dark">
              Acesse nosso grupo e descubra ofertas secretas
            </h3>
            <p className="mt-1 text-xs text-txt-on-dark-muted">
              Promoções exclusivas, dicas e novidades em primeira mão.
            </p>
            <div className="mt-4">
              <a
                href="https://chat.whatsapp.com/SEU_LINK_AQUI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest border border-white/15 text-white text-sm font-semibold rounded-xl hover:bg-forest/80 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Entrar no grupo
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-txt-on-dark-muted md:flex-row">
            <p>© {currentYear} Terravik. Todos os direitos reservados.</p>
            <div className="flex items-center gap-5">
              <Link href="/privacidade" className="hover:text-txt-on-dark transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="hover:text-txt-on-dark transition-colors">
                Termos
              </Link>
              <Link href="/trocas-devolucoes" className="hover:text-txt-on-dark transition-colors">
                Trocas
              </Link>
              <span className="flex items-center gap-1">
                Feito com <Leaf className="h-3 w-3 text-gold" /> para gramados
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
