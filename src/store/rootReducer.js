import { combineReducers } from 'redux'

import userSlice from "./states/user";
import cartSlice from "./states/cart";
import productSlice from "./states/product";
import shopSlice from "./states/shop";
// import suscribersSlice from "./states/suscribers";

const rootReducer = combineReducers({
  user: userSlice,
  shoppingCart: cartSlice,
  product: productSlice,
  shop: shopSlice,
  // suscription: suscribersSlice,
});

export default rootReducer;
