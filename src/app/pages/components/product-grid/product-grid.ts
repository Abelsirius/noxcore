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
    <!-- BLACK FRIDAY COLLECTION SECTION -->
    <section class="py-16 px-4" id="black-friday-collection">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-red-600 mb-4 animate-pulse">BLACK FRIDAY COLLECTION</h2>
          <div class="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p class="text-gray-400 uppercase tracking-widest">Edición Limitada</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          @for(product of blackFridayProducts; track product.id){
          <div 
            #bfProductCard
            class="product-card bg-black rounded-lg overflow-hidden cursor-pointer animate-slide-up border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            (click)="openProductModal(product)"
            (mouseenter)="onProductHover($event, true)"
            (mouseleave)="onProductHover($event, false)"
            (touchstart)="onTouchStart($event, bfProductCard)"
            (touchend)="onTouchEnd($event, bfProductCard)"
            (touchcancel)="onTouchCancel($event, bfProductCard)"
          >
            <!-- Product Image -->
            <div class="relative group overflow-hidden">
              <img 
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <!-- Black background for video (shown on hover) -->
              <div 
                *ngIf="product.videoPreview"
                class="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <!-- Video Preview -->
              <video 
                *ngIf="product.videoPreview"
                [src]="product.videoPreview"
                class="product-video absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                muted
                loop
                playsinline
              ></video>
              <div 
                *ngIf="!product.inStock"
                class="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold"
              >
                AGOTADO
              </div>
              <!-- Badges -->
              <div class="absolute top-4 left-4 space-y-2">
                 <span 
                  class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded animate-pulse"
                >
                  BLACK FRIDAY
                </span>
                <span 
                  *ngIf="product.isNew" 
                  class="inline-block bg-accent-500 text-white text-xs font-medium px-3 py-1 rounded"
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
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" *ngIf="product.inStock">
                <button class="btn-primary">
                  Ver Detalles
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <p *ngIf="product.inStock" class="text-[11px] px-2 py-1 mb-1 font-semibold bg-[#EF4444] rounded-lg text-center">{{getAvailabilityText(product)}}</p>
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
      </div>
    </section>

    <!-- ORIGINAL STYLE COLLECTION SECTION -->
    <section class="py-16 px-4 " id="collection-shadow">
      <div class="container mx-auto max-w-6xl">
        <!-- Section Title -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">STYLE COLLECTION  {{nameColeccion.toUpperCase()}} </h2>
          <div class="w-24 h-1 bg-accent-500 mx-auto mb-6"></div>
          <div class="flex justify-center">
             <img src="../../../assets/breathedivinity_logo.png" class="w-96 object-contain" alt="Breathedivinity Logo">
          </div>
          <div class=" bottom-8 left-1/2  flex items-center justify-center z-10  block md:hidden"  >
    <div class="w-6 h-10 border-2  border-white/50 rounded-full flex justify-center  ">
      <div class="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>  
        </div>
        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for(product of products;track product.id){
          <div 
            #productCard
            class="product-card bg-black rounded-lg overflow-hidden cursor-pointer animate-slide-up"
            (click)="openProductModal(product)"
            (mouseenter)="onProductHover($event, true)"
            (mouseleave)="onProductHover($event, false)"
            (touchstart)="onTouchStart($event, productCard)"
            (touchend)="onTouchEnd($event, productCard)"
            (touchcancel)="onTouchCancel($event, productCard)"
          >
            <!-- Product Image -->
            <div class="relative group overflow-hidden">
              <img 
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <!-- Black background for video (shown on hover) -->
              <div 
                *ngIf="product.videoPreview"
                class="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <!-- Video Preview (Hidden by default, shown on hover) -->
              <video 
                *ngIf="product.videoPreview"
                [src]="product.videoPreview"
                class="product-video absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                muted
                loop
                playsinline
              ></video>
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
              <p *ngIf="product.inStock" class="text-[11px] px-2 py-1 mb-1 font-semibold  bg-[#EF4444] rounded-lg text-center ">{{getAvailabilityText(product)}}</p>
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
          <h2 class="text-4xl font-bold text-white ">DROP PASADO – ÚLTIMAS UNIDADES</h2>
          <div class="w-24 h-1 bg-accent-500 mx-auto"></div>
        </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for(product of proximamente;track product.id){
          <div 
            #productCardSoon
            class="product-card bg-black rounded-lg overflow-hidden cursor-pointer animate-slide-up"
            (click)="openProductModal(product)"
            (mouseenter)="onProductHover($event, true)"
            (mouseleave)="onProductHover($event, false)"
            (touchstart)="onTouchStart($event, productCardSoon)"
            (touchend)="onTouchEnd($event, productCardSoon)"
            (touchcancel)="onTouchCancel($event, productCardSoon)"
          >
            <!-- Product Image -->
            <div class="relative group overflow-hidden">
              <img 
              
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              >
               <!-- Black background for video (shown on hover) -->
               <div 
                 *ngIf="product.videoPreview"
                 class="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               ></div>
               <!-- Video Preview for Soon Section -->
               <video 
               *ngIf="product.videoPreview"
               [src]="product.videoPreview"
               class="product-video absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
               muted
               loop
               playsinline
             ></video>
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
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" *ngIf="product.inStock">
                <button class="btn-primary">
                  Ver Detalles
                </button>
              </div>
            </div>
            <!-- Product Info -->
            <div class="p-6">
              <p *ngIf="product.inStock" class="text-[11px] px-2 py-1 mb-1 font-semibold  bg-[#EF4444] rounded-lg text-center ">{{getAvailabilityText(product)}}</p>
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
  blackFridayProducts: Product[] = []; // New separate list
  proximamente: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen = false;

  // Long press state management
  private longPressTimer: any;
  private isLongPressActive = false;
  private readonly LONG_PRESS_DURATION = 200; // milliseconds

  nameColeccion = 'BREATheDivinity';
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(
      products => {
        // Filter out the Nightfall Compression Longsleeve Heavenly Red (ID 13)
        this.blackFridayProducts = products.filter(p => p.id === '13');
        this.products = products.filter(p => p.id !== '13');
      }
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

  onProductHover(event: Event, shouldPlay: boolean) {
    const target = event.currentTarget as HTMLElement;
    const video = target.querySelector('video.product-video') as HTMLVideoElement;

    if (video) {
      if (shouldPlay) {
        video.muted = true;
        video.play().catch(error => console.log('Video play failed:', error));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }

  onTouchStart(event: TouchEvent, containerElement: HTMLElement) {
    // Start long press timer
    this.isLongPressActive = false;

    this.longPressTimer = setTimeout(() => {
      this.isLongPressActive = true;
      const video = containerElement.querySelector('video.product-video') as HTMLVideoElement;

      if (video) {
        video.muted = true;
        video.play().catch(error => console.log('Video play failed:', error));
      }
    }, this.LONG_PRESS_DURATION);
  }

  onTouchEnd(event: TouchEvent, containerElement: HTMLElement) {
    // Clear the timer if touch ends before long press duration
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }

    // Stop video if it was playing
    const video = containerElement.querySelector('video.product-video') as HTMLVideoElement;
    if (video && this.isLongPressActive) {
      video.pause();
      video.currentTime = 0;
    }

    this.isLongPressActive = false;
  }

  onTouchCancel(event: TouchEvent, containerElement: HTMLElement) {
    // Handle touch cancel (e.g., when scrolling starts)
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }

    const video = containerElement.querySelector('video.product-video') as HTMLVideoElement;
    if (video && this.isLongPressActive) {
      video.pause();
      video.currentTime = 0;
    }

    this.isLongPressActive = false;
  }

  getAvailabilityText(product: Product): string {
    if (product.availabilityLabel) {
      return product.availabilityLabel;
    }
    const availableSizesCount = product.sizes.filter(s => s.available).length;
    if (availableSizesCount === 1) {
      return 'CASI AGOTADO';
    }
    return 'Disponible por tiempo limitado.';
  }
}