// src/app/admin/customizacao/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Video, Camera } from 'lucide-react';
import { BannersTab } from './BannersTab';
import { VideoTestimonialsTab } from './VideoTestimonialsTab';
import { PhotoTestimonialsTab } from './PhotoTestimonialsTab';

const TABS = [
  { id: 'banners', label: 'Banners', icon: ImageIcon },
  { id: 'videos', label: 'Vídeos depoimentos', icon: Video },
  { id: 'fotos', label: 'Fotos depoimentos', icon: Camera },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function CustomizacaoPage() {
  const [activeTab, setActiveTab] = useState<TabId>('banners');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Customização</h1>
        <p className="text-neutral-500">
          Gerencie banners, vídeos e depoimentos exibidos no site
        </p>
      </div>

      {/* Tabs */}
      <div className="relative border-b border-neutral-200">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors
                  ${isActive
                    ? 'text-emerald-700'
                    : 'text-neutral-500 hover:text-neutral-700'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'banners' && <BannersTab />}
        {activeTab === 'videos' && <VideoTestimonialsTab />}
        {activeTab === 'fotos' && <PhotoTestimonialsTab />}
      </motion.div>
    </div>
  );
}
