// src/app/assinatura/minha-assinatura/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  SubscriptionDashboard,
  PauseModal,
  CancellationFlow
} from '@/components/subscription';
import { MOCK_SUBSCRIPTIONS } from '@/lib/subscription/mock-data';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard do Assinante
 * 
 * Features:
 * - Visualização completa da assinatura ativa
 * - Histórico de entregas e pagamentos
 * - Gerenciamento de frequência e produtos
 * - Pausa e cancelamento com fluxos de retenção
 * - Gamificação (tier de fidelidade)
 * 
 * TODO em produção:
 * - Buscar dados reais da API/Shopify
 * - Implementar autenticação e validação
 * - Conectar ações (pause, cancel, modify) com backend
 */
export default function MinhaAssinaturaPage() {
  const router = useRouter();
  
  // Simular usuário logado com assinatura ativa
  // TODO: Substituir por dados reais da API/auth
  const [subscription, setSubscription] = useState(MOCK_SUBSCRIPTIONS[0]);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isCancelFlowOpen, setIsCancelFlowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock: usuário não tem assinatura
  const hasNoSubscription = false;

  // Handlers
  const handlePause = async (months: 1 | 2 | 3) => {
    setIsLoading(true);
    
    try {
      // TODO: Chamar API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular pausa
      const resumeDate = new Date();
      resumeDate.setMonth(resumeDate.getMonth() + months);
      
      setSubscription({
        ...subscription,
        status: 'paused',
        nextDeliveryDate: resumeDate,
        nextBillingDate: resumeDate
      });

      setIsPauseModalOpen(false);
      
      // Feedback de sucesso
      // TODO: Implementar toast notification
      alert(`✅ Assinatura pausada por ${months} ${months === 1 ? 'mês' : 'meses'}`);
    } catch (error) {
      console.error('Erro ao pausar assinatura:', error);
      alert('❌ Erro ao pausar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = () => {
    // Redirecionar para página de edição
    router.push('/assinatura/editar');
  };

  const handleCancel = async (reason?: string) => {
    setIsLoading(true);
    
    try {
      // TODO: Chamar API real com motivo do cancelamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular cancelamento
      setSubscription({
        ...subscription,
        status: 'cancelled'
      });

      setIsCancelFlowOpen(false);
      
      // Feedback e redirecionamento
      alert('✅ Assinatura cancelada com sucesso. Sentiremos sua falta!');
      router.push('/assinatura');
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      alert('❌ Erro ao cancelar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetained = (offer: string) => {
    setIsCancelFlowOpen(false);
    
    if (offer === 'pause') {
      setIsPauseModalOpen(true);
    } else if (offer === 'frequency') {
      handleModify();
    }
  };

  // Estado de carregamento inicial
  if (isLoading && !subscription) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-600">Carregando sua assinatura...</p>
        </div>
      </div>
    );
  }

  // Sem assinatura ativa
  if (hasNoSubscription) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="bg-white rounded-2xl border-2 border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-4">
              Você ainda não tem uma assinatura ativa
            </h1>

            <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
              Comece agora e receba seus fertilizantes automaticamente com até 18% de desconto!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculadora">
                <Button size="lg">
                  Calcular Minha Economia
                </Button>
              </Link>
              <Link href="/assinatura">
                <Button size="lg" variant="outline">
                  Saber Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">
            Minha Assinatura
          </h1>
          <p className="text-neutral-600 mt-2">
            Gerencie sua assinatura e acompanhe suas entregas
          </p>
        </div>

        {/* Status de cancelamento/pausa */}
        {subscription.status === 'paused' && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  Assinatura Pausada
                </h3>
                <p className="text-sm text-amber-700">
                  Sua assinatura retomará automaticamente em {new Date(subscription.nextDeliveryDate).toLocaleDateString('pt-BR')}.
                  Você pode retomar antes a qualquer momento.
                </p>
              </div>
            </div>
          </div>
        )}

        {subscription.status === 'cancelled' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Assinatura Cancelada
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Sua assinatura foi cancelada. Você ainda pode reativá-la e manter seus benefícios!
                </p>
                <Link href="/assinatura">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Reativar Assinatura
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard */}
        <SubscriptionDashboard
          subscription={subscription}
          onPause={() => setIsPauseModalOpen(true)}
          onModify={handleModify}
          onCancel={() => setIsCancelFlowOpen(true)}
        />
      </div>

      {/* Modals */}
      <PauseModal
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        onConfirm={handlePause}
        nextDeliveryDate={subscription.nextDeliveryDate}
      />

      <CancellationFlow
        isOpen={isCancelFlowOpen}
        onClose={() => setIsCancelFlowOpen(false)}
        subscription={subscription}
        onCancel={handleCancel}
        onPause={async () => {
          setIsCancelFlowOpen(false);
          setIsPauseModalOpen(true);
        }}
        onRetained={handleRetained}
      />
    </div>
  );
}
