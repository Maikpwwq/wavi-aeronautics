import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UsedProductsShowcase from '@/app/tienda/components/UsedProductsShowcase'
import * as usedProductsService from '@/services/usedProductsService'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock usedProductsService
vi.mock('@/services/usedProductsService', () => ({
  fetchListingsByCategory: vi.fn()
}))

describe('UsedProductsShowcase Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading progress initially and then null if no products found', async () => {
    usedProductsService.fetchListingsByCategory.mockResolvedValueOnce([])

    const { container } = render(<UsedProductsShowcase categoryKey="dronesHD" categoryTitle="Drones FPV HD" />)

    // Wait for async effect
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('renders showcase paper and cards when products exist', async () => {
    const mockListings = [
      {
        listingId: 'u1',
        title: 'Caddx Vista Unit',
        brand: 'Caddx',
        condition: 'good',
        priceCop: 600000,
        sellerName: 'Pedro',
        sellerPhone: '3119998877',
        status: 'pending'
      }
    ]

    usedProductsService.fetchListingsByCategory.mockResolvedValueOnce(mockListings)

    render(<UsedProductsShowcase categoryKey="digitalVTX" categoryTitle="Digital VTX" />)

    await waitFor(() => {
      expect(screen.getByText(/Equipos Usados \/ Segunda Mano \(Digital VTX\)/i)).toBeInTheDocument()
      expect(screen.getByText('Caddx Vista Unit')).toBeInTheDocument()
    })
  })

  it('navigates to /tienda/vender when clicking "Publicar mi equipo usado"', async () => {
    const mockListings = [
      {
        listingId: 'u1',
        title: 'Item 1',
        condition: 'good',
        priceCop: 100000,
        sellerName: 'Pedro',
        sellerPhone: '3000000000'
      }
    ]
    usedProductsService.fetchListingsByCategory.mockResolvedValueOnce(mockListings)

    render(<UsedProductsShowcase categoryKey="baterias" categoryTitle="Baterías" />)

    await waitFor(() => {
      expect(screen.getByText(/Equipos Usados/i)).toBeInTheDocument()
    })

    const publishBtn = screen.getByRole('button', { name: /Publicar mi Baterías usado/i })
    await userEvent.click(publishBtn)

    expect(mockPush).toHaveBeenCalledWith('/tienda/vender')
  })
})
