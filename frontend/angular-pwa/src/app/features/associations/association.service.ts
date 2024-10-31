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
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }
}
