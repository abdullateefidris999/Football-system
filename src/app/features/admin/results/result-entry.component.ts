import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';
import { ResultService } from '@/app/core/services/result.service';

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    Select,
    InputNumberModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private resultService = inject(ResultService);
  private messageService = inject(MessageService);

  tournaments = signal<Tournament[]>([]);
  selectedTournamentId: string | null = null;
  matches = signal<any[]>([]);
  loading = signal(false);

  statusFilter: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Completed', value: 'completed' }
  ];

  ngOnInit() {
    this.loadTournaments();
  }

  async loadTournaments() {
    await this.tournamentService.fetchAllTournaments();
    this.tournaments.set(this.tournamentService.tournaments());
  }

  get tournamentOptions() {
    return this.tournaments().map(t => ({ label: t.name, value: t.id }));
  }

  get filteredMatches() {
    let matches = this.matches();
    if (this.statusFilter) {
      matches = matches.filter(m => m.status === this.statusFilter);
    }
    return matches;
  }

  async onTournamentChange() {
    if (!this.selectedTournamentId) {
      this.matches.set([]);
      return;
    }

    this.loading.set(true);
    try {
      const results = await this.resultService.getResultsWithMatches(this.selectedTournamentId);
      this.matches.set(results);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    } finally {
      this.loading.set(false);
    }
  }

  async submitResult(match: any) {
    if (match.home_score === null || match.away_score === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter both scores'
      });
      return;
    }

    try {
      await this.resultService.submitResult(match.id, match.home_score, match.away_score);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Result saved successfully'
      });

      // Reload to get updated standings
      await this.onTournamentChange();
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

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
