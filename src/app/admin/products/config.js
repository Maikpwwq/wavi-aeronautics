/**
 * Product Management Configuration
 * Centralized config for category mappings and product field transformations
 * 
 * STANDARDIZATION: All new products use English field names.
 * Legacy Spanish fields are read via normalizeProduct() for backwards compatibility.
 */

import { 
  fetchDronesProducts, 
  fetchGooglesProducts, 
  fetchRadioControlProducts,
  fetchAccesoriosProducts,
  fetchTransmisorsProducts,
  fetchDigitalVTXProducts 
} from '@/store/states/shop'

// Category configuration - maps to Redux state keys and fetch actions
export const CATEGORIES = [
  { key: 'dronesKit', label: 'Kit Drones', fetchAction: fetchDronesProducts },
  { key: 'dronesRC', label: 'Drones RC', fetchAction: fetchDronesProducts },
  { key: 'dronesHD', label: 'FPV HD', fetchAction: fetchDronesProducts },
  { key: 'googles', label: 'Goggles FPV', fetchAction: fetchGooglesProducts },
  { key: 'radioControl', label: 'Radio Control', fetchAction: fetchRadioControlProducts },
  { key: 'baterias', label: 'Baterías/Accesorios', fetchAction: fetchAccesoriosProducts },
  { key: 'transmisors', label: 'Transmisores', fetchAction: fetchTransmisorsProducts },
  { key: 'receptors', label: 'Receptores', fetchAction: fetchTransmisorsProducts },
  { key: 'digitalVTX', label: 'Digital VTX', fetchAction: fetchDigitalVTXProducts },
]

// Category options for form select - aligned with CATEGORIES keys
export const CATEGORY_OPTIONS = [
  { value: 'dronesKit', label: 'Kit Drones' },
  { value: 'dronesRC', label: 'Drones RC' },
  { value: 'dronesHD', label: 'FPV HD' },
  { value: 'googles', label: 'Goggles FPV' },
  { value: 'radioControl', label: 'Radio Control' },
  { value: 'baterias', label: 'Baterías/Accesorios' },
  { value: 'transmisors', label: 'Transmisores' },
  { value: 'receptors', label: 'Receptores' },
  { value: 'digitalVTX', label: 'Digital VTX' },
]

/**
 * Default options for drone categories (dronesRC, dronesHD)
 * priceModifier is in USD
 */
export const DEFAULT_DRONE_OPTIONS = [
  { label: 'PNP', priceModifier: 0 },
  { label: 'ELRS 2.4G', priceModifier: 17 },
  { label: 'TBS Nano RX', priceModifier: 35 },
  { label: 'PNP With GPS', priceModifier: 13 },
  { label: 'ELRS 2.4G With GPS', priceModifier: 30 },
  { label: 'TBS Nano RX With GPS', priceModifier: 55 },
  { label: 'ELRS 915MHz/2.4G GemX', priceModifier: 27 },
]

/**
 * Brand options derived from existing Firestore data
 */
export const BRAND_OPTIONS = [
  'betafpv',
  'eachine',
  'geprc',
  'iflight-rc',
  'flywoo',
  'uruav',
  'tinyhawk',
  'emax-usa',
  'radiomaster',
  'tbs',
  'fatshark',
  'skyzone',
  'walksnail',
  'dji',
  'caddx',
  'runcam',
  'gnb',
  'tattu',
  'other'
]

// ============================================================
// CATEGORY-BASED TAG SUGGESTIONS
// ============================================================

/**
 * Predefined tag suggestions organized by category.
 * 
 * - Each category key maps to an array of suggested tags.
 * - `_common` tags are available across ALL categories as a fallback.
 * - Drone-related categories share `_drones` as a base, extended per subcategory.
 * - The system is extensible: add new category keys as the catalog grows.
 * 
 * Usage: merge `_common` + category-specific tags, then deduplicate.
 */
export const CATEGORY_TAGS = {
  // ── Shared base tags (available to every category) ──
  _common: [
    'fpv-racing', 'cine-audiovisual', 'agro-precision',
    'topografia-mapeo', 'inspeccion-industrial', 'turismo-aventura',
    'nuevo', 'oferta', 'destacado', 'profesional', 'principiante'
  ],

  // ── Drone-specific product tags ──
  _drones: [
    'O4', 'WASP', 'WTFPV', 'FPV', 'KIT', '4K',
    'HD', 'analógico', 'digital', 'freestyle', 'long-range',
    'cinewhoop', 'toothpick', 'micro', 'sub-250g',
    'BNF', 'PNP', 'RTF', '5-pulgadas', '3.5-pulgadas', '7-pulgadas',
    'GPS', 'RTK', 'ELRS', 'crossfire', 'TBS'
  ],

  // Drones Kit (inherits _drones)
  dronesKit: [
    'kit-completo', 'kit-armado', 'DIY', 'frame', 'carbono', 'motor', 'ESC', 'stack'
  ],

  // Drones RC (inherits _drones)
  dronesRC: [
    'racing', 'acrobático', 'competición', 'velocidad'
  ],

  // FPV HD (inherits _drones)
  dronesHD: [
    'DJI', 'walksnail', 'HDZero', 'O3', 'vista', 'cinematic', 'estabilizado'
  ],

  // Goggles FPV
  googles: [
    'OLED', 'LCD', 'diversity', 'receptor-integrado', 'DVR',
    'HDZero', 'DJI', 'walksnail', 'analógico', 'digital',
    'ajuste-dioptrías', 'head-tracker'
  ],

  // Radio Control
  radioControl: [
    'ELRS', 'crossfire', 'TBS', 'ExpressLRS', 'OpenTX', 'EdgeTX',
    '2.4GHz', '915MHz', '868MHz', 'hall-sensor', 'gimbal',
    'plegable', 'compacto', 'full-size'
  ],

  // Baterías y Accesorios
  baterias: [
    'LiPo', 'Li-Ion', '1S', '2S', '3S', '4S', '6S',
    'HV', 'cargador', 'paralelo', 'XT60', 'XT30',
    'correa', 'antena', 'hélice', 'protector', 'bolsa-seguridad'
  ],

  // Transmisores de Video
  transmisors: [
    'VTX', '5.8GHz', '1.3GHz', 'digital', 'analógico',
    'O4', 'O3', 'DJI', 'walksnail', 'HDZero',
    '25mW', '200mW', '400mW', '1W', 'smart-audio', 'IRC-tramp'
  ],

  // Receptores
  receptors: [
    'ELRS', 'crossfire', 'TBS', 'R-XSR', 'XM+',
    '2.4GHz', '915MHz', '868MHz', 'nano', 'diversidad',
    'telemetría', 'SBUS', 'CRSF', 'PWM'
  ],

  // Digital VTX
  digitalVTX: [
    'DJI', 'walksnail', 'HDZero', 'O4', 'O3', 'vista',
    'avatar', 'VRX', 'módulo-receptor', '4K', '1080p', '720p',
    'baja-latencia', 'antena-patch', 'antena-omni'
  ],
}

/**
 * Get merged tag suggestions for a given category.
 * Combines _common + _drones (if applicable) + category-specific tags.
 * Deduplicates and sorts alphabetically.
 * 
 * @param {string} categoryKey - The selected category key (e.g. 'dronesHD')
 * @returns {string[]} Sorted, deduplicated array of suggested tags
 */
export const getTagSuggestionsForCategory = (categoryKey) => {
  const common = CATEGORY_TAGS._common || []
  const isDroneCategory = ['dronesKit', 'dronesRC', 'dronesHD'].includes(categoryKey)
  const droneBase = isDroneCategory ? (CATEGORY_TAGS._drones || []) : []
  const specific = CATEGORY_TAGS[categoryKey] || []

  const merged = [...new Set([...common, ...droneBase, ...specific])]
  return merged.sort((a, b) => a.localeCompare(b, 'es'))
}

// ============================================================
// STANDARDIZED PRODUCT SCHEMA (English Field Names)
// ============================================================

/**
 * Initial form state for product editing (Admin Dashboard)
 */
export const INITIAL_PRODUCT_FORM = {
  // Identifiers
  productID: '',
  slug: '',
  
  // Core Info
  name: '',
  brand: '',
  category: '',
  tags: [],
  
  // Pricing & Inventory
  price: '',
  discount: 0,
  stock: '',
  availability: true,
  
  // Content
  description: '',
  specifications: '',
  includes: '',
  
  // Media
  images: [''],
  video: '',
  
  // Status
  active: true
}

/**
 * Full product schema for new product creation
 */
export const PRODUCT_SCHEMA = {
  productID: '',          // SKU - will be document ID
  slug: '',               // URL-friendly (auto-generated)
  
  name: '',               // Display name
  brand: '',              // Indexed field  
  category: '',           // Category key
  tags: [],               // Searchable array
  
  price: 0,               // USD
  discount: 0,            // Percentage
  stock: 0,
  availability: true,
  options: [],             // Product variants: [{ label: string, priceModifier: number }]
  
  description: '',
  specifications: '',
  includes: '',
  
  images: [''],
  video: '',
  
  active: true,
  createdAt: null,        // Server timestamp
  updatedAt: null         // Server timestamp
}

/**
 * Normalize product data from Firestore to standardized format
 * @param {Object} product - Raw product from Firestore
 * @param {number} idx - Index for fallback ID
 * @param {string} categoryKey - Category key
 * @returns {Object} Normalized product with English field names
 */
export const normalizeProduct = (product, idx, categoryKey) => ({
  ...product,
  // Identifiers
  id: product.productID || product.id || `product-${idx}`,
  productID: product.productID || product.id || `product-${idx}`,
  slug: product.slug || '',
  
  // Core Info
  name: product.name || 'Sin Nombre',
  brand: product.brand || '',
  category: product.category || categoryKey || '',
  tags: Array.isArray(product.tags) 
    ? product.tags 
    : (product.tags && typeof product.tags === 'object') 
      ? Object.values(product.tags) 
      : [],
  
  // Pricing & Inventory
  price: parseFloat(product.price) || 0,
  discount: parseFloat(product.discount) || 0,
  stock: parseInt(product.stock) || 0,
  availability: product.availability !== undefined ? product.availability : (product.stock > 0),
  options: Array.isArray(product.options) ? product.options : [],
  
  // Content
  description: product.description || '',
  specifications: product.specifications || '',
  includes: product.includes || '',
  
  // Media
  images: product.images || [],
  video: product.video || '',
  
  // Status
  active: product.active !== undefined ? product.active : true,
})

/**
 * Build payload for Firestore write with STANDARDIZED English field names
 * @param {Object} formData - Form data from UI
 * @returns {Object} Firestore-compatible payload
 */
export const buildProductPayload = (formData) => {
  const validImages = (formData.images || []).filter(url => url?.trim())
  
  return {
    // Identifiers
    productID: formData.productID?.trim() || '',
    slug: formData.slug || generateSlug(formData.name || ''),
    
    // Core Info
    name: (formData.name || '').trim(),
    brand: (formData.brand || '').toLowerCase().trim(),
    category: formData.category || '',
    tags: (formData.tags || []).filter(t => t?.trim()),
    
    // Pricing & Inventory
    price: parseFloat(formData.price) || 0,
    discount: parseFloat(formData.discount) || 0,
    stock: parseInt(formData.stock) || 0,
    availability: formData.availability !== undefined ? Boolean(formData.availability) : Boolean((formData.stock || 0) > 0),
    options: (formData.options || []).filter(opt => opt?.label?.trim()).map(opt => ({
      label: opt.label.trim(),
      priceModifier: parseFloat(opt.priceModifier) || 0
    })),
    
    // Content
    description: (formData.description || '').trim(),
    specifications: (formData.specifications || '').trim(),
    includes: (formData.includes || '').trim(),
    
    // Media
    images: validImages,
    video: (formData.video || '').trim(),
    
    // Status
    active: formData.active !== false
  }
}

/**
 * Generate URL-friendly slug from title
 */
export const generateSlug = (title) => {
  const base = `${title || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return base
}

/**
 * Generate productID from form data
 */
export const generateProductID = (name) => {
  const slug = generateSlug(name)
  return slug.toUpperCase()
}

/**
 * SessionStorage key for form draft persistence
 */
export const DRAFT_STORAGE_KEY = 'admin_new_product_draft'
