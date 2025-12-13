import { createSlice } from '@reduxjs/toolkit'
// import { useDispatch } from "react-redux";
// const dispatcher = useDispatch();

export const initialProduct = {
  titulo: 'Producto 1',
  precio: 100,
  descripcion: 'Descripcion del producto 1',
  especificaciones: 'Especificaciones del producto 1',
  incluye: 'Incluye del producto 1',
  imagenes: []
}

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState: initialProduct,
  reducers: {
    loadDetail: (state, action) => {
      console.log('loadDetail', state, action)
      return action.payload
      // localStorage.setItem("currentProduct", JSON.stringify(action.payload));
    },
    modifyDetail: (state, action) => {
      return { ...state, ...action.payload }
    },
    unmountDetail: (state, action) => {
      state.product = initialProduct
      // localStorage.removeItem("currentProduct");
    }
  }
})
export default productSlice.reducer

// return {
//   ...state,
//   playing: state.drones.find((item) => item.id === Number(action.payload)) ||
//   state.originals.find((item) => item.id === Number(action.payload)) ||
//   [],
// };

// export actions
export const { loadDetail, modifyDetail, unmountDetail } = productSlice.actions

// export const loadCurrent = ({
//   titulo,
//   precio,
//   descripcion,
//   especificaciones,
//   incluye,
//   imagenes,
// }) => {
//   try {
//     console.log("loadCurrent");
//     dispatch(
//       loadDetail({
//         titulo,
//         precio,
//         descripcion,
//         especificaciones,
//         incluye,
//         imagenes,
//       })
//     );
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const modifyCurrent = ({
//   titulo,
//   precio,
//   descripcion,
//   especificaciones,
//   incluye,
//   imagenes,
// }) => {
//   try {
//     console.log("modifyCurrent");
//     dispatch(
//       modifyDetail({
//         titulo,
//         precio,
//         descripcion,
//         especificaciones,
//         incluye,
//         imagenes,
//       })
//     );
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const unmountCurrent = () => {
//   try {
//     return dispatcher(unmountDetail());
//   } catch (e) {
//     return console.error(e.message);
//   }
// };
