import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrl = 'http://localhost:3001/manage/user'; // onko tää oikee url
  private userProfileSignal: WritableSignal<any | null> = signal(null); 

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): void {
    this.http.get<any>(`${this.apiUrl}/${userId}`).subscribe((data) => {
      this.userProfileSignal.set(data); 
    });
  }

  updateUserProfile(userId: number, userData: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  getUserProfileSignal(): WritableSignal<any | null> {
    return this.userProfileSignal;
  }
}
