import { Component, inject, OnInit, computed } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { ProductModalComponent } from "./product-model/product-model";
import { ProductCarouselComponent } from '../product-carousel/product-carousel';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    ProductModalComponent,
    ProductCarouselComponent
  ],
  template: `
    <!-- BLACK FRIDAY COLLECTION SECTION -->
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

    <!-- ORIGINAL STYLE COLLECTION SECTION -->
    @defer (on viewport) {
      <section class="py-16 bg-black" id="collection-shadow">
        <div class="container mx-auto">
          <app-product-carousel 
            [products]="products()" 
            [title]="'STYLE COLLECTION ' + nameColeccion.toUpperCase()" 
            themeColor="#ef4444"
            (productSelected)="openProductModal($event)"
          ></app-product-carousel>
        </div>
      </section>
    } @placeholder {
      <div class="py-32 text-center text-zinc-800 uppercase tracking-widest text-xs">Cargando colección...</div>
    }

    @defer (on viewport) {
      <section class="py-16 bg-black" id="collection-soon">
        <div class="container mx-auto">
          <app-product-carousel 
            [products]="proximamente()" 
            title="DROP PASADO – ÚLTIMAS UNIDADES" 
            themeColor="#ef4444"
            (productSelected)="openProductModal($event)"
          ></app-product-carousel>
        </div>
      </section>
    } @placeholder {
      <div class="py-32 text-center text-zinc-800 uppercase tracking-widest text-xs">Cargando colección...</div>
    }
    <!-- Product Modal -->
    @if (selectedProduct) {
      <app-product-modal
        [product]="selectedProduct"
        [isOpen]="isModalOpen"
        (close)="closeProductModal()"
      ></app-product-modal>
    }
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