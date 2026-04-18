import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Match {
  id: string;
  tournament_id: string;
  home_team: string;
  away_team: string;
  match_date: Date | null;
  venue: string | null;
  round: string | null;
  match_number: number | null;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
  created_at: string;
  // Joined fields
  home_team_name?: string;
  away_team_name?: string;
  home_score?: number;
  away_score?: number;
}

export interface CreateMatchDto {
  tournament_id: string;
  home_team: string;
  away_team: string;
  match_date?: string;
  venue?: string;
  round?: string;
  match_number?: number;
}

export interface UpdateMatchDto {
  match_date?: string;
  venue?: string;
  round?: string;
  status?: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private supabase = inject(SupabaseService);

  private matchesSignal = signal<Match[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  matches = this.matchesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          home:teams!home_team(team_name),
          away:teams!away_team(team_name),
          results(home_score, away_score)
        `)
        .eq('tournament_id', tournamentId)
        .order('match_number', { ascending: true });

      if (error) throw error;

      const matches = (data || []).map((m: any) => {
        // Handle results as either array or object
        const result = Array.isArray(m.results) ? m.results[0] : m.results;
        return {
          ...m,
          match_date: m.match_date ? new Date(m.match_date) : null,
          home_team_name: m.home?.team_name,
          away_team_name: m.away?.team_name,
          home_score: result?.home_score,
          away_score: result?.away_score
        };
      });

      this.matchesSignal.set(matches);
      return matches;
    } catch (err: any) {
      this.errorSignal.set(err.message);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getMatchesByTeam(teamId: string): Promise<Match[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          home:teams!home_team(team_name),
          away:teams!away_team(team_name),
          results(home_score, away_score)
        `)
        .or(`home_team.eq.${teamId},away_team.eq.${teamId}`)
        .order('match_date', { ascending: true });

      if (error) throw error;

      const matches = (data || []).map((m: any) => {
        // Handle results as either array or object
        const result = Array.isArray(m.results) ? m.results[0] : m.results;
        return {
          ...m,
          match_date: m.match_date ? new Date(m.match_date) : null,
          home_team_name: m.home?.team_name,
          away_team_name: m.away?.team_name,
          home_score: result?.home_score,
          away_score: result?.away_score
        };
      });

      this.matchesSignal.set(matches);
      return matches;
    } catch (err: any) {
      this.errorSignal.set(err.message);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createMatch(match: CreateMatchDto): Promise<Match> {
    const { data, error } = await this.supabase
      .from('matches')
      .insert(match)
      .select()
      .single();

    if (error) throw error;
    this.matchesSignal.update(matches => [...matches, data]);
    return data;
  }

  async updateMatch(id: string, updates: UpdateMatchDto): Promise<Match> {
    const { data, error } = await this.supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    const updatedMatch = {
      ...data,
      match_date: data.match_date ? new Date(data.match_date) : null
    };
    
    this.matchesSignal.update(matches => 
      matches.map(m => m.id === id ? { ...m, ...updatedMatch } : m)
    );
    return updatedMatch;
  }

  async deleteMatch(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) throw error;
    this.matchesSignal.update(matches => matches.filter(m => m.id !== id));
  }

  async generateRoundRobinFixtures(tournamentId: string, teamIds: string[]): Promise<Match[]> {
    const matches: CreateMatchDto[] = [];
    const n = teamIds.length;
    let matchNumber = 1;

    // Round-robin algorithm
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        matches.push({
          tournament_id: tournamentId,
          home_team: teamIds[i],
          away_team: teamIds[j],
          round: `Round ${Math.floor(matchNumber / Math.ceil(n / 2)) + 1}`,
          match_number: matchNumber++
        });
      }
    }

    const { data, error } = await this.supabase
      .from('matches')
      .insert(matches)
      .select();

    if (error) throw error;
    this.matchesSignal.set(data || []);
    return data || [];
  }

  async getUpcomingMatches(limit: number = 5): Promise<Match[]> {
    const { data, error } = await this.supabase
      .from('matches')
      .select(`
        *,
        home:teams!home_team(team_name),
        away:teams!away_team(team_name),
        tournaments(name)
      `)
      .eq('status', 'scheduled')
      .gte('match_date', new Date().toISOString())
      .order('match_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((m: any) => ({
      ...m,
      match_date: m.match_date ? new Date(m.match_date) : null,
      home_team_name: m.home?.team_name,
      away_team_name: m.away?.team_name
    }));
  }
}
