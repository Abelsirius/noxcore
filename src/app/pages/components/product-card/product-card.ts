import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe, NgOptimizedImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() select = new EventEmitter<Product>();

  get lowestPrice() {
    if (!this.product.variants || this.product.variants.length === 0) {
      return this.product.base_price;
    }
    const prices = this.product.variants.map(v => v.price_override ?? this.product.base_price);
    return Math.min(...prices);
  }

  get hasDiscount() {
    return (this.product.discount_percent ?? 0) > 0;
  }

  onSelect() {
    this.select.emit(this.product);
  }
}
