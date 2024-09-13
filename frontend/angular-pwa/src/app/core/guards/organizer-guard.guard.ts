import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const organizerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();

  if (authService.isAuthenticated() && userRole === 'organizer') {
    return true;
  } else if (authService.isAuthenticated() && userRole === 'admin') {
    router.navigate(['/admin-view']);
    return false;
  } else {
    router.navigate(['/events']);
    return false;
  }
};
