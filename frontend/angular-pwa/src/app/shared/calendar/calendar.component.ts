import { Component, OnInit } from '@angular/core';
import { IgxCalendarModule } from 'igniteui-angular';
import { EventService } from '../../features/events/event.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IgxCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  eventDates: Date[] = []; // Array that has event dates
  constructor(private eventService: EventService) {}
  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.eventDates = events.map(
        (event) => new Date(event.date.split('.').reverse().join('-'))
      );
    });
  }

  isEventDay(day: Date): boolean {
    return this.eventDates.some(
      (eventDate) =>
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
    );
  }
}
