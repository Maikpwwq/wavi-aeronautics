import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBannerProducts } from '../useBannerProducts'
import { BANNER_CATEGORIES } from '@/config/categories'

describe('useBannerProducts', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('hydrates with category fallback images when sessionStorage is empty', () => {
    const { result } = renderHook(() => useBannerProducts())

    expect(result.current.isHydrated).toBe(true)
    expect(result.current.bannerData.length).toBe(BANNER_CATEGORIES.length)

    const first = result.current.bannerData[0]
    expect(first.category.id).toBe(BANNER_CATEGORIES[0].id)
    expect(first.products.length).toBe(1)
    expect(first.products[0].firstImage).toBe(BANNER_CATEGORIES[0].coverImage)
  })

  it('reads and parses products from sessionStorage correctly', () => {
    const mockProducts = [
      { productID: 'hd-1', name: 'Nazgul5 V3 HD', images: ['https://example.com/nazgul.png'] },
      { productID: 'hd-2', name: 'Apex 5 HD', images: ['https://example.com/apex.png'] },
    ]

    sessionStorage.setItem('Productos_DronesHD', JSON.stringify(mockProducts))

    const { result } = renderHook(() => useBannerProducts())

    expect(result.current.isHydrated).toBe(true)
    const dronesHDCat = result.current.bannerData.find((d) => d.category.id === 'dronesHD')
    expect(dronesHDCat).toBeDefined()
    expect(dronesHDCat.products.length).toBe(2)
    expect(dronesHDCat.products[0].name).toBe('Nazgul5 V3 HD')
    expect(dronesHDCat.products[0].firstImage).toBe('https://example.com/nazgul.png')
    expect(dronesHDCat.products[1].name).toBe('Apex 5 HD')
  })

  it('handles corrupted sessionStorage entries gracefully', () => {
    sessionStorage.setItem('Productos_DronesHD', '{invalid-json')

    const { result } = renderHook(() => useBannerProducts())

    expect(result.current.isHydrated).toBe(true)
    const dronesHDCat = result.current.bannerData.find((d) => d.category.id === 'dronesHD')
    expect(dronesHDCat).toBeDefined()
    // Falls back to cover image
    expect(dronesHDCat.products[0].firstImage).toBe(dronesHDCat.category.coverImage)
  })

  it('caps products per category at 4', () => {
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      productID: `prod-${i}`,
      name: `Product ${i}`,
      images: [`https://example.com/img-${i}.png`],
    }))

    sessionStorage.setItem('Productos_DronesHD', JSON.stringify(mockProducts))

    const { result } = renderHook(() => useBannerProducts())

    const dronesHDCat = result.current.bannerData.find((d) => d.category.id === 'dronesHD')
    expect(dronesHDCat.products.length).toBe(4)
  })

  it('filters out products without images', () => {
    const mockProducts = [
      { productID: 'p1', name: 'No Image Product', images: [] },
      { productID: 'p2', name: 'With Image', images: ['https://example.com/valid.png'] },
    ]

    sessionStorage.setItem('Productos_DronesHD', JSON.stringify(mockProducts))

    const { result } = renderHook(() => useBannerProducts())

    const dronesHDCat = result.current.bannerData.find((d) => d.category.id === 'dronesHD')
    expect(dronesHDCat.products.length).toBe(1)
    expect(dronesHDCat.products[0].productID).toBe('p2')
  })

  it('re-hydrates on storage event for sessionStorage', () => {
    const { result } = renderHook(() => useBannerProducts())

    expect(result.current.bannerData.find((d) => d.category.id === 'dronesHD').products[0].firstImage)
      .toBe(BANNER_CATEGORIES.find((c) => c.id === 'dronesHD').coverImage)

    act(() => {
      sessionStorage.setItem(
        'Productos_DronesHD',
        JSON.stringify([{ productID: 'hd-new', name: 'New Drone', images: ['https://example.com/new.png'] }])
      )
      window.dispatchEvent(new StorageEvent('storage', { storageArea: sessionStorage }))
    })

    const updated = result.current.bannerData.find((d) => d.category.id === 'dronesHD')
    expect(updated.products[0].productID).toBe('hd-new')
    expect(updated.products[0].firstImage).toBe('https://example.com/new.png')
  })
})
