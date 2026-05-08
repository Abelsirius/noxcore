import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#050505] flex">
      <!-- Admin Sidebar -->
      <aside class="w-64 bg-black border-r border-white/10 flex flex-col">
        <div class="p-8 border-b border-white/10">
          <h2 class="text-xl font-black text-white tracking-tighter uppercase">ADMIN PANEL</h2>
          <p class="text-[10px] text-red-600 font-bold tracking-widest mt-1 uppercase">Control Total</p>
        </div>
        
        <nav class="flex-1 p-4 space-y-2">
          <a routerLink="./stats" routerLinkActive="bg-white/5 border-l-4 border-red-600" 
             class="flex items-center gap-3 px-4 py-3 text-xs tracking-widest text-gray-400 hover:text-white uppercase transition-all">
            <i class="ti ti-dashboard"></i> Dashboard
          </a>
          <a routerLink="./products" routerLinkActive="bg-white/5 border-l-4 border-red-600" 
             class="flex items-center gap-3 px-4 py-3 text-xs tracking-widest text-gray-400 hover:text-white uppercase transition-all">
            <i class="ti ti-package"></i> Productos
          </a>
          <a routerLink="./collections" routerLinkActive="bg-white/5 border-l-4 border-red-600" 
             class="flex items-center gap-3 px-4 py-3 text-xs tracking-widest text-gray-400 hover:text-white uppercase transition-all">
            <i class="ti ti-category"></i> Colecciones
          </a>
          <a routerLink="./orders" routerLinkActive="bg-white/5 border-l-4 border-red-600" 
             class="flex items-center gap-3 px-4 py-3 text-xs tracking-widest text-gray-400 hover:text-white uppercase transition-all">
            <i class="ti ti-shopping-cart"></i> Pedidos
          </a>
        </nav>

        <div class="p-4 border-t border-white/10">
          <button (click)="authService.signOut()" 
            class="w-full text-left px-4 py-3 text-xs tracking-widest text-gray-500 hover:text-red-600 uppercase transition-all">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-12">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
  authService = inject(AuthService);
}
