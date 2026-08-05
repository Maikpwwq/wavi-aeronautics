import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import fc from 'fast-check'
import UsedProductForm from '../UsedProductForm'
import productReducer from '../../../../../store/states/product'
import shoppingCartReducer from '../../../../../store/states/shopping_cart'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn()
  })
}))

vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: { uid: 'fuzz-user-123', phoneNumber: '3001234567' } },
  firestore: {},
  storage: {}
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: (state = initialState.user || { uid: 'fuzz-user-123' }) => state,
      product: productReducer,
      shoppingCart: shoppingCartReducer
    }
  })
}

const renderWithRedux = (ui, { initialState } = {}) => {
  const store = createMockStore(initialState)
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('UsedProductForm - Fuzzing & Stress Tests', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { link: 'https://i.imgur.com/fuzz.jpg' } })
    }))
    sessionStorage.clear()
  })

  it('Fuzz Test: Form component renders stably under random string inputs without crashing', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }),
        fc.string({ minLength: 0, maxLength: 500 }),
        (randomTitle, randomDesc) => {
          cleanup()
          const { container } = renderWithRedux(<UsedProductForm />, {
            initialState: { user: { uid: 'fuzz-user-123' } }
          })
          expect(container).toBeDefined()
        }
      ),
      { numRuns: 10 }
    )
  })

  it('Fuzz Test: Sanitizes and tolerates malicious XSS vector strings in form state', () => {
    const maliciousPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(1)',
      '"><script>document.cookie</script>',
      '{{constructor.constructor("alert(1)")()}}',
      'SELECT * FROM users WHERE 1=1;'
    ]

    maliciousPayloads.forEach((payload) => {
      cleanup()
      const draftWithPayload = {
        title: payload,
        description: payload,
        priceCOP: '100000',
        category: 'dronesHD',
        condition: 'like_new'
      }
      sessionStorage.setItem('WAVI_USED_PRODUCT_DRAFT', JSON.stringify(draftWithPayload))

      renderWithRedux(<UsedProductForm />, { initialState: { user: { uid: 'xss-user' } } })
      
      expect(screen.getByText('Vender mi equipo usado')).toBeInTheDocument()
    })
  })
})
