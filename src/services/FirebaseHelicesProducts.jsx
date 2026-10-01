'use client'
import { firestore } from '@/firebase/firebaseClient'
import { getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseHelicesProducts() {
  let productsHelices = []

  if (typeof window !== 'undefined') {
    const cachedHelices = sessionStorage.getItem('Productos_Helices')
    if (cachedHelices) {
      try {
        productsHelices = JSON.parse(cachedHelices)
        parseProductPrices(productsHelices)
        return { productsHelices }
      } catch (e) {
        console.warn('Error reading Productos_Helices cache:', e)
      }
    }
  }

  // Hierarchical fetch: products/{category}/brands/{brand}/items where category == 'helices'
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', '==', 'helices')
    )

    const snapshot = await getDocs(q)
    productsHelices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Helices', JSON.stringify(productsHelices))
    }

    parseProductPrices(productsHelices)

    return { productsHelices }
  } catch (error) {
    console.error('Error fetching Helices products:', error)
    return { productsHelices: [] }
  }
}

export default FirebaseHelicesProducts
