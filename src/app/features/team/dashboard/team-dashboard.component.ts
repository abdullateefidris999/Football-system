import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '@/app/core/services/auth.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { PlayerService } from '@/app/core/services/player.service';
import { MatchService, Match } from '@/app/core/services/match.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule
  ],
  templateUrl: './team-dashboard.component.html',
  styleUrl: './team-dashboard.component.scss'
})
export class TeamDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);
  private matchService = inject(MatchService);
  private tournamentService = inject(TournamentService);

  team = signal<Team | null>(null);
  tournament = signal<Tournament | null>(null);
  playerCount = signal(0);
  upcomingMatches = signal<Match[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadTeamData();
  }

  async loadTeamData() {
    this.loading.set(true);
    try {
      const user = this.authService.user();
      if (!user) return;

      const team = await this.teamService.getTeamByUserId(user.id);
      if (!team) {
        this.loading.set(false);
        return;
      }

      this.team.set(team);

      const [tournament, players, matches] = await Promise.all([
        this.tournamentService.getTournamentById(team.tournament_id),
        this.playerService.getPlayersByTeam(team.id),
        this.matchService.getMatchesByTeam(team.id)
      ]);

      this.tournament.set(tournament);
      this.playerCount.set(players.length);
      
      const upcoming = matches
        .filter(m => m.status === 'scheduled')
        .slice(0, 3);
      this.upcomingMatches.set(upcoming);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warn';
      case 'rejected': return 'danger';
      case 'locked': return 'success';
      case 'submitted': return 'info';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  }
}
