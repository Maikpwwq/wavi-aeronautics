import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UsedProductCard from '../UsedProductCard'

describe('UsedProductCard Component Tests', () => {
  const mockProduct = {
    listingId: 'used-123',
    title: 'Drone GEPRC Mark5 O3',
    brand: 'GEPRC',
    condition: 'like_new',
    priceCop: 2500000,
    images: ['https://example.com/drone.jpg'],
    sellerName: 'Carlos FPV',
    sellerPhone: '3001234567',
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  it('renders product title, brand, price and seller name correctly', () => {
    render(<UsedProductCard product={mockProduct} />)

    expect(screen.getByText('GEPRC')).toBeInTheDocument()
    expect(screen.getByText('Drone GEPRC Mark5 O3')).toBeInTheDocument()
    expect(screen.getByText(/2.500.000/)).toBeInTheDocument()
    expect(screen.getByText('Carlos FPV')).toBeInTheDocument()
    expect(screen.getByText('SEGUNDA MANO')).toBeInTheDocument()
  })

  it('displays condition chip with label "Como Nuevo"', () => {
    render(<UsedProductCard product={mockProduct} />)
    expect(screen.getByText(/Como Nuevo/i)).toBeInTheDocument()
  })

  it('does NOT render "Verificado" badge when status is pending', () => {
    render(<UsedProductCard product={mockProduct} />)
    expect(screen.queryByText('Verificado')).not.toBeInTheDocument()
  })

  it('renders "Verificado" badge when status is "verified"', () => {
    const verifiedProduct = { ...mockProduct, status: 'verified' }
    render(<UsedProductCard product={verifiedProduct} />)
    expect(screen.getByText('Verificado')).toBeInTheDocument()
  })

  it('generates correct WhatsApp deep-link with 57 country code and encoded title', () => {
    render(<UsedProductCard product={mockProduct} />)
    const button = screen.getByRole('link', { name: /Contactar vendedor/i })
    expect(button).toHaveAttribute('href', expect.stringContaining('https://api.whatsapp.com/send?phone=573001234567'))
    expect(button).toHaveAttribute('href', expect.stringContaining('Drone%20GEPRC%20Mark5%20O3'))
  })
})
