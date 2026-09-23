import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BuyNowButton from '../BuyNowButton'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: null },
  firestore: {}
}))

const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

vi.mock('../cartUtils', () => ({
  addProductToCart: vi.fn(() => true)
}))

describe('BuyNowButton Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockProduct = {
    productID: 'drone-fpv-1',
    name: 'Kit FPV Aquila16',
    price: 300,
    availability: true
  }

  const mockCartContext = {
    shoppingCart: { productos: [] },
    updateCart: vi.fn(),
    updateShowCart: vi.fn()
  }

  it('renders "Comprar ahora" button', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <BuyNowButton product={mockProduct} quantity={2} />
      </ShowCartContext.Provider>
    )

    const btn = screen.getByTestId('buy-now-button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Comprar ahora')
    expect(btn).toBeEnabled()
  })

  it('triggers cart add and redirects to /tienda/ver-carrito on click', async () => {
    const { addProductToCart } = await import('../cartUtils')

    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <BuyNowButton product={mockProduct} quantity={2} />
      </ShowCartContext.Provider>
    )

    fireEvent.click(screen.getByTestId('buy-now-button'))

    expect(addProductToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        product: mockProduct,
        quantity: 2,
        showCartDrawer: false
      })
    )
    expect(pushMock).toHaveBeenCalledWith('/tienda/ver-carrito')
  })

  it('disables button when product availability is false', () => {
    const unavailableProduct = { ...mockProduct, availability: false }

    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <BuyNowButton product={unavailableProduct} />
      </ShowCartContext.Provider>
    )

    expect(screen.getByTestId('buy-now-button')).toBeDisabled()
  })

  it('disables button when disabled prop is true', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <BuyNowButton product={mockProduct} disabled={true} />
      </ShowCartContext.Provider>
    )

    expect(screen.getByTestId('buy-now-button')).toBeDisabled()
  })
})
