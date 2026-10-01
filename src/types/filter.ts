/**
 * Types & Contracts for Sidebar Filter Architecture
 * @module types/filter
 */

export interface ProductPriceItem {
  id?: string | number
  productID?: string | number
  price?: number | string
  precio?: number | string
  brand?: string
  marca?: string
  availability?: boolean
  [key: string]: unknown
}

export interface CategoryRouteItem {
  label: string
  href: string
  slug: string
  icon?: string
}

export interface PriceRangeState {
  min: number
  max: number
}

export interface SidebarFilterProps {
  /** Array of products in the current category/view to derive zero-config bounds */
  products?: ProductPriceItem[]
  /** Currently selected brands */
  selectedBrands?: string[]
  /** Available brand names derived from catalog */
  availableBrands?: string[]
  /** Active sort order identifier */
  sortOrder?: string
  /** Callback emitted after 300ms debounce when price range changes */
  onPriceChange?: (range: PriceRangeState) => void
  /** Callback when brand toggle is triggered */
  onToggleBrand?: (brand: string) => void
  /** Callback when sort order changes */
  onSortChange?: (sort: string) => void
  /** Callback to clear all active filters */
  onResetFilters?: () => void
  /** Legacy setMinPrice fallback */
  setMinPrice?: (val: number | string) => void
  /** Legacy setMaxPrice fallback */
  setMaxPrice?: (val: number | string) => void
  /** Legacy filters object */
  filters?: {
    brands?: string[]
    price?: { min?: number | string; max?: number | string }
  }
  /** Legacy toggleBrand */
  toggleBrand?: (brand: string) => void
  /** Legacy setSortOrder */
  setSortOrder?: (sort: string) => void
  /** Legacy resetFilters */
  resetFilters?: () => void
  /** Optional custom class name */
  className?: string
}
