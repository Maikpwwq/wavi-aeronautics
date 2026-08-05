import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fc from 'fast-check'
import {
  calculateCopPrice,
  parseCopCurrency,
  formatCurrency,
  parseProductPrices
} from '../priceUtils'

describe('priceUtils - Unit & Property Tests', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DOLARTOCOP

  beforeEach(() => {
    process.env.NEXT_PUBLIC_DOLARTOCOP = '4000'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DOLARTOCOP = originalEnv
  })

  describe('calculateCopPrice', () => {
    it('returns "$ 0" for empty/undefined/null values', () => {
      expect(calculateCopPrice(undefined)).toBe('$ 0')
      expect(calculateCopPrice(null)).toBe('$ 0')
      expect(calculateCopPrice('')).toBe('$ 0')
    })

    it('returns "$ 0" for NaN string inputs', () => {
      expect(calculateCopPrice('abc')).toBe('$ 0')
      expect(calculateCopPrice('not-a-number')).toBe('$ 0')
    })

    it('calculates COP price correctly: (USD + 30) * 1.5 * rate', () => {
      // Math: (100 + 30) * 1.5 * 4000 = 130 * 6000 = 780,000 COP
      const result = calculateCopPrice(100)
      const parsed = parseCopCurrency(result)
      expect(parsed).toBe(780000)
    })

    it('applies transport base of $30 USD', () => {
      // With 0 USD: (0 + 30) * 1.5 * 4000 = 180,000
      const result = calculateCopPrice(0)
      const parsed = parseCopCurrency(result)
      expect(parsed).toBe(180000)
    })

    it('applies importation factor of 1.5x', () => {
      // (70 + 30) * 1.5 * 4000 = 100 * 6000 = 600,000
      const result = calculateCopPrice(70)
      const parsed = parseCopCurrency(result)
      expect(parsed).toBe(600000)
    })

    it('handles formatted USD string inputs like "$ 100"', () => {
      const result = calculateCopPrice('$ 100')
      const parsed = parseCopCurrency(result)
      expect(parsed).toBe(780000)
    })

    it('handles string number inputs like "50"', () => {
      // (50 + 30) * 1.5 * 4000 = 80 * 6000 = 480,000
      const result = calculateCopPrice('50')
      const parsed = parseCopCurrency(result)
      expect(parsed).toBe(480000)
    })

    it('returns original input if exchange rate env is invalid or missing', () => {
      delete process.env.NEXT_PUBLIC_DOLARTOCOP
      const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(calculateCopPrice(100)).toBe(100)
      spyWarn.mockRestore()
    })

    it('logs warning when exchange rate is invalid', () => {
      process.env.NEXT_PUBLIC_DOLARTOCOP = 'invalid'
      const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      calculateCopPrice(100)
      expect(spyWarn).toHaveBeenCalledOnce()
      spyWarn.mockRestore()
    })

    it('Property-Based Test: Always returns a non-empty string for valid numbers', () => {
      fc.assert(
        fc.property(fc.nat({ max: 100000 }), (usdPrice) => {
          const cop = calculateCopPrice(usdPrice)
          return typeof cop === 'string' && cop.length > 0
        })
      )
    })

    it('Property-Based Test: result increases monotonically with price', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 50000 }),
          fc.nat({ max: 50000 }),
          (a, b) => {
            const resultA = parseCopCurrency(calculateCopPrice(a))
            const resultB = parseCopCurrency(calculateCopPrice(b))
            if (a > b) return resultA >= resultB
            if (a < b) return resultA <= resultB
            return resultA === resultB
          }
        )
      )
    })
  })

  describe('parseCopCurrency', () => {
    it('parses formatted COP string to integer', () => {
      expect(parseCopCurrency('$ 2.212.650')).toBe(2212650)
      expect(parseCopCurrency('$ 50.000')).toBe(50000)
    })

    it('returns 0 for invalid or empty inputs', () => {
      expect(parseCopCurrency('')).toBe(0)
      expect(parseCopCurrency(null)).toBe(0)
      expect(parseCopCurrency(undefined)).toBe(0)
      expect(parseCopCurrency('abc')).toBe(0)
    })

    it('returns same number if input is already a number', () => {
      expect(parseCopCurrency(15000)).toBe(15000)
      expect(parseCopCurrency(0)).toBe(0)
      expect(parseCopCurrency(-5)).toBe(-5)
    })

    it('Property-Based Test: roundtrip format -> parse preserves value', () => {
      fc.assert(
        fc.property(fc.nat({ max: 999999999 }), (amount) => {
          const formatted = formatCurrency(amount)
          const parsed = parseCopCurrency(formatted)
          return parsed === amount
        })
      )
    })
  })

  describe('formatCurrency', () => {
    it('formats numbers into COP currency string', () => {
      const formatted = formatCurrency(2000000)
      expect(formatted).toContain('2.000.000')
    })

    it('returns "$ 0" for NaN', () => {
      expect(formatCurrency(NaN)).toBe('$ 0')
    })

    it('formats zero correctly', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('formats small values correctly', () => {
      const result = formatCurrency(500)
      expect(parseCopCurrency(result)).toBe(500)
    })
  })

  describe('parseProductPrices', () => {
    it('updates new migrated products with price in USD', () => {
      const products = [{ name: 'Drone Kit', price: 100 }]
      parseProductPrices(products)
      expect(products[0].priceUSD).toBe(100)
      const copValue = parseCopCurrency(products[0].precio)
      expect(copValue).toBe(780000)
    })

    it('updates legacy products with precio field', () => {
      const products = [{ name: 'Legacy Drone', precio: 50 }]
      parseProductPrices(products)
      expect(products[0].priceUSD).toBe(50)
      expect(products[0].precio).toBeDefined()
    })

    it('prefers price over precio when both exist', () => {
      const products = [{ name: 'Mixed', price: 200, precio: 50 }]
      parseProductPrices(products)
      expect(products[0].priceUSD).toBe(200)
    })

    it('handles null/undefined product lists safely', () => {
      expect(() => parseProductPrices(null)).not.toThrow()
      expect(() => parseProductPrices(undefined)).not.toThrow()
      expect(() => parseProductPrices('not-array')).not.toThrow()
    })

    it('skips products with neither price nor precio', () => {
      const products = [{ name: 'No Price' }]
      parseProductPrices(products)
      expect(products[0].priceUSD).toBeUndefined()
      expect(products[0].precio).toBeUndefined()
    })

    it('mutates the original array in place', () => {
      const products = [{ price: 100 }]
      const ref = products
      parseProductPrices(products)
      expect(products).toBe(ref)
      expect(products[0].priceUSD).toBe(100)
    })
  })
})
