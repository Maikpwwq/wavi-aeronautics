'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
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

  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'Googles')

  const collectionPaths = [
    'betafpv',
    'DJI',
    'FatShark',
    'Iflight-rc',
    'Emaxusa',
    'Walksnail'
  ]

  try {
    const refs = collectionPaths.map(path => collection(productsDoc, path))
    const snapshots = await Promise.all(refs.map(ref => getDocs(ref)))
    
    productsGoogles = snapshots.flatMap(snap => snap.docs.map(doc => doc.data()))

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
