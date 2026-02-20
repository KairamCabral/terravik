'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react'

const FAVORITES_STORAGE_KEY = 'terravik-favorites'
const SYNC_DEBOUNCE_MS = 500

interface FavoritesData {
  productIds: string[]
  timestamp: number
}

interface FavoritesContextValue {
  favorites: string[]
  isLoading: boolean
  isSyncing: boolean
  addFavorite: (productId: string) => Promise<void>
  removeFavorite: (productId: string) => Promise<void>
  toggleFavorite: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  clearFavorites: () => Promise<void>
  getFavoritesCount: () => number
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (stored) {
          const data: FavoritesData = JSON.parse(stored)
          setFavorites(data.productIds || [])
        }
      } catch (error) {
        console.error('[Favorites] Error loading from localStorage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      try {
        const data: FavoritesData = {
          productIds: favorites,
          timestamp: Date.now(),
        }
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data))
      } catch (error) {
        console.error('[Favorites] Error saving to localStorage:', error)
      }
    }
  }, [favorites, isLoading])

  // Add favorite
  const addFavorite = useCallback(async (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev
      return [...prev, productId]
    })
  }, [])

  // Remove favorite
  const removeFavorite = useCallback(async (productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId))
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (productId: string) => {
      setFavorites((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId)
        }
        return [...prev, productId]
      })
    },
    []
  )

  // Check if product is favorite
  const isFavorite = useCallback(
    (productId: string): boolean => {
      return favorites.includes(productId)
    },
    [favorites]
  )

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    setFavorites([])
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY)
    } catch (error) {
      console.error('[Favorites] Error clearing localStorage:', error)
    }
  }, [])

  // Get favorites count
  const getFavoritesCount = useCallback(() => {
    return favorites.length
  }, [favorites])

  const value = useMemo(
    () => ({
      favorites,
      isLoading,
      isSyncing,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      getFavoritesCount,
    }),
    [
      favorites,
      isLoading,
      isSyncing,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      getFavoritesCount,
    ]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
