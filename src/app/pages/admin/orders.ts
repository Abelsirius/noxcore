import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl font-black text-white tracking-tighter uppercase">PEDIDOS</h1>
        <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Control de ventas y envíos</p>
      </div>

      <!-- Loading Shimmer -->
      <div *ngIf="isLoading()" class="space-y-4">
        <div *ngFor="let i of [1,2,3,4,5]" class="h-16 bg-white/5 border border-white/10 shimmer"></div>
      </div>

      <div *ngIf="!isLoading()" class="overflow-hidden border border-white/10">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-4">ID Pedido</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <ng-container *ngFor="let order of orders">
              <tr class="hover:bg-white/5 transition-colors group cursor-pointer" (click)="toggleOrder(order.id)">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-mono text-[10px] text-white">#{{order.id.slice(0,8)}}</span>
                    <span class="text-[9px] text-gray-500 uppercase">{{order.created_at | date:'short'}}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-white font-bold uppercase">{{order.shipping_address?.full_name}}</span>
                    <span class="text-[9px] text-gray-500">{{order.shipping_address?.email}}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <select (click)="$event.stopPropagation()" 
                          (change)="updateStatus(order.id, $any($event.target).value)"
                          [class]="getStatusClass(order.status)"
                          class="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer">
                    <option value="pending" class="bg-black">Pendiente</option>
                    <option value="paid" class="bg-black">Pagado</option>
                    <option value="shipped" class="bg-black">Enviado</option>
                    <option value="delivered" class="bg-black">Entregado</option>
                    <option value="cancelled" class="bg-black">Cancelado</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-[10px] text-white font-black">S/. {{order.total_amount | number:'1.2-2'}}</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-[10px] font-bold text-gray-500 group-hover:text-white uppercase tracking-widest transition-all">
                    {{expandedOrder === order.id ? 'Cerrar' : 'Detalles'}}
                  </button>
                </td>
              </tr>
              
              <!-- Expanded Details -->
              <tr *ngIf="expandedOrder === order.id" class="bg-white/[0.02]">
                <td colspan="5" class="px-8 py-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Items List -->
                    <div class="space-y-4">
                      <h4 class="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-white/5 pb-2">Artículos</h4>
                      <div *ngFor="let item of order.order_items" class="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                        <img [src]="item.product_variants?.products?.images[0]" class="w-10 h-12 object-cover bg-black">
                        <div class="flex-1">
                          <p class="text-[10px] text-white font-bold uppercase">{{item.product_variants?.products?.name}}</p>
                          <p class="text-[9px] text-gray-500">TALLA: {{item.product_variants?.size}} | CANT: {{item.quantity}}</p>
                        </div>
                        <p class="text-[10px] text-white font-mono">S/. {{item.subtotal | number:'1.2-2'}}</p>
                      </div>
                    </div>

                    <!-- Shipping Info -->
                    <div class="space-y-4">
                      <h4 class="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-white/5 pb-2">Información de Envío</h4>
                      <div class="grid grid-cols-2 gap-4 text-[10px] uppercase">
                        <div>
                          <p class="text-gray-500 mb-1">Dirección</p>
                          <p class="text-white font-bold">{{order.shipping_address?.address}}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 mb-1">Ciudad</p>
                          <p class="text-white font-bold">{{order.shipping_address?.city}}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 mb-1">Teléfono</p>
                          <p class="text-white font-bold">{{order.contact_phone}}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 mb-1">ID Transacción</p>
                          <p class="text-white font-mono text-[9px]">{{order.id}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-container>

            <tr *ngIf="orders.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-xs text-gray-500 uppercase tracking-[0.2em]">No hay pedidos registrados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: any[] = [];
  expandedOrder: string | null = null;
  isLoading = signal(true);

  async ngOnInit() {
    this.fetchOrders();
  }

  async fetchOrders() {
    this.isLoading.set(true);
    try {
      this.orders = await this.orderService.getAllOrdersAdmin();
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleOrder(id: string) {
    this.expandedOrder = this.expandedOrder === id ? null : id;
  }

  async updateStatus(orderId: string, status: string) {
    try {
      await this.orderService.updateOrderStatus(orderId, status);
      // Actualizar localmente para feedback inmediato
      const order = this.orders.find(o => o.id === orderId);
      if (order) order.status = status;
    } catch (e: any) {
      alert('Error al actualizar estado: ' + e.message);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pending': return 'text-orange-500';
      case 'paid': return 'text-green-500';
      case 'shipped': return 'text-blue-500';
      case 'delivered': return 'text-purple-500';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-400';
    }
  }
}
