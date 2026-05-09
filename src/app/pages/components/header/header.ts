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
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatBadgeModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private _router = inject(Router);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  public _dialog = inject(MatDialog);

  searchQuery = '';
  searchResults: Product[] = [];

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.searchResults = this.productService.products().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    ).slice(0, 8);
  }

  selectSearchResult(product: Product) {
    this.searchQuery = '';
    this.searchResults = [];
    this._router.navigate(['/catalog'], { queryParams: { search: product.name } });
  }

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