import React from 'react'
import FeaturedBrands from '@/modules/views/FeaturedBrands'

export default function ProductMarcas(props) {
  return React.createElement(FeaturedBrands, props)
}

export { default as FeaturedBrands } from '@/modules/views/FeaturedBrands'
export { FEATURED_BRANDS } from '@/utilities/brandsConfig'
