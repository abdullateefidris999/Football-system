import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    Select,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.scss'
})
export class TournamentListComponent implements OnInit {
  tournamentService = inject(TournamentService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Draft', value: 'draft' },
    { label: 'Registration Open', value: 'registration_open' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' }
  ];

  selectedStatus: string | null = null;
  searchTerm = '';

  ngOnInit() {
    this.tournamentService.fetchAllTournaments();
  }

  get filteredTournaments(): Tournament[] {
    let tournaments = this.tournamentService.tournaments();
    
    if (this.selectedStatus) {
      tournaments = tournaments.filter(t => t.status === this.selectedStatus);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tournaments = tournaments.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
    }
    
    return tournaments;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'registration_open': return 'success';
      case 'ongoing': return 'info';
      case 'upcoming': return 'warn';
      case 'completed': return 'secondary';
      case 'draft': return 'danger';
      default: return 'secondary';
    }
  }

  getFormatLabel(format: string): string {
    switch (format) {
      case 'round_robin': return 'Round Robin';
      case 'knockout': return 'Knockout';
      case 'group_knockout': return 'Group + Knockout';
      default: return format;
    }
  }

  confirmDelete(tournament: Tournament) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${tournament.name}"? This action cannot be undone.`,
      header: 'Delete Tournament',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.tournamentService.deleteTournament(tournament.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Tournament deleted successfully'
          });
          this.tournamentService.fetchAllTournaments();
        } catch (error: any) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }
      }
    });
  }
}
