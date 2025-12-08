'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
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

  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'digital_vtx')

  const collectionPaths = ['DJI', 'CADDX']

  try {
    const refs = collectionPaths.map(path => collection(productsDoc, path))
    const snapshots = await Promise.all(refs.map(ref => getDocs(ref)))
    
    storeDigitalVTX = snapshots.flatMap(snap => snap.docs.map(doc => doc.data()))

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
