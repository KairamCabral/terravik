'use client'

import { useState } from 'react'

/**
 * VideoSection — Vídeo auto-play, loop, sem controles
 *
 * Coloque o vídeo em: public/video/fertilizante-terravik.mp4
 * Se o arquivo não existir, a seção fica oculta (evita área preta).
 */

const VIDEO_SRC = '/video/Fertilizante%20Terravik.mp4'

export function VideoSection() {
  const [hasError, setHasError] = useState(false)

  if (hasError) return null

  return (
    <section
      className="relative w-full overflow-hidden bg-bg-surface"
      aria-label="Vídeo Terravik"
    >
      <div className="container-main">
        <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasError(true)}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        </div>
      </div>
    </section>
  )
}
