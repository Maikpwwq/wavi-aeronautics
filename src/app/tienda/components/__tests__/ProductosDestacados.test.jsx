import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductosDestacados from '../productosDestacados'

// Mock Redux
const mockDronesRC = [
  {
    productID: 'PROD-1',
    name: 'Dron Dolphin ToothPick 4',
    brand: 'GEPRC',
    price: 380,
    images: ['https://example.com/drone1.jpg'],
    availability: true
  },
  {
    productID: 'PROD-2',
    name: 'AOS 5 O3 6S HD',
    brand: 'IFLIGHT-RC',
    price: 1100,
    images: ['https://example.com/drone2.jpg'],
    availability: false
  }
]

vi.mock('react-redux', () => ({
  useSelector: (selector) =>
    selector({
      shop: { dronesRC: mockDronesRC },
      product: {}
    }),
  useDispatch: () => vi.fn()
}))

vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: null },
  firestore: {}
}))

describe('ProductosDestacados Component Tests', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DOLARTOCOP

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_DOLARTOCOP = '4000'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DOLARTOCOP = originalEnv
  })

  it('renders section title and description correctly', () => {
    render(<ProductosDestacados />)

    expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Lleva tu Dron, destacamos los mejores kits de FPV listos para vuelo/i)
    ).toBeInTheDocument()
  })

  it('renders horizontal scroll track with product cards matching Nuevos Productos width styling', () => {
    render(<ProductosDestacados />)

    const track = screen.getByTestId('featured-products-track')
    expect(track).toBeInTheDocument()

    const cards = screen.getAllByTestId('featured-product-card')
    expect(cards).toHaveLength(2)

    // Check that each card renders product details
    expect(screen.getByText('Dron Dolphin ToothPick 4')).toBeInTheDocument()
    expect(screen.getByText('AOS 5 O3 6S HD')).toBeInTheDocument()
  })
})
