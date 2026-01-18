import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { ProductModalComponent } from "./product-model/product-model";
import { MatDialog } from '@angular/material/dialog';
import { ProductCarouselComponent } from '../product-carousel/product-carousel';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    ProductModalComponent,
    ProductCarouselComponent
  ],
  template: `
    <!-- BLACK FRIDAY COLLECTION SECTION -->
    <section class="py-16 bg-black overflow-hidden" id="black-friday-collection">
      <div class="container mx-auto">
        <app-product-carousel 
          [products]="blackFridayProducts" 
          title="BLACK FRIDAY COLLECTION" 
          themeColor="#dc2626"
          (productSelected)="openProductModal($event)"
        ></app-product-carousel>
      </div>
    </section>

    <!-- ORIGINAL STYLE COLLECTION SECTION -->
    <section class="py-16 bg-black" id="collection-shadow">
      <div class="container mx-auto">
        <app-product-carousel 
          [products]="products" 
          [title]="'STYLE COLLECTION ' + nameColeccion.toUpperCase()" 
          themeColor="#ef4444"
          (productSelected)="openProductModal($event)"
        ></app-product-carousel>
      </div>
    </section>
    <section class="py-16 bg-black" id="collection-soon">
      <div class="container mx-auto">
        <app-product-carousel 
          [products]="proximamente" 
          title="DROP PASADO – ÚLTIMAS UNIDADES" 
          themeColor="#ef4444"
          (productSelected)="openProductModal($event)"
        ></app-product-carousel>
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
        // Filter out Black Friday products (ID 13, 14, 15, 16, 17)
        const blackFridayIds = ['13', '14', '15', '16', '17'];
        this.blackFridayProducts = products.filter(p => blackFridayIds.includes(p.id));
        this.products = products.filter(p => !blackFridayIds.includes(p.id));
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