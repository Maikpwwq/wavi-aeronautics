import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing'
import fs from 'fs'
import path from 'path'

const PROJECT_ID = 'wavi-aeronautics-test-firestore'
let testEnv

describe('Firestore Security Rules Unit Tests', () => {
  beforeAll(async () => {
    const rulesPath = path.resolve(import.meta.dirname, '../../../firestore.rules')
    const rules = fs.readFileSync(rulesPath, 'utf8')

    try {
      testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
          rules,
          host: '127.0.0.1',
          port: 8080
        }
      })
    } catch (e) {
      console.warn('[FirestoreRulesTest] Firebase Firestore emulator is not running on port 8080. Rules tests will be skipped.')
    }
  })

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup()
    }
  })

  beforeEach(async (context) => {
    if (!testEnv) {
      context.skip()
      return
    }
    await testEnv.clearFirestore()
  })

  describe('usedProducts Collection Security Rules', () => {
    it('allows public unauthenticated users to read pending or verified listings', async () => {
      // Setup document as admin
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('usedProducts').doc('item1').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'pending',
          priceCop: 500000
        })
      })

      const unauthDb = testEnv.unauthenticatedContext().firestore()
      await assertSucceeds(unauthDb.collection('usedProducts').doc('item1').get())
    })

    it('denies unauthenticated users from reading disabled listings', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('usedProducts').doc('itemDisabled').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'disabled',
          priceCop: 500000
        })
      })

      const unauthDb = testEnv.unauthenticatedContext().firestore()
      await assertFails(unauthDb.collection('usedProducts').doc('itemDisabled').get())
    })

    it('allows owner to read their own disabled or sold listing', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('usedProducts').doc('itemDisabled').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'disabled',
          priceCop: 500000
        })
      })

      const ownerDb = testEnv.authenticatedContext('userA').firestore()
      await assertSucceeds(ownerDb.collection('usedProducts').doc('itemDisabled').get())
    })

    it('denies unauthenticated user from creating a listing', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore()
      await assertFails(
        unauthDb.collection('usedProducts').doc('new1').set({
          sellerId: 'userA',
          status: 'pending',
          priceCop: 100000,
          images: ['https://example.com/img.jpg']
        })
      )
    })

    it('allows authenticated user to create a listing bound to their sellerId with pending status', async () => {
      const userDb = testEnv.authenticatedContext('userA').firestore()
      await assertSucceeds(
        userDb.collection('usedProducts').doc('new1').set({
          sellerId: 'userA',
          status: 'pending',
          priceCop: 100000,
          images: ['https://example.com/img.jpg']
        })
      )
    })

    it('denies authenticated user from creating a listing directly with status verified', async () => {
      const userDb = testEnv.authenticatedContext('userA').firestore()
      await assertFails(
        userDb.collection('usedProducts').doc('new1').set({
          sellerId: 'userA',
          status: 'verified',
          priceCop: 100000,
          images: ['https://example.com/img.jpg']
        })
      )
    })

    it('allows owner to mark listing as sold', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('usedProducts').doc('item1').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'pending',
          priceCop: 500000,
          images: []
        })
      })

      const ownerDb = testEnv.authenticatedContext('userA').firestore()
      await assertSucceeds(
        ownerDb.collection('usedProducts').doc('item1').update({
          status: 'sold'
        })
      )
    })

    it('denies owner from directly verifying their own listing', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('usedProducts').doc('item1').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'pending',
          priceCop: 500000,
          images: []
        })
      })

      const ownerDb = testEnv.authenticatedContext('userA').firestore()
      await assertFails(
        ownerDb.collection('usedProducts').doc('item1').update({
          status: 'verified'
        })
      )
    })

    it('allows admin user to verify any listing', async () => {
      // Create admin user record in users collection
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore()
        await db.collection('users').doc('adminUser').set({
          role: 'admin'
        })
        await db.collection('usedProducts').doc('item1').set({
          sellerId: 'userA',
          title: 'Drone FPV',
          status: 'pending',
          priceCop: 500000,
          images: []
        })
      })

      const adminDb = testEnv.authenticatedContext('adminUser').firestore()
      await assertSucceeds(
        adminDb.collection('usedProducts').doc('item1').update({
          status: 'verified'
        })
      )
    })
  })
})
