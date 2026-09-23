import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductLightboxModal from '../ProductLightboxModal'

describe('ProductLightboxModal Component Tests', () => {
  const mockImages = [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg'
  ]

  it('does not render when open is false', () => {
    render(
      <ProductLightboxModal
        open={false}
        images={mockImages}
        activeImage={0}
        onClose={vi.fn()}
        onSelectImage={vi.fn()}
      />
    )

    expect(screen.queryByTestId('product-lightbox-modal')).not.toBeInTheDocument()
  })

  it('renders with accessible ARIA dialog roles when open', () => {
    render(
      <ProductLightboxModal
        open={true}
        images={mockImages}
        activeImage={0}
        onClose={vi.fn()}
        onSelectImage={vi.fn()}
        productName="Kit FPV Aquila16"
      />
    )

    const modal = screen.getByRole('dialog', { name: 'Vista completa de imagen' })
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('1 / 3')
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <ProductLightboxModal
        open={true}
        images={mockImages}
        activeImage={0}
        onClose={handleClose}
        onSelectImage={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('lightbox-close-btn'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <ProductLightboxModal
        open={true}
        images={mockImages}
        activeImage={0}
        onClose={handleClose}
        onSelectImage={vi.fn()}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('cycles to next image on ArrowRight key press and next chevron click', () => {
    const handleSelect = vi.fn()
    render(
      <ProductLightboxModal
        open={true}
        images={mockImages}
        activeImage={0}
        onClose={vi.fn()}
        onSelectImage={handleSelect}
      />
    )

    fireEvent.click(screen.getByTestId('lightbox-next-btn'))
    expect(handleSelect).toHaveBeenCalledWith(1)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('cycles to previous image on ArrowLeft key press and prev chevron click', () => {
    const handleSelect = vi.fn()
    render(
      <ProductLightboxModal
        open={true}
        images={mockImages}
        activeImage={2}
        onClose={vi.fn()}
        onSelectImage={handleSelect}
      />
    )

    fireEvent.click(screen.getByTestId('lightbox-prev-btn'))
    expect(handleSelect).toHaveBeenCalledWith(1)

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(handleSelect).toHaveBeenCalledWith(1)
  })
})
