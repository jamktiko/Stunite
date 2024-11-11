import { Component, OnInit, OnDestroy, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { EventService } from '../events/event.service';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import fiLocale from '@fullcalendar/core/locales/fi';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-organizer-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './organizer-calendar.component.html',
  styleUrls: ['./organizer-calendar.component.css'],
})
export class OrganizerCalendarComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  selectedCity: string = '';
  selectedTag: string = '';
  selectedDateRange: { start: string | null; end: string | null } = {
    start: null,
    end: null,
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locales: [fiLocale],
    events: [],
    firstDay: 1,
    eventClick: (info) => {
      info.jsEvent.preventDefault();
      const eventId = info.event.extendedProps['eventId'];

      if (eventId) {
        this.router.navigate(['/events', eventId]);
      }
    },
  };

  private eventSubscription: Subscription = new Subscription();

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventSubscription = this.eventService
      .loadEvents()
      .subscribe((eventsData) => {
        this.events = eventsData;
        this.filterEvents();
      });
  }

  filterEvents(): void {
    let filtered = this.events;

    if (this.searchTerm) {
      filtered = filtered.filter((event) =>
        event.eventName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCity) {
      filtered = filtered.filter((event) => event.city === this.selectedCity);
    }

    if (this.selectedTag) {
      filtered = filtered.filter((event) =>
        event.eventTags?.includes(this.selectedTag)
      );
    }

    if (this.selectedDateRange.start || this.selectedDateRange.end) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(this.formatDateToISO(event.date));
        const { start, end } = this.selectedDateRange;
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        return (
          (!startDate || eventDate >= startDate) &&
          (!endDate || eventDate <= endDate)
        );
      });
    }

    this.filteredEvents = filtered;
    this.updateCalendar(filtered);
  }

  updateCalendar(eventsData: Event[]): void {
    const currentDate = new Date();

    this.calendarOptions.events = eventsData.map((event) => ({
      title: event.eventName,
      date: this.formatDateToISO(event.date),
      color: event.status === 'Varattu' ? '#fe7775' : '#f0d37c',
      url: `/events/${event._id}`,
      extendedProps: {
        startingTime: event.startingTime,
        venue: event.venue,
        date: event.date,
        organizationName: event.organizationName,
        eventId: event._id,
      },
    }));
  }

  private formatDateToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterEvents();
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.filterEvents();
  }

  onTagChange(tag: string): void {
    this.selectedTag = tag;
    this.filterEvents();
  }

  onDateRangeChange(start: string | null, end: string | null): void {
    this.selectedDateRange = { start, end };
    this.filterEvents();
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
