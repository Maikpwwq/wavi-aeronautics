// load store state from server side
import {
  getAllDroneProduct,
  getAllAccesoriosProduct,
  getAllGoogles,
  getAllRadioControl,
  getAllTrasmisorReceptor,
  getAllDigitalVTX
  // getAllShoppingCart
} from '@/services/sharedServices'

import { sharingInformationService } from '@/services/sharing-information'

const initialState = () => {
  const shop = []
  const shoppingCart = []

  // const subscription5$ = getAllShoppingCart;
  // subscription5$.subscribe((response) => {
  //   if (!!response) {
  //     console.log("subscription5", response);
  //     const { cart } = response;
  //     shoppingCart.productos = cart;
  //   }
  // });

  const productData = sharingInformationService.getSubject()
  productData.subscribe((data) => {
    if (data) {
      const { cart, userID } = data
      console.log('Initial productCard', cart, userID)
      if (cart) {
        shoppingCart.productos = cart
      }
      if (userID) {
        shoppingCart.cartID = userID
      }
    }
    // else {
    //   shoppingCart.productos = [];
    // }
  })

  const subscription$ = getAllDroneProduct
  subscription$.subscribe((response) => {
    if (response) {
      const { storeProductsKits, storeProductsRC, storeProductsHD } = response
      if (storeProductsKits && storeProductsRC && storeProductsHD) {
        // console.log('subscription drone products', storeProducts, storeProductsRC)
        shop.dronesKit = storeProductsKits
        shop.dronesRC = storeProductsRC
        shop.dronesHD =storeProductsHD
      }
    }
  })
  const subscription2$ = getAllAccesoriosProduct
  subscription2$.subscribe((response) => {
    if (response) {
      const { productsBaterias } = response
      if (productsBaterias) {
        shop.baterias = productsBaterias
      }
    }
  })
  const subscription3$ = getAllGoogles
  subscription3$.subscribe((response) => {
    if (response) {
      const { productsGoogles } = response
      if (productsGoogles) {
        shop.googles = productsGoogles
      }
    }
  })
  const subscription4$ = getAllRadioControl
  subscription4$.subscribe((response) => {
    if (response) {
      const { storeProductsRC } = response
      if (storeProductsRC) {
        shop.radioControl = storeProductsRC
      }
    }
  })
  const subscription5$ = getAllTrasmisorReceptor
  subscription5$.subscribe((response) => {
    if (response) {
      const { storeProductsReceptor, storeProductsTransmisor } = response
      if (storeProductsReceptor && storeProductsTransmisor) {
        shop.receptors = storeProductsReceptor
        shop.transmisors = storeProductsTransmisor
      }
    }
  })
  const subscription6$ = getAllDigitalVTX
  subscription6$.subscribe((response) => {
    if (response) {
      const { storeDigitalVTX } = response
      if (storeDigitalVTX) {
        shop.digitalVTX = storeDigitalVTX
      }
    }
  })

  // console.log("shoppingCart", shoppingCart);

  if (shop.digitalVTX) {
    return {
      user: {},
      shoppingCart,
      shop
    }
  }
  // else if (!!shop.receptors) {
  //   return {
  //     user: {},
  //     shoppingCart,
  //     shop,
  //   };
  // }
}

export default initialState
