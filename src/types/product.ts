/**
 * TypeScript Data Models for Store Products & Extended Metadata
 * Wavi Aeronautics Store
 */

export interface ShippingOption {
  id: string
  name: string
  estimatedDays: string
  price: number
  isDefault: boolean
  carrier?: string
  description?: string
}

export interface ProductOption {
  label: string
  priceModifier: number
}

export interface Product {
  id?: string
  productID: string
  name: string
  price: number
  precio?: string | number
  stock: number
  sku: string
  warrantyInfo: string
  size?: string // e.g. "5 pulgadas", "3.5\""
  recommendedUses?: string[] // e.g. ["Freestyle", "Cinematic", "Long Range"]
  reviewsCount?: number
  questionsCount?: number
  rating?: number
  shippingOptions?: ShippingOption[]
  category: string
  brand: string
  images: string[]
  description: string
  availability?: boolean
  options?: ProductOption[]
  video?: string
  tags?: string[]
  specifications?: Record<string, string> | string
  includes?: string[] | string
  peso?: string
  dimensiones?: string
}
