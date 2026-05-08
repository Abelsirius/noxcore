import { Routes } from '@angular/router';
import { adminGuard } from './pages/guards/admin.guard';

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
        path: 'catalog',
        loadComponent: () => import('./pages/catalog/catalog').then(m => m.CatalogComponent)
    },
    {
        path: 'shop',
        redirectTo: 'catalog',
        pathMatch: 'full'
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./pages/auth/login').then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('./pages/auth/register').then(m => m.RegisterComponent)
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'drops',
        loadComponent: () => import('./pages/components/countdown/countdown').then(m => m.CountdownComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent)
    }
];
