'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseDroneProducts() {
  let storeProductsKits = []
  let storeProductsRC = []
  let storeProductsHD = []

  // Try to load from SessionStorage first (Client-side only)
  if (typeof window !== 'undefined') {
    const cachedKits = sessionStorage.getItem('Productos_Drones_Kits')
    const cachedRC = sessionStorage.getItem('Productos_DronesRC')
    const cachedHD = sessionStorage.getItem('Productos_DronesHD')

    if (cachedKits && cachedRC && cachedHD) {
      storeProductsKits = JSON.parse(cachedKits)
      storeProductsRC = JSON.parse(cachedRC)
      storeProductsHD = JSON.parse(cachedHD)
      
      // Parse prices for display
      parseProductPrices(storeProductsKits)
      parseProductPrices(storeProductsRC)
      parseProductPrices(storeProductsHD)

      return {
        storeProductsKits,
        storeProductsRC,
        storeProductsHD
      }
    }
  }

  // New Hierarchy Fetch: products/{category}/brands/{brand}/items
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', 'in', ['dronesKit', 'dronesRC', 'dronesHD'])
    )
    
    const snapshot = await getDocs(q)
    const allDocs = snapshot.docs.map(doc => doc.data())

    // Separate by category
    storeProductsKits = allDocs.filter(p => p.category === 'dronesKit')
    storeProductsRC = allDocs.filter(p => p.category === 'dronesRC')
    storeProductsHD = allDocs.filter(p => p.category === 'dronesHD')

    // Cache raw data
    if (typeof window !== 'undefined') {
       sessionStorage.setItem('Productos_Drones_Kits', JSON.stringify(storeProductsKits))
       sessionStorage.setItem('Productos_DronesRC', JSON.stringify(storeProductsRC))
       sessionStorage.setItem('Productos_DronesHD', JSON.stringify(storeProductsHD))
    }

    parseProductPrices(storeProductsKits)
    parseProductPrices(storeProductsRC)
    parseProductPrices(storeProductsHD)

    return {
      storeProductsKits,
      storeProductsRC,
      storeProductsHD
    }

  } catch (error) {
    console.error("Error fetching drone products:", error)
    return {
      storeProductsKits: [],
      storeProductsRC: [],
      storeProductsHD: []
    }
  }
}

export default FirebaseDroneProducts
