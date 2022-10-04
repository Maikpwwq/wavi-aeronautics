// load store state from server side
import {
  getAllDroneProduct,
  getAllAccesoriosProduct,
  getAllRadioControl,
  getAllTrasmisorReceptor,
  getAllShoppingCart,
} from "../src/services/sharedServices";

const initialState = () => {
  const shop = [];

  const subscription$ = getAllDroneProduct;
  subscription$.subscribe((response) => {
    if (!!response) {
      const { storeProducts, storeProductsRC } = response;
      shop.drones = storeProducts;
      shop.dronesRC = storeProductsRC;
    }
  });
  const subscription2$ = getAllAccesoriosProduct;
  subscription2$.subscribe((response) => {
    if (!!response) {
      const { productsBaterias } = response;
      shop.baterias = productsBaterias;
    }
  });
  const subscription3$ = getAllRadioControl;
  subscription3$.subscribe((response) => {
    if (!!response) {
      const { storeProductsRC } = response;
      shop.radioControl = storeProductsRC;
    }
  });
  const subscription4$ = getAllTrasmisorReceptor;
  subscription4$.subscribe((response) => {
    if (!!response) {
      const { storeProductsReceptor } = response;
      shop.receptores = storeProductsReceptor;
    }
  });

  const subscription5$ = getAllShoppingCart;
  subscription5$.subscribe((response) => {
    //console.log("subscription5", response);
  });

  if (!!shop.receptores) {
    return {
      user: {},
      shoppingCart: [],
      shop,
    };
  }
};

export default initialState;
