import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SupabaseService } from '@/app/core/services/supabase.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';
import { MatchService, Match } from '@/app/core/services/match.service';

@Component({
  selector: 'app-match-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    Select,
    DatePickerModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './match-scheduler.component.html',
  styleUrl: './match-scheduler.component.scss'
})
export class MatchSchedulerComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private tournamentService = inject(TournamentService);
  matchService = inject(MatchService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  tournaments = signal<Tournament[]>([]);
  selectedTournamentId: string | null = null;
  selectedTournament = signal<Tournament | null>(null);
  approvedTeams = signal<any[]>([]);
  loading = signal(false);
  generating = signal(false);

  addMatchDialogVisible = signal(false);
  newMatch = {
    home_team: '',
    away_team: '',
    match_date: null as Date | null,
    venue: '',
    round: ''
  };

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

  get teamOptions() {
    return this.approvedTeams().map(t => ({ label: t.team_name, value: t.id }));
  }

  async onTournamentChange() {
    if (!this.selectedTournamentId) {
      this.selectedTournament.set(null);
      this.approvedTeams.set([]);
      return;
    }

    this.loading.set(true);
    try {
      const tournament = await this.tournamentService.getTournamentById(this.selectedTournamentId);
      this.selectedTournament.set(tournament);

      await this.matchService.getMatchesByTournament(this.selectedTournamentId);

      const { data: teams } = await this.supabase
        .from('teams')
        .select('id, team_name')
        .eq('tournament_id', this.selectedTournamentId)
        .eq('status', 'approved');

      this.approvedTeams.set(teams || []);
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

  async generateFixtures() {
    if (!this.selectedTournamentId || this.approvedTeams().length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Need at least 2 approved teams to generate fixtures'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'This will generate round-robin fixtures for all approved teams. Existing matches will be preserved. Continue?',
      header: 'Generate Fixtures',
      icon: 'pi pi-calendar',
      accept: async () => {
        this.generating.set(true);
        try {
          const teamIds = this.approvedTeams().map(t => t.id);
          await this.matchService.generateRoundRobinFixtures(this.selectedTournamentId!, teamIds);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Fixtures generated successfully'
          });

          await this.matchService.getMatchesByTournament(this.selectedTournamentId!);
        } catch (error: any) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        } finally {
          this.generating.set(false);
        }
      }
    });
  }

  showAddMatchDialog() {
    this.newMatch = {
      home_team: '',
      away_team: '',
      match_date: null,
      venue: '',
      round: ''
    };
    this.addMatchDialogVisible.set(true);
  }

  async addMatch() {
    if (!this.newMatch.home_team || !this.newMatch.away_team) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select both teams'
      });
      return;
    }

    if (this.newMatch.home_team === this.newMatch.away_team) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Home and away teams must be different'
      });
      return;
    }

    try {
      await this.matchService.createMatch({
        tournament_id: this.selectedTournamentId!,
        home_team: this.newMatch.home_team,
        away_team: this.newMatch.away_team,
        match_date: this.newMatch.match_date?.toISOString(),
        venue: this.newMatch.venue,
        round: this.newMatch.round
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Match added successfully'
      });

      this.addMatchDialogVisible.set(false);
      await this.matchService.getMatchesByTournament(this.selectedTournamentId!);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  async updateMatchDate(match: Match, date: Date) {
    try {
      await this.matchService.updateMatch(match.id, {
        match_date: date.toISOString()
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Match date updated'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  async updateMatchVenue(match: Match, venue: string) {
    try {
      await this.matchService.updateMatch(match.id, { venue });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  async updateMatchRound(match: Match, round: string) {
    try {
      await this.matchService.updateMatch(match.id, { round });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  confirmDeleteMatch(match: Match) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this match?',
      header: 'Delete Match',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.matchService.deleteMatch(match.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Match deleted successfully'
          });
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
