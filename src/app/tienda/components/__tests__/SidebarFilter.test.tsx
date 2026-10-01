import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarFilter } from '../SidebarFilter'
import type { ProductPriceItem } from '@/types/filter'

// Mock next/navigation
const mockPush = vi.fn()
const mockPathname = vi.fn().mockReturnValue('/tienda/kit-drones')
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: mockPush }),
}))

describe('SidebarFilter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue('/tienda/kit-drones')
  })

  const mockProducts: ProductPriceItem[] = [
    { productID: '1', precio: '$ 1.196.250', brand: 'BetaFPV' },
    { productID: '2', precio: '$ 2.057.550', brand: 'Eachine' },
    { productID: '3', precio: '$ 2.847.075', brand: 'GEPRC' },
  ]

  const defaultProps = {
    products: mockProducts,
    availableBrands: ['BetaFPV', 'Eachine', 'GEPRC', 'Tinyhawk'],
    selectedBrands: ['BetaFPV'],
    sortOrder: 'newest',
    onPriceChange: vi.fn(),
    onToggleBrand: vi.fn(),
    onSortChange: vi.fn(),
    onResetFilters: vi.fn(),
  }

  it('renders the sidebar filter with categories selector, price, sort, and brand sections', () => {
    render(<SidebarFilter {...defaultProps} />)

    expect(screen.getByTestId('sidebar-filter-panel')).toBeInTheDocument()
    expect(screen.getByTestId('categories-section')).toBeInTheDocument()
    expect(screen.getByTestId('category-select')).toBeInTheDocument()
    expect(screen.getByTestId('price-filter-section')).toBeInTheDocument()
    expect(screen.getByTestId('sort-section')).toBeInTheDocument()
    expect(screen.getByTestId('brands-section')).toBeInTheDocument()
    expect(screen.getByTestId('filter-reset-btn')).toBeInTheDocument()
  })

  it('renders category selector dropdown with "Todas las Categorías" as first option and navigates on change', () => {
    mockPathname.mockReturnValue('/tienda/kit-drones')
    render(<SidebarFilter {...defaultProps} />)

    const categorySelect = screen.getByTestId('category-select') as HTMLSelectElement
    expect(categorySelect).toBeInTheDocument()

    // Contains "Todas las Categorías"
    expect(categorySelect.options[0].text).toContain('Todas las Categorías')
    expect(categorySelect.options[0].value).toBe('/tienda/buscar')

    // Preselects current category based on pathname
    expect(categorySelect.value).toBe('/tienda/kit-drones/')

    // Selecting a different category navigates
    fireEvent.change(categorySelect, { target: { value: '/tienda/drones-fpv-hd/' } })
    expect(mockPush).toHaveBeenCalledWith('/tienda/drones-fpv-hd/')
  })

  it('initializes min and max price inputs with zero-config calculated values', () => {
    render(<SidebarFilter {...defaultProps} />)

    const minInput = screen.getByTestId('price-min-input') as HTMLInputElement
    const maxInput = screen.getByTestId('price-max-input') as HTMLInputElement

    expect(minInput.value).toContain('1.196.250')
    expect(maxInput.value).toContain('2.847.075')
  })

  it('renders the dual range slider with technical cyan progress bar', () => {
    render(<SidebarFilter {...defaultProps} />)

    const slider = screen.getByTestId('dual-range-slider')
    expect(slider).toBeInTheDocument()

    const progressBar = screen.getByTestId('slider-progress-bar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar.style.backgroundColor).toBe('rgb(0, 172, 228)')
  })

  it('toggles mobile collapsible section on click', () => {
    render(<SidebarFilter {...defaultProps} />)

    const toggleBtn = screen.getByTestId('filter-toggle-btn')
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('OCULTAR FILTROS')).toBeInTheDocument()

    // Collapse
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('MOSTRAR FILTROS')).toBeInTheDocument()
    expect(screen.queryByTestId('categories-section')).not.toBeInTheDocument()

    // Expand
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('categories-section')).toBeInTheDocument()
  })

  it('handles brand pill selection and triggers onToggleBrand', () => {
    render(<SidebarFilter {...defaultProps} />)

    const eachinePill = screen.getByTestId('brand-pill-Eachine')
    fireEvent.click(eachinePill)

    expect(defaultProps.onToggleBrand).toHaveBeenCalledWith('Eachine')
  })

  it('handles sort order change and triggers onSortChange', () => {
    render(<SidebarFilter {...defaultProps} />)

    const sortSelect = screen.getByTestId('sort-order-select')
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } })

    expect(defaultProps.onSortChange).toHaveBeenCalledWith('price-asc')
  })

  it('handles reset filters button click', () => {
    render(<SidebarFilter {...defaultProps} />)

    const resetBtn = screen.getByTestId('filter-reset-btn')
    fireEvent.click(resetBtn)

    expect(defaultProps.onResetFilters).toHaveBeenCalled()
  })

  describe('VTX System Filtering (Conditional Visibility)', () => {
    it('does NOT render the VTX section when on non-HD category (e.g. /tienda/kit-drones)', () => {
      mockPathname.mockReturnValue('/tienda/kit-drones')
      render(<SidebarFilter {...defaultProps} />)

      expect(screen.queryByTestId('vtx-section')).not.toBeInTheDocument()
    })

    it('renders the VTX section when on Drones HD route (/tienda/drones-fpv-hd)', () => {
      mockPathname.mockReturnValue('/tienda/drones-fpv-hd')
      render(<SidebarFilter {...defaultProps} />)

      expect(screen.getByTestId('vtx-section')).toBeInTheDocument()
      expect(screen.getByText('SISTEMA VTX')).toBeInTheDocument()
    })

    it('renders the VTX section when on "Todas las Categorías" route (/tienda/buscar)', () => {
      mockPathname.mockReturnValue('/tienda/buscar')
      render(<SidebarFilter {...defaultProps} />)

      expect(screen.getByTestId('vtx-section')).toBeInTheDocument()
    })

    it('renders the VTX section when category prop is explicitly "dronesHD"', () => {
      mockPathname.mockReturnValue('/tienda/other')
      render(<SidebarFilter {...defaultProps} category="dronesHD" />)

      expect(screen.getByTestId('vtx-section')).toBeInTheDocument()
    })

    it('renders all 6 canonical VTX options in the VTX section', () => {
      mockPathname.mockReturnValue('/tienda/drones-fpv-hd')
      render(<SidebarFilter {...defaultProps} />)

      expect(screen.getByTestId('vtx-pill-wtfpv')).toHaveTextContent('WTFPV')
      expect(screen.getByTestId('vtx-pill-analogico')).toHaveTextContent('Analógico')
      expect(screen.getByTestId('vtx-pill-o3')).toHaveTextContent('O3')
      expect(screen.getByTestId('vtx-pill-o4')).toHaveTextContent('O4')
      expect(screen.getByTestId('vtx-pill-wasp')).toHaveTextContent('WASP (RunCam)')
      expect(screen.getByTestId('vtx-pill-walksnail')).toHaveTextContent('Walksnail Avatar (CaddxFPV)')
    })

    it('triggers onToggleVtxSystem when clicking a VTX pill', () => {
      mockPathname.mockReturnValue('/tienda/drones-fpv-hd')
      const onToggleVtxSystem = vi.fn()
      render(<SidebarFilter {...defaultProps} onToggleVtxSystem={onToggleVtxSystem} />)

      fireEvent.click(screen.getByTestId('vtx-pill-o3'))
      expect(onToggleVtxSystem).toHaveBeenCalledWith('o3')

      fireEvent.click(screen.getByTestId('vtx-pill-walksnail'))
      expect(onToggleVtxSystem).toHaveBeenCalledWith('walksnail')
    })

    it('supports multiple selected VTX pills with active styles', () => {
      mockPathname.mockReturnValue('/tienda/drones-fpv-hd')
      render(
        <SidebarFilter
          {...defaultProps}
          selectedVtxSystems={['o3', 'wasp']}
        />
      )

      const o3Pill = screen.getByTestId('vtx-pill-o3')
      const waspPill = screen.getByTestId('vtx-pill-wasp')
      const analogPill = screen.getByTestId('vtx-pill-analogico')

      expect(o3Pill).toHaveClass('active')
      expect(o3Pill).toHaveAttribute('aria-pressed', 'true')

      expect(waspPill).toHaveClass('active')
      expect(waspPill).toHaveAttribute('aria-pressed', 'true')

      expect(analogPill).not.toHaveClass('active')
      expect(analogPill).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
