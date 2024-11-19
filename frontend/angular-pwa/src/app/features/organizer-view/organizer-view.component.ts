import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import { EventService } from '../events/event.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-organizer-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css'],
})
export class OrganizerViewComponent implements OnInit {
  events: Event[] = [];
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  activeTab: string = 'upcoming';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadOrganizerEvents();
  }

  // load events manually from backend without signals
  loadOrganizerEvents() {
    const currentUser = this.authService.getCurrUser();
    if (currentUser) {
      this.eventService.loadEvents().subscribe((events) => {
        // Filter events for the current organizer
        const organizerEvents = events.filter(
          (event) => event.organizerId === currentUser.organizerId
        );

        // Separate events into upcoming and past
        const currentDate = new Date();
        this.upcomingEvents = organizerEvents
          .filter((event) => {
            const eventDate = new Date(this.formatDateToISO(event.date));
            return eventDate >= currentDate;
          })
          .sort((a, b) => this.compareEventDates(a, b));

        this.pastEvents = organizerEvents
          .filter((event) => {
            const eventDate = new Date(this.formatDateToISO(event.date));
            return eventDate < currentDate;
          })
          .sort((a, b) => this.compareEventDates(b, a));
      });
    }
  }

  // Format date string to ISO format
  private formatDateToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Compare two event dates
  private compareEventDates(a: Event, b: Event): number {
    const dateA = new Date(this.formatDateToISO(a.date) + 'T' + a.startingTime);
    const dateB = new Date(this.formatDateToISO(b.date) + 'T' + b.startingTime);
    return dateA.getTime() - dateB.getTime();
  }

  editEvent(event: Event) {
    this.router.navigate(['/organizer-view/edit-event', event._id]);
  }

  deleteEvent(eventId: string): void {
    const confirmDelete = window.confirm(
      'Haluatko varmasti poistaa tämän tapahtuman pysyvästi?'
    );

    if (confirmDelete) {
      this.eventService.deleteEvent(eventId).subscribe(
        (response) => {
          console.log('Event deleted successfully:', response);
          // Päivitetään tapahtumat ilman selaimen refreashausta
          this.events = this.events.filter((event) => event._id !== eventId);
          this.loadOrganizerEvents();
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    } else {
      console.log('Event deletion cancelled');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToEventPage(event: Event) {
    this.router.navigate(['/events', event._id]);
  }
  goToPastEventPage(event: Event) {
    this.router.navigate(['/event-archive', event._id]);
  }
  goToCreateEvent() {
    this.router.navigate(['/organizer-view/create-event']);
  }

  goToOrganizerCalendar() {
    this.router.navigate(['/organizer-view/organizer-calendar']);
  }
}
