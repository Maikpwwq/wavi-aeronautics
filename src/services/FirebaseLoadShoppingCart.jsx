'use client'
import { auth } from '@/firebase/firebaseClient'
import { saveCartToFirestore, loadCartFromFirestore } from './shoppingCartService'

const FirebaseLoadShoppingCart = async () => {
    // 1. Get User/Cart ID
    const user = auth?.currentUser;
    const userID = user?.uid;
    
    let shoppingCartID = null;
    if (typeof window !== 'undefined') {
        shoppingCartID = sessionStorage.getItem('cartID');
    }

    const usedID = userID || shoppingCartID;
    
    if (usedID) {
        console.log('FirebaseLoadShoppingCart loading for ID:', usedID);
        return await loadCartFromFirestore(usedID);
    }

    // Return empty array if no ID (new guest with empty cart)
    return [];
}

export default FirebaseLoadShoppingCart

