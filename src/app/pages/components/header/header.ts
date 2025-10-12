import { Component, HostListener, inject } from '@angular/core';
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
  imports: [CommonModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  public _cartService = inject(CartService);
  cartCount$ = this._cartService.getCartCount();
   public _dialog = inject(MatDialog)
   openCart(){
    this._dialog.open(Cart,{
       width:'800px',
       data:{cartItems:this._cartService.getCartItems()}
    })
   }

  @HostListener('window:scroll', [])  onWindowScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
      }
    else {
      header?.classList.remove('scrolled');   }
    }
}