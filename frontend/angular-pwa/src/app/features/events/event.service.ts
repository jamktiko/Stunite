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

  createEvent(eventData: any, imageFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('eventName', eventData.eventName);
    formData.append('date', eventData.date);
    formData.append('startingTime', eventData.startingTime);
    formData.append('endingTime', eventData.endingTime);
    formData.append('endingDate', eventData.endingDate);
    formData.append('address', eventData.address);
    formData.append('venue', eventData.venue);
    formData.append('city', eventData.city);
    formData.append(
      'ticketprice[minticketprice]',
      eventData.ticketprice.minticketprice
    );
    formData.append(
      'ticketprice[maxticketprice]',
      eventData.ticketprice.maxticketprice
    );
    formData.append('theme', eventData.theme);
    formData.append('isFavorite', eventData.isFavorite);
    formData.append('details', eventData.details);
    formData.append('ticketLink', eventData.ticketLink);
    formData.append('ticketSaleStart', eventData.ticketSaleStart);
    formData.append('ticketSaleEnd', eventData.ticketSaleEnd);
    formData.append('publishDateTime', eventData.publishDateTime);
    formData.append('status', eventData.status);
    formData.append('organizerId', eventData.organizerId);
    formData.append('organizationName', eventData.organizationName);
    formData.append('eventTags', eventData.eventTags.join(','));

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post<any>(this.apiUrl, formData);
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

  editEvent(updatedEvent: Event, imageFile?: File): Observable<Event> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrl}/${updatedEvent._id}`;

    // create the FormData object to append the updated event data
    const formData = new FormData();

    // append all the updated event fields to the FormData object
    formData.append('eventName', updatedEvent.eventName);
    formData.append('date', updatedEvent.date);
    formData.append('startingTime', updatedEvent.startingTime);
    formData.append('endingTime', updatedEvent.endingTime);
    formData.append('endingDate', updatedEvent.endingDate);
    formData.append('address', updatedEvent.address);
    formData.append('venue', updatedEvent.venue);
    formData.append('city', updatedEvent.city);

    formData.append(
      'ticketprice[minticketprice]',
      (updatedEvent.ticketprice.minticketprice || 0).toString()
    );
    formData.append(
      'ticketprice[maxticketprice]',
      (updatedEvent.ticketprice.maxticketprice || 0).toString()
    );

    formData.append('theme', updatedEvent.theme);
    formData.append('isFavorite', updatedEvent.isFavorite.toString());
    formData.append('details', updatedEvent.details);
    formData.append('ticketLink', updatedEvent.ticketLink);
    formData.append('ticketSaleStart', updatedEvent.ticketSaleStart);
    formData.append('ticketSaleEnd', updatedEvent.ticketSaleEnd);
    formData.append('publishDateTime', updatedEvent.publishDateTime);
    formData.append('status', updatedEvent.status);
    formData.append('organizerId', updatedEvent.organizerId);
    formData.append('organizationName', updatedEvent.organizationName);

    if (updatedEvent.eventTags && Array.isArray(updatedEvent.eventTags)) {
      updatedEvent.eventTags.forEach((tag) => {
        formData.append('eventTags[]', tag);
      });
    }

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    // send the FormData with the PUT request
    return this.http.put<Event>(url, formData, { headers });
  }

  getEventById(eventId: string): Observable<Event> {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders().set('x-access-token', token)
      : undefined;
    const url = `${this.apiUrl}/${eventId}`;
    return this.http.get<Event>(url, { headers });
  }

  getPublishedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map((events) =>
        events.filter((event) => {
          const now = new Date();
          const publishDate = new Date(event.publishDateTime);

          return (
            event.status === 'Varattu' &&
            event.publishDateTime != null &&
            publishDate <= now
          );
        })
      )
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

  uploadEventWithImage(formData: FormData): Observable<Event> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    return this.http.post<Event>(this.createEventapiUrl, formData, { headers });
  }
}
