/**
 * Product Management Configuration
 * Centralized config for category mappings and product field transformations
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

// Category options for form select (legacy format)
export const CATEGORY_OPTIONS = [
  'Googles', 
  'radioControl', 
  'baterias', 
  'dronesRC', 
  'digitalVTX', 
  'FPV HD', 
  'dronesKits', 
  'transmisors', 
  'receptors'
]

// Initial form state for product editing
export const INITIAL_PRODUCT_FORM = {
  name: '',
  price: '',
  stock: '',
  description: '',
  imagenes: [''],
  active: true,
  discount: 0,
  categoria: '',
  especificaciones: '',
  incluye: '',
  marca: '',
  productID: ''
}

/**
 * Normalize product data from various Firestore schemas to consistent format
 * Handles Spanish field names from Firestore (titulo, precio, marca, etc.)
 * @param {Object} product - Raw product from Firestore
 * @param {number} idx - Index for fallback ID
 * @param {string} categoria - Category key
 * @returns {Object} Normalized product
 */
export const normalizeProduct = (product, idx, categoria) => ({
  ...product,
  id: product.productID || product.id || `product-${idx}`,
  name: product.titulo || product.title || product.productName || product.name || 'Sin Nombre',
  price: parseFloat(product.priceUSD) || parseFloat(product.precio) || product.productPrice || product.price || 0,
  stock: product.productStock || product.stock || 0,
  marca: product.marca || product.productBrand || '',
  description: product.descripcion || product.description || '',
  active: product.active !== undefined ? product.active : true,
  categoria,
})

/**
 * Build payload for Firestore update with correct field names
 * @param {Object} formData - Form data from UI
 * @param {Array} validImages - Filtered image URLs
 * @returns {Object} Firestore-compatible payload
 */
export const buildProductPayload = (formData, validImages) => ({
  titulo: formData.name,
  precio: parseFloat(formData.price) || 0,
  productStock: parseInt(formData.stock) || 0,
  descripcion: formData.description,
  imagenes: validImages,
  marca: formData.marca,
  active: formData.active,
  discount: parseFloat(formData.discount) || 0,
  especificaciones: formData.especificaciones,
  incluye: formData.incluye,
})

// ============================================================
// NEW PRODUCT REGISTRATION - Flat Collection Schema
// ============================================================

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

/**
 * Initial form state for NEW product (flat collection)
 */
export const NEW_PRODUCT_SCHEMA = {
  productID: '',          // SKU - will be document ID
  titulo: '',             // Display name
  slug: '',               // URL-friendly (auto-generated)
  
  category: 'dronesKit',  // Indexed field
  brand: '',              // Indexed field  
  tags: [],               // Searchable array
  
  availability: true,
  stock: 0,
  precio: 0,              // USD
  discount: 0,
  
  descripcion: '',
  video: '',
  imagenes: [''],
  
  caracteristicas: {},    // Key-value map
  especificaciones: '',
  incluye: '',
  
  active: true
}

/**
 * Generate URL-friendly slug from title
 */
export const generateSlug = (title, brand) => {
  const base = `${brand}-${title}`
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
export const generateProductID = (titulo, brand) => {
  const slug = generateSlug(titulo, brand)
  return slug.toUpperCase()
}

/**
 * Sanitize product data before Firestore write
 * - Ensures correct types
 * - Removes empty strings from arrays
 * - Trims whitespace
 */
export const sanitizeProductData = (data) => {
  return {
    productID: data.productID?.trim() || '',
    titulo: data.titulo?.trim() || '',
    slug: data.slug || generateSlug(data.titulo, data.brand),
    
    category: data.category || 'dronesKit',
    brand: data.brand?.toLowerCase() || '',
    tags: (data.tags || []).filter(t => t?.trim()),
    
    availability: Boolean(data.stock > 0),
    stock: parseInt(data.stock) || 0,
    precio: parseFloat(data.precio) || 0,
    discount: parseFloat(data.discount) || 0,
    
    descripcion: data.descripcion?.trim() || '',
    video: data.video?.trim() || '',
    imagenes: (data.imagenes || []).filter(url => url?.trim()),
    
    caracteristicas: data.caracteristicas || {},
    especificaciones: data.especificaciones?.trim() || '',
    incluye: data.incluye?.trim() || '',
    
    active: data.active !== false
  }
}

/**
 * SessionStorage key for form draft persistence
 */
export const DRAFT_STORAGE_KEY = 'admin_new_product_draft'

