'use client'

import { motion } from 'framer-motion'
import { useAcademia } from '@/contexts/AcademiaContext'
import {
  calculateLevel,
  calculateProgress,
  getXPForNextLevel,
} from '@/lib/academia/xp-system'

export function XPBar() {
  const { progress } = useAcademia()
  const level = calculateLevel(progress.totalXP)
  const progressPercent = calculateProgress(progress.totalXP)
  const xpForNext = getXPForNextLevel(progress.totalXP)

  return (
    <div className="flex items-center gap-2.5">
      {/* Nível */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm">
          <span className="text-xs font-bold text-white">{level.level}</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-[10px] font-semibold text-white/80 leading-none">
            {level.name}
          </p>
          <p className="text-[9px] text-white/40 leading-none mt-0.5">
            {progress.totalXP} XP
          </p>
        </div>
      </div>

      {/* Barra de progresso compacta */}
      <div className="w-20 sm:w-28">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
