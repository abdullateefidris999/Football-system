import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-tournament-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, DatePipe],
  template: `
    <div class="card h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <!-- Banner Image -->
      <div class="relative h-48 bg-surface-200 dark:bg-surface-700 overflow-hidden">
        @if (tournament().banner_url) {
          <img 
            [src]="tournament().banner_url" 
            [alt]="tournament().name"
            class="w-full h-full object-cover"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center">
            <i class="pi pi-futbol text-6xl text-surface-400"></i>
          </div>
        }
        <!-- Format Badge -->
        <p-tag 
          [value]="formatLabel()" 
          [severity]="formatSeverity()"
          class="absolute top-3 right-3"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 p-5 flex flex-col">
        <h3 class="text-xl font-bold mb-2 text-surface-900 dark:text-surface-0">
          {{ tournament().name }}
        </h3>

        @if (tournament().description) {
          <p class="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">
            {{ tournament().description }}
          </p>
        }

        <div class="mt-auto space-y-3">
          <!-- Stats Row -->
          <div class="flex items-center gap-4 text-sm text-surface-600 dark:text-surface-400">
            <span class="flex items-center gap-1">
              <i class="pi pi-users"></i>
              {{ tournament().max_teams }} teams max
            </span>
            <span class="flex items-center gap-1">
              <i class="pi pi-user"></i>
              {{ tournament().players_per_team }} players
            </span>
          </div>

          <!-- Dates -->
          <div class="flex flex-col gap-1 text-sm">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-primary"></i>
              <span>Starts: {{ tournament().start_date | date:'mediumDate' }}</span>
            </div>
            <div class="flex items-center gap-2 text-orange-500">
              <i class="pi pi-clock"></i>
              <span>Register by: {{ tournament().registration_deadline | date:'mediumDate' }}</span>
            </div>
          </div>

          <!-- Register Button -->
          <a [routerLink]="['/register', tournament().id]" class="block mt-4">
            <p-button 
              label="Register Your Team" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              styleClass="w-full"
            />
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TournamentCardComponent {
  tournament = input.required<Tournament>();

  formatLabel(): string {
    const format = this.tournament().format;
    switch (format) {
      case 'round_robin': return 'Round Robin';
      case 'knockout': return 'Knockout';
      case 'group_knockout': return 'Group + Knockout';
      default: return format;
    }
  }

  formatSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const format = this.tournament().format;
    switch (format) {
      case 'round_robin': return 'info';
      case 'knockout': return 'danger';
      case 'group_knockout': return 'warn';
      default: return 'secondary';
    }
  }
}
