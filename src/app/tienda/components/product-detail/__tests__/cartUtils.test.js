import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateCartItemId, formatVariationTag, addProductToCart } from '../cartUtils'

vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: null }
}))

vi.mock('@/services/shoppingCartService', () => ({
  saveCartToFirestore: vi.fn()
}))

vi.mock('@/services/FirebaseCompareShoppingCartIds', () => ({
  default: vi.fn()
}))

describe('cartUtils', () => {
  describe('generateCartItemId', () => {
    it('returns empty string if productId is missing', () => {
      expect(generateCartItemId(null)).toBe('')
      expect(generateCartItemId('')).toBe('')
    })

    it('returns plain productId if variations are empty', () => {
      expect(generateCartItemId('drone-1', [])).toBe('drone-1')
      expect(generateCartItemId('drone-1', null)).toBe('drone-1')
    })

    it('generates deterministic hash regardless of array insertion order', () => {
      const v1 = [
        { groupId: 'motor', optionId: 'tmotor' },
        { groupId: 'rx', optionId: 'elrs' }
      ]
      const v2 = [
        { groupId: 'rx', optionId: 'elrs' },
        { groupId: 'motor', optionId: 'tmotor' }
      ]

      const id1 = generateCartItemId('drone-1', v1)
      const id2 = generateCartItemId('drone-1', v2)

      expect(id1).toBe(id2)
      expect(id1).toBe('drone-1_motor:tmotor__rx:elrs')
    })

    it('generates distinct IDs for different variations of same product', () => {
      const elrs = [{ groupId: 'rx', optionId: 'elrs' }]
      const tbs = [{ groupId: 'rx', optionId: 'tbs' }]

      const idElrs = generateCartItemId('drone-1', elrs)
      const idTbs = generateCartItemId('drone-1', tbs)

      expect(idElrs).not.toBe(idTbs)
    })
  })

  describe('formatVariationTag', () => {
    it('returns empty string for empty input', () => {
      expect(formatVariationTag(null)).toBe('')
      expect(formatVariationTag([])).toBe('')
    })

    it('formats multiple variations with group and option labels', () => {
      const vars = [
        { groupName: 'Receptor', optionLabel: 'ELRS 2.4G' },
        { groupName: 'Motor', optionLabel: 'GEPRC 2207' }
      ]
      expect(formatVariationTag(vars)).toBe('Receptor: ELRS 2.4G | Motor: GEPRC 2207')
    })
  })

  describe('addProductToCart', () => {
    let updateCart
    let updateShowCart

    beforeEach(() => {
      updateCart = vi.fn()
      updateShowCart = vi.fn()
      sessionStorage.clear()
    })

    it('creates distinct items for different variations of same product', () => {
      const product = {
        productID: 'drone-1',
        name: 'Aquila16 Drone',
        price: 150,
        images: ['https://example.com/drone.jpg']
      }

      // Add with ELRS
      addProductToCart({
        product,
        selectedVariations: [{ groupId: 'rx', groupName: 'RX', optionId: 'elrs', optionLabel: 'ELRS', priceDelta: 17 }],
        quantity: 1,
        shoppingCart: { productos: [] },
        updateCart,
        updateShowCart
      })

      const firstCart = updateCart.mock.calls[0][0]
      expect(firstCart.productos).toHaveLength(1)
      expect(firstCart.productos[0].cartItemId).toBe('drone-1_rx:elrs')
      expect(firstCart.productos[0].cantidad).toBe(1)

      // Add same drone with TBS Nano RX
      addProductToCart({
        product,
        selectedVariations: [{ groupId: 'rx', groupName: 'RX', optionId: 'tbs', optionLabel: 'TBS', priceDelta: 35 }],
        quantity: 1,
        shoppingCart: firstCart,
        updateCart,
        updateShowCart
      })

      const secondCart = updateCart.mock.calls[1][0]
      expect(secondCart.productos).toHaveLength(2)
      expect(secondCart.productos[0].cartItemId).toBe('drone-1_rx:elrs')
      expect(secondCart.productos[1].cartItemId).toBe('drone-1_rx:tbs')
    })

    it('merges quantity when adding identical product with exact same variations', () => {
      const product = {
        productID: 'drone-1',
        name: 'Aquila16 Drone',
        price: 150,
        images: ['https://example.com/drone.jpg']
      }

      const rxVar = [{ groupId: 'rx', groupName: 'RX', optionId: 'elrs', optionLabel: 'ELRS', priceDelta: 17 }]

      addProductToCart({
        product,
        selectedVariations: rxVar,
        quantity: 2,
        shoppingCart: { productos: [] },
        updateCart,
        updateShowCart
      })

      const firstCart = updateCart.mock.calls[0][0]

      // Add 3 more of exact same configuration
      addProductToCart({
        product,
        selectedVariations: rxVar,
        quantity: 3,
        shoppingCart: firstCart,
        updateCart,
        updateShowCart
      })

      const secondCart = updateCart.mock.calls[1][0]
      expect(secondCart.productos).toHaveLength(1)
      expect(secondCart.productos[0].cantidad).toBe(5) // 2 + 3
    })
  })
})
