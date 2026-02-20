import { Container } from '@/components/ui'

export default function Loading() {
  return (
    <Container spacing="lg">
      <div className="animate-pulse">
        {/* Breadcrumbs skeleton */}
        <div className="mb-6 flex gap-2">
          <div className="h-4 w-16 rounded bg-terravik-brown/10"></div>
          <div className="h-4 w-4 rounded bg-terravik-brown/10"></div>
          <div className="h-4 w-16 rounded bg-terravik-brown/10"></div>
          <div className="h-4 w-4 rounded bg-terravik-brown/10"></div>
          <div className="h-4 w-32 rounded bg-terravik-brown/10"></div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Badge + Title */}
          <div className="space-y-4">
            <div className="h-6 w-24 rounded-full bg-terravik-brown/10"></div>
            <div className="h-12 w-full rounded-lg bg-terravik-brown/10"></div>
            <div className="h-12 w-4/5 rounded-lg bg-terravik-brown/10"></div>
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <div className="h-4 w-32 rounded bg-terravik-brown/10"></div>
            <div className="h-4 w-24 rounded bg-terravik-brown/10"></div>
            <div className="h-4 w-20 rounded bg-terravik-brown/10"></div>
          </div>

          {/* Content */}
          <div className="space-y-3 pt-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-4 rounded bg-terravik-brown/10"
                style={{ width: `${Math.random() * 20 + 80}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
