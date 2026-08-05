import { describe, it, expect, vi } from 'vitest'
import productReducer, {
  loadDetail,
  modifyDetail,
  unmountDetail,
  initialProduct
} from '@/store/states/product'
import shoppingCartReducer, {
  createCart,
  setCart,
  eliminateFromCart,
  deleteCart,
  initialCart
} from '@/store/states/shopping_cart'

describe('Redux Slices - Unit Tests', () => {
  describe('productSlice', () => {
    it('returns initial state when called with undefined state', () => {
      const state = productReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialProduct)
    })

    it('initialProduct has correct default field values', () => {
      expect(initialProduct.titulo).toBe('Producto 1')
      expect(initialProduct.precio).toBe(100)
      expect(initialProduct.descripcion).toBe('Descripcion del producto 1')
      expect(initialProduct.especificaciones).toBe('Especificaciones del producto 1')
      expect(initialProduct.incluye).toBe('Incluye del producto 1')
      expect(initialProduct.imagenes).toEqual([])
    })

    it('loadDetail action replaces product state completely', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {})
      const newProduct = {
        titulo: 'Goggles FPV V2',
        precio: 500,
        descripcion: 'HD Goggles',
        especificaciones: '1080p',
        incluye: 'Antenas',
        imagenes: ['https://example.com/goggles.jpg']
      }

      const state = productReducer(initialProduct, loadDetail(newProduct))
      expect(state).toEqual(newProduct)
      // Verify it's a full replacement, not a merge
      expect(state.titulo).toBe('Goggles FPV V2')
      expect(state.precio).toBe(500)
      spyLog.mockRestore()
    })

    it('loadDetail discards previous state fields not in payload', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {})
      const minimalPayload = { titulo: 'Minimal' }
      const state = productReducer(initialProduct, loadDetail(minimalPayload))
      expect(state).toEqual(minimalPayload)
      expect(state.precio).toBeUndefined()
      spyLog.mockRestore()
    })

    it('modifyDetail action updates specified fields while preserving others', () => {
      const state = productReducer(
        initialProduct,
        modifyDetail({ precio: 250, titulo: 'Drone Modificado' })
      )
      expect(state.precio).toBe(250)
      expect(state.titulo).toBe('Drone Modificado')
      expect(state.descripcion).toBe(initialProduct.descripcion)
      expect(state.especificaciones).toBe(initialProduct.especificaciones)
      expect(state.incluye).toBe(initialProduct.incluye)
      expect(state.imagenes).toEqual(initialProduct.imagenes)
    })

    it('modifyDetail with empty object preserves all fields', () => {
      const state = productReducer(initialProduct, modifyDetail({}))
      expect(state).toEqual(initialProduct)
    })

    it('unmountDetail resets product field to initialProduct', () => {
      const currentState = {
        titulo: 'Drone Custom',
        precio: 999,
        descripcion: 'Custom Desc',
        especificaciones: 'Custom Specs',
        incluye: 'Custom Inc',
        imagenes: ['img1.jpg']
      }
      const state = productReducer(currentState, unmountDetail())
      expect(state.product).toEqual(initialProduct)
    })
  })

  describe('shoppingCartSlice', () => {
    it('returns initial state when initialized', () => {
      const state = shoppingCartReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialCart)
    })

    it('initialCart has correct default structure', () => {
      expect(initialCart.productos).toEqual([])
      expect(initialCart.cartID).toBeNull()
    })

    it('createCart action sets shoppingCart payload', () => {
      const products = [{ id: '1', name: 'Motor FPV' }]
      const state = shoppingCartReducer(initialCart, createCart(products))
      expect(state.shoppingCart).toEqual(products)
    })

    it('createCart replaces previous shoppingCart value', () => {
      const prevState = { ...initialCart, shoppingCart: [{ id: 'old' }] }
      const newProducts = [{ id: 'new', name: 'ESC 4in1' }]
      const state = shoppingCartReducer(prevState, createCart(newProducts))
      expect(state.shoppingCart).toEqual(newProducts)
    })

    it('eliminateFromCart filters out item by id', () => {
      const currentState = {
        ...initialCart,
        shoppingCart: [
          { id: '1', name: 'Motor' },
          { id: '2', name: 'Frame' },
          { id: '3', name: 'ESC' }
        ]
      }
      const state = shoppingCartReducer(currentState, eliminateFromCart('2'))
      expect(state.shoppingCart).toHaveLength(2)
      expect(state.shoppingCart.find(i => i.id === '2')).toBeUndefined()
      expect(state.shoppingCart[0].id).toBe('1')
      expect(state.shoppingCart[1].id).toBe('3')
    })

    it('eliminateFromCart does nothing if id not found', () => {
      const currentState = {
        ...initialCart,
        shoppingCart: [{ id: '1', name: 'Motor' }]
      }
      const state = shoppingCartReducer(currentState, eliminateFromCart('999'))
      expect(state.shoppingCart).toHaveLength(1)
    })

    it('deleteCart resets shoppingCart to initial state', () => {
      const currentState = {
        ...initialCart,
        shoppingCart: [{ id: '1' }, { id: '2' }]
      }
      const state = shoppingCartReducer(currentState, deleteCart())
      expect(state.shoppingCart).toEqual(initialCart)
    })
  })
})
