
import { firestore, auth, storage } from './firebaseClient'
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'

// ==================== USER MANAGEMENT ====================

// Fetch all users with pagination
export const getAllUsers = async (limitCount = 10, lastDoc = null) => {
  try {
    let q = query(collection(firestore, 'users'), limit(limitCount))
    
    if (lastDoc) {
      q = query(collection(firestore, 'users'), startAfter(lastDoc), limit(limitCount))
    }

    const snapshot = await getDocs(q)
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return { users, lastDoc: lastVisible }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Update user details
export const updateUser = async (uid, data) => {
  try {
    const userRef = doc(firestore, 'users', uid)
    await updateDoc(userRef, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// ==================== PRODUCT MANAGEMENT ====================

// Category to Firestore path mapping for hierarchical 'productos' collection
const CATEGORY_PATHS = {
  'dronesKits': 'productos/dron/kit_fpv_dron',
  'dronesRC': 'productos/dron/RC',
  'FPV HD': 'productos/dron/geprc',
  'Googles': 'productos/Googles',    // Has sub-categories
  'radioControl': 'productos/radio_control', // Has sub-categories
  'digitalVTX': 'productos/digital_vtx', // Has sub-categories
  'baterias': 'productos/radio_control', // Part of radio_control hierarchy
  'transmisors': 'productos/radio_control',
  'receptors': 'productos/radio_control',
}

// Update a product in the hierarchical 'productos' structure
// Searches for the product by productID and updates it
export const updateProductInHierarchy = async (productID, data, categoryHint = null) => {
  try {
    // Build list of collections to search based on category hint
    let collectionsToSearch = []
    
    if (categoryHint && CATEGORY_PATHS[categoryHint]) {
      // Use the category hint to narrow search
      const basePath = CATEGORY_PATHS[categoryHint]
      collectionsToSearch = await getCollectionsForPath(basePath)
    } else {
      // Search all major collections
      collectionsToSearch = [
        'productos/dron/kit_fpv_dron',
        'productos/dron/RC',
        'productos/dron/geprc',
        'productos/Googles/DJI',
        'productos/Googles/Betafpv',
        'productos/Googles/Emaxusa',
        'productos/Googles/FatShark',
        'productos/Googles/Walksnail',
        'productos/Googles/Iflight-rc',
        'productos/digital_vtx/DJI',
        'productos/digital_vtx/CADDX',
      ]
    }
    
    // Search for the product in each collection
    for (const collPath of collectionsToSearch) {
      const collRef = collection(firestore, collPath)
      const q = query(collRef, where('productID', '==', productID))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        // Found the product, update it
        const docToUpdate = snapshot.docs[0]
        await updateDoc(docToUpdate.ref, {
          ...data,
          updatedAt: serverTimestamp()
        })
        
        // Also clear sessionStorage cache for this category so next load gets fresh data
        console.log(`[AdminServices] Updated product ${productID} in ${collPath}`)
        return { success: true, path: collPath }
      }
    }
    
    throw new Error(`Product with ID ${productID} not found in any collection`)
  } catch (error) {
    console.error('Error updating product in hierarchy:', error)
    throw error
  }
}

// Helper to get sub-collections for a given path (simplified)
async function getCollectionsForPath(basePath) {
  // For paths like 'productos/Googles', return known sub-collections
  if (basePath.includes('Googles')) {
    return [
      'productos/Googles/DJI',
      'productos/Googles/Betafpv',
      'productos/Googles/Emaxusa',
      'productos/Googles/FatShark',
      'productos/Googles/Walksnail',
      'productos/Googles/Iflight-rc',
    ]
  }
  if (basePath.includes('digital_vtx')) {
    return ['productos/digital_vtx/DJI', 'productos/digital_vtx/CADDX']
  }
  if (basePath.includes('radio_control')) {
    // This has many sub-paths, return main ones for baterias/controls
    return [
      'productos/radio_control/betafpv/baterias/2PCS-2s-300mAh',
      'productos/radio_control/betafpv/control-remoto/lite-radio2',
      'productos/radio_control/radio-master/control-remoto/tx16s',
      'productos/radio_control/iflight-rc/control-remoto/iF8-E',
    ]
  }
  // Default: return the base path as a collection
  return [basePath]
}

// Fetch all products (from flat 'products' collection - legacy)
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'products'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create a new product (flat collection - for new products)
export const createProduct = async (data) => {
  try {
    const docRef = await addDoc(collection(firestore, 'products'), {
      ...data,
      createdAt: serverTimestamp(),
      active: true
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product details (flat collection)
export const updateProduct = async (id, data) => {
  try {
    const productRef = doc(firestore, 'products', id)
    await updateDoc(productRef, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Toggle product active status (Soft Delete)
export const toggleProductStatus = async (id, isActive) => {
  try {
    const productRef = doc(firestore, 'products', id)
    await updateDoc(productRef, { active: isActive })
    return { success: true }
  } catch (error) {
    console.error('Error toggling product status:', error)
    throw error
  }
}

// ==================== ORDER MANAGEMENT ====================

// Fetch orders with optional status filtering and pagination
export const getOrders = async (statusFilter = null, limitCount = 10, lastDoc = null) => {
  try {
    let constraints = [limit(limitCount)]
    
    if (statusFilter) {
      if (Array.isArray(statusFilter)) {
        constraints.unshift(where('status', 'in', statusFilter))
      } else {
        constraints.unshift(where('status', '==', statusFilter))
      }
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const q = query(collection(firestore, 'orders'), ...constraints)
    const snapshot = await getDocs(q)
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return { orders, lastDoc: lastVisible }
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

// Update order status (Force Approve / Cancel)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(firestore, 'orders', orderId)
    await updateDoc(orderRef, { status })
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Generate dummy orders for testing
export const generateTestOrders = async (count = 10) => {
  const statuses = ['paid', 'pending', 'failed', 'verification_required']
  const dummyUsers = [
    { name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102' },
    { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103' }
  ]

  const ordersRef = collection(firestore, 'orders')

  try {
    const promises = []
    for (let i = 0; i < count; i++) {
      const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      // Use Flat Schema to match Live Orders and ensure User Portal visibility
      const orderData = {
        total: Math.floor(Math.random() * 500) + 50,
        status: randomStatus,
        createdAt: serverTimestamp(),
        userId: 'test-user-id', // Placeholder or random
        userEmail: randomUser.email,
        userName: randomUser.name,
        userPhone: randomUser.phone,
        items: [
          { name: 'Product A', quantity: 1, price: 100 },
          { name: 'Product B', quantity: 2, price: 50 },
        ],
        paymentMethod: 'credit_card'
      }
      promises.push(addDoc(ordersRef, orderData))
    }
    await Promise.all(promises)
    console.log(`Generated ${count} test orders.`)
    return { success: true }
  } catch (error) {
    console.error('Error generating test orders:', error)
    throw error
  }
}

// ==================== PUBLICATIONS (BLOG) MANAGEMENT ====================

export const getAllPosts = async () => {
  try {
    const q = query(collection(firestore, 'posts'), orderBy('publishedAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const createPost = async (data) => {
  try {
    const docRef = await addDoc(collection(firestore, 'posts'), {
      ...data,
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const updatePost = async (id, data) => {
  try {
    const postRef = doc(firestore, 'posts', id)
    await updateDoc(postRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(firestore, 'posts', id))
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// ==================== PROMOTIONS CENTRAL ====================

export const getAllPromotions = async () => {
  try {
    const q = query(collection(firestore, 'promotions'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching promotions:', error)
    throw error
  }
}

export const createPromotion = async (data) => {
  try {
    const docRef = await addDoc(collection(firestore, 'promotions'), {
      ...data,
      createdAt: serverTimestamp(),
      active: true
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating promotion:', error)
    throw error
  }
}

export const deletePromotion = async (id) => {
  try {
    await deleteDoc(doc(firestore, 'promotions', id))
    return { success: true }
  } catch (error) {
    console.error('Error deleting promotion:', error)
    throw error
  }
}

export const togglePromotionStatus = async (id, isActive) => {
   try {
    const promoRef = doc(firestore, 'promotions', id)
    await updateDoc(promoRef, { active: isActive })
    return { success: true }
  } catch (error) {
    console.error('Error toggling promotion status:', error)
    throw error
  }
}
