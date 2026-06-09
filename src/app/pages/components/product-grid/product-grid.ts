import { Component, inject, OnInit, computed } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { ProductModalComponent } from "./product-model/product-model";
import { ProductCarouselComponent } from '../product-carousel/product-carousel';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    ProductModalComponent,
    ProductCarouselComponent,
    NgTemplateOutlet
  ],
  template: `
    <!-- BLACK FRIDAY COLLECTION SECTION -->
     @if( blackFridayProducts().length > 0){
          <section class="py-16 bg-black overflow-hidden" id="black-friday-collection">
      <div class="container mx-auto">
        <app-product-carousel 
          [products]="blackFridayProducts()" 
          title="BLACK FRIDAY COLLECTION" 
          themeColor="#dc2626"
          (productSelected)="openProductModal($event)"
        ></app-product-carousel>
      </div>
    </section>
   }
    <!-- ORIGINAL STYLE COLLECTION SECTION -->
    @defer (on viewport) {
      <section class="py-16 bg-black" id="collection-shadow">
        <div class="container mx-auto">
          @if(!isLoading()){
          <app-product-carousel 
            [products]="products()" 
            [title]="'STYLE COLLECTION ' + nameColeccion.toUpperCase()" 
            themeColor="#ef4444"
            (productSelected)="openProductModal($event)"
          ></app-product-carousel>
          }@else
            {
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          @for (item of [1,2,3,4]; track $index) {
            <ng-container *ngTemplateOutlet="productSkeleton"></ng-container>
          }
        </div>
            }
        </div>
      </section>
    } @placeholder {
<div class="bg-black py-16">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ng-container *ngTemplateOutlet="productSkeleton"></ng-container>
      </div>
    </div>
  </div>
    }

    @defer (on viewport) {
      @if(proximamente().length > 0){
      <section class="py-16 bg-black" id="collection-soon">
        <div class="container mx-auto">
           @if(!isLoading()){
            <app-product-carousel 
            [products]="proximamente()" 
            title="DROP PASADO – ÚLTIMAS UNIDADES" 
            themeColor="#ef4444"
            (productSelected)="openProductModal($event)"
          ></app-product-carousel>
           }@else
            {
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            @for (item of [1,2,3,4]; track $index) {
              <ng-container *ngTemplateOutlet="productSkeleton"></ng-container>
            }
          </div>
            }
        </div>
      </section>
      }
    } @placeholder {
<div class="bg-black py-16">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ng-container *ngTemplateOutlet="productSkeleton"></ng-container>
      </div>
    </div>
  </div>
    }
    <!-- Product Modal -->
    @if (selectedProduct) {
      <app-product-modal
        [product]="selectedProduct"
        [isOpen]="isModalOpen"
        (close)="closeProductModal()"
      ></app-product-modal>
    }

    <ng-template #productSkeleton>
  <div class="w-full bg-[#111111] rounded-2xl overflow-hidden border border-zinc-800 animate-pulse">
    <div class="relative aspect-[4/5] bg-zinc-900">
      <div class="absolute top-4 left-4 h-6 w-14 bg-zinc-800 rounded-full"></div>
      <div class="absolute top-4 right-4 w-8 h-8 bg-zinc-800 rounded-full"></div>
    </div>

    <div class="p-4 flex flex-col gap-3 bg-[#111111]">
      <div class="h-4 w-11/12 bg-zinc-800 rounded"></div>
      
      <div class="h-5 w-1/3 bg-zinc-800 rounded mt-1"></div>
      
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-zinc-900">
        <div class="flex gap-1.5">
          <div class="w-6 h-6 bg-zinc-800 rounded-md"></div>
          <div class="w-6 h-6 bg-zinc-800 rounded-md"></div>
          <div class="w-6 h-6 bg-zinc-800 rounded-md"></div>
        </div>
        <div class="w-5 h-5 bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  </div>
</ng-template>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class ProductGridComponent implements OnInit {
  blackFridayProducts = computed(() => {
    return this.productService.products().filter(p =>
      p.collection?.description?.includes('SECTION:black_friday')
    );
  });

  proximamente = computed(() => {
    return this.productService.products().filter(p =>
      p.collection?.description?.includes('SECTION:drop_pasado')
    );
  });

  products = computed(() => {
    const allProducts = this.productService.products();
    const bf = this.blackFridayProducts();
    const prox = this.proximamente();

    let filtered = allProducts.filter(p =>
      p.collection?.description?.includes('SECTION:style_collection') ||
      (p.collection_id && !bf.includes(p) && !prox.includes(p))
    );

    if (filtered.length === 0 && allProducts.length > 0) {
      filtered = allProducts.filter(p => !bf.includes(p) && !prox.includes(p));
    }
    return filtered;
  });

  selectedProduct: Product | null = null;
  isModalOpen = false;
  isLoading = computed(() => {
    return this.productService.loading();
  })
  // Long press state management
  private longPressTimer: any;
  private isLongPressActive = false;
  private readonly LONG_PRESS_DURATION = 200; // milliseconds

  nameColeccion = 'BREATheDivinity';
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.fetchProducts();
    this.productService.fetchCollections(); // Asegurarnos de tener las colecciones cargadas
  }

  openProductModal(product: Product) {
    if (product.variants && product.variants.length > 0) {
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
    if (!product.variants || product.variants.length === 0) return 'Agotado';
    const availableVariants = product.variants.filter(v => v.stock > 0).length;
    if (availableVariants === 0) {
      return 'AGOTADO';
    } else if (availableVariants === 1) {
      return 'CASI AGOTADO';
    }
    return 'Disponible por tiempo limitado.';
  }
}