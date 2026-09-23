'use client'
import { firestore, auth } from '@/firebase/firebaseClient'
import { parseCopCurrency, parseProductPrices } from '@/utilities/priceUtils'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import PropTypes from 'prop-types'

export const FirebaseCompareShoppingCartIds = async ({ products, updateCart }) => {
  try {
    const user = auth.currentUser;
    const userID = user ? user.uid : null;
    const shoppingCartID = typeof window !== 'undefined' ? sessionStorage.getItem('cartID') : null;
    
    if (!userID && !shoppingCartID) {
      console.warn("FirebaseCompareShoppingCartIds: No UserID or CartID found.");
      return;
    }

    if (!products || products.length === 0) {
      return;
    }

    // Collect unique target IDs for Firestore query
    const targetIds = Array.from(new Set(products.map(p => p.productID).filter(Boolean)));
    console.log("Looking for products with IDs:", targetIds);

    // Fetch specific products using chunked 'in' queries (Firestore limit 10)
    const fetchedProducts = [];
    const chunks = [];
    for (let i = 0; i < targetIds.length; i += 10) {
        chunks.push(targetIds.slice(i, i + 10));
    }

    const promises = chunks.map(chunk => {
        const q = query(
            collectionGroup(firestore, 'items'), 
            where('productID', 'in', chunk)
        );
        return getDocs(q);
    });

    const snapshots = await Promise.all(promises);
    snapshots.forEach(snap => {
        snap.forEach(doc => fetchedProducts.push(doc.data()));
    });

    const fetchedMap = new Map(fetchedProducts.map(doc => [doc.productID, doc]));

    // Hydrate each cart item preserving distinct variant configurations
    const cartProducts = products.map(inputItem => {
        const baseDoc = fetchedMap.get(inputItem.productID) || {};
        const variations = inputItem.selectedVariations || [];
        const totalDelta = variations.reduce((sum, v) => sum + Number(v.priceDelta ?? v.priceModifier ?? 0), 0);

        let itemPrecio = inputItem.precio;
        if (!itemPrecio && baseDoc.price !== undefined) {
          itemPrecio = calculateCopPrice(parseFloat(baseDoc.price) + totalDelta);
        } else if (!itemPrecio && baseDoc.precio) {
          itemPrecio = baseDoc.precio;
        }

        // Active image override from variant if specified
        let activeImages = baseDoc.images || baseDoc.imagenes || inputItem.imagenes || [];
        const variantImg = variations.find(v => v.imageUrl || (Array.isArray(v.images) && v.images.length > 0));
        if (variantImg) {
          if (variantImg.imageUrl) {
            activeImages = [variantImg.imageUrl, ...activeImages.filter(img => img !== variantImg.imageUrl)];
          } else if (Array.isArray(variantImg.images) && variantImg.images.length > 0) {
            activeImages = variantImg.images;
          }
        }

        return {
           ...baseDoc,
           ...inputItem,
           titulo: baseDoc.name || baseDoc.titulo || inputItem.titulo || inputItem.name || 'Producto',
           precio: itemPrecio,
           imagenes: activeImages,
           cantidad: parseInt(inputItem.cantidad, 10) || 1,
           cartItemId: inputItem.cartItemId || inputItem.productID,
           selectedVariations: variations
        };
    });

    // Parse prices (calculates COP 'precio' for new products if missing)
    parseProductPrices(cartProducts);

    if (cartProducts.length > 0) {
        // Calculate Totals
        let totalItems = 0;
        let totalSum = 0;
        
        cartProducts.forEach(p => {
           totalItems += p.cantidad;
           
           // Sum logic using formatted 'precio' (COP string)
           if (p.precio && p.availability !== false) {
               const unitPriceCOP = parseCopCurrency(p.precio);
               totalSum += unitPriceCOP * p.cantidad;
           }
        });

        // Update State
        const shoppingCartState = {
            productos: cartProducts,
            updated: true,
            items: totalItems,
            suma: totalSum,
            cartID: userID || shoppingCartID
        };

        console.log("Updating Cart State:", shoppingCartState);
        updateCart(shoppingCartState); // Update Context/Redux
        
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('cartProducts', totalItems);
            sessionStorage.setItem('cartSum', totalSum);
            sessionStorage.setItem('cartUpdated', 'actualizados-productos-context');
        }
    }

  } catch (error) {
    console.error("Error in FirebaseCompareShoppingCartIds:", error);
  }
};


FirebaseCompareShoppingCartIds.propTypes = {
  products: PropTypes.array.isRequired,
  updateCart: PropTypes.func.isRequired
}

export default FirebaseCompareShoppingCartIds
