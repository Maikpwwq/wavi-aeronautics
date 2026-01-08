
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

// Fetch all products (including inactive ones)
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'products'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create a new product
export const createProduct = async (data) => {
  try {
    const docRef = await addDoc(collection(firestore, 'products'), {
      ...data,
      createdAt: serverTimestamp(),
      active: true // Default to active
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product details
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
