// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CalendarComponent } from './calendar.component';
// import { EventService } from '../../features/events/event.service';
// import { of, throwError } from 'rxjs';
// import { IgxCalendarComponent } from 'igniteui-angular';
// import { By } from '@angular/platform-browser';

// describe('CalendarComponent', () => {
//   let component: CalendarComponent;
//   let fixture: ComponentFixture<CalendarComponent>;
//   let eventServiceMock: any;

//   beforeEach(async () => {
//     // Mockataan EventService
//     eventServiceMock = {
//       getPublishedEvents: jest.fn(),
//     };

//     await TestBed.configureTestingModule({
//       imports: [CalendarComponent],
//       providers: [{ provide: EventService, useValue: eventServiceMock }],
//     }).compileComponents();

//     fixture = TestBed.createComponent(CalendarComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load events on ngOnInit', () => {
//     const mockEvents = [
//       {
//         date: '11.11.2024',
//         eventName: 'Test Event',
//         _id: '123',
//         city: 'Helsinki',
//       },
//     ];
//     eventServiceMock.getPublishedEvents.mockReturnValue(of(mockEvents));

//     component.ngOnInit();

//     expect(component.events).toBeDefined();
//     expect(component.eventsMap.size).toBeGreaterThan(0);
//   });

//   it('should handle error when fetching events', () => {
//     const consoleSpy = jest.spyOn(console, 'error');
//     eventServiceMock.getPublishedEvents.mockReturnValue(
//       throwError(() => new Error('Fetch error'))
//     );

//     component.ngOnInit();

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Error fetching events:',
//       expect.any(Error)
//     );
//   });

//   it('should update eventsMap correctly', () => {
//     const mockEvents = [
//       {
//         date: '11.11.2024',
//         eventName: 'Test Event 1',
//         _id: '1',
//         city: 'Tampere',
//       },
//       {
//         date: '12.11.2024',
//         eventName: 'Test Event 2',
//         _id: '2',
//         city: 'Helsinki',
//       },
//     ];

//     (component as any).updateEventsMap(mockEvents);

//     expect(component.eventsMap.size).toBe(2);
//     expect(component.eventsMap.get('Mon Nov 11 2024')).toEqual([mockEvents[0]]);
//     expect(component.eventsMap.get('Tue Nov 12 2024')).toEqual([mockEvents[1]]);
//   });

//   it('should parse date string correctly', () => {
//     const parsedDate = component.parseDate('11.11.2024');
//     expect(parsedDate?.getFullYear()).toBe(2024);
//     expect(parsedDate?.getMonth()).toBe(10); // Marraskuu (0-indeksi)
//     expect(parsedDate?.getDate()).toBe(11);
//   });

//   it('should format date in Finnish correctly', () => {
//     const date = new Date(2024, 10, 11); // 11. marraskuuta 2024
//     const formattedDate = component.formatDateInFinnish(date);

//     expect(formattedDate).toBe('11. marraskuuta 2024');
//   });

//   it('should update selectedEvents on date selection', () => {
//     const mockEvents = [
//       {
//         date: '11.11.2024',
//         eventName: 'Test Event',
//         _id: '123',
//         city: 'Helsinki',
//       },
//     ];
//     component.updateEventsMap(mockEvents);

//     const selectedDate = new Date(2024, 10, 11);
//     component.onSelection(selectedDate);

//     expect(component.selectedDate).toBe('11. marraskuuta 2024');
//     expect(component.selectedEvents.length).toBe(1);
//     expect(component.selectedEvents[0].eventName).toBe('Test Event');
//   });
// });
