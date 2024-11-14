import { collection, doc, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient' // storage

function FirebaseGooglesProducts (props) {
  // let shoppingCartID = null
  let productosGoogles = null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    // shoppingCartID = sessionStorage.getItem('cartID') || null
    productosGoogles = sessionStorage.getItem('Productos_Googles') || null
  }
  // const _storage = storage
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'Googles')
  let productsGoogles = []

  const collectionBetafpvGoogles = collection(
    productsDoc,
    'betafpv'
  )
  const collectionDJIGoogles = collection(
    productsDoc,
    'DJI'
  )
  const collectionFatSharkGoogles = collection(
    productsDoc,
    'FatShark'
  )
  const collectionIflightRcGoogles = collection(
    productsDoc,
    'Iflight-rc'
  )
  const collectionEmaxusaGoogles = collection(
    productsDoc,
    'Emaxusa'
  )
  const collectionWalksnailGoogles = collection(
    productsDoc,
    'Walksnail'
  )

  const productsFromFirestore = async () => {
    const collectionGoogles = [
      collectionBetafpvGoogles,
      collectionDJIGoogles,
      collectionFatSharkGoogles,
      collectionIflightRcGoogles,
      collectionEmaxusaGoogles,
      collectionWalksnailGoogles
    ] // new Array(
    const productosGoogles = []
    for (const product of collectionGoogles) {
      // console.log(product, collectionGoogles)
      const productDataGoogles = await getDocs(product)
      productDataGoogles.forEach((DOC) => {
        productosGoogles.push(DOC.data())
      })
    }
    return productosGoogles
  }

  const productosToSessionStore = () => {
    let productData
    let productos = []
    if (!productosGoogles) {
      // console.log(productosGoogles);
      productData = productsFromFirestore()
      productData.then((response) => {
        // console.log(response);
        productos = response
        parsePrices(productos)
      })
    } else {
      productos = JSON.parse(productosGoogles)
      parsePrices(productos)
    }
  }

  const parsePrices = (productos) => {
    // console.log(productos)
    if (productos && productos.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Googles', JSON.stringify(productos))
      productos.map((product, index, array) => {
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
      // setStoreProductsBaterias(productos);
      // console.log(storeProducts)
      productsGoogles = productos
    }
  }
  productosToSessionStore()
  if (productsGoogles.length > 0) {
    return { productsGoogles }
  }
}

export default FirebaseGooglesProducts
