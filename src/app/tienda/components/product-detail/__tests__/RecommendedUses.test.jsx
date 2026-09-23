import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RecommendedUses from '../RecommendedUses'

describe('RecommendedUses Component Tests', () => {
  it('returns null when uses is empty array', () => {
    const { container } = render(<RecommendedUses uses={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when uses is undefined or null', () => {
    const { container } = render(<RecommendedUses uses={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders pill badges for all recommended uses', () => {
    const mockUses = ['Cinematic', 'Freestyle', 'Long Range']
    render(<RecommendedUses uses={mockUses} />)

    expect(screen.getByTestId('recommended-uses-section')).toBeInTheDocument()
    expect(screen.getByText('Usos recomendados')).toBeInTheDocument()

    const pills = screen.getAllByTestId('recommended-use-pill')
    expect(pills).toHaveLength(3)
    expect(screen.getByText('Cinematic')).toBeInTheDocument()
    expect(screen.getByText('Freestyle')).toBeInTheDocument()
    expect(screen.getByText('Long Range')).toBeInTheDocument()
  })
})
