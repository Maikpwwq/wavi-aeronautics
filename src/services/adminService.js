import { firestore } from '@/firebase/firebaseClient'
import { 
  collection, 
  collectionGroup,
  query, 
  where, 
  getAggregateFromServer, 
  count, 
  sum,
  getDocs,
  limit,
  orderBy
} from 'firebase/firestore'

import { fetchPendingReviewsCount, fetchUnansweredQuestionsCount } from '@/services/productInteractionService'
import { USED_STATUS } from '@/utilities/usedProductsConfig'

/**
 * Fetches comprehensive aggregated statistics for the admin dashboard
 * grouped by distinct business processes.
 */
export const getAdminStats = async () => {
  try {
    const ordersRef = collection(firestore, 'orders')
    const usersRef = collection(firestore, 'users')
    const usedRef = collection(firestore, 'usedProducts')
    const reviewsRef = collection(firestore, 'product_reviews')
    const questionsRef = collection(firestore, 'product_questions')

    // Parallel query execution for optimal performance
    const [
      ordersSnapshot,
      usersSnapshot,
      usedSnapshot,
      reviewsSnapshot,
      questionsSnapshot,
      catalogSnapshot
    ] = await Promise.all([
      getDocs(ordersRef).catch(() => ({ docs: [], size: 0 })),
      getDocs(usersRef).catch(() => ({ docs: [], size: 0 })),
      getDocs(usedRef).catch(() => ({ docs: [], size: 0 })),
      getDocs(reviewsRef).catch(() => ({ docs: [], size: 0 })),
      getDocs(questionsRef).catch(() => ({ docs: [], size: 0 })),
      getDocs(collectionGroup(firestore, 'items')).catch(() => ({ docs: [], size: 0 }))
    ])

    // ==========================================
    // 1. PROCESO DE VENTAS & PEDIDOS
    // ==========================================
    const orderDocs = ordersSnapshot.docs ? ordersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) : []
    const totalOrders = orderDocs.length

    let totalIncome = 0
    let paidOrdersCount = 0
    let pendingOrdersCount = 0
    let issueOrdersCount = 0
    const buyersSet = new Set()

    orderDocs.forEach(order => {
      const status = (order.status || '').toLowerCase()
      const total = Number(order.total) || Number(order.totalAmount) || 0

      if (['paid', 'shipped', 'delivered', 'completed', 'approved'].includes(status)) {
        totalIncome += total
        paidOrdersCount++
        if (order.userId || order.userEmail || order.customerEmail) {
          buyersSet.add(order.userId || order.userEmail || order.customerEmail)
        }
      } else if (['pending', 'processing', 'in_process', 'pending_payment'].includes(status)) {
        pendingOrdersCount++
      } else if (['verification_required', 'failed', 'rejected', 'cancelled', 'disputed'].includes(status)) {
        issueOrdersCount++
      }
    })

    const averageTicket = paidOrdersCount > 0 ? totalIncome / paidOrdersCount : 0

    // ==========================================
    // 2. PROCESO DE MARKETPLACE DE USADOS
    // ==========================================
    const usedDocs = usedSnapshot.docs ? usedSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) : []
    const totalUsed = usedDocs.length

    let pendingUsed = 0
    let verifiedUsed = 0
    let soldUsed = 0
    let disabledUsed = 0
    let totalUsedInventoryValue = 0

    usedDocs.forEach(item => {
      const st = item.status || USED_STATUS.PENDING
      const price = Number(item.priceCop) || 0

      if (st === USED_STATUS.PENDING) {
        pendingUsed++
      } else if (st === USED_STATUS.VERIFIED) {
        verifiedUsed++
        totalUsedInventoryValue += price
      } else if (st === USED_STATUS.SOLD) {
        soldUsed++
      } else if (st === USED_STATUS.DISABLED) {
        disabledUsed++
      }
    })

    // ==========================================
    // 3. PROCESO DE INTERACCIONES & ATENCIÓN
    // ==========================================
    const reviewDocs = reviewsSnapshot.docs ? reviewsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) : []
    const questionDocs = questionsSnapshot.docs ? questionsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) : []

    const totalReviews = reviewDocs.length
    const pendingReviews = reviewDocs.filter(r => r.approved === false).length
    const approvedReviews = reviewDocs.filter(r => r.approved === true).length

    const ratingSum = reviewDocs
      .filter(r => r.approved === true && typeof r.rating === 'number')
      .reduce((sum, r) => sum + r.rating, 0)
    const averageRating = approvedReviews > 0 ? (ratingSum / approvedReviews).toFixed(1) : '5.0'

    const totalQuestions = questionDocs.length
    const unansweredQuestions = questionDocs.filter(q => !q.answer && !q.answeredAt).length
    const answeredQuestions = totalQuestions - unansweredQuestions

    // ==========================================
    // 4. PROCESO DE CATÁLOGO & INVENTARIO
    // ==========================================
    const productDocs = catalogSnapshot.docs ? catalogSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) : []
    const totalProducts = productDocs.length
    const activeProducts = productDocs.filter(p => p.active !== false && p.availability !== false).length
    const outOfStockProducts = productDocs.filter(p => p.stock === 0 || p.availability === false).length
    
    const categoriesSet = new Set()
    productDocs.forEach(p => {
      if (p.category) categoriesSet.add(p.category)
    })

    // ==========================================
    // 5. PROCESO DE USUARIOS & COMUNIDAD
    // ==========================================
    const totalUsers = usersSnapshot.size || 0
    const activeBuyers = buyersSet.size

    // ==========================================
    // ACTIVIDAD RECIENTE CONSOLIDADA
    // ==========================================
    const recentOrders = orderDocs
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5)

    const recentQuestions = questionDocs
      .filter(q => !q.answer)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5)

    const recentUsed = usedDocs
      .filter(u => u.status === USED_STATUS.PENDING)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5)

    return {
      // 1. Sales & Orders
      sales: {
        totalIncome,
        totalOrders,
        paidOrdersCount,
        pendingOrdersCount,
        issueOrdersCount,
        averageTicket,
        recentOrders
      },
      // 2. Used Marketplace
      used: {
        totalUsed,
        pendingUsed,
        verifiedUsed,
        soldUsed,
        disabledUsed,
        totalUsedInventoryValue,
        recentUsed
      },
      // 3. Customer Interactions
      interactions: {
        totalQuestions,
        unansweredQuestions,
        answeredQuestions,
        totalReviews,
        pendingReviews,
        approvedReviews,
        averageRating,
        recentQuestions
      },
      // 4. Catalog & Stock
      catalog: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        activeCategoriesCount: categoriesSet.size
      },
      // 5. Users
      users: {
        totalUsers,
        activeBuyers
      },
      // Backward compatibility top-level aliases
      totalIncome,
      totalOrders,
      pendingOrders: pendingOrdersCount,
      totalUsers,
      pendingReviews,
      unansweredQuestions,
      pendingUsed,
      issueOrdersCount
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}

/**
 * Fallback for environments where connection or aggregation might fail
 */
export const getAdminStatsFallback = async () => {
  return {
    sales: { totalIncome: 0, totalOrders: 0, paidOrdersCount: 0, pendingOrdersCount: 0, issueOrdersCount: 0, averageTicket: 0, recentOrders: [] },
    used: { totalUsed: 0, pendingUsed: 0, verifiedUsed: 0, soldUsed: 0, disabledUsed: 0, totalUsedInventoryValue: 0, recentUsed: [] },
    interactions: { totalQuestions: 0, unansweredQuestions: 0, answeredQuestions: 0, totalReviews: 0, pendingReviews: 0, approvedReviews: 0, averageRating: '5.0', recentQuestions: [] },
    catalog: { totalProducts: 0, activeProducts: 0, outOfStockProducts: 0, activeCategoriesCount: 0 },
    users: { totalUsers: 0, activeBuyers: 0 },
    totalIncome: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    pendingReviews: 0,
    unansweredQuestions: 0,
    pendingUsed: 0,
    issueOrdersCount: 0
  }
}

