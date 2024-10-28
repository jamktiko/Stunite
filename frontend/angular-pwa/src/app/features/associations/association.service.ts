import { Injectable, signal, WritableSignal } from '@angular/core';
import { Organizer } from '../../shared/models/organization.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private apiUrl = 'http://localhost:3001/manage/organizer/'; // GET
  private associationsSignal: WritableSignal<Organizer[]> = signal([]);

  constructor(private http: HttpClient) {
    this.loadAssociations();
  }
  private loadAssociations(): void {
    this.http
      .get<Organizer[]>(this.apiUrl)
      .pipe(
        tap((organizers) => {
          this.associationsSignal.set(organizers);
        })
      )
      .subscribe(() => {
        console.log('Organizers loaded into signal', this.associationsSignal());
      });
  }

  getAssociations(): WritableSignal<Organizer[]> {
    return this.associationsSignal;
  }

  getAssociationById(id: string): Observable<Organizer | null> {
    if (!id) {
      return of(null);
    }
    const url = `${this.apiUrl}${id}`;
    return this.http.get<Organizer>(url).pipe(
      tap((association) => {
        console.log('Fetched association:', association);
      }),
      catchError((error) => {
        console.error('Error fetching association by ID:', error);
        return of(null);
      })
    );
  }

}
