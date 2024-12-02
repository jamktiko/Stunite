//npm test -- src/app/core/guards/event-guard.guard.spec.ts

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EventGuard } from './event-guard.guard';
import { EventService } from '../../features/events/event.service';
import { AuthService } from '../../core/services/auth.service';

describe('EventGuard', () => {
  let guard: EventGuard;
  let routerMock: { navigate: jest.Mock };
  let eventServiceMock: { getEventById: jest.Mock };
  let authServiceMock: { getCurrUser: jest.Mock; getIsOrganizer: jest.Mock };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    eventServiceMock = { getEventById: jest.fn() };
    authServiceMock = {
      getCurrUser: jest.fn(),
      getIsOrganizer: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        EventGuard,
        { provide: Router, useValue: routerMock },
        { provide: EventService, useValue: eventServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    guard = TestBed.inject(EventGuard);
  });

  it('should allow access if event exists and is visible', (done) => {
    const mockEvent = {
      _id: '1',
      publishDateTime: new Date(Date.now() - 1000).toISOString(),
    };

    eventServiceMock.getEventById.mockReturnValue(of(mockEvent));
    authServiceMock.getIsOrganizer.mockReturnValue(false);

    guard
      .canActivate({ paramMap: { get: () => '1' } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        done();
      });
  });

  it('should redirect to home if event does not exist', (done) => {
    eventServiceMock.getEventById.mockReturnValue(of(undefined));

    guard
      .canActivate({ paramMap: { get: () => '1' } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
  });

  it('should redirect to home if eventId is missing', (done) => {
    guard
      .canActivate({ paramMap: { get: () => null } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
  });

  it('should allow access if user is an organizer', (done) => {
    const mockEvent = {
      _id: '1',
      publishDateTime: new Date(Date.now() + 100000).toISOString(),
    };

    eventServiceMock.getEventById.mockReturnValue(of(mockEvent));
    authServiceMock.getIsOrganizer.mockReturnValue(true);

    guard
      .canActivate({ paramMap: { get: () => '1' } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        done();
      });
  });

  it('should allow access if event is published and user is not an organizer', (done) => {
    const mockEvent = {
      _id: '1',
      publishDateTime: new Date(Date.now() - 1000).toISOString(),
    };

    eventServiceMock.getEventById.mockReturnValue(of(mockEvent));
    authServiceMock.getIsOrganizer.mockReturnValue(false);

    guard
      .canActivate({ paramMap: { get: () => '1' } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        done();
      });
  });

  it('should redirect to home if event is not published and user is not an organizer', (done) => {
    const mockEvent = {
      _id: '1',
      publishDateTime: new Date(Date.now() + 100000).toISOString(),
    };

    eventServiceMock.getEventById.mockReturnValue(of(mockEvent));
    authServiceMock.getIsOrganizer.mockReturnValue(false);

    guard
      .canActivate({ paramMap: { get: () => '1' } } as any, {} as any)
      .subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
  });
});
