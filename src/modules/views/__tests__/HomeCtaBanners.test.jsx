import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomeCtaBanners from '@/modules/views/HomeCtaBanners'
const { MockShowCartContext, mockUseFavorites } = vi.hoisted(() => {
  const React = require('react')
  return {
    mockUseFavorites: vi.fn(),
    MockShowCartContext: React.createContext({
      shoppingCart: { items: 0, productos: [], suma: 0 }
    })
  }
})

vi.mock('@/app/providers/FavoritesProvider', () => ({
  useFavorites: () => mockUseFavorites()
}))

vi.mock('@/app/tienda/providers/ShoppingCartProvider', () => ({
  ShowCartContext: MockShowCartContext
}))

const renderWithCart = (ui, cartState) => {
  return render(
    <MockShowCartContext.Provider value={{ shoppingCart: cartState }}>
      {ui}
    </MockShowCartContext.Provider>
  )
}

describe('HomeCtaBanners Component Tests', () => {
  it('returns null with zero visual footprint when both favorites and cart are empty', () => {
    mockUseFavorites.mockReturnValue({ favorites: [] })
    const { container } = renderWithCart(<HomeCtaBanners />, { items: 0, productos: [] })

    expect(container.firstChild).toBeNull()
    expect(screen.queryByText(/Llévate tu favorito/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Compra tu carrito/i)).not.toBeInTheDocument()
  })

  it('renders only the favorites banner when only favorites list has items (100% full width)', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        {
          productId: 'drone-fav-1',
          name: 'DJI Avata 2',
          firstImage: 'https://example.com/avata2.jpg'
        }
      ]
    })

    renderWithCart(<HomeCtaBanners />, { items: 0, productos: [] })

    expect(screen.getByText(/¡Llévate tu favorito!/i)).toBeInTheDocument()
    expect(screen.getByText(/1 producto guardado/i)).toBeInTheDocument()
    const favLink = screen.getByRole('link', { name: /Ver mis favoritos/i })
    expect(favLink).toBeInTheDocument()
    expect(favLink).toHaveAttribute('href', '/favoritos')

    // Cart banner should not be present
    expect(screen.queryByText(/Compra tu carrito/i)).not.toBeInTheDocument()
  })

  it('renders only the cart banner when only shopping cart has items (100% full width)', () => {
    mockUseFavorites.mockReturnValue({ favorites: [] })

    renderWithCart(<HomeCtaBanners />, {
      items: 3,
      suma: 1500000,
      productos: [
        {
          productID: 'goggles-1',
          name: 'DJI Goggles 3',
          firstImage: 'https://example.com/goggles3.jpg'
        }
      ]
    })

    expect(screen.getByText(/Compra tu carrito/i)).toBeInTheDocument()
    expect(screen.getByText(/3 productos listos/i)).toBeInTheDocument()
    const cartLink = screen.getByRole('link', { name: /Ir al carrito/i })
    expect(cartLink).toBeInTheDocument()
    expect(cartLink).toHaveAttribute('href', '/tienda/ver-carrito')

    // Favorites banner should not be present
    expect(screen.queryByText(/¡Llévate tu favorito!/i)).not.toBeInTheDocument()
  })

  it('renders both banners when user has both favorites and items in cart', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        { productId: 'fav-1', name: 'DJI Avata' },
        { productId: 'fav-2', name: 'Antena FPV' }
      ]
    })

    renderWithCart(<HomeCtaBanners />, {
      items: 1,
      suma: 450000,
      productos: [{ productID: 'cart-1', name: 'Batería 6S' }]
    })

    expect(screen.getByText(/¡Llévate tu favorito!/i)).toBeInTheDocument()
    expect(screen.getByText(/2 productos guardados/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver mis favoritos/i })).toBeInTheDocument()

    expect(screen.getByText(/Compra tu carrito/i)).toBeInTheDocument()
    expect(screen.getByText(/1 producto listo/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ir al carrito/i })).toBeInTheDocument()
  })
})
