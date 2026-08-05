import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  formatCopCurrency,
  USED_CATEGORIES,
  USED_CONDITIONS,
  USED_STATUS,
  USED_PHOTO_CONSTRAINTS,
  LISTING_DURATION_DAYS
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

    it('Property-Based Test: Always generates string ending with "COP" for valid non-negative numbers', () => {
      fc.assert(
        fc.property(fc.nat(), (amount) => {
          const result = formatCopCurrency(amount)
          return typeof result === 'string' && result.endsWith('COP') && result.startsWith('$')
        })
      )
    })
  })

  describe('Configuration Integrity Constraints', () => {
    it('USED_CATEGORIES excludes software and escuela', () => {
      const keys = USED_CATEGORIES.map(c => c.key.toLowerCase())
      const labels = USED_CATEGORIES.map(c => c.label.toLowerCase())

      expect(keys.includes('software')).toBe(false)
      expect(labels.includes('escuela')).toBe(false)
    })

    it('USED_PHOTO_CONSTRAINTS enforces 2 to 6 photos', () => {
      expect(USED_PHOTO_CONSTRAINTS.MIN_PHOTOS).toBe(2)
      expect(USED_PHOTO_CONSTRAINTS.MAX_PHOTOS).toBe(6)
    })

    it('LISTING_DURATION_DAYS is exactly 60 days', () => {
      expect(LISTING_DURATION_DAYS).toBe(60)
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
