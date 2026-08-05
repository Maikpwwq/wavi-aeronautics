import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  formatCopCurrency,
  USED_CATEGORIES,
  USED_CONDITIONS,
  USED_STATUS,
  USED_PHOTO_CONSTRAINTS,
  LISTING_DURATION_DAYS,
  LISTING_DURATION_MS,
  USED_DRAFT_STORAGE_KEY
} from '../usedProductsConfig'

describe('usedProductsConfig - Unit & Property Tests', () => {
  describe('formatCopCurrency', () => {
    it('formats numeric values into COP currency string ending with COP', () => {
      expect(formatCopCurrency(1250000)).toContain('1.250.000')
      expect(formatCopCurrency(1250000)).toMatch(/COP$/)
    })

    it('returns "$ 0 COP" for undefined, null, or NaN inputs', () => {
      expect(formatCopCurrency(undefined)).toBe('$ 0 COP')
      expect(formatCopCurrency(null)).toBe('$ 0 COP')
      expect(formatCopCurrency(NaN)).toBe('$ 0 COP')
    })

    it('formats zero correctly', () => {
      expect(formatCopCurrency(0)).toContain('0')
      expect(formatCopCurrency(0)).toMatch(/COP$/)
    })

    it('Property-Based Test: Always generates string ending with "COP" for valid non-negative numbers', () => {
      fc.assert(
        fc.property(fc.nat(), (amount) => {
          const result = formatCopCurrency(amount)
          return typeof result === 'string' && result.endsWith('COP') && result.startsWith('$')
        })
      )
    })
  })

  describe('USED_CATEGORIES - Exact Values', () => {
    it('has exactly 9 hardware-only categories', () => {
      expect(USED_CATEGORIES).toHaveLength(9)
    })

    it('excludes software and escuela', () => {
      const keys = USED_CATEGORIES.map(c => c.key.toLowerCase())
      const labels = USED_CATEGORIES.map(c => c.label.toLowerCase())
      expect(keys.includes('software')).toBe(false)
      expect(labels.includes('escuela')).toBe(false)
    })

    it('every category has non-empty key, label, and routeSlug', () => {
      USED_CATEGORIES.forEach((cat, i) => {
        expect(cat.key, `Category ${i} key`).toBeTruthy()
        expect(cat.label, `Category ${i} label`).toBeTruthy()
        expect(cat.routeSlug, `Category ${i} routeSlug`).toBeTruthy()
      })
    })

    it('verifies exact key-label-routeSlug for each category', () => {
      const expected = [
        { key: 'dronesKits', label: "Kit's Drones", routeSlug: 'kit-drones' },
        { key: 'dronesHD', label: 'Drones FPV HD', routeSlug: 'drones-fpv-hd' },
        { key: 'dronesRC', label: 'Drones RC', routeSlug: 'drones' },
        { key: 'googles', label: 'Goggles FPV', routeSlug: 'googles' },
        { key: 'radioControl', label: 'Radio Control', routeSlug: 'radio-control' },
        { key: 'transmisors', label: 'Transmisores', routeSlug: 'trasmisor-receptor' },
        { key: 'receptors', label: 'Receptores', routeSlug: 'trasmisor-receptor' },
        { key: 'digitalVTX', label: 'Digital VTX', routeSlug: 'digital-vtx' },
        { key: 'baterias', label: 'Baterías y Accesorios', routeSlug: 'accesorios' }
      ]
      expect(USED_CATEGORIES).toEqual(expected)
    })
  })

  describe('USED_CONDITIONS - Exact Values', () => {
    it('has exactly 4 condition levels', () => {
      expect(USED_CONDITIONS).toHaveLength(4)
    })

    it('every condition has non-empty key, label, and description', () => {
      USED_CONDITIONS.forEach((cond, i) => {
        expect(cond.key, `Condition ${i} key`).toBeTruthy()
        expect(cond.label, `Condition ${i} label`).toBeTruthy()
        expect(cond.description, `Condition ${i} description`).toBeTruthy()
      })
    })

    it('verifies exact key-label-description for each condition', () => {
      expect(USED_CONDITIONS[0]).toEqual({
        key: 'like_new',
        label: 'Como Nuevo (9/10 a 10/10)',
        description: 'Sin detalles estéticos ni funcionales, empaque completo.'
      })
      expect(USED_CONDITIONS[1]).toEqual({
        key: 'good',
        label: 'Buen Estado (7/10 a 8/10)',
        description: 'Uso normal, pequeños detalles cosméticos que no afectan el funcionamiento.'
      })
      expect(USED_CONDITIONS[2]).toEqual({
        key: 'fair',
        label: 'Con Desgaste (5/10 a 6/10)',
        description: 'Uso prolongado o raspones visibles, 100% funcional.'
      })
      expect(USED_CONDITIONS[3]).toEqual({
        key: 'for_parts',
        label: 'Para Repuestos / Para Reparar',
        description: 'Requiere mantenimiento o reparación de componentes.'
      })
    })
  })

  describe('Configuration Integrity Constraints', () => {
    it('USED_PHOTO_CONSTRAINTS enforces 2 to 6 photos with 5MB max', () => {
      expect(USED_PHOTO_CONSTRAINTS.MIN_PHOTOS).toBe(2)
      expect(USED_PHOTO_CONSTRAINTS.MAX_PHOTOS).toBe(6)
      expect(USED_PHOTO_CONSTRAINTS.MAX_FILE_SIZE_MB).toBe(5)
    })

    it('LISTING_DURATION_DAYS is exactly 60 days', () => {
      expect(LISTING_DURATION_DAYS).toBe(60)
    })

    it('LISTING_DURATION_MS equals exactly 60 days in milliseconds', () => {
      const expectedMs = 60 * 24 * 60 * 60 * 1000 // 5_184_000_000
      expect(LISTING_DURATION_MS).toBe(expectedMs)
      expect(LISTING_DURATION_MS).toBe(5184000000)
    })

    it('USED_DRAFT_STORAGE_KEY is the expected session storage key', () => {
      expect(USED_DRAFT_STORAGE_KEY).toBe('WAVI_USED_PRODUCT_DRAFT')
      expect(USED_DRAFT_STORAGE_KEY.length).toBeGreaterThan(0)
    })

    it('USED_STATUS contains all 5 required lifecycle states', () => {
      expect(USED_STATUS).toEqual({
        PENDING: 'pending',
        VERIFIED: 'verified',
        DISABLED: 'disabled',
        SOLD: 'sold',
        EXPIRED: 'expired'
      })
    })
  })
})
