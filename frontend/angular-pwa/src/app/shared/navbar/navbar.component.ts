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
  // Function that checks does navbars icon bring you to
  // login modal or profile page
  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/userprofile']);
    } else {
      this.triggerLoginModal();
    }
  }

  triggerLoginModal() {
    this.openLoginModal.emit();
  }

}
