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
      name: 'Evangelion Compression Void Black',
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
        { size: 'S', available: false },
        { size: 'M', available: true },
        { size: 'L', available: true }
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Evangelion Compression Divine White',
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
      name: 'Evangelion Compression Crimson Red',
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
      name: 'Dark Matter Compression',
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
        { size: 'S', available: false }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: false }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },
    {
      id: '5',
      name: 'Nighfall Compression',
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
      id: '12',
      name: 'Nighfall Compression Frost',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 89.00,
      image: '../../../assets/nighfall_frost.png',
      images: [
        '../../../assets/nighfall_frost.png',
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: false },
        { size: 'M', available: false },
        { size: 'L', available: true }
      ],
      inStock: true,
      isNew: true,
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
        { size: 'S', available: false }, // No disponible -> Tachar
        { size: 'M', available: false },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '7',
      name: 'Soul Decay Compression Void Black ',
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
        { size: 'M', available: false },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '8',
      name: 'Soul Decay Compression  Abyssal Blue ',
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
        { size: 'S', available: false }, // No disponible -> Tachar
        { size: 'M', available: true },  // Disponible
        { size: 'L', available: true }  // No disponible -> Tachar
      ],
      inStock: true,
      isNew: false,
      discount: 25
    },
    {
      id: '10',
      name: 'Soul Decay Compression Void Black',
      description: `
      Compresores de alta elasticidad, diseo infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
 Oscuros, cmodos y hechos para dominar.
      `,
      price: 49.90,
      originalPrice: 79.00,
      image: '../../../assets/soul_decay_short.jpeg',
      images: [
        '../../../assets/soul_decay_short.jpeg',
        '../../../assets/soul_decay_void_black_extra1.png',
        '../../../assets/soul_decay_void_black_extra2.png'
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: true },
        { size: 'M', available: false },
        { size: 'L', available: true }
      ],
      inStock: true,
      isNew: true,
      discount: 25
    },

  ];
  private productsSoon: Product[] = [
    {
      id: '2',
      name: 'Heavenly Red - Blood Wyvern Pants',
      description: `
      Heavenly Red - Blood Wyvern Pants.
Diseño infernal y ajuste perfecto.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 79.90,
      originalPrice: 99.90,
      image: '../../../assets/heavenly_red_wyvern.png',
      images: [
        '../../../assets/heavenly_red_wyvern.png',
      ],
      category: 'Pants',
      sizes: [
        { size: 'M', available: true },
        { size: 'L', available: true },
        { size: 'XL', available: true }
      ],
      inStock: true,
      isNew: true,
      discount: 25,
      availabilityLabel: 'DISPONIBLE'
    },
    {
      id: '9',
      name: 'Vampire Hunter Zip-Up Compression',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 79.00,
      image: '../../../assets/new_product_1.jpg',
      images: [
        '../../../assets/new_product_1.jpg',
      ],
      category: 'compresores',
      sizes: [
        { size: 'S', available: false },
        { size: 'M', available: true },
        { size: 'L', available: true }
      ],
      inStock: true,
      isNew: true,
      discount: 25,
      availabilityLabel: 'DISPONIBLE'
    },
    {
      id: '3',
      name: 'Deathblade Oversized Pullover Hoodie',
      description: `
      Deathblade Oversized Pullover Hoodie.
      Diseño infernal y ajuste perfecto.
      🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 119.80,
      image: '../../../assets/deathblade_hoodie.png',
      images: [
        '../../../assets/deathblade_hoodie.png',
      ],
      category: 'Hoodies',
      sizes: [
        { size: 'S', available: false },
        { size: 'M', available: true },
        { size: 'L', available: false }
      ],
      inStock: true,
      isNew: true,
      discount: 25,
      availabilityLabel: 'DISPONIBLE'
    },
    {
      id: '11',
      name: 'Immortal compression',
      description: `
      Compresores de alta elasticidad, diseño infernal y ajuste perfecto.
Ideales para entrenar con intensidad y estilo.
🔥 Oscuros, cómodos y hechos para dominar.
      `,
      price: 59.90,
      originalPrice: 79.90,
      image: '../../../assets/immortal_compression.png',
      images: [
        '../../../assets/immortal_compression.png',
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
      availabilityLabel: 'DISPONIBLE'
    }
  ];
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
