import { describe, it, expect, vi } from 'vitest'
import { getCatalogBrands, getFallbackBrands } from '@/services/brandsService'
import { STORE_BRANDS } from '@/utilities/brandsConfig'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {},
  auth: {},
  firebaseApp: {},
}))

vi.mock('@/services/FirebaseSearchProducts', () => ({
  fetchAllStoreProducts: vi.fn(),
}))

describe('brandsService Unit Tests', () => {
  const sampleProducts = [
    {
      productID: 'p-1',
      name: 'BetaFPV Meteor65 Pro',
      brand: 'betafpv',
      category: 'dronesKit',
    },
    {
      productID: 'p-2',
      name: 'BetaFPV Pavo20',
      brand: 'betafpv',
      category: 'dronesRC',
    },
    {
      productID: 'p-3',
      name: 'TBS Tango 2 Pro',
      brand: 'team-blacksheep',
      category: 'radioControl',
    },
    {
      productID: 'p-4',
      name: 'TBS Crossfire Nano TX',
      brand: 'tbs',
      category: 'transmisors',
    },
    {
      productID: 'p-5',
      name: 'EMAX Tinyhawk III Plus',
      brand: 'emax-usa',
      category: 'dronesKit',
    },
    {
      productID: 'p-6',
      name: 'iFlight Nazgul5 V3',
      brand: 'iflight-rc',
      category: 'dronesRC',
    },
    {
      productID: 'p-7',
      name: 'Generic Antenna',
      brand: 'default',
      category: 'accesorios',
    },
    {
      productID: 'p-8',
      name: 'New Custom Manufacturer Drone',
      brand: 'ApexFlight',
      category: 'dronesRC',
    },
  ]

  it('getFallbackBrands returns all STORE_BRANDS sorted alphabetically by name', () => {
    const fallback = getFallbackBrands()
    expect(fallback.length).toBe(STORE_BRANDS.length)
    for (let i = 0; i < fallback.length - 1; i++) {
      expect(
        fallback[i].name.localeCompare(fallback[i + 1].name, 'es', { sensitivity: 'base' })
      ).toBeLessThanOrEqual(0)
    }
  })

  it('getCatalogBrands deduplicates aliases and accurately counts product occurrences', async () => {
    const brands = await getCatalogBrands(sampleProducts)

    // TBS should be deduplicated: p-3 (team-blacksheep) + p-4 (tbs) = 2 items
    const tbs = brands.find((b) => b.id === 'tbs')
    expect(tbs).toBeDefined()
    expect(tbs.itemCount).toBe(2)

    // BetaFPV: p-1 + p-2 = 2 items
    const betafpv = brands.find((b) => b.id === 'betafpv')
    expect(betafpv).toBeDefined()
    expect(betafpv.itemCount).toBe(2)

    // EMAX: p-5 (emax-usa) = 1 item
    const emax = brands.find((b) => b.id === 'emax')
    expect(emax).toBeDefined()
    expect(emax.itemCount).toBe(1)

    // iFlight: p-6 (iflight-rc) = 1 item
    const iflight = brands.find((b) => b.id === 'iflight')
    expect(iflight).toBeDefined()
    expect(iflight.itemCount).toBe(1)

    // Untracked brand ApexFlight was dynamically added
    const apex = brands.find((b) => b.id === 'apexflight')
    expect(apex).toBeDefined()
    expect(apex.name).toBe('ApexFlight')
    expect(apex.itemCount).toBe(1)

    // 'default' should NOT create a brand
    const defaultBrand = brands.find((b) => b.id === 'default')
    expect(defaultBrand).toBeUndefined()
  })

  it('getCatalogBrands results are sorted alphabetically by display name', async () => {
    const brands = await getCatalogBrands(sampleProducts)
    for (let i = 0; i < brands.length - 1; i++) {
      expect(
        brands[i].name.localeCompare(brands[i + 1].name, 'es', { sensitivity: 'base' })
      ).toBeLessThanOrEqual(0)
    }
  })

  it('getCatalogBrands fetches all products when localProducts is not provided', async () => {
    const { fetchAllStoreProducts } = await import('@/services/FirebaseSearchProducts')
    fetchAllStoreProducts.mockResolvedValueOnce(sampleProducts)

    const brands = await getCatalogBrands()
    expect(fetchAllStoreProducts).toHaveBeenCalled()
    const tbs = brands.find((b) => b.id === 'tbs')
    expect(tbs.itemCount).toBe(2)
  })

  it('getCatalogBrands handles fetch failure gracefully by returning base catalog', async () => {
    const { fetchAllStoreProducts } = await import('@/services/FirebaseSearchProducts')
    fetchAllStoreProducts.mockRejectedValueOnce(new Error('Network error'))

    const brands = await getCatalogBrands()
    expect(brands.length).toBeGreaterThanOrEqual(STORE_BRANDS.length)
    expect(brands.every((b) => b.itemCount === 0)).toBe(true)
  })
})
