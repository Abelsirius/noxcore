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
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private _router = inject(Router);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  public _dialog = inject(MatDialog);

  get isReelsRoute(): boolean {
    return this._router.url.includes('/reels');
  }

  isScrolled = false;

  @HostListener('window:scroll', []) onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  openCart() {
    this._dialog.open(Cart, {
      width: '100%',
      maxWidth: '500px',
      position: { right: '0' },
      panelClass: 'cart-drawer-panel'
    });
  }
}