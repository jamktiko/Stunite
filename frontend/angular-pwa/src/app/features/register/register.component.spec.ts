// npm test -- src/app/features/register/register.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;

  beforeEach(() => {
    // Mock AuthService
    authServiceMock = {
      register: jest.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent], // Standalone-komponentti lisätään imports:iin
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the form with default values', () => {
    const form = component.registerForm;
    expect(form.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
      phoneNumber: '',
      supporterMember: false,
      supporterPayment: null,
    });
  });

  it('should call AuthService.register on valid form submission', () => {
    const form = component.registerForm;
    form.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123',
      phoneNumber: '12345678',
      supporterMember: true,
      supporterPayment: 10,
    });

    component.onSubmit(); // Kutsutaan komponentin submit-metodia
    expect(authServiceMock.register).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123',
      phoneNumber: '12345678',
      supporterMember: true,
      supporterPayment: 10,
    });
  });
});
