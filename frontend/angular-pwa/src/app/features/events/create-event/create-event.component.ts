import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CalendarComponent, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
})
export class CreateEventComponent {
  eventName: string = '';
  eventDate: string = '';
  eventTime: string = '';
  venue: string = '';
  city: string = '';
  address: string = '';
  ticketprice: string = '';
  theme: string = '';
  isFavorite: boolean = false;
  details: string = '';
  ticketLink: string = '';
  ticketSaleStart: string = '';
  salesTime: string = '';
  publishDateTime: string = '';
  status: string = 'preliminary';

  cities: string[] = ['Helsinki', 'Tampere', 'Turku', 'Oulu', 'Jyväskylä'];

  constructor(private eventService: EventService, private router: Router) {}

  onSubmit() {
    const newEvent = {
      id: Math.floor(Math.random() * 1000), // Creates a random ID (for now)
      eventName: this.eventName,
      date: this.eventDate,
      startingTime: this.eventTime,
      location: {
        venue: this.venue,
        city: this.city,
        address: this.address,
      },
      ticketprice: this.ticketprice,
      theme: this.theme,
      isFavorite: this.isFavorite,
      details: this.details,
      ticketLink: this.ticketLink,
      ticketSaleStart: this.ticketSaleStart,
      salesTime: this.salesTime,
      publishDateTime: this.publishDateTime,
      status: this.status,
    };

    // calls EventService's createEvents
    this.eventService.createEvents(newEvent).subscribe((event) => {
      console.log('Luotu tapahtuma:', event);
      this.router.navigate(['/events', event.id]);
    });
  }
}
