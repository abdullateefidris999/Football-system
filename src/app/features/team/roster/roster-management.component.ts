import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '@/app/core/services/auth.service';
import { TeamService, Team } from '@/app/core/services/team.service';
import { PlayerService, Player, CreatePlayerDto } from '@/app/core/services/player.service';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-roster-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    Select,
    CheckboxModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './roster-management.component.html',
  styleUrl: './roster-management.component.scss'
})
export class RosterManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  playerService = inject(PlayerService);
  private tournamentService = inject(TournamentService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  team = signal<Team | null>(null);
  tournament = signal<Tournament | null>(null);
  loading = signal(true);
  saving = signal(false);

  playerDialogVisible = signal(false);
  editingPlayer = signal<Player | null>(null);

  positionOptions = [
    { label: 'Goalkeeper', value: 'goalkeeper' },
    { label: 'Defender', value: 'defender' },
    { label: 'Midfielder', value: 'midfielder' },
    { label: 'Forward', value: 'forward' }
  ];

  playerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    department: [''],
    level: [''],
    jersey_number: [null],
    position: [null]
  });

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

      const [tournament] = await Promise.all([
        this.tournamentService.getTournamentById(team.tournament_id),
        this.playerService.getPlayersByTeam(team.id)
      ]);

      this.tournament.set(tournament);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    } finally {
      this.loading.set(false);
    }
  }

  get players() {
    return this.playerService.players();
  }

  get isRosterLocked(): boolean {
    return this.team()?.roster_status === 'locked';
  }

  get canSubmitRoster(): boolean {
    const team = this.team();
    const tournament = this.tournament();
    if (!team || !tournament) return false;
    
    return (
      team.roster_status === 'draft' &&
      this.players.length >= tournament.players_per_team &&
      this.playerService.hasCaptain()
    );
  }

  showAddDialog() {
    this.editingPlayer.set(null);
    this.playerForm.reset();
    this.playerDialogVisible.set(true);
  }

  showEditDialog(player: Player) {
    this.editingPlayer.set(player);
    this.playerForm.patchValue({
      name: player.name,
      department: player.department,
      level: player.level,
      jersey_number: player.jersey_number,
      position: player.position
    });
    this.playerDialogVisible.set(true);
  }

  async savePlayer() {
    if (this.playerForm.invalid || !this.team()) return;

    this.saving.set(true);
    try {
      const formValue = this.playerForm.value;

      if (this.editingPlayer()) {
        await this.playerService.updatePlayer(this.editingPlayer()!.id, formValue);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Player updated successfully'
        });
      } else {
        const playerData: CreatePlayerDto = {
          ...formValue,
          team_id: this.team()!.id
        };
        await this.playerService.addPlayer(playerData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Player added successfully'
        });
      }

      this.playerDialogVisible.set(false);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(player: Player) {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${player.name}" from the roster?`,
      header: 'Remove Player',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.playerService.deletePlayer(player.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Removed',
            detail: 'Player removed from roster'
          });
        } catch (error: any) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }
      }
    });
  }

  async setCaptain(player: Player) {
    try {
      await this.playerService.setCaptain(this.team()!.id, player.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${player.name} is now the team captain`
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  }

  async submitRoster() {
    this.confirmationService.confirm({
      message: 'Once submitted, you cannot add or remove players until admin reviews. Continue?',
      header: 'Submit Roster',
      icon: 'pi pi-send',
      accept: async () => {
        try {
          await this.teamService.updateTeam(this.team()!.id, {
            roster_status: 'submitted',
            roster_submitted_at: new Date().toISOString()
          });

          this.team.set({
            ...this.team()!,
            roster_status: 'submitted'
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Submitted',
            detail: 'Roster submitted for review'
          });
        } catch (error: any) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }
      }
    });
  }
}
