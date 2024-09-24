import {
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { EventService } from './event.service';
import { EventcardComponent } from './eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventcardComponent, CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  searchTerm = signal('');
  eventsSignal!: Signal<any[]>;
  filteredEventData!: Signal<any[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventsSignal = this.eventService.getEvents();
    this.filteredEventData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      return this.eventsSignal().filter((event) =>
        event.eventName.toLowerCase().includes(search)
      );
    });
  }
}
