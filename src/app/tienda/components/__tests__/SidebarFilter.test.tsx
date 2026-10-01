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

  describe('POR CELDAS Battery Filtering (Category Baterías)', () => {
    const batteryProducts: ProductPriceItem[] = [
      { productID: 'b1', name: 'BetaFPV 1S-300mAh LiPo', precio: '$ 45.000' },
      { productID: 'b2', name: 'BetaFPV 1S-450mAh LiPo', precio: '$ 55.000' },
      { productID: 'b3', name: 'GEPRC 4S-650mAh LiPo', precio: '$ 120.000' },
      { productID: 'b4', name: 'Tattu 6S-1400mAh LiPo', precio: '$ 210.000' }
    ]

    it('displays "Baterías" in the category selector dropdown (renamed from Accesorios)', () => {
      render(<SidebarFilter {...defaultProps} />)
      const select = screen.getByTestId('category-select') as HTMLSelectElement
      const optionTexts = Array.from(select.options).map((opt) => opt.text)

      expect(optionTexts).toContain('Baterías')
      expect(optionTexts).not.toContain('Accesorios')
    })

    it('does NOT render the POR CELDAS section when on other categories (e.g. /tienda/kit-drones)', () => {
      mockPathname.mockReturnValue('/tienda/kit-drones')
      render(<SidebarFilter {...defaultProps} />)

      expect(screen.queryByTestId('battery-cells-section')).not.toBeInTheDocument()
    })

    it('renders the POR CELDAS section when on /tienda/accesorios route', () => {
      mockPathname.mockReturnValue('/tienda/accesorios')
      render(<SidebarFilter {...defaultProps} products={batteryProducts} />)

      expect(screen.getByTestId('battery-cells-section')).toBeInTheDocument()
      expect(screen.getByText('POR CELDAS')).toBeInTheDocument()
    })

    it('renders the POR CELDAS section when category prop is "baterias"', () => {
      mockPathname.mockReturnValue('/tienda/other')
      render(<SidebarFilter {...defaultProps} category="baterias" products={batteryProducts} />)

      expect(screen.getByTestId('battery-cells-section')).toBeInTheDocument()
    })

    it('displays dynamic product counts for each cell count matching the provided products', () => {
      mockPathname.mockReturnValue('/tienda/accesorios')
      render(<SidebarFilter {...defaultProps} products={batteryProducts} />)

      // 1S has 2 products
      expect(screen.getByTestId('battery-cell-count-1S')).toHaveTextContent('2')
      // 4S has 1 product
      expect(screen.getByTestId('battery-cell-count-4S')).toHaveTextContent('1')
      // 6S has 1 product
      expect(screen.getByTestId('battery-cell-count-6S')).toHaveTextContent('1')
      // 2S has 0 products
      expect(screen.getByTestId('battery-cell-count-2S')).toHaveTextContent('0')
    })

    it('triggers onToggleBatteryCell when clicking a battery cell row', () => {
      mockPathname.mockReturnValue('/tienda/accesorios')
      const onToggleBatteryCell = vi.fn()
      render(
        <SidebarFilter
          {...defaultProps}
          products={batteryProducts}
          onToggleBatteryCell={onToggleBatteryCell}
        />
      )

      fireEvent.click(screen.getByTestId('battery-cell-row-4S'))
      expect(onToggleBatteryCell).toHaveBeenCalledWith('4S')
    })

    it('highlights selected battery cells with active state', () => {
      mockPathname.mockReturnValue('/tienda/accesorios')
      render(
        <SidebarFilter
          {...defaultProps}
          products={batteryProducts}
          selectedBatteryCells={['4S', '6S']}
        />
      )

      const row4S = screen.getByTestId('battery-cell-row-4S')
      const row6S = screen.getByTestId('battery-cell-row-6S')
      const row1S = screen.getByTestId('battery-cell-row-1S')

      expect(row4S).toHaveClass('active')
      expect(row4S).toHaveAttribute('aria-pressed', 'true')

      expect(row6S).toHaveClass('active')
      expect(row6S).toHaveAttribute('aria-pressed', 'true')

      expect(row1S).not.toHaveClass('active')
      expect(row1S).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('Responsive Collapsible Behavior', () => {
    it('is open by default on desktop view', () => {
      render(<SidebarFilter {...defaultProps} />)

      const toggleBtn = screen.getByTestId('filter-toggle-btn')
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('OCULTAR FILTROS')).toBeInTheDocument()
      expect(screen.getByTestId('categories-section')).toBeInTheDocument()
    })

    it('is inactive/collapsed by default when defaultOpen is false (mobile behavior)', () => {
      render(<SidebarFilter {...defaultProps} defaultOpen={false} />)

      const toggleBtn = screen.getByTestId('filter-toggle-btn')
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')
      expect(screen.getByText('MOSTRAR FILTROS')).toBeInTheDocument()
      expect(screen.queryByTestId('categories-section')).not.toBeInTheDocument()

      // Clicking opens the panel
      fireEvent.click(toggleBtn)
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('OCULTAR FILTROS')).toBeInTheDocument()
      expect(screen.getByTestId('categories-section')).toBeInTheDocument()
    })
  })
})
