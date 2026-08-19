import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchUserFavorites,
  addFavorite,
  removeFavorite,
  isProductFavorite,
  subscribeUserFavorites
} from '@/services/favoritesService'
import * as firestoreModule from 'firebase/firestore'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {}
}))

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore')
  return {
    ...actual,
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP')
  }
})

describe('favoritesService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchUserFavorites', () => {
    it('returns empty array when userId is not provided', async () => {
      const result = await fetchUserFavorites(null)
      expect(result).toEqual([])
    })

    it('fetches and maps favorites when userId is provided', async () => {
      firestoreModule.getDocs.mockResolvedValueOnce({
        docs: [
          {
            id: 'prod-1',
            data: () => ({ name: 'Drone V1', price: 500, productId: 'prod-1' })
          },
          {
            id: 'prod-2',
            data: () => ({ name: 'VTX Unit', price: 120, productId: 'prod-2' })
          }
        ]
      })

      const result = await fetchUserFavorites('user-123')
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Drone V1')
      expect(result[1].name).toBe('VTX Unit')
    })

    it('returns empty array on error gracefully without throwing', async () => {
      firestoreModule.getDocs.mockRejectedValueOnce(new Error('Network error'))
      const result = await fetchUserFavorites('user-123')
      expect(result).toEqual([])
    })
  })

  describe('addFavorite', () => {
    it('throws error if userId or product is missing', async () => {
      await expect(addFavorite(null, { productID: 'p1' })).rejects.toThrow('userId and product are required')
      await expect(addFavorite('user-123', null)).rejects.toThrow('userId and product are required')
    })

    it('throws error if product lacks id or productID', async () => {
      await expect(addFavorite('user-123', { name: 'No ID' })).rejects.toThrow('Product must have an id or productID')
    })

    it('calls setDoc with normalized fields', async () => {
      firestoreModule.doc.mockReturnValueOnce('favDocRef')
      firestoreModule.setDoc.mockResolvedValueOnce(true)

      const product = {
        productID: 'p-100',
        name: 'Mavic Air',
        brand: 'DJI',
        category: 'dronesHD',
        price: 800,
        images: ['https://example.com/img1.jpg']
      }

      await addFavorite('user-123', product)

      expect(firestoreModule.setDoc).toHaveBeenCalledWith(
        'favDocRef',
        expect.objectContaining({
          productId: 'p-100',
          name: 'Mavic Air',
          brand: 'DJI',
          category: 'dronesHD',
          price: 800,
          firstImage: 'https://example.com/img1.jpg',
          availability: true
        })
      )
    })
  })

  describe('removeFavorite', () => {
    it('calls deleteDoc on the favorite doc reference', async () => {
      firestoreModule.doc.mockReturnValueOnce('favDocRef')
      firestoreModule.deleteDoc.mockResolvedValueOnce(true)

      await removeFavorite('user-123', 'p-100')
      expect(firestoreModule.deleteDoc).toHaveBeenCalledWith('favDocRef')
    })

    it('does not throw when userId or productId is empty', async () => {
      await removeFavorite(null, 'p-100')
      expect(firestoreModule.deleteDoc).not.toHaveBeenCalled()
    })
  })

  describe('isProductFavorite', () => {
    it('returns true if document exists', async () => {
      firestoreModule.doc.mockReturnValueOnce('favDocRef')
      firestoreModule.getDoc.mockResolvedValueOnce({
        exists: () => true
      })

      const isFav = await isProductFavorite('user-123', 'p-100')
      expect(isFav).toBe(true)
    })

    it('returns false if document does not exist', async () => {
      firestoreModule.doc.mockReturnValueOnce('favDocRef')
      firestoreModule.getDoc.mockResolvedValueOnce({
        exists: () => false
      })

      const isFav = await isProductFavorite('user-123', 'p-100')
      expect(isFav).toBe(false)
    })
  })

  describe('subscribeUserFavorites', () => {
    it('sets up onSnapshot listener and passes mapped items to callback', () => {
      const mockCallback = vi.fn()
      firestoreModule.onSnapshot.mockImplementationOnce((query, next) => {
        next({
          docs: [
            { id: 'p1', data: () => ({ name: 'Goggles V2' }) }
          ]
        })
        return vi.fn()
      })

      const unsubscribe = subscribeUserFavorites('user-123', mockCallback)
      expect(mockCallback).toHaveBeenCalledWith([{ id: 'p1', name: 'Goggles V2' }])
      expect(typeof unsubscribe).toBe('function')
    })
  })
})
