'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'

function FirebaseDroneProducts (props) {
  let productosDronesKits = null
  let productosDronesRC = null
  let productosDronesHD = null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    productosDronesKits = sessionStorage.getItem('Productos_Drones_Kits') || null
    productosDronesRC = sessionStorage.getItem('Productos_DronesRC') || null
    productosDronesHD = sessionStorage.getItem('Productos_DronesHD') || null
  }
  const _firestore = firestore
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'dron')
  const productsCollectionKits = collection(productsDoc, 'kit_fpv_dron')
  const productsCollectionRC = collection(productsDoc, 'RC')
  const productsColGEPRC = collection(productsDoc, 'geprc')
  // const productsColIFLIGHT = collection(productsDoc, 'iflight')
  // const productsColFLYWOO = collection(productsDoc, 'flywoo')
  // const productsColEMAXUSA = collection(productsDoc, 'emaxusa')
  // const productsColEACHINE = collection(productsDoc, 'eachine')
  // const productsColBETAFPV = collection(productsDoc, 'betafpv')

  // const [storeProducts, setStoreProducts] = useState([]);
  // const [storeProductsRC, setStoreProductsRC] = useState([]);

  let storeProductsKits = []
  let storeProductsRC = []
  let storeProductsHD = []

  // Lectura del catalogo de productos desde firestore
  const productsFromFirestore = async () => {
    const productDataKits = await getDocs(productsCollectionKits)
    const productDataRC = await getDocs(productsCollectionRC)
    const productDronesGeprc = await getDocs(productsColGEPRC)
    const productosKits = []
    const productosRC = []
    const productosHD = []
    productDataKits.forEach((DOC) => {
      productosKits.push(DOC.data())
    })
    productDataRC.forEach((DOC) => {
      productosRC.push(DOC.data())
    })
    productDronesGeprc.forEach((DOC) => {
      productosHD.push(DOC.data())
    })
    return [productosKits, productosRC, productosHD]
  }

  const productosToSessionStore = () => {
    let productData
    let productosKits = []
    let productosRC = []
    let productosHD = []
    if (!productosDronesKits || !productosDronesRC || !productosDronesHD) {
      // console.log(productosDrones, productosDronesRC);
      productData = productsFromFirestore()
      productData.then((response) => {
        // console.log(response[0], response[1]);
        productosKits = response[0]
        productosRC = response[1]
        productosHD = response[2]
        parsePrices(productosKits, productosRC, productosHD)
      })
    } else {
      productosKits = JSON.parse(productosDronesKits)
      productosRC = JSON.parse(productosDronesRC)
      productosHD = JSON.parse(productosDronesHD)
      parsePrices(productosKits, productosRC, productosHD)
    }
  }

  const parsePrices = (productosKits, productosRC, productosHD) => {
    // console.log(productos, productosRC);
    if (productosKits && productosKits.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Drones_Kits', JSON.stringify(productosKits))
      productosKits.map((product, index, array) => {
        // console.log(product.precio);
        if (
          typeof parseInt(product.precio) === 'number' &&
          product.precio !== 'Agotado'
        ) {
          const dolarPrice = parseInt(process.env.NEXT_PUBLIC_DOLARTOCOP)
          const trasportBase = 30 // USD
          const factorImportation = 1.5
          const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
          array[index].precio = dolarToCop.toLocaleString(
            'es-CO',
            { style: 'currency', currency: 'COP' }
          )
        }
      })
      storeProductsKits = productosKits
    }
    if (
      productosRC &&
      productosRC.length > 0 &&
      typeof window !== 'undefined'
    ) {
      sessionStorage.setItem('Productos_DronesRC', JSON.stringify(productosRC))
      productosRC.map((product, index, array) => {
        if (
          typeof parseInt(product.precio) === 'number' &&
          product.precio !== 'Agotado'
        ) {
          const dolarPrice = parseInt(process.env.NEXT_PUBLIC_DOLARTOCOP)
          const trasportBase = 30 // USD
          const factorImportation = 1.5
          const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
          array[index].precio = dolarToCop.toLocaleString(
            'es-CO',
            { style: 'currency', currency: 'COP' }
          )
        }
      })
      storeProductsRC = productosRC
    }
    // Productos_DronesHD
    if (
      productosHD &&
      productosHD.length > 0 &&
      typeof window !== 'undefined'
    ) {
      sessionStorage.setItem('Productos_DronesHD', JSON.stringify(productosHD))
      productosHD.map((product, index, array) => {
        if (
          typeof parseInt(product.precio) === 'number' &&
          product.precio !== 'Agotado'
        ) {
          const dolarPrice = process.env.NEXT_PUBLIC_DOLARTOCOP
          console.log('dollar', dolarPrice, parseInt(dolarPrice))
          const trasportBase = 30 // USD
          const factorImportation = 1.5
          const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
          array[index].precio = dolarToCop.toLocaleString(
            'es-CO',
            { style: 'currency', currency: 'COP' }
          )
        }
      })
      storeProductsHD = productosHD
    }
  }

  productosToSessionStore()
  if (storeProductsKits.length > 0 && storeProductsRC.length > 0 && storeProductsHD.length > 0) {
    const response = { storeProductsKits, storeProductsRC, storeProductsHD }
    return response
  }
}

export default FirebaseDroneProducts
