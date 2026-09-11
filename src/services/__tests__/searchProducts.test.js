import { describe, it, expect, vi } from 'vitest'
import { searchProducts, searchByBrand } from '@/services/FirebaseSearchProducts'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {},
  auth: {},
  firebaseApp: {}
}))

describe('FirebaseSearchProducts Unit Tests', () => {
  const sampleProducts = [
    {
      productID: 'rc-1',
      name: 'Radio controlador TBS Tango 2 Pro',
      brand: 'team-blacksheep',
      category: 'radioControl',
      price: 250,
      availability: true,
      images: ['https://example.com/tango.jpg'],
    },
    {
      productID: 'rc-2',
      name: 'Radio controlador TBS Mambo',
      brand: 'team-blacksheep',
      category: 'radioControl',
      price: 230,
      availability: true,
      images: ['https://example.com/mambo.jpg'],
    },
    {
      id: 'legacy-rx',
      titulo: 'Receptor Crossfire Nano RX',
      marca: 'TEAM BLACKSHEEP',
      categoria: 'receptors',
      precio: '$ 150.000',
      availability: true,
    },
    {
      productID: 'drone-1',
      name: 'Drone Cinewhoop GEPRC DarkStar20 HD Wasp',
      brand: 'geprc',
      category: 'dronesHD',
      price: 400,
      availability: false,
      description: 'Chasis cinewhoop compatible con receptor TBS Crossfire Nano y ELRS 2.4G.',
    },
  ]

  it('returns empty array for empty search term', async () => {
    const results = await searchProducts('', sampleProducts)
    expect(results).toEqual([])
  })

  it('finds TBS products when searching "tbs" via brand alias and name matching, excluding competitor description mentions', async () => {
    const results = await searchProducts('tbs', sampleProducts)
    expect(results.length).toBe(3)
    const ids = results.map((r) => r.productID)
    expect(ids).toContain('rc-1')
    expect(ids).toContain('rc-2')
    expect(ids).toContain('legacy-rx')
    expect(ids).not.toContain('drone-1')
  })

  it('strictly filters by brand with searchByBrand, never returning competitor products', async () => {
    const results = await searchByBrand('tbs', sampleProducts)
    expect(results.length).toBe(3)
    const ids = results.map((r) => r.productID)
    expect(ids).toContain('rc-1')
    expect(ids).toContain('rc-2')
    expect(ids).toContain('legacy-rx')
    expect(ids).not.toContain('drone-1')

    // Every returned product brand must match TBS / Team BlackSheep
    results.forEach((p) => {
      expect(['team-blacksheep', 'TEAM BLACKSHEEP']).toContain(p.brand)
    })
  })

  it('finds GEPRC drone when searching specifically by brand "geprc"', async () => {
    const results = await searchByBrand('geprc', sampleProducts)
    expect(results.length).toBe(1)
    expect(results[0].productID).toBe('drone-1')
    expect(results[0].brand).toBe('geprc')
  })

  it('finds products when searching by full brand name "team blacksheep"', async () => {
    const results = await searchProducts('team blacksheep', sampleProducts)
    expect(results.length).toBe(3)
  })

  it('correctly handles legacy products with titulo and marca properties', async () => {
    const results = await searchProducts('Crossfire', sampleProducts)
    // Crossfire appears in legacy-rx title and in drone-1 description
    // legacy-rx must be ranked first because it is a title match
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].productID).toBe('legacy-rx')
    expect(results[0].name).toBe('Receptor Crossfire Nano RX')
    expect(results[0].brand).toBe('TEAM BLACKSHEEP')
  })

  it('correctly normalizes out of stock availability flag', async () => {
    const results = await searchProducts('geprc', sampleProducts)
    expect(results.length).toBe(1)
    expect(results[0].isAgotado).toBe(true)
  })
})
