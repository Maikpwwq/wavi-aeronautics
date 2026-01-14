'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseGooglesProducts() {
  let productsGoogles = []

  if (typeof window !== 'undefined') {
    const cachedGoogles = sessionStorage.getItem('Productos_Googles')
    if (cachedGoogles) {
      productsGoogles = JSON.parse(cachedGoogles)
      parseProductPrices(productsGoogles)
      return { productsGoogles }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  // Query all 'items' subcollections where category == 'googles'
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', '==', 'googles')
    )
    
    const snapshot = await getDocs(q)
    productsGoogles = snapshot.docs.map(doc => doc.data())

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Googles', JSON.stringify(productsGoogles))
    }

    parseProductPrices(productsGoogles)
    
    return { productsGoogles }

  } catch (error) {
    console.error("Error fetching Googles products:", error)
    return { productsGoogles: [] }
  }
}

export default FirebaseGooglesProducts
