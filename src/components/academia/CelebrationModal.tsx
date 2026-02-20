'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Trophy, Zap } from 'lucide-react';
import { Achievement } from '@/lib/academia/types';
import { Button } from '@/components/ui/Button';
import { RARITY_COLORS } from '@/lib/academia/achievements';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'xp' | 'achievement' | 'level-up' | 'course-complete';
  data?: {
    xpGained?: number;
    newLevel?: { level: number; name: string; icon: string };
    achievements?: Achievement[];
    courseName?: string;
  };
}

export function CelebrationModal({ isOpen, onClose, type, data }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Confetti quando abre
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = type === 'level-up' 
        ? ['#FFD700', '#FFA500', '#FF6B6B']
        : ['#22C55E', '#10B981', '#059669'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isOpen, type]);

  const getContent = () => {
    switch (type) {
      case 'xp':
        return (
          <>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-2">+{data?.xpGained} XP</h2>
            <p className="text-neutral-600">Continue assim para subir de nível!</p>
          </>
        );

      case 'level-up':
        return (
          <>
            <div className="text-6xl mb-4">{data?.newLevel?.icon}</div>
            <h2 className="font-heading text-3xl font-bold mb-2">Subiu de Nível!</h2>
            <p className="text-xl text-neutral-700 mb-1">
              Nível {data?.newLevel?.level}
            </p>
            <p className="text-lg text-neutral-600">
              {data?.newLevel?.name}
            </p>
          </>
        );

      case 'achievement':
        return (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {data?.achievements?.map((achievement) => {
                const colors = RARITY_COLORS[achievement.rarity];
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl ${colors.bg} border-2 ${colors.border} ${colors.glow}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-heading font-bold text-lg ${colors.text}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-neutral-600">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                      <span className={`text-xs font-bold uppercase ${colors.text}`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2 mt-4">
              {data?.achievements && data.achievements.length > 1 
                ? 'Novas Conquistas!' 
                : 'Nova Conquista!'
              }
            </h2>
          </>
        );

      case 'course-complete':
        return (
          <>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-2">Curso Concluído!</h2>
            <p className="text-xl text-neutral-700 mb-4">
              {data?.courseName}
            </p>
            <p className="text-neutral-600">
              Você dominou todos os conceitos! +{data?.xpGained} XP
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>

            {getContent()}

            <Button
              onClick={onClose}
              variant="premium"
              size="lg"
              className="mt-6 w-full"
            >
              Continuar
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
