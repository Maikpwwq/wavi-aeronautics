import { auth } from '@/firebase/firebaseClient'
import { v4 as uuidv4 } from 'uuid'
import { parseCopCurrency } from '@/utilities/priceUtils'
import { saveCartToFirestore } from '@/services/shoppingCartService'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'

/**
 * Adds a product with custom quantity and option to the shopping cart,
 * persisting to state, sessionStorage, and Firestore.
 */
export const addProductToCart = ({
  product,
  selectedOption = null,
  quantity = 1,
  shoppingCart,
  updateCart,
  showCartDrawer = true,
  updateShowCart
}) => {
  if (!product || product?.availability === false) return false

  const addQty = Math.max(1, Number(quantity) || 1)
  const currentItems = shoppingCart?.productos ? [...shoppingCart.productos] : []
  const productId = product.productID || product.id

  const existingProductIndex = currentItems.findIndex(
    p => (p.productID || p.id) === productId
  )

  if (existingProductIndex >= 0) {
    const existingItem = currentItems[existingProductIndex]
    const sameOption = !selectedOption || 
      (existingItem.selectedOption?.label === selectedOption?.label)

    if (sameOption) {
      currentItems[existingProductIndex] = {
        ...existingItem,
        cantidad: (existingItem.cantidad || 0) + addQty
      }
    } else {
      currentItems.push({
        ...product,
        productID: productId,
        selectedOption,
        effectivePrice: (product.price || 0) + (selectedOption?.priceModifier || 0),
        cantidad: addQty
      })
    }
  } else {
    currentItems.push({
      ...product,
      productID: productId,
      selectedOption,
      effectivePrice: (product.price || 0) + (selectedOption?.priceModifier || 0),
      cantidad: addQty
    })
  }

  if (currentItems.length > 0) {
    const totalItems = currentItems.reduce((acc, item) => acc + (item.cantidad || 0), 0)
    const totalSum = currentItems.reduce((acc, item) => {
      const price = item.effectivePrice || parseCopCurrency(item.price || item.precio)
      return acc + (price * (item.cantidad || 0))
    }, 0)

    // Optimistic update to context
    updateCart?.({
      updated: true,
      productos: currentItems,
      items: totalItems,
      suma: totalSum
    })

    // Session storage and Firestore persistence
    let cartID = typeof window !== 'undefined' ? sessionStorage.getItem('cartID') : null
    if (!cartID && !auth?.currentUser?.uid) {
      cartID = uuidv4()
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cartID', cartID)
      }
    }

    const cartToSave = currentItems.map(item => ({
      productID: item.productID || item.id,
      cantidad: item.cantidad
    }))

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartProducts', JSON.stringify(cartToSave))
      sessionStorage.setItem('cartItems', totalItems.toString())
      sessionStorage.setItem('cartSum', totalSum.toString())
    }

    const targetID = auth?.currentUser?.uid || cartID
    if (targetID) {
      saveCartToFirestore(targetID, cartToSave)
    }

    FirebaseCompareShoppingCartIds({ products: currentItems, updateCart })

    if (showCartDrawer && updateShowCart) {
      updateShowCart(true)
    }

    return true
  }

  return false
}
