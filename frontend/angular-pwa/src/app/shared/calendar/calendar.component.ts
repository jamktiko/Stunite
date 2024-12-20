import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import {
  IgxCalendarModule,
  IgxCalendarComponent,
  DateRangeType,
} from 'igniteui-angular';
import { EventService } from '../../features/events/event.service';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import localeFi from '@angular/common/locales/fi';

// Register Finnish locale data
registerLocaleData(localeFi);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    IgxCalendarModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'fi-FI' }],
})
export class CalendarComponent implements OnInit {
  @ViewChild('MyCalendar', { static: true })
  public calendar!: IgxCalendarComponent;

  eventsMap = new Map<string, any[]>();
  public selectedEvents: any[] = [];
  selectedDate: string = '';

  events!: any[];
  private eventSubscription: Subscription = new Subscription();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventSubscription = this.eventService.getPublishedEvents().subscribe({
      next: (eventsData) => {
        this.events = eventsData;
        this.updateEventsMap(eventsData);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  private updateEventsMap(eventsData: any[]) {
    this.eventsMap.clear();

    eventsData.forEach((event) => {
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
    this.calendar.specialDates = Array.from(this.eventsMap.keys()).map(
      (key) => {
        return {
          type: DateRangeType.Specific,
          dateRange: [new Date(key)],
        };
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
      }
    });
  }

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
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
