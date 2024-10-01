import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryUserService } from '../../shared/in-memory-services/in-memory-user.service';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private role: WritableSignal<string | null> = signal(null);
  private currUser: WritableSignal<any | null> = signal(null);

  private apiUrl = 'http://localhost:3001/login/user';

  constructor(
    private http: HttpClient,
    private userService: InMemoryUserService,
    private profileService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkUserSession();
    }
  }

  login(email: string, password: string): void {
    this.http
      .post<{ message: string; user: any }>(this.apiUrl, { email, password })
      .subscribe({
        next: (response) => {
          this.isLoggedIn.set(true);
          // this.role.set(response.user.role);  // huom rooli jutut pitää kattoo yhessä että mitä tehään
          this.currUser.set(response.user);
          console.log(this.currUser);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }

          console.log(`Logged in as: ${response.user.role}`);
        },
        error: () => {
          console.log('Login failed: Invalid credentials');
          this.isLoggedIn.set(false);
        },
      });
  }

  checkUserSession() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.isLoggedIn.set(true);
        this.role.set(user.role);
        this.currUser.set(user);
        console.log(`Restored user session as: ${user.role}`);
      }
    }
  }

  getCurrentUserRole(): string | null {
    const user = this.currUser();
    return user ? user.role : null;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getCurrUser(): any {
    const user = this.currUser();
    if (!user && isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return user;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.role.set(null);
    this.currUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    console.log('Logged out');
  }
}
