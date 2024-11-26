import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { EventService } from './event.service';
import { EventcardComponent } from './eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../shared/models/event.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventcardComponent, CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  searchTerm = signal('');
  selectedCity = signal('');
  selectedTag = signal('');
  selectedDateRange = signal<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

  eventsSignal!: Observable<Event[]>;
  filteredEventData!: Signal<Event[]>;

  availableCities: string[] = [];
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

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventsSignal = this.eventService.getPublishedEvents();
    this.eventsSignal.subscribe((eventsData) => {
      eventsData.forEach((event) => {
        if (!this.availableCities.includes(event.city)) {
          this.availableCities.push(event.city);
        }
      });
      this.updateFilteredEvents(eventsData);
    });
  }

  updateFilteredEvents(eventsData: Event[]) {
    this.filteredEventData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      const city = this.selectedCity();
      const tag = this.selectedTag();
      const { start, end } = this.selectedDateRange();

      let filteredEvents = eventsData.filter((event) => {
        const matchesSearch = event.eventName.toLowerCase().includes(search);
        const matchesCity = city ? event.city === city : true;
        const matchesTag = tag ? event.eventTags?.includes(tag) : true;

        let matchesDate = true;
        if (start || end) {
          const eventStartDate = this.parseCustomDate(event.date);
          matchesDate =
            (!start || eventStartDate >= new Date(start)) &&
            (!end || eventStartDate <= new Date(end));
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Use endingDate if available, otherwise fallback to event.date (starting date)
        const eventEndDate = event.endingDate
          ? this.parseCustomDate(event.endingDate)
          : this.parseCustomDate(event.date); // Fall back to starting date
        eventEndDate.setHours(0, 0, 0, 0);

        const isFutureEvent = eventEndDate >= currentDate;

        return (
          matchesSearch &&
          matchesCity &&
          matchesTag &&
          matchesDate &&
          isFutureEvent
        );
      });

      filteredEvents = filteredEvents.sort((a, b) => {
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return filteredEvents;
    });
  }

  parseCustomDate(dateString: string): Date {
    if (!dateString) {
      console.warn('Invalid date string:', dateString);
      return new Date();
    }
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  }

  updateDateRange(field: 'start' | 'end', value: string): void {
    const currentRange = this.selectedDateRange();
    this.selectedDateRange.set({
      ...currentRange,
      [field]: value,
    });
  }
  clearDate(field: 'start' | 'end'): void {
    const currentRange = this.selectedDateRange();
    this.selectedDateRange.set({
      ...currentRange,
      [field]: null,
    });
  }

  toEventArchive() {
    this.router.navigate(['/event-archive']);
  }

  openCalendar(event: any) {
    const target = event.target as HTMLInputElement;
    if (target && typeof target.showPicker === 'function') {
      target.showPicker();
    } else {
      target.focus();
    }
  }
}
