import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  //
  showPass: boolean = false;
  showPass2: boolean = false;
  //
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        supporterMember: [false],
        supporterPayment: [null],
      },
      { validators: this.passMatch }
    );
  }

  passMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password2')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passMismatch: true }
      : null;
  }

  togglePassVisibility(isVisible: boolean): void {
    this.showPass = isVisible;
  }
  togglePass2Visibility(isVisible: boolean): void {
    this.showPass2 = isVisible;
  }
  onCancel() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      this.authService.register(formValues).subscribe(
        (response) => {
          this.success = response.message;
          this.error = null;
          this.registerForm.reset();
        },
        (error) => {
          // if backend gives error 'Email alredy in use'
          // set error in frontend to 'Sähköposti on jo käytössä'
          if (
            error.status === 400 &&
            error.error?.error === 'Email already in use'
          ) {
            this.error = 'Sähköposti on jo käytössä.';
          } else {
            this.error = 'Registration failed: ' + error.message;
          }
          this.success = null;
        }
      );
    }
  }
}
