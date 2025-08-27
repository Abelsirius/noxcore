export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}