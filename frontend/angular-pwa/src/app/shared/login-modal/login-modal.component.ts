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

  constructor(private authService: AuthService, private router: Router) {}

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
    this.onClose();
    this.openOrganizerModal.emit();
  }
}
