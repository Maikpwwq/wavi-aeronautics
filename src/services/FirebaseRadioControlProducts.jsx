'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseRadioControlProducts() {
  let storeProductsRC = []

  if (typeof window !== 'undefined') {
    const cachedRC = sessionStorage.getItem('Productos_RC')
    if (cachedRC) {
      storeProductsRC = JSON.parse(cachedRC)
      parseProductPrices(storeProductsRC)
      return { storeProductsRC }
    }
  }

async function FirebaseRadioControlProducts() {
  let storeProductsRC = []

  if (typeof window !== 'undefined') {
    const cachedRC = sessionStorage.getItem('Productos_RC')
    if (cachedRC) {
      storeProductsRC = JSON.parse(cachedRC)
      parseProductPrices(storeProductsRC)
      return { storeProductsRC }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  // Query all 'items' subcollections where category == 'radioControl'
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', '==', 'radioControl')
    )
    
    const snapshot = await getDocs(q)
    storeProductsRC = snapshot.docs.map(doc => doc.data())

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_RC', JSON.stringify(storeProductsRC))
    }

    parseProductPrices(storeProductsRC)
    
    return { storeProductsRC }

  } catch (error) {
    console.error("Error fetching RadioControl products:", error)
    return { storeProductsRC: [] }
  }
}

export default FirebaseRadioControlProducts
