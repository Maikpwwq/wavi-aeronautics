import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: 
      rootReducer,
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(...),
    preloadedState,
    // enhancers: [monitorReducersEnhancer],
  });

  return store;
}
