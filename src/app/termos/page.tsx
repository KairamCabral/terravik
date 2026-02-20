import type { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { Container, Button } from '@/components/ui'
import {
  FileText,
  User,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  Copyright,
  AlertCircle,
  Scale,
  Mail,
  Clock,
  ChevronRight,
  Leaf,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = createMetadata({
  title: 'Termos de Uso',
  description:
    'Conheça os termos e condições de uso da Terravik. Regras claras para uma relação transparente entre você e nós.',
  path: '/termos',
})

const sections = [
  { id: 'aceitacao', label: 'Aceitação dos Termos', icon: FileText },
  { id: 'cadastro', label: 'Cadastro e Conta', icon: User },
  { id: 'uso', label: 'Uso do Site', icon: CheckCircle2 },
  { id: 'compras', label: 'Compras e Pedidos', icon: ShoppingCart },
  { id: 'precos', label: 'Preços e Pagamento', icon: CreditCard },
  { id: 'entrega', label: 'Entrega', icon: Truck },
  { id: 'garantias', label: 'Garantias e Trocas', icon: Shield },
  { id: 'propriedade', label: 'Propriedade Intelectual', icon: Copyright },
  { id: 'limitacao', label: 'Limitação de Responsabilidade', icon: AlertCircle },
  { id: 'legislacao', label: 'Legislação Aplicável', icon: Scale },
  { id: 'contato', label: 'Contato', icon: Mail },
]

export default function TermosPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Termos de Uso', url: '/termos' },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-terravik-cream via-terravik-cream to-terravik-gold/5 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-terravik-gold/10">
              <Scale className="h-8 w-8 text-terravik-gold" />
            </div>
            <h1 className="font-display text-4xl font-bold text-terravik-brown md:text-5xl">
              Termos de Uso
            </h1>
            <p className="mt-6 text-lg text-terravik-brown/80 md:text-xl">
              Regras claras para uma relação transparente. Aqui você encontra
              seus direitos e deveres ao usar nossos serviços.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-terravik-gold/10 px-4 py-2 text-sm text-terravik-gold">
              <Clock className="h-4 w-4" />
              Última atualização: 15/02/2026
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
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-terravik-brown/70 transition-all hover:bg-terravik-gold/5 hover:text-terravik-gold"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-terravik-brown/40 transition-colors group-hover:text-terravik-gold" />
                        {section.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <article className="max-w-3xl">
            {/* 1. Aceitação */}
            <section id="aceitacao" className="scroll-mt-32">
              <SectionHeader icon={FileText} title="Aceitação dos Termos" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Bem-vindo à <strong>Terravik</strong>. Estes Termos de Uso
                  regem o acesso e uso do site <strong>terravik.com.br</strong>, da
                  loja online, da Calculadora de Dose, dos Cursos Terravik e de
                  todos os serviços oferecidos pela{' '}
                  <strong>Terravik Fertilizantes Premium LTDA</strong>.
                </p>
                <Highlight>
                  Ao acessar ou usar nossos serviços, você concorda
                  automaticamente com estes termos. Se não concordar, não utilize
                  o site.
                </Highlight>
                <p>
                  Podemos atualizar estes termos a qualquer momento. Mudanças
                  significativas serão comunicadas por e-mail ou por aviso no
                  site. O uso contínuo após as alterações significa que você
                  aceita os novos termos.
                </p>
              </div>
            </section>

            {/* 2. Cadastro */}
            <section id="cadastro" className="mt-16 scroll-mt-32">
              <SectionHeader icon={User} title="Cadastro e Conta" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Para fazer pedidos, acessar a Academia ou salvar preferências,
                  você precisa criar uma conta. Ao se cadastrar, você se
                  compromete a:
                </p>
                <ul>
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a senha segura e não compartilhá-la</li>
                  <li>Ser responsável por todas as atividades na sua conta</li>
                  <li>Notificar-nos imediatamente se houver uso não autorizado</li>
                  <li>Ter no mínimo 18 anos ou contar com autorização dos pais/responsáveis</li>
                </ul>
                <p>
                  A Terravik se reserva o direito de suspender ou encerrar
                  contas que violem estes termos ou que sejam usadas de forma
                  fraudulenta.
                </p>
              </div>
            </section>

            {/* 3. Uso do Site */}
            <section id="uso" className="mt-16 scroll-mt-32">
              <SectionHeader icon={CheckCircle2} title="Uso Permitido do Site" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Você pode usar nosso site para fins legítimos e de acordo com
                  estes termos. É <strong>proibido</strong>:
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Usar o site para atividades ilegais ou fraudulentas',
                  'Tentar acessar áreas restritas ou contas de terceiros',
                  'Fazer engenharia reversa, copiar ou modificar o código do site',
                  'Enviar vírus, malware ou qualquer código malicioso',
                  'Fazer scraping automatizado sem autorização prévia',
                  'Usar o site de forma que prejudique sua performance ou disponibilidade',
                  'Fazer uso comercial do conteúdo sem autorização escrita',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border-2 border-red-100 bg-red-50/50 p-4"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-sm text-terravik-brown">{item}</p>
                  </div>
                ))}
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Violações podem resultar em suspensão imediata da conta e
                  medidas legais cabíveis.
                </p>
              </div>
            </section>

            {/* 4. Compras */}
            <section id="compras" className="mt-16 scroll-mt-32">
              <SectionHeader icon={ShoppingCart} title="Compras e Pedidos" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Ao fazer um pedido na Terravik, você está fazendo uma oferta de
                  compra. Nos reservamos o direito de aceitar ou recusar qualquer
                  pedido por motivos como:
                </p>
                <ul>
                  <li>Disponibilidade de estoque</li>
                  <li>Erros na descrição ou preço do produto</li>
                  <li>Suspeita de fraude</li>
                  <li>Restrições de entrega para a região</li>
                </ul>
                <Highlight>
                  A confirmação do pedido é enviada por e-mail. O contrato de
                  compra só é válido após o pagamento ser aprovado e a confirmação
                  ser enviada.
                </Highlight>
                <p>
                  Você receberá atualizações por e-mail sobre o status do pedido
                  (pagamento aprovado, pedido enviado, entregue). Certifique-se de
                  que o endereço de e-mail cadastrado está correto.
                </p>
              </div>
            </section>

            {/* 5. Preços */}
            <section id="precos" className="mt-16 scroll-mt-32">
              <SectionHeader icon={CreditCard} title="Preços e Pagamento" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Todos os preços estão em <strong>Reais (R$)</strong> e incluem
                  impostos, exceto quando indicado de outra forma. O frete é
                  calculado no checkout com base no CEP de entrega.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-terravik-brown/10 bg-terravik-cream/30 p-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-terravik-brown">
                  Formas de pagamento aceitas
                </h3>
                <ul className="space-y-2">
                  {[
                    'Cartão de crédito (até 12x, sujeito a aprovação)',
                    'Pix (desconto de 5% no boleto/pix)',
                    'Boleto bancário',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-terravik-brown/80">
                      <CheckCircle2 className="h-4 w-4 text-terravik-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  O processamento de pagamentos é feito pelo{' '}
                  <strong>Shopify Payments</strong>, em ambiente seguro (PCI DSS
                  compliant). Nunca temos acesso aos dados do seu cartão.
                </p>
                <p>
                  Nos reservamos o direito de corrigir preços exibidos
                  incorretamente por erro técnico. Se o preço correto for maior,
                  você pode cancelar o pedido sem custos.
                </p>
              </div>
            </section>

            {/* 6. Entrega */}
            <section id="entrega" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Truck} title="Entrega" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Entregamos para todo o Brasil através de transportadoras
                  parceiras (Correios, transportadoras privadas). O prazo de
                  entrega é calculado no checkout e começa a contar após a
                  aprovação do pagamento.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Frete Grátis"
                  icon={Truck}
                  color="text-terravik-green"
                  items={[
                    'Acima de R$ 150 para todo o Brasil',
                    'Promoções especiais em datas comemorativas',
                  ]}
                />
                <InfoCard
                  title="Rastreamento"
                  icon={ShoppingCart}
                  color="text-terravik-gold"
                  items={[
                    'Código de rastreio enviado por e-mail',
                    'Acompanhe pelo site da transportadora',
                  ]}
                />
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Não nos responsabilizamos por atrasos causados por
                  transportadoras, greves, condições climáticas extremas ou força
                  maior. Em caso de extravio, iniciamos investigação junto à
                  transportadora.
                </p>
                <p>
                  <strong>Importante:</strong> certifique-se de que o endereço de
                  entrega está correto. Não nos responsabilizamos por entregas em
                  endereços errados fornecidos pelo cliente.
                </p>
              </div>
            </section>

            {/* 7. Garantias */}
            <section id="garantias" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Shield} title="Garantias e Trocas" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Você tem <strong>7 dias corridos</strong> após o recebimento
                  para desistir da compra (Código de Defesa do Consumidor, Art.
                  49). O produto deve estar na embalagem original, sem indícios de
                  uso.
                </p>
                <h3>Quando aceitamos trocas/devoluções:</h3>
                <ul>
                  <li>Produto com defeito de fabricação</li>
                  <li>Produto diferente do pedido</li>
                  <li>Embalagem violada ou danificada no transporte</li>
                  <li>Arrependimento (dentro de 7 dias)</li>
                </ul>
                <h3>Quando NÃO aceitamos trocas:</h3>
                <ul>
                  <li>Embalagem aberta e produto já utilizado (exceto defeito)</li>
                  <li>Produto danificado por mau uso ou armazenamento inadequado</li>
                  <li>Fora do prazo de 7 dias (exceto defeito de fabricação)</li>
                </ul>
                <Highlight>
                  Para solicitar troca ou devolução, entre em contato pelo e-mail{' '}
                  <a href="mailto:sac@terravik.com.br">sac@terravik.com.br</a> com
                  o número do pedido e fotos do produto (se aplicável).
                </Highlight>
                <p>
                  O estorno do valor é feito na mesma forma de pagamento original
                  em até 7 dias úteis após recebermos o produto de volta.
                </p>
              </div>
            </section>

            {/* 8. Propriedade Intelectual */}
            <section id="propriedade" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Copyright} title="Propriedade Intelectual" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Todo o conteúdo do site — textos, imagens, logotipos, ícones,
                  código, design, vídeos, calculadora, cursos da Academia — é de
                  propriedade exclusiva da Terravik ou de seus licenciadores e
                  está protegido por leis de direitos autorais e propriedade
                  intelectual.
                </p>
                <p>É <strong>proibido</strong>:</p>
                <ul>
                  <li>Copiar, reproduzir ou redistribuir o conteúdo sem autorização</li>
                  <li>Usar a marca Terravik sem licença prévia</li>
                  <li>Criar produtos ou serviços derivados do nosso conteúdo</li>
                  <li>Fazer engenharia reversa da calculadora ou dos cursos</li>
                </ul>
                <p>
                  Você pode compartilhar links para o site e fazer uso justo para
                  fins educacionais ou de divulgação, desde que cite a fonte.
                </p>
                <p>
                  Para solicitar autorização de uso comercial ou parcerias, entre
                  em contato pelo e-mail{' '}
                  <a href="mailto:parcerias@terravik.com.br">
                    parcerias@terravik.com.br
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* 9. Limitação de Responsabilidade */}
            <section id="limitacao" className="mt-16 scroll-mt-32">
              <SectionHeader icon={AlertCircle} title="Limitação de Responsabilidade" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  A Terravik se esforça para garantir a qualidade dos produtos e
                  serviços, mas não pode garantir resultados específicos no seu
                  gramado. Fatores como clima, solo, irrigação e manutenção estão
                  fora do nosso controle.
                </p>
                <Highlight>
                  Os produtos devem ser usados conforme as instruções da
                  embalagem. Não nos responsabilizamos por danos causados por uso
                  incorreto, superdosagem ou aplicação inadequada.
                </Highlight>
                <p>
                  Não nos responsabilizamos por:
                </p>
                <ul>
                  <li>Danos indiretos, lucros cessantes ou danos morais</li>
                  <li>Indisponibilidade temporária do site (manutenção, ataques)</li>
                  <li>Erros de digitação ou informações desatualizadas (corrigimos assim que identificados)</li>
                  <li>Conteúdo de sites de terceiros linkados</li>
                </ul>
                <p>
                  Nossa responsabilidade máxima é limitada ao valor do pedido que
                  gerou o problema.
                </p>
              </div>
            </section>

            {/* 10. Legislação */}
            <section id="legislacao" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Scale} title="Legislação Aplicável" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Estes Termos de Uso são regidos pelas leis da{' '}
                  <strong>República Federativa do Brasil</strong>, incluindo:
                </p>
                <ul>
                  <li>Lei nº 8.078/1990 (Código de Defesa do Consumidor)</li>
                  <li>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD)</li>
                  <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                </ul>
                <p>
                  Qualquer disputa será resolvida no foro da comarca de{' '}
                  <strong>São Paulo/SP</strong>, renunciando a qualquer outro, por
                  mais privilegiado que seja.
                </p>
              </div>
            </section>

            {/* 11. Contato */}
            <section id="contato" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Mail} title="Contato" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Se tiver dúvidas sobre estes Termos de Uso ou precisar de
                  suporte, entre em contato:
                </p>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-terravik-brown/10 bg-terravik-cream/30 p-6 md:p-8">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-display font-semibold text-terravik-brown">
                      Terravik Fertilizantes Premium LTDA
                    </p>
                    <p className="text-terravik-brown/70">
                      CNPJ: XX.XXX.XXX/XXXX-XX
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-terravik-green" />
                      <a
                        href="mailto:contato@terravik.com.br"
                        className="font-medium text-terravik-green hover:underline"
                      >
                        contato@terravik.com.br
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-terravik-green" />
                      <span className="text-terravik-brown/70">
                        SAC:{' '}
                        <a
                          href="mailto:sac@terravik.com.br"
                          className="font-medium text-terravik-green hover:underline"
                        >
                          sac@terravik.com.br
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Estes termos podem ser atualizados periodicamente. A data da
                  última atualização está sempre visível no topo da página.
                </p>
              </div>
            </section>
          </article>
        </div>
      </Container>

      {/* CTA Final */}
      <section className="bg-terravik-gold py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ficou com alguma dúvida?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Nossa equipe está pronta para esclarecer qualquer questão sobre
              nossos termos e condições.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contato">Fale conosco</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link href="/privacidade">Ver Política de Privacidade</Link>
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terravik-gold/10">
        <Icon className="h-5 w-5 text-terravik-gold" />
      </div>
      <h2 className="font-display text-2xl font-bold text-terravik-brown md:text-3xl">
        {title}
      </h2>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-xl border-l-4 border-terravik-gold bg-terravik-gold/5 px-6 py-4">
      <p className="text-sm font-medium leading-relaxed text-terravik-gold md:text-base">
        {children}
      </p>
    </div>
  )
}

function InfoCard({
  title,
  icon: Icon,
  color,
  items,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  items: string[]
}) {
  return (
    <div className="rounded-xl border-2 border-terravik-brown/10 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-terravik-gold/10`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <h3 className="font-display text-lg font-semibold text-terravik-brown">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-terravik-brown/80">
            <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-terravik-green" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
