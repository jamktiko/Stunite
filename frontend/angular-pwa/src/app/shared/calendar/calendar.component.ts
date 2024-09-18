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
      this.eventDates = events.map(
        (event) => new Date(event.date.split('.').reverse().join('-')) // Format date
      );

      this.calendar.specialDates = this.eventDates.map((date) => {
        return {
          type: DateRangeType.Specific,
          dateRange: [date],
        } as DateRangeDescriptor;
      });
    });
  }
}
