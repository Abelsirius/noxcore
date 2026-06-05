import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  template: `
    <div class="space-y-10 reveal">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <span class="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-red-500/10 text-red-500 border border-red-500/20">
              Ventas en Vivo
            </span>
            <p class="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Control Logístico</p>
          </div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase font-display leading-none">
            GESTIÓN DE PEDIDOS
          </h1>
        </div>
        <div class="flex items-center gap-4">
           <div class="glass px-4 py-2 rounded-2xl flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sincronizado</span>
           </div>
        </div>
      </div>

      <!-- Main Container -->
      <div class="glass-card rounded-[2.5rem] overflow-hidden">
        @if (orderService.orders().length > 0) {
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/5 bg-white/[0.02]">
                  <th class="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pedido</th>
                  <th class="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha & Hora</th>
                  <th class="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cliente / Destinatario</th>
                  <th class="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total</th>
                  <th class="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                  <th class="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.03]">
                @for (order of orderService.orders(); track order.id) {
                  <tr class="hover:bg-white/[0.02] transition-all duration-300 group">
                    <td class="px-8 py-6">
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-mono text-red-500">
                             #{{order.id.slice(0,2)}}
                          </div>
                          <span class="text-[10px] font-mono text-zinc-400">...{{order.id.slice(-6)}}</span>
                       </div>
                    </td>
                    <td class="px-6 py-6">
                       <div class="flex flex-col">
                          <span class="text-[11px] text-white font-medium">{{order.created_at | date:'dd MMM, yyyy'}}</span>
                          <span class="text-[9px] text-zinc-600 uppercase">{{order.created_at | date:'HH:mm'}}</span>
                       </div>
                    </td>
                    <td class="px-6 py-6">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                           {{order.shipping_address?.full_name?.slice(0,1) || '?'}}
                        </div>
                        <div class="flex flex-col">
                          <span class="text-[11px] font-bold text-white">{{order.shipping_address?.full_name || 'Sin Nombre'}}</span>
                          <span class="text-[9px] text-zinc-600 font-medium">{{order.contact_phone || 'Sin Teléfono'}}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6">
                       <span class="text-[11px] font-black text-white bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          S/. {{order.total_amount | number:'1.2-2'}}
                       </span>
                    </td>
                    <td class="px-6 py-6">
                      <div [class]="getStatusClass(order.status)" 
                            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {{order.status}}
                      </div>
                    </td>
                    <td class="px-8 py-6 text-right">
                      <div class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="updateStatus(order.id, 'shipped')" 
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all" title="Enviado">
                          <i class="ti ti-truck text-base"></i>
                        </button>
                        <button (click)="updateStatus(order.id, 'delivered')" 
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all" title="Entregado">
                          <i class="ti ti-check text-base"></i>
                        </button>
                        <button (click)="updateStatus(order.id, 'cancelled')" 
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Cancelar">
                          <i class="ti ti-x text-base"></i>
                        </button>
                        <div class="w-px h-6 bg-white/5 mx-1"></div>
                        <button (click)="deleteOrder(order.id)" 
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 hover:bg-red-600 hover:text-white transition-all" title="Eliminar">
                          <i class="ti ti-trash text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden divide-y divide-white/5">
            @for (order of orderService.orders(); track order.id) {
              <div class="p-8 space-y-6 reveal">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-mono text-red-500">
                       #{{order.id.slice(-4)}}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-white uppercase">{{order.shipping_address?.full_name || 'N/A'}}</h4>
                      <p class="text-[10px] text-zinc-500 uppercase font-medium">{{order.created_at | date:'dd MMM · HH:mm'}}</p>
                    </div>
                  </div>
                  <div [class]="getStatusClass(order.status)" class="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border">
                    {{order.status}}
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                   <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p class="text-[9px] text-zinc-600 uppercase font-bold mb-1">Monto Total</p>
                      <p class="text-sm font-black text-white">S/. {{order.total_amount | number:'1.2-2'}}</p>
                   </div>
                   <div class="flex items-center justify-end gap-2">
                      <button (click)="updateStatus(order.id, 'shipped')" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400"><i class="ti ti-truck text-lg"></i></button>
                      <button (click)="updateStatus(order.id, 'delivered')" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-500"><i class="ti ti-check text-lg"></i></button>
                      <button (click)="deleteOrder(order.id)" class="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500"><i class="ti ti-trash text-lg"></i></button>
                   </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="py-32 text-center bg-white/[0.01]">
            <div class="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6 border border-white/5">
               <i class="ti ti-package-off text-3xl text-zinc-700"></i>
            </div>
            <h3 class="text-sm font-bold text-zinc-500 uppercase tracking-widest">No hay pedidos registrados</h3>
            <p class="text-[10px] text-zinc-700 uppercase mt-2">Tus ventas aparecerán aquí automáticamente</p>
          </div>
        }
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
