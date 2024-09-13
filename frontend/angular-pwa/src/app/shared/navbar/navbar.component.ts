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
   *Function that brings you to either userprofile or admin-view
   * page, if you are logged in and click profile icon.
   */
  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isUserAdmin()) {
        this.router.navigate(['/admin-view']);
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
