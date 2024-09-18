import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IgxCalendarModule,
  IgxCalendarComponent,
  DateRangeDescriptor,
  DateRangeType,
} from 'igniteui-angular';
import { EventService } from '../../features/events/event.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IgxCalendarModule, IgxCalendarComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('MyCalendar', { static: true })
  public calendar!: IgxCalendarComponent;

  eventDates: Date[] = []; // Array that has event dates

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      // Filter out events with missing or invalid dates
      this.eventDates = events
        .map((event) => {
          const dateStr = event.date;
          // Check if dateStr is valid
          if (dateStr && typeof dateStr === 'string') {
            const parts = dateStr.split('.');
            if (parts.length === 3) {
              // Convert to Date object
              return new Date(parts.reverse().join('-'));
            }
          }
          return null; // Return null for invalid dates
        })
        .filter((date): date is Date => date !== null); // Remove null values

      // Update the calendar with special dates
      this.calendar.specialDates = this.eventDates.map((date) => {
        return {
          type: DateRangeType.Specific,
          dateRange: [date],
        } as DateRangeDescriptor;
      });
    });
  }
}
