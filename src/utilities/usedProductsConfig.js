/**
 * Used Products Configuration & Constants
 * Centralized config for C2C Second-Hand Classifieds module
 */

// Hardware-only categories for used products (excludes software and escuela)
export const USED_CATEGORIES = [
  { key: 'dronesKits', label: "Kit's Drones", routeSlug: 'kit-drones' },
  { key: 'dronesHD', label: 'Drones FPV HD', routeSlug: 'drones-fpv-hd' },
  { key: 'dronesRC', label: 'Drones RC', routeSlug: 'drones' },
  { key: 'googles', label: 'Goggles FPV', routeSlug: 'googles' },
  { key: 'radioControl', label: 'Radio Control', routeSlug: 'radio-control' },
  { key: 'transmisors', label: 'Transmisores', routeSlug: 'trasmisor-receptor' },
  { key: 'receptors', label: 'Receptores', routeSlug: 'trasmisor-receptor' },
  { key: 'digitalVTX', label: 'Digital VTX', routeSlug: 'digital-vtx' },
  { key: 'baterias', label: 'Baterías y Accesorios', routeSlug: 'accesorios' }
]

// Item condition choices
export const USED_CONDITIONS = [
  { key: 'like_new', label: 'Como Nuevo (9/10 a 10/10)', description: 'Sin detalles estéticos ni funcionales, empaque completo.' },
  { key: 'good', label: 'Buen Estado (7/10 a 8/10)', description: 'Uso normal, pequeños detalles cosméticos que no afectan el funcionamiento.' },
  { key: 'fair', label: 'Con Desgaste (5/10 a 6/10)', description: 'Uso prolongado o raspones visibles, 100% funcional.' },
  { key: 'for_parts', label: 'Para Repuestos / Para Reparar', description: 'Requiere mantenimiento o reparación de componentes.' }
]

// Moderation & publication status values
export const USED_STATUS = {
  PENDING: 'pending',       // Visible publicly, waiting for admin verification
  VERIFIED: 'verified',     // Verified by admin badge
  DISABLED: 'disabled',     // Disabled by admin due to rule violation
  SOLD: 'sold',             // Marked as sold by seller
  EXPIRED: 'expired'        // Expired (>60 days without renewal)
}

// Constraints
export const USED_PHOTO_CONSTRAINTS = {
  MIN_PHOTOS: 2,
  MAX_PHOTOS: 6,
  MAX_FILE_SIZE_MB: 5
}

// Listing validity duration in milliseconds (60 days)
export const LISTING_DURATION_DAYS = 60
export const LISTING_DURATION_MS = LISTING_DURATION_DAYS * 24 * 60 * 60 * 1000

// Session Storage Draft Key
export const USED_DRAFT_STORAGE_KEY = 'WAVI_USED_PRODUCT_DRAFT'

/**
 * Format COP currency helper
 */
export const formatCopCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$ 0 COP'
  return `$ ${Number(amount).toLocaleString('es-CO')} COP`
}
