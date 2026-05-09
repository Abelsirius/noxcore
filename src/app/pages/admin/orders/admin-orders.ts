import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 md:space-y-10 animate-fade-in">
      <div class="border-b border-white/10 pb-6">
        <h1 class="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">GESTIÓN DE PEDIDOS</h1>
        <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Monitorea y actualiza el estado de tus ventas</p>
      </div>

      <!-- Table for Desktop, Cards for Mobile -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">ID Pedido</th>
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Fecha</th>
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Cliente</th>
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Monto</th>
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                <th class="p-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let order of $any(orderService.orders())" class="hover:bg-white/[0.02] transition-colors">
                <td class="p-4 text-[10px] font-mono text-gray-400">#{{order.id.slice(0,8)}}</td>
                <td class="p-4 text-[10px] text-white">{{order.created_at | date:'short'}}</td>
                <td class="p-4 text-[10px] text-white">
                  <div class="flex flex-col">
                    <span>{{order.shipping_address?.full_name || 'N/A'}}</span>
                    <span class="text-[8px] text-gray-500">{{order.contact_phone}}</span>
                  </div>
                </td>
                <td class="p-4 text-[10px] font-black text-red-600">S/. {{order.total_amount | number:'1.2-2'}}</td>
                <td class="p-4">
                  <span [class]="getStatusClass(order.status)" 
                        class="text-[8px] font-black px-2 py-1 rounded uppercase">
                    {{order.status}}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="updateStatus(order.id, 'shipped')" 
                            class="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all" title="Marcar como Enviado">
                      <i class="ti ti-truck"></i>
                    </button>
                    <button (click)="updateStatus(order.id, 'delivered')" 
                            class="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-500 transition-all" title="Marcar como Entregado">
                      <i class="ti ti-check"></i>
                    </button>
                    <button (click)="updateStatus(order.id, 'cancelled')" 
                            class="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-600 transition-all" title="Cancelar Pedido">
                      <i class="ti ti-x"></i>
                    </button>
                    <button (click)="deleteOrder(order.id)" 
                            class="p-2 hover:bg-red-600/20 rounded-lg text-gray-400 hover:text-red-600 transition-all" title="Eliminar Registro">
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-white/5">
          <div *ngFor="let order of $any(orderService.orders())" class="p-6 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-mono text-gray-500 mb-1">#{{order.id.slice(0,8)}}</p>
                <p class="text-xs font-black text-white uppercase">{{order.shipping_address?.full_name || 'N/A'}}</p>
                <p class="text-[9px] text-gray-500 uppercase">{{order.created_at | date:'short'}}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span [class]="getStatusClass(order.status)" class="text-[8px] font-black px-2 py-1 rounded uppercase">
                  {{order.status}}
                </span>
                <button (click)="deleteOrder(order.id)" class="text-red-600 text-[10px] uppercase font-black tracking-widest p-1">
                   Eliminar
                </button>
              </div>
            </div>
            
            <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg">
              <p class="text-[10px] font-black text-red-600">S/. {{order.total_amount | number:'1.2-2'}}</p>
              <div class="flex gap-1">
                <button (click)="updateStatus(order.id, 'shipped')" class="p-2 bg-white/5 rounded text-gray-400"><i class="ti ti-truck"></i></button>
                <button (click)="updateStatus(order.id, 'delivered')" class="p-2 bg-white/5 rounded text-green-500"><i class="ti ti-check"></i></button>
                <button (click)="updateStatus(order.id, 'cancelled')" class="p-2 bg-white/5 rounded text-red-600"><i class="ti ti-x"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="orderService.orders().length === 0" class="p-20 text-center">
          <p class="text-[10px] text-gray-600 uppercase tracking-widest">No hay pedidos registrados aún</p>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orderService = inject(OrderService);

  ngOnInit() {
    this.orderService.fetchOrders();
  }

  async deleteOrder(id: string) {
    if (confirm('¿Estás seguro de eliminar este registro permanentemente?')) {
      try {
        await this.orderService.deleteOrder(id);
      } catch (e) {
        alert('Error al eliminar el pedido');
      }
    }
  }

  updateStatus(orderId: string, status: string) {
    if (confirm(`¿Estás seguro de cambiar el estado a ${status.toUpperCase()}?`)) {
      this.orderService.updateOrderStatus(orderId, status);
    }
  }

  getStatusClass(status: string) {
    const base = 'bg-opacity-10';
    switch (status.toLowerCase()) {
      case 'pending': return `${base} bg-yellow-500 text-yellow-500`;
      case 'shipped': return `${base} bg-blue-500 text-blue-500`;
      case 'delivered': return `${base} bg-green-500 text-green-500`;
      case 'cancelled': return `${base} bg-red-600 text-red-600`;
      default: return `${base} bg-gray-500 text-gray-500`;
    }
  }
}
