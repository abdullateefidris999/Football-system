import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar.component';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-team-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    PublicNavbarComponent
  ],
  template: `
    <div class="min-h-screen relative flex items-center justify-center">
      <!-- Full Background Image -->
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('images/team-background.jpeg');">
        <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-primary/40 to-black/80"></div>
      </div>

      <!-- Navbar -->
      <div class="absolute top-0 left-0 right-0 z-20">
        <!-- <app-public-navbar /> -->
      </div>

      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md mx-4">
        <div class="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Card Header with Logo -->
          <div class="bg-gradient-to-r from-primary to-primary/80 px-8 py-8 text-center">
            <img 
              src="images/mewar-logo.png" 
              alt="MIU" 
              class="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white/30 shadow-lg bg-white p-1" 
            />
            <h1 class="text-2xl font-bold text-white mb-1">Team Portal</h1>
            <p class="text-primary-100 text-sm">
              MIU Football Tournament System
            </p>
          </div>

          <!-- Form Section -->
          <div class="px-8 py-8">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              @if (error()) {
                <p-message severity="error" [text]="error()!" styleClass="w-full mb-4" />
              }

              <div class="mb-5">
                <label for="email" class="block text-sm font-semibold mb-2 text-surface-700 dark:text-surface-200">
                  <i class="pi pi-envelope mr-2 text-primary"></i>Email Address
                </label>
                <input 
                  pInputText 
                  id="email" 
                  type="email"
                  formControlName="email"
                  class="w-full"
                  placeholder="team@example.com"
                />
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <small class="text-red-500 mt-1 block">Valid email is required</small>
                }
              </div>

              <div class="mb-6">
                <label for="password" class="block text-sm font-semibold mb-2 text-surface-700 dark:text-surface-200">
                  <i class="pi pi-lock mr-2 text-primary"></i>Password
                </label>
                <p-password 
                  id="password" 
                  formControlName="password"
                  [toggleMask]="true"
                  [feedback]="false"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  placeholder="Enter your password"
                />
                @if (form.get('password')?.invalid && form.get('password')?.touched) {
                  <small class="text-red-500 mt-1 block">Password is required</small>
                }
              </div>

              <p-button 
                type="submit"
                label="Sign In"
                icon="pi pi-sign-in"
                [loading]="loading()"
                [disabled]="form.invalid || loading()"
                styleClass="w-full font-semibold"
              />
            </form>

            <!-- Register Link -->
            <p class="text-center mt-6! text-sm text-surface-600 dark:text-surface-400">
              Don't have a team account? 
              <a routerLink="/" class="text-primary font-semibold hover:underline ml-1">
                Register for a tournament
              </a>
            </p>

          </div>
        </div>

        <!-- Back to Home -->
        <p class="text-center mt-6 text-sm text-white/80">
          <a routerLink="/" class="hover:text-white hover:underline">
            <i class="pi pi-arrow-left mr-2"></i>Back to Home
          </a>
        </p>
      </div>
    </div>
  `
})
export class TeamLoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    try {
      await this.authService.signIn(email, password);
      
      const role = this.authService.getRole();
      if (role !== 'team_manager') {
        await this.authService.signOut();
        throw new Error('This login is for team managers only.');
      }

      this.router.navigate(['/team/dashboard']);
    } catch (err: any) {
      this.error.set(err.message || 'Login failed. Please check your credentials.');
    } finally {
      this.loading.set(false);
    }
  }
}
