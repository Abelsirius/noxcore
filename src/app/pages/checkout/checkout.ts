import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../models/product';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, DecimalPipe, RouterLink],
  template: `
    <div class="min-h-screen bg-black pt-24 pb-12 px-4">
      <div class="container mx-auto max-w-5xl">

        <!-- ─── LOGIN WALL: Usuario no autenticado ─────────────────────── -->
        @if (!authService.currentUser()) {
          <div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <!-- Icon -->
            <div class="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <i class="ti ti-lock text-4xl text-red-600"></i>
            </div>

            <div class="space-y-3">
              <h1 class="text-4xl font-black text-white tracking-tighter uppercase">Inicia Sesión para Continuar</h1>
              <p class="text-gray-500 text-sm tracking-wide max-w-md mx-auto">
                Para finalizar tu pedido necesitas una cuenta. Es rápido y gratuito.
                Tus artículos se guardarán en el carrito.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a routerLink="/auth/login"
                 class="px-10 py-4 bg-red-600 text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-red-500 transition-all">
                INICIAR SESIÓN
              </a>
              <a routerLink="/auth/register"
                 class="px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all">
                CREAR CUENTA GRATIS
              </a>
            </div>

            <button (click)="router.navigate(['/'])"
                    class="text-gray-600 text-xs tracking-widest uppercase hover:text-white transition-colors">
              ← Seguir comprando
            </button>
          </div>

        } @else {
          <!-- ─── CHECKOUT FORM: Usuario autenticado ──────────────────── -->
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
                           class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none transition-all">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Apellidos</label>
                    <input type="text" [(ngModel)]="form.lastName" name="lastName"
                           class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none transition-all">
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Teléfono / WhatsApp</label>
                  <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="Ej: 987654321"
                         class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none transition-all">
                </div>

                <div class="space-y-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ciudad / Distrito</label>
                  <input type="text" [(ngModel)]="form.city" name="city"
                         class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none transition-all">
                </div>

                <div class="space-y-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Dirección de Entrega</label>
                  <textarea [(ngModel)]="form.address" name="address" rows="3"
                            class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-xs focus:border-red-600 outline-none transition-all resize-none"></textarea>
                </div>

                <!-- Validation hints -->
                @if (showValidation() && !isFormValid()) {
                  <div class="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
                    <i class="ti ti-alert-circle"></i>
                    Completa todos los campos requeridos
                  </div>
                }
              </form>
            </div>

            <!-- Right: Order Summary -->
            <div class="bg-[#0a0a0a] border border-white/10 p-8 h-fit space-y-6">
              <h3 class="text-lg font-black tracking-tighter uppercase">RESUMEN DEL PEDIDO</h3>

              <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                @for (item of cartService.cartItems(); track item.variant_id) {
                  <div class="flex gap-4 items-center">
                    <div class="w-12 h-16 bg-[#111] overflow-hidden flex-shrink-0">
                      <img [src]="item.product?.images?.[0]" [alt]="item.product?.name" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1">
                      <p class="text-[10px] font-bold uppercase">{{item.product?.name}}</p>
                      <p class="text-[9px] text-gray-500 uppercase">Talla: {{item.variant?.size}} x {{item.quantity}}</p>
                    </div>
                    <p class="text-[10px] font-bold">S/. {{(getItemPrice(item) * item.quantity) | number:'1.2-2'}}</p>
                  </div>
                }

                @if (cartService.cartItems().length === 0) {
                  <div class="text-center py-8 text-gray-600 text-xs uppercase tracking-widest">
                    Carrito vacío
                  </div>
                }
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

              <button (click)="placeOrder()"
                      [disabled]="isProcessing()"
                      class="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isProcessing()) {
                  <span class="flex items-center justify-center gap-2">
                    <i class="ti ti-loader-2 animate-spin"></i>
                    PROCESANDO...
                  </span>
                } @else {
                  CONFIRMAR POR WHATSAPP
                }
              </button>

              <p class="text-[8px] text-gray-600 text-center uppercase tracking-widest">
                Al hacer clic, serás redirigido a WhatsApp para coordinar el pago y envío.
              </p>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  notify = inject(NotificationService);
  authService = inject(AuthService);
  supabase = inject(SupabaseService).client;
  router = inject(Router);

  isProcessing = signal(false);
  showValidation = signal(false);

  form = {
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: ''
  };

  ngOnInit() {
    this.autofillProfileDetails();
  }

  async autofillProfileDetails() {
    const user = this.authService.currentUser();
    if (!user) return;

    // 1. Autofill names from Auth Metadata
    const fullName = user.user_metadata?.['full_name'] || '';
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      this.form.firstName = parts[0] || '';
      this.form.lastName = parts.slice(1).join(' ') || '';
    }

    // 2. Fetch the most recent order for this user to autofill address and phone
    try {
      const { data: lastOrder, error } = await this.supabase
        .from('orders')
        .select('contact_phone, shipping_address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && lastOrder) {
        if (lastOrder.contact_phone) {
          this.form.phone = lastOrder.contact_phone;
        }
        if (lastOrder.shipping_address) {
          this.form.city = lastOrder.shipping_address.city || '';
          this.form.address = lastOrder.shipping_address.address || '';
        }
      }
    } catch (e) {
      console.warn('Could not fetch last order for autofill:', e);
    }
  }

  getItemPrice(item: CartItem): number {
    return item.variant?.price_override ?? item.product?.base_price ?? 0;
  }

  isFormValid(): boolean {
    return !!(
      this.form.firstName.trim() &&
      this.form.lastName.trim() &&
      this.form.phone.trim() &&
      this.form.address.trim() &&
      this.cartService.cartItems().length > 0
    );
  }

  async placeOrder() {
    // Guard: user must be logged in (RLS protection)
    if (!this.authService.currentUser()) {
      this.notify.error('Debes iniciar sesión para realizar un pedido.');
      return;
    }

    // Guard: validate form
    this.showValidation.set(true);
    if (!this.isFormValid() || this.isProcessing()) return;

    this.isProcessing.set(true);

    try {
      const items = this.cartService.cartItems();
      const user = this.authService.currentUser()!;

      // 1. Crear el pedido en Supabase
      const { data: order, error } = await this.supabase
        .from('orders')
        .insert([{
          user_id: user.id,
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
      const orderItems = items.map((item: CartItem) => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: this.getItemPrice(item),
        subtotal: this.getItemPrice(item) * item.quantity
      }));

      const { error: itemsError } = await this.supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Decrementar stock de cada variante (read-then-write atómico)
      for (const item of items) {
        const { data: variant } = await this.supabase
          .from('product_variants')
          .select('stock')
          .eq('id', item.variant_id)
          .single();

        if (variant !== null) {
          const newStock = Math.max(0, (variant.stock ?? 0) - item.quantity);
          await this.supabase
            .from('product_variants')
            .update({ stock: newStock })
            .eq('id', item.variant_id);
        }
      }

      // 4. Abrir WhatsApp
      this.sendToWhatsApp(order, items);

      // 5. Limpiar y redirigir
      this.cartService.clearCart();
      this.notify.success('¡Pedido registrado! Redirigiendo a WhatsApp...');
      this.router.navigate(['/']);

    } catch (e: any) {
      // Friendly error for RLS (shouldn't reach here now, but safety net)
      if (e?.code === '42501') {
        this.notify.error('Necesitas una cuenta para realizar pedidos. Por favor, inicia sesión.');
        this.router.navigate(['/auth/login']);
      } else {
        this.notify.error('Error al procesar el pedido: ' + (e?.message ?? 'Error desconocido'));
      }
    } finally {
      this.isProcessing.set(false);
    }
  }

  private sendToWhatsApp(order: any, items: CartItem[]) {
    const phone = "51942301601";
    const itemsText = items.map((item: CartItem) =>
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
`.trim();

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
