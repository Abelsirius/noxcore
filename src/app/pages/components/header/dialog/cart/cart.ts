import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../services/cart';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  private _dialogRef = inject(MatDialogRef<Cart>);
  public cartService = inject(CartService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  isUpdating = signal(false);

  close() {
    this._dialogRef.close();
  }

  async updateQuantity(variantId: string, currentQty: number, delta: number) {
    if (this.isUpdating()) return;
    
    this.isUpdating.set(true);
    try {
      await this.cartService.updateQuantity(variantId, currentQty + delta);
    } catch (e: any) {
      this.notify.error(e.message);
    } finally {
      this.isUpdating.set(false);
    }
  }

  removeItem(variantId: string) {
    this.cartService.removeFromCart(variantId);
    this.notify.info('Producto eliminado del carrito');
  }

  goToCheckout() {
    this.close();
    this.router.navigate(['/checkout']);
  }

  getItemPrice(item: any) {
    return item.variant?.price_override ?? item.product?.base_price ?? 0;
  }
}
