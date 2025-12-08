'use client'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/firebase/firebaseClient'
import { saveCartToFirestore, loadCartFromFirestore } from './shoppingCartService'

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

    return await loadCartFromFirestore(usedID);
}

export default FirebaseLoadShoppingCart

