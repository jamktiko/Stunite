import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();

  email: string = '';
  password: string = '';

  onClose() {
    this.close.emit();
  }
  // Login will be edited in the future when auth.service is done
  onSubmit() {
    console.log('Login: ', this.email, this.password);
  }
}
