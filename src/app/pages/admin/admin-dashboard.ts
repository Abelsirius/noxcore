import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#050505] flex text-white selection:bg-red-500/30">
      <!-- Admin Sidebar -->
      <aside class="w-72 glass border-r border-white/5 flex flex-col sticky top-0 h-screen z-50">
        <div class="p-10 mb-4">
          <div class="flex items-center gap-3 group cursor-pointer">
            <div class="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <i class="ti ti-bolt text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tighter uppercase font-display leading-none">NYXOR</h2>
              <p class="text-[10px] text-red-500 font-bold tracking-[0.3em] uppercase opacity-80">Admin Core</p>
            </div>
          </div>
        </div>
        
        <nav class="flex-1 px-6 space-y-1.5">
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 mb-4">Menu Principal</p>
          
          <a routerLink="./stats" routerLinkActive="bg-red-500/10 text-red-500 border-red-500/50" 
             class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent rounded-2xl transition-all duration-300 group">
            <i class="ti ti-smart-home text-lg group-hover:scale-110 transition-transform"></i>
            <span>Dashboard</span>
          </a>
          
          <a routerLink="./products" routerLinkActive="bg-red-500/10 text-red-500 border-red-500/50" 
             class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent rounded-2xl transition-all duration-300 group">
            <i class="ti ti-package text-lg group-hover:scale-110 transition-transform"></i>
            <span>Productos</span>
          </a>
          
          <a routerLink="./orders" routerLinkActive="bg-red-500/10 text-red-500 border-red-500/50" 
             class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent rounded-2xl transition-all duration-300 group">
            <i class="ti ti-shopping-cart text-lg group-hover:scale-110 transition-transform"></i>
            <span>Pedidos</span>
          </a>
          
          <a routerLink="./collections" routerLinkActive="bg-red-500/10 text-red-500 border-red-500/50" 
             class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent rounded-2xl transition-all duration-300 group">
            <i class="ti ti-layers-intersect text-lg group-hover:scale-110 transition-transform"></i>
            <span>Colecciones</span>
          </a>
        </nav>

        <div class="p-6 mt-auto">
          <div class="glass-card p-4 rounded-3xl border-white/5 bg-white/5 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-white/10">
                AD
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-bold truncate">Administrador</p>
                <p class="text-[10px] text-zinc-500 truncate">Soporte técnico</p>
              </div>
            </div>
          </div>
          
          <button (click)="authService.signOut()" 
            class="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold tracking-widest text-zinc-500 hover:text-red-500 bg-transparent hover:bg-red-500/5 rounded-2xl uppercase transition-all duration-300 border border-transparent hover:border-red-500/20">
            <i class="ti ti-logout text-base"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-12 bg-[#050505]">
        <div class="max-w-7xl mx-auto reveal">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
  authService = inject(AuthService);
}
