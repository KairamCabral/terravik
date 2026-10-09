import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { VideoDeFundo } from './VideoDeFundo'
import { VIDEO_DA_SECAO } from './video-secao'

/**
 * VideoSection: vídeo em loop do grânulo, sem controles à vista.
 *
 * O que vai no HTML do servidor é a caixa e o pôster. O vídeo entra depois,
 * por cima, seguindo as regras de rede e de acessibilidade de VideoDeFundo.
 * Arquivos e descrição ficam em video-secao.ts.
 *
 * Se o vídeo faltar ou falhar, o pôster fica no lugar. Sem pôster cadastrado,
 * a caixa fica com o fundo liso `surface-2` em vez de vazia.
 */
export function VideoSection() {
  const video = VIDEO_DA_SECAO
  if (!video) return null

  return (
    <section
      className="relative w-full overflow-hidden bg-bg-surface"
      aria-label="Vídeo Terravik"
    >
      <div className="container-main">
        <div
          className={cn(
            'group relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg',
            !video.poster && 'bg-bg-surface-2'
          )}
        >
          {video.poster && (
            <Image
              src={video.poster}
              alt={video.descricao}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          )}
          <VideoDeFundo fontes={video.fontes} />
        </div>
      </div>
    </section>
  )
}
