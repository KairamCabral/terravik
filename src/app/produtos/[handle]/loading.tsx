import { Container } from '@/components/ui'

export default function Loading() {
  return (
    <Container spacing="lg">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-terravik-brown/10"></div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-terravik-brown/10"></div>
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-8 w-full rounded-lg bg-terravik-brown/10"></div>
            <div className="h-8 w-3/4 rounded-lg bg-terravik-brown/10"></div>
          </div>
          <div className="h-12 w-48 rounded-lg bg-terravik-brown/10"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-terravik-brown/10"></div>
            <div className="h-4 w-full rounded bg-terravik-brown/10"></div>
            <div className="h-4 w-5/6 rounded bg-terravik-brown/10"></div>
          </div>
          <div className="h-12 w-full rounded-full bg-terravik-brown/10"></div>
        </div>
      </div>
    </Container>
  )
}
