'use client'
import PropTypes from 'prop-types'
import { firestore } from '@/firebase/firebaseClient'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { sharingInformationService } from '@/services/sharing-information'
import { parseProductPrices } from '@/utilities/priceUtils'

const FirebaseSearchProductById = async (searchId, category, marca) => {
  if (!searchId) return { currentProduct: [] }

  try {
    const products = []
    
    // Efficient query across all 'items' collections in the new hierarchy
    // Structure: products/{category}/brands/{brand}/items/{productID}
    const itemsQuery = query(
      collectionGroup(firestore, 'items'),
      where('productID', '==', searchId)
    )

    const snapshot = await getDocs(itemsQuery)
    
    snapshot.forEach(doc => {
      products.push(doc.data())
    })

    if (products.length > 0) {
      // Logic to handle price parsing (USD -> COP if needed, handled by priceUtils patch)
      parseProductPrices(products)
      
      // Update subject (side effect from original code)
      sharingInformationService.setSubject({ products: products })
      
      return { currentProduct: products }
    }
    
    return { currentProduct: [] }

  } catch (error) {
    console.error("Error searching product by ID:", error)
    return { currentProduct: [] }
  }
}

FirebaseSearchProductById.propTypes = {
  searchId: PropTypes.string.isRequired,
  category: PropTypes.string,
  marca: PropTypes.string
}

export default FirebaseSearchProductById
