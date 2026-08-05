import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

function DummyBadge({ title }) {
  return (
    <div data-testid="dummy-badge">
      <span>{title}</span>
    </div>
  )
}

describe('Fase 1: Sanity & Infrastructure Tests', () => {
  it('1. Vitest runner executes basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect(true).toBe(true)
  })

  it('2. Fast-Check generates random properties correctly', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a
      })
    )
  })

  it('3. React Testing Library renders components into JSDOM', () => {
    render(<DummyBadge title="Wavi Aeronautics Testing" />)
    const badge = screen.getByTestId('dummy-badge')
    expect(badge).toBeInTheDocument()
    expect(screen.getByText('Wavi Aeronautics Testing')).toBeInTheDocument()
  })
})
