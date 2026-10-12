import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  Check,
  ChevronDown,
  Droplets,
  Hand,
  PlayCircle,
  Ruler,
  ShieldAlert,
} from 'lucide-react'
import type { Product } from '@/types/product'
import {
  A_CONTA,
  ARGUMENTO,
  ARMAZENAMENTO,
  CHAMADA_FINAL,
  COMO_USAR,
  CUIDADOS,
  DOSADOR_INCLUSO,
  GRANULO_UNIFORME,
  LINHA_DO_TEMPO,
  LP_POR_HANDLE,
  PESO_DO_SACO,
  custoPorM2,
  gramasPorM2,
  type ConteudoDaLp,
} from '@/lib/produtos/lp'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { CalculadoraDeArea } from './CalculadoraDeArea'

/**
 * Página de produto, abaixo da área de compra.
 *
 * Componente de servidor: o texto todo sai no HTML inicial. O conteúdo vem de
 * src/lib/produtos/lp.ts, que por sua vez repete o rótulo da embalagem. Cada
 * seção decide sozinha se tem o que mostrar.
 *
 * Ordem pensada para a decisão de compra: promessa (com o vídeo), o porquê,
 * o que entrega, quanto eu preciso, como usar, onde o produto entra no
 * cuidado do gramado, ficha técnica, dúvidas e a chamada final.
 */

interface ProductLpProps {
  product: Product
  conteudo: ConteudoDaLp
}

const DOSADOR = '/images/produtos/dosador-100-ml.webp'

/** A moldura reservada do vídeo só aparece fora de produção. */
const MOSTRAR_ESPACO_RESERVADO = process.env.VERCEL_ENV !== 'production'

const ICONES_DO_PASSO = [Ruler, Hand, Droplets]

function Sobretitulo({ children, claro }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <p
      className={cn(
        'mb-3 text-xs font-semibold uppercase tracking-[0.18em]',
        claro ? 'text-gold-soft' : 'text-gold-ink'
      )}
    >
      {children}
    </p>
  )
}

export function ProductLp({ product, conteudo }: ProductLpProps) {
  const variante = product.variants.find((v) => v.available) ?? product.variants[0]
  const granulo = product.images.find((i) => i.url.endsWith('/granulo.webp'))
  const { rendimento } = conteudo
  const video = conteudo.destaque.video
  const imagemDeDestaque = conteudo.destaque.imagem
  const temMidia = Boolean(video || imagemDeDestaque || MOSTRAR_ESPACO_RESERVADO)
  const gramas = gramasPorM2(rendimento)
  // O custo por m² só entra onde o argumento do rendimento se aplica.
  const custo =
    variante && conteudo.compararDose ? custoPorM2(variante.price, rendimento) : null

  return (
    <div className="bg-bg-primary">
      {/* ═══ 2. DESTAQUE: a promessa e o vídeo ═══ */}
      <section className="bg-forest text-white">
        <div className="container-main py-14 md:py-20">
          <div className={cn('grid items-center gap-10', temMidia && 'lg:grid-cols-2 lg:gap-14')}>
            <div className={cn(!temMidia && 'mx-auto max-w-3xl text-center')}>
              <Sobretitulo claro>{conteudo.destaque.sobretitulo}</Sobretitulo>
              <h2 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
                {conteudo.destaque.titulo}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/85">{conteudo.destaque.texto}</p>
              <a
                href="#comprar"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest transition-all hover:bg-gold-soft"
              >
                Quero o {product.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {video ? (
              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={video.capa}
                  aria-label={video.descricao}
                  className="aspect-video h-full w-full"
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
            ) : imagemDeDestaque ? (
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src={imagemDeDestaque.src}
                  alt={imagemDeDestaque.alt}
                  width={imagemDeDestaque.largura}
                  height={imagemDeDestaque.altura}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="aspect-[4/3] h-full w-full object-cover sm:aspect-[16/9] lg:aspect-[4/3]"
                />
              </div>
            ) : (
              MOSTRAR_ESPACO_RESERVADO && (
                <div
                  className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/40 bg-white/5 p-6 text-center"
                  data-espaco-reservado="video"
                >
                  <PlayCircle className="h-12 w-12 text-white/70" aria-hidden="true" />
                  <p className="text-sm font-semibold">Espaço reservado para o vídeo</p>
                  <p className="max-w-xs text-xs text-white/75">
                    Visível só fora de produção. Preencha o campo video deste produto em
                    src/lib/produtos/lp.ts.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══ 3. FÓRMULA CONCENTRADA: o argumento ═══ */}
      <section className="border-b border-border-subtle bg-bg-surface">
        <div className="container-main py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
            <div>
              <Sobretitulo>{ARGUMENTO.sobretitulo}</Sobretitulo>
              <h2 className="font-heading text-3xl font-bold leading-tight text-txt-primary md:text-4xl">
                {ARGUMENTO.titulo}
              </h2>
              <div className="mt-5 space-y-4">
                {ARGUMENTO.paragrafos.map((p) => (
                  <p key={p} className="text-base leading-relaxed text-txt-secondary">
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-5 rounded-2xl border-l-4 border-gold bg-bg-primary p-5 text-base leading-relaxed text-txt-primary">
                <strong className="font-semibold">{product.title}:</strong> {conteudo.trabalho}
              </p>
            </div>

            <div className="rounded-3xl bg-forest p-8 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                O resultado
              </p>
              <p className="mt-3 font-heading text-6xl font-bold leading-none md:text-7xl">
                {gramas}
                <span className="ml-1 text-2xl font-semibold md:text-3xl">g/m²</span>
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                Cerca de {gramas} gramas por metro quadrado já fazem o trabalho.
                {conteudo.compararDose && ` ${ARGUMENTO.comparacao}`}
              </p>
              <p className="mt-5 border-t border-white/20 pt-5 text-sm text-white/85">
                Um saco de {PESO_DO_SACO} trata até{' '}
                <strong className="font-semibold text-white">{rendimento.m2PorSaco} m²</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. O PORQUÊ ═══ */}
      <section className="container-main py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Sobretitulo>Por que funciona</Sobretitulo>
            <h2 className="font-heading text-3xl font-bold leading-tight text-txt-primary md:text-4xl">
              {conteudo.porque.titulo}
            </h2>
            <div className="mt-5 space-y-4">
              {conteudo.porque.paragrafos.map((p) => (
                <p key={p} className="text-base leading-relaxed text-txt-secondary">
                  {p}
                </p>
              ))}
            </div>
            {conteudo.porque.diferencial && (
              <div className="mt-6 rounded-2xl border-l-4 border-gold bg-bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-ink">
                  Diferencial técnico
                </p>
                <p className="mt-2 text-sm leading-relaxed text-txt-primary">
                  {conteudo.porque.diferencial}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-bg-surface-2 p-6 sm:p-8">
            {granulo && (
              <div className="relative mx-auto aspect-[3/2] w-full max-w-md">
                <Image
                  src={granulo.url}
                  alt={granulo.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 28rem"
                  className="object-contain"
                />
              </div>
            )}
            <h3 className="mt-4 text-center font-heading text-xl font-bold text-forest">
              {GRANULO_UNIFORME.titulo}
            </h3>
            <p className="mt-1 text-center text-sm text-txt-secondary">{GRANULO_UNIFORME.texto}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {GRANULO_UNIFORME.atributos.map((atributo) => (
                <li
                  key={atributo}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-bg-surface px-3 py-2 text-center text-xs font-semibold text-forest"
                >
                  <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {atributo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ 5. O QUE ENTREGA ═══ */}
      <section className="border-y border-border-subtle bg-bg-surface">
        <div className="container-main py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Sobretitulo>O que o {product.title} entrega</Sobretitulo>
            <h2 className="font-heading text-3xl font-bold text-txt-primary md:text-4xl">
              {conteudo.paraQuem}
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {conteudo.beneficios.map((beneficio, indice) => (
              <li
                key={beneficio.titulo}
                className="rounded-2xl border border-border-subtle bg-bg-primary p-6"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-forest font-heading text-lg font-bold text-white"
                  aria-hidden="true"
                >
                  {indice + 1}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-txt-primary">
                  {beneficio.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{beneficio.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 6. A CONTA E QUANTO EU PRECISO ═══ */}
      <section className="container-main py-14 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Sobretitulo>{A_CONTA.sobretitulo}</Sobretitulo>
            <h2 className="font-heading text-3xl font-bold leading-tight text-txt-primary md:text-4xl">
              {A_CONTA.titulo}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-txt-secondary">{A_CONTA.texto}</p>
            <p className="mt-4 rounded-2xl bg-forest/5 p-5 text-base leading-relaxed text-txt-primary">
              <strong className="font-semibold">Pense assim:</strong> você não está comprando{' '}
              {PESO_DO_SACO} de adubo. Está comprando até {rendimento.m2PorSaco} m² de gramado
              tratado
              {custo !== null && (
                <>
                  , por cerca de{' '}
                  <strong className="font-semibold text-forest">
                    {formatCurrency(custo, product.currency)} por m²
                  </strong>
                </>
              )}
              .
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                { rotulo: 'Peso líquido', valor: PESO_DO_SACO },
                { rotulo: 'Rende até', valor: `${rendimento.m2PorSaco} m²` },
                {
                  rotulo: '1 dosador raso',
                  valor: `${rendimento.dosadorEstimado ? '≈ ' : ''}${rendimento.m2PorDosador} m²`,
                },
              ].map((item) => (
                <div key={item.rotulo} className="rounded-2xl bg-bg-surface-2 p-4 text-center">
                  <dt className="text-xs text-txt-secondary">{item.rotulo}</dt>
                  <dd className="mt-1 font-heading text-xl font-bold text-forest sm:text-2xl">
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-4">
              <div className="relative h-16 w-28 shrink-0">
                <Image
                  src={DOSADOR}
                  alt="Dosador de 100 ml que acompanha a embalagem"
                  fill
                  sizes="7rem"
                  className="object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-txt-secondary">
                <strong className="font-semibold text-txt-primary">{DOSADOR_INCLUSO.titulo}.</strong>{' '}
                {DOSADOR_INCLUSO.texto} Um dosador raso cobre cerca de {rendimento.m2PorDosador} m².
              </p>
            </div>
          </div>

          <div>
            {variante && (
              <CalculadoraDeArea
                nomeDoProduto={product.title}
                variantId={variante.id}
                preco={variante.price}
                moeda={product.currency}
                disponivel={variante.available}
                rendimento={rendimento}
              />
            )}
            <Link
              href="/calculadora"
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-bg-surface p-4 text-sm font-medium text-forest transition-colors hover:border-forest/40"
            >
              <span className="flex items-center gap-3">
                <Calculator className="h-5 w-5 shrink-0" aria-hidden="true" />
                Não sabe por onde começar? A calculadora monta o plano do seu gramado.
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 7. COMO USAR ═══ */}
      <section className="bg-bg-surface-2">
        <div className="container-main py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Sobretitulo>Como usar</Sobretitulo>
            <h2 className="font-heading text-3xl font-bold text-txt-primary md:text-4xl">
              Simples assim: espalhe e regue
            </h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {COMO_USAR.map((passo, indice) => {
              const Icone = ICONES_DO_PASSO[indice]
              return (
                <li key={passo.titulo} className="rounded-2xl bg-bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <Icone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-ink">
                      Passo {indice + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-txt-primary">{passo.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{passo.texto}</p>
                </li>
              )
            })}
          </ol>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-bg-surface p-5 text-center text-sm leading-relaxed text-txt-secondary">
            <strong className="font-semibold text-txt-primary">{conteudo.quandoUsar.titulo}.</strong>{' '}
            {conteudo.quandoUsar.texto}
          </p>
        </div>
      </section>

      {/* ═══ 8. LINHA DO TEMPO DO GRAMADO ═══ */}
      <section className="container-main py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Sobretitulo>Linha do tempo do seu gramado</Sobretitulo>
          <h2 className="font-heading text-3xl font-bold text-txt-primary md:text-4xl">
            Um saco para cada momento do gramado
          </h2>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {LINHA_DO_TEMPO.map((item) => {
            const atual = item.handle === product.handle
            const conteudoDoCartao = (
              <>
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full font-heading text-lg font-bold',
                    atual ? 'bg-white text-forest' : 'bg-forest/10 text-forest'
                  )}
                  aria-hidden="true"
                >
                  {item.etapa}
                </span>
                <span className="mt-4 block font-heading text-xl font-bold">{item.nome}</span>
                <span className={cn('mt-1 block text-sm', atual ? 'text-white/85' : 'text-txt-secondary')}>
                  {item.papel}
                </span>
                {LP_POR_HANDLE[item.handle] && (
                  <span
                    className={cn(
                      'mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold',
                      atual ? 'bg-white/15 text-white' : 'bg-bg-surface-2 text-txt-primary'
                    )}
                  >
                    Rende até {LP_POR_HANDLE[item.handle].rendimento.m2PorSaco} m²
                  </span>
                )}
                <span
                  className={cn(
                    'mt-4 inline-flex items-center gap-1 text-sm font-semibold',
                    atual ? 'text-gold-soft' : 'text-forest'
                  )}
                >
                  {atual ? (
                    'Você está aqui'
                  ) : (
                    <>
                      Conhecer
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </span>
              </>
            )
            return (
              <li key={item.handle}>
                {atual ? (
                  <div className="h-full rounded-2xl bg-forest p-6 text-white" aria-current="page">
                    {conteudoDoCartao}
                  </div>
                ) : (
                  <Link
                    href={`/produtos/${item.handle}`}
                    className="block h-full rounded-2xl border border-border-subtle bg-bg-surface p-6 text-txt-primary transition-all hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lg"
                  >
                    {conteudoDoCartao}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      {/* ═══ 9. FICHA TÉCNICA E CUIDADOS ═══ */}
      <section className="border-y border-border-subtle bg-bg-surface">
        <div className="container-main py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Sobretitulo>Ficha técnica</Sobretitulo>
              <h2 className="font-heading text-2xl font-bold text-txt-primary md:text-3xl">
                O que tem dentro do saco
              </h2>
              <dl className="mt-6 divide-y divide-border-subtle rounded-2xl border border-border-subtle">
                {[
                  ['Peso líquido', PESO_DO_SACO],
                  ['Rendimento', `Até ${rendimento.m2PorSaco} m²`],
                  ...(conteudo.ficha
                    ? [
                        ['Classificação', conteudo.ficha.classificacao],
                        ['Natureza', conteudo.ficha.natureza],
                      ]
                    : []),
                  ['Acompanha', 'Dosador de 100 ml'],
                ].map(([rotulo, valor]) => (
                  <div key={rotulo} className="flex items-start justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-txt-secondary">{rotulo}</dt>
                    <dd className="text-right text-sm font-medium text-txt-primary">{valor}</dd>
                  </div>
                ))}
              </dl>

              {conteudo.ficha && (
                <table className="mt-6 w-full overflow-hidden rounded-2xl border border-border-subtle text-left text-sm">
                  <caption className="mb-2 text-left text-sm font-semibold text-txt-primary">
                    Garantias mínimas
                  </caption>
                  <thead className="bg-bg-surface-2 text-xs uppercase tracking-wide text-txt-secondary">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">Nutriente</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">Mínimo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {conteudo.ficha.garantias.map((g) => (
                      <tr key={g.nutriente}>
                        <td className="px-4 py-2.5 text-txt-primary">{g.nutriente}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-forest">{g.minimo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div>
              <Sobretitulo>Limitações e cuidados</Sobretitulo>
              <h2 className="font-heading text-2xl font-bold text-txt-primary md:text-3xl">
                Para aplicar com segurança
              </h2>
              <ul className="mt-6 space-y-3">
                {CUIDADOS.map((cuidado) => (
                  <li key={cuidado} className="flex items-start gap-3 text-sm leading-relaxed text-txt-secondary">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                    {cuidado}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl bg-bg-surface-2 p-4 text-sm leading-relaxed text-txt-secondary">
                <strong className="font-semibold text-txt-primary">Armazenamento.</strong> {ARMAZENAMENTO}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 10. PERGUNTAS FREQUENTES ═══ */}
      <section className="container-main py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Sobretitulo>Dúvidas</Sobretitulo>
            <h2 className="font-heading text-3xl font-bold text-txt-primary md:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {conteudo.perguntas.map((item) => (
              <details
                key={item.pergunta}
                className="group rounded-2xl border border-border-subtle bg-bg-surface open:border-forest/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold text-txt-primary">{item.pergunta}</h3>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-forest transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-txt-secondary">{item.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 11. CHAMADA FINAL ═══ */}
      <section className="bg-forest text-white">
        <div className="container-main py-14 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[auto,1fr,auto]">
            {product.featuredImage && (
              <div className="relative mx-auto h-44 w-32 md:mx-0">
                <Image
                  src={product.featuredImage.url}
                  alt=""
                  fill
                  sizes="8rem"
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl font-bold md:text-4xl">{CHAMADA_FINAL}</h2>
              <p className="mt-2 text-white/85">
                {product.title}, saco de {PESO_DO_SACO}, rende até {rendimento.m2PorSaco} m², com dosador
                incluso.
              </p>
            </div>
            <a
              href="#comprar"
              className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-forest transition-all hover:bg-gold-soft md:mx-0"
            >
              Comprar agora
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
