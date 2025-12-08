'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseDroneProducts() {
  let productosKits = []
  let productosRC = []
  let productosHD = []

  // Try to load from SessionStorage first (Client-side only)
  if (typeof window !== 'undefined') {
    const cachedKits = sessionStorage.getItem('Productos_Drones_Kits')
    const cachedRC = sessionStorage.getItem('Productos_DronesRC')
    const cachedHD = sessionStorage.getItem('Productos_DronesHD')

    if (cachedKits && cachedRC && cachedHD) {
      productosKits = JSON.parse(cachedKits)
      productosRC = JSON.parse(cachedRC)
      productosHD = JSON.parse(cachedHD)
      
      // Parse prices for display
      parseProductPrices(productosKits)
      parseProductPrices(productosRC)
      parseProductPrices(productosHD)

      return {
        storeProductsKits: productosKits,
        storeProductsRC: productosRC,
        storeProductsHD: productosHD
      }
    }
  }

  // Fetch from Firestore if not in cache
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'dron')
  
  const productsCollectionKits = collection(productsDoc, 'kit_fpv_dron')
  const productsCollectionRC = collection(productsDoc, 'RC')
  const productsColGEPRC = collection(productsDoc, 'geprc')

  try {
    const [snapshotKits, snapshotRC, snapshotHD] = await Promise.all([
      getDocs(productsCollectionKits),
      getDocs(productsCollectionRC),
      getDocs(productsColGEPRC)
    ])

    productosKits = snapshotKits.docs.map(doc => doc.data())
    productosRC = snapshotRC.docs.map(doc => doc.data())
    productosHD = snapshotHD.docs.map(doc => doc.data())

    // Cache raw data (before price formatting?) 
    // The original code seemed to cache the raw parsed data or re-parsed it. 
    // Ideally we cache raw data and parse on render, but keeping consistent with original flow:
    // We'll cache the raw data to avoid double-price-conversion if reload happens?
    // Actually the previous code cached the data *before* mutating? No, it mutated inside map.
    // Let's safe-guard: Cache raw, then parse.
    
    if (typeof window !== 'undefined') {
       sessionStorage.setItem('Productos_Drones_Kits', JSON.stringify(productosKits))
       sessionStorage.setItem('Productos_DronesRC', JSON.stringify(productosRC))
       sessionStorage.setItem('Productos_DronesHD', JSON.stringify(productosHD))
    }

    parseProductPrices(productosKits)
    parseProductPrices(productosRC)
    parseProductPrices(productosHD)

    return {
      storeProductsKits: productosKits,
      storeProductsRC: productosRC,
      storeProductsHD: productosHD
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
