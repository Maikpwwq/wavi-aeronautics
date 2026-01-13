import { useState, useMemo } from 'react'

export const useProductFilter = (products) => {
  // --------------------------------------------------------------------------
  // Logic: Filter State
  // --------------------------------------------------------------------------
  const [filterState, setFilterState] = useState({
    marcas: [],
    precio: {
      min: '',
      max: ''
    }
  })

  // --------------------------------------------------------------------------
  // Logic: Actions
  // --------------------------------------------------------------------------
  const toggleMarca = (marca) => {
    setFilterState((prev) => {
      const isSelected = prev.marcas.includes(marca)
      if (isSelected) {
        return {
          ...prev,
          marcas: prev.marcas.filter((m) => m !== marca)
        }
      } else {
        return {
          ...prev,
          marcas: [...prev.marcas, marca]
        }
      }
    })
  }

  const setMinPrice = (val) => {
    setFilterState((prev) => ({
      ...prev,
      precio: { ...prev.precio, min: val }
    }))
  }

  const setMaxPrice = (val) => {
    setFilterState((prev) => ({
      ...prev,
      precio: { ...prev.precio, max: val }
    }))
  }

  const resetFilters = () => {
    setFilterState({
      marcas: [],
      precio: { min: '', max: '' }
    })
  }

  // --------------------------------------------------------------------------
  // Logic: Parsing & Extraction
  // --------------------------------------------------------------------------
  // Parses "$ 1.200.000" -> 1200000
  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr
    if (!priceStr) return 0
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0
  }

  // Extract unique brands from current products
  const availableMarcas = useMemo(() => {
    if (!products) return []
    const marcasSet = new Set(
      products
        .map((p) => p.marca)
        .filter((m) => m && m !== 'default') // Filter invalid brands
    )
    return Array.from(marcasSet).sort()
  }, [products])

  // --------------------------------------------------------------------------
  // Logic: Filtering
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Logic: Sort State
  // --------------------------------------------------------------------------
  const [sortOrder, setSortOrder] = useState('newest') // newest, oldest, price-asc, price-desc

  // --------------------------------------------------------------------------
  // Logic: Filtering & Sorting
  // --------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    if (!products) return []

    // 1. Filter
    const filtered = products.filter((product) => {
      // Brand Filter
      if (
        filterState.marcas.length > 0 &&
        !filterState.marcas.includes(product.marca)
      ) {
        return false
      }

      // Price Filter
      const productPrice = parsePrice(product.price || product.precio)
      const minVal = parsePrice(filterState.precio.min)
      const maxVal = parsePrice(filterState.precio.max)

      if (filterState.precio.min && productPrice < minVal) return false
      if (filterState.precio.max && productPrice > maxVal) return false

      return true
    })

    // 2. Sort
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest': {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds ? a.createdAt.seconds * 1000 : a.createdAt) : 0
          const dateB = b.createdAt ? new Date(b.createdAt.seconds ? b.createdAt.seconds * 1000 : b.createdAt) : 0
          return dateB - dateA
        }
        case 'oldest': {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds ? a.createdAt.seconds * 1000 : a.createdAt) : 0
          const dateB = b.createdAt ? new Date(b.createdAt.seconds ? b.createdAt.seconds * 1000 : b.createdAt) : 0
          return dateA - dateB
        }
        case 'price-asc': {
          const priceA = parsePrice(a.price || a.precio)
          const priceB = parsePrice(b.price || b.precio)
          return priceA - priceB
        }
        case 'price-desc': {
          const priceA = parsePrice(a.price || a.precio)
          const priceB = parsePrice(b.price || b.precio)
          return priceB - priceA
        }
        default:
          return 0
      }
    })
  }, [products, filterState, sortOrder])

  return {
    filters: filterState,
    filteredProducts,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder
  }
}
