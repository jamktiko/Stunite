import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CalendarComponent, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
})
export class CreateEventComponent {
  eventName: string = '';
  eventDate: Date | undefined;
  eventTime: string = '';
  eventCity: string = '';

  cities: string[] = ['Helsinki', 'Tampere', 'Turku', 'Oulu', 'Jyväskylä'];

  constructor(private eventService: EventService) {}

  onSubmit() {
    const newEvent = {
      id: Math.floor(Math.random() * 1000), // creates random id number (for now)
      eventName: this.eventName,
      date: this.eventDate,
      time: this.eventTime,
      location: {
        city: this.eventCity,
      },
    };

    // calls EventService's createEvents
    this.eventService.createEvents(newEvent).subscribe((event) => {
      console.log('Luotu tapahtuma:', event);
    });
  }
}
