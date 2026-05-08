import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);
  currentUser = signal<User | null>(null);
  isAdmin = signal<boolean>(false);

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
      this.checkAdminStatus();
    });
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/']);
  }

  private async checkAdminStatus() {
    const user = this.currentUser();
    if (!user) {
      this.isAdmin.set(false);
      return;
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data && data.role === 'admin') {
      this.isAdmin.set(true);
    } else {
      this.isAdmin.set(false);
    }
  }
}
