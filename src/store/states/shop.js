import { createSlice } from '@reduxjs/toolkit'

export const initialShop = {
  drones: [{}],
  dronesRC: [{}],
  baterias: [{}],
  radioControl: [{}],
  accesorios: [{}],
  receptores: [{}],
  trasnmisores: [{}]
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
