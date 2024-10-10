import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  JwtHelper = new JwtHelperService();
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private isOrganizer: WritableSignal<boolean> = signal(false);
  private currUser: WritableSignal<any | null> = signal(null);

  private token: string | null = null;

  private apiUrlLoginUser = 'http://localhost:3001/login/user';
  private apiUrlLoginOrganizer = 'http://localhost:3001/login/organizer';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkUserSession();
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ message: string; token: string; user: any }>(
        this.apiUrlLoginUser,
        { email, password }
      )
      .pipe(
        tap((response) => {
          const user = response.user;
          const token = response.token;
          this.currUser.set(user);
          this.isLoggedIn.set(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);

          console.log(`Logged in as: ${user.email}`);
        })
      );
  }

  // organizer login
  loginAsOrganizer(email: string, password: string) {
    return this.http
      .post<{ message: string; token: string; organizer: any }>(
        this.apiUrlLoginOrganizer,
        {
          email,
          password,
        }
      )
      .pipe(
        tap((response) => {
          const organizer = response.organizer;
          const token = response.token;
          this.isOrganizer.set(true);
          this.isLoggedIn.set(true);
          this.currUser.set(organizer);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentOrganizer', JSON.stringify(organizer));
            localStorage.setItem('token', token);
            localStorage.setItem('isOrganizer', 'true');
          }
          console.log(`Logged in as organizer: ${response.organizer.email}`);
        })
      );
  }

  // Stored login session from localstorage, could be removed if needed/wanted
  checkUserSession() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      const storedOrganizer = localStorage.getItem('currentOrganizer');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        this.isLoggedIn.set(true);
        this.currUser.set(user);
        this.token = storedToken;
        console.log('Restored user session as:', user.email);
      } else if (storedOrganizer) {
        const organizer = JSON.parse(storedOrganizer);
        this.isLoggedIn.set(true);
        this.currUser.set(organizer);
        this.isOrganizer.set(true);
        console.log('Restored organizer session as:', organizer.email);
      }
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getIsOrganizer(): boolean {
    return this.isOrganizer();
  }
  getCurrUser(): any {
    const user = this.currUser();
    if (!user && isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      const storedOrganizer = localStorage.getItem('currentOrganizer');
      return storedUser
        ? JSON.parse(storedUser)
        : storedOrganizer
        ? JSON.parse(storedOrganizer)
        : null;
    }
    return user;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.currUser.set(null);
    this.isOrganizer.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentOrganizer');
      localStorage.removeItem('token');
    }
    console.log('Logged out');
  }

  // get token from localstorage
  getToken(): string | null {
    this.token = localStorage.getItem('token');
    console.log('get tokeni:', this.token);
    return this.token;
  }
}
