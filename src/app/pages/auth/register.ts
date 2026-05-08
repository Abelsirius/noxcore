import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black flex items-center justify-center p-4">
      <div class="w-full max-w-md space-y-8 bg-[#0a0a0a] border border-white/10 p-10 shadow-2xl">
        <div class="text-center">
          <h2 class="text-3xl font-black text-white tracking-tighter uppercase glitch-text" data-text="UNIRSE">UNIRSE</h2>
          <p class="mt-2 text-xs text-gray-500 tracking-[0.3em] uppercase">Forma parte de la oscuridad</p>
        </div>

        <form (submit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div class="group">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-focus-within:text-red-600 transition-colors">Nombre Completo</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" required
                class="w-full bg-transparent border-b border-white/10 text-white py-2 focus:border-red-600 outline-none transition-all placeholder:text-gray-800">
            </div>
            <div class="group">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-focus-within:text-red-600 transition-colors">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                class="w-full bg-transparent border-b border-white/10 text-white py-2 focus:border-red-600 outline-none transition-all placeholder:text-gray-800">
            </div>
            <div class="group">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-focus-within:text-red-600 transition-colors">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="w-full bg-transparent border-b border-white/10 text-white py-2 focus:border-red-600 outline-none transition-all placeholder:text-gray-800">
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            {{errorMessage}}
          </div>

          <button type="submit" [disabled]="loading"
            class="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
            {{ loading ? 'CREANDO...' : 'REGISTRARSE' }}
          </button>
        </form>

        <p class="text-center text-[10px] text-gray-500 tracking-widest uppercase">
          ¿Ya tienes cuenta? 
          <a routerLink="/auth/login" class="text-white hover:text-red-600 transition-colors">Iniciar Sesión</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    const { error } = await this.authService.signUp(this.email, this.password, this.fullName);
    
    if (error) {
      this.errorMessage = error.message;
      this.loading = false;
    } else {
      // Supabase sends a confirmation email by default
      this.errorMessage = 'Revisa tu email para confirmar la cuenta';
      this.loading = false;
    }
  }
}
