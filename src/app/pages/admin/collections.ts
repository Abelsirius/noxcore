import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-admin-collections',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-8">
      <div class="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase">COLECCIONES</h1>
          <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Gestión de categorías y drops</p>
        </div>
      </div>

      <!-- Loading Shimmer -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white/5 border border-white/10 aspect-[16/10] shimmer"></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Collection Cards -->
          @for (col of collections(); track col.id) {
            <div class="relative bg-[#111] border border-white/10 group hover:border-red-600 transition-all overflow-hidden aspect-[16/10]">
              @if (col.image_url) {
                <img [src]="col.image_url" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity">
              }
              <div class="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                <h3 class="text-lg font-bold text-white uppercase tracking-tight">{{col.name}}</h3>
                <p class="text-[9px] text-gray-400 mt-1 uppercase tracking-[0.2em]">{{col.slug}}</p>

                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="deleteCollection(col.id)" class="text-gray-500 hover:text-red-600 transition-colors">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- New Collection Button -->
          @if (!isAdding()) {
            <div (click)="isAdding.set(true)"
                 class="border-2 border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all cursor-pointer aspect-[16/10]">
              <i class="ti ti-plus text-2xl mb-2"></i>
              <span class="text-[10px] font-bold uppercase tracking-widest">Nueva Colección</span>
            </div>
          } @else {
            <!-- New Collection Form -->
            <div class="relative bg-[#0a0a0a] border border-red-600/50 p-6 space-y-4 aspect-[16/10] overflow-hidden">
              <!-- Background Preview -->
              @if (newCol().image_url) {
                <img [src]="newCol().image_url" class="absolute inset-0 w-full h-full object-cover opacity-20">
              }

              <div class="relative z-10 h-full flex flex-col justify-center space-y-4">
                <input type="text" [value]="newCol().name" (input)="updateNewColName($any($event.target).value)"
                       placeholder="NOMBRE DE COLECCIÓN"
                       class="w-full bg-black/80 border border-white/10 text-white px-4 py-2 text-[10px] font-bold tracking-widest uppercase focus:border-red-600 outline-none">

                <select [value]="newCol().home_section" (change)="updateNewColSection($any($event.target).value)"
                        class="w-full bg-black/80 border border-white/10 text-white px-4 py-2 text-[10px] font-bold tracking-widest uppercase focus:border-red-600 outline-none">
                  <option value="none">NO MOSTRAR EN HOME</option>
                  <option value="black_friday">SECCIÓN BLACK FRIDAY</option>
                  <option value="style_collection">SECCIÓN STYLE COLLECTION</option>
                  <option value="drop_pasado">SECCIÓN DROP PASADO</option>
                </select>

                <div class="flex items-center gap-2">
                  <button (click)="fileInput.click()" [disabled]="isUploading() || isSaving()"
                          class="flex-1 bg-white/5 border border-white/10 text-[9px] font-bold py-2 uppercase hover:bg-white/10 transition-colors">
                    @if (isUploading()) {
                      <i class="ti ti-loader-2 animate-spin mr-2"></i>
                    }
                    {{ isUploading() ? 'SUBIENDO...' : 'SUBIR IMAGEN' }}
                  </button>
                  <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
                </div>

                <div class="flex gap-2">
                  <button (click)="saveCollection()" [disabled]="!newCol().name || isUploading() || isSaving()"
                          class="flex-1 bg-red-600 text-white text-[9px] font-bold py-2 uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center">
                    @if (isSaving()) {
                      <i class="ti ti-loader-2 animate-spin mr-2"></i>
                    }
                    {{ isSaving() ? 'GUARDANDO...' : 'CREAR' }}
                  </button>
                  <button (click)="cancelAdd()" [disabled]="isSaving()" class="px-4 text-[9px] font-bold text-gray-500 hover:text-white uppercase transition-colors">
                    CANCELAR
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminCollectionsComponent implements OnInit {
  private supabase = inject(SupabaseService).client;

  collections = signal<any[]>([]);
  isAdding = signal(false);
  isUploading = signal(false);
  isSaving = signal(false);
  isLoading = signal(true);

  newCol = signal({
    name: '',
    slug: '',
    image_url: '',
    home_section: 'none'
  });

  updateNewColName(value: string) {
    this.newCol.set({ ...this.newCol(), name: value });
  }

  updateNewColSection(value: string) {
    this.newCol.set({ ...this.newCol(), home_section: value });
  }

  async ngOnInit() {
    this.fetchCollections();
  }

  async fetchCollections() {
    this.isLoading.set(true);
    try {
      const { data } = await this.supabase
        .from('collections')
        .select('*')
        .order('name');

      this.collections.set((data || []).map((c: any) => ({
        ...c,
        home_section: c.description?.startsWith('SECTION:') ? c.description.split('|')[0].replace('SECTION:', '') : 'none'
      })));
    } finally {
      this.isLoading.set(false);
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading.set(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `collections/${fileName}`;

    try {
      const { error: uploadError } = await this.supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = this.supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      this.newCol.set({ ...this.newCol(), image_url: data.publicUrl });
    } catch (e: any) {
      alert('Error subiendo imagen: ' + e.message);
    } finally {
      this.isUploading.set(false);
    }
  }

  async saveCollection() {
    const col = this.newCol();
    if (!col.name || this.isSaving()) return;

    this.isSaving.set(true);
    const slug = col.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const description = `SECTION:${col.home_section}|${col.name}`;

    try {
      const { error } = await this.supabase
        .from('collections')
        .insert([{
          name: col.name,
          slug: slug,
          image_url: col.image_url,
          description: description
        }]);

      if (error) throw error;

      this.isAdding.set(false);
      this.newCol.set({ name: '', slug: '', image_url: '', home_section: 'none' });
      await this.fetchCollections();
    } catch (e: any) {
      alert('Error al crear colección: ' + e.message);
    } finally {
      this.isSaving.set(false); // ✅ FIXED: was incorrectly set to true
    }
  }

  cancelAdd() {
    this.isAdding.set(false);
    this.newCol.set({ name: '', slug: '', image_url: '', home_section: 'none' });
  }

  async deleteCollection(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta colección?')) return;

    const { error } = await this.supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      this.fetchCollections();
    }
  }
}
