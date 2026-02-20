'use client'

import { useState } from 'react'
import type { Location } from '@/types/location'
import { LocationFilter } from './LocationFilter'
import { LocationCard } from './LocationCard'

interface LocationListProps {
  locations: Location[]
}

export function LocationList({ locations }: LocationListProps) {
  const [filteredLocations, setFilteredLocations] = useState(locations)

  return (
    <div>
      <LocationFilter locations={locations} onFilter={setFilteredLocations} />

      <p className="mb-6 text-sm text-terravik-brown/60">
        {filteredLocations.length}{' '}
        {filteredLocations.length === 1
          ? 'ponto de venda encontrado'
          : 'pontos de venda encontrados'}
      </p>

      {filteredLocations.length === 0 ? (
        <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-12 text-center">
          <p className="text-lg text-terravik-brown/70">
            Nenhum ponto de venda encontrado nessa região. Tente outra busca.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  )
}
