import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const organizerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrUser();

  if (isAuthenticated && currentUser && currentUser.organizationName) {
    return true;
  }
  router.navigate(['/events']);
  return false;
};
