import { Container } from '@/components/ui'

export default function Loading() {
  return (
    <Container spacing="lg">
      <div className="animate-pulse space-y-6">
        {/* Title skeleton */}
        <div className="h-10 w-64 rounded-lg bg-terravik-brown/10"></div>

        {/* Grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border-2 border-terravik-brown/10 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-terravik-brown/10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-terravik-brown/10"></div>
                  <div className="h-4 w-24 rounded bg-terravik-brown/10"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-terravik-brown/10"></div>
                <div className="h-4 w-3/4 rounded bg-terravik-brown/10"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-lg bg-terravik-brown/10"></div>
                <div className="h-8 w-24 rounded-lg bg-terravik-brown/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
