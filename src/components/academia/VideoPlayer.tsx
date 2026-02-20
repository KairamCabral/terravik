'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function getEmbedUrl(url: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ??
    null;
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  // Vimeo: vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  // Direct video URL
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) return trimmed;

  return null;
}

function isEmbedUrl(url: string): boolean {
  return (
    url.includes('youtube.com/embed') ||
    url.includes('youtu.be/') ||
    url.includes('player.vimeo.com')
  );
}

interface VideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl?: string | null;
  title?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isDirectVideo = embedUrl && !isEmbedUrl(embedUrl);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (!videoUrl || !embedUrl) {
    return (
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900',
          'flex flex-col items-center justify-center gap-3 text-neutral-500'
        )}
      >
        <Film className="h-14 w-14" strokeWidth={1.5} />
        <span className="text-sm font-medium">Vídeo em breve</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-pointer"
            onClick={handlePlay}
          >
            {thumbnailUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={thumbnailUrl}
                  alt={title ?? 'Thumbnail'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              </div>
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl transition-colors hover:bg-white"
              >
                <Play className="h-8 w-8 ml-1" fill="currentColor" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {isDirectVideo ? (
              <video
                src={embedUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <iframe
                src={embedUrl}
                title={title ?? 'Vídeo'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
