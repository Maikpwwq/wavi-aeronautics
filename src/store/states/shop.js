import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import FirebaseDroneProducts from '@/services/FirebaseDroneProducts'
import FirebaseRadioControlProducts from '@/services/FirebaseRadioControlProducts'
import FirebaseAccesoriosProducts from '@/services/FirebaseAccesoriosProducts'
import FirebaseGooglesProducts from '@/services/FirebaseGooglesProducts'
import FirebaseTrasmisorReceptorProducts from '@/services/FirebaseTrasmisorReceptorProducts'
import FirebaseDigitalVTXProducts from '@/services/FirebaseDigitalVTXProducts'

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

export const fetchAllProducts = createAsyncThunk(
  'shop/fetchAllProducts',
  async () => {
    const [
      dronesData,
      radiosData,
      bateriasData,
      googlesData,
      trRxData,
      vtxData
    ] = await Promise.all([
      FirebaseDroneProducts(),
      FirebaseRadioControlProducts(),
      FirebaseAccesoriosProducts(),
      FirebaseGooglesProducts(),
      FirebaseTrasmisorReceptorProducts(),
      FirebaseDigitalVTXProducts()
    ])

    const payload = {}
    if (dronesData) {
      payload.dronesKit = dronesData.storeProductsKits
      payload.dronesRC = dronesData.storeProductsRC
      payload.dronesHD = dronesData.storeProductsHD
    }
    if (radiosData) {
      payload.radioControl = radiosData.storeProductsRC
    }
    if (bateriasData) {
      payload.baterias = bateriasData.productsBaterias
    }
    if (googlesData) {
      payload.googles = googlesData.productsGoogles
    }
    if (trRxData) {
      payload.receptors = trRxData.storeProductsReceptor
      payload.transmisors = trRxData.storeProductsTransmisor
    }
    if (vtxData) {
      payload.digitalVTX = vtxData.storeDigitalVTX
    }
    return payload
  }
)

// Slice
const shopSlice = createSlice({
  name: 'shop',
  initialState: initialShop,
  reducers: {
    loadStore: (state, action) => {
      // Keep for legacy if needed, or remove if unused
      state.shop = action.payload
    },
    updateStore: (state, action) => {
      return { ...state, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      return { ...state, ...action.payload }
    })
  }
})
export default shopSlice.reducer

// export actions
export const { loadStore, updateStore } = shopSlice.actions
