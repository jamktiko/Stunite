import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { EventService } from '../events/event.service';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import fiLocale from '@fullcalendar/core/locales/fi';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organizer-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './organizer-calendar.component.html',
  styleUrls: ['./organizer-calendar.component.css'],
})
export class OrganizerCalendarComponent implements OnInit {
  events!: Signal<any[]>;
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  activeTab: string = 'upcoming';

  tooltipVisible = false;
  tooltipContent = '';
  tooltipPosition = { top: '0px', left: '0px' };

  selectedCity: string = '';
  availableCities: string[] = [];

  noEventsForTag: boolean = false;
  selectedTags: string = '';
  availableTags: string[] = [
    'Sitsit',
    'Appro',
    'Alkoholiton',
    'Lajikokeilu',
    'Risteily',
    'Ekskursio',
    'Liikunta',
    'Vuosijuhla',
    'Sillis',
    'Festivaali',
    'Musiikki',
    'Tanssiaiset',
    'Turnaus',
    'Online',
    'Bileet',
    'Bingo',
    'Poikkitieteellinen',
    'Vain jäsenille',
    'Vaihto-opiskelijoille',
    'Ilmainen',
    'Vappu',
    'Vapaa-aika',
    'Ruoka',
    'Kulttuuri',
    'Ammatillinen tapahtuma',
  ];

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

    eventMouseEnter: (info) => this.onEventMouseEnter(info),
    eventMouseLeave: () => this.onEventMouseLeave(),
  };

  private eventSubscription: Subscription = new Subscription();

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventSubscription = this.eventService.getAllEvents().subscribe({
      next: (eventsData) => {
        this.events = signal(eventsData);
        this.updateAvailableCities(eventsData);
        this.eventsUpdated();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  updateAvailableCities(eventsData: Event[]): void {
    eventsData.forEach((event) => {
      if (!this.availableCities.includes(event.city)) {
        this.availableCities.push(event.city);
      }
    });
  }
  eventsUpdated() {
    const eventsData = this.events();
    const currentDate = new Date();

    let filteredEvents = eventsData;

    if (this.selectedCity) {
      filteredEvents = filteredEvents.filter(
        (event) => event.city.toLowerCase() === this.selectedCity.toLowerCase()
      );
    }
    if (this.selectedTags && this.selectedTags.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        event.eventTags.includes(this.selectedTags)
      );
    }
    this.noEventsForTag = filteredEvents.length === 0;

    this.upcomingEvents = filteredEvents
      .filter((event) => {
        const eventDate = new Date(this.formatDateToISO(event.date));
        return eventDate >= currentDate;
      })
      .sort((a, b) => {
        const dateA = new Date(
          this.formatDateToISO(a.date) + 'T' + a.startingTime
        );
        const dateB = new Date(
          this.formatDateToISO(b.date) + 'T' + b.startingTime
        );
        return dateA.getTime() - dateB.getTime();
      });

    this.pastEvents = filteredEvents
      .filter((event) => {
        const eventDate = new Date(this.formatDateToISO(event.date));
        return eventDate < currentDate;
      })
      .sort((a, b) => {
        const dateA = new Date(
          this.formatDateToISO(a.date) + 'T' + a.startingTime
        );
        const dateB = new Date(
          this.formatDateToISO(b.date) + 'T' + b.startingTime
        );
        return dateB.getTime() - dateA.getTime();
      });

    if (filteredEvents.length > 0) {
      this.calendarOptions.events = filteredEvents.map((event) => ({
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
    } else {
      this.calendarOptions.events = [];
    }
  }

  onEventMouseEnter(info: any): void {
    const eventDetails = info.event.extendedProps;
    this.tooltipContent = `
      <strong><span class="tooltip-title">${info.event.title}</span></strong><br>
      <strong>Aika:</strong> ${eventDetails.date} klo ${eventDetails.startingTime} <br>
      <strong>Paikka:</strong> ${eventDetails.venue} <br>
      <strong>Järjestäjä:</strong> ${eventDetails.organizationName}
    `;
    this.tooltipVisible = true;

    const rect = info.el.getBoundingClientRect();
    this.tooltipPosition = {
      top: `${rect.bottom + window.scrollY + 10}px`,
      left: `${rect.left + window.scrollX / rect.width}px`,
    };
  }

  onEventMouseLeave(): void {
    this.tooltipVisible = false;
  }

  goToCreateEvent() {
    this.router.navigate(['/organizer-view/create-event']);
  }

  goToEventPage(event: Event) {
    this.router.navigate(['/events', event._id]);
  }

  private formatDateToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.eventsUpdated();
  }
  onTagChange(selectedTag: string): void {
    this.selectedTags = selectedTag;
    this.eventsUpdated();
  }
}
