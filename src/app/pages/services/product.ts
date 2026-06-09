import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Product, Collection } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabase = inject(SupabaseService).client;

  products = signal<Product[]>([]);
  collections = signal<Collection[]>([]);
  loading = signal<boolean>(false);

  constructor() { }

  async fetchProducts(filters?: { collectionId?: string, search?: string, sort?: string }) {
    this.loading.set(true);
    let query = this.supabase
      .from('products')
      .select(`
        *,
        variants:product_variants (*),
        collection:collections (*)
      `);

    if (filters?.collectionId) {
      query = query.eq('collection_id', filters.collectionId);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Sort logic
    if (filters?.sort === 'price_asc') {
      query = query.order('base_price', { ascending: true });
    } else if (filters?.sort === 'price_desc') {
      query = query.order('base_price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (!error && data) {
      this.products.set(data as unknown as Product[]);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.loading.set(false);
  }

  async fetchCollections() {
    const { data, error } = await this.supabase
      .from('collections')
      .select('*')
      .order('name');

    if (!error && data) {
      this.collections.set(data);
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        variants:product_variants (*),
        collection:collections (*)
      `)
      .eq('slug', slug)
      .single();

    return error ? null : (data as unknown as Product);
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update local state
    this.products.set(this.products().filter(p => p.id !== id));
  }
}
