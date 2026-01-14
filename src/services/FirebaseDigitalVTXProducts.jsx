'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseDigitalVTXProducts() {
  let storeDigitalVTX = []

  if (typeof window !== 'undefined') {
    const cachedVTX = sessionStorage.getItem('Digital_VTX')
    if (cachedVTX) {
      storeDigitalVTX = JSON.parse(cachedVTX)
      parseProductPrices(storeDigitalVTX)
      return { storeDigitalVTX }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', '==', 'digitalVTX')
    )
    
    const snapshot = await getDocs(q)
    storeDigitalVTX = snapshot.docs.map(doc => doc.data())

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Digital_VTX', JSON.stringify(storeDigitalVTX))
    }

    parseProductPrices(storeDigitalVTX)
    
    return { storeDigitalVTX }

  } catch (error) {
    console.error("Error fetching DigitalVTX products:", error)
    return { storeDigitalVTX: [] }
  }
}

export default FirebaseDigitalVTXProducts
