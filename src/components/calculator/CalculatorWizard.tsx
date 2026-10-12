'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, ShoppingCart, X } from 'lucide-react'
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
import { ResultadoDoPlano } from './resultado/ResultadoDoPlano'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { useCart } from '@/components/cart'
import { FluxoDaFoto } from './foto/FluxoDaFoto'

/**
 * CalculatorWizard — Premium Redesign
 *
 * Full viewport, sem scroll, progress dots,
 * transições suaves, layout compacto e sofisticado
 */

interface CalculatorWizardProps {
  /** Análise por foto configurada no servidor (chave da IA e cota). */
  fotoDisponivel?: boolean
}

export function CalculatorWizard({ fotoDisponivel = false }: CalculatorWizardProps) {
  const calculator = useCalculatorContext()
  // Caminho da foto: aberto a partir da tela de entrada, no lugar do quiz.
  const [naFoto, setNaFoto] = useState(false)
  const { cart, openCart } = useCart()
  const itensNoCarrinho = cart?.totalQuantity ?? 0
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

  // Chegou ao resultado (pela foto) ou recomeçou: a tela da foto sai de cena.
  useEffect(() => {
    if (currentStep !== 'welcome') setNaFoto(false)
  }, [currentStep])

  const mostrarFoto = naFoto && currentStep === 'welcome'

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
    if (mostrarFoto) {
      return (
        <FluxoDaFoto
          onResponderPerguntas={() => {
            setNaFoto(false)
            nextStep()
          }}
        />
      )
    }
    switch (currentStep) {
      case 'welcome': return <StepWelcome fotoDisponivel={fotoDisponivel} />
      case 'area': return <StepArea />
      case 'implanting': return <StepImplanting />
      case 'objective': return <StepObjective />
      case 'climate': return <StepClimate />
      case 'sunlight': return <StepSunlight />
      case 'irrigation': return <StepIrrigation />
      case 'traffic': return <StepTraffic />
      case 'condition': return <StepCondition />
      case 'result': return <ResultadoDoPlano calculator={calculator} />
      default: return null
    }
  }

  const showProgress = currentStep !== 'welcome' && currentStep !== 'result'
  const showFooter = currentStep !== 'result' && !mostrarFoto
  const isWelcome = currentStep === 'welcome'
  // A tela da foto rola como a de resultado: em celular pequeno ela passa da altura.
  const isResult = currentStep === 'result' || mostrarFoto
  // O plano pronto: aqui a pessoa compra, então o menu e o carrinho voltam.
  const noPlano = currentStep === 'result'

  // Steps para dots (excluindo welcome e result)
  const stepNames = ['area', 'implanting', 'objective', 'climate', 'sunlight', 'irrigation', 'traffic', 'condition']
  const activeStepIdx = stepNames.indexOf(currentStep)

  // Progresso não-linear: avança rápido no início, devagar no final (psicologia do goal gradient)
  const progressMap = [20, 35, 50, 65, 75, 85, 92, 100]
  const strategicProgress = activeStepIdx >= 0 ? progressMap[activeStepIdx] : 0

  return (
    <div className={cn(
      'flex flex-col',
      noPlano ? 'bg-bg-primary' : 'bg-white',
      // overflow-x-clip segura a animação de entrada sem quebrar o sticky.
      isResult ? 'min-h-screen overflow-x-clip' : 'h-dvh h-screen overflow-hidden'
    )}>

      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white px-4 sm:px-6 lg:px-12 py-3 border-b border-neutral-100">
        {/* Left: Back or empty */}
        {mostrarFoto ? (
          <button
            onClick={() => setNaFoto(false)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-forest hover:bg-forest/5 transition-all rounded-lg px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : showProgress && canGoPrev ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-forest hover:bg-forest/5 transition-all rounded-lg px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : (
          <div className="min-w-[2.75rem] sm:min-w-[5rem]" />
        )}

        {/* Center: Logo text */}
        <span className="whitespace-nowrap text-xs font-semibold text-neutral-400 tracking-wider uppercase sm:text-sm">
          Calculadora Terravik
        </span>

        {/* Right: carrinho (só com o plano pronto) e sair */}
        <div className="flex min-w-[2.75rem] items-center justify-end gap-2 sm:min-w-[5rem]">
        {noPlano && (
          <button
            type="button"
            onClick={openCart}
            aria-label={`Carrinho (${itensNoCarrinho} ${itensNoCarrinho === 1 ? 'item' : 'itens'})`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 lg:flex"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {itensNoCarrinho > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {itensNoCarrinho > 99 ? '99+' : itensNoCarrinho}
              </span>
            )}
          </button>
        )}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all rounded-lg px-3 py-2 border border-neutral-200 hover:border-neutral-300"
          title="Sair da calculadora"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn(
        noPlano ? 'flex-1' : 'flex-1 flex items-center justify-center overflow-hidden',
        isResult ? (mostrarFoto ? 'px-5' : '') : 'px-6 lg:px-12'
      )}>
        <div className={cn(
          'w-full',
          isResult ? '' : 'max-w-5xl mx-auto'
        )}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={mostrarFoto ? 'foto' : currentStep}
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
            {isWelcome && fotoDisponivel ? (
              <div className="flex w-full max-w-md flex-col gap-3">
                <button
                  onClick={() => setNaFoto(true)}
                  className="flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-forest px-6 text-lg font-semibold text-white shadow-lg shadow-forest/20 transition-all hover:bg-forest/90"
                >
                  <Camera className="h-5 w-5" />
                  Tirar foto do gramado
                </button>
                <button
                  onClick={nextStep}
                  className="group flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white px-6 text-base font-semibold text-neutral-800 transition-all hover:border-forest/40"
                >
                  Responder as perguntas
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : isWelcome ? (
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
      {/* Menu inferior do site, só com o plano pronto: durante as perguntas
          o rodapé é o botão de continuar. */}
      {noPlano && <MobileBottomNav />}
    </div>
  )
}
