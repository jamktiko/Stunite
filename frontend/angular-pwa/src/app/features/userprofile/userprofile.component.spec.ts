// npm test -- src/app/features/userprofile/userprofile.component.spec.ts

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserprofileComponent } from './userprofile.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { of } from 'rxjs';

// Mock AuthService
class MockAuthService {
  // Mock methods used in UserprofileComponent
  someMethod() {
    return of({});
  }
}

// Mock NotificationService
class MockNotificationService {
  // Mock methods used in UserprofileComponent
  notifySuccess(message: string) {}
  notifyError(message: string) {}
}

describe('UserprofileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserprofileComponent, // Add standalone component
        ReactiveFormsModule, // Include necessary modules
        HttpClientTestingModule, // Mock HttpClient
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // Mock AuthService
        { provide: NotificationService, useClass: MockNotificationService }, // Mock NotificationService
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(UserprofileComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
