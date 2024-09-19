import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private apiUrl = 'assets/fakedata2.json';
  private associationSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
    this.loadAssociations();
  }

  private loadAssociations() {
    this.http.get<any[]>(this.apiUrl).subscribe((associations) => {
      this.associationSubject.next(associations);
    });
  }
  getAssociations(): Observable<any[]> {
    return this.associationSubject.asObservable();
  }

  getAssociationsById(id: string) {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((associations) =>
          associations.find((association) => association.id.toString() === id)
        )
      );
  }
}
