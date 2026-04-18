import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SupabaseService } from '@/app/core/services/supabase.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';
import { PlayerService, Player } from '@/app/core/services/player.service';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    Select,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.scss'
})
export class TeamManagementComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private teamService = inject(TeamService);
  private tournamentService = inject(TournamentService);
  private playerService = inject(PlayerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  teams = signal<Team[]>([]);
  tournaments = signal<Tournament[]>([]);
  selectedTournament: string | null = null;
  loading = signal(false);

  rosterDialogVisible = signal(false);
  selectedTeam = signal<Team | null>(null);
  teamPlayers = signal<Player[]>([]);
  loadingRoster = signal(false);

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Disqualified', value: 'disqualified' }
  ];
  selectedStatus: string | null = null;

  ngOnInit() {
    this.loadTournaments();
    this.loadTeams();
  }

  async loadTournaments() {
    await this.tournamentService.fetchAllTournaments();
    this.tournaments.set(this.tournamentService.tournaments());
  }

  async loadTeams() {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('teams')
        .select('*, tournaments(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.teams.set((data || []).map((t: any) => ({
        ...t,
        tournament_name: t.tournaments?.name
      })));
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

  get filteredTeams(): any[] {
    let teams = this.teams();

    if (this.selectedTournament) {
      teams = teams.filter(t => t.tournament_id === this.selectedTournament);
    }

    if (this.selectedStatus) {
      teams = teams.filter(t => t.status === this.selectedStatus);
    }

    return teams;
  }

  get tournamentOptions() {
    return [
      { label: 'All Tournaments', value: null },
      ...this.tournaments().map(t => ({ label: t.name, value: t.id }))
    ];
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warn';
      case 'rejected': return 'danger';
      case 'disqualified': return 'danger';
      default: return 'secondary';
    }
  }

  async updateTeamStatus(team: Team, status: 'approved' | 'rejected' | 'disqualified') {
    try {
      await this.teamService.updateTeam(team.id, { status });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Team ${status} successfully`
      });
      this.loadTeams();
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  confirmApprove(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to approve "${team.team_name}"?`,
      header: 'Approve Team',
      icon: 'pi pi-check-circle',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => this.updateTeamStatus(team, 'approved')
    });
  }

  confirmReject(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject "${team.team_name}"?`,
      header: 'Reject Team',
      icon: 'pi pi-times-circle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.updateTeamStatus(team, 'rejected')
    });
  }

  confirmDisqualify(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to disqualify "${team.team_name}"? This action cannot be easily undone.`,
      header: 'Disqualify Team',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.updateTeamStatus(team, 'disqualified')
    });
  }

  async viewRoster(team: Team) {
    this.selectedTeam.set(team);
    this.rosterDialogVisible.set(true);
    this.loadingRoster.set(true);

    try {
      const players = await this.playerService.getPlayersByTeam(team.id);
      this.teamPlayers.set(players);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    } finally {
      this.loadingRoster.set(false);
    }
  }

  async lockRoster(team: Team) {
    try {
      await this.teamService.updateTeam(team.id, { roster_status: 'locked' });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Roster locked successfully'
      });
      this.loadTeams();
      this.rosterDialogVisible.set(false);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }
}
