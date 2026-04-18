import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Result {
  id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private supabase = inject(SupabaseService);

  async getResultByMatch(matchId: string): Promise<Result | null> {
    const { data, error } = await this.supabase
      .from('results')
      .select('*')
      .eq('match_id', matchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async submitResult(matchId: string, homeScore: number, awayScore: number): Promise<Result> {
    // Check if result already exists
    const existing = await this.getResultByMatch(matchId);

    let result: Result;

    if (existing) {
      // Update existing result
      const { data, error } = await this.supabase
        .from('results')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          updated_at: new Date().toISOString()
        })
        .eq('match_id', matchId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new result
      const { data, error } = await this.supabase
        .from('results')
        .insert({
          match_id: matchId,
          home_score: homeScore,
          away_score: awayScore
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Update match status to completed
    const { error: matchError } = await this.supabase
      .from('matches')
      .update({ status: 'completed' })
      .eq('id', matchId);

    if (matchError) throw matchError;

    return result;
  }

  async getResultsWithMatches(tournamentId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('matches')
      .select(`
        *,
        home:teams!home_team(id, team_name),
        away:teams!away_team(id, team_name),
        results(id, home_score, away_score)
      `)
      .eq('tournament_id', tournamentId)
      .order('match_number', { ascending: true });

    if (error) throw error;

    return (data || []).map((m: any) => {
      // Handle results as either array or object
      const result = Array.isArray(m.results) ? m.results[0] : m.results;
      return {
        ...m,
        home_team_name: m.home?.team_name,
        away_team_name: m.away?.team_name,
        home_score: result?.home_score ?? null,
        away_score: result?.away_score ?? null,
        result: result || null
      };
    });
  }
}
