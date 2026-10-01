/**
 * B2B Inventory Sync Webhook — Route Handler
 *
 * Ingests inventory payloads (JSON array or CSV string) from global suppliers,
 * validates + normalizes them, and atomically updates Firestore product stock
 * and pricing in batched writes.
 *
 * Security: Bearer Token auth via WEBHOOK_SECRET_KEY env var.
 * Business Rule: qty ≤ 0 → availability = false (Zero-Stock Switch).
 *
 * @route POST /api/webhooks/inventory-sync
 * @module app/api/webhooks/inventory-sync/route
 */

import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import Papa from 'papaparse'
import { adminDb } from '@/lib/firebaseAdminServer'

// ─── Constants ──────────────────────────────────────────────────────────

/** Max payload size: 5 MB */
const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024

/** Firestore batch limit is 500; we use 490 for safety margin */
const BATCH_CHUNK_SIZE = 490

/** Max string length for sanitized fields */
const MAX_SKU_LENGTH = 128

// ─── Types ──────────────────────────────────────────────────────────────

/** Normalized inventory item after validation */
export interface InventorySyncItem {
  sku: string
  qty: number
  priceUsd: number
}

/** Per-SKU result in the sync report */
interface SkuResult {
  sku: string
  status: 'updated' | 'not_found' | 'error'
  firestorePath?: string
  error?: string
}

/** Aggregated sync report returned to the supplier */
interface SyncReport {
  success: boolean
  timestamp: string
  summary: {
    total: number
    updated: number
    notFound: number
    errors: number
  }
  results: SkuResult[]
  batchDetails?: {
    totalBatches: number
    failedBatches: number
  }
}

// ─── Security ───────────────────────────────────────────────────────────

/**
 * Constant-time string comparison to prevent timing attacks.
 * Falls back to byte-by-byte XOR if crypto.timingSafeEqual is unavailable.
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  const encoder = new TextEncoder()
  const bufA = encoder.encode(a)
  const bufB = encoder.encode(b)

  // Use crypto.timingSafeEqual (available in Node.js >= 6)
  try {
    const { timingSafeEqual } = require('crypto')
    return timingSafeEqual(Buffer.from(bufA), Buffer.from(bufB))
  } catch {
    // Fallback: manual constant-time comparison
    let result = 0
    for (let i = 0; i < bufA.length; i++) {
      result |= bufA[i] ^ bufB[i]
    }
    return result === 0
  }
}

/**
 * Validate the Authorization header against WEBHOOK_SECRET_KEY.
 * Returns null if valid, or a NextResponse with the appropriate error.
 */
function authenticateRequest(request: NextRequest): NextResponse | null {
  const secret = process.env.WEBHOOK_SECRET_KEY
  if (!secret) {
    console.error('[inventory-sync] WEBHOOK_SECRET_KEY is not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration: webhook secret not set' },
      { status: 500 }
    )
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Missing Authorization header' },
      { status: 401 }
    )
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return NextResponse.json(
      { error: 'Invalid Authorization scheme. Expected: Bearer <token>' },
      { status: 401 }
    )
  }

  if (!secureCompare(token, secret)) {
    return NextResponse.json(
      { error: 'Invalid authorization token' },
      { status: 401 }
    )
  }

  return null // Auth passed
}

// ─── Input Parsing & Validation ─────────────────────────────────────────

/**
 * Strip non-printable characters and trim whitespace.
 * Prevents injection of control characters via CSV/JSON strings.
 */
function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return ''
  // Remove non-printable ASCII (0x00-0x1F except tab/newline) and trim
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, MAX_SKU_LENGTH)
}

/**
 * Coerce a value to a finite number, or return NaN.
 * Prevents NaN, Infinity, and string injection in numeric fields.
 */
function toSafeNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return NaN
    const num = Number(trimmed)
    return Number.isFinite(num) ? num : NaN
  }
  return NaN
}

/**
 * Validate and normalize a single raw row into an InventorySyncItem.
 * Returns the item or a string describing the validation error.
 */
function validateRow(row: Record<string, unknown>, index: number): InventorySyncItem | string {
  const sku = sanitizeString(row.sku)
  if (!sku) {
    return `Row ${index}: missing or empty 'sku' field`
  }

  const qty = toSafeNumber(row.qty)
  if (Number.isNaN(qty)) {
    return `Row ${index} (${sku}): 'qty' must be a valid number, got '${String(row.qty)}'`
  }
  if (!Number.isInteger(qty)) {
    return `Row ${index} (${sku}): 'qty' must be an integer, got ${qty}`
  }

  const priceUsd = toSafeNumber(row.priceUsd ?? row.priceusd ?? row.price_usd ?? row.price)
  if (Number.isNaN(priceUsd)) {
    return `Row ${index} (${sku}): 'priceUsd' must be a valid number, got '${String(row.priceUsd ?? row.priceusd ?? row.price_usd ?? row.price)}'`
  }
  if (priceUsd < 0) {
    return `Row ${index} (${sku}): 'priceUsd' must be non-negative, got ${priceUsd}`
  }

  return { sku, qty: Math.max(qty, 0), priceUsd }
}

/**
 * Parse the request body as JSON array or CSV string.
 * Returns normalized InventorySyncItem[] or an error response.
 */
async function parsePayload(
  request: NextRequest
): Promise<{ items: InventorySyncItem[]; errors: string[] } | NextResponse> {
  const contentType = request.headers.get('content-type') || ''
  let rawBody: string

  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json(
      { error: 'Failed to read request body' },
      { status: 400 }
    )
  }

  if (rawBody.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: `Payload exceeds maximum size of ${MAX_PAYLOAD_BYTES / 1024 / 1024}MB` },
      { status: 413 }
    )
  }

  if (!rawBody.trim()) {
    return NextResponse.json(
      { error: 'Empty request body' },
      { status: 400 }
    )
  }

  let rawRows: Record<string, unknown>[]

  // ── JSON parsing ──
  if (contentType.includes('application/json') || rawBody.trimStart().startsWith('[')) {
    try {
      const parsed = JSON.parse(rawBody)
      if (!Array.isArray(parsed)) {
        return NextResponse.json(
          { error: 'JSON payload must be an array of objects' },
          { status: 400 }
        )
      }
      rawRows = parsed
    } catch (e) {
      return NextResponse.json(
        { error: `Invalid JSON: ${(e as Error).message}` },
        { status: 400 }
      )
    }
  }
  // ── CSV parsing ──
  else {
    const result = Papa.parse<Record<string, unknown>>(rawBody, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
      dynamicTyping: false, // We handle type coercion ourselves for safety
    })

    if (result.errors.length > 0) {
      const csvErrors = result.errors
        .slice(0, 10)
        .map((e) => `Row ${e.row}: ${e.message}`)
      return NextResponse.json(
        { error: 'CSV parsing failed', details: csvErrors },
        { status: 400 }
      )
    }

    rawRows = result.data
  }

  if (rawRows.length === 0) {
    return NextResponse.json(
      { error: 'Payload contains no items' },
      { status: 400 }
    )
  }

  // ── Row-level validation ──
  const items: InventorySyncItem[] = []
  const errors: string[] = []

  for (let i = 0; i < rawRows.length; i++) {
    const result = validateRow(rawRows[i], i)
    if (typeof result === 'string') {
      errors.push(result)
    } else {
      items.push(result)
    }
  }

  // If ALL rows failed validation, reject entirely
  if (items.length === 0 && errors.length > 0) {
    return NextResponse.json(
      { error: 'All rows failed validation', details: errors },
      { status: 400 }
    )
  }

  return { items, errors }
}

// ─── Firestore Operations ───────────────────────────────────────────────

/**
 * Resolve SKU strings to Firestore document references using collectionGroup('items').
 * Products are stored at: products/{category}/brands/{brand}/items/{productID}
 * where productID is the SKU.
 */
async function resolveSkuRefs(
  skus: string[]
): Promise<Map<string, FirebaseFirestore.DocumentReference>> {
  const refMap = new Map<string, FirebaseFirestore.DocumentReference>()

  // Batch SKU lookups in parallel (groups of 30 to avoid overwhelming Firestore)
  const LOOKUP_CONCURRENCY = 30
  for (let i = 0; i < skus.length; i += LOOKUP_CONCURRENCY) {
    const batch = skus.slice(i, i + LOOKUP_CONCURRENCY)
    const lookups = batch.map(async (sku) => {
      try {
        // Primary: query by productID field in collectionGroup
        const snapshot = await adminDb
          .collectionGroup('items')
          .where('productID', '==', sku)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          refMap.set(sku, snapshot.docs[0].ref)
          return
        }

        // Fallback: query by sku field
        const skuSnapshot = await adminDb
          .collectionGroup('items')
          .where('sku', '==', sku)
          .limit(1)
          .get()

        if (!skuSnapshot.empty) {
          refMap.set(sku, skuSnapshot.docs[0].ref)
        }
      } catch (err) {
        console.error(`[inventory-sync] Failed to resolve SKU ${sku}:`, err)
      }
    })

    await Promise.allSettled(lookups)
  }

  return refMap
}

/**
 * Partition an array into chunks of the specified size.
 */
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Execute batched Firestore writes for resolved inventory items.
 * Each chunk runs as an independent atomic batch.
 * A failing chunk does not block subsequent chunks.
 */
async function executeBatchedWrites(
  items: InventorySyncItem[],
  refMap: Map<string, FirebaseFirestore.DocumentReference>
): Promise<{ results: SkuResult[]; failedBatches: number; totalBatches: number }> {
  const results: SkuResult[] = []

  // Separate resolved vs. unresolved items
  const resolvedItems: Array<{ item: InventorySyncItem; ref: FirebaseFirestore.DocumentReference }> = []
  for (const item of items) {
    const ref = refMap.get(item.sku)
    if (ref) {
      resolvedItems.push({ item, ref })
    } else {
      results.push({ sku: item.sku, status: 'not_found' })
    }
  }

  // Chunk resolved items into Firestore-safe batches
  const batches = chunk(resolvedItems, BATCH_CHUNK_SIZE)
  let failedBatches = 0

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batchItems = batches[batchIndex]
    const firestoreBatch = adminDb.batch()

    const batchSkuResults: SkuResult[] = []

    for (const { item, ref } of batchItems) {
      // ── Zero-Stock Switch (Critical Business Rule) ──
      // When qty ≤ 0, we MUST set availability to false at the database level.
      // This ensures the frontend never displays a purchasable out-of-stock item.
      const isInStock = item.qty > 0

      firestoreBatch.update(ref, {
        stock: Math.max(item.qty, 0),
        price: item.priceUsd,
        availability: isInStock,
        stockType: isInStock ? 'in_stock' : 'out_of_stock',
        inventorySyncedAt: FieldValue.serverTimestamp(),
        inventorySource: 'webhook',
        ...(isInStock ? {} : { stockDepletedAt: FieldValue.serverTimestamp() }),
      })

      batchSkuResults.push({
        sku: item.sku,
        status: 'updated',
        firestorePath: ref.path,
      })
    }

    try {
      await firestoreBatch.commit()
      results.push(...batchSkuResults)
    } catch (err) {
      failedBatches++
      console.error(
        `[inventory-sync] Batch ${batchIndex + 1}/${batches.length} failed:`,
        err
      )
      // Mark all items in this batch as errored
      for (const skuResult of batchSkuResults) {
        results.push({
          sku: skuResult.sku,
          status: 'error',
          error: `Batch ${batchIndex + 1} commit failed: ${(err as Error).message}`,
        })
      }
    }
  }

  return {
    results,
    failedBatches,
    totalBatches: batches.length,
  }
}

// ─── Route Handlers ─────────────────────────────────────────────────────

/**
 * POST /api/webhooks/inventory-sync
 *
 * Accepts JSON array or CSV payload with inventory data.
 * Updates Firestore product stock and pricing atomically.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  // ── 1. Authentication ──
  const authError = authenticateRequest(request)
  if (authError) return authError

  // ── 2. Parse & Validate ──
  const parseResult = await parsePayload(request)
  if (parseResult instanceof NextResponse) return parseResult

  const { items, errors: validationErrors } = parseResult

  console.log(
    `[inventory-sync] Processing ${items.length} items (${validationErrors.length} validation errors)`
  )

  // ── 3. Resolve SKUs to Firestore refs ──
  const skus = items.map((item) => item.sku)
  const refMap = await resolveSkuRefs(skus)

  console.log(
    `[inventory-sync] Resolved ${refMap.size}/${skus.length} SKUs to Firestore documents`
  )

  // ── 4. Execute batched writes ──
  const { results, failedBatches, totalBatches } = await executeBatchedWrites(
    items,
    refMap
  )

  // ── 5. Build sync report ──
  const updated = results.filter((r) => r.status === 'updated').length
  const notFound = results.filter((r) => r.status === 'not_found').length
  const errored = results.filter((r) => r.status === 'error').length

  const report: SyncReport = {
    success: failedBatches === 0 && errored === 0,
    timestamp: new Date().toISOString(),
    summary: {
      total: items.length,
      updated,
      notFound,
      errors: errored,
    },
    results,
    batchDetails: {
      totalBatches,
      failedBatches,
    },
  }

  // Append validation warnings if any rows were skipped
  if (validationErrors.length > 0) {
    (report as SyncReport & { validationWarnings: string[] }).validationWarnings =
      validationErrors.slice(0, 50)
  }

  const elapsed = Date.now() - startTime
  console.log(
    `[inventory-sync] Completed in ${elapsed}ms — ${updated} updated, ${notFound} not found, ${errored} errors`
  )

  return NextResponse.json(report, {
    status: failedBatches > 0 ? 207 : 200,
    headers: {
      'X-Sync-Duration-Ms': String(elapsed),
      'X-Sync-Updated': String(updated),
      'X-Sync-Not-Found': String(notFound),
    },
  })
}

/**
 * Reject non-POST methods with 405 Method Not Allowed.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}
