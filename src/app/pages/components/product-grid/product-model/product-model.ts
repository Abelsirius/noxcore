import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CartItem, Product } from '../../../models/product';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div 
      *ngIf="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 "
      (click)="onClose()"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <!-- Modal Content -->
      <div 
        class="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up overflow-y-auto min-h-[350px]"
        (click)="$event.stopPropagation()"
      >
        <!-- Close Button -->
        <button 
          class=" ti ti-x absolute top-4 right-4 z-10 text-white md:text-black w-[25px] h-[25px] hover:bg-white rounded-full p-2 shadow-lg transition-all"
          (click)="onClose()"
        >
        
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          <!-- Product Image -->
          <div class="relative group h-[420px] lg:h-full bg-gray-100 overflow-hidden" 
              (mousemove)="onMouseMove($event)" 
    (mouseleave)="onMouseLeave()"
          >
            <img 
                #productImage
              [src]="selectedImage" 
              [alt]="product?.name"
              class="w-full h-full object-cover"
            >
               <!-- Lupa con glassmorphism -->
    <div
      *ngIf="isZooming"
      class="absolute w-24 h-24 border border-white/60 rounded-full pointer-events-none backdrop-blur-md bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform duration-75 ease-out"
      [style.left.px]="lensX"
      [style.top.px]="lensY"
      [style.backgroundImage]="'url(' + selectedImage + ')'"
      [style.backgroundSize]="backgroundSize"
      [style.backgroundPosition]="backgroundPosition"
      style="transform: translate(-50%, -50%);"
    ></div>
            <!-- Image Thumbnails -->
            <div 
              *ngIf="product?.images"
              class="absolute bottom-4 left-4 flex space-x-2"
            >
              <button 
                *ngFor="let img of product?.images; let i = index"
                class="w-12 h-12 rounded border-2 overflow-hidden transition-all"
                [class.border-blue-500]="selectedImage === img"
                [class.border-gray-300]="selectedImage !== img"
                (click)="selectImage(img)"
              >
                <img [src]="img" [alt]="product?.name" class="w-full h-full object-cover">
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-8 flex flex-col justify-between max-h-fit overflow-y-auto">
            <div>
              <!-- Brand -->
              <div class="text-sm text-gray-500 mb-2">NOXCORE</div>
              
              <!-- Product Name -->
              <h2 class="  text-[18px] md:text-3xl font-bold text-gray-900 mb-4">{{product?.name}}</h2>

              <!-- Price -->
              <div class="flex items-center space-x-4 mb-6">
                <span class="text-base md:text-3xl font-bold text-red-600">
                  S/. {{product?.price?.toFixed(2)}}
                </span>
                <span 
                  *ngIf="product?.originalPrice" 
                  class="text-xl text-gray-500 line-through"
                >
                  S/. {{product?.originalPrice?.toFixed(2)}}
                </span>
                <span 
                  *ngIf="product?.discount"
                  class="bg-red-500 text-white text-sm px-2 py-1 rounded font-bold"
                >
                  Oferta
                </span>
              </div>

              <!-- Description -->
              <p class=" text-[14px] md:text-base text-gray-600 mb-6 ">{{product?.description}}</p>

              <!-- Size Selection -->
<div class="mb-6">
  <label class="block text-sm font-medium text-gray-700 mb-3">Talla</label>
  <div class="flex flex-wrap gap-2">
    <button
      *ngFor="let sizeItem of product?.sizes"
      class="px-4 py-2 border rounded-md font-medium transition-all"
      
      [disabled]="!sizeItem.available"
      
      [ngClass]="{
        'line-through text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200': !sizeItem.available,
        
        'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500': sizeItem.available && selectedSize !== sizeItem.size,
        
        'border-red-500 bg-red-500 text-white': selectedSize === sizeItem.size
      }"

      (click)="sizeItem.available ? selectSize(sizeItem.size) : null"
    >
      {{sizeItem.size}}
    </button>
  </div>
</div>

              <!-- Quantity -->
              <div class="mb-8">
                <label class="block text-sm font-medium text-gray-700 mb-3">Cantidad</label>
                <div class="flex items-center border border-gray-300 rounded-md w-32">
                  <button 
                    class="px-3 py-2 text-gray-600 hover:text-gray-800"
                    (click)="decrementQuantity()"
                    [disabled]="quantity <= 1"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    [(ngModel)]="quantity" 
                    min="1"
                    class="flex-1 px-3 py-2 text-center border-0 focus:ring-0 text-primary"
                    readonly
                  >
                  <button 
                    class="px-3 py-2 text-gray-600 hover:text-gray-800"
                    (click)="incrementQuantity()"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <!-- <button 
                class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-md transition-all"
                (click)="addToCart()"
                [disabled]="!selectedSize"
              >
                Agregar al carrito
              </button> -->
              
              <button 
                class="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-md transition-all"
                (click)="buyNow()"
                [disabled]="!selectedSize"
              >
                Comprar por WhatsApp
              </button>

              <button class="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium">
                Ver todos los detalles →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  selectedImage = '';
  selectedSize = '';
  quantity = 1;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    if (this.product) {
      this.selectedImage = this.product.image;
    }
  }

  onClose() {
    this.close.emit();
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product && this.selectedSize) {
      const cartItem: CartItem = {
        product: this.product,
        size: this.selectedSize,
        quantity: this.quantity
      };
      this.cartService.addToCart(cartItem);
      this.onClose();
    }
  }
// --- ZOOM EFECTO LUPA INTENSO ---
isZooming = false;
lensX = 0;
lensY = 0;
backgroundSize = '500%'; // 🔥 zoom aumentado (antes era 250%)
backgroundPosition = 'center';

onMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lensRadius = 100; // 🔥 lupa más grande (antes era 60)
  const clampedX = Math.max(lensRadius, Math.min(x, rect.width - lensRadius));
  const clampedY = Math.max(lensRadius, Math.min(y, rect.height - lensRadius));

  this.lensX = clampedX;
  this.lensY = clampedY;
  this.isZooming = true;

  const posX = (x / rect.width) * 100;
  const posY = (y / rect.height) * 100;
  this.backgroundPosition = `${posX}% ${posY}%`;
}

onMouseLeave() {
  this.isZooming = false;
}
  buyNow() {
    this.addToCart();
    // Here you would typically redirect to checkout
   const phone = "51942301601"; // Tu número en formato internacional (ejemplo Perú: 51 + número)
const message = `
🔥 *Hola*, estoy interesado en el siguiente producto:  

🖤 *Producto:* ${this.product?.name}  
💸 *Precio:* S/. ${this.product?.price.toFixed(2)}  
📏 *Talla:* ${this.selectedSize}  
🔢 *Cantidad:* ${this.quantity}  

¿Podrías darme más información, por favor?
`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  }
}