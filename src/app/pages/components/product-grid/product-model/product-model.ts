import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, signal, computed } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem, Product, ProductVariant } from '../../../models/product';
import { CartService } from '../../../services/cart';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        (click)="onClose()"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden overflow-y-auto min-h-[350px]"
          (click)="$event.stopPropagation()"
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (touchend)="onTouchEnd()"
          [style.transform]="modalTransform()"
          [style.transition]="isDragging() ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'"
          [class.animate-slide-up]="!isDragging() && !modalTransform()"
        >
          <!-- Close Button -->
          <button
            class="ti ti-x absolute top-4 right-4 z-10 text-white md:text-black w-[25px] h-[25px] hover:bg-white rounded-full p-2 shadow-lg transition-all"
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
                [src]="selectedImage()"
                [alt]="product?.name"
                class="w-full h-full object-cover"
              >
              <!-- Lupa con glassmorphism -->
              @if (isZooming()) {
                <div
                  class="absolute w-24 h-24 border border-white/60 rounded-full pointer-events-none backdrop-blur-md bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform duration-75 ease-out"
                  [style.left.px]="lensX()"
                  [style.top.px]="lensY()"
                  [style.backgroundImage]="'url(' + selectedImage() + ')'"
                  [style.backgroundSize]="backgroundSize"
                  [style.backgroundPosition]="backgroundPosition()"
                  style="transform: translate(-50%, -50%);"
                ></div>
              }
              <!-- Image Thumbnails -->
              @if (product?.images) {
                <div class="absolute bottom-4 left-4 flex space-x-2">
                  @for (img of product?.images; track img; let i = $index) {
                    <button
                      class="w-12 h-12 rounded border-2 overflow-hidden transition-all"
                      [class.border-blue-500]="selectedImage() === img"
                      [class.border-gray-300]="selectedImage() !== img"
                      (click)="selectImage(img)"
                    >
                      <img [src]="img" [alt]="product?.name" class="w-full h-full object-cover">
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Details -->
            <div class="p-8 flex flex-col justify-between max-h-fit overflow-y-auto">
              <div>
                <!-- Brand -->
                <div class="text-sm text-gray-500 mb-2">NYXOR FIT</div>

                <!-- Product Name -->
                <h2 class="text-[18px] md:text-3xl font-bold text-gray-900 mb-4">{{product?.name}}</h2>

                <!-- Price -->
                <div class="flex items-center gap-4 mb-6">
                  <div class="flex flex-col">
                    @if (product?.discount_percent) {
                      <span class="text-gray-400 line-through text-xs mb-1">
                        S/. {{currentPrice() | number:'1.2-2'}}
                      </span>
                    }
                    <span class="text-2xl md:text-4xl font-black text-red-600 tracking-tighter">
                      S/. {{ discountedPrice() | number:'1.2-2' }}
                    </span>
                  </div>
                  @if (product?.discount_percent) {
                    <span class="bg-red-600 text-white text-[10px] px-2 py-1 font-black uppercase tracking-widest">
                      {{product?.discount_percent}}% OFF
                    </span>
                  }
                </div>

                <!-- Description -->
                <div class="mb-6">
                  <p
                    class="text-[14px] md:text-base text-gray-600 overflow-hidden whitespace-pre-line transition-all duration-300"
                    [class.line-clamp-3]="!showFullDescription()"
                  >{{product?.description}}</p>
                  @if ((product?.description?.length ?? 0) > 120) {
                    <button
                      (click)="showFullDescription.set(!showFullDescription())"
                      class="text-[11px] font-black text-red-600 uppercase tracking-widest hover:underline mt-1"
                    >
                      {{ showFullDescription() ? 'Ver menos ▲' : 'Ver más ▼' }}
                    </button>
                  }
                </div>

                <!-- Size Selection -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-sm font-medium text-gray-700">Talla</label>
                    <button (click)="showSizeGuide.set(!showSizeGuide())" class="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">
                      ¿Cuál es mi talla?
                    </button>
                  </div>

                  <!-- Smart Size Calculator -->
                  @if (showSizeGuide()) {
                    <div class="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 mb-6 animate-fade-in shadow-2xl">
                      <div class="flex items-center gap-2 mb-4">
                        <i class="ti ti-calculator text-red-600"></i>
                        <p class="text-[9px] font-black text-white uppercase tracking-[0.2em]">Calculadora de Talla Inteligente</p>
                      </div>

                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="space-y-1.5">
                          <label class="text-[8px] text-gray-500 uppercase font-black tracking-widest">Altura (cm)</label>
                          <input
                            type="number"
                            [ngModel]="userHeight()"
                            (ngModelChange)="userHeight.set($event)"
                            placeholder="175"
                            class="w-full bg-white/5 border border-white/10 text-white text-xs p-3 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
                          >
                        </div>
                        <div class="space-y-1.5">
                          <label class="text-[8px] text-gray-500 uppercase font-black tracking-widest">Peso (kg)</label>
                          <input
                            type="number"
                            [ngModel]="userWeight()"
                            (ngModelChange)="userWeight.set($event)"
                            placeholder="75"
                            class="w-full bg-white/5 border border-white/10 text-white text-xs p-3 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
                          >
                        </div>
                      </div>

                      <!-- Fit Preference Selector -->
                      <div class="space-y-1.5 mb-4">
                        <label class="text-[8px] text-gray-500 uppercase font-black tracking-widest block">Estilo de Ajuste Deseado</label>
                        <div class="grid grid-cols-3 gap-2">
                          <button
                            (click)="fitPreference.set('slim')"
                            [class.border-red-600]="fitPreference() === 'slim'"
                            [class.bg-red-600]="fitPreference() === 'slim'"
                            [class.text-white]="fitPreference() === 'slim'"
                            [class.border-white/10]="fitPreference() !== 'slim'"
                            [class.text-gray-400]="fitPreference() !== 'slim'"
                            class="px-2 py-2 border text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                          >
                            Ajustado
                          </button>
                          <button
                            (click)="fitPreference.set('regular')"
                            [class.border-red-600]="fitPreference() === 'regular'"
                            [class.bg-red-600]="fitPreference() === 'regular'"
                            [class.text-white]="fitPreference() === 'regular'"
                            [class.border-white/10]="fitPreference() !== 'regular'"
                            [class.text-gray-400]="fitPreference() !== 'regular'"
                            class="px-2 py-2 border text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                          >
                            Regular
                          </button>
                          <button
                            (click)="fitPreference.set('oversized')"
                            [class.border-red-600]="fitPreference() === 'oversized'"
                            [class.bg-red-600]="fitPreference() === 'oversized'"
                            [class.text-white]="fitPreference() === 'oversized'"
                            [class.border-white/10]="fitPreference() !== 'oversized'"
                            [class.text-gray-400]="fitPreference() !== 'oversized'"
                            class="px-2 py-2 border text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                          >
                            Oversized
                          </button>
                        </div>
                      </div>

                      @if (recommendedSize()) {
                        <div class="bg-red-600 text-white p-4 rounded-lg text-center animate-slide-up">
                          <p class="text-[8px] uppercase tracking-[0.3em] font-black text-white/80 mb-1">Tu talla ideal es</p>
                          <p class="text-3xl font-black tracking-tighter">TALLA {{recommendedSize()}}</p>
                          <p class="text-[8px] mt-1 text-white/60 uppercase font-bold">Ajuste recomendado para Streetwear</p>
                        </div>
                      }

                      <p class="text-[7px] text-gray-600 mt-4 text-center uppercase tracking-widest italic">
                        *Basado en tus medidas y el estilo de ajuste seleccionado
                      </p>
                    </div>
                  }

                  <div class="flex flex-wrap gap-2">
                    @for (variant of product?.variants; track variant.id) {
                      <button
                        class="px-4 py-2 border rounded-md font-medium transition-all"
                        [disabled]="variant.stock === 0"
                        [ngClass]="{
                          'line-through text-gray-400 bg-gray-50 cursor-not-allowed border-gray-200 opacity-50': variant.stock === 0,
                          'border-gray-200 text-black bg-white shadow-sm hover:border-black font-bold': variant.stock > 0 && selectedVariant()?.id !== variant.id,
                          'border-black bg-black text-white scale-105 shadow-md': selectedVariant()?.id === variant.id
                        }"
                        (click)="variant.stock > 0 ? selectVariant(variant) : null"
                      >
                        {{variant.size}}
                      </button>
                    }
                  </div>
                  @if (selectedVariant()) {
                    <p class="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                      Stock disponible: {{selectedVariant()!.stock}} uds.
                    </p>
                  }
                </div>

                <!-- Quantity -->
                <div class="mb-8">
                  <label class="block text-sm font-medium text-gray-700 mb-3">Cantidad</label>
                  <div class="flex items-center border border-gray-300 rounded-md w-32">
                    <button
                      class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      (click)="decrementQuantity()"
                      [disabled]="quantity() <= 1"
                    >
                      -
                    </button>
                    <span class="flex-1 px-3 py-2 text-center text-primary text-sm font-bold">{{quantity()}}</span>
                    <button
                      class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      (click)="incrementQuantity()"
                      [disabled]="!selectedVariant() || quantity() >= selectedVariant()!.stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-4">
                @if (errorMessage()) {
                  <div class="text-red-600 text-[10px] font-bold uppercase mb-2">{{errorMessage()}}</div>
                }

                <button
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-md transition-all disabled:opacity-50"
                  (click)="addToCart()"
                  [disabled]="!selectedVariant() || loading()"
                >
                  {{ loading() ? 'AGREGANDO...' : 'AGREGAR AL CARRITO' }}
                </button>

                <button
                  class="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-md transition-all"
                  (click)="buyNow()"
                  [disabled]="!selectedVariant()"
                >
                  CONSULTAR POR WHATSAPP
                </button>
              </div>

              <!-- Related Products Section -->
              @if (relatedProducts().length > 0) {
                <div class="mt-12 pt-8 border-t border-gray-100">
                  <h3 class="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-6">Completa tu Look</h3>
                  <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    @for (rel of relatedProducts(); track rel.id) {
                      <div (click)="switchProduct(rel)" class="flex-shrink-0 w-32 cursor-pointer group">
                        <div class="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                          <img [src]="rel.images[0]" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <p class="text-[9px] font-bold uppercase truncate">{{rel.name}}</p>
                        <p class="text-[9px] text-red-600 font-black">S/. {{rel.base_price | number:'1.2-2'}}</p>
                      </div>
                    }
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductModalComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  // All mutable state as Signals
  selectedImage = signal('');
  selectedVariant = signal<ProductVariant | null>(null);
  quantity = signal(1);
  loading = signal(false);
  errorMessage = signal('');
  showSizeGuide = signal(false);
  showFullDescription = signal(false);

  // Zoom state
  isZooming = signal(false);
  lensX = signal(0);
  lensY = signal(0);
  backgroundSize = '500%';
  backgroundPosition = signal('center');

  // Size guide inputs
  userHeight = signal<number | null>(null);
  userWeight = signal<number | null>(null);
  fitPreference = signal<'slim' | 'regular' | 'oversized'>('regular');

  // Swipe Gestures
  touchStartY = 0;
  touchCurrentY = 0;
  modalTransform = signal('');
  isDragging = signal(false);

  recommendedSize = computed(() => {
    const height = this.userHeight();
    const weight = this.userWeight();
    if (!height || !weight) return null;
    const bmi = weight / ((height / 100) ** 2);
    
    // Baseline size
    let baseSize: 'S' | 'M' | 'L' | 'XL' = 'M';
    if (height < 165) {
      baseSize = bmi < 22 ? 'S' : 'M';
    } else if (height < 175) {
      baseSize = bmi < 24 ? 'M' : 'L';
    } else if (height < 185) {
      baseSize = bmi < 26 ? 'L' : 'XL';
    } else {
      baseSize = 'XL';
    }

    // Shift based on fit preference
    const sizes: ('S' | 'M' | 'L' | 'XL')[] = ['S', 'M', 'L', 'XL'];
    const index = sizes.indexOf(baseSize);
    
    if (this.fitPreference() === 'slim' && index > 0) {
      return sizes[index - 1];
    } else if (this.fitPreference() === 'oversized' && index < sizes.length - 1) {
      return sizes[index + 1];
    }
    return baseSize;
  });

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  relatedProducts = computed(() => {
    if (!this.product || !this.product.collection_id) return [];
    return this.productService.products().filter(p =>
      p.collection_id === this.product?.collection_id && p.id !== this.product?.id
    ).slice(0, 4);
  });

  currentPrice = computed(() => {
    return this.selectedVariant()?.price_override ?? this.product?.base_price ?? 0;
  });

  discountedPrice = computed(() => {
    const price = this.currentPrice();
    const discount = this.product?.discount_percent ?? 0;
    return discount > 0 ? price * (1 - discount / 100) : price;
  });

  ngOnInit() {
    this.initProduct();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.initProduct();
    }
  }

  initProduct() {
    if (this.product) {
      this.selectedImage.set(this.product.images?.[0] ?? '');
      this.quantity.set(1);
      this.showSizeGuide.set(false);
      this.showFullDescription.set(false);
      this.errorMessage.set('');
      this.userHeight.set(null);
      this.userWeight.set(null);
      this.fitPreference.set('regular');

      if (this.product.variants && this.product.variants.length > 0) {
        this.selectedVariant.set(this.product.variants[0]);
      } else {
        this.selectedVariant.set(null);
      }
    }
  }

  switchProduct(newProduct: Product) {
    this.product = newProduct;
    this.initProduct();
    const modalContent = document.querySelector('.relative.bg-white.rounded-lg');
    if (modalContent) modalContent.scrollTop = 0;
  }

  onClose() {
    this.close.emit();
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  selectVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
    this.quantity.set(1);
  }

  incrementQuantity() {
    const v = this.selectedVariant();
    if (v && this.quantity() < v.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  async addToCart() {
    const variant = this.selectedVariant();
    if (this.product && variant) {
      this.loading.set(true);
      this.errorMessage.set('');
      try {
        await this.cartService.addToCart(variant, this.product, this.quantity());
        this.onClose();
      } catch (e: any) {
        this.errorMessage.set(e.message);
      } finally {
        this.loading.set(false);
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const lensRadius = 100;
    const clampedX = Math.max(lensRadius, Math.min(x, rect.width - lensRadius));
    const clampedY = Math.max(lensRadius, Math.min(y, rect.height - lensRadius));
    this.lensX.set(clampedX);
    this.lensY.set(clampedY);
    this.isZooming.set(true);
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;
    this.backgroundPosition.set(`${posX}% ${posY}%`);
  }

  onMouseLeave() {
    this.isZooming.set(false);
  }

  buyNow() {
    const phone = "51942301601";
    const variant = this.selectedVariant();
    const message = `
🔥 *Hola*, estoy interesado en el siguiente producto:

🖤 *Producto:* ${this.product?.name}
💸 *Precio:* S/. ${this.discountedPrice().toFixed(2)}
📏 *Talla:* ${variant?.size}
🔢 *Cantidad:* ${this.quantity()}

¿Podrías darme más información, por favor?
`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // Swipe Gesture Handlers
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.isDragging.set(true);
  }

  onTouchMove(event: TouchEvent) {
    this.touchCurrentY = event.touches[0].clientY;
    const deltaY = this.touchCurrentY - this.touchStartY;
    if (deltaY > 0) {
      this.modalTransform.set(`translateY(${deltaY}px)`);
    }
  }

  onTouchEnd() {
    this.isDragging.set(false);
    const deltaY = this.touchCurrentY - this.touchStartY;
    if (deltaY > 150) {
      this.onClose();
    }
    this.modalTransform.set('');
    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }
}