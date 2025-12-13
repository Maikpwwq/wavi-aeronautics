// import { HttpClient } from 'http';
import { Observable } from 'rxjs' // Subject, BehaviorSubject
import FirebaseSearchProductById from './FirebaseSearchProductById.jsx'
import FirebaseSubscribe from './FirebaseSubscribe.jsx'

// const urlsPrivate = {
//   get_tipo_identificacion: '/api/adm-tipo-identificacions',
//   contenidologsfiltro: '/api/servicioauditoria/findByFilters',
//   listarActividades: '/api/servicioHome/listarActividades',
//   actividadAsignadaById: '/api/servicioHome/listarActividadesById'
// }

const getProductById = (searchId, category, marca) =>
  new Observable(async (subscriber) => {
    const response = await FirebaseSearchProductById(searchId, category, marca)
    try {
      console.log(
        'firebase-Id-search',
        searchId,
        category,
        response
        // subscriber
      )
      subscriber.next(response)
      // subscriber.complete();
    } catch (err) {
      subscriber.error(err)
    }
  })

const subscribeToWavi = (suscribeMail) =>
  new Observable(async (subscriber) => {
    const response = await FirebaseSubscribe(suscribeMail)
    console.log('firebaseResponse', response, suscribeMail)
    try {
      subscriber.next(response)
      // subscriber.complete();
    } catch (err) {
      subscriber.error(err) // delivers an error if it caught one
    }
  })

const getObservableProductId = () => {
  return getProductById
}

const getSubscribe = (suscribeMail) => {
  return subscribeToWavi(suscribeMail)
}

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
}
export {
  getProductById,
  getObservableProductId,
  SharedService,
  subscribeToWavi,
  getSubscribe
}
// export default SharedService;
