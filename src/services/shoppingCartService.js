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
