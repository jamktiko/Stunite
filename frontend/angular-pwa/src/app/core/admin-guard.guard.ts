import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 


  if (authService.isAuthenticated() && authService.isUserAdmin()) {
    return true;
  } else {
    router.navigate(['/events']); 
    return false;
  }
};
