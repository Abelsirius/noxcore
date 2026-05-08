import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../models/product';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black pt-24 pb-12 px-4">
      <div class="container mx-auto max-w-5xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- Left: Shipping Form -->
          <div class="space-y-8">
            <div>
              <h1 class="text-4xl font-black text-white tracking-tighter uppercase mb-2">FINALIZAR PEDIDO</h1>
              <p class="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Completa tus datos para el envío</p>
            </div>

            <form class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Nombres</label>
                  <input type="text" [(ngModel)]="form.firstName" name="firstName" 
                         class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none">
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Apellidos</label>
                  <input type="text" [(ngModel)]="form.lastName" name="lastName" 
                         class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none">
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Teléfono / WhatsApp</label>
                <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="Ej: 987654321"
                       class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none">
              </div>

              <div class="space-y-1">
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ciudad / Distrito</label>
                <input type="text" [(ngModel)]="form.city" name="city" 
                       class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none">
              </div>

              <div class="space-y-1">
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Dirección de Entrega</label>
                <textarea [(ngModel)]="form.address" name="address" rows="3"
                          class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none"></textarea>
              </div>
            </form>
          </div>

          <!-- Right: Order Summary -->
          <div class="bg-[#0a0a0a] border border-white/10 p-8 h-fit space-y-6">
            <h3 class="text-lg font-black tracking-tighter uppercase">RESUMEN DEL PEDIDO</h3>
            
            <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <div *ngFor="let item of cartService.cartItems()" class="flex gap-4 items-center">
                <div class="w-12 h-16 bg-[#111] overflow-hidden flex-shrink-0">
                  <img [src]="item.product?.images?.[0]" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-[10px] font-bold uppercase">{{item.product?.name}}</p>
                  <p class="text-[9px] text-gray-500 uppercase">Talla: {{item.variant?.size}} x {{item.quantity}}</p>
                </div>
                <p class="text-[10px] font-bold">S/. {{getItemPrice(item) * item.quantity | number:'1.2-2'}}</p>
              </div>
            </div>

            <div class="border-t border-white/10 pt-4 space-y-2">
              <div class="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>S/. {{cartService.totalPrice() | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                <span>Envío</span>
                <span class="text-green-500">CALCULADO POR WHATSAPP</span>
              </div>
              <div class="flex justify-between text-xl font-black tracking-tighter pt-2">
                <span>TOTAL</span>
                <span class="text-red-600">S/. {{cartService.totalPrice() | number:'1.2-2'}}</span>
              </div>
            </div>

            <button (click)="placeOrder()" [disabled]="isProcessing() || !isFormValid()"
                    class="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-30">
              <span *ngIf="!isProcessing()">CONFIRMAR POR WHATSAPP</span>
              <span *ngIf="isProcessing()">PROCESANDO...</span>
            </button>
            
            <p class="text-[8px] text-gray-600 text-center uppercase tracking-widest">
              Al hacer clic, serás redirigido a WhatsApp para coordinar el pago y envío.
            </p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartService: CartService = inject(CartService);
  notify: NotificationService = inject(NotificationService);
  authService: AuthService = inject(AuthService);
  supabase = inject(SupabaseService).client;
  router: Router = inject(Router);

  isProcessing = signal(false);

  form = {
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: ''
  };

  getItemPrice(item: CartItem) {
    return item.variant?.price_override ?? item.product?.base_price ?? 0;
  }

  isFormValid() {
    return this.form.firstName && this.form.phone && this.form.address && this.cartService.cartItems().length > 0;
  }

  async placeOrder() {
    if (!this.isFormValid() || this.isProcessing()) return;

    this.isProcessing.set(true);

    try {
      // 1. Crear el pedido en Supabase para registro
      const { data: order, error } = await this.supabase
        .from('orders')
        .insert([{
          user_id: this.authService.currentUser()?.id || null,
          total_amount: this.cartService.totalPrice(),
          shipping_address: {
            name: `${this.form.firstName} ${this.form.lastName}`,
            city: this.form.city,
            address: this.form.address
          },
          contact_phone: this.form.phone,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      if (!order) throw new Error('No se pudo crear el pedido');

      // 2. Insertar items del pedido
      const items = this.cartService.cartItems().map((item: CartItem) => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: this.getItemPrice(item),
        subtotal: this.getItemPrice(item) * item.quantity
      }));

      await this.supabase.from('order_items').insert(items);

      // 3. Generar mensaje de WhatsApp
      this.sendToWhatsApp(order);

      // 4. Limpiar carrito y redirigir
      this.cartService.clearCart();
      this.notify.success('¡Pedido registrado! Redirigiendo a WhatsApp...');
      this.router.navigate(['/']);

    } catch (e: any) {
      this.notify.error('Error al procesar el pedido: ' + e.message);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private sendToWhatsApp(order: any) {
    const phone = "51942301601";
    let itemsText = this.cartService.cartItems().map((item: CartItem) =>
      `• ${item.product?.name} (Talla: ${item.variant?.size}) x${item.quantity} - S/. ${(this.getItemPrice(item) * item.quantity).toFixed(2)}`
    ).join('%0A');

    const message = `
🔥 *NUEVO PEDIDO - NYXOR FIT* 🔥
-------------------------------
👤 *Cliente:* ${this.form.firstName} ${this.form.lastName}
📞 *WhatsApp:* ${this.form.phone}
📍 *Destino:* ${this.form.city}
🏠 *Dirección:* ${this.form.address}
-------------------------------
📦 *DETALLE:*
${itemsText}

💰 *TOTAL:* S/. ${this.cartService.totalPrice().toFixed(2)}
-------------------------------
_Hola, acabo de realizar este pedido en la web. ¿Me podrían indicar los pasos para el pago?_
`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
    window.open(url, '_blank');
  }
}
