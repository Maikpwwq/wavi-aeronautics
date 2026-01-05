import { firestore } from '@/firebase/firebaseClient'
import { 
  collection, 
  query, 
  where, 
  getAggregateFromServer, 
  count, 
  sum,
  getDocs
} from 'firebase/firestore'

/**
 * Fetches aggregated statistics for the admin dashboard
 * Uses server-side aggregation for performance
 */
export const getAdminStats = async () => {
  try {
    const ordersRef = collection(firestore, 'orders')
    const usersRef = collection(firestore, 'users')

    // 1. Calculate Total Income using server-side sum aggregation
    const incomeSnapshot = await getAggregateFromServer(ordersRef, {
      totalIncome: sum('total')
    })
    const totalIncome = incomeSnapshot.data().totalIncome || 0

    // 2. Count Total Orders
    const ordersCountSnapshot = await getAggregateFromServer(ordersRef, {
      totalOrders: count()
    })
    const totalOrders = ordersCountSnapshot.data().totalOrders || 0

    // 3. Count Pending Orders
    const pendingOrdersQuery = query(ordersRef, where('status', '==', 'processing'))
    const pendingSnapshot = await getAggregateFromServer(pendingOrdersQuery, {
      pendingCount: count()
    })
    const pendingOrders = pendingSnapshot.data().pendingCount || 0

    // 4. Count Total Users
    const usersCountSnapshot = await getAggregateFromServer(usersRef, {
      totalUsers: count()
    })
    const totalUsers = usersCountSnapshot.data().totalUsers || 0

    return {
      totalIncome,
      totalOrders,
      pendingOrders,
      totalUsers
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}

/**
 * Fallback for environments where getAggregateFromServer might fail or have issues with certain fields
 */
export const getAdminStatsFallback = async () => {
    // This is less efficient but works as a backup
    try {
        const ordersRef = collection(firestore, 'orders')
        const usersRef = collection(firestore, 'users')
        
        const [ordersSnap, usersSnap] = await Promise.all([
            getDocs(ordersRef),
            getDocs(usersRef)
        ])
        
        const totalIncome = ordersSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0)
        const totalOrders = ordersSnap.size
        const pendingOrders = ordersSnap.docs.filter(doc => doc.data().status === 'processing').length
        const totalUsers = usersSnap.size
        
        return {
            totalIncome,
            totalOrders,
            pendingOrders,
            totalUsers
        }
    } catch (error) {
        console.error("Fallback stats error:", error)
        return { totalIncome: 0, totalOrders: 0, pendingOrders: 0, totalUsers: 0 }
    }
}
