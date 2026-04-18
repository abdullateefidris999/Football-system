import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const teamGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  while (authService.isLoading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/team/login']);
    return false;
  }

  if (!authService.isTeamManager()) {
    router.navigate(['/team/login']);
    return false;
  }

  return true;
};
