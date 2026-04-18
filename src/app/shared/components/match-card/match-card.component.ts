import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { Match } from '@/app/core/services/match.service';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule, TagModule, DatePipe],
  template: `
    <div class="surface-100 border-round p-3" [class.border-left-3]="match().status === 'completed'" [class.border-green-500]="match().status === 'completed'">
      <div class="flex justify-content-between align-items-center mb-2">
        <span class="text-sm text-500">{{ match().round || 'Match #' + match().match_number }}</span>
        <p-tag [value]="match().status" [severity]="getStatusSeverity(match().status)" />
      </div>
      
      <div class="flex align-items-center justify-content-between">
        <div class="flex-1 text-right">
          <span class="font-medium">{{ match().home_team_name }}</span>
        </div>
        
        <div class="mx-4 text-center">
          @if (match().status === 'completed') {
            <span class="text-2xl font-bold">
              {{ match().home_score }} - {{ match().away_score }}
            </span>
          } @else {
            <span class="text-500">vs</span>
          }
        </div>
        
        <div class="flex-1">
          <span class="font-medium">{{ match().away_team_name }}</span>
        </div>
      </div>

      @if (match().match_date || match().venue) {
        <div class="flex gap-3 mt-3 text-sm text-500">
          @if (match().match_date) {
            <span><i class="pi pi-calendar mr-1"></i>{{ match().match_date | date:'short' }}</span>
          }
          @if (match().venue) {
            <span><i class="pi pi-map-marker mr-1"></i>{{ match().venue }}</span>
          }
        </div>
      }
    </div>
  `
})
export class MatchCardComponent {
  match = input.required<Match>();

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'postponed': return 'warn';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }
}
