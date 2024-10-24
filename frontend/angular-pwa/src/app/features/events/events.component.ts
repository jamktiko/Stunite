import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { EventService } from './event.service';
import { EventcardComponent } from './eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../shared/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventcardComponent, CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  searchTerm = signal('');
  eventsSignal!: Signal<Event[]>;
  filteredEventData!: Signal<Event[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventsSignal = this.eventService.getPublishedEvents();
    console.log('Events on init:', this.eventsSignal());

    this.filteredEventData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      console.log('Current Search Term:', search);

      const filteredEvents = this.eventsSignal().filter((event) =>
        event.eventName.toLowerCase().includes(search)
      );
      console.log('Filtered Events:', filteredEvents);
      return filteredEvents;
    });
  }
}
