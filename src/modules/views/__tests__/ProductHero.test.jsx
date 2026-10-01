import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ProductHero from '../ProductHero'

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {
    this.callback([{ isIntersecting: true }])
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  global.IntersectionObserver = MockIntersectionObserver
})

afterEach(() => {
  vi.restoreAllMocks()
  sessionStorage.clear()
})

describe('ProductHero Unified Banner', () => {
  it('renders the initial General Cover with Encuentra tu Dron and CTA', () => {
    render(<ProductHero />)

    expect(screen.getByRole('heading', { level: 1, name: /Encuentra tu Dron/i })).toBeDefined()
    expect(screen.getByText(/Tienda de drones, equipos FPV y tecnología VToL/i)).toBeDefined()
    expect(screen.getByRole('link', { name: /Ver Equipos/i })).toBeDefined()
    expect(screen.getByText(/TIENDA OFICIAL DE TECNOLOGÍA AÉREA/i)).toBeDefined()
  })

  it('renders slide navigation dots for general cover and categories', () => {
    render(<ProductHero />)

    const dots = screen.getAllByRole('button', { name: /(Portada Principal|Ver)/i })
    expect(dots.length).toBeGreaterThan(1)
    expect(dots[0].getAttribute('aria-label')).toBe('Portada Principal')
  })

  it('transitions to category view when a category dot is clicked', () => {
    vi.useFakeTimers()

    render(<ProductHero />)

    const dots = screen.getAllByRole('button', { name: /(Portada Principal|Ver)/i })
    // Click second dot (first category)
    act(() => {
      fireEvent.click(dots[1])
      vi.advanceTimersByTime(350)
    })

    // Now should show the category CTA
    expect(screen.getByRole('link', { name: /Explorar categoría/i })).toBeDefined()

    vi.useRealTimers()
  })
})
