import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { of } from 'rxjs'
import ProductDetail from '../ProductDetail'

// Mocks
vi.mock('@/firebase/firebaseClient', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn(() => vi.fn()) },
  firestore: {}
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: (param) => {
      if (param === 'id') return 'mock-drone-1'
      if (param === 'category') return 'dronesRC'
      if (param === 'marca') return 'GEPRC'
      return null
    }
  })
}))

vi.mock('react-redux', () => ({
  useSelector: (selector) =>
    selector({
      product: {},
      user: { isLogged: false, uid: null }
    }),
  useDispatch: () => vi.fn()
}))

vi.mock('@/app/providers/FavoritesProvider', () => ({
  useFavorites: () => ({
    isFavorite: () => false,
    toggleFavorite: vi.fn()
  })
}))

const mockProduct = {
  productID: 'mock-drone-1',
  id: 'mock-drone-1',
  name: 'GEPRC Vapor-X5 HD WASP',
  price: 350,
  availability: true,
  category: 'dronesRC',
  brand: 'GEPRC',
  images: ['https://example.com/drone.png'],
  description: 'Pro FPV Drone',
  specifications: 'Props: 5 inch'
}

vi.mock('@/services/sharedServices', () => ({
  getProductById: vi.fn(() => of({ currentProduct: [mockProduct] }))
}))

vi.mock('@/services/sharing-information', () => ({
  sharingInformationService: {
    getSubject: () => of({ productos: [mockProduct] })
  }
}))

vi.mock('@/services/productInteractionService', () => ({
  fetchProductReviews: vi.fn().mockResolvedValue([]),
  fetchProductQuestions: vi.fn().mockResolvedValue([])
}))

vi.mock('@/app/tienda/providers/ShoppingCartProvider', () => ({
  ShowCartContext: React.createContext({
    shoppingCart: { items: 0, suma: 0 },
    updateCart: vi.fn(),
    updateShowCart: vi.fn()
  })
}))

describe('ProductDetail Mobile Sticky Action Bar - Dismiss & Reopen', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DOLARTOCOP

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_DOLARTOCOP = '4000'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DOLARTOCOP = originalEnv
  })

  it('renders the mobile sticky action bar by default and hides it when clicking close button', async () => {
    render(<ProductDetail />)

    // Wait for product to load and bottom bar to appear
    const stickyBar = await screen.findByTestId('mobile-sticky-action-bar')
    expect(stickyBar).toBeInTheDocument()

    // Find and click the close 'X' button
    const closeBtn = screen.getByTestId('close-bottom-bar-btn')
    expect(closeBtn).toBeInTheDocument()
    fireEvent.click(closeBtn)

    // The sticky bar should now be hidden
    expect(screen.queryByTestId('mobile-sticky-action-bar')).not.toBeInTheDocument()

    // The reopen button should now appear
    const reopenBtn = screen.getByTestId('reopen-bottom-bar-btn')
    expect(reopenBtn).toBeInTheDocument()

    // Clicking reopen restores the sticky bar
    fireEvent.click(reopenBtn)
    expect(screen.getByTestId('mobile-sticky-action-bar')).toBeInTheDocument()
    expect(screen.queryByTestId('reopen-bottom-bar-btn')).not.toBeInTheDocument()
  })
})
