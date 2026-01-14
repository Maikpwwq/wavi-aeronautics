'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseTrasmisorReceptorProducts() {
  let storeProductsReceptor = []
  let storeProductsTransmisor = []

  if (typeof window !== 'undefined') {
    const cachedReceptor = sessionStorage.getItem('Productos_Receptor')
    const cachedTransmisor = sessionStorage.getItem('Productos_Transmisor')
    if (cachedReceptor && cachedTransmisor) {
      storeProductsReceptor = JSON.parse(cachedReceptor)
      storeProductsTransmisor = JSON.parse(cachedTransmisor)
      
      parseProductPrices(storeProductsReceptor)
      parseProductPrices(storeProductsTransmisor)
      
      return { storeProductsReceptor, storeProductsTransmisor }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', 'in', ['receptors', 'transmisors'])
    )
    
    const snapshot = await getDocs(q)
    
    // Separate by category
    const allDocs = snapshot.docs.map(doc => doc.data())
    storeProductsReceptor = allDocs.filter(p => p.category === 'receptors')
    storeProductsTransmisor = allDocs.filter(p => p.category === 'transmisors')

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Receptor', JSON.stringify(storeProductsReceptor))
      sessionStorage.setItem('Productos_Transmisor', JSON.stringify(storeProductsTransmisor))
    }

    parseProductPrices(storeProductsReceptor)
    parseProductPrices(storeProductsTransmisor)

    return { storeProductsReceptor, storeProductsTransmisor }

  } catch (error) {
    console.error("Error fetching Transmisor/Receptor products:", error)
    return { storeProductsReceptor: [], storeProductsTransmisor: [] }
  }
}

export default FirebaseTrasmisorReceptorProducts
