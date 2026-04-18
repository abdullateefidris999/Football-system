import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SupabaseService } from '@/app/core/services/supabase.service';

interface DashboardStats {
  totalTournaments: number;
  activeTournaments: number;
  totalTeams: number;
  pendingApprovals: number;
  upcomingMatches: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TableModule, TagModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private supabase = inject(SupabaseService);

  stats = signal<DashboardStats>({
    totalTournaments: 0,
    activeTournaments: 0,
    totalTeams: 0,
    pendingApprovals: 0,
    upcomingMatches: 0
  });

  recentTeams = signal<any[]>([]);
  upcomingMatches = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.loading.set(true);
    try {
      const [tournaments, teams, pendingTeams, matches] = await Promise.all([
        this.supabase.from('tournaments').select('id, status'),
        this.supabase.from('teams').select('id, team_name, status, created_at, tournaments(name)').order('created_at', { ascending: false }).limit(5),
        this.supabase.from('teams').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        this.supabase.from('matches').select('*, home:teams!home_team(team_name), away:teams!away_team(team_name)').eq('status', 'scheduled').order('match_date', { ascending: true }).limit(5)
      ]);

      const tournamentData = tournaments.data || [];
      this.stats.set({
        totalTournaments: tournamentData.length,
        activeTournaments: tournamentData.filter((t: any) => ['registration_open', 'ongoing'].includes(t.status)).length,
        totalTeams: (teams.data || []).length,
        pendingApprovals: pendingTeams.count || 0,
        upcomingMatches: (matches.data || []).length
      });

      this.recentTeams.set((teams.data || []).map((t: any) => ({
        ...t,
        tournament_name: t.tournaments?.name
      })));

      this.upcomingMatches.set((matches.data || []).map((m: any) => ({
        ...m,
        home_team_name: m.home?.team_name,
        away_team_name: m.away?.team_name
      })));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warn';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  }
}
