'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/lib/academia/types';
import { RARITY_COLORS } from '@/lib/academia/achievements';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  index?: number;
}

export function AchievementCard({ achievement, unlocked, index = 0 }: AchievementCardProps) {
  const colors = RARITY_COLORS[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative overflow-hidden rounded-xl border-2 p-4 transition-all
        ${unlocked ? `${colors.bg} ${colors.border} ${colors.glow}` : 'bg-neutral-50 border-neutral-200 opacity-60'}
      `}
    >
      {/* Badge de raridade */}
      {unlocked && (
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors.text} ${colors.bg} border ${colors.border}`}>
            {achievement.rarity}
          </span>
        </div>
      )}

      {/* Ícone */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0
          ${unlocked ? 'bg-white/50' : 'bg-neutral-200'}
        `}>
          {unlocked ? achievement.icon : <Lock className="w-6 h-6 text-neutral-400" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-heading font-bold text-sm mb-1 ${unlocked ? colors.text : 'text-neutral-500'}`}>
            {unlocked ? achievement.name : '???'}
          </h3>
          <p className={`text-xs ${unlocked ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {unlocked ? achievement.description : 'Conquista bloqueada'}
          </p>
        </div>
      </div>

      {/* XP Reward */}
      {unlocked && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Categoria</span>
          <span className={`text-xs font-semibold ${colors.text} capitalize`}>
            {achievement.category}
          </span>
        </div>
      )}
    </motion.div>
  );
}
