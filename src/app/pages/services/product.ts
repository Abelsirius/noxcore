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
      name: 'Color negro con estampado Blanco',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/gotico1.jpeg',
      images: [
        '../../../assets/gotico1_view1.jpeg',
        '../../../assets/gotico1_view2.jpeg',
        '../../../assets/gotico1_view3.jpeg',
        '../../../assets/gotico1_view4.jpeg',
      ],
      category: 'compresores',
      sizes: ['S', 'M', 'L'],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Color blanco con estampado Negro',
         description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.90,
      image: '../../../assets/white.jpeg',
      images: [
        '../../../assets/white.jpeg',
        '../../../assets/white-back.jpeg'
      ],
      category: 'Camisetas',
      sizes: ['S', 'M', 'L'],
      inStock: true,
      discount: 25
    },
    {
      id: '3',
      name: 'Color negro con estampado  Rojo',
         description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/style2.jpeg',
      images: [
        '../../../assets/style2.jpeg',
        '../../../assets/style2.2.jpeg'
      ],
      category: 'Hoodies',
      sizes: ['S', 'M', 'L'],
      inStock: true,
      isNew: true,
      discount: 24
    },
    
  ];
  private productsSoon: Product[] = [
    {
      id: '1',
      name: 'Color negro con estampado Blanco',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/soon1.jpeg',
      images: [
        '../../../assets/gotico1_view1.jpeg',
      ],
      category: 'compresores',
      sizes: ['S', 'M', 'L'],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '1',
      name: 'Color negro con estampado Blanco',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/gotico2.jpeg',
      images: [
        '../../../assets/gotico2_view1.jpeg',
      ],
      category: 'compresores',
      sizes: ['S', 'M', 'L'],
      inStock: true,
      isNew: true,
      discount: 25
    },
    
  ];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private productsSoonSubject = new BehaviorSubject<Product[]>(this.productsSoon);


  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }
  getProductsSoon(): Observable<Product[]> {
    return this.productsSoonSubject.asObservable();
  }
  getProduct(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }
    getProductSoon(id: string): Product | undefined {
    return this.productsSoon.find(product => product.id === id);
  }
}