/*
 EVENT SERVICE TESTS 
 npm test -- src/app/features/events/event.service.spec.ts
  - loadEvents()
  - createEvent()
  - deleteEvent()
  - editEvent()
  - getEventById()
  - getPublishedEvents()
  - getEventsByOrganizerId()
*/

import { of } from 'rxjs';
import { EventService } from './event.service';
import { Event } from '../../shared/models/event.model';

describe('EventService', () => {
  let service: EventService;
  let mockHttpService: any;
  let mockAuthService: any;

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
    {
      _id: '2',
      eventName: 'Event 2',
      status: 'Varattu',
      publishDateTime: '2025-01-01T12:00:00',
      date: '2025-01-01',
      startingTime: '14:00',
      endingTime: '16:00',
      endingDate: '2025-01-01',
      address: 'Address 2',
      venue: 'Venue 2',
      city: 'Helsinki',
      ticketprice: { minticketprice: 20, maxticketprice: 40 },
      theme: 'Theme 2',
      isFavorite: false,
      details: 'Details 2',
      imageUrl: 'url2',
      ticketLink: 'link2',
      ticketSaleStart: '2024-12-01',
      ticketSaleEnd: '2024-12-31',
      organizerId: 'org-2',
      organizationName: 'Organizer 2',
      eventTags: [],
    },
    {
      _id: '3',
      eventName: 'Event 3',
      status: 'Tuotannossa',
      publishDateTime: '2023-06-01T12:00:00',
      date: '2023-06-01',
      startingTime: '08:00',
      endingTime: '10:00',
      endingDate: '2023-06-01',
      address: 'Address 3',
      venue: 'Venue 3',
      city: 'Tampere',
      ticketprice: { minticketprice: 15, maxticketprice: 25 },
      theme: 'Theme 3',
      isFavorite: true,
      details: 'Details 3',
      imageUrl: 'url3',
      ticketLink: 'link3',
      ticketSaleStart: '2023-05-01',
      ticketSaleEnd: '2023-05-30',
      organizerId: 'org-3',
      organizationName: 'Organizer 3',
      eventTags: [],
    },
    {
      _id: '4',
      eventName: 'Event 4',
      status: 'Varattu',
      publishDateTime: '2034-01-01T12:00:00',
      date: '2034-01-01',
      startingTime: '09:00',
      endingTime: '11:00',
      endingDate: '2034-01-01',
      address: 'Address 4',
      venue: 'Venue 4',
      city: 'Espoo',
      ticketprice: { minticketprice: 50, maxticketprice: 100 },
      theme: 'Theme 4',
      isFavorite: false,
      details: 'Details 4',
      imageUrl: 'url4',
      ticketLink: 'link4',
      ticketSaleStart: '2033-12-01',
      ticketSaleEnd: '2033-12-31',
      organizerId: 'org-4',
      organizationName: 'Organizer 4',
      eventTags: [],
    },
    {
      _id: '5',
      eventName: 'Event 5',
      status: 'Varattu',
      publishDateTime: '2024-01-10T12:00:00',
      date: '2024-01-10',
      startingTime: '10:00',
      endingTime: '12:00',
      endingDate: '2024-01-10',
      address: 'Address 5',
      venue: 'Venue 5',
      city: 'Helsinki',
      ticketprice: { minticketprice: 25, maxticketprice: 50 },
      theme: 'Theme 5',
      isFavorite: true,
      details: 'Details 5',
      imageUrl: 'url5',
      ticketLink: 'link5',
      ticketSaleStart: '2023-12-01',
      ticketSaleEnd: '2023-12-15',
      organizerId: 'org-1',
      organizationName: 'Organizer 1',
      eventTags: [],
    },
  ];
  beforeEach(() => {
    mockHttpService = {
      get: jest.fn(() => of(mockEvents)),
      post: jest.fn((url: string, event: Event) =>
        of({ ...event, _id: 'new-id' })
      ),
      delete: jest.fn(() => of({})),
      put: jest.fn((url: string, event: Event) => of(event)),
    };

    mockAuthService = {
      getUser: jest.fn(() => of({ id: '123', name: 'Test User' })),
      getToken: jest.fn(() => 'mock-token'),
    };

    service = new EventService(mockHttpService, mockAuthService);
  });

  it('should fetch events from API', () => {
    service.loadEvents().subscribe((events) => {
      expect(events).toEqual(mockEvents);
      expect(events.length).toBe(5);
    });
  });

  it('should create a new event', () => {
    const newEvent: Event = {
      _id: '',
      eventName: 'New Event',
      status: 'Varattu',
      publishDateTime: '2024-05-01T12:00:00',
      date: '2024-05-01',
      startingTime: '09:00',
      endingTime: '11:00',
      endingDate: '2024-05-01',
      address: 'New Address',
      venue: 'New Venue',
      city: 'Helsinki',
      ticketprice: { minticketprice: 30, maxticketprice: 60 },
      theme: 'New Theme',
      isFavorite: false,
      details: 'New Event Details',
      imageUrl: 'newurl',
      ticketLink: 'newlink',
      ticketSaleStart: '2024-04-01',
      ticketSaleEnd: '2024-04-30',
      organizerId: 'org-1',
      organizationName: 'New Organizer',
      eventTags: [],
    };

    service.createEvent(newEvent).subscribe((event) => {
      expect(event).toHaveProperty('_id', 'new-id');
      expect(mockHttpService.post).toHaveBeenCalledWith('api/events', newEvent);
    });
  });

  it('should delete event by id', () => {
    const eventId = '1';
    service.deleteEvent(eventId).subscribe(() => {
      expect(mockHttpService.delete).toHaveBeenCalledWith(
        `api/events/${eventId}`
      );
    });
  });

  it('should update event by id', () => {
    const updatedEvent: Event = {
      _id: '1',
      eventName: 'Updated Event',
      status: 'Tuotannossa',
      publishDateTime: '2024-01-01T12:00:00',
      date: '2024-01-01',
      startingTime: '10:00',
      endingTime: '12:00',
      endingDate: '2024-01-01',
      address: 'Updated Address',
      venue: 'Updated Venue',
      city: 'Helsinki',
      ticketprice: { minticketprice: 20, maxticketprice: 40 },
      theme: 'Updated Theme',
      isFavorite: true,
      details: 'Updated Details',
      imageUrl: 'updatedurl',
      ticketLink: 'updatedlink',
      ticketSaleStart: '2023-12-01',
      ticketSaleEnd: '2023-12-31',
      organizerId: 'org-1',
      organizationName: 'Updated Organizer',
      eventTags: [],
    };

    service.editEvent(updatedEvent).subscribe((event) => {
      expect(event).toEqual(updatedEvent);
      expect(mockHttpService.put).toHaveBeenCalledWith(
        `api/events/${updatedEvent._id}`,
        updatedEvent
      );
    });
  });

  it('should fetch event by id', () => {
    const eventId = '1';
    service.getEventById(eventId).subscribe((event) => {
      expect(event).toEqual(mockEvents.find((e) => e._id === eventId));
      expect(mockHttpService.get).toHaveBeenCalledWith(`api/events/${eventId}`);
    });
  });

  it('should fetch only published events', () => {
    service.getPublishedEvents().subscribe((events) => {
      const publishedEvents = mockEvents.filter(
        (e) => new Date(e.publishDateTime) <= new Date()
      );
      expect(events).toEqual(publishedEvents);
      expect(events.length).toBeGreaterThan(0);
    });
  });

  it('should fetch events by organizerId', () => {
    const organizerId = 'org-1';
    service.getEventsByOrganizerId(organizerId).subscribe((events) => {
      const eventsByOrganizer = mockEvents.filter(
        (e) => e.organizerId === organizerId
      );
      expect(events).toEqual(eventsByOrganizer);
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
