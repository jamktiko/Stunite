import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../shared/models/user.model';

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
  private apiUrlSignupUser = 'http://localhost:3001/signup/user';

  private apiUrlLoginOrganizer = 'http://localhost:3001/login/organizer';

  private apiUrlManageUser = 'http://localhost:3001/manage/user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkUserSession();
    }
  }
  // normal user login
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
          localStorage.setItem('userId', user.id);

          console.log(`Logged in as(id): ${user.id}`);
        })
      );
  }
  //normal user register
  // normal user register
  register(userData: any) {
    return this.http
      .post<{ message: string; token?: string; user?: any }>(
        this.apiUrlSignupUser,
        userData
      )
      .pipe(
        tap((response) => {
          if (response.token && response.user) {
            this.currUser.set(response.user);
            this.isLoggedIn.set(true);
            this.token = response.token;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem(
                'currentUser',
                JSON.stringify(response.user)
              );
              localStorage.setItem('token', response.token);
            }
            console.log('Registration successful and user logged in.');
          } else {
            console.log(response.message);
          }
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return throwError(() => error);
        })
      );
  }

  // organizer register
  registerAsOrganizer() {}

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

  editUser(updatedUser: User): void {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrlManageUser}/${updatedUser.id}`;

    this.http
      .put<User>(url, updatedUser, { headers })
      .pipe(
        tap((editedUser) => {
          this.currUser.set(editedUser);
        }),
        catchError((error) => {
          console.error('Päivitys epäonnistui:', error);
          return throwError(error);
        })
      )
      .subscribe();
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
