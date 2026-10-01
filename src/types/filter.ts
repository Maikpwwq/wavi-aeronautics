/**
 * Types & Contracts for Sidebar Filter Architecture
 * @module types/filter
 */

/**
 * Canonical VTX system options.
 * Each entry has an `id` for state/filtering and a `label` for display.
 * `keywords` are used to match against product name/description/specifications.
 */
export const VTX_SYSTEM_OPTIONS = [
  { id: "wtfpv", label: "WTFPV", keywords: ["wtfpv"] },
  {
    id: "analogico",
    label: "Analógico",
    keywords: ["analóg", "analog", "runcam analog"],
  },
  { id: "o3", label: "O3", keywords: ["o3", "o3 air", "dji o3"] },
  { id: "o4", label: "O4", keywords: ["o4", "dji o4"] },
  {
    id: "wasp",
    label: "WASP (RunCam)",
    keywords: ["wasp", "runcam wasp", "runcam link", "caddx vista"],
  },
  {
    id: "walksnail",
    label: "Walksnail Avatar (CaddxFPV)",
    keywords: ["walksnail", "avatar", "caddx", "caddxfpv"],
  },
] as const;

export type VtxSystemId = (typeof VTX_SYSTEM_OPTIONS)[number]["id"];

export { BATTERY_CELL_OPTIONS, type BatteryCellId } from '@/utilities/batteryConfig'

export interface ProductPriceItem {
  id?: string | number;
  productID?: string | number;
  price?: number | string;
  precio?: number | string;
  brand?: string;
  marca?: string;
  name?: string;
  titulo?: string;
  description?: string;
  descripcion?: string;
  specifications?: string | Record<string, unknown>;
  especificaciones?: string | Record<string, unknown>;
  vtx?: string;
  vtxSystem?: string;
  sistemaVtx?: string;
  cells?: number | string;
  celdas?: number | string;
  batteryCells?: number | string;
  voltage?: string;
  voltaje?: string;
  variationGroups?: unknown[];
  options?: unknown[];
  availability?: boolean;
  [key: string]: unknown;
}

export interface CategoryRouteItem {
  label: string;
  href: string;
  slug: string;
  icon?: string;
}

export interface PriceRangeState {
  min: number;
  max: number;
}

export interface SidebarFilterProps {
  /** Array of products in the current category/view to derive zero-config bounds */
  products?: ProductPriceItem[];
  /** Optional active category slug or identifier (e.g. 'dronesHD', 'all') */
  category?: string;
  /** Currently selected brands */
  selectedBrands?: string[];
  /** Available brand names derived from catalog */
  availableBrands?: string[];
  /** Active sort order identifier */
  sortOrder?: string;
  /** Callback emitted after 300ms debounce when price range changes */
  onPriceChange?: (range: PriceRangeState) => void;
  /** Callback when brand toggle is triggered */
  onToggleBrand?: (brand: string) => void;
  /** Callback when sort order changes */
  onSortChange?: (sort: string) => void;
  /** Callback to clear all active filters */
  onResetFilters?: () => void;
  /** Legacy setMinPrice fallback */
  setMinPrice?: (val: number | string) => void;
  /** Legacy setMaxPrice fallback */
  setMaxPrice?: (val: number | string) => void;
  /** Currently selected VTX systems */
  selectedVtxSystems?: string[];
  /** Callback when VTX system toggle is triggered */
  onToggleVtxSystem?: (vtxId: string) => void;
  /** Legacy toggleVtxSystem */
  toggleVtxSystem?: (vtxId: string) => void;
  /** Currently selected battery cell counts (e.g. ['1S', '4S']) */
  selectedBatteryCells?: string[];
  /** Callback when battery cell count toggle is triggered */
  onToggleBatteryCell?: (cellId: string) => void;
  /** Legacy toggleBatteryCell */
  toggleBatteryCell?: (cellId: string) => void;
  /** Legacy filters object */
  filters?: {
    brands?: string[];
    vtxSystems?: string[];
    batteryCells?: string[];
    price?: { min?: number | string; max?: number | string };
  };
  /** Legacy toggleBrand */
  toggleBrand?: (brand: string) => void;
  /** Legacy setSortOrder */
  setSortOrder?: (sort: string) => void;
  /** Legacy resetFilters */
  resetFilters?: () => void;
  /** Optional custom class name */
  className?: string;
}
