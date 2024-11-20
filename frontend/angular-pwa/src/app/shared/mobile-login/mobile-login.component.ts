import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.css',
})
export class MobileLoginComponent {
  showLoginForm: boolean = false;
  showLoginButtons: boolean = true;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  goRegister() {
    this.router.navigate(['/register']);
  }
  onBack() {
    this.showLoginForm = false;
    this.showLoginButtons = true;
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/events']);
        console.log('Login successful');
        this.onLoginSuccess();
        const currentUser = this.authService.getCurrUser();
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        console.log('Login failed');
      },
    });
  }
  showLogin() {
    this.showLoginForm = true;
    this.showLoginButtons = false;
  }
  openOrganizerLogin() {
    this.router.navigate(['/mobile-organizer-login']);
  }
  onLoginSuccess() {
    this.notificationService.showSuccess('Sisäänkirjautuminen onnistui.', '');
  }
}
