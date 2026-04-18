import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar.component';
import { PublicFooterComponent } from '@/app/shared/components/public-footer/public-footer.component';
import { TournamentCardComponent } from '@/app/shared/components/tournament-card/tournament-card.component';
import { TournamentService } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ProgressSpinnerModule,
    PublicNavbarComponent,
    PublicFooterComponent,
    TournamentCardComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navbar -->
      <app-public-navbar />

      <!-- Hero Section -->
      <section class="relative pt-16 min-h-[80vh] flex items-center overflow-hidden">
        <!-- Background Image with stronger overlay -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('images/Background.jpeg');">
          <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <!-- Badge -->
          <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <i class="pi pi-trophy text-primary"></i>
            Official Tournament Platform
          </span>

          <!-- Headline with text shadow -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white! mb-6 leading-tight drop-shadow-lg">
            MIU Football<br />
            <span class="text-primary">Tournament System</span>
          </h1>

          <!-- Subheadline -->
          <p class="text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow-md">
            Register your team, track matches, and compete for glory in Mewar International University's official football tournaments.
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#tournaments">
              <p-button 
                label="View Tournaments" 
                icon="pi pi-eye" 
                size="large"
                styleClass="font-semibold px-8"
                [style]="{ 'background-color': 'white', 'color': 'var(--primary-color)', 'border': 'none' }"
              />
            </a>
            <a routerLink="/team/login">
              <p-button 
                label="Team Portal" 
                icon="pi pi-sign-in" 
                [outlined]="true"
                size="large"
                styleClass="font-semibold px-8"
                [style]="{ 'color': 'white', 'border-color': 'white', 'background-color': 'transparent' }"
              />
            </a>
          </div>

          <!-- Stats with background for better visibility -->
          <div class="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto bg-black/40 backdrop-blur-sm rounded-xl p-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-white drop-shadow-md">50+</div>
              <div class="text-primary text-sm font-medium">Teams</div>
            </div>
            <div class="text-center border-x border-white/20">
              <div class="text-3xl font-bold text-white drop-shadow-md">10+</div>
              <div class="text-primary text-sm font-medium">Tournaments</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white drop-shadow-md">500+</div>
              <div class="text-primary text-sm font-medium">Players</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tournaments Section -->
      <section id="tournaments" class="py-20 bg-surface-50 dark:bg-surface-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Open Tournaments</h2>
            <p class="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Browse available tournaments and register your team to compete.
            </p>
          </div>

          <!-- Loading State -->
          @if (tournamentService.loading()) {
            <div class="flex justify-center py-20">
              <p-progressSpinner strokeWidth="4" />
            </div>
          }

          <!-- Error State -->
          @if (tournamentService.error()) {
            <div class="text-center py-20">
              <i class="pi pi-exclamation-triangle text-5xl text-orange-500 mb-4"></i>
              <p class="text-surface-600 dark:text-surface-400 mb-4">
                {{ tournamentService.error() }}
              </p>
              <p-button label="Retry" icon="pi pi-refresh" (onClick)="loadTournaments()" />
            </div>
          }

          <!-- Tournaments Grid -->
          @if (!tournamentService.loading() && !tournamentService.error()) {
            @if (tournamentService.tournaments().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (tournament of tournamentService.tournaments(); track tournament.id) {
                  <app-tournament-card [tournament]="tournament" />
                }
              </div>
            } @else {
              <div class="text-center py-20 bg-surface-100 dark:bg-surface-800 rounded-xl">
                <i class="pi pi-calendar-times text-5xl text-surface-400 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">No Open Tournaments</h3>
                <p class="text-surface-600 dark:text-surface-400">
                  Check back later for upcoming tournaments.
                </p>
              </div>
            }
          }
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-users text-3xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Easy Registration</h3>
              <p class="text-surface-600 dark:text-surface-400">
                Register your team in minutes with our streamlined process.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-chart-bar text-3xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Live Standings</h3>
              <p class="text-surface-600 dark:text-surface-400">
                Track your team's progress with real-time standings and statistics.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-calendar text-3xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Match Scheduling</h3>
              <p class="text-surface-600 dark:text-surface-400">
                View upcoming matches and never miss a game with our schedule system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <app-public-footer />
    </div>
  `
})
export class LandingPageComponent implements OnInit {
  tournamentService = inject(TournamentService);

  ngOnInit() {
    this.loadTournaments();
  }

  loadTournaments() {
    this.tournamentService.fetchOpenTournaments();
  }
}
