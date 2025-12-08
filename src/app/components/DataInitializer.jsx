'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAllProducts } from '@/store/states/shop'

const DataInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Dispatch the async thunk to load all product data into the Redux store
    dispatch(fetchAllProducts())
  }, [dispatch])

  return null
}

export default DataInitializer
