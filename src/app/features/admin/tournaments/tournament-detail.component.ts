import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { MatchService, Match } from '@/app/core/services/match.service';
import { StandingsService, Standing } from '@/app/core/services/standings.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    ButtonModule,
    TagModule,
    TableModule,
    ProgressSpinnerModule
  ],
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.scss'
})
export class TournamentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);
  private standingsService = inject(StandingsService);

  tournament = signal<Tournament | null>(null);
  teams = signal<Team[]>([]);
  matches = signal<Match[]>([]);
  standings = signal<Standing[]>([]);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTournamentData(id);
    }
  }

  async loadTournamentData(id: string) {
    this.loading.set(true);
    try {
      const [tournament, teams, matches, standings] = await Promise.all([
        this.tournamentService.getTournamentById(id),
        this.teamService.getTeamsByTournament(id),
        this.matchService.getMatchesByTournament(id),
        this.standingsService.getStandingsByTournament(id)
      ]);

      this.tournament.set(tournament);
      this.teams.set(teams || []);
      this.matches.set(matches);
      this.standings.set(standings);
    } catch (error) {
      console.error('Error loading tournament:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'registration_open': return 'success';
      case 'ongoing': return 'info';
      case 'upcoming': return 'warn';
      case 'completed': return 'secondary';
      case 'draft': return 'danger';
      case 'approved': return 'success';
      case 'pending': return 'warn';
      case 'rejected': return 'danger';
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
}
