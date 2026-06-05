import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, DecimalPipe],
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">PRODUCTOS</h1>
          <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Gestión de inventario y piezas</p>
        </div>
        <button routerLink="new" class="w-full md:w-auto bg-white text-black text-[10px] font-black px-6 py-4 tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
          Nuevo Producto
        </button>
      </div>

      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th class="px-6 py-4">Imagen</th>
                <th class="px-6 py-4">Nombre</th>
                <th class="px-6 py-4 hidden md:table-cell">Colección</th>
                <th class="px-6 py-4">Precio</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @for (prod of productService.products(); track prod.id) {
                <tr class="hover:bg-white/[0.02] transition-colors group">
                  <td class="px-6 py-4">
                    <img [src]="prod.images[0] || 'https://placehold.co/400x533/111/333?text=Sin+Imagen'" class="w-10 h-14 object-cover bg-black border border-white/5">
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] text-white font-bold uppercase tracking-tight">{{prod.name}}</span>
                      <span class="text-[8px] text-gray-500 uppercase md:hidden">{{prod.collection?.name || '-'}}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-[10px] text-gray-500 uppercase hidden md:table-cell">{{prod.collection?.name || '-'}}</td>
                  <td class="px-6 py-4 text-[10px] text-white font-mono">S/. {{prod.base_price | number:'1.2-2'}}</td>
                  <td class="px-6 py-4">
                    <span [class.text-red-600]="getTotalStock(prod) === 0" class="text-[10px] font-black">
                      {{getTotalStock(prod)}} uds.
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-3">
                      <a [routerLink]="[prod.id]" class="text-[9px] font-black text-white uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all">
                        Editar
                      </a>
                      <button (click)="deleteProduct(prod.id)" class="text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-600/20 px-4 py-2 hover:bg-red-600 hover:text-white transition-all">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-8 text-center text-xs text-gray-500 uppercase tracking-widest">
                    No se encontraron productos
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.fetchProducts();
  }

  async deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await this.productService.deleteProduct(id);
      } catch (e) {
        alert('Error al eliminar el producto');
      }
    }
  }

  getTotalStock(product: any) {
    return product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  }
}
