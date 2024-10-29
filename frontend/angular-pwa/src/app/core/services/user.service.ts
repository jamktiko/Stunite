// import { Injectable, signal, WritableSignal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   private apiUrl = 'http://localhost:3001/manage/user'; // Correct URL
//   private userProfileSignal: WritableSignal<any | null> = signal(null);

//   constructor(private http: HttpClient) {}

//   getUserProfile(userId: number): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${userId}`);
//   }

//   updateUserProfile(userId: number, userData: any) {
//     return this.http.put(`${this.apiUrl}/${userId}`, userData);
//   }

//   getUserProfileSignal(): WritableSignal<any | null> {
//     return this.userProfileSignal;
//   }
// }
