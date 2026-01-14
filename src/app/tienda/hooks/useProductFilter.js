import { useState, useMemo } from 'react'

export const useProductFilter = (products) => {
  // --------------------------------------------------------------------------
  // Logic: Filter State
  // --------------------------------------------------------------------------
  const [filterState, setFilterState] = useState({
    brands: [],
    price: {
      min: '',
      max: ''
    }
  })

  // --------------------------------------------------------------------------
  // Logic: Actions
  // --------------------------------------------------------------------------
  const toggleBrand = (brand) => {
    setFilterState((prev) => {
      const isSelected = prev.brands.includes(brand)
      if (isSelected) {
        return {
          ...prev,
          brands: prev.brands.filter((m) => m !== brand)
        }
      } else {
        return {
          ...prev,
          brands: [...prev.brands, brand]
        }
      }
    })
  }

  const setMinPrice = (val) => {
    setFilterState((prev) => ({
      ...prev,
      price: { ...prev.price, min: val }
    }))
  }

  const setMaxPrice = (val) => {
    setFilterState((prev) => ({
      ...prev,
      price: { ...prev.price, max: val }
    }))
  }

  const resetFilters = () => {
    setFilterState({
      brands: [],
      price: { min: '', max: '' }
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
  const availableBrands = useMemo(() => {
    if (!products) return []
    const brandsSet = new Set(
      products
        .map((p) => p.brand || p.marca) // Handle new 'brand' and legacy 'marca'
        .filter((m) => m && m !== 'default') // Filter invalid brands
    )
    return Array.from(brandsSet).sort()
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
      const productBrand = product.brand || product.marca
      if (
        filterState.brands.length > 0 &&
        !filterState.brands.includes(productBrand)
      ) {
        return false
      }

      // Price Filter
      // Prefer 'precio' (formatted COP string) over 'price' (USD number) for comparison
      // because the filter inputs are in encoded COP
      const productPrice = parsePrice(product.precio || product.price) 
      const minVal = parsePrice(filterState.price.min)
      const maxVal = parsePrice(filterState.price.max)

      if (filterState.price.min && productPrice < minVal) return false
      if (filterState.price.max && productPrice > maxVal) return false

      return true
    })

    // 2. Sort
    return filtered.sort((a, b) => {
      // Helper to get consistent price for sorting
      const getPrice = (p) => parsePrice(p.precio || p.price)

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
          return getPrice(a) - getPrice(b)
        }
        case 'price-desc': {
          return getPrice(b) - getPrice(a)
        }
        default:
          return 0
      }
    })
  }, [products, filterState, sortOrder])

  return {
    filters: filterState,
    filteredProducts,
    availableBrands,
    toggleBrand,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder
  }
}
