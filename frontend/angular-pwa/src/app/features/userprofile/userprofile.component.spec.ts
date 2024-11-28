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
  someMethod() {
    return of({});
  }
}

// Mock NotificationService
class MockNotificationService {
  notifySuccess(message: string) {}
  notifyError(message: string) {}
}

describe('UserprofileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        UserprofileComponent, // Standalone component included in imports
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: MockNotificationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(UserprofileComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy(); // Jestin toBeTruthy toimii tässä
  });
});
