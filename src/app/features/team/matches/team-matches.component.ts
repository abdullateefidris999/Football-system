import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '@/app/core/services/auth.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { MatchService, Match } from '@/app/core/services/match.service';

@Component({
  selector: 'app-team-matches',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    SelectButtonModule
  ],
  templateUrl: './team-matches.component.html',
  styleUrl: './team-matches.component.scss'
})
export class TeamMatchesComponent implements OnInit {
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);

  team = signal<Team | null>(null);
  loading = signal(true);

  filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' }
  ];
  selectedFilter = 'all';

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
      await this.matchService.getMatchesByTeam(team.id);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      this.loading.set(false);
    }
  }

  get matches(): Match[] {
    return this.matchService.matches();
  }

  get filteredMatches(): Match[] {
    switch (this.selectedFilter) {
      case 'upcoming':
        return this.matches.filter(m => m.status === 'scheduled');
      case 'completed':
        return this.matches.filter(m => m.status === 'completed');
      default:
        return this.matches;
    }
  }

  get upcomingMatches(): Match[] {
    return this.matches.filter(m => m.status === 'scheduled');
  }

  get completedMatches(): Match[] {
    return this.matches.filter(m => m.status === 'completed');
  }

  isHomeTeam(match: Match): boolean {
    return match.home_team === this.team()?.id;
  }

  getMatchResult(match: Match): 'win' | 'draw' | 'loss' | null {
    if (match.status !== 'completed' || match.home_score === undefined || match.away_score === undefined) {
      return null;
    }

    const isHome = this.isHomeTeam(match);
    const teamScore = isHome ? match.home_score : match.away_score;
    const opponentScore = isHome ? match.away_score : match.home_score;

    if (teamScore > opponentScore) return 'win';
    if (teamScore < opponentScore) return 'loss';
    return 'draw';
  }

  getResultSeverity(result: 'win' | 'draw' | 'loss' | null): 'success' | 'info' | 'danger' | 'secondary' {
    switch (result) {
      case 'win': return 'success';
      case 'draw': return 'info';
      case 'loss': return 'danger';
      default: return 'secondary';
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
