'use client'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs } from 'firebase/firestore'

function FirebaseDroneProducts (props) {
  let productosDrones = null
  let productosDronesRC = null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    productosDrones = sessionStorage.getItem('Productos_Drones') || null
    productosDronesRC = sessionStorage.getItem('Productos_DronesRC') || null
  }
  const _firestore = firestore
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'dron')
  const productsCollection = collection(productsDoc, 'kit_fpv_dron')
  const productsCollectionRC = collection(productsDoc, 'RC')

  // const [storeProducts, setStoreProducts] = useState([]);
  // const [storeProductsRC, setStoreProductsRC] = useState([]);

  let storeProducts = []
  let storeProductsRC = []

  // Lectura del catalogo de productos desde firestore
  const productsFromFirestore = async () => {
    const productData = await getDocs(productsCollection)
    const productDataRC = await getDocs(productsCollectionRC)
    const productos = []
    const productosRC = []
    productData.forEach((DOC) => {
      productos.push(DOC.data())
    })
    productDataRC.forEach((DOC) => {
      productosRC.push(DOC.data())
    })
    return [productos, productosRC]
  }

  const productosToSessionStore = () => {
    let productData
    let productos = []
    let productosRC = []
    if (!productosDrones || !productosDronesRC) {
      // console.log(productosDrones, productosDronesRC);
      productData = productsFromFirestore()
      productData.then((response) => {
        // console.log(response[0], response[1]);
        productos = response[0]
        productosRC = response[1]
        parsePrices(productos, productosRC)
      })
    } else {
      productos = JSON.parse(productosDrones)
      productosRC = JSON.parse(productosDronesRC)
      parsePrices(productos, productosRC)
    }
  }

  const parsePrices = (productos, productosRC) => {
    // console.log(productos, productosRC);
    if (productos && productos.length > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('Productos_Drones', JSON.stringify(productos))
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
      storeProducts = productos
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
      storeProductsRC = productosRC
    }
  }

  productosToSessionStore()
  if (storeProducts.length > 0 && storeProductsRC.length > 0) {
    const response = { storeProducts, storeProductsRC }
    return response
  }
}

export default FirebaseDroneProducts
