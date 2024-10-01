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

  login(email: string, password: string): boolean {
    const users = this.userService.getUsers()();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.isLoggedIn.set(true);
      this.role.set(user.role);
      this.currUser.set({ ...user });

      //
      this.profileService.getUserProfile(user.id);
      //

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: user.id,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            organizerId: user.organizerId,
          })
        );
      }

      console.log(`Logged in as: ${user.role}`);
      return true;
    } else {
      console.log('Login failed: Invalid credentials');
      return false;
    }
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
