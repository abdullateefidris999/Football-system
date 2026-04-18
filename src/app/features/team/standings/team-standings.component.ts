import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@/app/core/services/auth.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { StandingsService, Standing } from '@/app/core/services/standings.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-team-standings',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  templateUrl: './team-standings.component.html',
  styleUrl: './team-standings.component.scss'
})
export class TeamStandingsComponent implements OnInit {
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private standingsService = inject(StandingsService);
  private tournamentService = inject(TournamentService);

  team = signal<Team | null>(null);
  tournament = signal<Tournament | null>(null);
  loading = signal(true);
  refreshing = signal(false);

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      const user = this.authService.user();
      if (!user) return;

      const team = await this.teamService.getTeamByUserId(user.id);
      if (!team) return;

      this.team.set(team);

      const tournament = await this.tournamentService.getTournamentById(team.tournament_id);
      this.tournament.set(tournament);

      await this.standingsService.getStandingsByTournament(team.tournament_id);
    } catch (error) {
      console.error('Error loading standings:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async refresh() {
    if (!this.team()) return;
    
    this.refreshing.set(true);
    try {
      await this.standingsService.getStandingsByTournament(this.team()!.tournament_id);
    } catch (error) {
      console.error('Error refreshing standings:', error);
    } finally {
      this.refreshing.set(false);
    }
  }

  get standings(): Standing[] {
    return this.standingsService.standings();
  }

  get teamRank(): number {
    if (!this.team()) return 0;
    return this.standingsService.getTeamRank(this.team()!.id);
  }

  get teamStanding(): Standing | undefined {
    if (!this.team()) return undefined;
    return this.standings.find(s => s.team_id === this.team()!.id);
  }

  isCurrentTeam(standing: Standing): boolean {
    return standing.team_id === this.team()?.id;
  }
}
