import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'assets/fakedata.json';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<any> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((events) => events.find((event) => event.id.toString() === id))
      );
  }

  // When backend ready, this will be edited to sen a POST request to backend
  createEvents(newEvent: any): Observable<any> {
    return of(newEvent);
  }
}
