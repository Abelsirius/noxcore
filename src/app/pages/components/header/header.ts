import { Component, HostListener, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart';
import { H } from '@angular/cdk/keycodes';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Cart } from './dialog/cart/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private _router = inject(Router);

  get isReelsRoute(): boolean {
    return this._router.url.includes('/reels');
  }
  public _cartService = inject(CartService);
  cartCount$ = this._cartService.getCartCount();
  public _dialog = inject(MatDialog)
  openCart() {
    this._dialog.open(Cart, {
      width: '800px',
      data: { cartItems: this._cartService.getCartItems() }
    })
  }

  isScrolled = false;

  @HostListener('window:scroll', []) onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}