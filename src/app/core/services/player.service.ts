import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Player {
  id: string;
  name: string;
  department: string | null;
  level: string | null;
  jersey_number: number | null;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | null;
  team_id: string;
  is_captain: boolean;
  created_at: string;
}

export interface CreatePlayerDto {
  name: string;
  department?: string;
  level?: string;
  jersey_number?: number;
  position?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  team_id: string;
  is_captain?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private supabase = inject(SupabaseService);

  private playersSignal = signal<Player[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  players = this.playersSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('jersey_number', { ascending: true });

      if (error) throw error;
      this.playersSignal.set(data || []);
      return data || [];
    } catch (err: any) {
      this.errorSignal.set(err.message);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async addPlayer(player: CreatePlayerDto): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .insert(player)
      .select()
      .single();

    if (error) throw error;
    
    // Update local state
    this.playersSignal.update(players => [...players, data]);
    return data;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Update local state
    this.playersSignal.update(players => 
      players.map(p => p.id === id ? data : p)
    );
    return data;
  }

  async deletePlayer(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // Update local state
    this.playersSignal.update(players => 
      players.filter(p => p.id !== id)
    );
  }

  async setCaptain(teamId: string, playerId: string): Promise<void> {
    // First, unset all captains for this team
    const { error: unsetError } = await this.supabase
      .from('players')
      .update({ is_captain: false })
      .eq('team_id', teamId);

    if (unsetError) throw unsetError;

    // Then set the new captain
    const { error: setError } = await this.supabase
      .from('players')
      .update({ is_captain: true })
      .eq('id', playerId);

    if (setError) throw setError;

    // Update local state
    this.playersSignal.update(players => 
      players.map(p => ({
        ...p,
        is_captain: p.id === playerId
      }))
    );
  }

  async getPlayerCount(teamId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);

    if (error) throw error;
    return count || 0;
  }

  hasCaptain(): boolean {
    return this.playersSignal().some(p => p.is_captain);
  }
}
