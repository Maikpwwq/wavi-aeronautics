import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProductFilter } from '../useProductFilter'

describe('useProductFilter Hook', () => {
  const sampleProducts = [
    {
      productID: 'drone-o3',
      name: 'GEPRC CineLog35 V2 HD DJI O3',
      brand: 'GEPRC',
      precio: '$ 2.800.000',
      availability: true,
    },
    {
      productID: 'drone-avatar',
      name: 'BetaFPV Pavo20 Walksnail Avatar HD',
      brand: 'BetaFPV',
      precio: '$ 1.500.000',
      availability: true,
    },
    {
      productID: 'drone-wasp',
      name: 'GEPRC Thinking P16 HD WASP',
      brand: 'GEPRC',
      precio: '$ 1.200.000',
      availability: true,
    },
    {
      productID: 'drone-analog',
      name: 'BetaFPV Meteor75 Pro Analógico',
      brand: 'BetaFPV',
      precio: '$ 600.000',
      availability: true,
    },
    {
      productID: 'drone-wtfpv',
      name: 'Mobula6 HDZero WTFPV Edition',
      brand: 'Happymodel',
      precio: '$ 800.000',
      availability: true,
    }
  ]

  it('initializes with default empty filters and returns all products', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    expect(result.current.filters.brands).toEqual([])
    expect(result.current.filters.vtxSystems).toEqual([])
    expect(result.current.filteredProducts.length).toBe(5)
  })

  it('filters products by single VTX system (e.g. o3)', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    act(() => {
      result.current.toggleVtxSystem('o3')
    })

    expect(result.current.filters.vtxSystems).toEqual(['o3'])
    expect(result.current.filteredProducts.length).toBe(1)
    expect(result.current.filteredProducts[0].productID).toBe('drone-o3')
  })

  it('allows multi-selection of VTX systems (OR behavior)', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    // Select O3 and Walksnail
    act(() => {
      result.current.toggleVtxSystem('o3')
      result.current.toggleVtxSystem('walksnail')
    })

    expect(result.current.filters.vtxSystems).toEqual(['o3', 'walksnail'])
    expect(result.current.filteredProducts.length).toBe(2)
    const ids = result.current.filteredProducts.map((p) => p.productID)
    expect(ids).toContain('drone-o3')
    expect(ids).toContain('drone-avatar')
  })

  it('unselects a VTX system when toggled again', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    act(() => {
      result.current.toggleVtxSystem('wasp')
    })
    expect(result.current.filters.vtxSystems).toEqual(['wasp'])
    expect(result.current.filteredProducts.length).toBe(1)

    // Toggle off
    act(() => {
      result.current.toggleVtxSystem('wasp')
    })
    expect(result.current.filters.vtxSystems).toEqual([])
    expect(result.current.filteredProducts.length).toBe(5)
  })

  it('combines VTX filter with brand filter', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    // Filter by Brand GEPRC + VTX O3
    act(() => {
      result.current.toggleBrand('GEPRC')
      result.current.toggleVtxSystem('o3')
    })

    expect(result.current.filteredProducts.length).toBe(1)
    expect(result.current.filteredProducts[0].productID).toBe('drone-o3')

    // Filter by Brand BetaFPV + VTX O3 (None exists)
    act(() => {
      result.current.toggleBrand('GEPRC') // off
      result.current.toggleBrand('BetaFPV') // on
    })

    expect(result.current.filteredProducts.length).toBe(0)
  })

  it('clears VTX systems and all filters on resetFilters', () => {
    const { result } = renderHook(() => useProductFilter(sampleProducts))

    act(() => {
      result.current.toggleVtxSystem('o3')
      result.current.toggleBrand('GEPRC')
      result.current.setMinPrice('1000000')
    })

    expect(result.current.filters.vtxSystems.length).toBe(1)

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters.vtxSystems).toEqual([])
    expect(result.current.filters.brands).toEqual([])
    expect(result.current.filters.price.min).toBe('')
    expect(result.current.filteredProducts.length).toBe(5)
  })
})
