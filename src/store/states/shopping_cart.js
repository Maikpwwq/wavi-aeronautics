import { createSlice } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import { bindActionCreators } from 'redux'
// const dispatcher = useDispatch();

export const initialCart = {
  productos: [],
  cartID: null,
};

// Slice
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: initialCart,
  reducers: {
    createCart: (state, action) => {
      state.shoppingCart = action.payload; // .productos
      //localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setCart: (state, action) => {
      return {
        ...state,
        productos: [...state.shoppinCart.productos, action.payload],
      };
    },
    eliminateFromCart: (state, action) => {
      return {
        ...state,
        shoppingCart: state.shoppingCart.filter(
          (items) => items.id !== action.payload
        ),
      };
    },
    deleteCart: (state, action) => {
      state.shoppingCart = initialCart;
      //localStorage.removeItem("user");
    },
  },
});
export default shoppingCartSlice.reducer;

// export actions
export const { createCart, setCart, eliminateFromCart, deleteCart } =
  shoppingCartSlice.actions;

// const boundActionCreators = bindActionCreators(
//   { createCart, setCart, eliminateFromCart, deleteCart },
//   dispatch
// );

// export const newCart = ({ products }) => {
//   try {
//     dispatcher(createCard({ products }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const updateCart = ({ products }) => {
//   try {
//     dispatcher(setCart({ products }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const removeFromCart = ({ productId }) => {
//   try {
//     dispatcher(eliminateFromCart({ productId }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const cleanCart = () => {
//   try {
//     return dispatcher(deleteCart());
//   } catch (e) {
//     return console.error(e.message);
//   }
// };
