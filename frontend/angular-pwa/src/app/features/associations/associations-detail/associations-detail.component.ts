import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssociationService } from '../association.service';
import { EventService } from '../../events/event.service';
import { Event } from '../../../shared/models/event.model';
import { EventcardComponent } from '../../events/eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-associations-detail',
  standalone: true,
  imports: [CommonModule, EventcardComponent, FormsModule],
  templateUrl: './associations-detail.component.html',
  styleUrls: ['./associations-detail.component.css'],
})
export class AssociationsDetailComponent implements OnInit {
  association: any;
  organizerId: string = '';
  allEvents: Event[] = [];
  filteredFutureEventsSignal!: Signal<Event[]>;
  filteredPastEventsSignal!: Signal<Event[]>;
  websiteUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    // id from url
    const id = this.route.snapshot.paramMap.get('id');

    // if id found, call getAssociationById(id), else console.log error
    if (id) {
      this.associationService.getAssociationById(id).subscribe({
        next: (organizer: any) => {
          if (organizer) {
            this.association = organizer;
            this.organizerId = organizer.organizerId;
            // load organizers events
            this.loadEvents();
          } else {
            console.error('Järjestäjää ei löydy');
          }
        },
        error: (err) => {
          console.error('Virhe järjestäjän lataamisessa:', err);
        },
      });
    }
  }

  formatUrl(websiteUrl: string): string {
    if (!websiteUrl) return '';
    return /^https?:\/\//i.test(websiteUrl)
      ? websiteUrl
      : 'https://' + websiteUrl;
  }
  getHostname(websiteUrl: string): string {
    try {
      const fullWebsiteUrl = this.formatUrl(websiteUrl);
      return new URL(fullWebsiteUrl).hostname.replace(/^www\./, '');
    } catch {
      return websiteUrl;
    }
  }
  /**
   * Gets organizer specific events by calling getEventsByOrganizerId(this.organizerId)
   */
  loadEvents(): void {
    // if organizerId is found, call hetEventsByOrganizerId, else console.log error
    if (this.organizerId) {
      this.eventService.getEventsByOrganizerId(this.organizerId).subscribe({
        next: (events: Event[]) => {
          this.allEvents = events;
          // update the list of filtered events
          this.updateFutureFilteredEvents();
          this.updatePastFilteredEvents();
        },
        error: (err) => {
          console.error('Virhe tapahtumien lataamisessa:', err);
        },
      });
    }
  }

  /**
   * Filters events to be future events, starting from the next upcoming event
   */
  updateFutureFilteredEvents(): void {
    // creates a computed signal that updates automatically when dependencies change
    this.filteredFutureEventsSignal = computed(() => {
      // defines date and set time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // filters events to have only future / ongoing events
      const futureEvents = this.allEvents.filter((event) => {
        // uses ending date, or starting date if ending date is not provided
        const eventEndDate = this.parseCustomDate(
          event.endingDate || event.date
        );
        eventEndDate.setHours(0, 0, 0, 0);

        // returns events that ending date is today or in the future
        return eventEndDate >= currentDate;
      });
      // sorts future events in ascending order using dates
      return futureEvents.sort((a, b) => {
        // converts a and b dates to a Date objects
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);
        // compares timestamps of the dates and sorts events
        // returns negative value if a is before b
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  updatePastFilteredEvents():void {
     // creates a computed signal that updates automatically when dependencies change
     this.filteredPastEventsSignal = computed(() => {
      // defines date and set time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // filters events to have only future / ongoing events
      const pastEvents = this.allEvents.filter((event) => {
        // uses ending date, or starting date if ending date is not provided
        const eventEndDate = this.parseCustomDate(
          event.endingDate || event.date
        );
        eventEndDate.setHours(0, 0, 0, 0);

        // returns events that ending date is today or in the future
        return eventEndDate <= currentDate;
      });
      // sorts future events in ascending order using dates
      return pastEvents.sort((a, b) => {
        // converts a and b dates to a Date objects
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);
        // compares timestamps of the dates and sorts events
        // returns negative value if a is before b
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  parseCustomDate(dateString: string): Date {
    if (!dateString) {
      console.warn('Invalid date string:', dateString);
      return new Date();
    }
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
}
