import { Injectable, signal, effect, inject } from '@angular/core';
import { Product } from '../models/product';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private notify = inject(NotificationService);
  wishlist = signal<Product[]>([]);

  constructor() {
    // Load from local storage on init
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist.set(JSON.parse(saved));
    }

    // Auto save to local storage
    effect(() => {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist()));
    });
  }

  toggleWishlist(product: Product) {
    const current = this.wishlist();
    const index = current.findIndex(p => p.id === product.id);

    if (index > -1) {
      this.wishlist.set(current.filter(p => p.id !== product.id));
      this.notify.info('Eliminado de favoritos');
    } else {
      this.wishlist.set([...current, product]);
      this.notify.success('Agregado a tus favoritos ❤️');
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist().some(p => p.id === productId);
  }
}
