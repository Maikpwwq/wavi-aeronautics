import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import StoreBanner from '../StoreBanner'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

// Mock dependencies
vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn(() => vi.fn()) },
  firestore: {}
}))

vi.mock('@/app/components/UserDropdown', () => ({
  default: () => <div data-testid="mock-user-dropdown">UserDropdown</div>
}))

vi.mock('@/app/tienda/components/ShoppingCart', () => ({
  default: () => <div data-testid="mock-shopping-cart-drawer">ShoppingCartDrawer</div>
}))

describe('StoreBanner Component Tests', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DOLARTOCOP

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_DOLARTOCOP = '4000'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DOLARTOCOP = originalEnv
  })

  const mockCartContext = {
    shoppingCart: { items: 3, suma: 150000, show: false },
    updateShowCart: vi.fn(),
    updateCart: vi.fn()
  }

  it('renders promotional shipping text for desktop', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <StoreBanner />
      </ShowCartContext.Provider>
    )

    expect(screen.getByText('Para lo mejor en equipos FPV y Drones')).toBeInTheDocument()
    expect(screen.getByText(/Envíos gratis a toda Colombia!/i)).toBeInTheDocument()
  })

  it('renders Escuela and Blog buttons with correct links in the unified header bar', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <StoreBanner />
      </ShowCartContext.Provider>
    )

    const escuelaBtn = screen.getByRole('link', { name: /escuela/i })
    expect(escuelaBtn).toBeInTheDocument()
    expect(escuelaBtn).toHaveAttribute('href', '/escuela')

    const blogBtn = screen.getByRole('link', { name: /blog/i })
    expect(blogBtn).toBeInTheDocument()
    expect(blogBtn).toHaveAttribute('href', '/blog')
  })

  it('renders cart summary with formatted COP price and item badge', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <StoreBanner />
      </ShowCartContext.Provider>
    )

    expect(screen.getByText(/COP/i)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByTestId('mock-user-dropdown')).toBeInTheDocument()
  })

  it('triggers updateShowCart when clicking the cart icon button', () => {
    render(
      <ShowCartContext.Provider value={mockCartContext}>
        <StoreBanner />
      </ShowCartContext.Provider>
    )

    const cartBtn = screen.getByRole('button', { name: /abrir carrito de compras/i })
    fireEvent.click(cartBtn)

    expect(mockCartContext.updateShowCart).toHaveBeenCalledWith(true)
  })
})
