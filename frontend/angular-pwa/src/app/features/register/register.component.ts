import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InMemoryUserService } from '../../shared/in-memory-services/in-memory-user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  role: string = 'student'; // default role

  constructor(
    private authService: AuthService,
    private userService: InMemoryUserService,
    private router: Router
  ) {}

  onSubmit() {
    const users = this.userService.getUsers()();
    const userExists = users.some((user) => user.email === this.email);
    if (userExists) {
      console.log('Tämä sähköposti on jo käytössä');
      return;
    }
    const newUser = {
      id: users.length + 1,
      firstname: this.firstName,
      lastname: this.lastName,
      email: this.email,
      password: this.password,
      role: 'student',
    };
    this.userService.addUser(newUser);

    // can be changed to navigate to open login-modal
    this.router.navigate(['/home']);
  }
}
