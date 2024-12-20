import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  JwtHelper = new JwtHelperService();
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private isOrganizer: WritableSignal<boolean> = signal(false);
  private currUser: WritableSignal<any | null> = signal(null);

  private currUserSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  private token: string | null = null;

  private apiUrlLoginUser = `${environment.baseUrl}/login/user`;
  private apiUrlSignupUser = `${environment.baseUrl}/signup/user`;
  private apiUrlLoginOrganizer = `${environment.baseUrl}/login/organizer`;
  private apiUrlManageUser = `${environment.baseUrl}/manage/user`;

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
          this.updateCurrUser(user);
          this.currUser.set(user);
          this.isLoggedIn.set(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);
        })
      );
  }

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
        })
      );
  }
  editUser(updatedUser: User): Observable<User> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders().set('x-access-token', token);
    const url = `${this.apiUrlManageUser}/${updatedUser.id}`;

    // console.log('Updating user:', updatedUser); // DEBUG
    // console.log('PUT URL:', url); // DEBUG

    return this.http.put<User>(url, updatedUser, { headers }).pipe(
      tap((editedUser) => {
        // Päivitä currentUser ja localStorage
        this.currUser.set(editedUser);
        localStorage.setItem('currentUser', JSON.stringify(editedUser)); // Tallenna localStorageen
        // console.log('User updated successfully:', editedUser);
      }),
      catchError((error) => {
        console.error('Päivitys epäonnistui:', error);
        return throwError(() => error);
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
      } else if (storedOrganizer) {
        const organizer = JSON.parse(storedOrganizer);
        this.isLoggedIn.set(true);
        this.currUser.set(organizer);
        this.isOrganizer.set(true);
      }
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getIsOrganizer(): boolean {
    return this.isOrganizer();
  }

  // get current user signal
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
  // get current user observable
  getCurrUserObser(): Observable<any> {
    return this.currUserSubject.asObservable();
  }
  // update current user observable
  updateCurrUser(user: any): void {
    this.currUserSubject.next(user);
  }

  // fetches data from backend by using token and userId in localStorage
  fetchCurrUser() {
    const token = this.getToken();
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.error('No token or user ID found');
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders().set('x-access-token', token);

    return this.http
      .get<User>(`${this.apiUrlManageUser}/${userId}`, { headers })
      .pipe(
        tap((user) => {
          if (user && user._id) {
            user.id = user._id;
            delete user._id;
          }
          return user;
        }),
        catchError((error) => {
          console.error('Failed to fetch current user:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.currUser.set(null);
    this.isOrganizer.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentOrganizer');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isOrganizer');
    }
    console.log('Logged out');
  }

  // get token from localstorage
  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }
}
