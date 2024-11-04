import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { EventService } from '../events/event.service';
import { Router } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import fiLocale from '@fullcalendar/core/locales/fi';

@Component({
  selector: 'app-organizer-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
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
      } else {
        // console.error('Tapahtuman ID:tä ei löydy.');
      }
    },

    eventMouseEnter: (info) => this.onEventMouseEnter(info),
    eventMouseLeave: () => this.onEventMouseLeave(),
  };

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.events = this.eventService.getAllEvents();
    this.eventsUpdated();
  }

  eventsUpdated() {
    const eventsData = this.events();
    // get current date for filtering events to upcomping and past events
    // in event list
    const currentDate = new Date();
    if (eventsData.length > 0) {
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

    // filter upcomping and past events to their own lists
    this.upcomingEvents = eventsData
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
        // ascending order
        return dateA.getTime() - dateB.getTime();
      });

    this.pastEvents = eventsData
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
        // descending order
        return dateB.getTime() - dateA.getTime();
      });
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
}
