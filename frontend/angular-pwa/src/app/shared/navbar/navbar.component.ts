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

  menuOpen = false;
  username = '';
  constructor(private authService: AuthService, private router: Router) {}

  get authenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  getUser() {
    const user = this.authService.getCurrUser();
    if (user) {
      this.username = user.firstname;
      return this.username;
    }
    return '';
  }
  onProfileClick() {
    if (this.authenticated) {
      const currentUser = this.authService.getCurrUser();
      if (currentUser) {
        if (currentUser.organizationName) {
          this.router.navigate(['/organizer-view']);
        } else {
          this.router.navigate(['/userprofile']);
        }
      }
    } else {
      this.triggerLoginModal();
    }
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  triggerLoginModal() {
    this.openLoginModal.emit();
  }

  onMenuClick() {
    this.menuOpen = !this.menuOpen;
  }
}
