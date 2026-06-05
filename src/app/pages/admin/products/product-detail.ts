import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { SupabaseService } from '../../services/supabase.service';
import { Product, ProductVariant } from '../../models/product';
import { NotificationService } from '../../services/notification.service';

interface ValidationErrors {
  name?: string;
  price?: string;
  images?: string;
  variants?: string;
}

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (isLoading()) {
      <div class="space-y-12">
        <div class="flex items-center justify-between border-b border-white/5 pb-8">
          <div class="flex items-center gap-6">
            <div class="w-12 h-12 rounded-2xl bg-white/5 shimmer"></div>
            <div class="space-y-3">
              <div class="w-24 h-3 bg-white/5 shimmer rounded"></div>
              <div class="w-64 h-10 bg-white/5 shimmer rounded-xl"></div>
            </div>
          </div>
          <div class="w-40 h-12 bg-white/5 shimmer rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-8">
            <div class="h-[600px] rounded-[2.5rem] bg-white/5 shimmer"></div>
          </div>
          <div class="lg:col-span-4 space-y-8">
            <div class="h-[400px] rounded-[2.5rem] bg-white/5 shimmer"></div>
            <div class="h-[200px] rounded-[2.5rem] bg-white/5 shimmer"></div>
          </div>
        </div>
      </div>
    } @else if (product(); as prod) {
      <div class="space-y-10 reveal">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div class="flex items-center gap-6">
            <a routerLink=".." class="w-12 h-12 flex items-center justify-center rounded-2xl glass hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all group">
              <i class="ti ti-arrow-narrow-left text-2xl group-hover:-translate-x-1 transition-transform"></i>
            </a>
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span class="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                  {{isNew ? 'Draft' : 'Active Product'}}
                </span>
                <p class="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Gestión de Inventario</p>
              </div>
              <h1 class="text-4xl font-black text-white tracking-tighter uppercase font-display leading-none">
                {{isNew ? 'NUEVO PRODUCTO' : prod.name}}
              </h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            @if (!isNew) {
              <button (click)="deleteCurrentProduct()" 
                class="px-6 py-3 rounded-2xl text-[11px] font-bold tracking-widest uppercase text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all">
                Eliminar
              </button>
            }
            <button (click)="saveChanges()" class="btn-premium">
              <span class="flex items-center gap-2 text-[11px] tracking-widest uppercase">
                <i class="ti ti-device-floppy text-lg"></i>
                {{isNew ? 'Crear Producto' : 'Guardar Cambios'}}
              </span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Column: Main Data -->
          <div class="lg:col-span-8 space-y-8">
            <section class="glass-card p-10 rounded-[2.5rem] space-y-8">
              <div class="flex items-center gap-3 border-b border-white/5 pb-6">
                <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <i class="ti ti-info-circle text-zinc-400"></i>
                </div>
                <h3 class="text-sm font-bold text-white tracking-widest uppercase font-display">Detalles Generales</h3>
              </div>
              
              <!-- Validation Summary -->
              @if (showValidation() && validationErrors().length > 0) {
                <div class="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-2">
                  <i class="ti ti-alert-circle text-red-500 text-lg flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p class="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Corrige los siguientes errores antes de guardar:</p>
                    <ul class="space-y-1">
                      @for (err of validationErrors(); track err) {
                        <li class="text-[10px] text-red-400/80">• {{err}}</li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-bold uppercase tracking-widest ml-1"
                         [class.text-red-500]="showValidation() && !prod.name.trim()"
                         [class.text-zinc-500]="!(showValidation() && !prod.name.trim())">
                    Nombre del Producto <span class="text-red-500">*</span>
                  </label>
                  <input type="text" [(ngModel)]="prod.name"
                         [class.border-red-500/50]="showValidation() && !prod.name.trim()"
                         [class.ring-4]="showValidation() && !prod.name.trim()"
                         [class.ring-red-500/10]="showValidation() && !prod.name.trim()"
                         class="admin-input" placeholder="Ej: Black Tech Jacket">
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Slug / URL Amigable</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">nyxor.fit/p/</span>
                    <input type="text" [(ngModel)]="prod.slug" class="admin-input pl-24" placeholder="black-tech-jacket">
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-bold uppercase tracking-widest ml-1"
                         [class.text-red-500]="showValidation() && !(prod.base_price > 0)"
                         [class.text-zinc-500]="!(showValidation() && !(prod.base_price > 0))">
                    Precio Base (S/.) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">S/.</span>
                    <input type="number" [(ngModel)]="prod.base_price" min="0"
                           [class.border-red-500/50]="showValidation() && !(prod.base_price > 0)"
                           class="admin-input pl-10" placeholder="0.00">
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Estado de Disponibilidad</label>
                  <select [(ngModel)]="prod.is_available" class="admin-input appearance-none">
                    <option [ngValue]="true">Disponible en Tienda</option>
                    <option [ngValue]="false">Agotado / Oculto</option>
                  </select>
                </div>
                <div class="space-y-3 md:col-span-2">
                  <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Colección / Drop</label>
                  <select [(ngModel)]="prod.collection_id" class="admin-input appearance-none">
                    <option [ngValue]="null">General / Sin Colección</option>
                    @for (col of collections(); track col.id) {
                      <option [ngValue]="col.id">{{col.name}}</option>
                    }
                  </select>
                </div>
                <div class="space-y-3 md:col-span-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest ml-1"
                         [class.text-red-500]="showValidation() && !prod.description.trim()"
                         [class.text-zinc-500]="!(showValidation() && !prod.description.trim())">
                    Descripción de la Pieza <span class="text-red-500">*</span>
                  </label>
                  <textarea [(ngModel)]="prod.description" rows="5"
                            [class.border-red-500/50]="showValidation() && !prod.description.trim()"
                            class="admin-input resize-none" placeholder="Escribe los detalles, materiales y fit del producto..."></textarea>
                </div>
              </div>
            </section>

            <!-- Variant Manager -->
            <section class="glass-card p-10 rounded-[2.5rem] space-y-8">
              <div class="flex items-center justify-between border-b border-white/5 pb-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <i class="ti ti-box-model-2 text-zinc-400"></i>
                  </div>
                  <h3 class="text-sm font-bold text-white tracking-widest uppercase font-display">Variantes de Tallas</h3>
                </div>
                <button (click)="addVariant()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                  <i class="ti ti-plus text-red-500"></i>
                  Añadir Talla
                </button>
              </div>
              
              <div class="space-y-4">
                @if (variants().length === 0) {
                  <div class="py-12 text-center bg-white/[0.02] border border-dashed border-white/5 rounded-3xl">
                    <p class="text-zinc-600 text-xs">No hay variantes registradas. Añade una para gestionar el stock.</p>
                  </div>
                }
                
                @for (variant of variants(); track variant.id || i; let i = $index) {
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-end p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all group reveal">
                    <div class="space-y-2">
                      <label class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Talla</label>
                      <input type="text" [(ngModel)]="variant.size" class="admin-input-small" placeholder="M, XL, OS...">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Stock</label>
                      <input type="number" [(ngModel)]="variant.stock" class="admin-input-small">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">SKU</label>
                      <input type="text" [(ngModel)]="variant.sku" class="admin-input-small" placeholder="SKU-CODE">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Price Override</label>
                      <input type="number" [(ngModel)]="variant.price_override" class="admin-input-small" placeholder="Opcional">
                    </div>
                    <div class="flex items-center justify-end gap-2 pb-1">
                      <button (click)="moveVariant(i, -1)" [disabled]="i === 0" class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all">
                        <i class="ti ti-chevron-up"></i>
                      </button>
                      <button (click)="moveVariant(i, 1)" [disabled]="i === variants().length - 1" class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all">
                        <i class="ti ti-chevron-down"></i>
                      </button>
                      <button (click)="removeVariant(i)" class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </section>
          </div>

          <!-- Right Column: Media -->
          <div class="lg:col-span-4 space-y-8">
            <section class="glass-card p-10 rounded-[2.5rem] space-y-8">
              <div class="flex items-center gap-3 border-b border-white/5 pb-6">
                <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <i class="ti ti-photo text-zinc-400"></i>
                </div>
                <h3 class="text-sm font-bold text-white tracking-widest uppercase font-display">Galería de Medios</h3>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                @for (img of prod.images || []; track img; let i = $index) {
                  <div class="relative group aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                    <img [src]="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button (click)="removeImage(i)" class="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:scale-110 transition-transform">
                        <i class="ti ti-trash-x text-lg"></i>
                      </button>
                    </div>
                    <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-[8px] font-black uppercase text-white border border-white/10">
                      Img #{{i + 1}}
                    </div>
                  </div>
                }
                
                <input #fileInput type="file" accept="image/*" multiple style="display:none" (change)="onFileSelected($event)">
                
                <button (click)="fileInput.click()" [disabled]="isUploading()"
                  class="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 transition-all group"
                  [class]="isUploading() ? 'bg-red-500/5 border-red-500/20 cursor-wait' : 'hover:bg-white/[0.02] hover:border-zinc-700'">
                  <div class="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i [class]="isUploading() ? 'ti ti-loader-2 animate-spin text-red-500' : 'ti ti-cloud-upload text-zinc-500 group-hover:text-white'" class="text-2xl"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white">{{isUploading() ? 'Subiendo...' : 'Subir Medios'}}</p>
                    <p class="text-[8px] text-zinc-700 mt-1 uppercase">PNG, JPG hasta 5MB</p>
                  </div>
                </button>
              </div>
            </section>

            <!-- Status Widget -->
            <section class="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent">
               <div class="flex items-center justify-between mb-6">
                  <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Información de Sistema</p>
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               </div>
               <div class="space-y-4">
                  <div class="flex items-center justify-between py-3 border-b border-white/5">
                     <span class="text-[10px] text-zinc-400">Creado el</span>
                     <span class="text-[10px] font-mono text-zinc-500">{{prod.created_at | date:'dd/MM/yyyy HH:mm'}}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b border-white/5">
                     <span class="text-[10px] text-zinc-400">Variantes</span>
                     <span class="text-[10px] font-mono text-zinc-500">{{variants().length}} tallas</span>
                  </div>
                  <div class="flex items-center justify-between py-3">
                     <span class="text-[10px] text-zinc-400">Stock Total</span>
                     <span class="text-[10px] font-mono text-white px-2 py-0.5 rounded bg-white/5">{{totalStock()}} uds.</span>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-zinc-500 text-center py-20 uppercase font-bold tracking-widest">
        Producto no encontrado o error al cargar
      </div>
    }
  `,
  styles: [`
    .admin-input {
      @apply w-full bg-zinc-900/50 border border-white/5 text-white px-5 py-4 rounded-2xl text-sm focus:border-red-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-zinc-700 font-medium shadow-inner;
    }
    .admin-input-small {
      @apply w-full bg-zinc-900/80 border border-white/5 text-white px-4 py-3 rounded-xl text-xs focus:border-red-500/50 outline-none transition-all placeholder:text-zinc-800 font-semibold;
    }
    select.admin-input {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1.2em;
    }
  `]
})
export class AdminProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  supabase = inject(SupabaseService).client;
  notify = inject(NotificationService);

  product = signal<Product | null>(null);
  variants = signal<Partial<ProductVariant>[]>([]);
  collections = signal<any[]>([]);
  isUploading = signal(false);
  isLoading = signal(true);
  showValidation = signal(false);
  isNew = false;

  totalStock = computed(() => {
    return this.variants().reduce((sum, v) => sum + (v.stock || 0), 0);
  });

  /** Returns a list of human-readable validation error messages */
  validationErrors = computed((): string[] => {
    const prod = this.product();
    const errors: string[] = [];
    if (!prod) return errors;

    if (!prod.name?.trim()) {
      errors.push('El nombre del producto es obligatorio.');
    }
    if (!prod.base_price || prod.base_price <= 0) {
      errors.push('El precio base debe ser mayor a S/. 0.');
    }
    if (!prod.description?.trim()) {
      errors.push('La descripción es obligatoria.');
    }
    if (!prod.images || prod.images.length === 0) {
      errors.push('Debes subir al menos una imagen del producto.');
    }
    if (this.variants().length === 0) {
      errors.push('Debes añadir al menos una variante de talla con stock.');
    } else {
      const hasEmptySize = this.variants().some(v => !v.size?.trim());
      if (hasEmptySize) errors.push('Todas las variantes deben tener una talla asignada.');
    }
    return errors;
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew = !id || id === 'new';

    try {
      // 1. Iniciar fetch de colecciones de inmediato (no bloqueante para el estado inicial)
      const collectionsPromise = this.supabase.from('collections').select('*').order('name');

      if (this.isNew) {
        // 2. Si es nuevo, inicializar objeto de producto de inmediato para mostrar el form
        this.product.set({
          id: '',
          name: 'Nuevo Producto',
          slug: '',
          description: '',
          images: [],
          base_price: 0,
          is_available: true,
          collection_id: null,
          created_at: new Date().toISOString(),
          variants: []
        } as any);
        this.isLoading.set(false);

        // Cargar colecciones en segundo plano
        const { data: cols } = await collectionsPromise;
        this.collections.set(cols || []);
      } else {
        // 3. Si es edición, cargar producto y colecciones en paralelo
        const productPromise = this.supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('id', id)
          .single();

        const [colsResult, prodResult] = await Promise.all([collectionsPromise, productPromise]);

        this.collections.set(colsResult.data || []);
        
        if (prodResult.error) throw prodResult.error;

        if (prodResult.data) {
          const loadedProduct = prodResult.data as unknown as Product;
          if (!loadedProduct.images) {
            loadedProduct.images = [];
          }
          this.product.set(loadedProduct);
          const v = prodResult.data.product_variants || [];
          this.variants.set(v.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)));
        } else {
          throw new Error('Producto no encontrado');
        }
      }
    } catch (e: any) {
      console.error('Error en ngOnInit:', e);
      this.notify.error('Error al cargar datos: ' + (e.message || 'Error desconocido'));
      // Si falla, al menos dejamos de cargar para no quedar en shimmer infinito
      if (!this.product()) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteCurrentProduct() {
    const prod = this.product();
    if (!prod?.id) return;
    if (confirm('¿Estás seguro de eliminar este producto permanentemente?')) {
      try {
        await this.productService.deleteProduct(prod.id);
        this.notify.success('Producto eliminado');
        this.router.navigate(['..'], { relativeTo: this.route });
      } catch (e) {
        this.notify.error('No se pudo eliminar el producto');
      }
    }
  }

  addVariant() {
    this.variants.set([...this.variants(), {
      size: '',
      stock: 0,
      sku: '',
      price_override: undefined,
      order_index: this.variants().length
    }]);
  }

  removeVariant(index: number) {
    const current = [...this.variants()];
    current.splice(index, 1);
    this.variants.set(current);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.isUploading.set(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(input.files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `products/${fileName}`;

      const { error } = await this.supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) {
        alert(`Error subiendo ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = this.supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      uploadedUrls.push(urlData.publicUrl);
    }

    const prod = this.product();
    if (prod && uploadedUrls.length > 0) {
      this.product.set({
        ...prod,
        images: [...(prod.images || []), ...uploadedUrls]
      });
    }
    this.isUploading.set(false);
    input.value = ''; // Reset input for re-use
  }

  moveVariant(index: number, direction: number) {
    const current = [...this.variants()];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < current.length) {
      [current[index], current[newIndex]] = [current[newIndex], current[index]];
      // Update order_index
      current.forEach((v, i) => v.order_index = i);
      this.variants.set(current);
    }
  }

  removeImage(index: number) {
    const prod = this.product();
    if (prod) {
      const updatedImages = [...(prod.images || [])];
      updatedImages.splice(index, 1);
      this.product.set({
        ...prod,
        images: updatedImages
      });
    }
  }

  async saveChanges() {
    const prod = this.product();
    if (!prod) return;

    // Trigger visual validation
    this.showValidation.set(true);

    // Block if there are errors
    if (this.validationErrors().length > 0) {
      this.notify.error('Corrige los errores del formulario antes de guardar.');
      // Scroll to top of form to show the error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const productPayload = {
      name: prod.name,
      slug: prod.slug || prod.name.toLowerCase().replace(/\s+/g, '-'),
      description: prod.description,
      images: prod.images || [],
      base_price: prod.base_price,
      collection_id: prod.collection_id
    };

    if (this.isNew) {
      // INSERT new product
      const { data: newProd, error: pError } = await this.supabase
        .from('products')
        .insert(productPayload)
        .select()
        .single();

      if (pError) { this.notify.error('Error al crear: ' + pError.message); return; }

      // Insert variants for new product
      if (this.variants().length > 0) {
        const variantsToSave = this.variants().map(v => {
          const cleanV = { ...v, product_id: newProd.id };
          if (!cleanV.id) delete cleanV.id;
          return cleanV;
        });
        
        try {
          const { error: vError } = await this.supabase.from('product_variants').insert(variantsToSave);
          if (vError) throw vError;
        } catch (err: any) {
          this.notify.error('Error en tallas: ' + err.message);
        }
      }

      this.notify.success('¡Producto creado con éxito!');
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    // UPDATE existing product
    const { error: pError } = await this.supabase
      .from('products')
      .update(productPayload)
      .eq('id', prod.id);

    const variantsToSave = this.variants().map(v => {
      const cleanV = { ...v, product_id: prod.id };
      if (!cleanV.id) delete cleanV.id; // Evitar error de constraint por ID nulo
      return cleanV;
    });

    try {
      const { error: vError } = await this.supabase.from('product_variants').upsert(variantsToSave);
      if (vError) throw vError;
      
      if (!pError) { 
        this.notify.success('¡Cambios guardados con éxito!');
        this.ngOnInit(); // Recargar para obtener los nuevos IDs
      }
    } catch (err: any) {
      this.notify.error('Error en variantes: ' + err.message);
    }
  }
}
