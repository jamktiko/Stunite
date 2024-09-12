import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'assets/credentials.json';
  private isLoggedIn = false;
  private isAdmin = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          this.isLoggedIn = true;
          this.isAdmin = user.isAdmin;
          return true;
        } else {
          return false;
        }
      })
    );
  }

  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}
