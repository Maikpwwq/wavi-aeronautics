'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { routes as STORE_ROUTES } from '@/app/tienda/components/header/headerRoutes'
import { useSidebarFilter } from '@/app/tienda/hooks/useSidebarFilter'
import { matchesBrand } from '@/utilities/brandsConfig'
import { formatCurrency } from '@/utilities/priceUtils'
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

  const minPercent = Math.min(Math.max(0, ((minVal - min) / totalRange) * 100), 100)
  const maxPercent = Math.min(Math.max(0, ((maxVal - min) / totalRange) * 100), 100)
  const step = Math.max(1000, Math.round(totalRange / 100))

  return (
    <div
      className="filter-slider-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none'
      }}
      data-testid="dual-range-slider"
    >
      {/* Background Track */}
      <div
        className="filter-slider-track"
        style={{
          position: 'relative',
          width: '100%',
          height: '5px',
          backgroundColor: '#333',
          borderRadius: '3px',
          overflow: 'hidden'
        }}
      >
        {/* Technical Cyan Progress Line */}
        <div
          data-testid="slider-progress-bar"
          className="filter-slider-progress"
          style={{
            position: 'absolute',
            height: '100%',
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
            backgroundColor: '#00aCe4',
            borderRadius: '3px',
            boxShadow: '0 0 8px rgba(0, 172, 228, 0.6)'
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
        style={{ zIndex: minVal > max - 1000 ? 5 : 3 }}
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
        style={{ zIndex: 4 }}
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
  const router = useRouter()
  const pathname = usePathname() || ''
  const [isOpen, setIsOpen] = useState(true)

  // Resolve legacy props
  const activeBrands = selectedBrandsProp || filters?.brands || []
  const availableBrands = availableBrandsProp || legacyAvailableBrands || []
  const currentSortOrder = sortOrderProp || legacySortOrder || 'newest'
  const handleToggleBrand = onToggleBrand || legacyToggleBrand
  const handleSortChange = onSortChange || legacySetSortOrder
  const handleResetFilters = onResetFilters || legacyResetFilters

  const initialMin = filters?.price?.min
  const initialMax = filters?.price?.max

  // Custom hook: zero-config bounds, bidirectional binding, debounce
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

  // Detect which category is currently active in the dropdown selector
  const cleanPath = pathname.replace(/\/$/, '')
  const activeCategory = STORE_ROUTES.find((cat) => {
    const cleanHref = cat.href.replace(/\/$/, '')
    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`)
  })
  const currentCategoryValue = activeCategory ? activeCategory.href : '/tienda/buscar'

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetUrl = e.target.value
    if (targetUrl) {
      router.push(targetUrl)
    }
  }

  return (
    <aside
      className={`filter-panel ${className}`}
      style={{
        backgroundColor: '#1e1e1f',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '280px',
        boxSizing: 'border-box'
      }}
      aria-label="Panel de filtros de tienda"
      data-testid="sidebar-filter-panel"
    >
      {/* ── HEADER / MOBILE COLLAPSIBLE TOGGLER ── */}
      <div
        className="filter-section-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0.75rem 1rem',
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '6px',
          userSelect: 'none',
          marginBottom: '1rem',
          transition: 'background-color 0.2s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen)
        }}
        aria-expanded={isOpen}
        data-testid="filter-toggle-btn"
      >
        <span
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {isOpen ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eee' }}>
          {isOpen ? '−' : '+'}
        </span>
      </div>

      {isOpen && (
        <>
          {/* ────────────────────────────────────────────────────────────── */}
          {/* 1. CATEGORÍAS: SELECTOR DROPDOWN (CON OPCIÓN TODAS)            */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div
            className="filter-section"
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #333'
            }}
            data-testid="categories-section"
          >
            <label
              htmlFor="category-select"
              className="filter-section-title"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                color: '#aaa',
                letterSpacing: '0.5px'
              }}
            >
              CATEGORÍAS
            </label>
            <select
              id="category-select"
              aria-label="Seleccionar categoría"
              value={currentCategoryValue}
              onChange={handleCategorySelectChange}
              className="filter-select"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.23)',
                backgroundColor: '#2a2a2a',
                color: '#eee',
                cursor: 'pointer',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              data-testid="category-select"
            >
              <option value="/tienda/buscar" style={{ backgroundColor: '#1e1e1f', color: '#eee' }}>
                Todas las Categorías
              </option>
              {STORE_ROUTES.map((category) => (
                <option
                  key={category.slug}
                  value={category.href}
                  style={{ backgroundColor: '#1e1e1f', color: '#eee' }}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 2. PRECIO DINÁMICO & DUAL RANGE SLIDER (ZERO-CONFIG)          */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div
            className="filter-section"
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #333'
            }}
            data-testid="price-filter-section"
          >
            <div
              className="filter-section-title"
              style={{
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                color: '#aaa',
                letterSpacing: '0.5px'
              }}
            >
              PRECIO
            </div>
            <div
              className="filter-price-row"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                id="price-min-input"
                type="text"
                placeholder="Mín"
                aria-label="Precio mínimo"
                value={minInputText}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleMinInputBlur()}
                className="filter-pill"
                style={{
                  width: '100%',
                  cursor: 'text',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#eee',
                  borderRadius: '20px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.85rem'
                }}
                data-testid="price-min-input"
              />
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>—</span>
              <input
                id="price-max-input"
                type="text"
                placeholder="Máx"
                aria-label="Precio máximo"
                value={maxInputText}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleMaxInputBlur()}
                className="filter-pill"
                style={{
                  width: '100%',
                  cursor: 'text',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#eee',
                  borderRadius: '20px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.85rem'
                }}
                data-testid="price-max-input"
              />
            </div>

            {/* Dual Range Slider with Technical Cyan Progress Line */}
            <div style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>
              <DualRangeSlider
                min={absoluteMin}
                max={absoluteMax}
                value={sliderRange}
                onChange={handleSliderChange}
              />
              <div
                className="filter-slider-bounds"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#777',
                  marginTop: '0.35rem',
                  fontFamily: 'monospace'
                }}
              >
                <span>{formatCurrency(absoluteMin)}</span>
                <span>{formatCurrency(absoluteMax)}</span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 3. ORDENAR POR                                                 */}
          {/* ────────────────────────────────────────────────────────────── */}
          {handleSortChange && (
            <div
              className="filter-section"
              style={{
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #333'
              }}
              data-testid="sort-section"
            >
              <label
                htmlFor="sort-order-select"
                className="filter-section-title"
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  letterSpacing: '0.5px'
                }}
              >
                ORDENAR POR
              </label>
              <select
                id="sort-order-select"
                aria-label="Ordenar productos por"
                value={currentSortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="filter-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.23)',
                  backgroundColor: '#2a2a2a',
                  color: '#eee',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                data-testid="sort-order-select"
              >
                <option value="newest" style={{ backgroundColor: '#1e1e1f', color: '#eee' }}>
                  Más Nuevo
                </option>
                <option value="oldest" style={{ backgroundColor: '#1e1e1f', color: '#eee' }}>
                  Más Antiguo
                </option>
                <option value="price-asc" style={{ backgroundColor: '#1e1e1f', color: '#eee' }}>
                  Precio: Menor a Mayor
                </option>
                <option value="price-desc" style={{ backgroundColor: '#1e1e1f', color: '#eee' }}>
                  Precio: Mayor a Menor
                </option>
              </select>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 4. MARCA                                                       */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div
            className="filter-section"
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #333'
            }}
            data-testid="brands-section"
          >
            <div
              className="filter-section-title"
              style={{
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                color: '#aaa',
                letterSpacing: '0.5px'
              }}
            >
              MARCA
            </div>
            <div
              className="filter-pills"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {availableBrands.length > 0 ? (
                availableBrands.map((brand) => {
                  const isSelected = activeBrands.some(
                    (b) => matchesBrand(brand, b) || b.toLowerCase() === brand.toLowerCase()
                  )
                  return (
                    <div
                      key={brand}
                      className={`filter-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => handleToggleBrand && handleToggleBrand(brand)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggleBrand && handleToggleBrand(brand)
                        }
                      }}
                      data-testid={`brand-pill-${brand}`}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        userSelect: 'none',
                        backgroundColor: isSelected ? '#00aCe4' : '#2a2a2a',
                        color: isSelected ? '#ffffff' : '#eeeeee',
                        borderColor: isSelected ? '#00aCe4' : '#444444',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        fontWeight: isSelected ? 600 : 400,
                        boxShadow: isSelected ? '0 2px 6px rgba(0, 172, 228, 0.4)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {brand}
                    </div>
                  )
                })
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
                  No hay marcas disponibles
                </span>
              )}
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* 5. LIMPIAR FILTROS                                             */}
          {/* ────────────────────────────────────────────────────────────── */}
          <button
            type="button"
            className="filter-reset-btn"
            onClick={handleGlobalReset}
            data-testid="filter-reset-btn"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: '1px dashed #666',
              color: '#aaa',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Limpiar Filtros
          </button>
        </>
      )}
    </aside>
  )
}

export default SidebarFilter
