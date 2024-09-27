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

  goRegister() {
    this.onClose();
    this.router.navigate(['/register']);
  }
  onSubmit() {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.onClose();
      const role = this.authService.getCurrentUserRole();

      if (role === 'admin') {
        this.router.navigate(['/admin-view']);
      } else if (role === 'organizer') {
        this.router.navigate(['/organizer-view']);
      } else if (role === 'student') {
        this.router.navigate(['/events']);
      } else {
        console.warn('Unknown role:', role);
      }
      console.log('Login successful');
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}
