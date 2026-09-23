import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ShippingDetailsModal from '../ShippingDetailsModal'

describe('ShippingDetailsModal Component Tests', () => {
  it('does not render content when open is false', () => {
    render(<ShippingDetailsModal open={false} onClose={vi.fn()} />)
    expect(screen.queryByTestId('shipping-details-modal')).not.toBeInTheDocument()
  })

  it('renders default shipping options when opened without custom options', () => {
    render(<ShippingDetailsModal open={true} onClose={vi.fn()} />)

    expect(screen.getByTestId('shipping-details-modal')).toBeInTheDocument()
    expect(screen.getByText('Envíos a nivel nacional')).toBeInTheDocument()
    expect(screen.getByText('Envío Estándar Nacional')).toBeInTheDocument()
    expect(screen.getByText('Envío Exprés Urbano')).toBeInTheDocument()
    expect(screen.getByText('24 a 72 horas hábiles')).toBeInTheDocument()
  })

  it('renders custom shipping options when passed via props', () => {
    const customOptions = [
      {
        id: 'carrier-dhl',
        name: 'DHL Express Aero',
        estimatedDays: '24 horas',
        price: 35000,
        isDefault: true,
        carrier: 'DHL Express',
        description: 'Entrega aérea prioritaria.'
      }
    ]

    render(
      <ShippingDetailsModal
        open={true}
        onClose={vi.fn()}
        shippingOptions={customOptions}
      />
    )

    expect(screen.getByText('DHL Express Aero')).toBeInTheDocument()
    expect(screen.getByText('24 horas')).toBeInTheDocument()
    expect(screen.getByText('$ 35.000 COP')).toBeInTheDocument()
  })

  it('calls onSelectOption when an option card is clicked', () => {
    const handleSelect = vi.fn()
    render(
      <ShippingDetailsModal
        open={true}
        onClose={vi.fn()}
        onSelectOption={handleSelect}
      />
    )

    fireEvent.click(screen.getByTestId('shipping-option-express-urban'))
    expect(handleSelect).toHaveBeenCalledWith('express-urban')
  })

  it('calls onClose when close icon button is clicked', () => {
    const handleClose = vi.fn()
    render(<ShippingDetailsModal open={true} onClose={handleClose} />)

    fireEvent.click(screen.getByTestId('shipping-modal-close-btn'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Entendido button is clicked', () => {
    const handleClose = vi.fn()
    render(<ShippingDetailsModal open={true} onClose={handleClose} />)

    fireEvent.click(screen.getByTestId('shipping-modal-confirm-btn'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
