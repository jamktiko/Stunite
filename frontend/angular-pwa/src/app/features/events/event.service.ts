import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.baseUrl}/manage/event/`; // GET event
  private createEventapiUrl = `${environment.baseUrl}/create/event/`; // POST event

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(newEvent: Event): void {
    const token = this.authService.getToken();

    if (!token) {
      console.log('Token not found');
      return;
    }
    const headers = new HttpHeaders().set('x-access-token', token);

    this.http
      .post<Event>(this.createEventapiUrl, newEvent, { headers })
      .pipe(
        tap((createdEvent) => {
          console.log('Event created:', createdEvent);
        })
      )
      .subscribe();
  }

  editEvent(updatedEvent: Event): void {
    const token = this.authService.getToken();

    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrl}/${updatedEvent._id}`;

    this.http
      .put<Event>(url, updatedEvent, { headers })
      .pipe(
        tap((editedEvent) => {
          console.log('Event edited:', editedEvent);
        })
      )
      .subscribe();
  }

  getEventById(eventId: string): Observable<Event> {
    const url = `${this.apiUrl}/${eventId}`;
    return this.http.get<Event>(url);
  }

  // must be tested
  getPublishedEvents(): Observable<Event[]> {
    return this.http
      .get<Event[]>(this.apiUrl)
      .pipe(
        map((events) => events.filter((event) => event.status === 'Varattu'))
      );
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
}
