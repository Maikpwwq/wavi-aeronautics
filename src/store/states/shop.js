import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import FirebaseDroneProducts from '@/services/FirebaseDroneProducts'
import FirebaseRadioControlProducts from '@/services/FirebaseRadioControlProducts'
import FirebaseAccesoriosProducts from '@/services/FirebaseAccesoriosProducts'
import FirebaseGooglesProducts from '@/services/FirebaseGooglesProducts'
import FirebaseTrasmisorReceptorProducts from '@/services/FirebaseTrasmisorReceptorProducts'
import FirebaseDigitalVTXProducts from '@/services/FirebaseDigitalVTXProducts'

export const initialShop = {
  dronesKit: [],
  dronesHD: [],
  dronesRC: [],
  baterias: [],
  googles: [],
  radioControl: [],
  accesorios: [],
  receptors: [],
  transmisors: [],
  digitalVTX: [],
  dolarPrice: 0,
  loading: false,
  loadedCategories: [] // Track which categories have been loaded
}

// Fetch only drones (HD, Kit, RC) - used for initial load
export const fetchDronesProducts = createAsyncThunk(
  'shop/fetchDronesProducts',
  async () => {
    const dronesData = await FirebaseDroneProducts()
    return {
      dronesKit: dronesData?.storeProductsKits || [],
      dronesRC: dronesData?.storeProductsRC || [],
      dronesHD: dronesData?.storeProductsHD || []
    }
  }
)

// Fetch goggles category
export const fetchGooglesProducts = createAsyncThunk(
  'shop/fetchGooglesProducts',
  async () => {
    const googlesData = await FirebaseGooglesProducts()
    return { googles: googlesData?.productsGoogles || [] }
  }
)

// Fetch radio control category
export const fetchRadioControlProducts = createAsyncThunk(
  'shop/fetchRadioControlProducts',
  async () => {
    const radiosData = await FirebaseRadioControlProducts()
    return { radioControl: radiosData?.storeProductsRC || [] }
  }
)

// Fetch accessories (baterias) category
export const fetchAccesoriosProducts = createAsyncThunk(
  'shop/fetchAccesoriosProducts',
  async () => {
    const bateriasData = await FirebaseAccesoriosProducts()
    return { baterias: bateriasData?.productsBaterias || [] }
  }
)

// Fetch transmitters/receivers category
export const fetchTransmisorsProducts = createAsyncThunk(
  'shop/fetchTransmisorsProducts',
  async () => {
    const trRxData = await FirebaseTrasmisorReceptorProducts()
    return {
      receptors: trRxData?.storeProductsReceptor || [],
      transmisors: trRxData?.storeProductsTransmisor || []
    }
  }
)

// Fetch digital VTX category
export const fetchDigitalVTXProducts = createAsyncThunk(
  'shop/fetchDigitalVTXProducts',
  async () => {
    const vtxData = await FirebaseDigitalVTXProducts()
    return { digitalVTX: vtxData?.storeDigitalVTX || [] }
  }
)

// Fetch all products (legacy, for when all are needed)
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
      state.shop = action.payload
    },
    updateStore: (state, action) => {
      return { ...state, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    // Drones products
    builder.addCase(fetchDronesProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchDronesProducts.fulfilled, (state, action) => {
      state.loading = false
      state.dronesKit = action.payload.dronesKit
      state.dronesRC = action.payload.dronesRC
      state.dronesHD = action.payload.dronesHD
      state.loadedCategories.push('drones')
    })
    builder.addCase(fetchDronesProducts.rejected, (state) => {
      state.loading = false
    })

    // Goggles
    builder.addCase(fetchGooglesProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchGooglesProducts.fulfilled, (state, action) => {
      state.loading = false
      state.googles = action.payload.googles
      state.loadedCategories.push('googles')
    })

    // Radio Control
    builder.addCase(fetchRadioControlProducts.fulfilled, (state, action) => {
      state.radioControl = action.payload.radioControl
      state.loadedCategories.push('radioControl')
    })

    // Accesorios
    builder.addCase(fetchAccesoriosProducts.fulfilled, (state, action) => {
      state.baterias = action.payload.baterias
      state.loadedCategories.push('accesorios')
    })

    // Transmisors/Receptors
    builder.addCase(fetchTransmisorsProducts.fulfilled, (state, action) => {
      state.receptors = action.payload.receptors
      state.transmisors = action.payload.transmisors
      state.loadedCategories.push('transmisors')
    })

    // Digital VTX
    builder.addCase(fetchDigitalVTXProducts.fulfilled, (state, action) => {
      state.digitalVTX = action.payload.digitalVTX
      state.loadedCategories.push('digitalVTX')
    })

    // All products (legacy)
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false
      return { ...state, ...action.payload }
    })
    builder.addCase(fetchAllProducts.rejected, (state) => {
      state.loading = false
    })
  }
})

export default shopSlice.reducer
export const { loadStore, updateStore } = shopSlice.actions

