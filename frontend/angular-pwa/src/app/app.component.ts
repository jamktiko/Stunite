import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginModalComponent } from './shared/login-modal/login-modal.component';
import { CommonModule } from '@angular/common';
import { OrganizerLoginModalComponent } from './shared/organizer-login-modal/organizer-login-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent,
    CommonModule,
    OrganizerLoginModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showLoginModal: boolean = false;
  showOrganizerLoginModal: boolean = false;
  title = 'angular-pwa';

  openLoginModal() {
    this.showLoginModal = true;
    this.showOrganizerLoginModal = false;
  }

  openOrganizerLoginModal() {
    this.showLoginModal = false;
    this.showOrganizerLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.showOrganizerLoginModal = false;
  }
}
