import React from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Box from '@mui/material/Box'

const libraries = ['places']

const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  // To use the LoadScript component directly in the future, you can uncomment this:
  // <LoadScript 
  //   googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
  //   libraries={['places']}
  // />

  if (loadError) return <Box sx={{ p: 4, textAlign: 'center', color: 'red' }}>Error al cargar mapas.</Box>
  if (!isLoaded) return <Box sx={{ p: 4, textAlign: 'center', color: 'white' }}>Cargando mapas...</Box>

  return children
}

export default GoogleMapsLoader
