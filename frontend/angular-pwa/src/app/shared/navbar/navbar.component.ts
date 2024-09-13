import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() openLoginModal = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Function that directs the user to the appropriate page
   * based on their role (admin, organizer, or default user profile).
   */
  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role === 'admin') {
        this.router.navigate(['/admin-view']);
      } else if (role === 'organizer') {
        this.router.navigate(['/organizer-view']);
      } else {
        this.router.navigate(['/userprofile']);
      }
    } else {
      this.triggerLoginModal();
    }
  }
  /**
   * Calls openLoginModal, which opens Login Modal.
   */
  triggerLoginModal() {
    this.openLoginModal.emit();
  }
}
