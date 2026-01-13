'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, collectionGroup, query } from 'firebase/firestore'
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

  // NEW: Collection Group query for new hierarchical products
  const newItemsQuery = query(collectionGroup(_firestore, 'items'))

  try {
    const [snapshotKits, snapshotRC, snapshotHD, snapshotNewItems] = await Promise.all([
      getDocs(productsCollectionKits),
      getDocs(productsCollectionRC),
      getDocs(productsColGEPRC),
      getDocs(newItemsQuery)
    ])

    // Legacy Data
    productosKits = snapshotKits.docs.map(doc => doc.data())
    productosRC = snapshotRC.docs.map(doc => doc.data())
    productosHD = snapshotHD.docs.map(doc => doc.data())

    // New Data (filtered by category)
    const newItems = snapshotNewItems.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    newItems.forEach(item => {
      // Deduplicate based on productID just in case
      const existsInLegacy = (list) => list.some(p => p.productID === item.productID)

      if (item.category === 'dronesKit' && !existsInLegacy(productosKits)) {
        productosKits.push(item)
      } else if (item.category === 'dronesRC' && !existsInLegacy(productosRC)) {
        productosRC.push(item)
      } else if (item.category === 'dronesHD' && !existsInLegacy(productosHD)) {
        productosHD.push(item)
      }
    })

    // Cache raw data
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
