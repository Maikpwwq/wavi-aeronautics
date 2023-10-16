'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'

function FirebaseDigitalVTXProducts (props) {
  let productosDigitalVTX = null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    productosDigitalVTX = sessionStorage.getItem('Digital_VTX') || null
  }
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'digital_vtx')

  let storeDigitalVTX = []

  const collectionVTXDJI = collection(
    productsDoc,
    'DJI'
  )

  const collectionVTXCADDX = collection(
    productsDoc,
    'CADDX'
  )

  const productsFromFirestore = async () => {
    const collectionDigitalVTX = [
      collectionVTXDJI,
      collectionVTXCADDX
    ]
    const productosDigitalVTX = []
    for (const product of collectionDigitalVTX) {
      // console.log(product, collectionRC);
      const productDataDigitalVTX = await getDocs(product)
      productDataDigitalVTX.forEach((DOC) => {
        productosDigitalVTX.push(DOC.data())
      })
    }
    return productosDigitalVTX
  }

  const productosToSessionStore = () => {
    let productData
    let productos = []
    if (!productosDigitalVTX) {
      // console.log(productosDigitalVTX);
      productData = productsFromFirestore()
      productData.then((response) => {
        // console.log(response);
        productos = response
        parsePrices(productos)
      })
    } else {
      productos = JSON.parse(productosDigitalVTX)
      parsePrices(productos)
    }
  }

  const parsePrices = (productos) => {
    // console.log(productos);
    if (productos && productos.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('Digital_VTX', JSON.stringify(productos))
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
      // setstoreDigitalVTX(productos);
      // console.log(storeProducts)
      storeDigitalVTX = productos
    }
  }

  productosToSessionStore()
  if (storeDigitalVTX.length > 0) {
    return { storeDigitalVTX }
  }
}

export default FirebaseDigitalVTXProducts
