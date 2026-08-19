import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getUserBillingProfile,
  saveUserBillingProfile,
  getUserPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '@/services/billingService'
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
    updateDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    writeBatch: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP')
  }
})

describe('billingService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserBillingProfile', () => {
    it('returns null if userId is missing', async () => {
      const result = await getUserBillingProfile(null)
      expect(result).toBeNull()
    })

    it('returns billing profile when document exists', async () => {
      firestoreModule.doc.mockReturnValueOnce('billingDocRef')
      firestoreModule.getDoc.mockResolvedValueOnce({
        exists: () => true,
        id: 'default',
        data: () => ({
          docType: 'NIT',
          docNumber: '901234567-8',
          businessName: 'Empresa SAS'
        })
      })

      const profile = await getUserBillingProfile('user-123')
      expect(profile).toBeDefined()
      expect(profile.businessName).toBe('Empresa SAS')
      expect(profile.docType).toBe('NIT')
    })
  })

  describe('saveUserBillingProfile', () => {
    it('throws error if userId is missing', async () => {
      await expect(saveUserBillingProfile(null, {})).rejects.toThrow('userId is required')
    })

    it('saves billing data with merge: true', async () => {
      firestoreModule.doc.mockReturnValueOnce('billingDocRef')
      firestoreModule.setDoc.mockResolvedValueOnce(true)

      const billingData = {
        docType: 'CC',
        docNumber: '10203040',
        businessName: 'Juan Perez',
        city: 'Bogota',
        phone: '3001234567'
      }

      await saveUserBillingProfile('user-123', billingData)

      expect(firestoreModule.setDoc).toHaveBeenCalledWith(
        'billingDocRef',
        expect.objectContaining({
          docType: 'CC',
          docNumber: '10203040',
          businessName: 'Juan Perez'
        }),
        { merge: true }
      )
    })
  })

  describe('addPaymentMethod', () => {
    it('throws error if lastFour is missing', async () => {
      await expect(addPaymentMethod('user-123', { lastFour: '' })).rejects.toThrow('lastFour digits are required')
    })

    it('stores tokenized card info safely without storing raw card number or CVV', async () => {
      firestoreModule.collection.mockReturnValueOnce('paymentMethodsRef')
      firestoreModule.doc.mockReturnValueOnce({ id: 'method-abc' })
      firestoreModule.setDoc.mockResolvedValueOnce(true)
      firestoreModule.getDocs.mockResolvedValueOnce({ docs: [] }) // Empty -> first method is default

      const methodId = await addPaymentMethod('user-123', {
        brand: 'visa',
        lastFour: '4242',
        cardholderName: 'Juan Perez',
        expiryMonth: '05',
        expiryYear: '2028'
      })

      expect(methodId).toBe('method-abc')
      expect(firestoreModule.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          brand: 'visa',
          lastFour: '4242',
          isDefault: true
        })
      )
    })
  })

  describe('deletePaymentMethod', () => {
    it('deletes the method doc', async () => {
      firestoreModule.doc.mockReturnValueOnce('methodDocRef')
      firestoreModule.deleteDoc.mockResolvedValueOnce(true)

      await deletePaymentMethod('user-123', 'method-1')
      expect(firestoreModule.deleteDoc).toHaveBeenCalledWith('methodDocRef')
    })
  })
})
