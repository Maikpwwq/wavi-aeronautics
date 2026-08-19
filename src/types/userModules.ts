/**
 * TypeScript Data Models for User Management Modules
 * Mis Favoritos, Mis Opiniones, Mis Compras, Facturación
 */

export interface FavoriteItem {
  id: string
  productId: string
  name: string
  brand: string
  category: string
  price: number
  precio?: string | number
  images: string[]
  firstImage?: string
  availability?: boolean
  addedAt?: string | number | null
}

export interface UserReview {
  id: string
  productId: string
  productName: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  comment: string
  approved: boolean
  createdAt: any
  createdAtFormatted?: string
  updatedAt?: any
}

export interface PurchasedItem {
  id?: string
  productID?: string
  name: string
  quantity: number
  price: number
  image?: string
  brand?: string
  category?: string
}

export interface PurchaseOrder {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  items: PurchasedItem[]
  total: number
  paymentMethod?: string
  paymentId?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
  createdAt: any
  createdAtFormatted?: string
  shippingAddress?: {
    street?: string
    city?: string
    department?: string
    postalCode?: string
    phone?: string
  }
  billingDetails?: {
    docType?: string
    docNumber?: string
    businessName?: string
  }
}

export interface BillingProfile {
  docType: 'CC' | 'CE' | 'NIT' | 'PP'
  docNumber: string
  businessName: string
  address: string
  city: string
  department: string
  postalCode: string
  phone: string
  email: string
  isDefault?: boolean
  updatedAt?: any
}

export interface SavedPaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'pse' | 'token'
  brand: string // 'visa' | 'mastercard' | 'amex' | 'pse'
  lastFour: string
  cardholderName?: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
  createdAt?: any
}
