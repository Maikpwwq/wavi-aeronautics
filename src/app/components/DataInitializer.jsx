'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import FirebaseDroneProducts from '@/services/FirebaseDroneProducts'
import FirebaseRadioControlProducts from '@/services/FirebaseRadioControlProducts'
import FirebaseAccesoriosProducts from '@/services/FirebaseAccesoriosProducts'
import FirebaseGooglesProducts from '@/services/FirebaseGooglesProducts'
import FirebaseTrasmisorReceptorProducts from '@/services/FirebaseTrasmisorReceptorProducts'
import FirebaseDigitalVTXProducts from '@/services/FirebaseDigitalVTXProducts'
import { updateStore } from '@/store/states/shop'

const DataInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadData = async () => {
      // Fetch all product catalogs concurrently
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

      // Prepare payload for Redux shop state
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

      // Dispatch single update to avoid multiple re-renders
      if (Object.keys(payload).length > 0) {
        dispatch(updateStore(payload))
      }
    }
    loadData()
  }, [dispatch])

  return null
}

export default DataInitializer
