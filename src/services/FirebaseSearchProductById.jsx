import PropTypes from 'prop-types'
import parsePrices from '@/utilities/parse-money'
import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'

import { sharingInformationService } from '@/services/sharing-information'

const FirebaseSearchProductById = (searchId, category, marca) => {
  const _firestore = firestore
  // consultar colecciones en busca de drones
  const productsRef = collection(_firestore, 'productos')
  const productsDoc = doc(productsRef, 'dron')
  const KitRef = collection(productsDoc, 'kit_fpv_dron')
  const KitRefRC = collection(productsDoc, 'RC')
  const productsGooglesDoc = doc(productsRef, 'Googles')
  const productsRCDoc = doc(productsRef, 'radio_control')
  // consultar Googles
  const GooglesDJI = collection(productsGooglesDoc, 'DJI')
  const GooglesBetafpv = collection(productsGooglesDoc, 'Betafpv')
  const GooglesEmaxusa = collection(productsGooglesDoc, 'Emaxusa')
  const GooglesFatShark = collection(productsGooglesDoc, 'FatShark')
  const GooglesWalksnail = collection(productsGooglesDoc, 'Walksnail')
  const GooglesIflightRc = collection(productsGooglesDoc, 'Iflight-rc')
  // consultar colecciones en busca de 'baterias', 'cargadores', 'control-remoto', 'receptor'
  // Betafpv
  const KitBetafpv = collection(productsRCDoc, 'betafpv/baterias/2PCS-2s-300mAh')
  const KitBetafpv2 = collection(productsRCDoc, 'betafpv/control-remoto/lite-radio2')
  const KitBetafpv3 = collection(productsRCDoc, 'betafpv/control-remoto/lite-radio3')
  const KitBetafpv4 = collection(productsRCDoc, 'betafpv/control-remoto/lite-radio3-pro')
  const KitBetafpv5 = collection(productsRCDoc, 'betafpv/receptor/BETAFPV-ELRS')
  // Eachine
  const KitEachine = collection(productsRCDoc, 'eachine/baterias/E520S-1200mAh')
  const KitEachine2 = collection(productsRCDoc, 'eachine/baterias/E58-500mAh')
  const KitEachine3 = collection(productsRCDoc, 'eachine/control-remoto/liteRadio-2.4G')
  const KitEachine4 = collection(productsRCDoc, 'eachine/control-remoto/FPV-EX5/')
  // Emaxusa
  const KitEmaxusa = collection(productsRCDoc, 'emax-usa/baterias/1S-300mAh')
  const KitEmaxusa2 = collection(productsRCDoc, 'emax-usa/baterias/1S-450mAh')
  const KitEmaxusa3 = collection(productsRCDoc, 'emax-usa/baterias/2PCS-2S-300mAh')
  const KitEmaxusa4 = collection(productsRCDoc, 'emax-usa/control-remoto/E8')
  // Flysky
  const KitFlysky = collection(productsRCDoc, 'flysky/receptor/Flysky-FS-X14S-V2')
  const KitFlysky2 = collection(productsRCDoc, 'flysky/receptor/Flysky-FS-iA8X')
  // Flywoo
  const KitFlywoo = collection(productsRCDoc, 'flywoo/baterias/4PCS-1S-450mAh')
  const KitFlywoo2 = collection(productsRCDoc, 'flywoo/baterias/4PCS-1S-750mAh')
  const KitFlywoo3 = collection(productsRCDoc, 'flywoo/control-remoto/LiteRadio-V3-ELRS')
  const KitFlywoo4 = collection(productsRCDoc, 'flywoo/control-remoto/LiteRadio-V3-TBS')
  const KitFlywoo5 = collection(productsRCDoc, 'flywoo/receptor/Flywoo-ELRS')
  // Frsky
  const KitFrsky = collection(productsRCDoc, 'frsky/receptor/Frsky_R-XSR')
  const KitFrsky2 = collection(productsRCDoc, 'frsky/receptor/Frsky_XM+')
  // Gepr
  const KitGeprc = collection(productsRCDoc, 'geprc/baterias/4S-650a850mAh')
  const KitGeprc2 = collection(productsRCDoc, 'geprc/control-remoto/tinyRadio-GR8')
  // Iflightrc
  const KitIflightrc = collection(productsRCDoc, 'iflight-rc/baterias/3S-450mAh')
  const KitIflightrc2 = collection(productsRCDoc, 'iflight-rc/cargadores/M4-AC30-1-4S')
  const KitIflightrc3 = collection(productsRCDoc, 'iflight-rc/control-remoto/C8-ELRS')
  const KitIflightrc4 = collection(productsRCDoc, 'iflight-rc/control-remoto/iF8-E')
  const KitIflightrc5 = collection(productsRCDoc, 'iflight-rc/receptor/iFlight-R81-SPI')
  // Radiomaster
  const KitRadiomaster = collection(productsRCDoc, 'radio-master/control-remoto/T8-Lite')
  const KitRadiomaster2 = collection(productsRCDoc, 'radio-master/control-remoto/T8-Pro')
  const KitRadiomaster3 = collection(productsRCDoc, 'radio-master/control-remoto/tx12')
  const KitRadiomaster4 = collection(productsRCDoc, 'radio-master/control-remoto/tx16s')
  const KitRadiomaster5 = collection(productsRCDoc, 'radio-master/receptor/NANO-ELRS-EP2')
  const KitRadiomaster6 = collection(productsRCDoc, 'radio-master/receptor/RadioMaster-R81')
  // Teamblacksheep
  const KitTeamblacksheep = collection(productsRCDoc, 'team-blacksheep/control-remoto/ethix-mambo')
  const KitTeamblacksheep2 = collection(productsRCDoc, 'team-blacksheep/control-remoto/tango2pro')
  const KitTeamblacksheep3 = collection(productsRCDoc, 'team-blacksheep/receptor/Crossfire-Nano-RX')
  const KitTeamblacksheep4 = collection(productsRCDoc, 'team-blacksheep/receptor/Crossfire-Nano-Rx-Pro')
  const KitTeamblacksheep5 = collection(productsRCDoc, 'team-blacksheep/receptor/Crossfire-Nano-Rx-SE')
  const KitTeamblacksheep6 = collection(productsRCDoc, 'team-blacksheep/receptor/Tracer-Nano-Rx')
  // Uruav
  const KitUruav = collection(productsRCDoc, 'uruav/baterias/1S-250mAh')

  let currentProduct = []

  const searchIde = searchId || ''
  const categoryIde = category || 'tienda'
  // se usa cada colleccion para construir una query que filtre drones
  const queryRef = query(KitRef, where('productID', '==', searchIde))
  const queryRefRC = query(KitRefRC, where('productID', '==', searchIde))
  // query Google
  const queryGooglesDJI = query(
    GooglesDJI,
    where('productID', '==', searchIde)
  )
  const queryGooglesBetafpv = query(
    GooglesBetafpv,
    where('productID', '==', searchIde)
  )
  const queryGooglesEmaxusa = query(
    GooglesEmaxusa,
    where('productID', '==', searchIde)
  )
  const queryGooglesFatShark = query(
    GooglesFatShark,
    where('productID', '==', searchIde)
  )
  const queryGooglesWalksnail = query(
    GooglesWalksnail,
    where('productID', '==', searchIde)
  )
  const queryGooglesIflightRc = query(
    GooglesIflightRc,
    where('productID', '==', searchIde)
  )
  // query 'baterias', 'cargadores', 'control-remoto', 'receptor'
  // Betafpv
  const queryRefBetafpv = query(
    KitBetafpv,
    where('productID', '==', searchIde)
  )
  const queryRefBetafpv2 = query(
    KitBetafpv2,
    where('productID', '==', searchIde)
  )
  const queryRefBetafpv3 = query(
    KitBetafpv3,
    where('productID', '==', searchIde)
  )
  const queryRefBetafpv4 = query(
    KitBetafpv4,
    where('productID', '==', searchIde)
  )
  const queryRefBetafpv5 = query(
    KitBetafpv5,
    where('productID', '==', searchIde)
  )
  // Eachine
  const queryRefEachine = query(
    KitEachine,
    where('productID', '==', searchIde)
  )
  const queryRefEachine2 = query(
    KitEachine2,
    where('productID', '==', searchIde)
  )
  const queryRefEachine3 = query(
    KitEachine3,
    where('productID', '==', searchIde)
  )
  const queryRefEachine4 = query(
    KitEachine4,
    where('productID', '==', searchIde)
  )
  // Emaxusa
  const queryRefEmaxusa = query(
    KitEmaxusa,
    where('productID', '==', searchIde)
  )
  const queryRefEmaxusa2 = query(
    KitEmaxusa2,
    where('productID', '==', searchIde)
  )
  const queryRefEmaxusa3 = query(
    KitEmaxusa3,
    where('productID', '==', searchIde)
  )
  const queryRefEmaxusa4 = query(
    KitEmaxusa4,
    where('productID', '==', searchIde)
  )
  // Flysky
  const queryRefFlysky = query(KitFlysky, where('productID', '==', searchIde))
  const queryRefFlysky2 = query(KitFlysky2, where('productID', '==', searchIde))
  // Flywoo
  const queryRefFlywoo = query(KitFlywoo, where('productID', '==', searchIde))
  const queryRefFlywoo2 = query(KitFlywoo2, where('productID', '==', searchIde))
  const queryRefFlywoo3 = query(KitFlywoo3, where('productID', '==', searchIde))
  const queryRefFlywoo4 = query(KitFlywoo4, where('productID', '==', searchIde))
  const queryRefFlywoo5 = query(KitFlywoo5, where('productID', '==', searchIde))
  // Frsky
  const queryRefFrsky = query(KitFrsky, where('productID', '==', searchIde))
  const queryRefFrsky2 = query(KitFrsky2, where('productID', '==', searchIde))
  // Geprc
  const queryRefGeprc = query(KitGeprc, where('productID', '==', searchIde))
  const queryRefGeprc2 = query(KitGeprc2, where('productID', '==', searchIde))
  // Iflightrc
  const queryRefIflightrc = query(
    KitIflightrc,
    where('productID', '==', searchIde)
  )
  const queryRefIflightrc2 = query(
    KitIflightrc2,
    where('productID', '==', searchIde)
  )
  const queryRefIflightrc3 = query(
    KitIflightrc3,
    where('productID', '==', searchIde)
  )
  const queryRefIflightrc4 = query(
    KitIflightrc4,
    where('productID', '==', searchIde)
  )
  const queryRefIflightrc5 = query(
    KitIflightrc5,
    where('productID', '==', searchIde)
  )
  // Radiomaster
  const queryRefRadiomaster = query(
    KitRadiomaster,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster2 = query(
    KitRadiomaster2,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster3 = query(
    KitRadiomaster3,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster4 = query(
    KitRadiomaster4,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster5 = query(
    KitRadiomaster5,
    where('productID', '==', searchIde)
  )
  const queryRefRadiomaster6 = query(
    KitRadiomaster6,
    where('productID', '==', searchIde)
  )
  // Teamblacksheep
  const queryRefTeamblacksheep = query(
    KitTeamblacksheep,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep2 = query(
    KitTeamblacksheep2,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep3 = query(
    KitTeamblacksheep3,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep4 = query(
    KitTeamblacksheep4,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep5 = query(
    KitTeamblacksheep5,
    where('productID', '==', searchIde)
  )
  const queryRefTeamblacksheep6 = query(
    KitTeamblacksheep6,
    where('productID', '==', searchIde)
  )
  // Uruav
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
      categoryIde === 'Googles') {
      // Googles collection
      const collectionsGooglesFpv = [
        queryGooglesDJI, queryGooglesBetafpv, queryGooglesEmaxusa, queryGooglesFatShark, queryGooglesWalksnail, queryGooglesIflightRc
      ]
      for (const product of collectionsGooglesFpv) {
        const colectionData = await getDocs(product)
        colectionData.forEach((DOC) => {
          productos.push(DOC.data())
        })
      }
    } else if (
      categoryIde === 'radioControl' ||
      categoryIde === 'receptores' ||
      categoryIde === 'baterias' ||
      categoryIde === 'cargadores'
    ) {
      console.log('productSearchFirestore', categoryIde, searchIde, marca)

      // Betafpv
      const collectionsBetafpv = [
        queryRefBetafpv, queryRefBetafpv2, queryRefBetafpv3, queryRefBetafpv4, queryRefBetafpv5
      ]
      // Eachine
      const collectionsEachine = [queryRefEachine, queryRefEachine2, queryRefEachine3, queryRefEachine4]
      // Emaxusa
      const collectionsEmaxusa = [queryRefEmaxusa, queryRefEmaxusa2, queryRefEmaxusa3, queryRefEmaxusa4]
      // Flysky
      const collectionsFlysky = [queryRefFlysky, queryRefFlysky2]
      // Flywoo
      const collectionsFlywoo = [queryRefFlywoo, queryRefFlywoo2, queryRefFlywoo3, queryRefFlywoo4, queryRefFlywoo5]
      // Frsky
      const collectionsFrsky = [queryRefFrsky, queryRefFrsky2]
      // Geprc
      const collectionsGeprc = [queryRefGeprc, queryRefGeprc2]
      // Iflightrc
      const collectionsIflightrc = [queryRefIflightrc, queryRefIflightrc2, queryRefIflightrc3, queryRefIflightrc4, queryRefIflightrc5]
      // Radiomaster
      const collectionsRadioMaster = [queryRefRadiomaster, queryRefRadiomaster2, queryRefRadiomaster3, queryRefRadiomaster4, queryRefRadiomaster5, queryRefRadiomaster6]
      // Teamblacksheep
      const collectionsTeamblacksheep = [queryRefTeamblacksheep, queryRefTeamblacksheep2, queryRefTeamblacksheep3, queryRefTeamblacksheep4, queryRefTeamblacksheep5, queryRefTeamblacksheep6]
      // Uruav
      const searchUruav = await getDocs(queryRefUruav)
      switch (marca) {
        case 'betafpv':
          // Betafpv
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsBetafpv) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'eachine':
          // Eachine
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsEachine) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'emax-usa':
          // Emaxusa
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsEmaxusa) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'flysky':
          // Flysky
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsFlysky) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'flywoo':
          // Flywoo
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsFlywoo) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'frsky':
          // Frsky
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsFrsky) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'geprc':
          // Geprc
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsGeprc) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'iflight-rc':
          // Iflightrc
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsIflightrc) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'RadioMaster':
          // Radiomaster
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsRadioMaster) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'team-blacksheep':
          // Teamblacksheep
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          for (const product of collectionsTeamblacksheep) {
            const colectionData = await getDocs(product)
            colectionData.forEach((DOC) => {
              productos.push(DOC.data())
            })
          }
          break
        case 'uruav':
          // Uruav
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchUruav.forEach((DOC) => {
            productos.push(DOC.data())
          })
      }
    }
    if (productos.length > 0) {
      console.log('productos', productos)
      return productos
    }
  }

  const productoSearchStore = () => {
    let productos = []
    const productData = productSearchFirestore()
    productData.then((response) => {
      productos = parsePrices(response)
      if (productos && productos.length > 0) {
        console.log('compare productos', productos)
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
