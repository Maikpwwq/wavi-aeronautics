'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'

function FirebaseRadioControlProducts (props) {
  let productosRadioControl = null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    productosRadioControl = sessionStorage.getItem('Productos_RC') || null
  }
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'radio_control')

  let storeProductsRC = []

  const collectionBetafpvCR = collection(
    productsDoc,
    'betafpv/control-remoto/lite-radio2'
  )
  const collectionBetafpvCR2 = collection(
    productsDoc,
    'betafpv/control-remoto/lite-radio3'
  )
  const collectionBetafpvCR3 = collection(
    productsDoc,
    'betafpv/control-remoto/lite-radio3-pro'
  )
  const collectionEachineCR = collection(
    productsDoc,
    'eachine/control-remoto/liteRadio-2.4G'
  )
  const collectionFlywooCR = collection(
    productsDoc,
    'flywoo/control-remoto/LiteRadio-V3-ELRS'
  )
  const collectionFlywooCR2 = collection(
    productsDoc,
    'flywoo/control-remoto/LiteRadio-V3-TBS'
  )
  const collectionGeprcCR = collection(
    productsDoc,
    'geprc/control-remoto/tinyRadio-GR8'
  )
  const collectionIflightCR = collection(
    productsDoc,
    'iflight-rc/control-remoto/iF8-E'
  )
  const collectionRadioMasterCR = collection(
    productsDoc,
    'radio-master/control-remoto/T8-Lite'
  )
  const collectionRadioMasterCR2 = collection(
    productsDoc,
    'radio-master/control-remoto/T8-Pro'
  )
  const collectionRadioMasterCR3 = collection(
    productsDoc,
    'radio-master/control-remoto/zorro'
  )
  const collectionRadioMasterCR4 = collection(
    productsDoc,
    'radio-master/control-remoto/tx12'
  )
  const collectionRadioMasterCR5 = collection(
    productsDoc,
    'radio-master/control-remoto/tx16s'
  )
  const collectionRadioMasterCR6 = collection(
    productsDoc,
    'radio-master/control-remoto/tx16-Max'
  )
  const collectionTBSCR = collection(
    productsDoc,
    'team-blacksheep/control-remoto/ethix-mambo'
  )
  const collectionTBSCR2 = collection(
    productsDoc,
    'team-blacksheep/control-remoto/tbs-mambo'
  )
  const collectionTBSCR3 = collection(
    productsDoc,
    'team-blacksheep/control-remoto/tango2'
  )
  const collectionTBSCR4 = collection(
    productsDoc,
    'team-blacksheep/control-remoto/tango2pro'
  )

  const productsFromFirestore = async () => {
    const collectionRC = [
      collectionBetafpvCR,
      collectionBetafpvCR2,
      collectionBetafpvCR3,
      collectionEachineCR,
      collectionFlywooCR,
      collectionFlywooCR2,
      collectionGeprcCR,
      collectionIflightCR,
      collectionRadioMasterCR,
      collectionRadioMasterCR2,
      collectionRadioMasterCR3,
      collectionRadioMasterCR4,
      collectionRadioMasterCR5,
      collectionRadioMasterCR6,
      collectionTBSCR,
      collectionTBSCR2,
      collectionTBSCR3,
      collectionTBSCR4
    ]
    const productosRC = []
    for (const product of collectionRC) {
      // console.log(product, collectionRC);
      const productDataRC = await getDocs(product)
      productDataRC.forEach((DOC) => {
        productosRC.push(DOC.data())
      })
    }
    return productosRC
  }

  const productosToSessionStore = () => {
    let productData
    let productos = []
    if (!productosRadioControl) {
      // console.log(productosRadioControl);
      productData = productsFromFirestore()
      productData.then((response) => {
        // console.log(response);
        productos = response
        parsePrices(productos)
      })
    } else {
      productos = JSON.parse(productosRadioControl)
      parsePrices(productos)
    }
  }

  const parsePrices = (productos) => {
    // console.log(productos);
    if (productos && productos.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_RC', JSON.stringify(productos))
      productos.map((product, index, array) => {
        // console.log(product.precio);
        if (
          typeof parseInt(product.precio) === 'number' &&
          product.precio !== 'Agotado'
        ) {
          const dolarPrice = 4710 // 02-05-2023
          const trasportBase = 30 // USD
          const factorImportation = 1.5
          const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
          array[index].precio = dolarToCop.toLocaleString(
            'es-CO',
            { style: 'currency', currency: 'COP' }
          )
        }
      })
      // setStoreProductsRC(productos);
      // console.log(storeProducts)
      storeProductsRC = productos
    }
  }

  productosToSessionStore()
  if (storeProductsRC.length > 0) {
    return { storeProductsRC }
  }
}

export default FirebaseRadioControlProducts
