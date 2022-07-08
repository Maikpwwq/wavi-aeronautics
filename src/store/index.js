import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import reducers from "../reducers/reducers";

// const reducer = combineReducers({
//     reducers,
// })

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: reducers,
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(...),
    preloadedState,
    // enhancers: [monitorReducersEnhancer],
  });

  return store;
}
