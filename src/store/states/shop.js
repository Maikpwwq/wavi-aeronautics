import { createSlice } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";

// const dispatcher = useDispatch();

export const initialShop = {
  drones: [{}],
  dronesRC: [{}],
  baterias: [{}],
  radioControl: [{}],
  accesorios: [{}],
  receptores: [{}],
  trasnmisores: [{}],
};

// Slice
const shopSlice = createSlice({
  name: "shoppingCart",
  initialState: initialShop,
  reducers: {
    loadShop: (state, action) => {
      return { ...state, productShop: [...state.productShop, action.payload] };
    },
  },
});
export default shopSlice.reducer;

// export actions
export const { loadShop } = shopSlice.actions;
