import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { provideToastr } from 'ngx-toastr';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openOrganizerModal = new EventEmitter<void>();

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

  onClose() {
    this.close.emit();
  }
  onBack() {
    this.showLoginForm = false;
    this.showLoginButtons = true;
  }
  goRegister() {
    this.onClose();
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.onClose();
        this.router.navigate(['/events']);
        console.log('Login successful');
        this.onLoginSuccess();
        const currentUser = this.authService.getCurrUser();
      },
      error: () => {
        this.errorMessage = 'Sähköposti tai salasana väärin';
        console.log('Login failed');
      },
    });
  }

  showLogin() {
    this.showLoginForm = true;
    this.showLoginButtons = false;
  }
  openOrganizerLogin() {
    this.onClose();
    this.openOrganizerModal.emit();
  }

  onLoginSuccess() {
    this.notificationService.showSuccess('Sisäänkirjautuminen onnistui.', '');
  }
}
