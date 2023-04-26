import { combineReducers } from 'redux'

import userSlice from './states/user'
import shoppingCartSlice from './states/shopping_cart'
import productSlice from './states/product'
import shopSlice from './states/shop'
// import suscribersSlice from "./states/suscribers";

const rootReducer = combineReducers({
  user: userSlice,
  shoppingCart: shoppingCartSlice,
  product: productSlice,
  shop: shopSlice
  // suscription: suscribersSlice,
})

export default rootReducer
