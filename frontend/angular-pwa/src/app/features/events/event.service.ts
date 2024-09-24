import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'assets/fakedata.json';

  // private eventsSubject = new BehaviorSubject<any[]>([]);
  private eventsSignal: WritableSignal<any[]> = signal([]);

  constructor(private http: HttpClient) {
    // This gets the events at the start
    this.loadEvents();
  }
  private loadEvents() {
    this.http.get<any[]>(this.apiUrl).subscribe((events) => {
      // this.eventsSubject.next(events);
      this.eventsSignal.set(events);
    });
  }

  /**
   * Returns event information fron fakedata.json file
   * @returns
   */
  // getEvents(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  // Return Observable, that listens changes in events
  getEvents(): WritableSignal<any[]> {
    return this.eventsSignal;
  }
  /**
   * Returns event information from fakedata.json file
   * by given id
   * @param id
   * @returns
   */
  getEventById(id: string) {
    const events = this.eventsSignal();
    return events.find((event) => event.id.toString() === id);
  }

  // When backend ready, this will be edited to sen a POST request to backend
  // createEvents(newEvent: any): Observable<any> {
  //   const currentEvents = this.eventsSubject.value;
  //   const updatedEvents = [...currentEvents, newEvent];
  //   this.eventsSubject.next(updatedEvents);
  //   return of(newEvent);
  // }
  createEvent(newEvent: any) {
    const currentEvents = this.eventsSignal();
    this.eventsSignal.set([...currentEvents, newEvent]);
  }
}
