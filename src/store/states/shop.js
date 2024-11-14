import { createSlice } from '@reduxjs/toolkit'

export const initialShop = {
  dronesKit: [{}],
  dronesHD: [{}],
  dronesRC: [{}],
  baterias: [{}],
  googles: [{}],
  radioControl: [{}],
  accesorios: [{}],
  receptors: [{}],
  transmisors: [{}],
  digitalVTX: [{}],
  dolarPrice: 0
}

// Slice
const shopSlice = createSlice({
  name: 'shop',
  initialState: initialShop,
  reducers: {
    loadStore: (state, action) => {
      state.shop = action.payload
    },
    updateStore: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})
export default shopSlice.reducer

// export actions
export const { loadStore, updateStore } = shopSlice.actions
