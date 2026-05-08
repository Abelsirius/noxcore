export interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  sku?: string;
  stock: number;
  price_override?: number;
  order_index: number;
}

export interface Product {
  id: string;
  collection_id?: string | null;
  name: string;
  slug: string;
  description: string;
  images: string[];
  base_price: number;
  discount_percent?: number;
  is_new?: boolean;
  is_available?: boolean;
  category?: string;
  created_at: string;
  variants?: ProductVariant[];
  collection?: Collection;
}

export interface CartItem {
  variant_id: string;
  quantity: number;
  // UI Helpers
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  user_id?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: any;
  contact_phone?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  sku?: string;
  subtotal: number;
}