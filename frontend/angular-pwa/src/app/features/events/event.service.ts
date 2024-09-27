import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { InMemoryDataService } from '../../shared/in-memory-services/in-memory-data.service';
import { Event } from '../../shared/models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // private apiUrl = 'assets/fakedata.json';

  // !! Events use angualr signals and in memory data service at the moment
  private eventsSignal: WritableSignal<Event[]>;

  constructor(
    private inMemoryService: InMemoryDataService,
    private http: HttpClient
  ) {
    this.eventsSignal = this.inMemoryService.getEvents();
  }

  getEvents(): WritableSignal<Event[]> {
    return this.eventsSignal;
  }

  getEventById(id: number): Event | undefined {
    const events = this.eventsSignal();
    return events.find((event) => event.id === id);
  }

  createEvent(newEvent: Event, organizerId: number) {
    this.inMemoryService.createEvent(newEvent, organizerId);
  }
  editEvent(updatedEvent: Event) {
    this.inMemoryService.editEvent(updatedEvent);
  }
}
