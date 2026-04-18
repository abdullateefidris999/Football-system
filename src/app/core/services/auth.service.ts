import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export type UserRole = 'admin' | 'team_manager' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  private currentUser = signal<User | null>(null);
  private currentSession = signal<Session | null>(null);
  private loading = signal<boolean>(true);

  user = this.currentUser.asReadonly();
  session = this.currentSession.asReadonly();
  isLoading = this.loading.asReadonly();

  isAuthenticated = computed(() => !!this.currentUser());

  role = computed<UserRole>(() => {
    const user = this.currentUser();
    if (!user) return null;
    return (user.user_metadata?.['role'] as UserRole) || null;
  });

  isAdmin = computed(() => this.role() === 'admin');
  isTeamManager = computed(() => this.role() === 'team_manager');

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.currentSession.set(session);
      this.currentUser.set(session?.user ?? null);

      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.currentSession.set(session);
        this.currentUser.set(session?.user ?? null);
      });
    } finally {
      this.loading.set(false);
    }
  }

  async signUp(email: string, password: string, role: UserRole = 'team_manager') {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.router.navigate(['/']);
  }

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  getRole(): UserRole {
    return this.role();
  }
}
