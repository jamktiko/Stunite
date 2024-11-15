import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs';
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
            return this.redirectToHome();
          }
        })
      );
    } else {
      return this.redirectToHome();
    }
  }

  private checkEventVisibility(event: Event): Observable<boolean> {
    const currentUser = this.authService.getCurrUser();
    const isOrganizer = this.authService.getIsOrganizer();
    const currentTime = new Date();
    const publishDateTime = new Date(event.publishDateTime);

    if (isOrganizer) {
      return of(true);
    }

    if (currentTime >= publishDateTime) {
      return of(true);
    }

    this.router.navigate(['/home']);
    return of(false);
  }

  private redirectToHome(): Observable<boolean> {
    this.router.navigate(['/home']);
    return of(false);
  }
}
