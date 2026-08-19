'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  subscribeUserFavorites,
  addFavorite,
  removeFavorite
} from '@/services/favoritesService'

const FavoritesContext = createContext({
  favorites: [],
  favoriteIds: new Set(),
  isFavorite: () => false,
  toggleFavorite: async () => {},
  loading: false
})

export const useFavorites = () => useContext(FavoritesContext)

export const FavoritesProvider = ({ children }) => {
  const user = useSelector((state) => state.user)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  // Real-time subscription to user favorites
  useEffect(() => {
    if (!user?.uid) {
      setFavorites([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeUserFavorites(user.uid, (items) => {
      setFavorites(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid])

  const favoriteIds = useMemo(() => {
    return new Set(favorites.map((fav) => String(fav.productId || fav.id)))
  }, [favorites])

  const isFavorite = useCallback(
    (productId) => {
      if (!productId) return false
      return favoriteIds.has(String(productId))
    },
    [favoriteIds]
  )

  const toggleFavorite = useCallback(
    async (product) => {
      if (!user?.uid) {
        throw new Error('Debes iniciar sesión para guardar productos en favoritos.')
      }

      const productId = String(product.productID || product.id || '')
      if (!productId) return

      if (isFavorite(productId)) {
        await removeFavorite(user.uid, productId)
      } else {
        await addFavorite(user.uid, product)
      }
    },
    [user?.uid, isFavorite]
  )

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      isFavorite,
      toggleFavorite,
      loading
    }),
    [favorites, favoriteIds, isFavorite, toggleFavorite, loading]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default FavoritesProvider
