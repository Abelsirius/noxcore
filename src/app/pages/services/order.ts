import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { CartService } from './cart';
import { z } from 'zod';

export const CheckoutSchema = z.object({
  fullName: z.string().min(3, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  address: z.string().min(10, 'Dirección incompleta'),
  city: z.string().min(2, 'Ciudad inválida'),
});

export type CheckoutData = z.infer<typeof CheckoutSchema>;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase: any;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private cartService: CartService
  ) {

    this.supabase = this.supabaseService.client;
  }

  async createOrder(checkoutData: CheckoutData) {
    const user = this.authService.currentUser();
    const items = this.cartService.cartItems();
    const total = this.cartService.totalPrice();

    if (items.length === 0) throw new Error('El carrito está vacío');

    // 1. Create the order record
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        user_id: user?.id,
        status: 'pending',
        total_amount: total,
        contact_phone: checkoutData.phone,
        shipping_address: {
          full_name: checkoutData.fullName,
          email: checkoutData.email,
          address: checkoutData.address,
          city: checkoutData.city
        }
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items and update stock
    const orderItems = items.map(item => ({
      order_id: order.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.variant?.price_override ?? item.product?.base_price ?? 0,
      sku: item.variant?.sku,
      subtotal: (item.variant?.price_override ?? item.product?.base_price ?? 0) * item.quantity
    }));

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Update stock for each variant (In a production app, use an RPC or Transaction)
    for (const item of items) {
      const { error: stockError } = await this.supabase.rpc('decrement_stock', {
        row_id: item.variant_id,
        amount: item.quantity
      });
      // Note: You need to create this RPC in Supabase SQL editor or use a normal update
    }

    // 4. Clear cart
    this.cartService.clearCart();

    return order;
  }

  async getOrderHistory() {
    const user = this.authService.currentUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items (*, product_variants (*, products (*)))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return error ? [] : data;
  }

  // Admin methods
  async getAllOrdersAdmin() {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items (*, product_variants (*, products (*)))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin orders:', error);
      return [];
    }
    return data;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
