// import { HttpClient } from 'http';
import { Observable, Subject, BehaviorSubject } from "rxjs";
import FirebaseSearchProductById from "./FirebaseSearchProductById";
import FirebaseDroneProducts from "./FirebaseDroneProducts.jsx";
import FirebaseRadioControlProducts from "./FirebaseRadioControlProducts.jsx";
import FirebaseTrasmisorReceptorProducts from "./FirebaseTrasmisorReceptorProducts.jsx";
import FirebaseAccesoriosProducts from "./FirebaseAccesoriosProducts.jsx";
import FirebaseLoadShoppingCart from "./FirebaseLoadShoppingCart.jsx";
import FirebaseSubscribe from "./FirebaseSubscribe.jsx";

const urlsPrivate = {
  get_tipo_identificacion: "/api/adm-tipo-identificacions",
  contenidologsfiltro: "/api/servicioauditoria/findByFilters",
  listarActividades: "/api/servicioHome/listarActividades",
  actividadAsignadaById: "/api/servicioHome/listarActividadesById",
};

const getProductById = (searchId, category) =>
  new Observable((subscriber) => {
    const response = FirebaseSearchProductById(searchId, category);
    console.log("firebase Id search", searchId, category, response);
  });

const getAllDroneProduct = new Observable((subscriber) => {
  const response = FirebaseDroneProducts();
  // console.log("firebaseResponse", response);
  try {
    subscriber.next(response);
    // subscriber.complete();
  } catch (err) {
    subscriber.error(err);
  }
});

const getAllRadioControl = new Observable((subscriber) => {
  const response = FirebaseRadioControlProducts();
  // console.log("firebaseResponse", response);
  try {
    subscriber.next(response);
    // subscriber.complete();
  } catch (err) {
    subscriber.error(err);
  }
});

const getAllTrasmisorReceptor = new Observable((subscriber) => {
  const response = FirebaseTrasmisorReceptorProducts();
  // console.log("firebaseResponse", response);
  try {
    subscriber.next(response);
    // subscriber.complete();
  } catch (err) {
    subscriber.error(err);
  }
});

const getAllAccesoriosProduct = new Observable((subscriber) => {
  const response = FirebaseAccesoriosProducts();
  // console.log("firebaseResponse", response);
  try {
    subscriber.next(response);
    // subscriber.complete();
  } catch (err) {
    subscriber.error(err);
  }
});

const getAllShoppingCart = new Observable((subscriber) => {
  const response = FirebaseLoadShoppingCart();
  console.log("FirebaseShoppingCart", response);
  try {
    subscriber.next(response);
    subscriber.complete();
  } catch (err) {
    subscriber.error(err);
  }
});

const subscribeToWavi = (suscribeMail) =>
  new Observable((subscriber) => {
    const response = FirebaseSubscribe(suscribeMail);
    console.log("firebaseResponse", response, suscribeMail);
    try {
      subscriber.next(response);
      // subscriber.complete();
    } catch (err) {
      subscriber.error(err); // delivers an error if it caught one
    }
  });

const getObservableProductId = () => {
  return getProductById;
};

const getObservableDrone = () => {
  return getAllDroneProduct;
};

const getObservableRadioControl = () => {
  return getAllRadioControl;
};

const getObservableTrasmisorReceptor = () => {
  return getAllTrasmisorReceptor;
};

const getObservableAccesorios = () => {
  return getAllAccesoriosProduct;
};

const getShoppingCart = () => {
  return getAllShoppingCart;
};

const getSubscribe = (suscribeMail) => {
  return subscribeToWavi(suscribeMail);
};

// const getAllDroneProduct = () => {
//     new Observable(function subscribe(subscriber) {
//       try {
//         let response = FirebaseDroneProducts();
//         console.log(response);
//         subscriber.next(response);
//         subscriber.complete();
//       } catch (err) {
//         subscriber.error(err); // delivers an error if it caught one
//       }
//     });
//   };

// all asynchronous or callback-based code in a single, composable function
const SharedService = () => {
  // const http = HttpClient();
  //    getAll = (nameService): Observable<any> => http.get(`${this.url}${urlsPrivate[nameService]}`);
  //    getOne = (id, nameService): Observable<any> => http.get(`${this.url}${urlsPrivate[nameService]}${id}`);
  //    post = (item, nameService): Observable<any> => http.post(`${this.url}${urlsPrivate[nameService]}`, item);
  //    // postWithOutItem = (nameService): Observable<any> => http.post(`${this.url}${urlsPrivate[nameService]}`);
  //    addOne = (item, nameService): Observable<any> => http.post(`${this.url}${urlsPrivate[nameService]}`, item);
  //    addMany = (items[]): Observable<any> => http.post(this.url, items);
  //    updateOne = (item, nameService): Observable<any> => http.put(`${this.url}${urlsPrivate[nameService]}`, item);
  //    updateMany = (item[]): Observable<any> => http.put(this.url, item);
  //    removeOne = (id, nameService): Observable<any> => http.delete(`${this.url}${urlsPrivate[nameService]}${id}`);
  //    removeMany = (item, nameService): Observable<any> => http.delete(`${this.url}${urlsPrivate[nameService]}`, item);
  //    returnUrlEnum = (nameService) => urlsPrivate[nameService];
  //    getTypeId( id, type, nameService): Observable<any> {
  //       return http.get(`${this.url}${urlsPrivate[nameService]}${type}${id}`);
  //    }
  //    getIdType(id, type, nameService): Observable<any> {
  //       return http.get(`${this.url}${urlsPrivate[nameService]}${id}/${type}`);
  //    }
  //    // get_servicios_notificados_levelthree = '/api/entidad/2/servicios/notificados?nivel=2,3&tipoSolicitudId=2'
  //    getIdTwoParamsType(id, type, firstParam, typeTwo, secondParam, nameService): Observable<any> {
  //       return http.get(`${this.url}${urlsPrivate[nameService]}${id}/${type}${firstParam}${typeTwo}${secondParam}`);
  //    }
  //    getIdsType(id, service, type, nameService): Observable<any> {
  //       return http.get(`${this.url}${urlsPrivate[nameService]}${id}/${service}/${type}`);
  //    }
  //    postIdType(item, id, type, nameService): Observable<any> {
  //       return http.post(`${this.url}${urlsPrivate[nameService]}${id}/${type}`, item);
  //    }
  //    updateIdType(item, id, type, nameService): Observable<any> {
  //       return http.put(`${this.url}${urlsPrivate[nameService]}${id}/${type}`, item);
  //    }
  //    postIdTwoTypes(item, id, type, idTwo, typeTwo, nameService): Observable<any> {
  //       return http.post(`${this.url}${urlsPrivate[nameService]}${id}/${type}/${idTwo}/${typeTwo}`, item);
  //    }
  //    add_localstorage = (name, items) => localStorage.setItem(name, JSON.stringify(items));
  //    get_localstorage = (name) => JSON.parse(localStorage.getItem(name));
  //    delete_localstorage = (name) => localStorage.removeItem(name);
};
export {
  getProductById,
  getObservableProductId,
  SharedService,
  getAllDroneProduct,
  getObservableDrone,
  getAllAccesoriosProduct,
  getObservableAccesorios,
  getAllRadioControl,
  getObservableRadioControl,
  getAllTrasmisorReceptor,
  getObservableTrasmisorReceptor,
  getAllShoppingCart,
  getShoppingCart,
  subscribeToWavi,
  getSubscribe,
};
// export default SharedService;
