'use client'
import { firestore, auth } from '@/firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
// import { sharingInformationService } from "./sharing-information";
import PropTypes from 'prop-types'

export const FirebaseCompareShoppingCartIds = ({ products, updateCart }) => {
  // console.log('products', products, updateCart)
  const AllProducts = sessionStorage.getItem('Todos los productos') || null
  // const shoppingCartItems =
  //   sessionStorage.getItem("cartProducts") !== 0
  //     ? sessionStorage.getItem("cartProducts")
  //     : null;
  // const shoppingCartSuma =
  //   sessionStorage.getItem("cartSum") !== 0
  //     ? sessionStorage.getItem("cartSum")
  //     : null;

  //     if (shoppingCartSuma > 0) {
  //       sessionStorage.setItem("cartSum", shoppingCartSuma);
  //     }

  const productosIds = []
  const productosCantidades = []

  const extractProductsID = (products) => {
    products.map(({ productID }, index) => {
      productosIds[index] = productID
    })
    // console.log('extractProductsID', productosIds)
  }

  const extractProductAmount = (products) => {
    products.map(({ cantidad }, index) => {
      productosCantidades[index] = cantidad
    })
    // console.log('extractProductAmount', productosCantidades)
  }

  const user = auth.currentUser || {}
  const userID = user.uid || null
  const shoppingCartID = sessionStorage.getItem('cartID')
  const usedID = userID || shoppingCartID
  const _firestore = firestore
  // Dron
  const storeKitRef = collection(_firestore, 'productos/dron/kit_fpv_dron')
  const storeRCRef = collection(_firestore, 'productos/dron/RC')
  const storeGepRCHDRef = collection(_firestore, 'productos/dron/geprc')
  // Googles
  const storeGooglesBetafpv = collection(_firestore, 'productos/Googles/Betafpv')
  const storeGooglesDJI = collection(_firestore, 'productos/Googles/DJI')
  const storeGooglesEmaxusa = collection(_firestore, 'productos/Googles/Emaxusa')
  const storeGooglesFatShark = collection(_firestore, 'productos/Googles/FatShark')
  const storeGooglesIflightRc = collection(_firestore, 'productos/Googles/Iflight-rc')
  const storeGooglesWalksnail = collection(_firestore, 'productos/Googles/Walksnail')
  // Radio Control
  // Betafpv
  const storeBetafpvRef = collection(
    _firestore,
    'productos/radio_control/betafpv/baterias/2PCS-2s-300mAh'
  )
  const storeBetafpvRef2 = collection(
    _firestore,
    'productos/radio_control/betafpv/control-remoto/lite-radio2'
  )
  const storeBetafpvRef3 = collection(
    _firestore,
    'productos/radio_control/betafpv/control-remoto/lite-radio3'
  )
  const storeBetafpvRef4 = collection(
    _firestore,
    'productos/radio_control/betafpv/control-remoto/lite-radio3-pro'
  )
  const storeBetafpvRef5 = collection(
    _firestore,
    'productos/radio_control/betafpv/receptor/BETAFPV-ELRS'
  )
  // Eachine
  const storeEachineRef = collection(
    _firestore,
    'productos/radio_control/eachine/baterias/E520S-1200mAh'
  )
  const storeEachineRef2 = collection(
    _firestore,
    'productos/radio_control/eachine/baterias/E58-500mAh'
  )
  const storeEachineRef3 = collection(
    _firestore,
    'productos/radio_control/eachine/control-remoto/liteRadio-2.4G'
  )
  const storeEachineRef4 = collection(
    _firestore,
    'productos/radio_control/eachine/control-remoto/FPV-EX5/'
  )
  // EmaxUsa
  const storeEmaxUsaRef = collection(
    _firestore,
    'productos/radio_control/emax-usa/baterias/1S-300mAh'
  )
  const storeEmaxUsaRef2 = collection(
    _firestore,
    'productos/radio_control/emax-usa/baterias/1S-450mAh'
  )
  const storeEmaxUsaRef3 = collection(
    _firestore,
    'productos/radio_control/emax-usa/baterias/2PCS-2S-300mAh'
  )
  const storeEmaxUsaRef4 = collection(
    _firestore,
    'productos/radio_control/emax-usa/control-remoto/E8'
  )
  // Flysky
  const storeFlyskyRef = collection(
    _firestore,
    'productos/radio_control/flysky/receptor/Flysky-FS-X14S-V2'
  )
  const storeFlyskyRef2 = collection(
    _firestore,
    'productos/radio_control/flysky/receptor/Flysky-FS-iA8X'
  )
  // Flywoo
  const storeFlywooRef = collection(
    _firestore,
    'productos/radio_control/flywoo/baterias/4PCS-1S-450mAh'
  )
  const storeFlywooRef2 = collection(
    _firestore,
    'productos/radio_control/flywoo/baterias/4PCS-1S-750mAh'
  )
  const storeFlywooRef3 = collection(
    _firestore,
    'productos/radio_control/flywoo/control-remoto/LiteRadio-V3-ELRS'
  )
  const storeFlywooRef4 = collection(
    _firestore,
    'productos/radio_control/flywoo/control-remoto/LiteRadio-V3-TBS'
  )
  const storeFlywooRef5 = collection(
    _firestore,
    'productos/radio_control/flywoo/receptor/Flywoo-ELRS'
  )
  // Frsky
  const storeFrskyRef = collection(_firestore, 'productos/radio_control/frsky/receptor/Frsky_R-XSR')
  const storeFrskyRef2 = collection(_firestore, 'productos/radio_control/frsky/receptor/Frsky_XM+')
  // Geprc
  const storeGeprcRef = collection(_firestore, 'productos/radio_control/geprc/baterias/4S-650a850mAh')
  const storeGeprcRef2 = collection(_firestore, 'productos/radio_control/geprc/control-remoto/tinyRadio-GR8')

  // Iflightrc
  const storeIflightRef = collection(
    _firestore,
    'productos/radio_control/iflight-rc/baterias/3S-450mAh'
  )
  const storeIflightRef2 = collection(
    _firestore,
    'productos/radio_control/iflight-rc/cargadores/M4-AC30-1-4S'
  )
  const storeIflightRef3 = collection(
    _firestore,
    'productos/radio_control/iflight-rc/control-remoto/C8-ELRS'
  )
  const storeIflightRef4 = collection(
    _firestore,
    'productos/radio_control/iflight-rc/control-remoto/iF8-E'
  )
  const storeIflightRef5 = collection(
    _firestore,
    'productos/radio_control/iflight-rc/receptor/iFlight-R81-SPI'
  )
  // RadioMaster
  const storeRadioMasterRef = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/T8-Lite'
  )
  const storeRadioMasterRef2 = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/T8-Pro'
  )
  const storeRadioMasterRef3 = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/zorro'
  )
  const storeRadioMasterRef4 = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/tx12'
  )
  const storeRadioMasterRef5 = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/tx16s'
  )
  const storeRadioMasterRef6 = collection(
    _firestore,
    'productos/radio_control/radio-master/control-remoto/tx16-Max'
  )
  const storeRadioMasterRef7 = collection(
    _firestore,
    'productos/radio_control/radio-master/receptor/NANO-ELRS-EP2'
  )
  const storeRadioMasterRef8 = collection(
    _firestore,
    'productos/radio_control/radio-master/receptor/RadioMaster-R81'
  )
  // team-blacksheep
  const storeTBSRef = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/control-remoto/ethix-mambo'
  )
  const storeTBSRef2 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/control-remoto/tango2pro'
  )
  const storeTBSRef3 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/control-remoto/tango2'
  )
  const storeTBSRef4 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/control-remoto/tbs-mambo'
  )
  const storeTBSRef5 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/receptor/Crossfire-Nano-Rx-SE'
  )
  const storeTBSRef6 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/receptor/Tracer-Nano-Rx'
  )
  const storeTBSRef7 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/receptor/Crossfire-Nano-RX'
  )
  const storeTBSRef8 = collection(
    _firestore,
    'productos/radio_control/team-blacksheep/receptor/Crossfire-Nano-Rx-Pro'
  )

  // Uruav
  const storeUruavRef = collection(_firestore, 'productos/radio_control/uruav/baterias/1S-250mAh')

  const shoppingCart = []

  // // Betafpv
  // const collectionsBetafpv = [
  //   storeBetafpvRef, storeBetafpvRef2, storeBetafpvRef3, storeBetafpvRef4, storeBetafpvRef5
  // ]
  // // Eachine
  // const collectionsEachine = [RefEachine, RefEachine2, RefEachine3, RefEachine4]
  // // Emaxusa
  // const collectionsEmaxusa = [RefEmaxusa, RefEmaxusa2, RefEmaxusa3, RefEmaxusa4]
  // // Flysky
  // const collectionsFlysky = [RefFlysky, RefFlysky2]
  // // Flywoo
  // const collectionsFlywoo = [RefFlywoo, RefFlywoo2, RefFlywoo3, RefFlywoo4, RefFlywoo5]
  // // Frsky
  // const collectionsFrsky = [RefFrsky, RefFrsky2]
  // // Geprc
  // const collectionsGeprc = [RefGeprc, RefGeprc2]
  // // Iflightrc
  // const collectionsIflightrc = [RefIflightrc, RefIflightrc2, RefIflightrc3, RefIflightrc4, RefIflightrc5]
  // // Radiomaster
  // const collectionsRadioMaster = [RefRadiomaster, RefRadiomaster2, RefRadiomaster3, RefRadiomaster4, RefRadiomaster5, RefRadiomaster6]
  // // Teamblacksheep
  // const collectionsTeamblacksheep = [RefTeamblacksheep, RefTeamblacksheep2, RefTeamblacksheep3, RefTeamblacksheep4, RefTeamblacksheep5, RefTeamblacksheep6]
  // // Uruav
  // const collectionsUruav = [RefUruav]

  // TODO: replace for arrow function: search product by id? need to use all Refs in comparison
  const productsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const collectionsWavi = [
      storeGepRCHDRef,
      storeRCRef,
      storeKitRef,
      storeGooglesBetafpv, storeGooglesDJI, storeGooglesEmaxusa, storeGooglesFatShark, storeGooglesIflightRc, storeGooglesWalksnail,
      storeBetafpvRef,
      storeBetafpvRef2,
      storeBetafpvRef3,
      storeBetafpvRef4,
      storeBetafpvRef5,
      storeEachineRef,
      storeEachineRef2,
      storeEachineRef3,
      storeEachineRef4,
      storeEmaxUsaRef,
      storeEmaxUsaRef2,
      storeEmaxUsaRef3,
      storeEmaxUsaRef4,
      storeFlyskyRef,
      storeFlyskyRef2,
      storeFlywooRef,
      storeFlywooRef2,
      storeFlywooRef3,
      storeFlywooRef4,
      storeFlywooRef5,
      storeFrskyRef,
      storeFrskyRef2,
      storeGeprcRef,
      storeGeprcRef2,
      storeIflightRef,
      storeIflightRef2,
      storeIflightRef3,
      storeIflightRef4,
      storeIflightRef5,
      storeRadioMasterRef,
      storeRadioMasterRef2,
      storeRadioMasterRef3,
      storeRadioMasterRef4,
      storeRadioMasterRef5,
      storeRadioMasterRef6,
      storeRadioMasterRef7,
      storeRadioMasterRef8,
      storeTBSRef,
      storeTBSRef2,
      storeTBSRef3,
      storeTBSRef4,
      storeTBSRef5,
      storeTBSRef6,
      storeTBSRef7,
      storeTBSRef8,
      storeUruavRef
    ]
    const productData = []
    for (const product of collectionsWavi) {
      const colectionData = await getDocs(product)
      colectionData.forEach((DOC) => {
        productData.push(DOC.data())
      })
    }
    sessionStorage.setItem('cartUpdated', 'productos')
    return productData
  }

  const shoppingsFromFirestore = () => {
    let productData
    // Solicitar todos los productos
    if (!AllProducts) {
      // Solicitar a firebase
      // console.log(AllProducts);
      productData = productsFromFirestore()
      // console.log(productData);
      productData.then((response) => {
        compareProductsIDs(response)
        // console.log(response);
        sessionStorage.setItem('cartUpdated', 'firestore')
        sessionStorage.setItem('Todos los productos', JSON.stringify(response))
      })
    } else {
      // Solicitar todos los productos almacenados en session storage
      productData = JSON.parse(AllProducts)
      compareProductsIDs(productData)
      sessionStorage.setItem('cartUpdated', 'sessionStorage')
    }
  }

  // esta funcion recibe un arreglo con todos los productos a comparar
  const compareProductsIDs = (productData) => {
    const cardProductos = []
    let productos = []
    // comparar productos por ids
    if (productData && productData.length > 0) {
      // console.log('productData', productData, productos)
      console.log('compareProductsIDs selected products', productData)
      productos = productData
      let counter = 0
      productos.map((DOC) => {
        // console.log(DOC);
        const iD = DOC.productID
        for (const codigo of productosIds) {
          // console.log(iD, codigo);
          if (iD === codigo) {
            // Se identifica por ID que producto representa para ser añadido
            cardProductos.push(DOC)
            // se desarrolla un parsePrices del catalogo de todos los productos para añadirlos formateados al Context del ShoppingCard
            cardProductos.map((product, index, array) => {
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
            // Se hace uso de las cantidades asginadas en el carrito de compras
            cardProductos[counter].cantidad = productosCantidades[counter]
            // Nuestra marca para identificar el producto en el array
            counter++
          }
        }
      })
    }
    if (typeof cardProductos === 'object' && cardProductos.length > 0) {
      // console.log('cardProductos', cardProductos)
      shoppingCart.productos = cardProductos
      shoppingCart.updated = true
      // Se determina la cantidad de objetos agregados al carrito de compras
      // cardProductos.length;
      let totalCantidades = 0
      productosCantidades.map((cantidad) => {
        totalCantidades += cantidad
      })
      shoppingCart.items = totalCantidades
      console.log('compareProductAmounts', shoppingCart, totalCantidades)
      sessionStorage.setItem('cartUpdated', 'filterItems')
      sessionStorage.setItem('cartProducts', totalCantidades)
      // Se envia listado de productos para calcular el valor del carrito de compras
      calculateCartAmount(cardProductos)
    }
  }

  const calculateCartAmount = (cardProductos) => {
    let acomulateSum = 0
    // console.log(acomulateSum);
    cardProductos.map((product, k) => {
      // console.log(acomulateSum, product.precio);
      const { precio, cantidad } = product
      if (typeof parseInt(precio) === 'number' && precio !== 'Agotado') {
        const dolarPrice = parseInt(process.env.NEXT_PUBLIC_DOLARTOCOP)
        acomulateSum += parseInt(precio) * cantidad * dolarPrice
      }
    })
    if (acomulateSum > 0) {
      // console.log(acomulateSum);
      // setShoppingCart({ ...shoppingCart, suma: acomulateSum });
      shoppingCart.suma = acomulateSum
      sessionStorage.setItem('cartUpdated', 'suma')
      sessionStorage.setItem('cartSum', acomulateSum)
      // sessionStorage.removeItem("cartUpdated");
      // console.log('service', shoppingCart)
      if (shoppingCart.productos) {
        console.log('FirebaseCompareShoppingCartIds', shoppingCart)
        updateCart(shoppingCart)
        sessionStorage.setItem('cartUpdated', 'actualizados-productos-context')
        // sharingInformationService.setSubject({shoppingCart});
      }
    }
  }

  if (usedID) {
    // Funciones para separar arreglo de entrada en ID's y cantidades
    extractProductsID(products)
    extractProductAmount(products)
    // Funcion para obtener de Firestore todos los productos de la tienda
    shoppingsFromFirestore()
  }
}

FirebaseCompareShoppingCartIds.propTypes = {
  products: PropTypes.array.isRequired,
  updateCart: PropTypes.func.isRequired
}

export default FirebaseCompareShoppingCartIds
