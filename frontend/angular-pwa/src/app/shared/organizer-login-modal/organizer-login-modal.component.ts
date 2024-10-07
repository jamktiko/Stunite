import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer-login-modal.component.html',
  styleUrls: ['./organizer-login-modal.component.css'],
})
export class OrganizerLoginModalComponent {
  @Output() close = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onClose() {
    this.close.emit();
  }
  onSubmit() {
    this.authService.loginAsOrganizer(this.email, this.password).subscribe({
      next: () => {
        this.onClose();
        this.router.navigate(['/organizer-view']);
        console.log('Organizer login successful');
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        console.log('Login failed');
      },
    });
  }
}
