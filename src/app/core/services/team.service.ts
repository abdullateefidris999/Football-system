import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Team {
  id: string;
  team_name: string;
  logo: string | null;
  tournament_id: string;
  email: string;
  phone_number: string | null;
  user_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'disqualified';
  roster_status: 'draft' | 'submitted' | 'locked';
  roster_submitted_at: string | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private supabase = inject(SupabaseService);

  private teamsSignal = signal<Team[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  teams = this.teamsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async registerTeam(teamData: {
    team_name: string;
    tournament_id: string;
    email: string;
    phone_number?: string;
    user_id: string;
  }): Promise<Team> {
    const { data, error } = await this.supabase
      .from('teams')
      .insert({
        ...teamData,
        status: 'pending',
        roster_status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTeamsByTournament(tournamentId: string) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('teams')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.teamsSignal.set(data || []);
      return data;
    } catch (err: any) {
      this.errorSignal.set(err.message);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTeamByUserId(userId: string): Promise<Team | null> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getTeamById(id: string): Promise<Team | null> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const { data, error } = await this.supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async uploadLogo(teamId: string, file: File): Promise<string> {
    const fileName = `${teamId}/${Date.now()}-${file.name}`;
    const { error } = await this.supabase.storage
      .from('team-logos')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = this.supabase.storage
      .from('team-logos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
