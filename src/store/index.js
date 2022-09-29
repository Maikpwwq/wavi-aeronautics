import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./states/user";
import cartSlice from "./states/cart";
import productSlice from "./states/product";
import shopSlice from "./states/shop";
// import suscribersSlice from "./states/suscribers";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: {
      user: userSlice,
      shoppingCart: cartSlice,
      product: productSlice,
      shop: shopSlice,
      // suscription: suscribersSlice,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(...),
    preloadedState,
    // enhancers: [monitorReducersEnhancer],
  });

  return store;
}
