/**
 * TypeScript Data Models for Store Products & Extended Metadata
 * Wavi Aeronautics Store
 */

export interface ShippingOption {
  id: string;
  name: string;
  estimatedDays: string;
  price: number;
  isDefault: boolean;
  carrier?: string;
  description?: string;
}

export interface ProductOption {
  label: string;
  priceModifier: number;
}

export type VariationSelectorType = "dropdown" | "pills" | "color";

export interface ProductVariationOption {
  id: string;
  label: string; // e.g., "ELRS 2.4G con GPS", "Negro", "2450KV"
  priceDelta: number; // Price addition/subtraction in USD or COP (+17 USD, +20000 COP, etc.)
  colorHex?: string; // Hex code for color swatch selector e.g. "#1e1e1e"
  skuSuffix?: string; // e.g., "-ELRS-GPS"
  imageUrl?: string; // Optional variant-specific main image
  images?: string[]; // Optional gallery override for this specific variant
  stock?: number; // Stock override if variant stock is tracked individually
}

export interface ProductVariationGroup {
  id: string; // e.g., "receiver_type", "color", "motors"
  name: string; // Display title: "RECEPTOR", "COLOR", "MOTORES"
  type?: VariationSelectorType; // UI selector type in PDP: 'dropdown' | 'pills' | 'color'
  required: boolean; // Force user selection before checkout
  options: ProductVariationOption[];
}

export interface SelectedVariation {
  groupId: string;
  groupName: string;
  optionId: string;
  optionLabel: string;
  priceDelta: number;
  colorHex?: string;
  skuSuffix?: string;
  imageUrl?: string;
  images?: string[];
}

export interface CartItem {
  cartItemId: string; // Unique hash: `${productId}_${selectedVariationsHash}`
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number; // basePrice + sum(priceDeltas)
  quantity: number;
  selectedVariations: SelectedVariation[];
  image: string; // Active variant image or primary product image
}

export interface Product {
  id?: string;
  productID: string;
  name: string;
  price: number;
  basePrice?: number;
  precio?: string | number;
  stock: number;
  sku: string;
  warrantyInfo: string;
  size?: string; // e.g. "5 pulgadas", "3.5\""
  recommendedUses?: string[]; // e.g. ["Freestyle", "Cinematic", "Long Range"]
  reviewsCount?: number;
  questionsCount?: number;
  rating?: number;
  shippingOptions?: ShippingOption[];
  category: string;
  brand: string;
  images: string[];
  description: string;
  availability?: boolean;
  options?: ProductOption[];
  variationGroups?: ProductVariationGroup[];
  video?: string;
  tags?: string[];
  specifications?: Record<string, string> | string;
  includes?: string[] | string;
  peso?: string;
  dimensiones?: string;
}
