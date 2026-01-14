'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseAccesoriosProducts() {
  let productsBaterias = []

  if (typeof window !== 'undefined') {
    const cachedBaterias = sessionStorage.getItem('Productos_Baterias')
    if (cachedBaterias) {
      productsBaterias = JSON.parse(cachedBaterias)
      parseProductPrices(productsBaterias)
      return { productsBaterias }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', '==', 'baterias')
    )
    
    const snapshot = await getDocs(q)
    productsBaterias = snapshot.docs.map(doc => doc.data())

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Baterias', JSON.stringify(productsBaterias))
    }

    parseProductPrices(productsBaterias)
    
    return { productsBaterias }

  } catch (error) {
    console.error("Error fetching Accesorios products:", error)
    return { productsBaterias: [] }
  }
}

export default FirebaseAccesoriosProducts
