'use client'

import { useState } from 'react'
import { getRepresentativesByRegion } from '@/lib/locations/representatives'
import type { Representative } from '@/types/location'
import { Button } from '@/components/ui'
import { Search, Phone, Mail, MapPin } from 'lucide-react'

export function FindRepresentative() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Representative[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      const found = getRepresentativesByRegion(search)
      setResults(found)
      setSearched(true)
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold text-terravik-brown">
        Encontrar Representante
      </h2>
      <p className="mb-6 text-terravik-brown/70">
        Busque por estado ou cidade para encontrar um representante Terravik
        perto de você.
      </p>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ex: Santa Catarina, Florianópolis..."
            className="flex-1 rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
          />
          <Button type="submit">
            <Search className="h-5 w-5" />
            Buscar
          </Button>
        </div>
      </form>

      {searched && (
        <>
          {results.length === 0 ? (
            <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-8">
              <p className="mb-4 text-terravik-brown/70">
                Ainda não temos representante na sua região. Deixe seu contato
                que entraremos em contato.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#representante-form">Deixar contato</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-6"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-terravik-green/10">
                      <MapPin className="h-5 w-5 text-terravik-green" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-terravik-brown">
                        {rep.name}
                      </h3>
                      <p className="text-sm text-terravik-brown/60">
                        {rep.region}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-terravik-brown/70">
                    <p>
                      {rep.city} — {rep.state}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${rep.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>

                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${rep.email}`}>
                        <Mail className="h-4 w-4" />
                        E-mail
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
