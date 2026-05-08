import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { ProductCardComponent } from '../components/product-card/product-card';
import { ProductModalComponent } from '../components/product-grid/product-model/product-model';
import { Product } from '../models/product';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ProductModalComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class CatalogComponent implements OnInit {
  productService = inject(ProductService);

  // Filters
  selectedCollectionId = '';
  searchQuery = '';
  sortOrder = 'newest';

  // UI State
  selectedProduct: Product | null = null;
  isModalOpen = false;

  ngOnInit() {
    this.productService.fetchCollections();
    this.applyFilters();
  }

  applyFilters() {
    this.productService.fetchProducts({
      collectionId: this.selectedCollectionId || undefined,
      search: this.searchQuery || undefined,
      sort: this.sortOrder
    });
  }

  onProductSelect(product: Product) {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }
}
