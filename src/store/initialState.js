// load store state from server side
import {
  getAllDroneProduct,
  getAllAccesoriosProduct,
  getAllGoogles,
  getAllRadioControl,
  getAllTrasmisorReceptor
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
      const { storeProducts, storeProductsRC } = response
      shop.drones = storeProducts
      shop.dronesRC = storeProductsRC
    }
  })
  const subscription2$ = getAllAccesoriosProduct
  subscription2$.subscribe((response) => {
    if (response) {
      const { productsBaterias } = response
      shop.baterias = productsBaterias
    }
  })
  const subscription3$ = getAllGoogles
  subscription3$.subscribe((response) => {
    if (response) {
      const { storeProductsRC } = response
      shop.googles = storeProductsRC
    }
  })
  const subscription4$ = getAllRadioControl
  subscription4$.subscribe((response) => {
    if (response) {
      const { storeProductsRC } = response
      shop.radioControl = storeProductsRC
    }
  })
  const subscription5$ = getAllTrasmisorReceptor
  subscription5$.subscribe((response) => {
    if (response) {
      const { storeProductsReceptor } = response
      shop.receptores = storeProductsReceptor
    }
  })

  // console.log("shoppingCart", shoppingCart);

  if (shop.receptores) {
    return {
      user: {},
      shoppingCart,
      shop
    }
  }
  // else if (!!shop.receptores) {
  //   return {
  //     user: {},
  //     shoppingCart,
  //     shop,
  //   };
  // }
}

export default initialState
