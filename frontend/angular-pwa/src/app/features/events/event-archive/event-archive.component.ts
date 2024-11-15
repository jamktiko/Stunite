import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { EventService } from '../event.service';
import { EventcardComponent } from '../eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../shared/models/event.model';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-event-archive',
  standalone: true,
  imports: [EventcardComponent, CommonModule, FormsModule],
  templateUrl: './event-archive.component.html',
  styleUrls: ['./event-archive.component.css'],
})
export class EventArchiveComponent implements OnInit {
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

  private eventSubscription: Subscription = new Subscription();

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
  updateFilteredEvents(eventData: Event[]) {
    this.filteredEventData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      const city = this.selectedCity();
      const tag = this.selectedTag();
      const { start, end } = this.selectedDateRange();

      let filteredPastEvents = eventData.filter((event) => {
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

        const eventEndDate = event.endingDate
          ? this.parseCustomDate(event.endingDate)
          : this.parseCustomDate(event.date);
        eventEndDate.setHours(0, 0, 0, 0);

        const isPastEvent = eventEndDate < currentDate;

        return (
          matchesSearch &&
          matchesCity &&
          matchesTag &&
          matchesDate &&
          isPastEvent
        );
      });

      filteredPastEvents = filteredPastEvents.sort((a, b) => {
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      return filteredPastEvents;
    });
  }

  parseCustomDate(dateString: string): Date {
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

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
