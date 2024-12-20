import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-organizer-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer-login-modal.component.html',
  styleUrls: ['./organizer-login-modal.component.css'],
})
export class OrganizerLoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openLoginModal = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {}

  onClose() {
    this.close.emit();
  }

  onBack() {
    this.onClose();
    this.openLoginModal.emit();
  }
  onSubmit() {
    this.authService.loginAsOrganizer(this.email, this.password).subscribe({
      next: () => {
        this.onClose();
        this.router.navigate(['/organizer-view']);
        console.log('Organizer login successful');
        this.onLoginSuccess();
      },
      error: () => {
        this.errorMessage = 'Sähköposti tai salasana väärin';
        console.log('Login failed');
      },
    });
  }
  onLoginSuccess() {
    this.notificationService.showSuccess('Sisäänkirjautuminen onnistui.', '');
  }
}
