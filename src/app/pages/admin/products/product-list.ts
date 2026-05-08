import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <div class="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase">PRODUCTOS</h1>
          <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Gestión de inventario y piezas</p>
        </div>
        <button routerLink="new" class="bg-white text-black text-[10px] font-black px-6 py-3 tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
          Nuevo Producto
        </button>
      </div>

      <div class="overflow-hidden border border-white/10">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-4">Imagen</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">Colección</th>
              <th class="px-6 py-4">Precio Base</th>
              <th class="px-6 py-4">Stock Total</th>
              <th class="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr *ngFor="let prod of productService.products()" class="hover:bg-white/5 transition-colors group">
              <td class="px-6 py-4">
                <img [src]="prod.images[0]" class="w-12 h-16 object-cover bg-[#111] border border-white/10">
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-white font-bold uppercase tracking-tight">{{prod.name}}</span>
              </td>
              <td class="px-6 py-4 text-xs text-gray-500 uppercase">{{prod.collection?.name || '-'}}</td>
              <td class="px-6 py-4 text-xs text-white">S/. {{prod.base_price | number:'1.2-2'}}</td>
              <td class="px-6 py-4">
                <span [class.text-red-600]="getTotalStock(prod) === 0" class="text-xs font-bold">
                  {{getTotalStock(prod)}} uds.
                </span>
              </td>
              <td class="px-6 py-4">
                <a [routerLink]="[prod.id]" class="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 transition-all">
                  Editar / Variantes
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.fetchProducts();
  }

  getTotalStock(product: any) {
    return product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  }
}
