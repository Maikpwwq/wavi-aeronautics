'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDronesProducts } from '@/store/states/shop'

/**
 * DataInitializer - Loads initial product data
 * 
 * For performance optimization, we only load drones-fpv-hd products initially
 * (used in "Nuevos Productos" section). Other categories are loaded on-demand
 * when the user navigates to those sections.
 */
const DataInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load only drones category initially for faster first paint
    // Other categories will be loaded when user navigates to them
    dispatch(fetchDronesProducts())
  }, [dispatch])

  return null
}

export default DataInitializer

