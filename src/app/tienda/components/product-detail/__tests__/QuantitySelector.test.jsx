import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuantitySelector from '../QuantitySelector'

describe('QuantitySelector Component Tests', () => {
  it('renders current quantity correctly', () => {
    render(<QuantitySelector quantity={3} maxStock={10} />)

    expect(screen.getByTestId('quantity-display')).toHaveTextContent('3')
    expect(screen.getByLabelText('Disminuir cantidad')).toBeEnabled()
    expect(screen.getByLabelText('Aumentar cantidad')).toBeEnabled()
  })

  it('disables decrement button when quantity is 1', () => {
    render(<QuantitySelector quantity={1} maxStock={5} />)

    expect(screen.getByLabelText('Disminuir cantidad')).toBeDisabled()
    expect(screen.getByLabelText('Aumentar cantidad')).toBeEnabled()
  })

  it('disables increment button when quantity reaches maxStock', () => {
    render(<QuantitySelector quantity={5} maxStock={5} />)

    expect(screen.getByLabelText('Disminuir cantidad')).toBeEnabled()
    expect(screen.getByLabelText('Aumentar cantidad')).toBeDisabled()
  })

  it('triggers onQuantityChange with decremented value when - is clicked', () => {
    const handleChange = vi.fn()
    render(<QuantitySelector quantity={3} maxStock={10} onQuantityChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Disminuir cantidad'))
    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('triggers onQuantityChange with incremented value when + is clicked', () => {
    const handleChange = vi.fn()
    render(<QuantitySelector quantity={3} maxStock={10} onQuantityChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Aumentar cantidad'))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('displays "Agotado" and no buttons when maxStock <= 0', () => {
    render(<QuantitySelector quantity={1} maxStock={0} />)

    expect(screen.getByTestId('quantity-selector-out-of-stock')).toBeInTheDocument()
    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.queryByLabelText('Disminuir cantidad')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Aumentar cantidad')).not.toBeInTheDocument()
  })

  it('displays "Agotado" when disabled is true', () => {
    render(<QuantitySelector quantity={2} maxStock={10} disabled={true} />)

    expect(screen.getByTestId('quantity-selector-out-of-stock')).toBeInTheDocument()
    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })
})
