'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import Typography from '@/modules/components/Typography'

// Icons (optional, using text if icons not available)
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FiltroProducto = (props) => {
  const {
    filters,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters
  } = props

  // Collapsible state for mobile
  const [isOpen, setIsOpen] = useState(true)

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
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
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
              <input
                type="number"
                placeholder="Mín"
                value={filters.precio.min}
                onChange={(e) => setMinPrice(e.target.value)}
                className="filter-pill"
                style={{ width: '100%', cursor: 'text' }}
              />
              <span style={{ color: '#aaa' }}>—</span>
              <input
                type="number"
                placeholder="Máx"
                value={filters.precio.max}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="filter-pill"
                style={{ width: '100%', cursor: 'text' }}
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
