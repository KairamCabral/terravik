'use client'

import { useState, useCallback, useEffect } from 'react'
import type {
  WizardStep,
  WizardState,
  CalculatorInput,
  CalculatorResult,
} from '@/types/calculator'
import { WIZARD_STEPS } from '@/lib/calculator/constants'
import { generatePlan } from '@/lib/calculator/engine'

const STORAGE_KEY = 'terravik-calculator'

// Helper para gerar URL compartilhável
function encodeAnswers(answers: Partial<CalculatorInput>): string {
  try {
    const json = JSON.stringify(answers)
    return btoa(json)
  } catch {
    return ''
  }
}

function decodeAnswers(encoded: string): Partial<CalculatorInput> | null {
  try {
    const json = atob(encoded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function useCalculator() {
  const [state, setState] = useState<WizardState>({
    currentStep: 'welcome',
    answers: {},
    result: null,
    isComplete: false,
  })
  
  // Track para animação
  const [prevStepIndex, setPrevStepIndex] = useState(0)

  // Carregar do localStorage no mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<CalculatorInput>
        // NÃO restaurar o currentStep - sempre começar do welcome
        // Mas manter as respostas salvas para facilitar o preenchimento
        setState((prev) => ({ 
          ...prev, 
          answers: parsed
          // currentStep permanece 'welcome'
        }))
      } catch {
        // Ignorar erro de parse
      }
    }

    // Carregar de URL query params se existir
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('plan')
    if (encoded) {
      const decoded = decodeAnswers(encoded)
      if (decoded) {
        setState((prev) => ({ ...prev, answers: decoded }))
      }
    }
  }, [])

  // Salvar no localStorage quando answers mudar
  useEffect(() => {
    if (Object.keys(state.answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.answers))
    }
  }, [state.answers])

  // Persistir resultado para Compra Rápida (acessível em qualquer página)
  useEffect(() => {
    if (state.result) {
      try {
        localStorage.setItem('terravik-calculator-result', JSON.stringify(state.result))
      } catch {
        // Ignorar erro (storage cheio, etc)
      }
    }
  }, [state.result])

  const currentStepIndex = WIZARD_STEPS.indexOf(state.currentStep)
  const totalSteps = WIZARD_STEPS.length - 2 // Excluindo welcome e result
  const progress = Math.max(0, currentStepIndex - 1) / totalSteps

  const setAnswer = useCallback(
    <K extends keyof CalculatorInput>(field: K, value: CalculatorInput[K]) => {
      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [field]: value },
      }))
    },
    []
  )

  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = WIZARD_STEPS.indexOf(prev.currentStep)
      const nextIndex = currentIndex + 1
      if (nextIndex >= WIZARD_STEPS.length) return prev

      const nextStep = WIZARD_STEPS[nextIndex]
      
      // Atualiza prevStepIndex para animações
      setPrevStepIndex(currentIndex)

      // Se chegou no result, gerar o plano
      if (nextStep === 'result' && isInputComplete(prev.answers)) {
        const input = prev.answers as CalculatorInput
        
        try {
          const result = generatePlan(input)
          
          return {
            ...prev,
            currentStep: nextStep,
            result,
            isComplete: true,
          }
        } catch (error) {
          console.error('Erro ao gerar plano:', error)
          // Retorna ao step anterior em caso de erro
          return prev
        }
      }

      return { ...prev, currentStep: nextStep }
    })
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = WIZARD_STEPS.indexOf(prev.currentStep)
      const prevIndex = currentIndex - 1
      if (prevIndex < 0) return prev

      setPrevStepIndex(currentIndex)

      return {
        ...prev,
        currentStep: WIZARD_STEPS[prevIndex],
        result: null,
        isComplete: false,
      }
    })
  }, [])

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
      result: step === 'result' ? prev.result : null,
      isComplete: step === 'result' ? prev.isComplete : false,
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      currentStep: 'welcome',
      answers: {},
      result: null,
      isComplete: false,
    })
    localStorage.removeItem(STORAGE_KEY)
    // Limpar query params da URL
    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const getShareableUrl = useCallback(() => {
    const encoded = encodeAnswers(state.answers)
    const url = new URL(window.location.href)
    url.searchParams.set('plan', encoded)
    return url.toString()
  }, [state.answers])

  // Calcular canGoNext diretamente
  const canGoNext = (() => {
    const { currentStep, answers } = state

    switch (currentStep) {
      case 'welcome':
        return true
      case 'area':
        return !!(answers.area_m2 && answers.area_m2 > 0)
      case 'implanting':
        return answers.implantando !== undefined
      case 'objective':
        return !!answers.objetivo
      case 'climate':
        return !!answers.clima_hoje
      case 'sunlight':
        return !!answers.sol
      case 'irrigation':
        return !!answers.irrigacao
      case 'traffic':
        return !!answers.pisoteio
      case 'condition':
        return !!answers.nivel
      default:
        return false
    }
  })()

  const canGoPrev = currentStepIndex > 0 && state.currentStep !== 'result'

  return {
    // State
    currentStep: state.currentStep,
    answers: state.answers,
    result: state.result,
    isComplete: state.isComplete,

    // Progress
    currentStepIndex,
    prevStepIndex, // Para animação
    totalSteps,
    progress,

    // Actions
    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    reset,

    // Helpers
    canGoNext,
    canGoPrev,
    getShareableUrl,
  }
}

// Helper para validar se input está completo
function isInputComplete(
  answers: Partial<CalculatorInput>
): answers is CalculatorInput {
  return !!(
    answers.area_m2 &&
    answers.area_m2 > 0 &&
    answers.implantando !== undefined &&
    answers.objetivo &&
    answers.clima_hoje &&
    answers.sol &&
    answers.irrigacao &&
    answers.pisoteio &&
    answers.nivel
  )
}
