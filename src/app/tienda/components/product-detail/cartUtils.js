import { auth } from '@/firebase/firebaseClient'
import { v4 as uuidv4 } from 'uuid'
import { parseCopCurrency, calculateCopPrice } from '@/utilities/priceUtils'
import { saveCartToFirestore } from '@/services/shoppingCartService'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'

/**
 * Generates a deterministic unique cart item ID based on product ID and selected variations.
 * @param {string} productId
 * @param {Array|Object} selectedVariations
 * @returns {string}
 */
export const generateCartItemId = (productId, selectedVariations) => {
  if (!productId) return ''

  let list = []
  if (Array.isArray(selectedVariations)) {
    list = selectedVariations.filter(Boolean)
  } else if (selectedVariations && typeof selectedVariations === 'object') {
    if (selectedVariations.label || selectedVariations.optionLabel) {
      list = [selectedVariations]
    } else {
      list = Object.values(selectedVariations).filter(Boolean)
    }
  }

  if (list.length === 0) {
    return productId
  }

  // Sort deterministically by groupId or optionId/label
  const sortedTokens = [...list]
    .sort((a, b) => {
      const keyA = `${a.groupId || ''}_${a.optionId || a.label || ''}`
      const keyB = `${b.groupId || ''}_${b.optionId || b.label || ''}`
      return keyA.localeCompare(keyB)
    })
    .map((item) => {
      const g = (item.groupId || 'opt').toLowerCase().replace(/\s+/g, '-')
      const o = (item.optionId || item.optionLabel || item.label || '').toLowerCase().replace(/\s+/g, '-')
      return `${g}:${o}`
    })

  return `${productId}_${sortedTokens.join('__')}`
}

/**
 * Formats selected variations into a concise human-readable string.
 * e.g. "Receptor: ELRS 2.4G | Motor: GEPRC 2207"
 *
 * @param {Array|Object} selectedVariations
 * @returns {string}
 */
export const formatVariationTag = (selectedVariations) => {
  if (!selectedVariations) return ''

  let list = []
  if (Array.isArray(selectedVariations)) {
    list = selectedVariations.filter(Boolean)
  } else if (typeof selectedVariations === 'object') {
    if (selectedVariations.label || selectedVariations.optionLabel) {
      list = [selectedVariations]
    } else {
      list = Object.values(selectedVariations).filter(Boolean)
    }
  }

  return list
    .map((v) => {
      const group = v.groupName || v.name || ''
      const opt = v.optionLabel || v.label || ''
      return group ? `${group}: ${opt}` : opt
    })
    .filter(Boolean)
    .join(' | ')
}

/**
 * Adds a product with custom quantity and variations to the shopping cart,
 * persisting to state, sessionStorage, and Firestore.
 */
export const addProductToCart = ({
  product,
  selectedVariations = null,
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

  // Normalize variations list
  let variationsList = []
  if (Array.isArray(selectedVariations) && selectedVariations.length > 0) {
    variationsList = selectedVariations
  } else if (selectedOption) {
    variationsList = [
      {
        groupId: 'default_options',
        groupName: 'Opción',
        optionId: selectedOption.label || 'opt',
        optionLabel: selectedOption.label,
        priceDelta: selectedOption.priceModifier ?? 0
      }
    ]
  } else if (selectedVariations && typeof selectedVariations === 'object') {
    variationsList = Object.values(selectedVariations).filter(Boolean)
  }

  const cartItemId = generateCartItemId(productId, variationsList)

  // Compute total price delta
  const totalDeltaUsd = variationsList.reduce((sum, v) => {
    const d = Number(v.priceDelta ?? v.priceModifier ?? 0)
    return sum + (isNaN(d) ? 0 : d)
  }, 0)

  // Calculate unit price in COP
  let unitPriceCOP = 0
  let displayPrecio = product.precio || '$ 0'

  if (product.price !== undefined && product.price !== null) {
    const baseUsd = parseFloat(product.price) || 0
    const totalUsd = Math.max(0, baseUsd + totalDeltaUsd)
    displayPrecio = calculateCopPrice(totalUsd)
    unitPriceCOP = parseCopCurrency(displayPrecio)
  } else if (product.precio) {
    const baseCop = parseCopCurrency(product.precio)
    const deltaCop = totalDeltaUsd > 1000 ? totalDeltaUsd : parseCopCurrency(calculateCopPrice(totalDeltaUsd))
    unitPriceCOP = baseCop + deltaCop
    displayPrecio = `$ ${unitPriceCOP.toLocaleString('es-CO')}`
  }

  // Determine active image override if variant specifies imageUrl or images
  let activeImages = product.images || product.imagenes || []
  const variantWithImg = variationsList.find((v) => v.imageUrl || (Array.isArray(v.images) && v.images.length > 0))
  if (variantWithImg) {
    if (variantWithImg.imageUrl) {
      activeImages = [variantWithImg.imageUrl, ...activeImages.filter((img) => img !== variantWithImg.imageUrl)]
    } else if (Array.isArray(variantWithImg.images) && variantWithImg.images.length > 0) {
      activeImages = variantWithImg.images
    }
  }

  const existingIndex = currentItems.findIndex(
    (p) => (p.cartItemId || p.productID || p.id) === cartItemId
  )

  if (existingIndex >= 0) {
    const existing = currentItems[existingIndex]
    currentItems[existingIndex] = {
      ...existing,
      cantidad: (parseInt(existing.cantidad, 10) || 0) + addQty
    }
  } else {
    currentItems.push({
      ...product,
      cartItemId,
      productID: productId,
      id: cartItemId, // fallback identifier
      titulo: product.name || product.titulo || '',
      precio: displayPrecio,
      effectivePrice: unitPriceCOP,
      imagenes: activeImages,
      selectedVariations: variationsList,
      selectedOption: selectedOption || (variationsList[0] ? { label: variationsList[0].optionLabel, priceModifier: variationsList[0].priceDelta } : null),
      cantidad: addQty
    })
  }

  if (currentItems.length > 0) {
    const totalItems = currentItems.reduce((acc, item) => acc + (parseInt(item.cantidad, 10) || 0), 0)
    const totalSum = currentItems.reduce((acc, item) => {
      const price = item.effectivePrice || parseCopCurrency(item.precio || item.price)
      return acc + price * (parseInt(item.cantidad, 10) || 0)
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

    const cartToSave = currentItems.map((item) => ({
      cartItemId: item.cartItemId || item.productID || item.id,
      productID: item.productID || item.id,
      cantidad: item.cantidad,
      selectedVariations: item.selectedVariations || [],
      precio: item.precio
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
