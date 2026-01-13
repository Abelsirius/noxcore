import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./pages/home/home').then((e) => e.Home),
    },
    {
        path: 'reels',
        loadComponent: () => import('./pages/components/reel/reel').then(m => m.Reel)
    },
    {
        path: 'shop',
        loadComponent: () => import('./pages/components/product-grid/product-grid').then(m => m.ProductGridComponent)
    },
    {
        path: 'drops',
        loadComponent: () => import('./pages/components/countdown/countdown').then(m => m.CountdownComponent)
    }
];
