import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  contact_phone: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase = inject(SupabaseService).client;
  orders = signal<Order[]>([]);

  async fetchOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      this.orders.set(data);
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (!error) {
      await this.fetchOrders();
    }
  }

  async deleteOrder(id: string) {
    const { error } = await this.supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (!error) {
      this.orders.set(this.orders().filter(o => o.id !== id));
    }
  }
}
