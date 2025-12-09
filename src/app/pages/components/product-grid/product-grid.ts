import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { ProductModalComponent } from "./product-model/product-model";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    ProductModalComponent
  ],
  template: `
    <section class="py-16 px-4 " id="collection-shadow">
      <div class="container mx-auto max-w-6xl">
        <!-- Section Title -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">STYLE COLLECTION  {{nameColeccion.toUpperCase()}} </h2>
          <div class="w-24 h-1 bg-accent-500 mx-auto"></div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for(product of products;track product.id){
          <div 
            class="product-card bg-black rounded-lg overflow-hidden cursor-pointer animate-slide-up"
            (click)="openProductModal(product)"
          >
            <!-- Product Image -->
            <div class="relative group overflow-hidden">
              <img 
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              >
                                <div 
      *ngIf="!product.inStock"
      class="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold"
    >
      AGOTADO
    </div>
              <!-- Badges -->
              <div class="absolute top-4 left-4 space-y-2">
                <span 
                  *ngIf="product.isNew" 
                  class="inline-block bg-accent-500 text-white text-xs font-medium  px-3 py-1 rounded"
                >
                  Más vendido
                </span>
                <span 
                  *ngIf="product.discount" 
                  class="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded"
                >
                  -{{product.discount}}%
                </span>
              </div>

              <!-- Quick Actions -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"  *ngIf="product.inStock">
                <button class="btn-primary">
                  Ver Detalles
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <p class="text-[11px] px-2 py-1 mb-1 font-semibold  bg-[#EF4444] rounded-lg text-center ">{{product.availabilityLabel || 'Disponible por tiempo limitado.'}}</p>
              <h3 class="text-lg font-semibold text-white mb-2">{{product.name}}</h3>
              
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-accent-500">
                    S/. {{product.price.toFixed(2)}}
                  </span>
                  <span 
                    *ngIf="product.originalPrice" 
                    class="text-sm text-gray-500 line-through"
                  >
                    S/. {{product.originalPrice.toFixed(2)}}
                  </span>
                </div>
              </div>
                <!-- <span class="text-sm">🎃 Edición Halloween.</span> -->
              <div class="flex justify-between items-center">
                <button 
                  class="bg-accent-500 text-white text-sm px-4 py-2 rounded hover:bg-accent-600 transition-colors"
                  (click)="openProductModal(product); $event.stopPropagation()"
                >
                  Oferta
                </button>
<div class="flex space-x-1">
 @for(sizeItem of product.sizes.slice(0, 3); track sizeItem.size) {
 <span 
 [ngClass]="{
'line-through opacity-50': !sizeItem.available, 
 'bg-gray-800 text-gray-300': true
}"
 class="text-xs px-2 py-1 rounded transition-opacity" >{{sizeItem.size}} </span>
 } <span 
 *ngIf="product.sizes.length > 3" 
  class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded" >
   +{{product.sizes.length - 3}} </span>
</div>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Load More -->
        <!-- <div class="text-center mt-12">
          <button class="btn-secondary text-lg px-8 py-3">
            Ver Más Productos
          </button>
        </div> -->
      </div>
    </section>
    <section class="py-8 px-4 " id="collection-soon">
      <div class="container mx-auto max-w-6xl">
                <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white ">New Drop </h2>
          <span class="text-[11px] ">Stock limitado — ¡resérvalo antes de que se agote!</span>
          <div class="w-24 h-1 bg-accent-500 mx-auto"></div>
        </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for(product of proximamente;track product.id){
          <div 
            class="product-card bg-black rounded-lg overflow-hidden cursor-pointer animate-slide-up"
            (click)="openProductModal(product)"
          >
            <!-- Product Image -->
            <div class="relative group overflow-hidden">
              <img 
              
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <!-- Badges -->
              <!-- <div class="absolute top-4 left-4 space-y-2">
                <span 
                  *ngIf="product.isNew" 
                  class="inline-block bg-accent-500 text-white text-xs font-medium  px-3 py-1 rounded"
                >
                  Más vendido
                </span>
                <span 
                  *ngIf="product.discount" 
                  class="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded"
                >
                  -{{product.discount}}%
                </span>
              </div> -->

              <!-- Quick Actions -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button class="btn-primary">
                  Reservar 
                </button>
              </div>
            </div>
            <!-- Product Info -->
              <!-- <p class="text-[11px] px-2 py-1 mb-1 font-semibold  bg-[#EF4444] rounded-lg  ">Disponible por tiempo limitado.</p> -->
              <!-- <h3 class="text-lg font-semibold text-white mb-2">{{product.name}}</h3> -->
<!--               
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-accent-500">
                    S/. {{product.price.toFixed(2)}}
                  </span>
                  <span 
                    *ngIf="product.originalPrice" 
                    class="text-sm text-gray-500 line-through"
                  >
                    S/. {{product.originalPrice.toFixed(2)}}
                  </span>
                </div>
              </div> -->
               <!-- <span class="text-sm">Unidades limitadas — ¡puedes apartar la tuya desde ya!.</span> -->
              <!-- <div class="flex justify-between items-center">
                <button 
                  class="bg-accent-500 text-white text-sm px-4 py-2 rounded hover:bg-accent-600 transition-colors"
                  (click)="openProductModal(product); $event.stopPropagation()"
                >
                  Oferta
                </button>
                <div class="flex space-x-1">
                  <span 
                    *ngFor="let size of product.sizes.slice(0, 3)" 
                    class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                  >
                    {{size}}
                  </span>
                  <span 
                    *ngIf="product.sizes.length > 3" 
                    class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                  >
                    +{{product.sizes.length - 3}}
                  </span>
                </div>
              </div> -->
          </div>
          }@empty 
          {
             <p>No se encontraron productos.</p>
          }
        </div>
      </div>
    </section>
    <!-- Product Modal -->
    <app-product-modal
      *ngIf="selectedProduct"
      [product]="selectedProduct"
      [isOpen]="isModalOpen"
      (close)="closeProductModal()"
    ></app-product-modal>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class ProductGridComponent implements OnInit {
  products: Product[] = [];
  proximamente: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen = false;

  nameColeccion = 'BREATheDivinity';
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(
      products => this.products = products
    );

    this.productService.getProductsSoon().subscribe(
      products => this.proximamente = products
    );
  }

  openProductModal(product: Product) {
    if (product.inStock) {
      this.selectedProduct = product;
      this.isModalOpen = true;
    }
  }
  openProductModalSoon(product: Product) {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }
  closeProductModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }
}