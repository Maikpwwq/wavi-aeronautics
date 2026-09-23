import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductGallery from '../ProductGallery'

describe('ProductGallery Component Tests', () => {
  const mockImages = [
    'https://example.com/drone-1.jpg',
    'https://example.com/drone-2.jpg'
  ]

  it('renders main image and thumbnails correctly', () => {
    render(
      <ProductGallery
        images={mockImages}
        productName="Kit FPV Aquila16"
      />
    )

    expect(screen.getByTestId('product-gallery')).toBeInTheDocument()
    const mainImg = screen.getByTestId('main-product-image')
    expect(mainImg).toHaveAttribute('alt', 'Kit FPV Aquila16')
    expect(mainImg).toHaveAttribute('src', mockImages[0])
    expect(screen.getByTestId('gallery-thumbnails')).toBeInTheDocument()
  })

  it('renders helper callout banner beneath main image', () => {
    render(
      <ProductGallery
        images={mockImages}
        productName="Kit FPV Aquila16"
      />
    )

    const helperBanner = screen.getByTestId('lightbox-helper-banner')
    expect(helperBanner).toBeInTheDocument()
    expect(screen.getByText('Haz clic para una vista completa')).toBeInTheDocument()
  })

  it('opens Lightbox Modal when helper banner is clicked', () => {
    render(
      <ProductGallery
        images={mockImages}
        productName="Kit FPV Aquila16"
      />
    )

    expect(screen.queryByTestId('product-lightbox-modal')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('lightbox-helper-banner'))

    expect(screen.getByTestId('product-lightbox-modal')).toBeInTheDocument()
  })

  it('opens Lightbox Modal when main image is clicked', () => {
    render(
      <ProductGallery
        images={mockImages}
        productName="Kit FPV Aquila16"
      />
    )

    fireEvent.click(screen.getByTestId('main-image-paper'))

    expect(screen.getByTestId('product-lightbox-modal')).toBeInTheDocument()
  })

  it('updates main image when a thumbnail is clicked', () => {
    render(
      <ProductGallery
        images={mockImages}
        productName="Kit FPV Aquila16"
      />
    )

    fireEvent.click(screen.getByTestId('gallery-thumbnail-1'))

    const mainImg = screen.getByTestId('main-product-image')
    expect(mainImg).toHaveAttribute('src', mockImages[1])
  })
})
