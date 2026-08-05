import { describe, it, expect } from 'vitest'
import productReducer, {
  loadDetail,
  modifyDetail,
  unmountDetail,
  initialProduct
} from '../states/product'
import shoppingCartReducer, {
  createCart,
  deleteCart,
  initialCart
} from '../states/shopping_cart'

describe('Redux Slices - Unit Tests', () => {
  describe('productSlice', () => {
    it('returns initial state when called with undefined state', () => {
      const state = productReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialProduct)
    })

    it('loadDetail action replaces product state completely', () => {
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
    })

    it('modifyDetail action updates specified fields', () => {
      const state = productReducer(
        initialProduct,
        modifyDetail({ precio: 250, titulo: 'Drone Modificado' })
      )
      expect(state.precio).toBe(250)
      expect(state.titulo).toBe('Drone Modificado')
      expect(state.descripcion).toBe(initialProduct.descripcion)
    })
  })

  describe('shoppingCartSlice', () => {
    it('returns initial state when initialized', () => {
      const state = shoppingCartReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialCart)
    })

    it('createCart action sets shoppingCart payload', () => {
      const products = [{ id: '1', name: 'Motor FPV' }]
      const state = shoppingCartReducer(initialCart, createCart(products))
      expect(state.shoppingCart).toEqual(products)
    })

    it('deleteCart resets shoppingCart to initial state', () => {
      const currentState = { shoppingCart: [{ id: '1' }] }
      const state = shoppingCartReducer(currentState, deleteCart())
      expect(state.shoppingCart).toEqual(initialCart)
    })
  })
})
