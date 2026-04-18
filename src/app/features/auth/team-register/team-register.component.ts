import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar.component';
import { PublicFooterComponent } from '@/app/shared/components/public-footer/public-footer.component';
import { AuthService } from '@/app/core/services/auth.service';
import { TeamService } from '@/app/core/services/team.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-team-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule,
    PublicNavbarComponent,
    PublicFooterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      <app-public-navbar />

      <main class="flex-1 pt-16">
        <div class="max-w-lg mx-auto px-4 py-16">
          <!-- Loading Tournament -->
          @if (loadingTournament()) {
            <div class="flex justify-center py-20">
              <p-progressSpinner strokeWidth="4" />
            </div>
          }

          <!-- Tournament Not Found -->
          @if (!loadingTournament() && !tournament()) {
            <div class="text-center py-20">
              <i class="pi pi-exclamation-triangle text-5xl text-orange-500 mb-4"></i>
              <h2 class="text-2xl font-bold mb-2">Tournament Not Found</h2>
              <p class="text-surface-600 dark:text-surface-400 mb-6">
                The tournament you're trying to register for doesn't exist or is no longer available.
              </p>
              <a routerLink="/">
                <p-button label="Back to Home" icon="pi pi-home" />
              </a>
            </div>
          }

          <!-- Registration Form -->
          @if (tournament()) {
            <div class="card">
              <!-- Header -->
              <div class="text-center mb-8">
                <i class="pi pi-users text-4xl text-primary mb-4"></i>
                <h1 class="text-2xl font-bold mb-2">Register Your Team</h1>
                <p class="text-surface-600 dark:text-surface-400">
                  for <span class="font-semibold text-primary">{{ tournament()?.name }}</span>
                </p>
              </div>

              <!-- Success Message -->
              @if (success()) {
                <div class="text-center py-8">
                  <i class="pi pi-check-circle text-5xl text-green-500 mb-4"></i>
                  <h2 class="text-xl font-bold mb-2">Registration Successful!</h2>
                  <p class="text-surface-600 dark:text-surface-400 mb-6">
                    Your team has been registered. Please check your email to confirm your account,
                    then log in to manage your team.
                  </p>
                  <a routerLink="/team/login">
                    <p-button label="Go to Login" icon="pi pi-sign-in" />
                  </a>
                </div>
              }

              <!-- Form -->
              @if (!success()) {
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <!-- Error Message -->
                  @if (error()) {
                    <p-message severity="error" [text]="error()!" styleClass="w-full mb-4" />
                  }

                  <!-- Team Name -->
                  <div class="mb-4">
                    <label for="teamName" class="block text-sm font-medium mb-2">Team Name *</label>
                    <input 
                      pInputText 
                      id="teamName" 
                      formControlName="teamName"
                      class="w-full"
                      placeholder="Enter your team name"
                    />
                    @if (form.get('teamName')?.invalid && form.get('teamName')?.touched) {
                      <small class="text-red-500">Team name is required</small>
                    }
                  </div>

                  <!-- Email -->
                  <div class="mb-4">
                    <label for="email" class="block text-sm font-medium mb-2">Email *</label>
                    <input 
                      pInputText 
                      id="email" 
                      type="email"
                      formControlName="email"
                      class="w-full"
                      placeholder="team@example.com"
                    />
                    @if (form.get('email')?.invalid && form.get('email')?.touched) {
                      <small class="text-red-500">Valid email is required</small>
                    }
                  </div>

                  <!-- Password -->
                  <div class="mb-4">
                    <label for="password" class="block text-sm font-medium mb-2">Password *</label>
                    <p-password 
                      id="password" 
                      formControlName="password"
                      [toggleMask]="true"
                      [feedback]="true"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      placeholder="Minimum 8 characters"
                    />
                    @if (form.get('password')?.invalid && form.get('password')?.touched) {
                      <small class="text-red-500">Password must be at least 8 characters</small>
                    }
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-4">
                    <label for="confirmPassword" class="block text-sm font-medium mb-2">Confirm Password *</label>
                    <p-password 
                      id="confirmPassword" 
                      formControlName="confirmPassword"
                      [toggleMask]="true"
                      [feedback]="false"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      placeholder="Re-enter your password"
                    />
                    @if (form.get('confirmPassword')?.touched && form.hasError('mismatch')) {
                      <small class="text-red-500">Passwords do not match</small>
                    }
                  </div>

                  <!-- Phone Number -->
                  <div class="mb-6">
                    <label for="phone" class="block text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      pInputText 
                      id="phone" 
                      formControlName="phoneNumber"
                      class="w-full"
                      placeholder="Optional"
                    />
                  </div>

                  <!-- Submit Button -->
                  <p-button 
                    type="submit"
                    label="Register Team"
                    icon="pi pi-check"
                    [loading]="submitting()"
                    [disabled]="form.invalid || submitting()"
                    styleClass="w-full"
                  />

                  <!-- Login Link -->
                  <p class="text-center mt-6 text-sm text-surface-600 dark:text-surface-400">
                    Already have an account? 
                    <a routerLink="/team/login" class="text-primary font-medium hover:underline">
                      Log in here
                    </a>
                  </p>
                </form>
              }
            </div>
          }
        </div>
      </main>

      <app-public-footer />
    </div>
  `
})
export class TeamRegisterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private tournamentService = inject(TournamentService);

  tournament = signal<Tournament | null>(null);
  loadingTournament = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form: FormGroup = this.fb.group({
    teamName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    phoneNumber: ['']
  }, {
    validators: this.passwordMatchValidator
  });

  ngOnInit() {
    const tournamentId = this.route.snapshot.paramMap.get('tournamentId');
    if (tournamentId) {
      this.loadTournament(tournamentId);
    } else {
      this.loadingTournament.set(false);
    }
  }

  async loadTournament(id: string) {
    try {
      const tournament = await this.tournamentService.getTournamentById(id);
      this.tournament.set(tournament);
    } catch (err) {
      this.tournament.set(null);
    } finally {
      this.loadingTournament.set(false);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.form.invalid || !this.tournament()) return;

    this.submitting.set(true);
    this.error.set(null);

    const { teamName, email, password, phoneNumber } = this.form.value;

    try {
      const authData = await this.authService.signUp(email, password, 'team_manager');
      
      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      await this.teamService.registerTeam({
        team_name: teamName,
        tournament_id: this.tournament()!.id,
        email,
        phone_number: phoneNumber || undefined,
        user_id: authData.user.id
      });

      this.success.set(true);
    } catch (err: any) {
      this.error.set(err.message || 'Registration failed. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
