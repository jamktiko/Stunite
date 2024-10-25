import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3001/manage/event/'; // GET event
  private createEventapiUrl = 'http://localhost:3001/create/event/'; // POST event

  private eventsSignal: WritableSignal<Event[]> = signal<Event[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadEvents();
  }

  // gets events from backend and updates eventsSignal
  private loadEvents(): void {
    this.http
      .get<Event[]>(this.apiUrl)
      .pipe(
        tap((events) => {
          console.log('Fetched events:', events);
          this.eventsSignal.set(events);
        })
      )
      .subscribe(() => {
        console.log('Events loaded into signal:', this.eventsSignal());
      });
  }

  // signal-based getter for events
  getAllEvents(): WritableSignal<Event[]> {
    return this.eventsSignal;
  }
  // signal-based getter for only published events
  getPublishedEvents(): WritableSignal<Event[]> {
    return signal(
      this.eventsSignal().filter(
        (event) => new Date(event.publishDateTime) <= new Date()
      )
    );
  }

  // getEventById(id: string): Event | undefined {
  //   const events = this.eventsSignal();
  //   return events.find((event) => event._id === id);
  // }
  getEventById(id: string | null): Event | undefined {
    if (!id) return undefined;
    const events = this.eventsSignal();
    return events.find((event) => event._id === id);
  }
  // create event
  createEvent(newEvent: Event): void {
    // get token
    const token = this.authService.getToken();

    // check if token is found
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders().set('x-access-token', token);

    this.http
      .post<Event>(this.createEventapiUrl, newEvent, { headers })
      .pipe(
        tap((createdEvent) => {
          console.log(createdEvent);
          const updatedEvents = [...this.eventsSignal(), createdEvent];
          this.eventsSignal.set(updatedEvents);
        })
      )
      .subscribe();
  }

  editEvent(updatedEvent: Event): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrl}/${updatedEvent._id}`;

    this.http
      .put<Event>(url, updatedEvent, { headers })
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
