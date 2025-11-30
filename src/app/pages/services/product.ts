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
      name: 'Void Tech™ Evangelion Compression Void Black',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 79.00,
      image: '../../../assets/gotico1.jpeg',
      images: [
        '../../../assets/gotico1_view1.jpeg',
        '../../../assets/gotico1_view2.jpeg',
        '../../../assets/gotico1_view3.jpeg',
        '../../../assets/gotico1_view4.jpeg',
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true },
        // No disponible -> Tachar
        { size: 'M', available: false },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Void Tech™ Evangelion Compression Divine White',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 79.90,
      image: '../../../assets/white.jpeg',
      images: [
        '../../../assets/white.jpeg',
        '../../../assets/white-back.jpeg'
      ],
      category: 'Camisetas',
      sizes: [
        { size: 'S', available: false }, // No disponible -> Tachar
        { size: 'M', available: false },  // Disponible
        { size: 'L', available: false }  // No disponible -> Tachar
      ],
      inStock: false,
      discount: 25
    },
    {
      id: '3',
      name: 'Void Tech™ Evangelion Compression Crimson Red',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 79.00,
      image: '../../../assets/style2.jpeg',
      images: [
        '../../../assets/style2.jpeg',
        '../../../assets/style2.2.jpeg'
      ],
      category: 'Hoodies',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: false },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '4',
      name: 'Void Tech™ Dark Matter Compression',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 89.00,
      image: '../../../assets/soon1_view.jpeg',
      images: [
        '../../../assets/soon1_view.jpeg',
        '../../../assets/soon1_view_stock.jpeg',
        '../../../assets/soon1_view2_stock.jpeg',

      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '5',
      name: 'Void Tech™ Nighfall Compression',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 89.00,
      image: '../../../assets/gotico2.jpeg',
      images: [
        '../../../assets/gotico2.jpeg',
        '../../../assets/soon2_view_stock.jpeg',
        '../../../assets/soon2_view2_stock.jpeg',

      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '6',
      name: 'Dark Fantasy compression Heavenly Red',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 89.00,
      image: '../../../assets/view5.jpeg',
      images: [
        '../../../assets/view5.jpeg',
        '../../../assets/producto5.jpeg',
        '../../../assets/producto5_2.jpeg',

      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '7',
      name: 'Void Tech™ Soul Decay Compression Void Black ',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/gotico7.jpeg',
      images: [
        '../../../assets/gotico7_view1.jpeg',
        '../../../assets/gotico7_view2.jpeg',

      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '8',
      name: 'Void Tech™ Soul Decay Compression  Abyssal Blue ',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 89.00,
      image: '../../../assets/gotico6.jpeg',
      images: [
        '../../../assets/gotico6_view1.jpeg',
        '../../../assets/gotico6_view2.jpeg',

      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '9',
      name: 'Void Tech Vampire Hunter Zip-Up Compression',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 69.00,
      originalPrice: 79.00,
      image: '../../../assets/new_product_1.jpg',
      images: [
        '../../../assets/new_product_1.jpg',
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true },
        { size: 'M', available: true },
        { size: 'L', available: true }
      ],
      inStock: true,
      isNew: true,
      discount: 25,
      availabilityLabel: 'PREVENTA'
    }
  ];
  private productsSoon: Product[] = [
    {
      id: '1',
      name: 'Eternal Wyvern Oversized Sweatpants"',
      description: `
      Eternal Wyvern Oversized Sweatpants" , diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 99.90,
      originalPrice: 119.00,
      image: '../../../assets/soon3.jpeg',
      images: [
        '../../../assets/soon3.jpeg',
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    //     {
    //       id: '1',
    //       name: 'Color negro con estampado Blanco',
    //       description: `
    //       Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
    // Ideales para entrenar con intensidad y estilo.
    // 🔥 Oscuros, cómodos y hechos para dominar.
    //       `,
    //       price: 59.90,
    //       originalPrice: 89.00,
    //       image: '../../../assets/gotico2.jpeg',
    //       images: [
    //         '../../../assets/gotico2_view1.jpeg',
    //       ],
    //       category: 'compresores',
    //       sizes: ['S', 'M', 'L'],
    //       inStock: true,
    //       isNew: false,
    //       discount: 25
    //     },

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