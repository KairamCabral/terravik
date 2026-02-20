'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { cn } from '@/lib/utils/cn'

import { StepWelcome } from './steps/StepWelcome'
import { StepArea } from './steps/StepArea'
import { StepImplanting } from './steps/StepImplanting'
import { StepObjective } from './steps/StepObjective'
import { StepClimate } from './steps/StepClimate'
import { StepSunlight } from './steps/StepSunlight'
import { StepIrrigation } from './steps/StepIrrigation'
import { StepTraffic } from './steps/StepTraffic'
import { StepCondition } from './steps/StepCondition'
import { CalculatorResultSubscription } from './CalculatorResultSubscription'

/**
 * CalculatorWizard — Premium Redesign
 *
 * Full viewport, sem scroll, progress dots,
 * transições suaves, layout compacto e sofisticado
 */

export function CalculatorWizard() {
  const calculator = useCalculatorContext()
  const {
    currentStep,
    currentStepIndex,
    prevStepIndex,
    totalSteps,
    progress,
    canGoNext,
    canGoPrev,
    nextStep,
    prevStep,
  } = calculator

  const direction = currentStepIndex > prevStepIndex ? 1 : -1

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return <StepWelcome />
      case 'area': return <StepArea />
      case 'implanting': return <StepImplanting />
      case 'objective': return <StepObjective />
      case 'climate': return <StepClimate />
      case 'sunlight': return <StepSunlight />
      case 'irrigation': return <StepIrrigation />
      case 'traffic': return <StepTraffic />
      case 'condition': return <StepCondition />
      case 'result': return <CalculatorResultSubscription calculator={calculator} />
      default: return null
    }
  }

  const showProgress = currentStep !== 'welcome' && currentStep !== 'result'
  const showFooter = currentStep !== 'result'
  const isWelcome = currentStep === 'welcome'
  const isResult = currentStep === 'result'

  // Steps para dots (excluindo welcome e result)
  const stepNames = ['area', 'implanting', 'objective', 'climate', 'sunlight', 'irrigation', 'traffic', 'condition']
  const activeStepIdx = stepNames.indexOf(currentStep)

  // Progresso não-linear: avança rápido no início, devagar no final (psicologia do goal gradient)
  const progressMap = [20, 35, 50, 65, 75, 85, 92, 100]
  const strategicProgress = activeStepIdx >= 0 ? progressMap[activeStepIdx] : 0

  return (
    <div className={cn(
      'flex flex-col bg-white',
      isResult ? 'min-h-screen' : 'h-dvh h-screen overflow-hidden'
    )}>

      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 lg:px-12 py-3 border-b border-neutral-100">
        {/* Left: Back or empty */}
        {showProgress && canGoPrev ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-forest hover:bg-forest/5 transition-all rounded-lg px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : (
          <div className="min-w-[5rem]" />
        )}

        {/* Center: Logo text */}
        <span className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
          Calculadora Terravik
        </span>

        {/* Right: Close button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all rounded-lg px-3 py-2 border border-neutral-200 hover:border-neutral-300"
          title="Sair da calculadora"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Link>
      </div>

      {/* Content Area */}
      <div className={cn(
        'flex-1 flex items-center justify-center overflow-hidden',
        isResult ? '' : 'px-6 lg:px-12'
      )}>
        <div className={cn(
          'w-full',
          isResult ? '' : 'max-w-5xl mx-auto'
        )}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 350, damping: 35 },
                opacity: { duration: 0.15 },
              }}
              className={isResult ? '' : 'h-full'}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex-shrink-0 border-t border-neutral-100">
          {/* Progress Bar */}
          {showProgress && (
            <div className="px-6 lg:px-12 py-3">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-400">
                    Progresso
                  </span>
                  <span className="text-xs font-semibold text-forest">
                    {strategicProgress}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-forest to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${strategicProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          <div className="flex items-center justify-center px-6 lg:px-12 py-4">
            {isWelcome ? (
              <button
                onClick={nextStep}
                className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-forest text-white font-semibold text-lg hover:bg-forest/90 transition-all shadow-lg shadow-forest/20 hover:shadow-xl hover:shadow-forest/30"
              >
                Começar agora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canGoNext}
                className={cn(
                  'group flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-lg transition-all',
                  canGoNext
                    ? 'bg-forest text-white hover:bg-forest/90 shadow-lg shadow-forest/20 hover:shadow-xl hover:shadow-forest/30'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                )}
              >
                {currentStep === 'condition' ? 'Ver meu plano' : 'Continuar'}
                <ArrowRight className={cn(
                  'h-5 w-5 transition-transform',
                  canGoNext && 'group-hover:translate-x-1'
                )} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
