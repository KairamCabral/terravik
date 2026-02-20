import type { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { Container, Button } from '@/components/ui'
import {
  Shield,
  Eye,
  Database,
  Share2,
  Cookie,
  Lock,
  UserCheck,
  Mail,
  Clock,
  ChevronRight,
  FileText,
  Leaf,
} from 'lucide-react'

export const metadata: Metadata = createMetadata({
  title: 'Política de Privacidade',
  description:
    'Saiba como a Terravik coleta, usa e protege seus dados pessoais. Transparência é um dos nossos valores — inclusive com a sua privacidade.',
  path: '/privacidade',
})

const sections = [
  { id: 'introducao', label: 'Introdução', icon: FileText },
  { id: 'dados-coletados', label: 'Dados que coletamos', icon: Database },
  { id: 'como-usamos', label: 'Como usamos', icon: Eye },
  { id: 'compartilhamento', label: 'Compartilhamento', icon: Share2 },
  { id: 'cookies', label: 'Cookies', icon: Cookie },
  { id: 'seguranca', label: 'Segurança', icon: Lock },
  { id: 'seus-direitos', label: 'Seus direitos', icon: UserCheck },
  { id: 'retencao', label: 'Retenção de dados', icon: Clock },
  { id: 'contato', label: 'Contato', icon: Mail },
]

export default function PrivacidadePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Política de Privacidade', url: '/privacidade' },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-terravik-cream via-terravik-cream to-terravik-green/5 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-terravik-green/10">
              <Shield className="h-8 w-8 text-terravik-green" />
            </div>
            <h1 className="font-display text-4xl font-bold text-terravik-brown md:text-5xl">
              Política de Privacidade
            </h1>
            <p className="mt-6 text-lg text-terravik-brown/80 md:text-xl">
              Transparência é um dos nossos valores — inclusive com os seus dados.
              Aqui explicamos tudo de forma clara, sem juridiquês.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-terravik-green/10 px-4 py-2 text-sm text-terravik-green">
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
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-terravik-brown/70 transition-all hover:bg-terravik-green/5 hover:text-terravik-green"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-terravik-brown/40 transition-colors group-hover:text-terravik-green" />
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
            {/* 1. Introdução */}
            <section id="introducao" className="scroll-mt-32">
              <SectionHeader icon={FileText} title="Introdução" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  A <strong>Terravik Fertilizantes Premium LTDA</strong> (&ldquo;Terravik&rdquo;,
                  &ldquo;nós&rdquo;) leva a proteção dos seus dados pessoais a sério. Esta
                  Política de Privacidade explica como coletamos, usamos,
                  armazenamos e protegemos suas informações quando você acessa
                  nosso site, utiliza nossos serviços ou interage conosco.
                </p>
                <Highlight>
                  Resumo: coletamos apenas o necessário, nunca vendemos seus dados
                  e você tem controle total sobre eles.
                </Highlight>
                <p>
                  Esta política se aplica ao site{' '}
                  <strong>terravik.com.br</strong>, à loja online, à Calculadora
                  de Dose, aos Cursos Terravik e a qualquer comunicação entre
                  você e a Terravik. Ao utilizar nossos serviços, você concorda
                  com as práticas descritas aqui.
                </p>
              </div>
            </section>

            {/* 2. Dados coletados */}
            <section id="dados-coletados" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Database} title="Dados que coletamos" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Coletamos diferentes tipos de dados dependendo de como você
                  interage conosco. Veja o que coletamos e por quê:
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <DataCard
                  title="Dados de cadastro"
                  items={[
                    'Nome completo e e-mail (para criar sua conta)',
                    'Telefone (opcional, para comunicação)',
                    'Endereço (quando necessário para entrega)',
                  ]}
                />
                <DataCard
                  title="Dados de uso"
                  items={[
                    'Páginas visitadas e tempo de navegação',
                    'Cálculos feitos na Calculadora de Dose',
                    'Progresso nos Cursos Terravik',
                    'Produtos visualizados e favoritos',
                  ]}
                />
                <DataCard
                  title="Dados de compra"
                  items={[
                    'Histórico de pedidos (processado pelo Shopify)',
                    'Dados de pagamento (armazenados exclusivamente pelo Shopify — nunca temos acesso ao número do cartão)',
                  ]}
                />
                <DataCard
                  title="Dados técnicos"
                  items={[
                    'Endereço IP, tipo de navegador e dispositivo',
                    'Cookies e identificadores de sessão',
                  ]}
                />
              </div>
            </section>

            {/* 3. Como usamos */}
            <section id="como-usamos" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Eye} title="Como usamos seus dados" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>Seus dados são usados exclusivamente para:</p>
                <ul>
                  <li>
                    <strong>Fornecer nossos serviços</strong> — processar
                    pedidos, calcular doses, registrar progresso na Academia
                  </li>
                  <li>
                    <strong>Melhorar sua experiência</strong> — personalizar
                    recomendações, lembrar preferências, otimizar o site
                  </li>
                  <li>
                    <strong>Comunicação</strong> — enviar atualizações de
                    pedidos, novidades e conteúdo educacional (com seu
                    consentimento)
                  </li>
                  <li>
                    <strong>Segurança</strong> — prevenir fraudes, proteger
                    contas e cumprir obrigações legais
                  </li>
                  <li>
                    <strong>Análise</strong> — entender como nossos produtos e
                    conteúdos são usados para melhorá-los continuamente
                  </li>
                </ul>
                <Highlight>
                  Nunca vendemos, alugamos ou trocamos seus dados pessoais com
                  terceiros para fins de marketing.
                </Highlight>
              </div>
            </section>

            {/* 4. Compartilhamento */}
            <section id="compartilhamento" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Share2} title="Compartilhamento de dados" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Compartilhamos seus dados apenas quando estritamente
                  necessário, com parceiros de confiança:
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border-2 border-terravik-brown/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-terravik-brown/10 bg-terravik-cream/50">
                      <th className="px-6 py-4 font-display font-semibold text-terravik-brown">
                        Parceiro
                      </th>
                      <th className="px-6 py-4 font-display font-semibold text-terravik-brown">
                        Finalidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-terravik-brown/5">
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">Shopify</td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Processamento de pedidos, pagamentos e checkout
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">Supabase</td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Autenticação, banco de dados e armazenamento seguro
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">Google Analytics</td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Análise de tráfego e comportamento (dados anonimizados)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-terravik-brown">Transportadoras</td>
                      <td className="px-6 py-4 text-terravik-brown/80">
                        Entrega de pedidos (nome e endereço)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Todos os parceiros estão sujeitos a acordos de
                  confidencialidade e cumprem a LGPD (Lei Geral de Proteção de
                  Dados). Também podemos compartilhar dados quando exigido por
                  lei ou ordem judicial.
                </p>
              </div>
            </section>

            {/* 5. Cookies */}
            <section id="cookies" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Cookie} title="Cookies e tecnologias similares" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>Usamos cookies para fazer o site funcionar e melhorar sua experiência:</p>
              </div>

              <div className="mt-6 space-y-3">
                <CookieCard
                  type="Essenciais"
                  color="bg-terravik-green"
                  description="Login, carrinho, preferências de idioma. Sem eles, o site não funciona."
                  canDisable={false}
                />
                <CookieCard
                  type="Analíticos"
                  color="bg-terravik-gold"
                  description="Entender como você navega para melhorar o site. Dados anonimizados."
                  canDisable={true}
                />
                <CookieCard
                  type="Marketing"
                  color="bg-terravik-brown"
                  description="Mostrar anúncios relevantes em outras plataformas. Só com seu consentimento."
                  canDisable={true}
                />
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Você pode gerenciar cookies a qualquer momento nas
                  configurações do seu navegador. Desativar cookies essenciais
                  pode afetar o funcionamento do site.
                </p>
              </div>
            </section>

            {/* 6. Segurança */}
            <section id="seguranca" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Lock} title="Segurança dos dados" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>Proteger seus dados é prioridade. Nossas medidas incluem:</p>
                <ul>
                  <li>
                    <strong>Criptografia</strong> — todas as conexões usam HTTPS/TLS
                  </li>
                  <li>
                    <strong>Autenticação segura</strong> — senhas são hasheadas
                    com bcrypt; suportamos autenticação social (Google)
                  </li>
                  <li>
                    <strong>Dados de pagamento isolados</strong> — nunca tocamos
                    no número do seu cartão; tudo é processado pelo Shopify (PCI
                    DSS compliant)
                  </li>
                  <li>
                    <strong>Controle de acesso</strong> — Row Level Security
                    (RLS) no banco de dados; cada usuário só acessa seus
                    próprios dados
                  </li>
                  <li>
                    <strong>Monitoramento</strong> — alertas automáticos para
                    atividades suspeitas
                  </li>
                </ul>
                <Highlight>
                  Dados de pagamento são processados exclusivamente pelo Shopify.
                  Nunca armazenamos número de cartão, CVV ou dados bancários.
                </Highlight>
              </div>
            </section>

            {/* 7. Seus direitos */}
            <section id="seus-direitos" className="mt-16 scroll-mt-32">
              <SectionHeader icon={UserCheck} title="Seus direitos (LGPD)" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
                  você tem o direito de:
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { right: 'Acessar', desc: 'Saber quais dados temos sobre você' },
                  { right: 'Corrigir', desc: 'Atualizar dados incorretos ou incompletos' },
                  { right: 'Excluir', desc: 'Solicitar a exclusão dos seus dados' },
                  { right: 'Portabilidade', desc: 'Receber seus dados em formato estruturado' },
                  { right: 'Revogar', desc: 'Retirar consentimento a qualquer momento' },
                  { right: 'Opor-se', desc: 'Contestar o uso dos seus dados' },
                ].map((item) => (
                  <div
                    key={item.right}
                    className="flex items-start gap-3 rounded-xl border-2 border-terravik-brown/10 bg-white p-4"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-terravik-green/10">
                      <ChevronRight className="h-4 w-4 text-terravik-green" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-terravik-brown">
                        {item.right}
                      </p>
                      <p className="text-sm text-terravik-brown/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Para exercer qualquer direito, entre em contato pelo e-mail{' '}
                  <a href="mailto:privacidade@terravik.com.br">
                    privacidade@terravik.com.br
                  </a>
                  . Responderemos em até 15 dias úteis, conforme exigido pela LGPD.
                </p>
              </div>
            </section>

            {/* 8. Retenção */}
            <section id="retencao" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Clock} title="Retenção de dados" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>Mantemos seus dados apenas pelo tempo necessário:</p>
                <ul>
                  <li>
                    <strong>Dados de conta</strong> — enquanto sua conta estiver
                    ativa. Após exclusão, removemos em até 30 dias.
                  </li>
                  <li>
                    <strong>Dados de pedidos</strong> — 5 anos (obrigação fiscal
                    e legal).
                  </li>
                  <li>
                    <strong>Dados de navegação</strong> — até 26 meses
                    (conforme política do Google Analytics).
                  </li>
                  <li>
                    <strong>Dados da Academia</strong> — enquanto sua conta
                    estiver ativa.
                  </li>
                </ul>
                <p>
                  Após os períodos acima, os dados são anonimizados ou excluídos
                  permanentemente.
                </p>
              </div>
            </section>

            {/* 9. Contato */}
            <section id="contato" className="mt-16 scroll-mt-32">
              <SectionHeader icon={Mail} title="Contato e DPO" />
              <div className="prose prose-lg prose-terravik max-w-none">
                <p>
                  Se tiver dúvidas sobre esta política ou sobre como tratamos
                  seus dados, entre em contato:
                </p>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-terravik-brown/10 bg-terravik-cream/30 p-6 md:p-8">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-display font-semibold text-terravik-brown">
                      Terravik Fertilizantes Premium LTDA
                    </p>
                    <p className="text-terravik-brown/70">
                      Encarregado de Proteção de Dados (DPO)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-terravik-green" />
                    <a
                      href="mailto:privacidade@terravik.com.br"
                      className="font-medium text-terravik-green hover:underline"
                    >
                      privacidade@terravik.com.br
                    </a>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-terravik mt-6 max-w-none">
                <p>
                  Esta política pode ser atualizada periodicamente. Quando
                  houver mudanças significativas, notificaremos você por e-mail
                  ou por aviso no site. A data da última atualização está sempre
                  visível no topo da página.
                </p>
              </div>
            </section>
          </article>
        </div>
      </Container>

      {/* CTA Final */}
      <section className="bg-terravik-green py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Tem alguma dúvida?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Nossa equipe está pronta para esclarecer qualquer questão sobre
              seus dados e privacidade.
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
                <Link href="/termos">Ver Termos de Uso</Link>
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terravik-green/10">
        <Icon className="h-5 w-5 text-terravik-green" />
      </div>
      <h2 className="font-display text-2xl font-bold text-terravik-brown md:text-3xl">
        {title}
      </h2>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-xl border-l-4 border-terravik-green bg-terravik-green/5 px-6 py-4">
      <p className="text-sm font-medium leading-relaxed text-terravik-green md:text-base">
        {children}
      </p>
    </div>
  )
}

function DataCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border-2 border-terravik-brown/10 bg-white p-6">
      <h3 className="mb-3 font-display text-lg font-semibold text-terravik-brown">
        {title}
      </h3>
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

function CookieCard({
  type,
  color,
  description,
  canDisable,
}: {
  type: string
  color: string
  description: string
  canDisable: boolean
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border-2 border-terravik-brown/10 bg-white p-5">
      <div className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${color}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-terravik-brown">
            {type}
          </h3>
          {!canDisable && (
            <span className="rounded-full bg-terravik-brown/10 px-2 py-0.5 text-xs font-medium text-terravik-brown/60">
              Obrigatório
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-terravik-brown/70">{description}</p>
      </div>
    </div>
  )
}
