'use client'

import React from 'react'
import PropTypes from 'prop-types'
import SidebarFilter from './SidebarFilter'

/**
 * FiltroProducto — Backward-compatible wrapper over modern SidebarFilter
 *
 * Provides Zero-Config dynamic price synchronization, dual range slider with
 * technical cyan progress line, accordion-style stacked category blocks, and 300ms debounce.
 */
const FiltroProducto = (props) => {
  return <SidebarFilter {...props} />
}

FiltroProducto.propTypes = {
  products: PropTypes.array,
  filters: PropTypes.object,
  availableBrands: PropTypes.array,
  toggleBrand: PropTypes.func,
  setMinPrice: PropTypes.func,
  setMaxPrice: PropTypes.func,
  resetFilters: PropTypes.func,
  sortOrder: PropTypes.string,
  setSortOrder: PropTypes.func,
  selectedVtxSystems: PropTypes.arrayOf(PropTypes.string),
  onToggleVtxSystem: PropTypes.func,
  toggleVtxSystem: PropTypes.func,
  category: PropTypes.string
}

export default FiltroProducto
