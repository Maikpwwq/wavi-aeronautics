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
  const productsRCDoc = doc(productsRef, 'radio_control')
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
      categoryIde === 'radioControl' ||
      categoryIde === 'receptores' ||
      categoryIde === 'baterias' ||
      categoryIde === 'cargadores'
    ) {
      console.log('productSearchFirestore', categoryIde, searchIde, marca)
      // Betafpv
      const searchBetafpv = await getDocs(queryRefBetafpv)
      const searchBetafpv2 = await getDocs(queryRefBetafpv2)
      const searchBetafpv3 = await getDocs(queryRefBetafpv3)
      const searchBetafpv4 = await getDocs(queryRefBetafpv4)
      const searchBetafpv5 = await getDocs(queryRefBetafpv5)
      // Eachine
      const searchEachine = await getDocs(queryRefEachine)
      const searchEachine2 = await getDocs(queryRefEachine2)
      const searchEachine3 = await getDocs(queryRefEachine3)
      const searchEachine4 = await getDocs(queryRefEachine4)
      // Emaxusa
      const searchEmaxusa = await getDocs(queryRefEmaxusa)
      const searchEmaxusa2 = await getDocs(queryRefEmaxusa2)
      const searchEmaxusa3 = await getDocs(queryRefEmaxusa3)
      const searchEmaxusa4 = await getDocs(queryRefEmaxusa4)
      // Flysky
      const searchFlysky = await getDocs(queryRefFlysky)
      const searchFlysky2 = await getDocs(queryRefFlysky2)
      // Flywoo
      const searchFlywoo = await getDocs(queryRefFlywoo)
      const searchFlywoo2 = await getDocs(queryRefFlywoo2)
      const searchFlywoo3 = await getDocs(queryRefFlywoo3)
      const searchFlywoo4 = await getDocs(queryRefFlywoo4)
      const searchFlywoo5 = await getDocs(queryRefFlywoo5)
      // Frsky
      const searchFrsky = await getDocs(queryRefFrsky)
      const searchFrsky2 = await getDocs(queryRefFrsky2)
      // Geprc
      const searchGeprc = await getDocs(queryRefGeprc)
      const searchGeprc2 = await getDocs(queryRefGeprc2)
      // Iflightrc
      const searchIflightrc = await getDocs(queryRefIflightrc)
      const searchIflightrc2 = await getDocs(queryRefIflightrc2)
      const searchIflightrc3 = await getDocs(queryRefIflightrc3)
      const searchIflightrc4 = await getDocs(queryRefIflightrc4)
      const searchIflightrc5 = await getDocs(queryRefIflightrc5)
      // Radiomaster
      const searchRadiomaster = await getDocs(queryRefRadiomaster)
      const searchRadiomaster2 = await getDocs(queryRefRadiomaster2)
      const searchRadiomaster3 = await getDocs(queryRefRadiomaster3)
      const searchRadiomaster4 = await getDocs(queryRefRadiomaster4)
      const searchRadiomaster5 = await getDocs(queryRefRadiomaster5)
      const searchRadiomaster6 = await getDocs(queryRefRadiomaster6)
      // Teamblacksheep
      const searchTeamblacksheep = await getDocs(queryRefTeamblacksheep)
      const searchTeamblacksheep2 = await getDocs(queryRefTeamblacksheep2)
      const searchTeamblacksheep3 = await getDocs(queryRefTeamblacksheep3)
      const searchTeamblacksheep4 = await getDocs(queryRefTeamblacksheep4)
      const searchTeamblacksheep5 = await getDocs(queryRefTeamblacksheep5)
      const searchTeamblacksheep6 = await getDocs(queryRefTeamblacksheep6)
      // Uruav
      const searchUruav = await getDocs(queryRefUruav)
      switch (marca) {
        case 'betafpv':
          // Betafpv
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchBetafpv.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchBetafpv2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchBetafpv3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchBetafpv4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchBetafpv5.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'eachine':
          // Eachine
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchEachine.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEachine2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEachine3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEachine4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'emax-usa':

          // Emaxusa
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchEmaxusa.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEmaxusa2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEmaxusa3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchEmaxusa4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'flysky':

          // Flysky
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchFlysky.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFlysky2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'flywoo':

          // Flywoo
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchFlywoo.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFlywoo2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFlywoo3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFlywoo4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFlywoo5.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'frsky':

          // Frsky
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchFrsky.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchFrsky2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'geprc':

          // Geprc
          searchGeprc.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchGeprc2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'iflight-rc':

          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          // Iflightrc
          searchIflightrc.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchIflightrc2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchIflightrc3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchIflightrc4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchIflightrc5.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'RadioMaster':

          // Radiomaster
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchRadiomaster.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchRadiomaster2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchRadiomaster3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchRadiomaster4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchRadiomaster5.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchRadiomaster6.forEach((DOC) => {
            productos.push(DOC.data())
          })
          break
        case 'team-blacksheep':

          // Teamblacksheep
          // Se almacenan los documentos encontrados por el filtrado en un listado de productos
          searchTeamblacksheep.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchTeamblacksheep2.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchTeamblacksheep3.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchTeamblacksheep4.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchTeamblacksheep5.forEach((DOC) => {
            productos.push(DOC.data())
          })
          searchTeamblacksheep6.forEach((DOC) => {
            productos.push(DOC.data())
          })
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
