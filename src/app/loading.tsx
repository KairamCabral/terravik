import { Container } from '@/components/ui'

export default function Loading() {
  return (
    <Container spacing="lg">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="space-y-4">
          <div className="mx-auto h-12 w-3/4 rounded-lg bg-terravik-brown/10"></div>
          <div className="mx-auto h-6 w-1/2 rounded-lg bg-terravik-brown/10"></div>
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video w-full rounded-xl bg-terravik-brown/10"></div>
              <div className="h-6 w-3/4 rounded bg-terravik-brown/10"></div>
              <div className="h-4 w-full rounded bg-terravik-brown/10"></div>
              <div className="h-4 w-5/6 rounded bg-terravik-brown/10"></div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
