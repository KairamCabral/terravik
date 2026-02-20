import Link from 'next/link'
import { Button, Container } from '@/components/ui'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <Container spacing="lg">
      <div className="mx-auto max-w-2xl text-center">
        {/* Ícone */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-terravik-green/10">
          <Leaf className="h-16 w-16 text-terravik-green" />
        </div>

        {/* Título */}
        <h1 className="mb-4 font-display text-6xl font-bold text-terravik-brown">
          404
        </h1>
        <h2 className="mb-4 font-display text-2xl font-bold text-terravik-brown md:text-3xl">
          Página não encontrada
        </h2>

        {/* Subtítulo */}
        <p className="mb-8 text-lg text-terravik-brown/70">
          Parece que essa página não existe — mas o seu gramado pode ficar
          perfeito!
        </p>

        {/* Links úteis */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">Ir para a Home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/produtos">Ver produtos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/calculadora">Calcular meu plano</Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}
