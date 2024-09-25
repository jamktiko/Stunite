import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InMemoryUserService } from '../../shared/in-memory-services/in-memory-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private role: WritableSignal<string | null> = signal(null);
  private currUser: WritableSignal<any | null> = signal(null);

  constructor(
    private http: HttpClient,
    private userService: InMemoryUserService
  ) {}

  login(
    email: string,
    password: string
  ): Observable<{ success: boolean; message?: string }> {
    const users = this.userService.getUsers()();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.isLoggedIn.set(true);
      this.role.set(user.role);
      this.currUser.set({ ...user }); // This should already include the organizerId if the user is an organizer
      return of({ success: true });
    } else {
      return of({ success: false, message: 'Invalid credentials' });
    }
  }

  getUserRole(): string | null {
    return this.role();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getCurrUser(): any {
    return this.currUser();
  }

  updateCurrUserDetails(newDetails: {
    firstname: string;
    lastname: string;
  }): void {
    const user = this.currUser();
    if (user) {
      user.firstname = newDetails.firstname;
      user.lastname = newDetails.lastname;
      this.currUser.set(user);
    }
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.role.set(null);
    this.currUser.set(null);
    console.log('Logged out');
  }
}
