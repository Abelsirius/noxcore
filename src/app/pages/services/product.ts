import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: ' Gothic Shadows',
      description: ' diseño gótico exclusivo de Noxcore',
      price: 69.90,
      originalPrice: 90.00,
      image: '../../../assets/1.png',
      images: [
        '../../../assets/1.png',
      ],
      category: 'Hoodies',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Dark Tribal ',
      description: 'Camiseta compress con estampado tribal dark exclusivo',
      price: 59.90,
      originalPrice: 79.90,
      image: '../../../assets/white.jpeg',
      images: [
        '../../../assets/white.jpeg',
        '../../../assets/white-back.jpeg'
      ],
      category: 'Camisetas',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '3',
      name: 'Gym Beast compress',
      description: 'técnico para entrenamientos intensos con diseño exclusivo',
      price: 59.90,
      originalPrice: 95.00,
      image: '../../../assets/style2.jpeg',
      images: [
        '../../../assets/style2.jpeg',
        '../../../assets/style2.2.jpeg'
      ],
      category: 'Hoodies',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      isNew: true,
      discount: 24
    }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}