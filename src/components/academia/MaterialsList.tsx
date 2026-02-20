'use client';

import {
  FileText,
  Link2,
  ImageIcon,
  Table,
  File,
  Download,
} from 'lucide-react';
import type { LessonMaterial } from '@/lib/academia/types';
import { cn } from '@/lib/utils/cn';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MATERIAL_ICONS: Record<
  LessonMaterial['type'],
  typeof FileText
> = {
  pdf: FileText,
  link: Link2,
  image: ImageIcon,
  spreadsheet: Table,
  other: File,
};

interface MaterialsListProps {
  materials: LessonMaterial[];
}

export function MaterialsList({ materials }: MaterialsListProps) {
  const sorted = [...materials].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-700">
        Materiais para download
      </h3>
      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {sorted.map((material) => {
          const Icon = MATERIAL_ICONS[material.type];
          const isLink = material.type === 'link';

          return (
            <li key={material.id}>
              <a
                href={material.file_url}
                target={isLink ? '_blank' : '_blank'}
                rel={isLink ? 'noopener noreferrer' : 'noopener noreferrer'}
                download={!isLink}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 transition-colors',
                  'hover:bg-neutral-50'
                )}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900 truncate">
                    {material.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(material.file_size_bytes)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                    <Download className="h-4 w-4" />
                    {isLink ? 'Abrir' : 'Baixar'}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
