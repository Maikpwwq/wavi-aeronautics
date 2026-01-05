import { firestore } from '@/firebase/firebaseClient'
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore'

/**
 * Creates a new order in Firestore
 * @param {Object} orderData - The order details
 * @returns {Promise<string>} The created order ID
 */
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(firestore, 'orders')
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp()
    })
    console.log("Order created with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

/**
 * Fetches all orders for a specific user
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<Array>} List of user orders
 */
export const fetchUserOrders = async (userId) => {
  if (!userId) return []

  try {
    const ordersRef = collection(firestore, 'orders')
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching user orders:", error)
    // Return empty array instead of throwing to avoid breaking UI
    return []
  }
}
