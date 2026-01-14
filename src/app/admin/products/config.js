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
  { key: 'googles', label: 'Googles', fetchAction: fetchGooglesProducts },
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
  { value: 'googles', label: 'Googles' },
  { value: 'radioControl', label: 'Radio Control' },
  { value: 'baterias', label: 'Baterías/Accesorios' },
  { value: 'transmisors', label: 'Transmisores' },
  { value: 'receptors', label: 'Receptores' },
  { value: 'digitalVTX', label: 'Digital VTX' },
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
    availability: Boolean((formData.stock || 0) > 0),
    
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
