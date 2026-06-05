import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { ProductCardComponent } from '../components/product-card/product-card';
import { ProductModalComponent } from '../components/product-grid/product-model/product-model';
import { Product } from '../models/product';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, ProductModalComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class CatalogComponent implements OnInit {
  productService = inject(ProductService);

  // Filters as signals for Zoneless compatibility
  selectedCollectionId = signal('');
  searchQuery = signal('');
  sortOrder = signal('newest');

  // UI State as signals
  selectedProduct = signal<Product | null>(null);
  isModalOpen = signal(false);

  ngOnInit() {
    this.productService.fetchCollections();
    this.applyFilters();
  }

  applyFilters() {
    this.productService.fetchProducts({
      collectionId: this.selectedCollectionId() || undefined,
      search: this.searchQuery() || undefined,
      sort: this.sortOrder()
    });
  }

  selectCollection(id: string) {
    this.selectedCollectionId.set(id);
    this.applyFilters();
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
    this.applyFilters();
  }

  onSortChange(value: string) {
    this.sortOrder.set(value);
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCollectionId.set('');
    this.searchQuery.set('');
    this.applyFilters();
  }

  onProductSelect(product: Product) {
    this.selectedProduct.set(product);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedProduct.set(null);
  }
}
