import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { adminGuard } from './core/guards/admin.guard';
import { teamGuard } from './core/guards/team.guard';

export const routes: Routes = [
  // Public routes (no layout shell)
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'register/:tournamentId',
    loadComponent: () => import('./features/auth/team-register/team-register.component').then(m => m.TeamRegisterComponent)
  },
  {
    path: 'team/login',
    loadComponent: () => import('./features/auth/team-login/team-login.component').then(m => m.TeamLoginComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // Admin portal (with layout shell, protected)
  {
    path: 'admin',
    component: AppLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'tournaments',
        loadComponent: () => import('./features/admin/tournaments/tournament-list.component').then(m => m.TournamentListComponent)
      },
      {
        path: 'tournaments/new',
        loadComponent: () => import('./features/admin/tournaments/tournament-form.component').then(m => m.TournamentFormComponent)
      },
      {
        path: 'tournaments/:id',
        loadComponent: () => import('./features/admin/tournaments/tournament-detail.component').then(m => m.TournamentDetailComponent)
      },
      {
        path: 'tournaments/:id/edit',
        loadComponent: () => import('./features/admin/tournaments/tournament-form.component').then(m => m.TournamentFormComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./features/admin/teams/team-management.component').then(m => m.TeamManagementComponent)
      },
      {
        path: 'matches',
        loadComponent: () => import('./features/admin/matches/match-scheduler.component').then(m => m.MatchSchedulerComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/admin/results/result-entry.component').then(m => m.ResultEntryComponent)
      }
    ]
  },

  // Team portal (with layout shell, protected)
  {
    path: 'team',
    component: AppLayout,
    canActivate: [teamGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/team/dashboard/team-dashboard.component').then(m => m.TeamDashboardComponent)
      },
      {
        path: 'roster',
        loadComponent: () => import('./features/team/roster/roster-management.component').then(m => m.RosterManagementComponent)
      },
      {
        path: 'matches',
        loadComponent: () => import('./features/team/matches/team-matches.component').then(m => m.TeamMatchesComponent)
      },
      {
        path: 'standings',
        loadComponent: () => import('./features/team/standings/team-standings.component').then(m => m.TeamStandingsComponent)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/' }
];
