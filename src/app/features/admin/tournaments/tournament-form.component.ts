import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TournamentService, Tournament } from '@/app/core/services/tournament.service';

@Component({
  selector: 'app-tournament-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    Textarea,
    InputNumberModule,
    Select,
    DatePickerModule,
    FileUploadModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './tournament-form.component.html',
  styleUrl: './tournament-form.component.scss'
})
export class TournamentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);
  private messageService = inject(MessageService);

  isEditMode = signal(false);
  tournamentId = signal<string | null>(null);
  loading = signal(false);
  bannerFile: File | null = null;

  formatOptions = [
    { label: 'Round Robin', value: 'round_robin' },
    { label: 'Knockout', value: 'knockout' },
    { label: 'Group + Knockout', value: 'group_knockout' }
  ];

  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Registration Open', value: 'registration_open' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' }
  ];

  seedingOptions = [
    { label: 'Random Draw', value: 'random_draw' },
    { label: 'Ranked (1 vs N)', value: 'ranked_1vN' },
    { label: 'Group Cross Seed', value: 'group_cross_seed' }
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    format: ['round_robin', [Validators.required]],
    max_teams: [8, [Validators.required, Validators.min(2)]],
    players_per_team: [11, [Validators.required, Validators.min(1)]],
    registration_deadline: [null, [Validators.required]],
    start_date: [null, [Validators.required]],
    end_date: [null],
    status: ['draft'],
    group_count: [null],
    qualifiers_per_group: [2],
    knockout_seeding_strategy: ['random_draw']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.tournamentId.set(id);
      this.loadTournament(id);
    }
  }

  async loadTournament(id: string) {
    this.loading.set(true);
    try {
      const tournament = await this.tournamentService.getTournamentById(id);
      if (tournament) {
        this.form.patchValue({
          ...tournament,
          registration_deadline: new Date(tournament.registration_deadline),
          start_date: new Date(tournament.start_date),
          end_date: tournament.end_date ? new Date(tournament.end_date) : null
        });
      }
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

  get isGroupKnockout(): boolean {
    return this.form.get('format')?.value === 'group_knockout';
  }

  onBannerSelect(event: any) {
    this.bannerFile = event.files[0];
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      let bannerUrl: string | undefined;
      
      if (this.bannerFile) {
        bannerUrl = await this.tournamentService.uploadBanner(this.bannerFile);
      }

      const formValue = this.form.value;
      const data: Partial<Tournament> = {
        ...formValue,
        registration_deadline: formValue.registration_deadline?.toISOString().split('T')[0],
        start_date: formValue.start_date?.toISOString().split('T')[0],
        end_date: formValue.end_date?.toISOString().split('T')[0] || null,
        banner_url: bannerUrl
      };

      if (this.isEditMode() && this.tournamentId()) {
        await this.tournamentService.updateTournament(this.tournamentId()!, data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tournament updated successfully'
        });
      } else {
        await this.tournamentService.createTournament(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tournament created successfully'
        });
      }

      setTimeout(() => {
        this.router.navigate(['/admin/tournaments']);
      }, 1000);
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
}
