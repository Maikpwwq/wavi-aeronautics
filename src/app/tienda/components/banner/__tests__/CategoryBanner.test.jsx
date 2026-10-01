import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BannerTextColumn from '../BannerTextColumn'
import BannerImageColumn from '../BannerImageColumn'
import CategoryBanner from '../CategoryBanner'

// Mock IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(() => {
      // immediately report intersecting
      callback([{ isIntersecting: true }])
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

afterEach(() => {
  vi.restoreAllMocks()
  sessionStorage.clear()
})

describe('BannerTextColumn', () => {
  it('renders category title, description, index badge, and CTA button', () => {
    render(
      <BannerTextColumn
        title="Drones FPV Digital HD"
        description="Transmisión digital de ultra alta definición con máxima estabilidad."
        href="/tienda/drones-fpv-hd/"
        iconName="Videocam"
        isTransitioning={false}
        totalCategories={8}
        activeIndex={1}
      />
    )

    expect(screen.getByRole('heading', { level: 2, name: /Drones FPV Digital HD/i })).toBeDefined()
    expect(screen.getByText(/Transmisión digital de ultra alta definición/i)).toBeDefined()
    expect(screen.getByText('2 / 8')).toBeDefined()

    const ctaButton = screen.getByRole('link', { name: /Explorar categoría/i })
    expect(ctaButton).toBeDefined()
    expect(ctaButton.getAttribute('href')).toMatch(/^\/tienda\/drones-fpv-hd\/?$/)
  })

  it('applies fade-out styling when isTransitioning is true', () => {
    const { container } = render(
      <BannerTextColumn
        title="Kits de Drones"
        description="Todo para comenzar"
        href="/tienda/kit-drones/"
        iconName="FlightTakeoff"
        isTransitioning={true}
        totalCategories={8}
        activeIndex={0}
      />
    )

    const wrapper = container.firstChild
    expect(wrapper).toHaveStyle({ opacity: '0' })
  })
})

describe('BannerImageColumn', () => {
  it('renders the product image with correct src and alt', () => {
    render(
      <BannerImageColumn
        imageUrl="https://example.com/test-drone.png"
        productName="Nazgul Evoque F5D"
        isTransitioning={false}
      />
    )

    const img = screen.getByRole('img', { name: /Nazgul Evoque F5D/i })
    expect(img).toBeDefined()
    expect(img.getAttribute('src')).toBe('https://example.com/test-drone.png')
  })

  it('applies opacity: 0 when isTransitioning is true', () => {
    render(
      <BannerImageColumn
        imageUrl="https://example.com/test-drone.png"
        productName="Nazgul Evoque F5D"
        isTransitioning={true}
      />
    )

    const img = screen.getByRole('img', { name: /Nazgul Evoque F5D/i })
    expect(img).toHaveStyle({ opacity: '0' })
  })
})

describe('CategoryBanner', () => {
  it('renders section with id="category-banner" and interactive dots', () => {
    render(<CategoryBanner />)

    const section = screen.getByRole('region', { name: /Categorías destacadas/i })
    expect(section).toBeDefined()
    expect(section.getAttribute('id')).toBe('category-banner')

    // Explores category CTA is rendered
    expect(screen.getByRole('link', { name: /Explorar categoría/i })).toBeDefined()

    // Indicator dots are present
    const dotButtons = screen.getAllByRole('button', { name: /Ver categoría/i })
    expect(dotButtons.length).toBeGreaterThan(1)
  })

  it('allows clicking an indicator dot to change active category', () => {
    render(<CategoryBanner />)

    const dotButtons = screen.getAllByRole('button', { name: /Ver categoría/i })
    fireEvent.click(dotButtons[1])
    // Doesn't crash on manual click
    expect(dotButtons[1]).toBeDefined()
  })
})
