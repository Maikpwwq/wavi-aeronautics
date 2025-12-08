'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

async function FirebaseRadioControlProducts() {
  let storeProductsRC = []

  if (typeof window !== 'undefined') {
    const cachedRC = sessionStorage.getItem('Productos_RC')
    if (cachedRC) {
      storeProductsRC = JSON.parse(cachedRC)
      parseProductPrices(storeProductsRC)
      return { storeProductsRC }
    }
  }

  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'radio_control')

  // Define collections (Grouped for readability?)
  // Keeping original collection definitions to ensure we target the exact same paths
  const collectionPaths = [
    'betafpv/control-remoto/lite-radio2',
    'betafpv/control-remoto/lite-radio3',
    'betafpv/control-remoto/lite-radio3-pro',
    'eachine/control-remoto/liteRadio-2.4G',
    'flywoo/control-remoto/LiteRadio-V3-ELRS',
    'flywoo/control-remoto/LiteRadio-V3-TBS',
    'geprc/control-remoto/tinyRadio-GR8',
    'iflight-rc/control-remoto/iF8-E',
    'radio-master/control-remoto/T8-Lite',
    'radio-master/control-remoto/T8-Pro',
    'radio-master/control-remoto/zorro',
    'radio-master/control-remoto/tx12',
    'radio-master/control-remoto/tx16s',
    'radio-master/control-remoto/tx16-Max',
    'team-blacksheep/control-remoto/ethix-mambo',
    'team-blacksheep/control-remoto/tbs-mambo',
    'team-blacksheep/control-remoto/tango2',
    'team-blacksheep/control-remoto/tango2pro'
  ]

  try {
    const collectionRefs = collectionPaths.map(path => collection(productsDoc, path))
    
    // Fetch all concurrently
    const snapshots = await Promise.all(collectionRefs.map(ref => getDocs(ref)))
    
    // Flatten results
    storeProductsRC = snapshots.flatMap(snap => snap.docs.map(doc => doc.data()))

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_RC', JSON.stringify(storeProductsRC))
    }

    parseProductPrices(storeProductsRC)
    
    return { storeProductsRC }

  } catch (error) {
    console.error("Error fetching RadioControl products:", error)
    return { storeProductsRC: [] }
  }
}

export default FirebaseRadioControlProducts
