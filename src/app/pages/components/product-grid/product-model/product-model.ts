import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CartItem, Product, ProductVariant } from '../../../models/product';
import { CartService } from '../../../services/cart';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
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
              <div class="text-sm text-gray-500 mb-2">NYXOR FIT</div>
              
              <!-- Product Name -->
              <h2 class="  text-[18px] md:text-3xl font-bold text-gray-900 mb-4">{{product?.name}}</h2>

              <!-- Price -->
              <div class="flex items-center gap-4 mb-6">
                <div class="flex flex-col">
                  <span *ngIf="product?.discount_percent" class="text-gray-400 line-through text-xs mb-1">
                    S/. {{currentPrice | number:'1.2-2'}}
                  </span>
                  <span class="text-2xl md:text-4xl font-black text-red-600 tracking-tighter">
                    S/. {{ (product?.discount_percent ? currentPrice * (1 - product!.discount_percent! / 100) : currentPrice) | number:'1.2-2' }}
                  </span>
                </div>
                <span 
                  *ngIf="product?.discount_percent"
                  class="bg-red-600 text-white text-[10px] px-2 py-1 font-black uppercase tracking-widest"
                >
                  {{product?.discount_percent}}% OFF
                </span>
              </div>

              <!-- Description -->
              <p class=" text-[14px] md:text-base text-gray-600 mb-6 ">{{product?.description}}</p>

              <!-- Size Selection -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">Talla</label>
                  <button (click)="showSizeGuide = !showSizeGuide" class="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">
                    ¿Cuál es mi talla?
                  </button>
                </div>

                <!-- Smart Size Calculator -->
                <div *ngIf="showSizeGuide" class="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 mb-6 animate-fade-in shadow-2xl">
                  <div class="flex items-center gap-2 mb-4">
                    <i class="ti ti-calculator text-red-600"></i>
                    <p class="text-[9px] font-black text-white uppercase tracking-[0.2em]">Calculadora de Talla Inteligente</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="space-y-1.5">
                      <label class="text-[8px] text-gray-500 uppercase font-black tracking-widest">Altura (cm)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="userHeight" 
                        placeholder="175" 
                        class="w-full bg-white/5 border border-white/10 text-white text-xs p-3 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
                      >
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-[8px] text-gray-500 uppercase font-black tracking-widest">Peso (kg)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="userWeight" 
                        placeholder="75" 
                        class="w-full bg-white/5 border border-white/10 text-white text-xs p-3 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
                      >
                    </div>
                  </div>

                  <div *ngIf="recommendedSize" class="bg-red-600 text-white p-4 rounded-lg text-center animate-slide-up">
                    <p class="text-[8px] uppercase tracking-[0.3em] font-black text-white/80 mb-1">Tu talla ideal es</p>
                    <p class="text-3xl font-black tracking-tighter">TALLA {{recommendedSize}}</p>
                    <p class="text-[8px] mt-1 text-white/60 uppercase font-bold">Ajuste recomendado para Streetwear</p>
                  </div>
                  
                  <p class="text-[7px] text-gray-600 mt-4 text-center uppercase tracking-widest italic">
                    *Basado en tus medidas y el corte de la prenda
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let variant of product?.variants"
                    class="px-4 py-2 border rounded-md font-medium transition-all"
                    [disabled]="variant.stock === 0"
                    [ngClass]="{
                      'line-through text-gray-400 bg-gray-50 cursor-not-allowed border-gray-200 opacity-50': variant.stock === 0,
                      'border-gray-200 text-black bg-white shadow-sm hover:border-black font-bold': variant.stock > 0 && selectedVariant?.id !== variant.id,
                      'border-black bg-black text-white scale-105 shadow-md': selectedVariant?.id === variant.id
                    }"
                    (click)="variant.stock > 0 ? selectVariant(variant) : null"
                  >
                    {{variant.size}}
                  </button>
                </div>
                <p *ngIf="selectedVariant" class="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                  Stock disponible: {{selectedVariant.stock}} uds.
                </p>
              </div>

              <!-- Quantity -->
              <div class="mb-8">
                <label class="block text-sm font-medium text-gray-700 mb-3">Cantidad</label>
                <div class="flex items-center border border-gray-300 rounded-md w-32">
                  <button 
                    class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
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
                    class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
                    (click)="incrementQuantity()"
                    [disabled]="!selectedVariant || quantity >= selectedVariant.stock"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <div *ngIf="errorMessage" class="text-red-600 text-[10px] font-bold uppercase mb-2">{{errorMessage}}</div>
              
              <button 
                class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-md transition-all disabled:opacity-50"
                (click)="addToCart()"
                [disabled]="!selectedVariant || loading"
              >
                {{ loading ? 'AGREGANDO...' : 'AGREGAR AL CARRITO' }}
              </button>
              
              <button 
                class="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-md transition-all"
                (click)="buyNow()"
                [disabled]="!selectedVariant"
              >
                CONSULTAR POR WHATSAPP
              </button>
            </div>

            <!-- Related Products Section -->
            <div *ngIf="relatedProducts.length > 0" class="mt-12 pt-8 border-t border-gray-100">
              <h3 class="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-6">Completa tu Look</h3>
              <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div *ngFor="let rel of relatedProducts" 
                     (click)="switchProduct(rel)"
                     class="flex-shrink-0 w-32 cursor-pointer group">
                  <div class="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                    <img [src]="rel.images[0]" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <p class="text-[9px] font-bold uppercase truncate">{{rel.name}}</p>
                  <p class="text-[9px] text-red-600 font-black">S/. {{rel.base_price | number:'1.2-2'}}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
}) export class ProductModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedImage = '';
  selectedVariant: ProductVariant | null = null;
  quantity = 1;
  loading = false;
  errorMessage = '';

  // Size Guide Logic
  showSizeGuide = false;
  userHeight: number | null = null;
  userWeight: number | null = null;

  get recommendedSize(): string | null {
    if (!this.userHeight || !this.userWeight) return null;

    // Lógica simple de recomendación (Streetwear/Oversized)
    const bmi = this.userWeight / ((this.userHeight / 100) ** 2);

    if (this.userHeight < 165) {
      return bmi < 22 ? 'S' : 'M';
    } else if (this.userHeight < 175) {
      return bmi < 24 ? 'M' : 'L';
    } else if (this.userHeight < 185) {
      return bmi < 26 ? 'L' : 'XL';
    } else {
      return 'XL';
    }
  }

  private productService = inject(ProductService);

  get relatedProducts(): Product[] {
    if (!this.product || !this.product.collection_id) return [];
    return this.productService.products().filter(p =>
      p.collection_id === this.product?.collection_id && p.id !== this.product?.id
    ).slice(0, 4);
  }

  switchProduct(newProduct: Product) {
    this.product = newProduct;
    this.initProduct();
    // Scroll modal to top
    const modalContent = document.querySelector('.relative.bg-white.rounded-lg');
    if (modalContent) modalContent.scrollTop = 0;
  }

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.initProduct();
  }

  initProduct() {
    if (this.product) {
      this.selectedImage = this.product.images[0];
      this.quantity = 1;
      this.showSizeGuide = false;
      this.userHeight = null;
      this.userWeight = null;

      if (this.product.variants && this.product.variants.length > 0) {
        this.selectedVariant = this.product.variants[0];
      }
    }
  }

  get currentPrice() {
    if (this.selectedVariant?.price_override) return this.selectedVariant.price_override;
    return this.product?.base_price ?? 0;
  }

  onClose() {
    this.close.emit();
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  selectVariant(variant: ProductVariant) {
    this.selectedVariant = variant;
    this.quantity = 1; // Reset quantity on variant change
  }

  incrementQuantity() {
    if (this.selectedVariant && this.quantity < this.selectedVariant.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCart() {
    if (this.product && this.selectedVariant) {
      this.loading = true;
      this.errorMessage = '';
      try {
        await this.cartService.addToCart(this.selectedVariant, this.product, this.quantity);
        this.onClose();
      } catch (e: any) {
        this.errorMessage = e.message;
      } finally {
        this.loading = false;
      }
    }
  }

  // --- ZOOM EFECTO LUPA INTENSO ---
  isZooming = false;
  lensX = 0;
  lensY = 0;
  backgroundSize = '500%';
  backgroundPosition = 'center';

  onMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const lensRadius = 100;
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
    const phone = "51942301601";
    const message = `
🔥 *Hola*, estoy interesado en el siguiente producto:  

🖤 *Producto:* ${this.product?.name}  
💸 *Precio:* S/. ${this.currentPrice.toFixed(2)}  
📏 *Talla:* ${this.selectedVariant?.size}  
🔢 *Cantidad:* ${this.quantity}  

¿Podrías darme más información, por favor?
`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }
}