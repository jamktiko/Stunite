import { Component, OnInit } from '@angular/core';
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
export class OrganizerViewComponent implements OnInit {
  events: Event[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) {
    this.loadOrganizerEvents();
  }
  ngOnInit(): void {}
  loadOrganizerEvents() {
    const currentUser = this.authService.getCurrUser();
    if (currentUser) {
      const currentEvents = this.eventService.getEvents()();
      this.events = currentEvents.filter((event) => {
        return event.organizerId === currentUser.organizerId;
      });
    }
  }
  editEvent(event: Event) {
    this.router.navigate(['/organizer-view/edit-event', event._id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  goToEventPage(event: Event) {
    this.router.navigate(['/events', event._id]);
  }
  goToCreateEvent() {
    this.router.navigate(['/organizer-view/create-event']);
  }

  // !!! delete this later
  deletelocalstorage() {
    localStorage.clear();
  }
}
