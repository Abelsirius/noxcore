import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, ProductVariant } from '../models/product';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private supabase = inject(SupabaseService).client;
  private authService = inject(AuthService);

  // State
  cartItems = signal<CartItem[]>([]);

  // Derived state
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((acc, item) => {
    const price = item.variant?.price_override ?? item.product?.base_price ?? 0;
    return acc + (price * item.quantity);
  }, 0));

  private cartLoaded = false;

  constructor() {
    // Initial load on first construction
    this.loadCart();
  }

  private async loadCart() {
    const user = this.authService.currentUser();
    if (user) {
      await this.loadFromDB(user.id);
    } else {
      this.loadFromLocalStorage();
    }
    this.cartLoaded = true;
  }

  private loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('nox_cart');
      if (saved) {
        this.cartItems.set(JSON.parse(saved));
      }
    } catch {
      this.cartItems.set([]);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('nox_cart', JSON.stringify(this.cartItems()));
  }

  private async loadFromDB(userId: string) {
    const { data, error } = await this.supabase
      .from('cart_items')
      .select(`
        *,
        product_variants (*, products (*))
      `)
      .eq('user_id', userId);

    if (!error && data) {
      const items: CartItem[] = data.map((item: any) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        product: item.product_variants?.products,
        variant: item.product_variants
      }));
      this.cartItems.set(items);
    }
  }

  /** Persist cart: to DB if logged in, else to localStorage */
  private async persistCart() {
    const user = this.authService.currentUser();
    if (user) {
      await this.syncWithDB();
    } else {
      this.saveToLocalStorage();
    }
  }

  private async syncWithDB() {
    const user = this.authService.currentUser();
    if (!user) return;

    const itemsToSync = this.cartItems().map(item => ({
      user_id: user.id,
      variant_id: item.variant_id,
      quantity: item.quantity
    }));

    if (itemsToSync.length > 0) {
      await this.supabase.from('cart_items').upsert(itemsToSync, { onConflict: 'user_id,variant_id' });
    }
  }

  async addToCart(variant: ProductVariant, product: any, quantity: number = 1) {
    const backupCart = [...this.cartItems()];

    // 1. Optimistic Update: Instantly update cart items in UI
    const current = this.cartItems();
    const existingIndex = current.findIndex(item => item.variant_id === variant.id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...current, { variant_id: variant.id, quantity, product, variant }]);
    }

    try {
      // 2. Network Check: Real-time stock validation in background
      const { data: latestVariant, error } = await this.supabase
        .from('product_variants')
        .select('stock')
        .eq('id', variant.id)
        .single();

      const newRequestedQty = existingIndex > -1 
        ? backupCart[existingIndex].quantity + quantity 
        : quantity;

      if (error || !latestVariant || latestVariant.stock < newRequestedQty) {
        throw new Error('Stock insuficiente');
      }

      await this.persistCart();
    } catch (err) {
      // 3. Rollback: If anything fails, revert to previous state
      this.cartItems.set(backupCart);
      throw err;
    }
  }

  removeFromCart(variantId: string) {
    const updated = this.cartItems().filter(item => item.variant_id !== variantId);
    this.cartItems.set(updated);

    const user = this.authService.currentUser();
    if (user) {
      this.supabase.from('cart_items').delete().eq('user_id', user.id).eq('variant_id', variantId).then();
    } else {
      this.saveToLocalStorage();
    }
  }

  async updateQuantity(variantId: string, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(variantId);
      return;
    }

    const { data: latestVariant } = await this.supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();

    if (latestVariant && quantity > latestVariant.stock) {
      throw new Error(`Solo quedan ${latestVariant.stock} unidades disponibles`);
    }

    const current = this.cartItems();
    const index = current.findIndex(item => item.variant_id === variantId);

    if (index > -1) {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity };
      this.cartItems.set(updated);

      const user = this.authService.currentUser();
      if (user) {
        await this.supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('variant_id', variantId);
      } else {
        this.saveToLocalStorage();
      }
    }
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('nox_cart');

    const user = this.authService.currentUser();
    if (user) {
      this.supabase.from('cart_items').delete().eq('user_id', user.id).then();
    }
  }
}