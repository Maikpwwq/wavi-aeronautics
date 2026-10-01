import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  CATEGORY_STORAGE_KEYS,
  getCategoryCacheKey,
  getCategoryCache,
  setCategoryCache,
  clearCategoryCache,
  fetchCategoryProducts,
  createCategoryProduct,
  updateCategoryProduct,
  deleteCategoryProduct
} from '@/services/categoryCrudService'
import * as firestoreModule from 'firebase/firestore'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {}
}))

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore')
  return {
    ...actual,
    doc: vi.fn((_fs, ...pathSegments) => ({
      path: pathSegments.join('/'),
      id: pathSegments[pathSegments.length - 1]
    })),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    collectionGroup: vi.fn((_fs, collectionId) => ({ collectionId })),
    query: vi.fn((...args) => ({ queryArgs: args })),
    where: vi.fn((field, op, val) => ({ field, op, val })),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP')
  }
})
describe('categoryCrudService Unit Tests', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DOLARTOCOP

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    process.env.NEXT_PUBLIC_DOLARTOCOP = '4000'
  })

  afterEach(() => {
    sessionStorage.clear()
    process.env.NEXT_PUBLIC_DOLARTOCOP = originalEnv
  })

  describe('Cache Key Mapping & SessionStorage Helpers', () => {
    it('correctly maps category slugs to sessionStorage keys', () => {
      expect(getCategoryCacheKey('baterias')).toBe('Productos_Baterias')
      expect(getCategoryCacheKey('accesorios')).toBe('Productos_Baterias')
      expect(getCategoryCacheKey('helices')).toBe('Productos_Helices')
      expect(getCategoryCacheKey('frames')).toBe('Productos_Frames')
      expect(getCategoryCacheKey('chasis')).toBe('Productos_Frames')
      expect(getCategoryCacheKey('googles')).toBe('Productos_Googles')
    })

    it('sets, retrieves, and clears category cache in sessionStorage', () => {
      const mockItems = [{ productID: 'H-1', name: 'Gemfan 51466' }]
      setCategoryCache('helices', mockItems)

      const retrieved = getCategoryCache('helices')
      expect(retrieved).toEqual(mockItems)

      clearCategoryCache('helices')
      expect(getCategoryCache('helices')).toBeNull()
    })
  })

  describe('fetchCategoryProducts', () => {
    it('returns empty array when category is empty or missing', async () => {
      const res = await fetchCategoryProducts('')
      expect(res).toEqual([])
    })

    it('returns cached products from sessionStorage without Firestore read', async () => {
      const cached = [{ productID: 'BAT-1', name: 'Tattu R-Line 6S 1400mAh', price: 100 }]
      setCategoryCache('baterias', cached)

      const res = await fetchCategoryProducts('baterias')

      expect(res).toHaveLength(1)
      expect(res[0].productID).toBe('BAT-1')
      expect(res[0].priceUSD).toBe(100)
      expect(firestoreModule.getDocs).not.toHaveBeenCalled()
    })

    it('fetches from Firestore when not in sessionStorage and updates cache', async () => {
      firestoreModule.getDocs.mockResolvedValueOnce({
        docs: [
          {
            id: 'HEL-1',
            data: () => ({ productID: 'HEL-1', name: 'HQProp 5x4.3x3', category: 'helices', price: 4 })
          }
        ]
      })

      const res = await fetchCategoryProducts('helices')

      expect(firestoreModule.getDocs).toHaveBeenCalledTimes(1)
      expect(res).toHaveLength(1)
      expect(res[0].productID).toBe('HEL-1')

      // Verify cached in sessionStorage
      const cached = getCategoryCache('helices')
      expect(cached).toHaveLength(1)
      expect(cached[0].productID).toBe('HEL-1')
    })

    it('bypasses cache when forceRefresh is true', async () => {
      setCategoryCache('frames', [{ productID: 'OLD-FRAME', name: 'Old Frame' }])

      firestoreModule.getDocs.mockResolvedValueOnce({
        docs: [
          {
            id: 'FRM-1',
            data: () => ({ productID: 'FRM-1', name: 'GEPRC Mark 5 Frame', category: 'frames', price: 95 })
          }
        ]
      })

      const res = await fetchCategoryProducts('frames', { forceRefresh: true })

      expect(firestoreModule.getDocs).toHaveBeenCalledTimes(1)
      expect(res[0].productID).toBe('FRM-1')
    })
  })

  describe('createCategoryProduct', () => {
    it('throws error when productID, category, or brand is missing', async () => {
      await expect(createCategoryProduct({ name: 'Incomplete' })).rejects.toThrow()
      await expect(createCategoryProduct({ productID: '123' })).rejects.toThrow()
      await expect(createCategoryProduct({ productID: '123', category: 'helices' })).rejects.toThrow()
    })

    it('writes to Firestore at products/{category}/brands/{brand}/items/{productID} and updates cache', async () => {
      setCategoryCache('helices', [{ productID: 'H-OLD', name: 'Old Prop' }])

      const newProduct = {
        productID: 'H-NEW',
        name: 'Ethix S3 Watermelon',
        category: 'helices',
        brand: 'Ethix',
        price: 4.5
      }

      const created = await createCategoryProduct(newProduct)

      expect(created.id).toBe('H-NEW')
      expect(firestoreModule.setDoc).toHaveBeenCalledTimes(1)

      // Verify cache contains the new product
      const updatedCache = getCategoryCache('helices')
      expect(updatedCache).toHaveLength(2)
      expect(updatedCache[0].productID).toBe('H-NEW')
    })
  })

  describe('updateCategoryProduct', () => {
    it('throws error if productID is not provided', async () => {
      await expect(updateCategoryProduct('', { name: 'New' })).rejects.toThrow()
    })

    it('updates Firestore document via direct path when category and brand provided and updates cache', async () => {
      firestoreModule.getDoc.mockResolvedValueOnce({
        exists: () => true
      })

      setCategoryCache('frames', [{ productID: 'FRM-5', name: 'Mark 4', brand: 'GEPRC' }])

      await updateCategoryProduct('FRM-5', { name: 'Mark 5 Pro' }, 'frames', 'GEPRC')

      expect(firestoreModule.updateDoc).toHaveBeenCalledTimes(1)

      const updatedCache = getCategoryCache('frames')
      expect(updatedCache[0].name).toBe('Mark 5 Pro')
    })
  })

  describe('deleteCategoryProduct', () => {
    it('throws error if productID is missing', async () => {
      await expect(deleteCategoryProduct('')).rejects.toThrow()
    })

    it('deletes document from Firestore and removes from sessionStorage cache', async () => {
      firestoreModule.getDoc.mockResolvedValueOnce({
        exists: () => true
      })

      setCategoryCache('helices', [
        { productID: 'DEL-1', name: 'To Delete' },
        { productID: 'KEEP-1', name: 'To Keep' }
      ])

      const res = await deleteCategoryProduct('DEL-1', 'helices', 'Gemfan')

      expect(res.success).toBe(true)
      expect(res.productID).toBe('DEL-1')
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(1)

      const updatedCache = getCategoryCache('helices')
      expect(updatedCache).toHaveLength(1)
      expect(updatedCache[0].productID).toBe('KEEP-1')
    })
  })
})
