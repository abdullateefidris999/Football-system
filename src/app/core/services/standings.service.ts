import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Standing {
  id: string;
  tournament_id: string;
  team_id: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  updated_at: string;
  // Joined fields
  team_name?: string;
  team_logo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private supabase = inject(SupabaseService);

  private standingsSignal = signal<Standing[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  standings = this.standingsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async getStandingsByTournament(tournamentId: string): Promise<Standing[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('standings')
        .select(`
          *,
          teams(team_name, logo)
        `)
        .eq('tournament_id', tournamentId)
        .order('points', { ascending: false })
        .order('goal_difference', { ascending: false })
        .order('goals_for', { ascending: false });

      if (error) throw error;

      const standings = (data || []).map((s: any) => ({
        ...s,
        team_name: s.teams?.team_name,
        team_logo: s.teams?.logo
      }));

      this.standingsSignal.set(standings);
      return standings;
    } catch (err: any) {
      this.errorSignal.set(err.message);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async initializeStandingsForTeam(tournamentId: string, teamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('standings')
      .upsert({
        tournament_id: tournamentId,
        team_id: teamId,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0
      }, {
        onConflict: 'tournament_id,team_id'
      });

    if (error) throw error;
  }

  getTeamRank(teamId: string): number {
    const standings = this.standingsSignal();
    const index = standings.findIndex(s => s.team_id === teamId);
    return index >= 0 ? index + 1 : 0;
  }
}
