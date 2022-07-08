// load store state from server side
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  getAllDroneProduct,
  getAllAccesoriosProduct,
  getAllRadioControl,
  getAllTrasmisorReceptor,
  getAllShoppingCart,
} from "../src/services/sharedServices";

const initialState = () => {
  // const [storeDrone, setStoreDrone] = useState(null);
  // const [storeDroneRC, setStoreDroneRC] = useState(null);

  // const _sharedService = SharedService;
  // console.log(getAllDroneProduct);
  const subscription$ = getAllDroneProduct;
  subscription$.subscribe((response) => {
    // console.log("subscription", response);
    // const { storeProducts, storeProductsRC } = response;
    // console.log(storeProducts, storeProductsRC);
    // setStoreDrone(storeProducts);
    // setStoreDroneRC(storeProductsRC);
    // subscription.unsubscribe();
  });
  const subscription2$ = getAllAccesoriosProduct;
  subscription2$.subscribe((response) => {});
  const subscription3$ = getAllRadioControl;
  subscription3$.subscribe((response) => {});
  const subscription4$ = getAllTrasmisorReceptor;
  subscription4$.subscribe((response) => {});
  const subscription5$ = getAllShoppingCart;
  subscription5$.subscribe((response) => {});
  // const subscription = getObservable();
  // subscription.subscribe((response) => {
  //   console.log(response);
  // });

  return {
    user: {},
    shoppingCart: [],
    allProducts: [{}],
    drones: [{}], //storeDrone? [{ storeDrone }] :
    dronesRC: [{}], //storeDroneRC? [{ storeDroneRC }] :
    baterias: [{}],
    radioControl: [{}],
    accesorios: [{}],
    receptores: [{}],
    trasnmisores: [{}],
  };
};

export default initialState;
