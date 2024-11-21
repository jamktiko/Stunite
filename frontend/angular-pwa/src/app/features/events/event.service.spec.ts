import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { AuthService } from '../../core/services/auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../enviroments/enviroment';
import { Event } from '../../shared/models/event.model';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  const mockAuthService = {
    getToken: jest.fn().mockReturnValue('mock-token'),
  };

  const mockEvents: Event[] = [
    {
      _id: '1',
      eventName: 'Event 1',
      status: 'Varattu',
      publishDateTime: '2024-01-01T12:00:00',
      date: '2024-01-01',
      startingTime: '10:00',
      endingTime: '12:00',
      endingDate: '2024-01-01',
      address: 'Address 1',
      venue: 'Venue 1',
      city: 'Helsinki',
      ticketprice: { minticketprice: 10, maxticketprice: 30 },
      theme: 'Theme 1',
      isFavorite: true,
      details: 'Details 1',
      imageUrl: 'url1',
      ticketLink: 'link1',
      ticketSaleStart: '2023-12-01',
      ticketSaleEnd: '2023-12-31',
      organizerId: 'org-1',
      organizationName: 'Organizer 1',
      eventTags: [],
    },
  ];

  beforeEach(() => {
    jest.mock('../../../enviroments/enviroment', () => ({
      environment: { baseUrl: 'http://localhost:3001' },
    }));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch events from API', () => {
    service.loadEvents().subscribe((events) => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/manage/event/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should create a new event', () => {
    const newEvent: Partial<Event> = {
      eventName: 'New Event',
      date: '2024-05-01',
      ticketprice: { minticketprice: 20, maxticketprice: 40 },
      eventTags: ['music', 'outdoor'],
    };

    service.createEvent(newEvent, null).subscribe((event) => {
      expect(event).toEqual({ ...newEvent, _id: 'new-id' });
    });

    // Change the URL to match the actual endpoint the service is using
    const req = httpMock.expectOne(`${environment.baseUrl}/manage/event/`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newEvent, _id: 'new-id' });
  });

  it('should delete event by id', () => {
    const eventId = '1';

    service.deleteEvent(eventId).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/manage/event/1` // Updated the URL to match the test
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update an event', () => {
    const updatedEvent: Event = {
      ...mockEvents[0],
      eventName: 'Updated Event',
    };

    service.editEvent(updatedEvent).subscribe((event) => {
      expect(event).toEqual(updatedEvent);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/manage/event/${updatedEvent._id}` // Make sure _id is set
    );
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEvent);
  });

  it('should fetch event by id', () => {
    const eventId = '1';

    service.getEventById(eventId).subscribe((event) => {
      expect(event).toEqual(mockEvents[0]);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/manage/event/${eventId}` // Make sure eventId is passed correctly
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents[0]);
  });

  it('should fetch published events', () => {
    service.getPublishedEvents().subscribe((events) => {
      expect(events.length).toBe(1);
      expect(events[0].status).toBe('Varattu');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/manage/event/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });
});
