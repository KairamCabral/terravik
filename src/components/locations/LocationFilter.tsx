'use client'

import { useState } from 'react'
import type { Location } from '@/types/location'

interface LocationFilterProps {
  locations: Location[]
  onFilter: (filtered: Location[]) => void
}

export function LocationFilter({ locations, onFilter }: LocationFilterProps) {
  const [search, setSearch] = useState('')
  const [state, setState] = useState('all')
  const [type, setType] = useState('all')

  const handleFilter = (searchTerm: string, stateTerm: string, typeTerm: string) => {
    let filtered = locations

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(term) ||
          loc.city.toLowerCase().includes(term)
      )
    }

    if (stateTerm !== 'all') {
      filtered = filtered.filter((loc) => loc.state === stateTerm)
    }

    if (typeTerm !== 'all') {
      filtered = filtered.filter((loc) => loc.type === typeTerm)
    }

    onFilter(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    handleFilter(value, state, type)
  }

  const handleStateChange = (value: string) => {
    setState(value)
    handleFilter(search, value, type)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    handleFilter(search, state, value)
  }

  const states = Array.from(new Set(locations.map((loc) => loc.state)))
  const types = Array.from(new Set(locations.map((loc) => loc.type)))

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Buscar por cidade ou nome..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
      />

      <select
        value={state}
        onChange={(e) => handleStateChange(e.target.value)}
        className="rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
      >
        <option value="all">Todos os estados</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
      >
        <option value="all">Todos os tipos</option>
        {types.map((t) => {
          const loc = locations.find((l) => l.type === t)
          return (
            <option key={t} value={t}>
              {loc?.typeLabel || t}
            </option>
          )
        })}
      </select>
    </div>
  )
}
