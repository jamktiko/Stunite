import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { EventService } from '../../features/events/event.service';
import { AuthService } from '../../core/services/auth.service';
import { Event } from '../../shared/models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const eventId = route.paramMap.get('id');
    if (eventId) {
      return this.eventService.getEventById(eventId).pipe(
        switchMap((event: Event | undefined) => {
          if (event) {
            return this.checkEventVisibility(event);
          } else {
            console.error('Event not found');
            return this.redirectToHome();
          }
        })
      );
    } else {
      console.error('Invalid event ID');
      return this.redirectToHome();
    }
  }

  private checkEventVisibility(event: Event): Observable<boolean> {
    const currentUser = this.authService.getCurrUser();
    const isOrganizer = this.authService.getIsOrganizer();
    const currentTime = new Date();
    const publishDateTime = event.publishDateTime
      ? new Date(event.publishDateTime)
      : null;

    if (!currentUser) {
      console.warn('User not logged in');
      this.router.navigate(['/mobile-login']); // Navigoi kirjautumissivulle
      return of(false);
    }

    if (isOrganizer || (publishDateTime && currentTime >= publishDateTime)) {
      return of(true);
    }

    console.warn('Event not yet published or user unauthorized');
    this.router.navigate(['/']);
    return of(false);
  }

  private redirectToHome(): Observable<boolean> {
    this.router.navigate(['/']);
    return of(false);
  }
}
