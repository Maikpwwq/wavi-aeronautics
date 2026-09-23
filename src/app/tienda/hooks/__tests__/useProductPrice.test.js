import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProductPrice, normalizeSelectedVariations } from '../useProductPrice'

describe('useProductPrice', () => {
  it('returns default $ 0 when product is null or undefined', () => {
    const { result } = renderHook(() => useProductPrice(null))
    expect(result.current.displayPrice).toBe('$ 0')
    expect(result.current.unitPriceUsd).toBe(0)
    expect(result.current.unitPriceCop).toBe(0)
    expect(result.current.hasPriceDelta).toBe(false)
  })

  it('computes USD base price with calculateCopPrice', () => {
    const product = { price: 100 }
    const { result } = renderHook(() => useProductPrice(product))
    expect(result.current.unitPriceUsd).toBe(100)
    expect(result.current.hasPriceDelta).toBe(false)
    expect(result.current.displayPrice).toBeTruthy()
  })

  it('adds priceDelta from array of selected variations', () => {
    const product = { price: 100 }
    const selectedVariations = [
      { groupId: 'rx', optionId: 'elrs', priceDelta: 17 },
      { groupId: 'motor', optionId: 'tmotor', priceDelta: 25 }
    ]
    const { result } = renderHook(() => useProductPrice(product, selectedVariations))
    expect(result.current.unitPriceUsd).toBe(142) // 100 + 17 + 25
    expect(result.current.priceDeltaUsd).toBe(42)
    expect(result.current.hasPriceDelta).toBe(true)
  })

  it('supports legacy priceModifier field', () => {
    const product = { price: 200 }
    const selectedOption = { label: 'TBS Nano RX', priceModifier: 35 }
    const { result } = renderHook(() => useProductPrice(product, selectedOption))
    expect(result.current.unitPriceUsd).toBe(235)
    expect(result.current.priceDeltaUsd).toBe(35)
    expect(result.current.hasPriceDelta).toBe(true)
  })

  it('supports map/object of selected variations', () => {
    const product = { price: 150 }
    const selectedMap = {
      rx: { optionId: 'elrs', priceDelta: 20 },
      color: { optionId: 'red', priceDelta: 0 }
    }
    const { result } = renderHook(() => useProductPrice(product, selectedMap))
    expect(result.current.unitPriceUsd).toBe(170)
    expect(result.current.priceDeltaUsd).toBe(20)
  })

  it('multiplies price by quantity correctly', () => {
    const product = { price: 100 }
    const { result } = renderHook(() => useProductPrice(product, [], 3))
    expect(result.current.totalPriceCop).toBe(result.current.unitPriceCop * 3)
  })

  it('handles legacy COP precio field', () => {
    const product = { precio: '$ 1.000.000' }
    const { result } = renderHook(() => useProductPrice(product))
    expect(result.current.unitPriceCop).toBe(1000000)
    expect(result.current.displayPrice).toContain('1.000.000')
  })
})

describe('normalizeSelectedVariations', () => {
  it('handles null and empty input', () => {
    expect(normalizeSelectedVariations(null)).toEqual([])
    expect(normalizeSelectedVariations(undefined)).toEqual([])
    expect(normalizeSelectedVariations([])).toEqual([])
  })

  it('handles single object option', () => {
    const single = { label: 'PNP', priceModifier: 0 }
    expect(normalizeSelectedVariations(single)).toEqual([single])
  })

  it('handles map of variations', () => {
    const map = {
      rx: { id: 'elrs', label: 'ELRS' },
      color: { id: 'blue', label: 'Blue' }
    }
    expect(normalizeSelectedVariations(map)).toEqual([
      { id: 'elrs', label: 'ELRS' },
      { id: 'blue', label: 'Blue' }
    ])
  })
})
