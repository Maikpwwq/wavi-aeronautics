'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes as STORE_ROUTES } from '@/app/tienda/components/header/headerRoutes'
import { useSidebarFilter } from '@/app/tienda/hooks/useSidebarFilter'
import { matchesBrand } from '@/utilities/brandsConfig'
import type { SidebarFilterProps } from '@/types/filter'

// ── DUAL RANGE SLIDER SUB-COMPONENT ──────────────────────────────────────────
interface DualSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (val: [number, number]) => void
}

const DualRangeSlider: React.FC<DualSliderProps> = ({ min, max, value, onChange }) => {
  const [minVal, maxVal] = value
  const totalRange = max - min || 1

  // Calculate percentages for technical cyan progress track
  const minPercent = Math.min(Math.max(0, ((minVal - min) / totalRange) * 100), 100)
  const maxPercent = Math.min(Math.max(0, ((maxVal - min) / totalRange) * 100), 100)

  const step = Math.max(1000, Math.round(totalRange / 100))

  return (
    <div className="relative w-full py-4 select-none" data-testid="dual-range-slider">
      {/* Dark Neutral Background Track */}
      <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        {/* Highlighted Progress Track (Technical Cyan Neon Glow) */}
        <div
          data-testid="slider-progress-bar"
          className="absolute h-full bg-[#00aCe4] rounded-full shadow-[0_0_10px_rgba(0,172,228,0.6)]"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`
          }}
        />
      </div>

      {/* Input Slider 1: Minimum Handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        aria-label="Precio mínimo"
        onChange={(e) => {
          const val = Math.min(Number(e.target.value), maxVal)
          onChange([val, maxVal])
        }}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-0 w-full h-1.5 opacity-0 cursor-pointer z-20 
                   [&::-webkit-slider-thumb]:pointer-events-auto 
                   [&::-webkit-slider-thumb]:w-5 
                   [&::-webkit-slider-thumb]:h-5 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-white 
                   [&::-webkit-slider-thumb]:border-2 
                   [&::-webkit-slider-thumb]:border-[#00aCe4] 
                   [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.6)] 
                   [&::-webkit-slider-thumb]:cursor-grab
                   [&::-webkit-slider-thumb]:active:cursor-grabbing
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:pointer-events-auto 
                   [&::-moz-range-thumb]:w-5 
                   [&::-moz-range-thumb]:h-5 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-white 
                   [&::-moz-range-thumb]:border-2 
                   [&::-moz-range-thumb]:border-[#00aCe4] 
                   [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.6)] 
                   [&::-moz-range-thumb]:cursor-grab"
        style={{ zIndex: minVal > max - 1000 ? 25 : 20 }}
      />

      {/* Input Slider 2: Maximum Handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        aria-label="Precio máximo"
        onChange={(e) => {
          const val = Math.max(Number(e.target.value), minVal)
          onChange([minVal, val])
        }}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-0 w-full h-1.5 opacity-0 cursor-pointer z-20 
                   [&::-webkit-slider-thumb]:pointer-events-auto 
                   [&::-webkit-slider-thumb]:w-5 
                   [&::-webkit-slider-thumb]:h-5 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-white 
                   [&::-webkit-slider-thumb]:border-2 
                   [&::-webkit-slider-thumb]:border-[#00aCe4] 
                   [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.6)] 
                   [&::-webkit-slider-thumb]:cursor-grab
                   [&::-webkit-slider-thumb]:active:cursor-grabbing
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:pointer-events-auto 
                   [&::-moz-range-thumb]:w-5 
                   [&::-moz-range-thumb]:h-5 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-white 
                   [&::-moz-range-thumb]:border-2 
                   [&::-moz-range-thumb]:border-[#00aCe4] 
                   [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.6)] 
                   [&::-moz-range-thumb]:cursor-grab"
      />
    </div>
  )
}

// ── MAIN COMPONENT: SIDEBAR FILTER ──────────────────────────────────────────
export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  products = [],
  selectedBrands: selectedBrandsProp,
  availableBrands: availableBrandsProp,
  sortOrder: sortOrderProp,
  onPriceChange,
  onToggleBrand,
  onSortChange,
  onResetFilters,
  // Legacy prop adapters
  filters,
  availableBrands: legacyAvailableBrands,
  toggleBrand: legacyToggleBrand,
  setMinPrice,
  setMaxPrice,
  resetFilters: legacyResetFilters,
  sortOrder: legacySortOrder,
  setSortOrder: legacySetSortOrder,
  className = ''
}) => {
  const pathname = usePathname() || ''
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)

  // Resolve legacy props if passed
  const activeBrands = selectedBrandsProp || filters?.brands || []
  const availableBrands = availableBrandsProp || legacyAvailableBrands || []
  const currentSortOrder = sortOrderProp || legacySortOrder || 'newest'
  const handleToggleBrand = onToggleBrand || legacyToggleBrand
  const handleSortChange = onSortChange || legacySetSortOrder
  const handleResetFilters = onResetFilters || legacyResetFilters

  // Extract initial bounds from legacy filters if available
  const initialMin = filters?.price?.min
  const initialMax = filters?.price?.max

  // Custom hook: decouples calculation, binding, clamping, and debounce
  const {
    absoluteMin,
    absoluteMax,
    sliderRange,
    minInputText,
    maxInputText,
    handleSliderChange,
    handleMinInputChange,
    handleMinInputBlur,
    handleMaxInputChange,
    handleMaxInputBlur,
    handleResetPrice
  } = useSidebarFilter({
    products,
    debounceMs: 300,
    onPriceChange,
    setMinPrice,
    setMaxPrice,
    initialMin,
    initialMax
  })

  const handleGlobalReset = () => {
    handleResetPrice()
    if (handleResetFilters) {
      handleResetFilters()
    }
  }

  return (
    <aside
      className={`filter-panel w-full md:w-[280px] shrink-0 bg-[#0f172a] text-slate-200 rounded-xl border border-slate-800/90 p-4 shadow-2xl transition-all duration-200 ${className}`}
      aria-label="Panel de filtros de tienda"
      data-testid="sidebar-filter-panel"
    >
      {/* ── MOBILE COLLAPSIBLE TOGGLER ── */}
      <button
        type="button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="w-full flex items-center justify-between p-2.5 mb-3 bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-bold text-xs tracking-wider uppercase rounded-lg border border-slate-700/60 transition-colors"
        aria-expanded={isFilterOpen}
        data-testid="filter-toggle-btn"
      >
        <span className="font-semibold">{isFilterOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
        <span className="text-lg leading-none font-mono text-[#00aCe4]">
          {isFilterOpen ? '−' : '+'}
        </span>
      </button>

      {isFilterOpen && (
        <div className="space-y-6">
          {/* ────────────────────────────────────────────────────────────── */}
          {/* 1. ACCORDION STYLE: CATEGORÍAS EN BLOQUE                      */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="border-b border-slate-800/80 pb-5" data-testid="categories-section">
            <button
              type="button"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-3 transition-colors"
              aria-expanded={isCategoriesOpen}
            >
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00aCe4]" />
                Categorías
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isCategoriesOpen ? '▲' : '▼'}
              </span>
            </button>

            {isCategoriesOpen && (
              <nav className="flex flex-col gap-1.5" aria-label="Navegación de categorías">
                {/* Mandatory Top Option: TODAS */}
                <Link
                  href="/tienda/buscar"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    pathname === '/tienda' || pathname === '/tienda/buscar'
                      ? 'bg-[#00aCe4] text-white shadow-md shadow-cyan-500/25 font-bold ring-1 ring-cyan-400'
                      : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700'
                  }`}
                  data-testid="category-btn-all"
                >
                  <span>TODAS LAS CATEGORÍAS</span>
                  {(pathname === '/tienda' || pathname === '/tienda/buscar') ? (
                    <span className="text-xs font-bold" aria-label="Activo">✓</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">→</span>
                  )}
                </Link>

                {/* Stacked Category Blocks */}
                {STORE_ROUTES.map((category) => {
                  const cleanHref = category.href.replace(/\/$/, '')
                  const cleanPath = pathname.replace(/\/$/, '')
                  const isActive = cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`)
                  return (
                    <Link
                      key={category.slug}
                      href={category.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#00aCe4] text-white shadow-md shadow-cyan-500/25 font-bold ring-1 ring-cyan-400'
                          : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700'
                      }`}
                      data-testid={`category-btn-${category.slug}`}
                    >
                      <span className="truncate">{category.label}</span>
                      {isActive ? (
                        <span className="text-xs font-bold" aria-label="Activo">✓</span>
                      ) : (
                        <span className="text-slate-500 text-[10px] group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 2. DYNAMIC PRICE RANGE & DUAL SLIDER (ZERO-CONFIG)            */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="border-b border-slate-800/80 pb-5" data-testid="price-filter-section">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00aCe4]" />
                Precio
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                COP$
              </span>
            </div>

            {/* Bidirectional Text Inputs */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label htmlFor="price-min-input" className="block text-[10px] font-mono text-slate-400 mb-1">
                  MÍN (COP$)
                </label>
                <input
                  id="price-min-input"
                  type="text"
                  value={minInputText}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleMinInputBlur()}
                  placeholder="Mín"
                  aria-label="Precio mínimo en COP"
                  className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-[#00aCe4] focus:ring-1 focus:ring-[#00aCe4] transition-all"
                  data-testid="price-min-input"
                />
              </div>
              <div>
                <label htmlFor="price-max-input" className="block text-[10px] font-mono text-slate-400 mb-1">
                  MÁX (COP$)
                </label>
                <input
                  id="price-max-input"
                  type="text"
                  value={maxInputText}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleMaxInputBlur()}
                  placeholder="Máx"
                  aria-label="Precio máximo en COP"
                  className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-[#00aCe4] focus:ring-1 focus:ring-[#00aCe4] transition-all"
                  data-testid="price-max-input"
                />
              </div>
            </div>

            {/* Dual Range Slider with Cyan Progress Line */}
            <DualRangeSlider
              min={absoluteMin}
              max={absoluteMax}
              value={sliderRange}
              onChange={handleSliderChange}
            />

            {/* Extrema bounds display in muted text */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
              <span>Min: ${absoluteMin.toLocaleString('es-CO')}</span>
              <span>Max: ${absoluteMax.toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 3. SORTING DROPDOWN                                            */}
          {/* ────────────────────────────────────────────────────────────── */}
          {handleSortChange && (
            <div className="border-b border-slate-800/80 pb-5" data-testid="sort-section">
              <label
                htmlFor="sort-order-select"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-bold"
              >
                Ordenar Por
              </label>
              <select
                id="sort-order-select"
                value={currentSortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-[#00aCe4]"
                data-testid="sort-order-select"
              >
                <option value="newest">Más Nuevo</option>
                <option value="oldest">Más Antiguo</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 4. BRAND PILLS FILTER                                          */}
          {/* ────────────────────────────────────────────────────────────── */}
          {handleToggleBrand && (
            <div className="border-b border-slate-800/80 pb-5" data-testid="brands-section">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 font-bold">
                Marca
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableBrands.length > 0 ? (
                  availableBrands.map((brand) => {
                    const isSelected = activeBrands.some(
                      (b) => matchesBrand(brand, b) || b.toLowerCase() === brand.toLowerCase()
                    )
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleToggleBrand(brand)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#00aCe4] text-white shadow-sm shadow-cyan-500/30 border border-cyan-400 font-semibold'
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                        data-testid={`brand-pill-${brand}`}
                      >
                        {brand}
                      </button>
                    )
                  })
                ) : (
                  <span className="text-xs text-slate-500 italic">No hay marcas disponibles</span>
                )}
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 5. RESET ACTION                                                */}
          {/* ────────────────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleGlobalReset}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold tracking-wider uppercase rounded-lg border border-dashed border-slate-700 hover:border-red-500/50 transition-all"
            data-testid="filter-reset-btn"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </aside>
  )
}

export default SidebarFilter
