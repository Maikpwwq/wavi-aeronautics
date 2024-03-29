'use client'
import { v4 as uuidv4 } from 'uuid'
import { firestore, auth } from '@/firebase/firebaseClient'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { sharingInformationService } from './sharing-information'
// import { createCart } from "../store/states/shopping_cart";
// import store from "../../ssr/renderApp.js";
// import { connect, useStore } from "react-redux";

const FirebaseLoadShoppingCart = () => {
  // { dispatch }
  // console.log("props", createCart);
  const user = auth?.currentUser || {}
  const userID = user?.uid || null
  let shoppingCartID = null
  const _firestore = firestore
  const shoppingsRef = collection(_firestore, 'shoppingCart')

  let shoppingCart = []

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true })
  }

  const newShoppingCart = () => {
    const shoppingsId = uuidv4()
    if (typeof window !== 'undefined') {
      console.log('NewShoppingCartID', shoppingsId)
      shoppingsToFirestore({ productos: [] }, shoppingsId)
      shoppingCartID = shoppingsId
      sessionStorage.setItem('cartID', shoppingsId)
      sessionStorage.setItem('cartUpdated', 'id')
    }
  }

  if (typeof window !== 'undefined') {
    // Perform localStorage action
    shoppingCartID = sessionStorage.getItem('cartID') || null
    console.log('shoppingCartID', shoppingCartID)
    if (!shoppingCartID) {
      newShoppingCart()
    }
  }

  // useEffect(() => {

  // }, [shoppingCartID]);

  // const shoppingUpdatedItems = sessionStorage.getItem("cartUpdated");
  const usedID = userID || shoppingCartID
  console.log('usedID load:', usedID)

  const shoppingsFromFirestore = async () => {
    const cardProductos = []
    const productData = await getDoc(doc(shoppingsRef, usedID))
    if (productData.data()) {
      const productos = productData.data().productos
      console.log('shoppingsFromFirestore', productos)
      for (const index in productos) {
        console.log('shoppingsFromFirestore', productos[index])
        if (productos[index]) {
          cardProductos.push(productos[index])
        }
      }
    }

    if (cardProductos && cardProductos.length !== 0) {
      shoppingCart = cardProductos
      console.log('store', cardProductos, shoppingCart)
    }
  }

  if (usedID) {
    shoppingsFromFirestore().then(() => {
      // store.dispatch(createCard(shoppingCart));
      // dispatch.createCart(shoppingCart);

      console.log('shoppingCart', shoppingCart)
      // { cargaBase: true }
      sharingInformationService.setSubject({ cart: shoppingCart })
      return shoppingCart
    })
    // if (shoppingCart.length > 0) {
    //   console.log("shoppingCart", shoppingCart);
    //   return shoppingCart;
    // }
  }
}

// const mapStateToProps = {}

// const mapDispatchToProps = (dispatch) => {
//    dispatching plain actions
// createCart,
// return {
// ...bindActionCreators({ createCart }, dispatch)
// createCart: (shoppingCart) => dispatch.createCart(shoppingCart),
// createCart,
// dispatch,
//   };
// };

export default FirebaseLoadShoppingCart
// export default connect(
//   mapStateToProps,
//   null //mapDispatchToProps
// )(FirebaseLoadShoppingCart);
