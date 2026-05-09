import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { SupabaseService } from '../../services/supabase.service';
import { Product, ProductVariant } from '../../models/product';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-12" *ngIf="product; else loadingTmpl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-6">
        <div class="flex items-center gap-4">
          <a routerLink=".." class="text-gray-500 hover:text-white transition-colors">
            <i class="ti ti-arrow-left text-2xl"></i>
          </a>
          <div>
            <h1 class="text-4xl font-black text-white tracking-tighter uppercase">{{isNew ? 'NUEVO PRODUCTO' : product.name}}</h1>
            <p class="text-[10px] text-red-600 font-bold tracking-[0.2em] uppercase">{{isNew ? 'Crear nueva pieza' : 'Edición de Pieza & Variantes'}}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button *ngIf="!isNew" (click)="deleteCurrentProduct()" 
            class="bg-transparent border border-red-600 text-red-600 text-[10px] font-black px-6 py-3 tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
            Eliminar
          </button>
          <button (click)="saveChanges()" 
            class="bg-red-600 text-white text-[10px] font-black px-8 py-3 tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            {{isNew ? 'Crear Producto' : 'Guardar Todo'}}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Main Data -->
        <div class="lg:col-span-2 space-y-8">
          <section class="bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
            <h3 class="text-xs font-black text-white tracking-widest uppercase border-b border-white/5 pb-4">Detalles Generales</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre</label>
                <input type="text" [(ngModel)]="product.name" class="admin-input">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slug (URL)</label>
                <input type="text" [(ngModel)]="product.slug" class="admin-input">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Precio Base (S/.)</label>
                <input type="number" [(ngModel)]="product.base_price" class="admin-input" placeholder="0.00">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disponible</label>
                <select [(ngModel)]="product.is_available" class="admin-input">
                  <option [ngValue]="true">Sí</option>
                  <option [ngValue]="false">No</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Colección (Drop)</label>
                <select [(ngModel)]="product.collection_id" class="admin-input">
                  <option [ngValue]="null">Ninguna / General</option>
                  <option *ngFor="let col of collections()" [ngValue]="col.id">{{col.name}}</option>
                </select>
              </div>
              <div class="space-y-2 col-span-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Descripción</label>
                <textarea [(ngModel)]="product.description" rows="4" class="admin-input"></textarea>
              </div>
            </div>
          </section>

          <!-- Variant Manager -->
          <section class="bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
            <div class="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 class="text-xs font-black text-white tracking-widest uppercase">Variantes (Tallas & Stock)</h3>
              <button (click)="addVariant()" class="text-[10px] font-bold text-red-600 hover:text-white uppercase tracking-widest transition-colors">
                + Añadir Talla
              </button>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let variant of variants(); let i = index" 
                   class="grid grid-cols-5 gap-4 items-end bg-black/40 p-4 border border-white/5 hover:border-white/20 transition-all group">
                <div class="space-y-2">
                  <label class="text-[9px] font-bold text-gray-600 uppercase">Talla</label>
                  <input type="text" [(ngModel)]="variant.size" class="admin-input py-1 text-xs" placeholder="S, M, L...">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-bold text-gray-600 uppercase">Stock</label>
                  <input type="number" [(ngModel)]="variant.stock" class="admin-input py-1 text-xs">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-bold text-gray-600 uppercase">SKU</label>
                  <input type="text" [(ngModel)]="variant.sku" class="admin-input py-1 text-xs" placeholder="NX-V1-S">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-bold text-gray-600 uppercase">Precio Override</label>
                  <input type="number" [(ngModel)]="variant.price_override" class="admin-input py-1 text-xs" placeholder="Opcional">
                </div>
                <div class="flex items-center justify-end gap-3 pb-1">
                  <button (click)="moveVariant(i, -1)" [disabled]="i === 0" class="text-gray-600 hover:text-white disabled:opacity-0"><i class="ti ti-chevron-up"></i></button>
                  <button (click)="moveVariant(i, 1)" [disabled]="i === variants().length - 1" class="text-gray-600 hover:text-white disabled:opacity-0"><i class="ti ti-chevron-down"></i></button>
                  <button (click)="removeVariant(i)" class="text-gray-700 hover:text-red-600 transition-colors ml-2"><i class="ti ti-trash"></i></button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Media & Secondary -->
        <aside class="space-y-8">
          <section class="bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
            <h3 class="text-xs font-black text-white tracking-widest uppercase border-b border-white/5 pb-4">Imágenes</h3>
            <div class="grid grid-cols-2 gap-4">
              <div *ngFor="let img of product.images; let i = index" class="relative group aspect-square bg-black border border-white/10">
                <img [src]="img" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity">
                <button (click)="removeImage(i)" class="absolute top-2 right-2 bg-red-600 text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="ti ti-x"></i>
                </button>
              </div>
              <!-- Hidden file input -->
              <input #fileInput type="file" accept="image/*" multiple style="display:none"
                     (change)="onFileSelected($event)">
              <!-- Upload Button -->
              <button (click)="fileInput.click()" [disabled]="isUploading()"
                class="aspect-square border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all"
                [class]="isUploading() ? 'text-red-600 border-red-600/30 cursor-wait' : 'text-gray-600 hover:text-white hover:border-white'">
                <i [class]="isUploading() ? 'ti ti-loader-2 animate-spin text-2xl' : 'ti ti-plus text-2xl'"></i>
                <span class="text-[9px] font-bold uppercase tracking-widest mt-2">{{isUploading() ? 'Subiendo...' : 'Subir'}}</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <ng-template #loadingTmpl>
      <div class="space-y-12 animate-pulse">
        <!-- Header Shimmer -->
        <div class="flex items-center justify-between border-b border-white/10 pb-6">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-white/5 rounded-full shimmer"></div>
            <div class="space-y-2">
              <div class="w-48 h-8 bg-white/5 shimmer"></div>
              <div class="w-32 h-3 bg-white/5 shimmer"></div>
            </div>
          </div>
          <div class="w-32 h-10 bg-white/5 shimmer"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 space-y-8">
            <div class="h-[400px] bg-white/5 border border-white/10 shimmer"></div>
            <div class="h-[300px] bg-white/5 border border-white/10 shimmer"></div>
          </div>
          <div class="space-y-8">
            <div class="h-[300px] bg-white/5 border border-white/10 shimmer"></div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div *ngIf="!isLoading()" class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <i class="ti ti-alert-circle text-4xl text-red-600"></i>
        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">No se pudo encontrar el producto.</p>
        <a routerLink=".." class="text-[10px] font-black text-white uppercase tracking-widest border border-white/10 px-6 py-3 hover:bg-white hover:text-black transition-all">
          Volver a la lista
        </a>
      </div>
    </ng-template>
  `,
  styles: [`
    .admin-input {
      @apply w-full bg-black border border-white/10 text-white px-4 py-2 text-sm focus:border-red-600 outline-none transition-all placeholder:text-gray-800;
    }
  `]
})
export class AdminProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  supabase = inject(SupabaseService).client;
  notify = inject(NotificationService);

  product: Product | null = null;
  variants = signal<Partial<ProductVariant>[]>([]);
  collections = signal<any[]>([]);
  isUploading = signal(false);
  isLoading = signal(true);
  isNew = false;

  async ngOnInit() {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      
      // Fetch collections
      const { data: cols } = await this.supabase.from('collections').select('*').order('name');
      this.collections.set(cols || []);

      if (!id || id === 'new') {
        this.isNew = true;
        this.product = {
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
        } as any;
        this.isLoading.set(false);
        return;
      }

      const { data, error } = await this.supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        this.isLoading.set(false);
        return;
      }

      if (data) {
        this.product = data as unknown as Product;
        const v = data.product_variants || [];
        this.variants.set(v.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)));
      }
    } catch (e) {
      console.error('Unexpected error in ngOnInit:', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteCurrentProduct() {
    if (!this.product?.id) return;
    if (confirm('¿Estás seguro de eliminar este producto permanentemente?')) {
      try {
        await this.productService.deleteProduct(this.product.id);
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
    const current = this.variants();
    current.splice(index, 1);
    this.variants.set([...current]);
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

    if (this.product && uploadedUrls.length > 0) {
      this.product.images = [...(this.product.images || []), ...uploadedUrls];
    }
    this.isUploading.set(false);
    input.value = ''; // Reset input for re-use
  }

  moveVariant(index: number, direction: number) {
    const current = this.variants();
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < current.length) {
      [current[index], current[newIndex]] = [current[newIndex], current[index]];
      // Update order_index
      current.forEach((v, i) => v.order_index = i);
      this.variants.set([...current]);
    }
  }

  removeImage(index: number) {
    if (this.product) {
      this.product.images.splice(index, 1);
    }
  }

  async saveChanges() {
    if (!this.product) return;

    const productPayload = {
      name: this.product.name,
      slug: this.product.slug || this.product.name.toLowerCase().replace(/\s+/g, '-'),
      description: this.product.description,
      images: this.product.images,
      base_price: this.product.base_price,
      collection_id: this.product.collection_id
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
      .eq('id', this.product.id);

    const variantsToSave = this.variants().map(v => {
      const cleanV = { ...v, product_id: this.product?.id };
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
