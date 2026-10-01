/**
 * Unit Tests — Inventory Sync Webhook
 *
 * Tests the POST /api/webhooks/inventory-sync route handler
 * covering security, validation, parsing (JSON + CSV), business rules,
 * batch chunking, and resilience.
 *
 * @module __tests__/route.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mock Firebase Admin ────────────────────────────────────────────────
// vi.hoisted() ensures these variables exist BEFORE the hoisted vi.mock() runs.

const {
  mockBatchUpdate,
  mockBatchCommit,
  mockBatch,
  mockDocRef,
  mockSnapshot,
  mockEmptySnapshot,
  mockWhere,
  mockLimit,
  mockGet,
  mockCollectionGroup,
} = vi.hoisted(() => {
  const mockBatchUpdate = vi.fn()
  const mockBatchCommit = vi.fn().mockResolvedValue(undefined)
  const mockBatch = vi.fn(() => ({
    update: mockBatchUpdate,
    commit: mockBatchCommit,
  }))

  const mockDocRef = { path: 'products/drones/brands/GEPRC/items/BNF-O3-6S-HD' }
  const mockSnapshot = {
    empty: false,
    docs: [{ ref: mockDocRef }],
  }
  const mockEmptySnapshot = { empty: true, docs: [] }

  const mockWhere = vi.fn()
  const mockLimit = vi.fn()
  const mockGet = vi.fn()
  const mockCollectionGroup = vi.fn()

  return {
    mockBatchUpdate,
    mockBatchCommit,
    mockBatch,
    mockDocRef,
    mockSnapshot,
    mockEmptySnapshot,
    mockWhere,
    mockLimit,
    mockGet,
    mockCollectionGroup,
  }
})

vi.mock('@/lib/firebaseAdminServer', () => ({
  adminDb: {
    collectionGroup: (...args: unknown[]) => {
      mockCollectionGroup(...args)
      return {
        where: (...whereArgs: unknown[]) => {
          mockWhere(...whereArgs)
          return {
            limit: (...limitArgs: unknown[]) => {
              mockLimit(...limitArgs)
              return { get: mockGet }
            },
          }
        },
      }
    },
    batch: mockBatch,
  },
}))

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: () => 'SERVER_TIMESTAMP',
  },
}))

// ─── Import Route After Mocks ───────────────────────────────────────────

import { POST, GET, PUT, DELETE } from '../route'

// ─── Helpers ────────────────────────────────────────────────────────────

const VALID_SECRET = 'test-webhook-secret-key-1234567890abcdef'

function createRequest(
  body: string | object,
  options: {
    contentType?: string
    authorization?: string
    method?: string
  } = {}
): NextRequest {
  const {
    contentType = 'application/json',
    authorization,
    method = 'POST',
  } = options

  const headers = new Headers()
  headers.set('content-type', contentType)
  if (authorization) {
    headers.set('authorization', authorization)
  }

  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)

  return new NextRequest('http://localhost:3000/api/webhooks/inventory-sync', {
    method,
    headers,
    body: bodyStr,
  })
}

function validPayload(overrides: Partial<{ sku: string; qty: number; priceUsd: number }>[] = []) {
  const defaults = [
    { sku: 'BNF-O3-6S-HD', qty: 25, priceUsd: 189.99 },
    { sku: 'PROP-51433-PC', qty: 100, priceUsd: 4.99 },
  ]
  if (overrides.length > 0) {
    return overrides.map((o, i) => ({ ...defaults[i % defaults.length], ...o }))
  }
  return defaults
}

// ─── Test Suite ─────────────────────────────────────────────────────────

describe('POST /api/webhooks/inventory-sync', () => {
  beforeEach(() => {
    vi.stubEnv('WEBHOOK_SECRET_KEY', VALID_SECRET)
    vi.clearAllMocks()
    // Default: all SKUs resolve successfully
    mockGet.mockResolvedValue(mockSnapshot)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // ── Security Tests ──

  describe('Security — Bearer Token Authentication', () => {
    it('rejects requests without Authorization header (401)', async () => {
      const req = createRequest(validPayload())
      const res = await POST(req)

      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body.error).toContain('Missing Authorization header')
    })

    it('rejects invalid Bearer token (401)', async () => {
      const req = createRequest(validPayload(), {
        authorization: 'Bearer wrong-token',
      })
      const res = await POST(req)

      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body.error).toContain('Invalid authorization token')
    })

    it('rejects non-Bearer auth scheme (401)', async () => {
      const req = createRequest(validPayload(), {
        authorization: `Basic ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body.error).toContain('Invalid Authorization scheme')
    })

    it('returns 500 when WEBHOOK_SECRET_KEY is not configured', async () => {
      vi.stubEnv('WEBHOOK_SECRET_KEY', '')
      const req = createRequest(validPayload(), {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(500)
      const body = await res.json()
      expect(body.error).toContain('webhook secret not set')
    })
  })

  // ── Method Rejection Tests ──

  describe('Method Enforcement', () => {
    it('GET returns 405 Method Not Allowed', async () => {
      const res = await GET()
      expect(res.status).toBe(405)
      expect(res.headers.get('Allow')).toBe('POST')
    })

    it('PUT returns 405 Method Not Allowed', async () => {
      const res = await PUT()
      expect(res.status).toBe(405)
    })

    it('DELETE returns 405 Method Not Allowed', async () => {
      const res = await DELETE()
      expect(res.status).toBe(405)
    })
  })

  // ── JSON Parsing Tests ──

  describe('JSON Payload Parsing', () => {
    it('parses valid JSON payload and returns sync report', async () => {
      const req = createRequest(validPayload(), {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.summary.total).toBe(2)
      expect(body.summary.updated).toBe(2)
      expect(body.timestamp).toBeDefined()
    })

    it('rejects non-array JSON payload (400)', async () => {
      const req = createRequest('{"sku":"test","qty":1}', {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'application/json',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('must be an array')
    })

    it('rejects empty array payload (400)', async () => {
      const req = createRequest([], {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('no items')
    })

    it('rejects malformed JSON (400)', async () => {
      const req = createRequest('{not valid json}', {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'application/json',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('Invalid JSON')
    })

    it('rejects empty body (400)', async () => {
      const req = createRequest('', {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'application/json',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('Empty request body')
    })
  })

  // ── CSV Parsing Tests ──

  describe('CSV Payload Parsing', () => {
    it('parses valid CSV payload and returns sync report', async () => {
      const csv = 'sku,qty,priceUsd\nBNF-O3-6S-HD,25,189.99\nPROP-51433-PC,100,4.99'
      const req = createRequest(csv, {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'text/csv',
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.summary.total).toBe(2)
      expect(body.summary.updated).toBe(2)
    })

    it('handles CSV with alternative header casing', async () => {
      const csv = 'SKU,QTY,PRICEUSD\nBNF-O3-6S-HD,25,189.99'
      const req = createRequest(csv, {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'text/csv',
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.summary.updated).toBe(1)
    })

    it('handles CSV with price_usd column name', async () => {
      const csv = 'sku,qty,price_usd\nBNF-O3-6S-HD,25,189.99'
      const req = createRequest(csv, {
        authorization: `Bearer ${VALID_SECRET}`,
        contentType: 'text/csv',
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.summary.updated).toBe(1)
    })
  })

  // ── Validation Tests ──

  describe('Row-Level Validation', () => {
    it('rejects rows with non-numeric qty', async () => {
      const payload = [{ sku: 'TEST-SKU', qty: 'not-a-number', priceUsd: 10 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('All rows failed validation')
    })

    it('rejects rows with missing sku field', async () => {
      const payload = [{ qty: 10, priceUsd: 5 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('All rows failed validation')
    })

    it('rejects rows with negative priceUsd', async () => {
      const payload = [{ sku: 'TEST-SKU', qty: 10, priceUsd: -5 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toContain('All rows failed validation')
    })

    it('rejects rows with non-integer qty', async () => {
      const payload = [{ sku: 'TEST-SKU', qty: 10.5, priceUsd: 5 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })

    it('processes valid rows and reports invalid rows as warnings', async () => {
      const payload = [
        { sku: 'VALID-SKU', qty: 10, priceUsd: 5 },
        { sku: 'INVALID-SKU', qty: 'bad', priceUsd: 5 },
      ]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      // Should process the valid row
      const body = await res.json()
      expect(body.summary.total).toBe(1) // Only valid rows counted
      expect(body.validationWarnings).toBeDefined()
      expect(body.validationWarnings.length).toBe(1)
    })
  })

  // ── Business Logic Tests ──

  describe('Zero-Stock Switch Business Rule', () => {
    it('sets availability=false and stockType=out_of_stock when qty=0', async () => {
      const payload = [{ sku: 'ZERO-STOCK-SKU', qty: 0, priceUsd: 10 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(200)

      // Verify the batch.update was called with availability: false and stockType: 'out_of_stock'
      expect(mockBatchUpdate).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          stock: 0,
          availability: false,
          stockType: 'out_of_stock',
          price: 10,
          stockDepletedAt: 'SERVER_TIMESTAMP',
        })
      )
    })

    it('sets availability=true and stockType=in_stock when qty > 0', async () => {
      const payload = [{ sku: 'IN-STOCK-SKU', qty: 50, priceUsd: 29.99 }]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.status).toBe(200)

      expect(mockBatchUpdate).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          stock: 50,
          availability: true,
          stockType: 'in_stock',
          price: 29.99,
        })
      )

      // Should NOT include stockDepletedAt when in stock
      const updateCall = mockBatchUpdate.mock.calls[0][1]
      expect(updateCall.stockDepletedAt).toBeUndefined()
    })
  })

  // ── SKU Resolution Tests ──

  describe('SKU Resolution', () => {
    it('reports unresolved SKUs as not_found', async () => {
      // First call resolves, second returns empty
      mockGet
        .mockResolvedValueOnce(mockSnapshot)
        .mockResolvedValueOnce(mockEmptySnapshot) // productID lookup fails
        .mockResolvedValueOnce(mockEmptySnapshot) // sku fallback also fails

      const payload = [
        { sku: 'EXISTS', qty: 10, priceUsd: 5 },
        { sku: 'DOES-NOT-EXIST', qty: 5, priceUsd: 3 },
      ]
      const req = createRequest(payload, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)
      const body = await res.json()

      expect(body.summary.notFound).toBe(1)
      const notFoundResult = body.results.find((r) => r.sku === 'DOES-NOT-EXIST')
      expect(notFoundResult?.status).toBe('not_found')
    })
  })

  // ── Batch Chunking Tests ──

  describe('Batch Chunking', () => {
    it('chunks large payloads into 490-op batches', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        sku: `SKU-${i.toString().padStart(4, '0')}`,
        qty: i % 50,
        priceUsd: 9.99 + i,
      }))

      const req = createRequest(items, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)
      const body = await res.json()

      // 1000 items / 490 per batch = 3 batches (490 + 490 + 20)
      expect(body.batchDetails.totalBatches).toBe(3)
      expect(mockBatchCommit).toHaveBeenCalledTimes(3)
    })
  })

  // ── Resilience Tests ──

  describe('Resilience — Partial Batch Failure', () => {
    it('reports per-batch failures without blocking other batches', async () => {
      // Create enough items for 2 batches
      const items = Array.from({ length: 500 }, (_, i) => ({
        sku: `SKU-${i.toString().padStart(4, '0')}`,
        qty: 10,
        priceUsd: 5,
      }))

      // First batch commit succeeds, second fails
      mockBatchCommit
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Firestore write quota exceeded'))

      const req = createRequest(items, {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      // 207 Multi-Status when partial failure
      expect(res.status).toBe(207)
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.batchDetails.failedBatches).toBe(1)
      expect(body.summary.errors).toBeGreaterThan(0)
      expect(body.summary.updated).toBeGreaterThan(0) // First batch succeeded
    })
  })

  // ── Response Headers ──

  describe('Response Headers', () => {
    it('includes sync duration and stats headers', async () => {
      const req = createRequest(validPayload(), {
        authorization: `Bearer ${VALID_SECRET}`,
      })
      const res = await POST(req)

      expect(res.headers.get('X-Sync-Duration-Ms')).toBeDefined()
      expect(res.headers.get('X-Sync-Updated')).toBe('2')
    })
  })
})
