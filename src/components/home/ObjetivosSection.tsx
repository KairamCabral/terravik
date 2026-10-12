import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera } from 'lucide-react'

/**
 * Atalhos por objetivo, logo abaixo do banner: quem chega com um problema
 * ("meu gramado está amarelo") acha o produto sem precisar conhecer a linha.
 * As frases são o "para quem" impresso na frente de cada embalagem.
 */
const OBJETIVOS = [
  {
    titulo: 'Vou plantar ou reformar',
    texto: 'Plantio, reforma ou falhas no gramado',
    produto: 'Raiz Forte',
    href: '/produtos/raiz-forte',
    imagem: '/images/grass/quiz/plantar-grama-nova.png',
  },
  {
    titulo: 'Meu gramado está amarelado',
    texto: 'Sem cor, fraco ou sem vida',
    produto: 'Verde Rápido',
    href: '/produtos/verde-rapido',
    imagem: '/images/grass/quiz/fraco-ou-amarelado.png',
  },
  {
    titulo: 'Quero manter forte',
    texto: 'Resistência à seca, ao sol e ao pisoteio',
    produto: 'Resistência Total',
    href: '/produtos/resistencia-total',
    imagem: '/images/grass/quiz/fortalecer.png',
  },
] as const

export function ObjetivosSection() {
  return (
    <section aria-labelledby="titulo-objetivos" className="bg-bg-primary">
      <div className="container-main py-10 md:py-14">
        <div className="mb-6 text-center md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Comece por aqui</p>
          <h2 id="titulo-objetivos" className="mt-2 font-heading text-2xl font-bold text-txt-primary md:text-4xl">
            O que o seu gramado precisa?
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {OBJETIVOS.map((objetivo) => (
            <li key={objetivo.href}>
              <Link
                href={objetivo.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface-2">
                  <Image
                    src={objetivo.imagem}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading text-base font-bold leading-snug text-txt-primary md:text-lg">
                    {objetivo.titulo}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-txt-secondary md:text-sm">{objetivo.texto}</p>
                  <p className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-forest">
                    {objetivo.produto}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/calculadora"
              className="group flex h-full flex-col justify-between rounded-2xl bg-gradient-forest p-4 text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Camera className="h-5 w-5 text-gold-soft" aria-hidden="true" />
              </span>
              <div className="mt-6">
                <h3 className="font-heading text-base font-bold leading-snug md:text-lg">Não sei qual escolher</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/80 md:text-sm">
                  Tire uma foto do gramado e veja o produto e a quantidade.
                </p>
                <p className="flex items-center gap-1 pt-3 text-sm font-semibold text-gold-soft">
                  Abrir a calculadora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
