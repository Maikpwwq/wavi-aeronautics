import { firestore } from '@/firebase/firebaseClient'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

/**
 * Saves the shopping cart products to Firestore.
 * @param {string} cartID - The ID of the cart/user to save to.
 * @param {Array} products - The array of products to save.
 */
export const saveCartToFirestore = async (cartID, products) => {
  if (!cartID) {
    console.warn("saveCartToFirestore called without cartID");
    return;
  }
  try {
    const shoppingsRef = collection(firestore, 'shoppingCart');
    await setDoc(doc(shoppingsRef, cartID), { productos: products }, { merge: true });
    // console.log("Cart saved to Firestore:", cartID);
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
    throw error;
  }
};

/**
 * Loads the shopping cart products from Firestore.
 * @param {string} cartID - The ID of the cart/user to load from.
 * @returns {Promise<Array>} The array of products or empty array if not found.
 */
export const loadCartFromFirestore = async (cartID) => {
    if (!cartID) return [];

    try {
        const shoppingsRef = collection(firestore, 'shoppingCart');
        const docRef = doc(shoppingsRef, cartID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.productos || [];
        } else {
            console.log("No cart found in Firestore for this ID:", cartID);
            return [];
        }
    } catch (error) {
        console.error("Error loading cart from Firestore:", error);
        return [];
    }
};

/**
 * Merges a guest cart into a user cart.
 * @param {string} guestCartID - source
 * @param {string} userCartID - destination (user uid)
 */
export const mergeCarts = async (guestCartID, userCartID) => {
    if (!guestCartID || !userCartID || guestCartID === userCartID) return;

    try {
        const guestCartRef = doc(firestore, 'shoppingCart', guestCartID);
        const userCartRef = doc(firestore, 'shoppingCart', userCartID);

        // Transaction to ensure atomicity
        await runTransaction(firestore, async (transaction) => {
            const guestDoc = await transaction.get(guestCartRef);
            const userDoc = await transaction.get(userCartRef);

            if (!guestDoc.exists()) return; // Nothing to merge

            const guestItems = guestDoc.data().productos || [];
            if (guestItems.length === 0) return;

            let userItems = [];
            if (userDoc.exists()) {
                userItems = userDoc.data().productos || [];
            }

            // Merge logic: Add guest items to user items
            // If item exists, update quantity? Or just append?
            // Simple approach: Map by productID
            const itemMap = new Map();
            userItems.forEach(item => itemMap.set(item.productID, item));

            guestItems.forEach(guestItem => {
                if (itemMap.has(guestItem.productID)) {
                    // Update quantity
                    const existing = itemMap.get(guestItem.productID);
                    existing.cantidad = (parseInt(existing.cantidad) || 0) + (parseInt(guestItem.cantidad) || 1);
                } else {
                    itemMap.set(guestItem.productID, guestItem);
                }
            });

            const mergedProducts = Array.from(itemMap.values());

            transaction.set(userCartRef, { productos: mergedProducts }, { merge: true });
            
            // Optional: Delete guest cart or empty it
            transaction.delete(guestCartRef);
        });
        
        console.log(`Merged cart ${guestCartID} into ${userCartID}`);

    } catch (error) {
        console.error("Error merging carts:", error);
        throw error;
    }
};

/**
 * Subscribes to changes in a shopping cart.
 * @param {string} cartID 
 * @param {function} onUpdateCallback 
 * @returns {function} unsubscribe function
 */
export const subscribeToCart = (cartID, onUpdateCallback) => {
    if (!cartID) {
        return () => {};
    }

    const docRef = doc(firestore, 'shoppingCart', cartID);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            onUpdateCallback(data.productos || []);
        } else {
            onUpdateCallback([]);
        }
    }, (error) => {
        console.error("[subscribeToCart] Cart subscription error:", error);
    });

    return unsubscribe;
};

import { runTransaction, onSnapshot } from 'firebase/firestore';
