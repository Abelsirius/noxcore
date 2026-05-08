import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard').then(m => m.AdminDashboardComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'stats'
      },
      {
        path: 'stats',
        loadComponent: () => import('./dashboard-stats/admin-stats').then(m => m.AdminStatsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./products/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./products/product-detail').then(m => m.AdminProductDetailComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./products/product-detail').then(m => m.AdminProductDetailComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./collections').then(m => m.AdminCollectionsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders').then(m => m.AdminOrdersComponent)
      }
    ]
  }
];
