import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FeaturedBrands from '@/modules/views/FeaturedBrands'
import ProductMarcas from '@/modules/views/ProductMarcas'
import { FEATURED_BRANDS } from '@/utilities/brandsConfig'

describe('FeaturedBrands Component Tests', () => {
  it('renders section title, badge, and descriptive subtitle', () => {
    render(<FeaturedBrands />)

    expect(screen.getByRole('heading', { level: 2, name: /Marcas Destacadas/i })).toBeInTheDocument()
    expect(screen.getByText(/PARTNERS OFICIALES & HARDWARE DE ÉLITE/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Distribución oficial y componentes de alta gama para pilotos FPV/i)
    ).toBeInTheDocument()
  })

  it('renders all 8 featured brands dynamically from configuration', () => {
    render(<FeaturedBrands />)

    expect(FEATURED_BRANDS).toHaveLength(8)

    FEATURED_BRANDS.forEach((brand) => {
      // Check link with aria-label
      const link = screen.getByRole('link', {
        name: new RegExp(`Ver productos de la marca ${brand.name}`, 'i'),
      })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', `/tienda?marca=${brand.slug}`)

      // Check brand logo image
      const image = screen.getByAltText(new RegExp(`Logo de ${brand.name}`, 'i'))
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', brand.logoUrl)
    })
  })

  it('applies normalized card styling and mix-blend-multiply image class', () => {
    const { container } = render(<FeaturedBrands />)

    const cards = container.querySelectorAll('[data-testid^="brand-card-"]')
    expect(cards.length).toBe(8)

    const images = container.querySelectorAll('.brand-logo-img')
    expect(images.length).toBe(8)

    images.forEach((img) => {
      expect(img).toHaveStyle({ mixBlendMode: 'multiply' })
    })
  })

  it('supports custom brands prop if provided', () => {
    const customBrands = [
      {
        id: 'dji',
        name: 'DJI Enterprise',
        slug: 'dji',
        logoUrl: 'https://example.com/dji.webp',
      },
      {
        id: 'caddx',
        name: 'Caddx FPGA',
        slug: 'caddx',
        logoUrl: 'https://example.com/caddx.webp',
      },
    ]

    render(<FeaturedBrands brands={customBrands} />)

    expect(screen.getByRole('link', { name: /Ver productos de la marca DJI Enterprise/i })).toHaveAttribute(
      'href',
      '/tienda?marca=dji'
    )
    expect(screen.getByRole('link', { name: /Ver productos de la marca Caddx FPGA/i })).toHaveAttribute(
      'href',
      '/tienda?marca=caddx'
    )
    expect(screen.queryByRole('link', { name: /Ver productos de la marca BetaFPV/i })).not.toBeInTheDocument()
  })

  it('ProductMarcas backward-compatibility wrapper renders FeaturedBrands correctly', () => {
    render(<ProductMarcas />)

    expect(screen.getByRole('heading', { level: 2, name: /Marcas Destacadas/i })).toBeInTheDocument()
    expect(screen.getByTestId('brand-card-radiomaster')).toBeInTheDocument()
  })
})
