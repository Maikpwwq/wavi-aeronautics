'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@/modules/components/Typography'

// Icons (optional, using text if icons not available)
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { formatCurrency, parseCopCurrency } from '@/utilities/priceUtils'

const PriceInput = ({ value, onChange, placeholder }) => {
  const [localValue, setLocalValue] = useState(value ? formatCurrency(value) : '')

  React.useEffect(() => {
    // Update local value when external value changes (e.g. reset)
    if (value === '' || value === 0) {
      setLocalValue('')
    } else {
       // Only format if specialized logic needed, otherwise trust user input until blur
       // But if external updates happen (reset), we want to format
       setLocalValue(formatCurrency(value))
    }
  }, [value])

  const handleChange = (e) => {
    // Allow user to type, stripping formatted chars to keep it sane or just let them type
    // Better: let them type, process on blur? or formatting as they type?
    // Simple approach: Allow typing numbers, format on blur
    // For now, let's just let them type whatever, and try to keep it numeric-ish
    setLocalValue(e.target.value)
  }

  const handleBlur = () => {
    const numeric = parseCopCurrency(localValue)
    if (numeric > 0) {
      setLocalValue(formatCurrency(numeric))
      onChange(numeric)
    } else {
      setLocalValue('')
      onChange('')
    }
  }
  
  const handleKeyDown = (e) => {
     if (e.key === 'Enter') {
        handleBlur()
     }
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="filter-pill"
      style={{ width: '100%', cursor: 'text' }}
    />
  )
}

const FiltroProducto = (props) => {
  const {
    filters,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters
  } = props

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  // Collapsible state for mobile (default open on desktop, closed on mobile)
  const [isOpen, setIsOpen] = useState(false)

  // Sync open state with screen size on mount/change, but allow user override? 
  // Better: Just set initial based on media query if possible, or use effect.
  // Since this is client-side, we can use useEffect to set the default once mounted.
  React.useEffect(() => {
    setIsOpen(isDesktop)
  }, [isDesktop])


  if (!filters) return null

  return (
    <div className="filter-panel">
      {/* Header - Collapsible Toggler */}
      <div 
        className="filter-section-header" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen) }}
        aria-expanded={isOpen}
      >
        <Typography variant="h6" style={{ color: '#eee' }} sx={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
          {isOpen ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
        </Typography>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {isOpen ? '−' : '+'}
        </span>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <>
          {/* Price Section */}
          <div className="filter-section">
            <div className="filter-section-title">PRECIO</div>
            <div className="filter-price-row">
              <PriceInput 
                placeholder="Mín"
                value={filters.precio.min}
                onChange={(val) => setMinPrice(val)}
              />
              <span style={{ color: '#aaa' }}>—</span>
              <PriceInput 
                placeholder="Máx"
                value={filters.precio.max}
                onChange={(val) => setMaxPrice(val)}
              />
            </div>
          </div>

          {/* Brands Section */}
          <div className="filter-section">
            <div className="filter-section-title">MARCA</div>
            <div className="filter-pills">
              {availableMarcas.length > 0 ? (
                availableMarcas.map((marca) => (
                  <div
                    key={marca}
                    className={`filter-pill ${filters.marcas.includes(marca) ? 'active' : ''}`}
                    onClick={() => toggleMarca(marca)}
                  >
                    {marca}
                  </div>
                ))
              ) : (
                <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
                  No hay marcas disponibles
                </Typography>
              )}
            </div>
          </div>

          {/* Reset Action */}
          <button className="filter-reset-btn" onClick={resetFilters}>
            Limpiar Filtros
          </button>
        </>
      )}
    </div>
  )
}

FiltroProducto.propTypes = {
  filters: PropTypes.object.isRequired,
  availableMarcas: PropTypes.array.isRequired,
  toggleMarca: PropTypes.func.isRequired,
  setMinPrice: PropTypes.func.isRequired,
  setMaxPrice: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired
}

export default FiltroProducto
