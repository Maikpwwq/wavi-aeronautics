import { describe, it, expect, vi, beforeEach } from 'vitest'
import { markListingAsSold } from '@/services/usedProductsService'
import * as firestoreModule from 'firebase/firestore'

vi.mock('@/firebase/firebaseClient', () => ({
  firestore: {},
  storage: {}
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn().mockImplementation((db, col, id) => ({ id, path: `${col}/${id}` })),
  setDoc: vi.fn().mockResolvedValue(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({}) }),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  updateDoc: vi.fn().mockResolvedValue(),
  deleteDoc: vi.fn().mockResolvedValue(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn().mockReturnValue('MOCK_TIMESTAMP'),
  Timestamp: { now: vi.fn().mockReturnValue('MOCK_TIMESTAMP') }
}))

describe('Race Conditions & Concurrency Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(firestoreModule.updateDoc).mockResolvedValue()
  })

  it('Race Condition Test: Handles simultaneous markListingAsSold calls deterministically', async () => {
    let updateCount = 0
    vi.mocked(firestoreModule.updateDoc).mockImplementation(async () => {
      updateCount++
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    const listingId = 'used-drone-item-999'
    const results = await Promise.allSettled([
      markListingAsSold(listingId),
      markListingAsSold(listingId)
    ])

    expect(results[0].status).toBe('fulfilled')
    expect(results[1].status).toBe('fulfilled')
    expect(updateCount).toBe(2)
  })

  it('Race Condition Test: Handles high volume (50 simultaneous requests) without race crashes', async () => {
    vi.mocked(firestoreModule.updateDoc).mockResolvedValue()

    const requests = Array.from({ length: 50 }, (_, i) => markListingAsSold(`item-${i}`))
    const results = await Promise.allSettled(requests)

    const fulfilled = results.filter(r => r.status === 'fulfilled')
    expect(fulfilled.length).toBe(50)
  })
})
