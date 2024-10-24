import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin for day grid view
import { CalendarOptions } from '@fullcalendar/core';
import { EventService } from '../events/event.service';

@Component({
  selector: 'app-organizer-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './organizer-calendar.component.html',
  styleUrls: ['./organizer-calendar.component.css'],
})
export class OrganizerCalendarComponent implements OnInit {
  events!: Signal<any[]>;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    // get event signal from event service
    this.events = this.eventService.getAllEvents();
    // call eventsUpdated that loads the events in to the calendar
    this.eventsUpdated();
  }

  eventsUpdated() {
    // update calendar with signal
    const eventsData = this.events();
    console.log('Current events data in eventsUpdated:', eventsData); // Log current events data

    if (eventsData.length > 0) {
      console.log('Setting calendar events:', eventsData);
      this.calendarOptions.events = eventsData.map((event) => ({
        title: event.eventName,
        date: this.formatDateToISO(event.date),
        // if event date has been set/confirmed already the color will be red
        // and if the event date is not yet confirmed but reserved the color will be blue
        // (changes color when they have been decided)
        color: event.status === 'Varattu' ? '#f0d37c' : '#fe7775',
      }));

      console.log('Updated calendar events:', this.calendarOptions.events);
    } else {
      console.log('No events to display.');
    }
  }

  // formats dates dd.mm.yyyy to ISO format (YYYY-MM-DD)
  // this is needed for them to be able to load in to the calendar
  private formatDateToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}
