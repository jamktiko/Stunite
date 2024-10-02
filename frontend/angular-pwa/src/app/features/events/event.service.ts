import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3001/manage/event/'; // Replace with your backend URL

  // The signal will still store the events, but will now be populated by the backend
  private eventsSignal: WritableSignal<Event[]> = signal<Event[]>([]);

  constructor(private http: HttpClient) {
    this.loadEvents(); // Load events from backend on service initialization
  }

  // Fetch events from the backend and update the signal
  private loadEvents(): void {
    this.http
      .get<Event[]>(this.apiUrl)
      .pipe(
        tap((events) => this.eventsSignal.set(events)) // Update the signal with fetched events
      )
      .subscribe();
    console.log(this.eventsSignal);
  }

  // Signal-based getter for events
  getEvents(): WritableSignal<Event[]> {
    return this.eventsSignal;
  }

  // Optional: Fetch a single event by ID from the backend if needed
  getEventById(id: string): Event | undefined {
    const events = this.eventsSignal();
    return events.find((event) => event._id === id);
  }

  // Create a new event, post it to the backend, and update the signal
  createEvent(newEvent: Event): void {
    this.http
      .post<Event>(this.apiUrl, newEvent)
      .pipe(
        tap((createdEvent) => {
          // Update the signal with the newly created event
          const updatedEvents = [...this.eventsSignal(), createdEvent];
          this.eventsSignal.set(updatedEvents);
        })
      )
      .subscribe();
  }

  // Edit an event, update it in the backend, and refresh the signal
  editEvent(updatedEvent: Event): void {
    const url = `${this.apiUrl}/${updatedEvent._id}`;
    this.http
      .put<Event>(url, updatedEvent)
      .pipe(
        tap((editedEvent) => {
          const events = this.eventsSignal().map((event) =>
            event._id === editedEvent._id ? editedEvent : event
          );
          this.eventsSignal.set(events);
        })
      )
      .subscribe();
  }
}
