import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PseBadge from '@/modules/components/PseBadge'

describe('PseBadge Component Tests', () => {
  it('renders PSE logo with accessible alt text and default aria-label', () => {
    render(<PseBadge />)

    const img = screen.getByAltText('PSE Pagos Seguros en Línea')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/logos/pse-logo.png')

    const badge = screen.getByLabelText('Pagos 100% Seguros con PSE y Mercado Pago')
    expect(badge).toBeInTheDocument()
  })

  it('supports custom title and custom styles', () => {
    render(
      <PseBadge
        title="Pago Seguro Personalizado"
        data-testid="custom-pse-badge"
        sx={{ opacity: 0.8 }}
        imgSx={{ maxHeight: 50 }}
      />
    )

    const badge = screen.getByTestId('custom-pse-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('aria-label', 'Pago Seguro Personalizado')
  })
})
