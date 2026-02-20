'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Location } from '@/types/location'
import { Badge, Button } from '@/components/ui'
import { MapPin, Phone, Globe, ExternalLink } from 'lucide-react'

interface LocationCardProps {
  location: Location
}

const typeIcons: Record<string, typeof MapPin> = {
  agropecuaria: MapPin,
  garden_center: MapPin,
  supermercado: MapPin,
  loja_online: Globe,
  online: Globe,
  pet_shop: MapPin,
  agricultural: MapPin,
  other: MapPin,
}

export function LocationCard({ location }: LocationCardProps) {
  const [logoError, setLogoError] = useState(false)
  const Icon = typeIcons[location.type] || MapPin
  const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
  const showLogo = location.logoUrl && !logoError

  return (
    <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {showLogo ? (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-terravik-brown/5">
              <Image
                src={location.logoUrl}
                alt={location.name}
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-terravik-green/10">
              <Icon className="h-8 w-8 text-terravik-green" />
            </div>
          )}
          <div>
            <h3 className="font-display text-lg font-bold text-terravik-brown">
              {location.name}
            </h3>
            <Badge size="sm" className="mt-1 bg-terravik-green/10 text-terravik-green-700">
              {location.typeLabel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-1 text-sm text-terravik-brown/70">
        <p>{location.address}</p>
        <p>
          {location.city} — {location.state}
        </p>
        {location.zipCode && <p>CEP: {location.zipCode}</p>}
      </div>

      {location.products.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-terravik-brown/60">
            Produtos disponíveis:
          </p>
          <div className="flex flex-wrap gap-2">
            {location.products.map((product) => (
              <Badge key={product} size="sm" variant="default">
                {product}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {location.whatsapp && (
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a
              href={`https://wa.me/${location.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        )}

        {location.phone && !location.whatsapp && (
          <Button size="sm" variant="outline" asChild>
            <a href={`tel:${location.phone}`}>
              <Phone className="h-4 w-4" />
              Telefone
            </a>
          </Button>
        )}

        {location.website && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="h-4 w-4" />
              Site
            </a>
          </Button>
        )}

        {location.type !== 'loja_online' && location.type !== 'online' && (
          <Button size="sm" variant="outline" asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Ver no mapa
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
