import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

type StatusType = 
  | 'pending' | 'approved' | 'rejected' | 'disqualified'
  | 'draft' | 'submitted' | 'locked'
  | 'scheduled' | 'completed' | 'postponed' | 'cancelled'
  | 'registration_open' | 'upcoming' | 'ongoing';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: `
    <p-tag [value]="displayValue()" [severity]="severity()" />
  `
})
export class StatusBadgeComponent {
  status = input.required<StatusType | string>();

  displayValue = computed(() => {
    return this.status().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  });

  severity = computed<'success' | 'info' | 'warn' | 'danger' | 'secondary'>(() => {
    switch (this.status()) {
      case 'approved':
      case 'completed':
      case 'locked':
      case 'registration_open':
        return 'success';
      
      case 'pending':
      case 'submitted':
      case 'upcoming':
      case 'postponed':
        return 'warn';
      
      case 'rejected':
      case 'disqualified':
      case 'cancelled':
        return 'danger';
      
      case 'scheduled':
      case 'ongoing':
        return 'info';
      
      default:
        return 'secondary';
    }
  });
}
