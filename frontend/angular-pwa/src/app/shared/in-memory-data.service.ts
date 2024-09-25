import { Injectable, Inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService {
  private eventsSignal: WritableSignal<Event[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.eventsSignal = signal(this.loadEvents());
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
      console.log("ei tapahtumia local storagessa");
    }

    return this.getInitialEvents();
  }

  private saveEvents() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('events', JSON.stringify(this.eventsSignal()));
    }
  }

  private getInitialEvents(): Event[] {
    return [
      {
        id: 1,
        eventName: 'Syyspippalot',
        date: '20.9.2024',
        startingTime: '19.00',
        location: {
          venue: 'JAMK etupiha',
          city: 'Jyväskylä',
          address: 'Rajakatu 35 40100 Jyväskylä',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam...',
      },
      {
        id: 2,
        eventName: 'Kevätjuhla',
        date: '15.5.2025',
        startingTime: '18.00',
        location: {
          venue: 'Kumpulakampus',
          city: 'Helsinki',
          address: 'Kumpulantie 1 00520 Helsinki',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?',
      },
      {
        id: 3,
        eventName: 'Syysmarkkinat',
        date: '10.10.2024',
        startingTime: '10.00',
        location: {
          venue: 'Tampereen Keskustori',
          city: 'Tampere',
          address: 'Keskustori 2 33100 Tampere',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      },
      {
        id: 4,
        eventName: 'Joulukonsertti',
        date: '24.12.2024',
        startingTime: '17.00',
        location: {
          venue: 'Helsingin Tuomiokirkko',
          city: 'Helsinki',
          address: 'Katedralikirkkotie 1 00100 Helsinki',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
      },
      {
        id: 5,
        eventName: 'Kevätfestivaali',
        date: '5.6.2025',
        startingTime: '12.00',
        location: {
          venue: 'Turun Yliopistokampus',
          city: 'Turku',
          address: 'Yliopistonkatu 1 20500 Turku',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      },
      {
        id: 6,
        eventName: 'Kevätfestivaali jatkot',
        date: '5.6.2025',
        startingTime: '18.00',
        location: {
          venue: 'Turun Yliopistokampus',
          city: 'Turku',
          address: 'Yliopistonkatu 1 20500 Turku',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      },
      {
        id: 7,
        eventName: 'Kesäfestivaali',
        date: '15.7.2025',
        startingTime: '15.00',
        location: {
          venue: 'Pasilan Urheiluhalli',
          city: 'Helsinki',
          address: 'Pasilanraitio 1 00520 Helsinki',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Kesäfestivaali tarjoaa monenlaista viihdettä ja musiikkia. Tule mukaan nauttimaan auringosta ja hyvästä seurasta!',
      },
      {
        id: 8,
        eventName: 'Talvijuhla',
        date: '12.12.2024',
        startingTime: '16.00',
        location: {
          venue: 'Oulun Kausala',
          city: 'Oulu',
          address: 'Kausalanportti 4 90100 Oulu',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Talvijuhla on perinteinen tapahtuma, jossa voit nauttia talven kauneudesta, markkinoista ja lämpimästä ruoasta.',
      },
      {
        id: 9,
        eventName: 'Vappujuhla',
        date: '30.4.2025',
        startingTime: '14.00',
        location: {
          venue: 'Helsingin Keskustori',
          city: 'Helsinki',
          address: 'Keskustori 00100 Helsinki',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Vappujuhla on perinteinen juhla, jossa juhlistamme kevään tuloa iloisessa seurassa. Tervetuloa mukaan!',
      },
      {
        id: 10,
        eventName: 'Syysretki',
        date: '1.11.2024',
        startingTime: '09.00',
        location: {
          venue: 'Nuuksion kansallispuisto',
          city: 'Espoo',
          address: 'Nuuksiontie 84 02820 Espoo',
        },
        ticketprice: {
          minticketprice: 5,
          maxticketprice: 7,
        },
        details:
          'Syysretki Nuuksioon tarjoaa upeita maisemia ja luonnon rauhaa. Tule mukaan nauttimaan syksyn väreistä!',
      },
    ];
  }

  getEvents(): WritableSignal<Event[]> {
    return this.eventsSignal;
  }

  createEvent(newEvent: Event) {
    newEvent.date = this.formatDate(newEvent.date);

    const currentEvents = this.eventsSignal();
    this.eventsSignal.set([...currentEvents, newEvent]);
    this.saveEvents();
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
