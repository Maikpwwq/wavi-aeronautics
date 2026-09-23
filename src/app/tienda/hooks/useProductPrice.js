import { useMemo } from 'react'
import { calculateCopPrice, parseCopCurrency, formatCurrency } from '@/utilities/priceUtils'

/**
 * Normalizes selected variations into a standard array of variation items.
 * @param {Array|Object} selectedVariations
 * @returns {Array}
 */
export const normalizeSelectedVariations = (selectedVariations) => {
  if (!selectedVariations) return []
  if (Array.isArray(selectedVariations)) {
    return selectedVariations.filter(Boolean)
  }
  if (typeof selectedVariations === 'object') {
    // Check if single option object (has label or optionLabel or priceModifier or priceDelta)
    if (
      'priceDelta' in selectedVariations || 
      'priceModifier' in selectedVariations || 
      'optionLabel' in selectedVariations || 
      'label' in selectedVariations
    ) {
      return [selectedVariations]
    }
    // Otherwise it's a map of { [groupId]: optionObject }
    return Object.values(selectedVariations).filter(Boolean)
  }
  return []
}

/**
 * Reactive state hook that computes the product's unit and total price in real time:
 * Final Price = Base Price + sum(Selected Option Price Deltas)
 *
 * @param {Object|null} product
 * @param {Array|Object|null} selectedVariations - Array or Map of chosen variations
 * @param {number} quantity - Quantity of units (default 1)
 * @returns {Object} { displayPrice, unitPriceUsd, unitPriceCop, totalPriceCop, totalPriceDisplay, priceDeltaUsd, hasPriceDelta }
 */
export const useProductPrice = (product, selectedVariations = [], quantity = 1) => {
  return useMemo(() => {
    if (!product) {
      return {
        displayPrice: '$ 0',
        unitPriceUsd: 0,
        unitPriceCop: 0,
        totalPriceCop: 0,
        totalPriceDisplay: '$ 0',
        priceDeltaUsd: 0,
        hasPriceDelta: false
      }
    }

    const normVariations = normalizeSelectedVariations(selectedVariations)

    // Sum all price deltas/modifiers
    const priceDeltaUsd = normVariations.reduce((sum, item) => {
      const delta = Number(item?.priceDelta ?? item?.priceModifier ?? 0)
      return sum + (isNaN(delta) ? 0 : delta)
    }, 0)

    const hasPriceDelta = priceDeltaUsd !== 0
    const qty = Math.max(1, Number(quantity) || 1)

    // Base price calculation: USD preferred, legacy COP as fallback
    if (product.price !== undefined && product.price !== null && product.price !== '') {
      const baseUsd = parseFloat(product.price) || 0
      const unitPriceUsd = Math.max(0, baseUsd + priceDeltaUsd)
      const displayPrice = calculateCopPrice(unitPriceUsd)
      const unitPriceCop = parseCopCurrency(displayPrice)
      const totalPriceCop = unitPriceCop * qty
      const totalPriceDisplay = formatCurrency(totalPriceCop)

      return {
        displayPrice,
        unitPriceUsd,
        unitPriceCop,
        totalPriceCop,
        totalPriceDisplay,
        priceDeltaUsd,
        hasPriceDelta
      }
    }

    if (product.precio) {
      const baseCop = parseCopCurrency(product.precio)
      // If delta is USD (small number <= 1000), convert delta to COP; if already COP, add directly
      let deltaCop = 0
      if (priceDeltaUsd > 1000) {
        deltaCop = priceDeltaUsd
      } else if (priceDeltaUsd !== 0) {
        const copFormatted = calculateCopPrice(priceDeltaUsd)
        deltaCop = parseCopCurrency(copFormatted)
      }

      const unitPriceCop = Math.max(0, baseCop + deltaCop)
      const displayPrice = formatCurrency(unitPriceCop)
      const totalPriceCop = unitPriceCop * qty
      const totalPriceDisplay = formatCurrency(totalPriceCop)

      return {
        displayPrice,
        unitPriceUsd: 0,
        unitPriceCop,
        totalPriceCop,
        totalPriceDisplay,
        priceDeltaUsd,
        hasPriceDelta
      }
    }

    return {
      displayPrice: '$ 0',
      unitPriceUsd: 0,
      unitPriceCop: 0,
      totalPriceCop: 0,
      totalPriceDisplay: '$ 0',
      priceDeltaUsd: 0,
      hasPriceDelta: false
    }
  }, [product, selectedVariations, quantity])
}

export default useProductPrice
