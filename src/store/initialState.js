// load store state from server side
import { sharingInformationService } from '@/services/sharing-information'

const initialState = () => {
  const shop = {}
  const shoppingCart = {
    productos: [],
    cartID: null
  }

  const dolarPrice = process.env.NEXT_PUBLIC_DOLARTOCOP
  if (dolarPrice > 0) {
    shop.dolarPrice = parseInt(dolarPrice)
  }

  // Allow some local storage or subject hydration if needed, but avoid heavy async logic here.
  // The DataInitializer will handle the main data fetching.
  
  const productData = sharingInformationService.getSubject()
  // Note: Subscribing here in a synchronous function that returns once is usually ineffective
  // unless the subject has a value synchronously. 
  // We keep it if it behaves like a BehaviorSubject with a current value.
  // Otherwise, real-time updates should happen in components or middleware.
  
  // Attempt to read current value synchronously if possible, or just skip.
  // For safety against the anti-pattern, we'll comment out the subscription 
  // unless we know getSubject() returns a BehaviorSubject and we can execute .getValue()
  
  // productData.subscribe((data) => {
  //   if (data) {
  //      ...
  //   }
  // })
  
  // Better to let providers/ShoppingCartProvider handle cart hydration.

  return {
    user: {},
    shoppingCart,
    shop
  }
}

export default initialState
