'use client'
import { v4 as uuidv4 } from 'uuid'
import { firestore, auth } from '@/firebase/firebaseClient'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

// Helper to save cart (exported for use in other files)
export const saveCartToFirestore = async (cartID, products) => {
  if (!cartID) return;
  try {
    const shoppingsRef = collection(firestore, 'shoppingCart');
    await setDoc(doc(shoppingsRef, cartID), { productos: products }, { merge: true });
    console.log("Cart saved to Firestore:", cartID);
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
  }
};

const FirebaseLoadShoppingCart = async () => {
    // 1. Get User/Cart ID
    const user = auth?.currentUser;
    const userID = user?.uid;
    
    let shoppingCartID = null;
    if (typeof window !== 'undefined') {
        shoppingCartID = sessionStorage.getItem('cartID');
        
        // If no ID exists, create one
        if (!shoppingCartID && !userID) {
            shoppingCartID = uuidv4();
            sessionStorage.setItem('cartID', shoppingCartID);
            // Initialize empty cart in DB
            await saveCartToFirestore(shoppingCartID, []);
        }
    }

    const usedID = userID || shoppingCartID;
    console.log('FirebaseLoadShoppingCart loading for ID:', usedID);

    if (!usedID) return [];

    try {
        const shoppingsRef = collection(firestore, 'shoppingCart');
        const docRef = doc(shoppingsRef, usedID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Firestore Cart Data:", data);
            return data.productos || [];
        } else {
            console.log("No cart found in Firestore for this ID");
            return [];
        }
    } catch (error) {
        console.error("Error loading cart from Firestore:", error);
        return [];
    }
}

export default FirebaseLoadShoppingCart

