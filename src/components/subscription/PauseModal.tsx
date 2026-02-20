'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDeliveryDate } from '@/lib/subscription/pricing';
import { PauseOption } from '@/lib/subscription/types';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (months: 1 | 2 | 3) => Promise<void>;
  nextDeliveryDate: Date;
  className?: string;
}

/**
 * Modal para pausar assinatura
 * 
 * PSICOLOGIA APLICADA:
 * - Apresenta pausa como opção positiva (não cancelamento)
 * - Mostra data exata de retorno (clareza)
 * - Benefício mantido (nível de fidelidade preservado)
 * - 3 opções simples (evita paradoxo da escolha)
 * - Confirmação em um clique (reduz fricção)
 */
export function PauseModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  nextDeliveryDate,
  className = '' 
}: PauseModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<1 | 2 | 3 | null>(null);
  const [loading, setLoading] = useState(false);

  const pauseOptions: PauseOption[] = [
    {
      months: 1,
      label: '1 mês',
      resumeDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    },
    {
      months: 2,
      label: '2 meses',
      resumeDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
    },
    {
      months: 3,
      label: '3 meses',
      resumeDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
    }
  ];

  const handleConfirm = async () => {
    if (!selectedMonths) return;
    
    setLoading(true);
    try {
      await onConfirm(selectedMonths);
      onClose();
    } catch (error) {
      console.error('Erro ao pausar:', error);
    } finally {
      setLoading(false);
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
                Pausar Assinatura
              </h2>
              <p className="text-neutral-600">
                Sem problema! Por quanto tempo você quer pausar?
              </p>
            </div>

            {/* Opções de pausa */}
            <div className="space-y-3 mb-6">
              {pauseOptions.map((option) => {
                const isSelected = selectedMonths === option.months;

                return (
                  <button
                    key={option.months}
                    onClick={() => setSelectedMonths(option.months)}
                    className={`
                      w-full p-4 rounded-xl border-2 text-left transition-all
                      ${isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-neutral-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-neutral-300'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-neutral-900 mb-1">
                          Pausar por {option.label}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Retorna em: <strong>{formatDeliveryDate(option.resumeDate)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Informações importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-blue-900 mb-2 text-sm">
                ℹ️ O que acontece ao pausar?
              </h4>
              <ul className="space-y-1.5 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Nenhuma cobrança durante a pausa</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Seu nível de fidelidade é mantido</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Retoma automaticamente na data escolhida</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Você pode reativar antes se quiser</span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={!selectedMonths || loading}
                className="flex-1"
              >
                <Pause className="w-4 h-4 mr-2" />
                {loading ? 'Pausando...' : 'Confirmar Pausa'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
