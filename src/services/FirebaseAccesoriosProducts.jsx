'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
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

  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'radio_control') // Warning: Accesorios seems to read from radio_control? Copy-paste error in original?
  // Checking original file: "const productsDoc = doc(productsRef, 'radio_control')"
  // But collections inside are "betafpv/baterias/...", "emax-usa/baterias/..."
  // If this path worked before, it should work now. 
  
  const collectionPaths = [
    'betafpv/baterias/2PCS-2s-300mAh',
    'eachine/baterias/E520S-1200mAh',
    'eachine/baterias/E58-500mAh',
    'emax-usa/baterias/1S-300mAh',
    'emax-usa/baterias/1S-450mAh',
    'emax-usa/baterias/2PCS-2S-300mAh',
    'flywoo/baterias/4PCS-1S-450mAh',
    'flywoo/baterias/4PCS-1S-750mAh',
    'geprc/baterias/4S-650a850mAh',
    'iflight-rc/baterias/3S-450mAh',
    'uruav/baterias/1S-250mAh'
  ]

  try {
    const refs = collectionPaths.map(path => collection(productsDoc, path))
    const snapshots = await Promise.all(refs.map(ref => getDocs(ref)))
    
    productsBaterias = snapshots.flatMap(snap => snap.docs.map(doc => doc.data()))

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
