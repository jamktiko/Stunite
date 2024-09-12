import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  onClose() {
    this.close.emit();
  }
  // Login will be edited in the future when backend is ready
  // For now we use basic Frontend login (httpClient gets login
  // credentials from credentials.json)
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe((isAuth) => {
      if (isAuth) {
        // Close modal after login is successful
        this.onClose();
        if (this.authService.isUserAdmin()) {
          this.router.navigate(['/admin-view']);
        } else {
          this.router.navigate(['/events']);
        }
        console.log('Login successful')
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
