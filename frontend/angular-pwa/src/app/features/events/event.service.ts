import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'assets/fakedata.json';

  constructor(private http: HttpClient) {}
  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
