'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Check, Sparkles, TrendingDown, Gift, Pause, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerSubscription } from '@/lib/subscription/types';
import { CANCELLATION_REASONS } from '@/lib/subscription/mock-data';
import { formatPrice } from '@/lib/subscription/pricing';

interface CancellationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: CustomerSubscription;
  onCancel: (reason: string, feedback?: string) => Promise<void>;
  onPause: (months: number) => Promise<void>;
  onRetained: (offer: string) => void;
}

/**
 * Fluxo de cancelamento com retenção ética
 * 
 * PSICOLOGIA APLICADA (ÉTICA):
 * - Não dificultar cancelamento (gera confiança)
 * - Mostrar o que será perdido (loss aversion)
 * - Oferecer alternativas genuínas (pausar, reduzir)
 * - Coletar feedback real
 * - Oferta contextual baseada no motivo
 * - Botão de cancelar SEMPRE visível
 */
export function CancellationFlow({ 
  isOpen, 
  onClose, 
  subscription, 
  onCancel,
  onPause,
  onRetained 
}: CancellationFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedReasonData = CANCELLATION_REASONS.find(r => r.id === selectedReason);
  const hasRetentionOffer = selectedReasonData?.retentionOffer;

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    setStep(2);
  };

  const handleAcceptOffer = async () => {
    if (!selectedReasonData?.retentionOffer) return;
    
    const offer = selectedReasonData.retentionOffer;
    
    if (offer.type === 'pause') {
      try {
        await onPause(2); // Pausar por 2 meses
        onRetained('pause');
        onClose();
      } catch (error) {
        console.error('Erro ao pausar:', error);
      }
    } else if (offer.type === 'discount') {
      onRetained('discount');
      onClose();
    } else {
      onRetained('support');
      onClose();
    }
  };

  const handleFinalCancel = async () => {
    if (!selectedReason) return;
    
    setLoading(true);
    try {
      await onCancel(selectedReason, feedback);
      setStep(3);
    } catch (error) {
      console.error('Erro ao cancelar:', error);
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="sticky top-4 right-4 float-right p-2 rounded-full hover:bg-neutral-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>

            <div className="p-8">
              {/* STEP 1: Sentiremos sua falta */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
                      Sentiremos sua falta!
                    </h2>
                    <p className="text-neutral-600">
                      Antes de você ir, veja o que você perderá...
                    </p>
                  </div>

                  {/* O que será perdido */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Você vai perder:
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-4 h-4" />
                        <span className="font-semibold">
                          {formatPrice(subscription.totalAnnualSavings)} de economia por ano
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-4 h-4" />
                        <span>Frete grátis em todas as entregas</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-4 h-4" />
                        <span>Seu nível {subscription.loyaltyTier} e benefícios exclusivos</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-4 h-4" />
                        <span>Entregas automáticas (sem esquecer nunca mais)</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-4 h-4" />
                        <span>Lembretes de aplicação no WhatsApp</span>
                      </div>
                    </div>
                  </div>

                  {/* Alternativas */}
                  <div className="mb-6">
                    <h3 className="font-bold text-neutral-900 mb-4">
                      Que tal uma destas alternativas?
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          onPause(2);
                          onClose();
                        }}
                        className="w-full p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Pause className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-bold text-blue-900">Pausar por alguns meses</div>
                            <div className="text-sm text-blue-700">
                              Útil para viagens ou quando o estoque está cheio
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onRetained('frequency');
                          onClose();
                        }}
                        className="w-full p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-bold text-green-900">Ajustar frequência</div>
                            <div className="text-sm text-green-700">
                              Receba com mais ou menos frequência
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Prosseguir com cancelamento */}
                  <div className="text-center">
                    <p className="text-sm text-neutral-500 mb-3">
                      Ainda quer cancelar?
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="text-neutral-600 hover:text-neutral-900"
                    >
                      Continuar com cancelamento
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Motivo do cancelamento */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
                      Pode nos contar o motivo?
                    </h2>
                    <p className="text-neutral-600">
                      Sua opinião nos ajuda a melhorar
                    </p>
                  </div>

                  {/* Razões */}
                  <div className="space-y-2 mb-6">
                    {CANCELLATION_REASONS.map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => handleReasonSelect(reason.id)}
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left"
                      >
                        <div className="font-medium text-neutral-900">{reason.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Oferta de retenção */}
                  {hasRetentionOffer && selectedReason && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 mb-6"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <Gift className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-amber-900 mb-1">
                            Oferta Especial para Você
                          </h3>
                          <p className="text-amber-800">
                            {selectedReasonData.retentionOffer?.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="premium"
                          onClick={handleAcceptOffer}
                          className="flex-1"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Aceitar Oferta
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStep(3)}
                          className="flex-1"
                        >
                          Não, obrigado
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Feedback opcional */}
                  {selectedReason && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Quer nos contar mais? (opcional)
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Seu feedback nos ajuda a melhorar..."
                        className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* CTAs finais */}
                  {selectedReason && !hasRetentionOffer && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleFinalCancel}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Confirmação */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-neutral-600" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
                    Assinatura Cancelada
                  </h2>
                  <p className="text-neutral-600 mb-6">
                    Sua assinatura foi cancelada com sucesso.
                  </p>

                  {/* Informações finais */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                    <h4 className="font-bold text-blue-900 mb-3 text-sm">O que acontece agora?</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Você não será mais cobrado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Suas entregas programadas foram canceladas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Você pode reativar a qualquer momento</span>
                      </li>
                    </ul>
                  </div>

                  {/* Código de desconto para retorno */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-2">🎁 Código de Desconto</h3>
                    <p className="text-green-100 text-sm mb-3">
                      Se mudar de ideia, use este código para 25% OFF:
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 font-mono font-bold text-xl text-center">
                      VOLTE25
                    </div>
                    <p className="text-xs text-green-100 mt-2">
                      Válido por 90 dias
                    </p>
                  </div>

                  <Button variant="primary" onClick={onClose} className="w-full">
                    Fechar
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
