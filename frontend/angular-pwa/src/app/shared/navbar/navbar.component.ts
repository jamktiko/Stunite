import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  signal,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() openLoginModal = new EventEmitter<void>();

  menuOpen = false;
  showProfileMenu = false;

  username = computed(() => this.authService.getCurrUser()?.firstName || '');
  email = computed(() => this.authService.getCurrUser()?.email || '');

  constructor(private authService: AuthService, private router: Router) {}
  //
  get authenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  //
  get isOrganizer(): boolean {
    return this.authenticated && this.authService.getIsOrganizer();
  }

  onProfileIconClick() {
    if (this.authenticated) {
      this.showProfileMenu = !this.showProfileMenu;
    } else {
      this.triggerLoginModal();
    }
  }

  onProfileClick() {
    this.router.navigate(['/userprofile']);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  triggerLoginModal() {
    this.openLoginModal.emit();
  }

  toMobileLogin() {
    this.router.navigate(['/mobile-login']);
  }
  onMenuClick() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-mobile') && !target.closest('.menu')) {
      this.menuOpen = false;
    }
    if (!target.closest('.profile-menu') && !target.closest('.login-icon')) {
      this.showProfileMenu = false;
    }
  }

  closeProfileMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      this.showProfileMenu = false;
    }
  }
}
