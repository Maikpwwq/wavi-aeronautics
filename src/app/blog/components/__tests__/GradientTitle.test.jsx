import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GradientTitle from '../GradientTitle'

describe('GradientTitle Component Tests', () => {
  it('renders standard text without highlights properly', () => {
    render(<GradientTitle text="Noticias del Mundo FPV" />)
    expect(screen.getByText('Noticias del Mundo FPV')).toBeInTheDocument()
  })

  it('renders highlighted words with transparent text fill and gradient background', () => {
    render(
      <GradientTitle
        text="Explora las Fronteras del Vuelo FPV"
        highlight={['Fronteras', 'Vuelo FPV']}
      />
    )

    const highlightedFronteras = screen.getByText('Fronteras')
    const highlightedVuelo = screen.getByText('Vuelo FPV')

    expect(highlightedFronteras).toBeInTheDocument()
    expect(highlightedVuelo).toBeInTheDocument()
    expect(highlightedFronteras.tagName).toBe('SPAN')
    expect(highlightedVuelo.tagName).toBe('SPAN')
  })

  it('tolerates single string highlight prop as well as array', () => {
    render(
      <GradientTitle
        text="Guía de Drones de Carreras"
        highlight="Drones"
      />
    )

    const highlighted = screen.getByText('Drones')
    expect(highlighted).toBeInTheDocument()
    expect(highlighted.tagName).toBe('SPAN')
  })

  it('renders with custom heading component and variant', () => {
    render(
      <GradientTitle
        text="Título Principal"
        component="h3"
        variant="h4"
      />
    )

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Título Principal')
  })
})
