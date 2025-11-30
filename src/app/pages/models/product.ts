
export interface SizeAvailability {
  size: string; // Ejemplo: 'S', 'M', 'L'
  available: boolean; // true si está en stock, false si no lo está
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: SizeAvailability[];
  inStock: boolean;
  stock?: number,
  isNew?: boolean;
  discount?: number;
  availabilityLabel?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}