import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'

function FirebaseTrasmisorReceptorProducts (props) {
  let productosReceptor = null
  let productosTransmisor = null

  if (typeof window !== 'undefined') {
    // Perform localStorage action
    productosReceptor = sessionStorage.getItem('Productos_Receptor') || null
    productosTransmisor = sessionStorage.getItem('Productos_Transmisor') || null
  }
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'radio_control')

  let storeProductsReceptor = []
  let storeProductsTransmisor = []

  const collectionBetafpvReceptor = collection(
    productsDoc,
    'betafpv/receptor/BETAFPV-ELRS'
  )
  const collectionFlyskyReceptor = collection(
    productsDoc,
    'flysky/receptor/Flysky-FS-X14S-V2'
  )
  const collectionFlyskyReceptor2 = collection(
    productsDoc,
    'flysky/receptor/Flysky-FS-iA8X'
  )
  const collectionFlywooReceptor = collection(
    productsDoc,
    'flywoo/receptor/Flywoo-ELRS'
  )
  const collectionFrskyReceptor = collection(
    productsDoc,
    'frsky/receptor/Frsky_R-XSR'
  )
  const collectionFrskyReceptor2 = collection(
    productsDoc,
    'frsky/receptor/Frsky_XM+'
  )
  const collectioniFlightReceptor = collection(
    productsDoc,
    'iflight-rc/receptor/iFlight-R81-SPI'
  )
  const collectionRadioMasterReceptor = collection(
    productsDoc,
    'radio-master/receptor/NANO-ELRS-EP2'
  )
  const collectionRadioMasterReceptor2 = collection(
    productsDoc,
    'radio-master/receptor/RadioMaster-R81'
  )
  const collectionTeamBlacksheepReceptor = collection(
    productsDoc,
    'team-blacksheep/receptor/Crossfire-Nano-RX'
  )
  const collectionTeamBlacksheepReceptor2 = collection(
    productsDoc,
    'team-blacksheep/receptor/Crossfire-Nano-RX-Pro'
  )
  const collectionTeamBlacksheepReceptor3 = collection(
    productsDoc,
    'team-blacksheep/receptor/Crossfire-Nano-RX-SE'
  )
  const collectionTeamBlacksheepReceptor4 = collection(
    productsDoc,
    'team-blacksheep/receptor/Traser-Nano-RX'
  )

  const collectionTeamBlacksheepTransmisor = collection(
    productsDoc,
    'team-blacksheep/transmisor/Crossfire-Nano-Tx'
  )
  const collectionBetafpvTransmisor = collection(
    productsDoc,
    'betafpv/transmisor/ELRS-Nano-TX'
  )

  const receptorsFromFirestore = async () => {
    const collectionReceptor = [
      collectionBetafpvReceptor,
      collectionFlyskyReceptor,
      collectionFlyskyReceptor2,
      collectionFlywooReceptor,
      collectionFrskyReceptor,
      collectionFrskyReceptor2,
      collectioniFlightReceptor,
      collectionRadioMasterReceptor,
      collectionRadioMasterReceptor2,
      collectionTeamBlacksheepReceptor,
      collectionTeamBlacksheepReceptor2,
      collectionTeamBlacksheepReceptor3,
      collectionTeamBlacksheepReceptor4
    ]
    const productosReceptor = []
    for (const product of collectionReceptor) {
      // console.log(product, collectionReceptor)
      const productDataReceptor = await getDocs(product)
      productDataReceptor.forEach((DOC) => {
        productosReceptor.push(DOC.data())
      })
    }
    return productosReceptor
  }

  const transmisorsFromFirestore = async () => {
    const collectionTransmisor = [
      collectionBetafpvTransmisor,
      collectionTeamBlacksheepTransmisor
    ]
    const productosTransmisor = []
    for (const transmisor of collectionTransmisor) {
      // console.log(transmisor, collectionTransmisor)
      const productDataTransmisor = await getDocs(transmisor)
      productDataTransmisor.forEach((DOC) => {
        productosTransmisor.push(DOC.data())
      })
    }
    return productosTransmisor
  }

  const productosToSessionStore = () => {
    let receptorsData
    let receptors = []
    let transmisorsData
    let transmisors = []
    if (!productosReceptor) {
      // console.log(productosReceptor);
      receptorsData = receptorsFromFirestore()
      receptorsData.then((response) => {
        // console.log(response);
        receptors = response
        parsePrices(receptors, 'receptors')
      })
    } else {
      receptors = JSON.parse(productosReceptor)
      // parsePrices(receptors, 'receptors')
    }
    if (!productosTransmisor) {
      // console.log(productosReceptor);
      transmisorsData = transmisorsFromFirestore()
      transmisorsData.then((response) => {
        // console.log(response);
        transmisors = response
        parsePrices(transmisors, 'transmisors')
      })
    } else {
      transmisors = JSON.parse(productosTransmisor)
      // parsePrices(transmisors, 'transmisors')
    }
  }

  const parsePrices = (productos, clue) => {
    // console.log(productos);
    if (productos && productos.length > 0 && typeof window !== 'undefined') {
      productos.map((product, index, array) => {
        // console.log(product.precio);
        if (
          typeof parseInt(product.precio) === 'number' &&
          product.precio !== 'Agotado'
        ) {
          const dolarPrice = 4250 // 02-05-2023
          const trasportBase = 30 // USD
          const factorImportation = 1.5
          const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
          array[index].precio = dolarToCop.toLocaleString(
            'es-CO',
            { style: 'currency', currency: 'COP' }
          )
        }
      })
      // setStoreProductsReceptor(productos);
      // console.log(storeProducts)
      // console.log(clue, productos)
      if (clue === 'receptors') {
        sessionStorage.setItem('Productos_Receptor', JSON.stringify(productos))
        storeProductsReceptor = productos
      }
      if (clue === 'transmisors') {
        sessionStorage.setItem('Productos_Transmisor', JSON.stringify(productos))
        storeProductsTransmisor = productos
      }
    }
  }

  productosToSessionStore()
  if (storeProductsReceptor.length > 0 && storeProductsTransmisor.length > 0) {
    return { storeProductsReceptor, storeProductsTransmisor }
  }
}

export default FirebaseTrasmisorReceptorProducts
