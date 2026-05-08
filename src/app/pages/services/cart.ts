import { Injectable, signal, computed, effect, inject } from '@angular/core';
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

  constructor(
    private supabaseService: SupabaseService
  ) {
    // Initial load
    this.loadCart();

    // Effect to sync with DB when user changes or cart changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.syncWithDB();
      } else {
        this.saveToLocalStorage();
      }
    });
  }

  private async loadCart() {
    const user = this.authService.currentUser();
    if (user) {
      await this.loadFromDB(user.id);
    } else {
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage() {
    const saved = localStorage.getItem('nox_cart');
    if (saved) {
      this.cartItems.set(JSON.parse(saved));
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
        product: item.product_variants.products,
        variant: item.product_variants
      }));
      this.cartItems.set(items);
    }
  }

  private async syncWithDB() {
    const user = this.authService.currentUser();
    if (!user) return;

    // This is a simplified sync - in a real app you'd diff or batch upsert
    // For now, we'll just upsert the current cart items
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
    // Real-time stock validation
    const { data: latestVariant, error } = await this.supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variant.id)
      .single();

    if (error || !latestVariant || latestVariant.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    const current = this.cartItems();
    const existingIndex = current.findIndex(item => item.variant_id === variant.id);

    if (existingIndex > -1) {
      // Check total quantity vs stock
      if (current[existingIndex].quantity + quantity > latestVariant.stock) {
        throw new Error('Stock insuficiente');
      }
      current[existingIndex].quantity += quantity;
      this.cartItems.set([...current]);
    } else {
      this.cartItems.set([...current, { variant_id: variant.id, quantity, product, variant }]);
    }
  }

  removeFromCart(variantId: string) {
    const updated = this.cartItems().filter(item => item.variant_id !== variantId);
    this.cartItems.set(updated);

    // If logged in, also delete from DB
    const user = this.authService.currentUser();
    if (user) {
      this.supabase.from('cart_items').delete().eq('user_id', user.id).eq('variant_id', variantId).then();
    }
  }

  async updateQuantity(variantId: string, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(variantId);
      return;
    }

    // Validar stock antes de actualizar
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
      current[index].quantity = quantity;
      this.cartItems.set([...current]);

      const user = this.authService.currentUser();
      if (user) {
        await this.supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('variant_id', variantId);
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