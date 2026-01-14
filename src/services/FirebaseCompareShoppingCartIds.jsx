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

    const productsInputMap = new Map();
    products.forEach(p => {
        productsInputMap.set(p.productID, p.cantidad);
    });

    const targetIds = Array.from(productsInputMap.keys()).filter(id => id);
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

    // Hydrate cart products with fetched data
    const cartProducts = fetchedProducts.map(p => {
        const qty = productsInputMap.get(p.productID);
        return {
           ...p,
           cantidad: qty
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
           if (p.precio && p.precio !== 'Agotado') {
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
