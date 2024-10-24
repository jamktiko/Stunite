import { Component, OnInit, ViewChild, computed, Signal } from '@angular/core';
import {
  IgxCalendarModule,
  IgxCalendarComponent,
  DateRangeDescriptor,
  DateRangeType,
} from 'igniteui-angular';
import { EventService } from '../../features/events/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    RouterModule,
    IgxCalendarModule,
    IgxCalendarComponent,
    CommonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('MyCalendar', { static: true })
  public calendar!: IgxCalendarComponent;

  // Map to store events associated with special dates
  eventsMap = new Map<string, any[]>();
  public selectedEvents: any[] = []; // Store the currently selected events
  selectedDate: string = '';

  events!: Signal<any[]>;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events = this.eventService.getPublishedEvents();

    this.eventsMap.clear();
    this.events().forEach((event) => {
      const dateStr = event.date;
      const date = this.parseDate(dateStr);

      if (date) {
        const dateStr = date.toDateString();
        if (!this.eventsMap.has(dateStr)) {
          this.eventsMap.set(dateStr, []);
        }
        this.eventsMap.get(dateStr)?.push(event);
      }
    });

    // Setting special dates in the calendar
    this.calendar.specialDates = Array.from(this.eventsMap.keys()).map(
      (key) => {
        return {
          type: DateRangeType.Specific,
          dateRange: [new Date(key)],
        } as DateRangeDescriptor;
      }
    );
  }

  public onSelection(dates: Date | Date[]) {
    const selectedDates = Array.isArray(dates) ? dates : [dates];
    this.selectedEvents = [];

    selectedDates.forEach((date) => {
      const dateStr = date.toDateString();
      const eventsOnDate = this.eventsMap.get(dateStr) || [];
      this.selectedDate = this.formatDateInFinnish(date);
      if (eventsOnDate.length > 0) {
        this.selectedEvents = this.selectedEvents.concat(eventsOnDate);
        console.log(`Events on selected date (${dateStr}):`, eventsOnDate);
      } else {
        console.log(`No event on selected date (${dateStr})`);
      }
    });
  }
  // Formatting date to Finnish dates
  private formatDateInFinnish(date: Date): string {
    const formatter = new Intl.DateTimeFormat('fi-FI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(date);
  }

  private parseDate(dateStr: string): Date | null {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const formattedDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const date = new Date(formattedDateStr);
      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    console.warn(`Invalid date format or date: ${dateStr}`);
    return null;
  }
}
