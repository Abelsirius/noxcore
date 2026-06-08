import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]"></div>

      <div class="w-full max-w-lg glass-card p-12 rounded-[3rem] relative z-10 reveal">
        <div class="text-center mb-10">
          <div class="w-16 h-16 accent-gradient rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20 mb-6 rotate-3">
             <i class="ti ti-user-plus text-3xl text-white"></i>
          </div>
          <h2 class="text-4xl font-black text-white tracking-tighter uppercase font-display leading-none mb-2">CREAR CUENTA</h2>
          <p class="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase">Join the Elite Collective</p>
        </div>

        <form (submit)="onSubmit()" class="space-y-6">
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nombre Completo</label>
              <div class="relative group">
                <i class="ti ti-user absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"></i>
                <input type="text" [(ngModel)]="fullName" name="fullName" required
                  class="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:bg-white/[0.05] focus:border-red-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium"
                  placeholder="Tu nombre completo">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Dirección de Email</label>
              <div class="relative group">
                <i class="ti ti-mail absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"></i>
                <input type="email" [(ngModel)]="email" name="email" required
                  class="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:bg-white/[0.05] focus:border-red-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium"
                  placeholder="email@ejemplo.com">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Contraseña</label>
              <div class="relative group">
                <i class="ti ti-lock absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"></i>
                <input type="password" [(ngModel)]="password" name="password" required
                  class="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:bg-white/[0.05] focus:border-red-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium"
                  placeholder="********">
              </div>
            </div>
          </div>

          @if(errorMessage()){
          <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
            <i class="ti ti-alert-triangle mr-2"></i> {{errorMessage()}}
          </div>
          }
          <button type="submit" [disabled]="loading()" class="w-full btn-premium py-5 mt-4">
            <span class="flex items-center justify-center gap-3 text-[12px] font-black tracking-[0.2em] uppercase">
              @if(loading()){
              <i class="ti ti-loader-2 animate-spin"></i>
              } @else {
              <i class="ti ti-user-plus"></i>
              }
              {{ loading() ? 'CREANDO...' : 'COMENZAR AHORA' }}
            </span>
          </button>
        </form>

        <div class="mt-10 pt-8 border-t border-white/5 text-center">
          <p class="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
            ¿Ya tienes cuenta? 
            <a routerLink="/auth/login" class="text-white hover:text-red-500 transition-colors ml-2 underline underline-offset-4 decoration-zinc-800 hover:decoration-red-500/50">Iniciar Sesión</a>
          </p>
        </div>
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
  loading = signal(false);
  errorMessage = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    const { error } = await this.authService.signUp(this.email, this.password, this.fullName);
    if (error) {
      this.errorMessage.set(error.message);
      this.loading.set(false);
    } else {
      this.errorMessage.set('Revisa tu email para confirmar la cuenta');
      this.loading.set(false);
      this.router.navigate(['/auth/login']);
    }
  }
}
