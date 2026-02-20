import type { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { Container, Button } from '@/components/ui'
import {
  Package,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Truck,
  Mail,
  FileText,
  CreditCard,
  Shield,
  Scale,
  Phone,
  Camera,
  ArrowRight,
  Leaf,
} from 'lucide-react'

export const metadata: Metadata = createMetadata({
  title: 'Política de Trocas e Devoluções',
  description:
    'Saiba como funciona a política de trocas e devoluções da Terravik. Baseada no Código de Defesa do Consumidor, com processos claros e transparentes.',
  path: '/trocas-devolucoes',
})

const sections = [
  { id: 'direitos', label: 'Seus direitos', icon: Scale },
  { id: 'arrependimento', label: 'Direito de arrependimento', icon: Clock },
  { id: 'defeito', label: 'Produto com defeito', icon: AlertTriangle },
  { id: 'quando-aceita', label: 'Quando aceitamos', icon: CheckCircle2 },
  { id: 'quando-nao-aceita', label: 'Quando não aceitamos', icon: XCircle },
  { id: 'como-solicitar', label: 'Como solicitar', icon: Package },
  { id: 'prazos', label: 'Prazos de análise', icon: Clock },
  { id: 'estorno', label: 'Estorno e reembolso', icon: CreditCard },
  { id: 'contato', label: 'Contato', icon: Mail },
]

export default function TrocasDevolucoesPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Trocas e Devoluções', url: '/trocas-devolucoes' },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-terravik-cream via-terravik-cream to-blue-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="font-display text-4xl font-bold text-terravik-brown md:text-5xl">
              Trocas e Devoluções
            </h1>
            <p className="mt-6 text-lg text-terravik-brown/80 md:text-xl">
              Sua satisfação é nossa prioridade. Conheça seus direitos e nosso
              processo transparente de trocas e devoluções.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600">
              <Scale className="h-4 w-4" />
              Baseado no Código de Defesa do Consumidor
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Container spacing="lg">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Table of Contents — sticky sidebar */}
          <aside className="mb-10 lg:mb-0">
            <nav className="lg:sticky lg:top-32">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-terravik-brown/50">
                Nesta página
              </h2>
              <ul className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-terravik-brown/70 transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-terravik-brown/40 transition-colors group-hover:text-blue-600" />
                        {section.label}
                      </a>
                    </li>
                  )
                })}
              </ul>

              {/* CTA Box */}
              <div className="mt-8 rounded-xl border-2 border-blue-100 bg-blue-50/50 p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mb-2 font-display text-sm font-semibold text-terravik-brown">
                  Precisa de ajuda?
                </h3>
                <p className="mb-3 text-xs text-terravik-brown/70">
                  Nossa equipe está pronta para atender você.
                </p>
                <a
                  href="mailto:sac@terravik.com.br"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  sac@terravik.com.br
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <article className="max-w-3xl">
            {/* 1. Seus Direitos */}
            <section id="direitos" className="scroll-mt-32">
              <SectionHeader icon={Scale} title="Seus direitos garantidos por lei" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  A Terravik respeita integralmente o{' '}
                  <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>.
                  Você tem direito a:
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <RightCard
                  title="Arrependimento"
                  desc="7 dias corridos para desistir da compra (Art. 49 CDC)"
                  icon={Clock}
                />
                <RightCard
                  title="Garantia Legal"
                  desc="30 dias para vício aparente, 90 dias para vício oculto (Art. 26 CDC)"
                  icon={Shield}
                />
                <RightCard
                  title="Troca por defeito"
                  desc="Produto com defeito de fabricação ou fora das especificações"
                  icon={AlertTriangle}
                />
                <RightCard
                  title="Produto errado"
                  desc="Se recebeu produto diferente do pedido, trocamos sem custos"
                  icon={Package}
                />
              </div>
            </section>

            {/* 2. Direito de Arrependimento */}
            <section id="arrependimento" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Clock} title="Direito de arrependimento (7 dias)" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Conforme o <strong>Art. 49 do CDC</strong>, você tem{' '}
                  <strong>7 dias corridos</strong> a partir do recebimento do
                  produto para desistir da compra, sem precisar justificar.
                </p>
              </div>

              <Highlight color="blue">
                O prazo de 7 dias começa a contar a partir da data de entrega
                confirmada pela transportadora.
              </Highlight>

              <div className="mt-6 rounded-2xl border-2 border-terravik-brown/10 bg-white p-6 md:p-8">
                <h3 className="mb-4 font-display text-lg font-semibold text-terravik-brown">
                  Condições para exercer o arrependimento:
                </h3>
                <ul className="space-y-3">
                  {[
                    'Produto na embalagem original, lacrada e sem indícios de uso',
                    'Nota fiscal e todos os acessórios inclusos',
                    'Solicitação feita dentro de 7 dias corridos após o recebimento',
                    'Produto não pode ter sido aberto ou aplicado',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-terravik-brown/80">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-terravik-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  <strong>Importante:</strong> Fertilizantes são produtos
                  técnicos que requerem armazenamento adequado. Se a embalagem
                  foi aberta, não podemos aceitar a devolução por arrependimento,
                  mas você ainda tem direito à troca em caso de defeito de
                  fabricação.
                </p>
              </div>
            </section>

            {/* 3. Produto com Defeito */}
            <section id="defeito" className="mt-16 scroll-mt-32">
              <SectionHeader icon={AlertTriangle} title="Produto com defeito de fabricação" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Se o produto apresentar defeito de fabricação, você tem direito
                  à troca ou devolução com reembolso integral, conforme o{' '}
                  <strong>Art. 18 do CDC</strong>.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <DefectCard
                  title="Vício aparente"
                  prazo="30 dias corridos"
                  desc="Defeitos visíveis na embalagem ou produto (rasgos, vazamento, embalagem violada)"
                  artigo="Art. 26, II, CDC"
                />
                <DefectCard
                  title="Vício oculto"
                  prazo="90 dias corridos"
                  desc="Defeitos não visíveis imediatamente, como composição fora do especificado, produto alterado"
                  artigo="Art. 26, II, CDC"
                />
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  O prazo para reclamar de vício aparente começa a contar da
                  entrega. Para vício oculto, o prazo começa quando o defeito se
                  torna evidente.
                </p>
              </div>
            </section>

            {/* 4. Quando Aceitamos */}
            <section id="quando-aceita" className="mt-16 scroll-mt-32">
              <SectionHeader icon={CheckCircle2} title="Quando aceitamos trocas/devoluções" />
              
              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Arrependimento (7 dias)',
                    desc: 'Produto lacrado, sem uso, na embalagem original',
                  },
                  {
                    title: 'Produto com defeito de fabricação',
                    desc: 'Embalagem violada no transporte, vazamento, composição incorreta',
                  },
                  {
                    title: 'Produto errado enviado',
                    desc: 'Recebeu produto diferente do que foi pedido',
                  },
                  {
                    title: 'Produto danificado no transporte',
                    desc: 'Embalagem rasgada, amassada ou com indícios de mau acondicionamento',
                  },
                  {
                    title: 'Produto vencido ou próximo do vencimento',
                    desc: 'Produto com validade inferior a 6 meses da data de recebimento',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border-2 border-green-100 bg-green-50/50 p-5"
                  >
                    <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                    <div>
                      <h3 className="font-display font-semibold text-terravik-brown">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-terravik-brown/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Quando NÃO Aceitamos */}
            <section id="quando-nao-aceita" className="mt-16 scroll-mt-32">
              <SectionHeader icon={XCircle} title="Quando NÃO aceitamos trocas/devoluções" />
              
              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Embalagem aberta após o prazo de 7 dias',
                    desc: 'Produtos abertos só podem ser trocados se houver defeito comprovado',
                  },
                  {
                    title: 'Produto já aplicado no gramado',
                    desc: 'Não podemos aceitar produtos que já foram utilizados, exceto se houver defeito de fabricação',
                  },
                  {
                    title: 'Danos causados por uso incorreto',
                    desc: 'Superdosagem, aplicação inadequada ou armazenamento impróprio',
                  },
                  {
                    title: 'Produto danificado pelo cliente',
                    desc: 'Embalagem rasgada/violada após recebimento, exposição à umidade',
                  },
                  {
                    title: 'Fora do prazo legal',
                    desc: '7 dias para arrependimento, 30 dias para vício aparente, 90 dias para vício oculto',
                  },
                  {
                    title: 'Ausência de nota fiscal',
                    desc: 'A nota fiscal é obrigatória para qualquer troca ou devolução',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border-2 border-red-100 bg-red-50/50 p-5"
                  >
                    <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                    <div>
                      <h3 className="font-display font-semibold text-terravik-brown">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-terravik-brown/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Highlight color="red">
                Fertilizantes são produtos técnicos sujeitos a condições de
                armazenamento. Após a abertura, não podemos garantir que o
                produto foi mantido adequadamente.
              </Highlight>
            </section>

            {/* 6. Como Solicitar */}
            <section id="como-solicitar" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Package} title="Como solicitar troca ou devolução" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Siga o processo abaixo para garantir que sua solicitação seja
                  processada rapidamente:
                </p>
              </div>

              <div className="mt-8 space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Entre em contato',
                    desc: 'Envie e-mail para sac@terravik.com.br com seu número de pedido',
                    icon: Mail,
                  },
                  {
                    step: 2,
                    title: 'Informe o motivo',
                    desc: 'Arrependimento, defeito, produto errado, dano no transporte, etc.',
                    icon: FileText,
                  },
                  {
                    step: 3,
                    title: 'Envie fotos (se aplicável)',
                    desc: 'Para defeitos ou danos, envie fotos da embalagem, produto e nota fiscal',
                    icon: Camera,
                  },
                  {
                    step: 4,
                    title: 'Aguarde análise',
                    desc: 'Analisamos em até 2 dias úteis e enviamos as instruções de devolução',
                    icon: Clock,
                  },
                  {
                    step: 5,
                    title: 'Envie o produto',
                    desc: 'Enviaremos código de postagem (se aplicável) ou coletaremos na sua casa',
                    icon: Truck,
                  },
                  {
                    step: 6,
                    title: 'Receba o reembolso',
                    desc: 'Após recebermos e analisarmos o produto, processamos o estorno',
                    icon: CreditCard,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        <span className="font-display text-lg font-bold text-blue-600">
                          {item.step}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <h3 className="font-display text-lg font-semibold text-terravik-brown">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-terravik-brown/70">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 rounded-2xl border-2 border-blue-100 bg-blue-50/50 p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="mb-2 font-display font-semibold text-terravik-brown">
                      Importante: não envie o produto antes da aprovação
                    </h3>
                    <p className="text-sm text-terravik-brown/80">
                      Aguarde a análise e autorização da nossa equipe antes de
                      enviar o produto de volta. Produtos enviados sem
                      autorização prévia podem não ser aceitos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Prazos */}
            <section id="prazos" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Clock} title="Prazos de análise e processamento" />
              
              <div className="mt-6 overflow-hidden rounded-2xl border-2 border-terravik-brown/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-terravik-brown/10 bg-terravik-cream/50">
                      <th className="px-6 py-4 font-display font-semibold text-terravik-brown">
                        Etapa
                      </th>
                      <th className="px-6 py-4 font-display font-semibold text-terravik-brown">
                        Prazo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-terravik-brown/5">
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">
                        Resposta inicial ao contato
                      </td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Até 24 horas (dias úteis)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">
                        Análise da solicitação
                      </td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Até 2 dias úteis
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">
                        Envio de autorização/código de postagem
                      </td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Após aprovação da análise
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">
                        Análise do produto recebido
                      </td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Até 5 dias úteis após recebimento
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">
                        Processamento do estorno
                      </td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Até 7 dias úteis após aprovação
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Os prazos acima são médios e podem variar dependendo do volume
                  de solicitações, transportadora e forma de pagamento original.
                </p>
              </div>
            </section>

            {/* 8. Estorno */}
            <section id="estorno" className="mt-16 scroll-mt-32">
              <SectionHeader icon={CreditCard} title="Estorno e reembolso" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Após a aprovação da devolução, o estorno é processado conforme
                  a forma de pagamento original:
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <RefundCard
                  method="Cartão de crédito"
                  time="Até 2 faturas"
                  desc="O estorno aparece como crédito na fatura. Depende da data de fechamento."
                />
                <RefundCard
                  method="Pix"
                  time="Até 7 dias úteis"
                  desc="Estorno direto na conta de origem do pagamento."
                />
                <RefundCard
                  method="Boleto"
                  time="Até 10 dias úteis"
                  desc="Precisamos de dados bancários (enviados após aprovação)."
                />
                <RefundCard
                  method="Cartão de débito"
                  time="Até 10 dias úteis"
                  desc="Estorno direto na conta vinculada ao cartão."
                />
              </div>

              <Highlight color="blue">
                O valor do frete será reembolsado apenas em casos de defeito,
                produto errado ou dano no transporte. Arrependimento: o cliente
                arca com o custo da devolução.
              </Highlight>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Se a compra foi feita com cupom de desconto, o reembolso será
                  proporcional ao valor efetivamente pago.
                </p>
              </div>
            </section>

            {/* 9. Contato */}
            <section id="contato" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Mail} title="Entre em contato conosco" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Nossa equipe de atendimento está pronta para ajudar com
                  qualquer dúvida sobre trocas e devoluções.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-terravik-brown/10 bg-terravik-cream/30 p-6 md:p-8">
                <div className="space-y-5">
                  <div>
                    <p className="font-display font-semibold text-terravik-brown">
                      Serviço de Atendimento ao Cliente (SAC)
                    </p>
                    <p className="text-sm text-terravik-brown/70">
                      Horário: Segunda a sexta, 9h às 18h
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <a
                        href="mailto:sac@terravik.com.br"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        sac@terravik.com.br
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-terravik-brown/80">
                        0800 123 4567 (ligação gratuita)
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                    <p className="text-xs text-terravik-brown/70">
                      <strong>Ao entrar em contato, tenha em mãos:</strong>{' '}
                      número do pedido, CPF/CNPJ, e-mail cadastrado e fotos (se
                      aplicável).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </Container>

      {/* CTA Final */}
      <section className="bg-blue-600 py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Sua satisfação é nossa prioridade
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Se algo não saiu como esperado, estamos aqui para resolver da
              forma mais simples e transparente possível.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <a href="mailto:sac@terravik.com.br">Fale com o SAC</a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contato">Ver outros contatos</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

/* ============================================================
   COMPONENTES AUXILIARES
   ============================================================ */

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <h2 className="font-display text-2xl font-bold text-terravik-brown md:text-3xl">
        {title}
      </h2>
    </div>
  )
}

function Highlight({
  children,
  color = 'blue',
}: {
  children: React.ReactNode
  color?: 'blue' | 'red'
}) {
  const colorClasses = {
    blue: 'border-blue-600 bg-blue-50 text-blue-700',
    red: 'border-orange-600 bg-orange-50 text-orange-700',
  }

  return (
    <div className={`not-prose my-6 rounded-xl border-l-4 px-6 py-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium leading-relaxed md:text-base">
        {children}
      </p>
    </div>
  )
}

function RightCard({
  title,
  desc,
  icon: Icon,
}: {
  title: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-xl border-2 border-terravik-brown/10 bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <h3 className="mb-2 font-display font-semibold text-terravik-brown">
        {title}
      </h3>
      <p className="text-sm text-terravik-brown/70">{desc}</p>
    </div>
  )
}

function DefectCard({
  title,
  prazo,
  desc,
  artigo,
}: {
  title: string
  prazo: string
  desc: string
  artigo: string
}) {
  return (
    <div className="rounded-xl border-2 border-orange-100 bg-orange-50/50 p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-terravik-brown">
          {title}
        </h3>
        <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
          {prazo}
        </span>
      </div>
      <p className="mb-2 text-sm text-terravik-brown/80">{desc}</p>
      <p className="text-xs font-medium text-orange-700">{artigo}</p>
    </div>
  )
}

function RefundCard({
  method,
  time,
  desc,
}: {
  method: string
  time: string
  desc: string
}) {
  return (
    <div className="rounded-xl border-2 border-terravik-brown/10 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display font-semibold text-terravik-brown">
          {method}
        </h3>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
          {time}
        </span>
      </div>
      <p className="text-sm text-terravik-brown/70">{desc}</p>
    </div>
  )
}
