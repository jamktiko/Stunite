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
import { NotificationService } from '../../core/services/notification.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationService
  ) {}

  get authenticated(): boolean {
    return this.authService.isAuthenticated();
  }

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
    this.router.navigate(['/']);
    this.onLogout();
  }

  triggerLoginModal() {
    this.openLoginModal.emit();
  }

  toMobileLogin() {
    this.router.navigate(['/mobile-login']);
  }
  onMenuClick() {
    this.menuOpen = !this.menuOpen;
    const body = document.body;
    const html = document.documentElement;

    if (this.menuOpen) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.height = '100%';
    } else {
      // enable scroll after clicking menu link
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.height = '';
      html.style.height = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-mobile') && !target.closest('.menu')) {
      this.menuOpen = false;
      this.restoreScroll();
    }
    if (!target.closest('.profile-menu') && !target.closest('.login-icon')) {
      this.showProfileMenu = false;
    }
  }

  // enable scroll when closing menu by clicking outside  the element
  restoreScroll() {
    const body = document.body;
    const html = document.documentElement;

    body.style.overflow = '';
    html.style.overflow = '';
    body.style.height = '';
    html.style.height = '';
  }

  closeProfileMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      this.showProfileMenu = false;
    }
  }
  onLogout() {
    this.notificationsService.showInfo('Uloskirjauduttu.', '');
  }
}
