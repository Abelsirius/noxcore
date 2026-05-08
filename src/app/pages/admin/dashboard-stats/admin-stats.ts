import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="border-b border-white/10 pb-6">
        <h1 class="text-4xl font-black text-white tracking-tighter uppercase">DASHBOARD</h1>
        <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Resumen operativo de NoxCore</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ingresos Totales</span>
            <i class="ti ti-currency-dollar text-red-600 text-xl"></i>
          </div>
          <div class="text-3xl font-black tracking-tighter">S/. {{totalRevenue() | number:'1.2-2'}}</div>
          <p class="text-[8px] text-green-500 mt-2 uppercase tracking-widest">Ventas registradas</p>
        </div>

        <!-- Total Orders -->
        <div class="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pedidos</span>
            <i class="ti ti-shopping-cart text-red-600 text-xl"></i>
          </div>
          <div class="text-3xl font-black tracking-tighter">{{orderService.orders().length}}</div>
          <p class="text-[8px] text-gray-500 mt-2 uppercase tracking-widest">Procesados</p>
        </div>

        <!-- Total Products -->
        <div class="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Productos</span>
            <i class="ti ti-package text-red-600 text-xl"></i>
          </div>
          <div class="text-3xl font-black tracking-tighter">{{productService.products().length}}</div>
          <p class="text-[8px] text-gray-500 mt-2 uppercase tracking-widest">En catálogo</p>
        </div>

        <!-- Low Stock -->
        <div class="bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-black text-red-600 uppercase tracking-widest">Stock Crítico</span>
            <i class="ti ti-alert-triangle text-red-600 text-xl"></i>
          </div>
          <div class="text-3xl font-black tracking-tighter">{{lowStockCount()}}</div>
          <p class="text-[8px] text-red-600 mt-2 uppercase tracking-widest">Unidades bajas</p>
        </div>
      </div>

      <!-- Recent Activity / Low Stock Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Low Stock List -->
        <div class="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl space-y-6">
          <h3 class="text-xs font-black tracking-widest uppercase text-gray-400">Alertas de Inventario</h3>
          <div class="space-y-4">
            <div *ngFor="let prod of lowStockItems()" class="flex items-center justify-between border-b border-white/5 pb-4">
              <div class="flex items-center gap-3">
                <img [src]="prod.images[0]" class="w-8 h-10 object-cover bg-black border border-white/10">
                <div>
                  <p class="text-[10px] font-bold uppercase">{{prod.name}}</p>
                  <p class="text-[8px] text-gray-500 uppercase">Total: {{getTotalStock(prod)}} uds.</p>
                </div>
              </div>
              <span class="bg-red-600/10 text-red-600 text-[8px] font-black px-2 py-1 rounded uppercase">Reponer</span>
            </div>
            <div *ngIf="lowStockItems().length === 0" class="text-center py-10">
              <p class="text-[9px] text-gray-600 uppercase tracking-widest">Todo el inventario está al día</p>
            </div>
          </div>
        </div>

        <!-- Sales Summary -->
        <div class="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl space-y-6">
          <h3 class="text-xs font-black tracking-widest uppercase text-gray-400">Ventas Recientes</h3>
          <div class="space-y-4">
            <div *ngFor="let order of recentOrders()" class="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <p class="text-[10px] font-bold uppercase">Pedido #{{order.id.slice(0,8)}}</p>
                <p class="text-[8px] text-gray-500 uppercase">{{order.created_at | date:'short'}}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black uppercase">S/. {{order.total_amount | number:'1.2-2'}}</p>
                <span class="text-[8px] text-gray-500 uppercase">{{order.status}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminStatsComponent implements OnInit {
  orderService = inject(OrderService);
  productService = inject(ProductService);

  totalRevenue = computed(() => 
    this.orderService.orders().reduce((acc, order) => acc + order.total_amount, 0)
  );

  lowStockItems = computed(() => 
    this.productService.products().filter(p => this.getTotalStock(p) < 10)
  );

  lowStockCount = computed(() => this.lowStockItems().length);

  recentOrders = computed(() => 
    this.orderService.orders().slice(0, 5)
  );

  ngOnInit() {
    this.orderService.fetchOrders();
    this.productService.fetchProducts();
  }

  getTotalStock(product: any) {
    return product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  }
}
