'use client'
import { firestore } from '@/firebase/firebaseClient'
import { getDocs, query, collectionGroup, where } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseFramesProducts() {
  let productsFrames = []

  if (typeof window !== 'undefined') {
    const cachedFrames = sessionStorage.getItem('Productos_Frames')
    if (cachedFrames) {
      try {
        productsFrames = JSON.parse(cachedFrames)
        parseProductPrices(productsFrames)
        return { productsFrames }
      } catch (e) {
        console.warn('Error reading Productos_Frames cache:', e)
      }
    }
  }

  // Hierarchical fetch: products/{category}/brands/{brand}/items where category in ['frames', 'chasis']
  try {
    const q = query(
      collectionGroup(firestore, 'items'),
      where('category', 'in', ['frames', 'chasis'])
    )

    const snapshot = await getDocs(q)
    productsFrames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Frames', JSON.stringify(productsFrames))
    }

    parseProductPrices(productsFrames)

    return { productsFrames }
  } catch (error) {
    console.error('Error fetching Frames products:', error)
    return { productsFrames: [] }
  }
}

export default FirebaseFramesProducts
