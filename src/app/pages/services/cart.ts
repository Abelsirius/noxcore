import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartCount = new BehaviorSubject<number>(0);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCount.asObservable();
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      cartItem => cartItem.product.id === item.product.id && cartItem.size === item.size
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItems.next(currentItems);
    this.updateCartCount();
  }

  removeFromCart(productId: string, size: string): void {
    const currentItems = this.cartItems.value.filter(
      item => !(item.product.id === productId && item.size === size)
    );
    this.cartItems.next(currentItems);
    this.updateCartCount();
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.cartCount.next(0);
  }

  private updateCartCount(): void {
    const count = this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
    this.cartCount.next(count);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
}