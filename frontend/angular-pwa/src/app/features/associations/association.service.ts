import { Injectable, signal, WritableSignal } from '@angular/core';
import { Organizer } from '../../shared/models/organization.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private apiUrl = `${environment.baseUrl}/manage/organizer/`; // GET

  constructor(private http: HttpClient) {
    this.loadAssociations();
  }
  private loadAssociations(): Observable<Organizer[]> {
    return this.http.get<Organizer[]>(this.apiUrl);
  }

  getAssociations(): Observable<Organizer[]> {
    return this.loadAssociations();
  }

  getAssociationById(id: string): Observable<Organizer | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Organizer>(url);
  }
}
