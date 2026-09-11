import { describe, it, expect, vi } from 'vitest'
import { searchProducts } from '@/services/FirebaseSearchProducts'

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
      name: 'Drone Cinewhoop CineLog35',
      brand: 'geprc',
      category: 'dronesHD',
      price: 400,
      availability: false,
    },
  ]

  it('returns empty array for empty search term', async () => {
    const results = await searchProducts('', sampleProducts)
    expect(results).toEqual([])
  })

  it('finds TBS products when searching "tbs" via brand alias and name matching', async () => {
    const results = await searchProducts('tbs', sampleProducts)
    expect(results.length).toBe(3)
    const ids = results.map((r) => r.productID)
    expect(ids).toContain('rc-1')
    expect(ids).toContain('rc-2')
    expect(ids).toContain('legacy-rx')
  })

  it('finds products when searching by full brand name "team blacksheep"', async () => {
    const results = await searchProducts('team blacksheep', sampleProducts)
    expect(results.length).toBe(3)
  })

  it('correctly handles legacy products with titulo and marca properties', async () => {
    const results = await searchProducts('Crossfire', sampleProducts)
    expect(results.length).toBe(1)
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
