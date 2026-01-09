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
  { key: 'dronesHD', label: 'FPV HD (GEPRC)', fetchAction: fetchDronesProducts },
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
  price: parseFloat(product.precio) || product.productPrice || product.price || 0,
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
  title: formData.name,
  precio: parseFloat(formData.price) || 0,
  productStock: parseInt(formData.stock) || 0,
  productDescription: formData.description,
  productImages: validImages,
  marca: formData.marca,
  active: formData.active,
  discount: parseFloat(formData.discount) || 0,
  especificaciones: formData.especificaciones,
  incluye: formData.incluye,
})
