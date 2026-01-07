'use client'
import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

/**
 * A reusable link component for navigating to product details.
 * Encapsulates the URL construction logic.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product object
 * @param {React.ReactNode} props.children - The content to be wrapped (image, title, etc)
 * @param {Object} [props.style] - Optional inline styles for the Link/Anchor
 * @param {string} [props.className] - Optional class names
 */
const ProductLink = ({ product, children, style, className }) => {
  if (!product) return <>{children}</>

  const { productID, category, categoria, marca } = product
  // Handle inconsistent naming (some objects have 'category', others 'categoria')
  const cat = category || categoria || 'tienda'

  return (
    <Link
      href={{
        pathname: '/tienda/producto',
        query: { id: productID, category: cat, marca: marca },
      }}
      style={{ textDecoration: 'none', color: 'inherit', ...style }}
      className={className}
    >
      {children}
    </Link>
  )
}

ProductLink.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.any,
    category: PropTypes.string,
    categoria: PropTypes.string,
    marca: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string
}

export default ProductLink
