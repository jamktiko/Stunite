import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import { EventService } from '../events/event.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-organizer-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-view.component.html',
  styleUrl: './organizer-view.component.css',
})
export class OrganizerViewComponent {
  events: Event[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) {
    this.loadOrganizerEvents();
  }
  loadOrganizerEvents() {
    const currentUser = this.authService.getCurrUser();
    if (currentUser) {
      const currentEvents = this.eventService.getEvents()();
      this.events = currentEvents.filter(
        (event) => event.organizerId === currentUser.organizerId
      );
      console.log(this.events);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToCreateEvent() {
    this.router.navigate(['/organizer-view/create-event']);
  }

  // !!! delete this later
  deletelocalstorage() {
    localStorage.clear();
  }
}
