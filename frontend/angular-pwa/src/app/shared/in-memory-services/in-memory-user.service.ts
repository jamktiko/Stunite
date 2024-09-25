import { Injectable, signal, WritableSignal } from '@angular/core';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  major?: string;
  organizerId?: number;
  organizationId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class InMemoryUserService {
  private usersSignal: WritableSignal<User[]>;

  constructor() {
    this.usersSignal = signal(this.getInitialUsers());
  }

  private getInitialUsers(): User[] {
    return [
      {
        id: 1,
        firstname: 'Organizer',
        lastname: 'User',
        email: 'organizer@example.com',
        password: 'organizerpassword',
        role: 'organizer',
        major: 'eventManagement',
        organizerId: 1,
        organizationId: 1,
      },
      {
        id: 2,
        firstname: 'Student',
        lastname: 'User',
        email: 'student@example.com',
        password: 'studentpassword',
        role: 'student',
        major: 'computerScience',
      },
    ];
  }

  getUsers(): WritableSignal<User[]> {
    return this.usersSignal;
  }

  addUser(newUser: User) {
    const currentUsers = this.usersSignal();
    this.usersSignal.set([...currentUsers, newUser]);
  }

  removeUser(userId: number) {
    const currentUsers = this.usersSignal();
    this.usersSignal.set(currentUsers.filter((user) => user.id !== userId));
  }

  updateUser(updatedUser: User) {
    const currentUsers = this.usersSignal();
    this.usersSignal.set(
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  }
  // should maybe be using id to get current users but lets use this for now(because it works...)
  getCurrentUser(email: string): User | null {
    const currentUsers = this.usersSignal();
    return currentUsers.find((user) => user.email === email) || null;
  }
}
