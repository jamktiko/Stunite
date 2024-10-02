import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private currUser: WritableSignal<any | null> = signal(null);

  private apiUrlLoginUser = 'http://localhost:3001/login/user';
  private apiUrlLoginOrganizer = 'http://localhost:3001/login/organizer';

  constructor(
    private http: HttpClient,
    private profileService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkUserSession();
    }
  }

  // normal user login
  login(email: string, password: string) {
    return this.http
      .post<{ message: string; user: any }>(this.apiUrlLoginUser, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.isLoggedIn.set(true);
          this.currUser.set(response.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          console.log(`Logged in as: ${response.user.email}`); // miten saan id käyttöön :( )
        })
      );
  }

  // organizer login
  loginAsOrganizer(email: string, password: string) {
    return this.http
      .post<{ message: string; organizer: any }>(this.apiUrlLoginOrganizer, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.isLoggedIn.set(true);
          this.currUser.set(response.organizer);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(
              'currentOrganizer',
              JSON.stringify(response.organizer)
            );
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
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.isLoggedIn.set(true);
        this.currUser.set(user);
        console.log('Restored user session as:', user.email);
      } else if (storedOrganizer) {
        const organizer = JSON.parse(storedOrganizer);
        this.isLoggedIn.set(true);
        this.currUser.set(organizer);
        console.log('Restored organizer session as:', organizer.email);
      }
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentOrganizer');
    }
    console.log('Logged out');
  }
}
