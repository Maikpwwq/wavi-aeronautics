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
  const filteredProducts = useMemo(() => {
    if (!products) return []

    return products.filter((product) => {
      // 1. Brand Filter
      if (
        filterState.marcas.length > 0 &&
        !filterState.marcas.includes(product.marca)
      ) {
        return false
      }

      // 2. Price Filter
      const productPrice = parsePrice(product.precio)
      const minVal = parsePrice(filterState.precio.min)
      const maxVal = parsePrice(filterState.precio.max)

      // If min set, product must be >= min
      if (filterState.precio.min && productPrice < minVal) {
        return false
      }
      // If max set, product must be <= max
      if (filterState.precio.max && productPrice > maxVal) {
        return false
      }

      return true
    })
  }, [products, filterState])

  return {
    filters: filterState,
    filteredProducts,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters
  }
}
