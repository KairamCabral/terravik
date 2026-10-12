import Image from 'next/image'
import Link from 'next/link'

/**
 * Banner da linha: os três produtos juntos, com link para a vitrine.
 *
 * Computador: a arte inteira (1920x806), com o título.
 * Celular: recorte nas três embalagens (1350x812). O título da arte ficaria
 * ilegível numa tela estreita, então ele vai em texto abaixo da imagem.
 */
export function BenefitsSection() {
  return (
    <section className="bg-bg-primary section-spacing">
      <Link
        href="/produtos"
        className="group mx-auto block w-[92%] overflow-hidden rounded-2xl shadow-[0_24px_60px_-30px_rgba(9,62,40,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-4 md:w-[80%] lg:rounded-3xl"
      >
        <Image
          src="/images/linha-terravik-v2.jpg"
          alt="Raiz Forte, Verde Rápido e Resistência Total, os três fertilizantes Terravik, sobre um gramado. Nutrição inteligente para seu gramado."
          width={1920}
          height={806}
          className="hidden h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none md:block"
          sizes="80vw"
          quality={88}
        />

        <Image
          src="/images/linha-terravik-v2-celular.jpg"
          alt="Raiz Forte, Verde Rápido e Resistência Total, os três fertilizantes Terravik, sobre um gramado."
          width={1350}
          height={812}
          className="block h-auto w-full md:hidden"
          sizes="92vw"
          quality={88}
        />
        <p className="bg-gradient-forest px-5 py-4 text-center font-heading text-lg font-bold text-white md:hidden">
          Nutrição inteligente <span className="text-gold-soft">para seu gramado</span>
        </p>
      </Link>
    </section>
  )
}
