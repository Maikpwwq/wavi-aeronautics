'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
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

  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'radio_control')

  const receptorPaths = [
    'betafpv/receptor/BETAFPV-ELRS',
    'flysky/receptor/Flysky-FS-X14S-V2',
    'flysky/receptor/Flysky-FS-iA8X',
    'flywoo/receptor/Flywoo-ELRS',
    'frsky/receptor/Frsky_R-XSR',
    'frsky/receptor/Frsky_XM+',
    'iflight-rc/receptor/iFlight-R81-SPI',
    'radio-master/receptor/NANO-ELRS-EP2',
    'radio-master/receptor/RadioMaster-R81',
    'team-blacksheep/receptor/Crossfire-Nano-RX',
    'team-blacksheep/receptor/Crossfire-Nano-RX-Pro',
    'team-blacksheep/receptor/Crossfire-Nano-RX-SE',
    'team-blacksheep/receptor/Traser-Nano-RX'
  ]

  const transmisorPaths = [
    'team-blacksheep/transmisor/Crossfire-Nano-Tx',
    'betafpv/transmisor/ELRS-Nano-TX'
  ]

  try {
    const receptorRefs = receptorPaths.map(path => collection(productsDoc, path))
    const transmisorRefs = transmisorPaths.map(path => collection(productsDoc, path))
    
    // Fetch all
    const snapshotsReceptor = await Promise.all(receptorRefs.map(ref => getDocs(ref)))
    const snapshotsTransmisor = await Promise.all(transmisorRefs.map(ref => getDocs(ref)))

    storeProductsReceptor = snapshotsReceptor.flatMap(snap => snap.docs.map(doc => doc.data()))
    storeProductsTransmisor = snapshotsTransmisor.flatMap(snap => snap.docs.map(doc => doc.data()))

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
