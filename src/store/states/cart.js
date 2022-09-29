import { createSlice } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";

// const dispatcher = useDispatch();

export const initialCart = {
  productos: [],
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: initialCart,
  reducers: {
    createCard: (state, action) => {
      state.shoppingCart = action.payload;
      //localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setCart: (state, action) => {
      return { ...state, shoppingCart: [...state.shoppinCart, action.payload] };
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
export default cartSlice.reducer;

// export actions
export const { createCard, setCart, eliminateFromCart, deleteCart } =
  cartSlice.actions;

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
