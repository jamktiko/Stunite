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

  // current Users data is stored in here for now
  private currUser: any = null;

  constructor(private http: HttpClient) {}

  /**
   * @param email
   * @param password
   * Goes through credentials.json and tries to find email and password that
   * matches the given parameters.
   * If match is found, isLoggedIn will be changed to true and function will return true.
   * @returns boolean
   */
  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          this.isLoggedIn = true;
          this.isAdmin = user.isAdmin;
          // stores current users data
          this.currUser = { ...user };
          return true;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Return users admin status (isAdmin: true/false)
   * @returns
   */
  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  /**
   * Returns isLoggedIn boolen
   * @returns
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getCurrUser(): any {
    return this.currUser;
  }

  // This function will be edited to send POST to backend
  // when user edits its information
  updateCurrUserDetails(newDetails: {
    firstname: string;
    lastname: string;
  }): void {
    if (this.currUser) {
      this.currUser.firstname = newDetails.firstname;
      this.currUser.lastname = newDetails.lastname;
    }
  }

  /**
   * Takes care of logging out (Frontend)
   * Sets isLoggedIn false, isAdmin false and currUser null.
   */
  logout(): void {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.currUser = null;
    console.log('Logged out');
  }
}
