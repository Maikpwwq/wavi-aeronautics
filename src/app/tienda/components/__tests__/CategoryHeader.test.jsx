import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'

describe('CategoryHeader Component Tests', () => {
  it('renders title as h1 and description by default', () => {
    render(
      <CategoryHeader
        title="Drones FPV Digital HD"
        description="Descubre los mejores Drones FPV con transmisión digital de video en alta definición."
      />
    )

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Drones FPV Digital HD')
    expect(
      screen.getByText('Descubre los mejores Drones FPV con transmisión digital de video en alta definición.')
    ).toBeInTheDocument()
  })

  it('renders secondary heading (h2) when specified', () => {
    render(
      <CategoryHeader
        title="Receptores de Señal (RX)"
        description="Receptores ultraligeros de diversidad."
        titleComponent="h2"
        variant="h5"
      />
    )

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Receptores de Señal (RX)')
  })

  it('renders children elements when provided', () => {
    render(
      <CategoryHeader
        title="Drones RC"
        description="Modelos de radiocontrol."
      >
        <div data-testid="custom-child">Contenido extra BNF/PNP/RTF</div>
      </CategoryHeader>
    )

    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
    expect(screen.getByText('Contenido extra BNF/PNP/RTF')).toBeInTheDocument()
  })
})
