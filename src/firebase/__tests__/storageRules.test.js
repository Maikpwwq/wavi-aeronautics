import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing'
import fs from 'fs'
import path from 'path'

const PROJECT_ID = 'wavi-aeronautics-test-storage'
let testEnv

describe('Storage Security Rules Unit Tests', () => {
  beforeAll(async () => {
    const rulesPath = path.resolve(import.meta.dirname, '../../../storage.rules')
    const rules = fs.readFileSync(rulesPath, 'utf8')

    try {
      testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        storage: {
          rules,
          host: '127.0.0.1',
          port: 9199
        }
      })
    } catch (e) {
      console.warn('[StorageRulesTest] Firebase Storage emulator is not running on port 9199. Rules tests will be skipped.')
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
    await testEnv.clearStorage()
  })

  describe('used-product-images Bucket Rules', () => {
    it('allows anyone to read images under used-product-images', async () => {
      // Seed file as admin
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const storage = context.storage()
        const fileRef = storage.ref('used-product-images/userA/listing1/photo.jpg')
        await fileRef.put(Buffer.from('mock_image_bytes'))
      })

      const unauthStorage = testEnv.unauthenticatedContext().storage()
      const fileRef = unauthStorage.ref('used-product-images/userA/listing1/photo.jpg')
      await assertSucceeds(fileRef.getDownloadURL())
    })

    it('denies unauthenticated user from uploading to used-product-images', async () => {
      const unauthStorage = testEnv.unauthenticatedContext().storage()
      const fileRef = unauthStorage.ref('used-product-images/userA/listing1/photo.jpg')
      await assertFails(fileRef.put(Buffer.from('mock_bytes')))
    })

    it('denies authenticated user from uploading to another user folder in used-product-images', async () => {
      const userBStorage = testEnv.authenticatedContext('userB').storage()
      const fileRef = userBStorage.ref('used-product-images/userA/listing1/photo.jpg')
      await assertFails(fileRef.put(Buffer.from('mock_bytes')))
    })

    it('allows authenticated owner to upload to their own folder in used-product-images', async () => {
      const userAStorage = testEnv.authenticatedContext('userA').storage()
      const fileRef = userAStorage.ref('used-product-images/userA/listing1/photo.jpg')
      await assertSucceeds(fileRef.put(Buffer.from('mock_bytes')))
    })
  })
})
