import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../enviroments/enviroment';
import { Observable, throwError } from 'rxjs';

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

  createEvent(newEvent: Event): Observable<Event> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    return this.http.post<Event>(this.createEventapiUrl, newEvent, { headers });
  }

  deleteEvent(eventId: string): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('Unauthorized: No token found'));
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrl}/${eventId}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap((response) => {
        console.log('Event deleted:', response);
      }),
      map((response) => response)
    );
  }

  editEvent(updatedEvent: Event): Observable<Event> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrl}/${updatedEvent._id}`;
    return this.http.put<Event>(url, updatedEvent, { headers });
  }

  getEventById(eventId: string): Observable<Event> {
    const url = `${this.apiUrl}/${eventId}`;
    return this.http.get<Event>(url);
  }

  // check if works wiith not published events, now only with "Varattu"
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

  getEventsByOrganizerId(organizerId: string): Observable<Event[]> {
    return this.http
      .get<Event[]>(`${this.apiUrl}`)
      .pipe(
        map((events) =>
          events.filter(
            (event) =>
              event.organizerId === organizerId &&
              event.status === 'Varattu' &&
              event.publishDateTime &&
              new Date(event.publishDateTime) <= new Date()
          )
        )
      );
  }

  // uploadEventImage(formData: FormData): Observable<any> {
  //   const token = this.authService.getToken();
  //   if (token) {
  //     const headers = new HttpHeaders().set('x-access-token', token);
  //     return this.http.post(`${this.createEventapiUrl}`, formData, { headers });
  //   } else {
  //     console.error('Token not found');
  //     return throwError(() => new Error('Unauthorized: No token found'));
  //   }
  // }
}
