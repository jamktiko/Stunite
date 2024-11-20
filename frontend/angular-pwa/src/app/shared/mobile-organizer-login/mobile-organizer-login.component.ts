import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-mobile-organizer-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mobile-organizer-login.component.html',
  styleUrl: './mobile-organizer-login.component.css',
})
export class MobileOrganizerLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onBack() {
    this.router.navigate(['/mobile-login']);
  }
  onSubmit() {
    this.authService.loginAsOrganizer(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/organizer-view']);
        console.log('Organizer login successful');
        this.onLoginSuccess();
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        console.log('Login failed');
      },
    });
  }
  onLoginSuccess() {
    this.notificationService.showSuccess('Sisäänkirjautuminen onnistui.', '');
  }
}
