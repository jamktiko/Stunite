import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizer-view',
  standalone: true,
  templateUrl: './organizer-view.component.html',
  styleUrl: './organizer-view.component.css',
})
export class OrganizerViewComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToCreateEvent() {
    this.router.navigate(['/organizer-view/create-event'])
  }
}
