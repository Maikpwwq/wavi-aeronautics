import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createUsedListing,
  fetchListingsByCategory,
  fetchUserListings,
  markListingAsSold,
  renewListingDuration,
  updateListingStatusByAdmin,
  deleteUsedListing
} from '../usedProductsService'
import * as firestoreModule from 'firebase/firestore'
import * as storageModule from 'firebase/storage'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {},
  storage: {}
}))

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore')
  return {
    ...actual,
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP'),
    Timestamp: {
      fromMillis: (ms) => ({ toMillis: () => ms, seconds: Math.floor(ms / 1000) })
    }
  }
})

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn().mockResolvedValue(true),
  getDownloadURL: vi.fn().mockResolvedValue('https://storage.googleapis.com/mock_image.jpg'),
  deleteObject: vi.fn().mockResolvedValue(true)
}))

describe('usedProductsService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createUsedListing', () => {
    it('throws error if user is not authenticated (missing sellerId)', async () => {
      await expect(
        createUsedListing({ title: 'Drone', category: 'dronesHD', condition: 'good', description: 'desc', priceCop: 100 }, [])
      ).rejects.toThrow('Usuario no autenticado.')
    })

    it('throws error if photos count is less than 2', async () => {
      const dummyFile = new File([''], 'photo1.jpg', { type: 'image/jpeg' })
      await expect(
        createUsedListing(
          { sellerId: 'user1', title: 'Drone', category: 'dronesHD', condition: 'good', description: 'desc', priceCop: 100 },
          [dummyFile]
        )
      ).rejects.toThrow(/Debes adjuntar al menos 2 fotos/)
    })

    it('creates listing and uploads images successfully', async () => {
      firestoreModule.setDoc.mockResolvedValueOnce(true)

      const files = [
        new File([''], 'photo1.jpg', { type: 'image/jpeg' }),
        new File([''], 'photo2.jpg', { type: 'image/jpeg' })
      ]

      const listingData = {
        sellerId: 'user123',
        sellerName: 'Carlos',
        sellerEmail: 'carlos@wavi.co',
        contactPhone: '3001234567',
        title: 'DJI Avata HD',
        category: 'dronesHD',
        brand: 'DJI',
        condition: 'like_new',
        description: 'Excelente estado con estuche',
        priceCop: 3500000
      }

      const result = await createUsedListing(listingData, files)

      expect(result.id).toBeDefined()
      expect(result.title).toBe('DJI Avata HD')
      expect(result.status).toBe('pending')
      expect(result.priceCop).toBe(3500000)
      expect(result.images).toHaveLength(2)
      expect(firestoreModule.setDoc).toHaveBeenCalledTimes(1)
    })
  })

  describe('fetchListingsByCategory', () => {
    it('returns empty array on firestore error', async () => {
      firestoreModule.getDocs.mockRejectedValueOnce(new Error('Firestore error'))
      const results = await fetchListingsByCategory('dronesHD')
      expect(results).toEqual([])
    })

    it('filters out expired items client side', async () => {
      const mockDocs = [
        {
          id: 'item1',
          data: () => ({ title: 'Active Item', expiresAt: { toMillis: () => Date.now() + 100000 } })
        },
        {
          id: 'item2',
          data: () => ({ title: 'Expired Item', expiresAt: { toMillis: () => Date.now() - 100000 } })
        }
      ]
      firestoreModule.getDocs.mockResolvedValueOnce({ docs: mockDocs })

      const results = await fetchListingsByCategory('dronesHD')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Active Item')
    })
  })

  describe('markListingAsSold', () => {
    it('updates listing status to sold', async () => {
      firestoreModule.updateDoc.mockResolvedValueOnce(true)
      const res = await markListingAsSold('listing123')
      expect(res).toEqual({ success: true })
      expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ status: 'sold' })
      )
    })
  })

  describe('renewListingDuration', () => {
    it('renews expiration date and restores status to pending', async () => {
      firestoreModule.updateDoc.mockResolvedValueOnce(true)
      const res = await renewListingDuration('listing123')
      expect(res).toEqual({ success: true })
      expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ status: 'pending' })
      )
    })
  })

  describe('updateListingStatusByAdmin', () => {
    it('updates status to verified or disabled with rejection reason', async () => {
      firestoreModule.updateDoc.mockResolvedValueOnce(true)
      const res = await updateListingStatusByAdmin('listing123', 'disabled', 'Violación de políticas')
      expect(res).toEqual({ success: true })
      expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ status: 'disabled', rejectionReason: 'Violación de políticas' })
      )
    })
  })

  describe('deleteUsedListing', () => {
    it('deletes document and images', async () => {
      firestoreModule.deleteDoc.mockResolvedValueOnce(true)
      const imageUrls = ['https://storage.googleapis.com/img1.jpg']
      const res = await deleteUsedListing('listing123', imageUrls)
      expect(res).toEqual({ success: true })
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(1)
      expect(storageModule.deleteObject).toHaveBeenCalledTimes(1)
    })
  })
})
