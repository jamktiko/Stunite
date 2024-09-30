import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Event } from '../models/event.model';
import { Organizer } from '../models/organization.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService {
  private eventsSignal: WritableSignal<Event[]>;
  private organizersSignal: WritableSignal<Organizer[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.eventsSignal = signal(this.loadEvents());
    this.organizersSignal = signal(this.loadOrganizers());
  }

  private loadEvents(): Event[] {
    if (isPlatformBrowser(this.platformId)) {
      const events = localStorage.getItem('events');
      if (events) {
        try {
          return JSON.parse(events) as Event[];
        } catch (error) {
          console.error('Error parsing events from localStorage:', error);
        }
      }
      console.log('ei tapahtumia local storagessa');
    }

    return this.getInitialEvents();
  }

  private loadOrganizers(): Organizer[] {
    if (isPlatformBrowser(this.platformId)) {
      const organizers = localStorage.getItem('organizers');
      if (organizers) {
        try {
          return JSON.parse(organizers) as Organizer[];
        } catch (error) {
          console.error('Error parsing organizers from localStorage:', error);
        }
      }
      console.log('ei järjestäjiä local storagessa');
    }

    return this.getInitialOrganizers();
  }

  private saveEvents() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('events', JSON.stringify(this.eventsSignal()));
    }
  }
  private saveOrganizers() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'organizers',
        JSON.stringify(this.organizersSignal())
      );
    }
  }
  private getInitialEvents(): Event[] {
    return [
      {
        id: 1,
        eventName: 'Syyspippalot',
        date: '20.9.2024',
        startingTime: '19.00',
        venue: 'JAMK etupiha',
        city: 'Jyväskylä',
        address: 'Rajakatu 35 40100 Jyväskylä',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam...',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 2,
        eventName: 'Kevätjuhla',
        date: '15.5.2025',
        startingTime: '18.00',
        venue: 'Kumpulakampus',
        city: 'Helsinki',
        address: 'Kumpulantie 1 00520 Helsinki',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 3,
        eventName: 'Syysmarkkinat',
        date: '10.10.2024',
        startingTime: '10.00',
        venue: 'Tampereen Keskustori',
        city: 'Tampere',
        address: 'Keskustori 2 33100 Tampere',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 4,
        eventName: 'Joulukonsertti',
        date: '24.12.2024',
        startingTime: '17.00',
        venue: 'Helsingin Tuomiokirkko',
        city: 'Helsinki',
        address: 'Katedralikirkkotie 1 00100 Helsinki',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 5,
        eventName: 'Kevätfestivaali',
        date: '5.6.2025',
        startingTime: '12.00',
        venue: 'Turun Yliopistokampus',
        city: 'Turku',
        address: 'Yliopistonkatu 1 20500 Turku',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 6,
        eventName: 'Kevätfestivaali jatkot',
        date: '5.6.2025',
        startingTime: '18.00',
        venue: 'Turun Yliopistokampus',
        city: 'Turku',
        address: 'Yliopistonkatu 1 20500 Turku',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 7,
        eventName: 'Kesäfestivaali',
        date: '15.7.2025',
        startingTime: '15.00',
        venue: 'Pasilan Urheiluhalli',
        city: 'Helsinki',
        address: 'Pasilanraitio 1 00520 Helsinki',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Kesäfestivaali tarjoaa monenlaista viihdettä ja musiikkia. Tule mukaan nauttimaan auringosta ja hyvästä seurasta!',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 8,
        eventName: 'Talvijuhla',
        date: '12.12.2024',
        startingTime: '16.00',
        venue: 'Oulun Kausala',
        city: 'Oulu',
        address: 'Kausalanportti 4 90100 Oulu',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Talvijuhla on perinteinen tapahtuma, jossa voit nauttia talven kauneudesta, markkinoista ja lämpimästä ruoasta.',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 9,
        eventName: 'Vappujuhla',
        date: '30.4.2025',
        startingTime: '14.00',
        venue: 'Helsingin Keskustori',
        city: 'Helsinki',
        address: 'Keskustori 00100 Helsinki',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Vappujuhla on perinteinen juhla, jossa juhlistamme kevään tuloa iloisessa seurassa. Tervetuloa mukaan!',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
      {
        id: 10,
        eventName: 'Syysretki',
        date: '1.11.2024',
        startingTime: '09.00',
        venue: 'Nuuksion kansallispuisto',
        city: 'Espoo',
        address: 'Nuuksiontie 84 02820 Espoo',
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Syysretki Nuuksioon tarjoaa upeita maisemia ja luonnon rauhaa. Tule mukaan nauttimaan syksyn väreistä!',
        isFavorite: false,
        ticketLink: '',
        ticketSaleStart: '',
        ticketSaleEnd: '',
        theme: '',
        imageUrl: '',
        publishDateTime: '',
        status: '',
        organizerId: 1,
      },
    ];
  }

  private getInitialOrganizers(): Organizer[] {
    return [
      {
        id: 1,
        organizerRegistration: {
          email: 'contact@testuniversitysu.com',
          contactPerson: {
            firstName: 'Test',
            lastName: 'User',
            phone: '+358401234567',
          },
        },
        organizationPublicInfo: {
          name: 'Test University Student Union',
          customerServiceEmail: 'service@testuniversitysu.com',
          phone: '+358400000000',
          website: 'http://www.testuniversitysu.com',
          description:
            'The Test University Student Union represents the students and organizes various activities and services to enhance student life.',
          address: {
            street: 'Campus Drive 1',
            postalCode: '00100',
            city: 'Jyväskylä',
          },
        },
        organizationAdditionalInfo: {
          officialName: 'Test University Student Union Ltd.',
          organizationType: 'Student Union',
          registrationNumber: '9876543-2',
          billingAddress: {
            street: 'Billing Street 12',
            postalCode: '00101',
            city: 'Jyväskylä',
          },
          invoiceAddress: 'Billing Street 12, 00101 Jyväskylä',
        },
      },
      {
        id: 2,
        organizerRegistration: {
          email: 'contact@helsinkistudentsu.com',
          contactPerson: {
            firstName: 'Mika',
            lastName: 'Niemi',
            phone: '+358401234568',
          },
        },
        organizationPublicInfo: {
          name: 'Helsinki Student Union',
          customerServiceEmail: 'service@helsinkistudentsu.com',
          phone: '+358400000001',
          website: 'http://www.helsinkistudentsu.com',
          description:
            'Helsinki Student Union aims to improve student welfare and offers various events and services.',
          address: {
            street: 'Student Square 2',
            postalCode: '00200',
            city: 'Helsinki',
          },
        },
        organizationAdditionalInfo: {
          officialName: 'Helsinki Student Union Ltd.',
          organizationType: 'Student Union',
          registrationNumber: '1234567-8',
          billingAddress: {
            street: 'Billing Avenue 3',
            postalCode: '00201',
            city: 'Helsinki',
          },
          invoiceAddress: 'Billing Avenue 3, 00201 Helsinki',
        },
      },
    ];
  }

  getEvents(): WritableSignal<Event[]> {
    return this.eventsSignal;
  }
  getOrganizers(): WritableSignal<Organizer[]> {
    return this.organizersSignal;
  }
  createEvent(newEvent: Event, organizerId: number) {
    newEvent.date = this.formatDate(newEvent.date);
    newEvent.organizerId = organizerId;
    const currentEvents = this.eventsSignal();
    this.eventsSignal.set([...currentEvents, newEvent]);
    this.saveEvents();
  }

  editEvent(updatedEvent: Event) {
    const currentEvents = this.eventsSignal();
    const eventIndex = currentEvents.findIndex(
      (event) => event.id === updatedEvent.id
    );

    if (eventIndex !== -1) {
      currentEvents[eventIndex] = updatedEvent;
      this.eventsSignal.set(currentEvents);
      this.saveEvents();
      console.log('Event has been edited');
    } else {
      console.error(`Event with ID ${updatedEvent.id} not found.`);
    }
  }

  getEventsByOrganizer(organizerId: number): Event[] {
    const currentEvents = this.eventsSignal();
    return currentEvents.filter((event) => event.organizerId === organizerId);
  }
  createOrganizer(newOrganizer: Organizer) {
    const currentOrganizers = this.organizersSignal();
    this.organizersSignal.set([...currentOrganizers, newOrganizer]);
    this.saveOrganizers();
  }

  private formatDate(dateStr: string): string {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${day}.${month}.${year}`;
    }
    console.warn(`Invalid date format: ${dateStr}`);
    return dateStr;
  }
}
