import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../shared/models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  isOrganizer: boolean = false;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (event: Event) => {
          this.event = event;
        },
        error: (err) => {
          console.error('Error fetching event:', err);
        },
      });
    }

    this.isOrganizer = this.authService.getIsOrganizer();
  }
  //
  // getFullImageUrl(imageUrl: string): string {
  //   const baseUrl = 'http://localhost:3001';
  //   return imageUrl ? baseUrl + imageUrl : 'assets/placeholder.png';
  // }

  //
  // formats ticketsale times to ->  hh:mm dd.mm.yyyy
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
}
