import PropTypes from 'prop-types'
import parsePrices from '@/utilities/parse-money'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'

import { sharingInformationService } from '@/services/sharing-information'

const FirebaseSearchProductById = (searchId, category) => {
  const _firestore = firestore
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'dron')
  const KitRef = collection(productsDoc, 'kit_fpv_dron')
  const KitRefRC = collection(productsDoc, 'RC')
  const productsRCDoc = doc(productsRef, 'radio_control')
  const KitBetafpv = collection(productsRCDoc, 'betafpv')
  const KitEachine = collection(productsRCDoc, 'eachine')
  const KitEmaxusa = collection(productsRCDoc, 'emax-usa')
  const KitFlysky = collection(productsRCDoc, 'flysky')
  const KitFlywoo = collection(productsRCDoc, 'flywoo')
  const KitFrsky = collection(productsRCDoc, 'frsky')
  const KitGeprc = collection(productsRCDoc, 'geprc')
  const KitIflightrc = collection(productsRCDoc, 'iflight-rc')
  const KitRadiomaster = collection(productsRCDoc, 'radio-master')
  const KitTeamblacksheep = collection(productsRCDoc, 'team-blacksheep')
  const KitUruav = collection(productsRCDoc, 'uruav')

  let currentProduct = []

  const searchIde = searchId || ''
  const categoryIde = category || 'tienda'

  const queryRef = query(KitRef, where('productID', '==', searchIde))
  const queryRefRC = query(KitRefRC, where('productID', '==', searchIde))

  const queryRefBetafpv = query(
    KitBetafpv,
    where('productID', '==', searchIde)
  )
  const queryRefEachine = query(
    KitEachine,
    where('productID', '==', searchIde)
  )
  const queryRefEmaxusa = query(
    KitEmaxusa,
    where('productID', '==', searchIde)
  )
  const queryRefFlysky = query(KitFlysky, where('productID', '==', searchIde))
  const queryRefFlywoo = query(KitFlywoo, where('productID', '==', searchIde))
  const queryRefFrsky = query(KitFrsky, where('productID', '==', searchIde))
  const queryRefGeprc = query(KitGeprc, where('productID', '==', searchIde))
  const queryRefIflightrc = query(
    KitIflightrc,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster = query(
    KitRadiomaster,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep = query(
    KitTeamblacksheep,
    where('productID', '==', searchIde)
  )
  const queryRefUruav = query(KitUruav, where('productID', '==', searchIde))

  const productSearchFirestore = async () => {
    const productos = []
    if (
      categoryIde === 'tienda' ||
      categoryIde === 'drones' ||
      categoryIde === 'dronesRC'
    ) {
      const searchDrone = await getDocs(queryRef)
      const searchRC = await getDocs(queryRefRC)
      searchDrone.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchRC.forEach((DOC) => {
        productos.push(DOC.data())
      })
    } else if (
      categoryIde === 'radioControl' ||
      categoryIde === 'receptores' ||
      categoryIde === 'baterias'
    ) {
      const searchBetafpv = await getDocs(queryRefBetafpv)
      const searchEachine = await getDocs(queryRefEachine)
      const searchEmaxusa = await getDocs(queryRefEmaxusa)
      const searchFlysky = await getDocs(queryRefFlysky)
      const searchFlywoo = await getDocs(queryRefFlywoo)
      const searchFrsky = await getDocs(queryRefFrsky)
      const searchGeprc = await getDocs(queryRefGeprc)
      const searchIflightrc = await getDocs(queryRefIflightrc)
      const searchRadiomaster = await getDocs(queryRefRadiomaster)
      const searchTeamblacksheep = await getDocs(queryRefTeamblacksheep)
      const searchUruav = await getDocs(queryRefUruav)
      searchBetafpv.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchEachine.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchEmaxusa.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchFlysky.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchFlywoo.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchFrsky.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchGeprc.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchIflightrc.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchRadiomaster.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchTeamblacksheep.forEach((DOC) => {
        productos.push(DOC.data())
      })
      searchUruav.forEach((DOC) => {
        productos.push(DOC.data())
      })
    }
    if (productos.length > 0) {
      return productos
    }
  }

  const productoSearchStore = () => {
    let productos = []
    const productData = productSearchFirestore()
    productData.then((response) => {
      productos = parsePrices(response)
      if (productos && productos.length > 0) {
        // console.log("compare productos", productos);
        currentProduct = productos
        sharingInformationService.setSubject({ productos })
        return productos
      }
    })
  }

  // Se actualiza la importancion desde utilities
  // const parsePrices = (productos) => {
  //   if (!!productos) {
  //     productos.map((product, index, array) => {
  //       if (
  //         typeof parseInt(product.precio) === "number" &&
  //         product.precio !== "Agotado"
  //       ) {
  //         array[index].precio = parseInt(product.precio).toLocaleString(
  //           "es-CO",
  //           { style: "currency", currency: "COP" }
  //         );
  //       }
  //     });
  //     return productos;
  //   }
  // };

  productoSearchStore()
  if (currentProduct.length > 0) {
    const response = { currentProduct }
    return response
  }
}

FirebaseSearchProductById.propTypes = {
  searchId: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
}

export default FirebaseSearchProductById
