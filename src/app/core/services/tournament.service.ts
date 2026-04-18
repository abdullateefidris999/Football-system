import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  format: 'round_robin' | 'knockout' | 'group_knockout';
  max_teams: number;
  players_per_team: number;
  registration_deadline: string;
  start_date: string;
  end_date: string | null;
  banner_url: string | null;
  status: 'draft' | 'registration_open' | 'upcoming' | 'ongoing' | 'completed';
  group_count: number | null;
  qualifiers_per_group: number;
  knockout_seeding_strategy: 'random_draw' | 'ranked_1vN' | 'group_cross_seed';
  created_by: string | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private supabase = inject(SupabaseService);

  private tournamentsSignal = signal<Tournament[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  tournaments = this.tournamentsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async fetchOpenTournaments() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'registration_open')
        .order('start_date', { ascending: true });

      if (error) throw error;
      this.tournamentsSignal.set(data || []);
    } catch (err: any) {
      this.errorSignal.set(err.message);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async fetchAllTournaments() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.tournamentsSignal.set(data || []);
    } catch (err: any) {
      this.errorSignal.set(err.message);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    const { data, error } = await this.supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTournament(tournament: Partial<Tournament>): Promise<Tournament> {
    const { data, error } = await this.supabase
      .from('tournaments')
      .insert(tournament)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const { data, error } = await this.supabase
      .from('tournaments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTournament(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async uploadBanner(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await this.supabase.storage
      .from('tournament-banners')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = this.supabase.storage
      .from('tournament-banners')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
