import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartItem } from '../../../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  public _dialogRef = inject(MatDialogRef<Cart>);
  public _data = inject(MAT_DIALOG_DATA) as { cartItems: CartItem[]; total: number; };
   
  close(){
    this._dialogRef.close();
  }
}
