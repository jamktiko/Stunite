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
  filteredEventsSignal!: Signal<Event[]>;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.associationService.getAssociationById(id).subscribe({
        next: (organizer: any) => {
          if (organizer) {
            this.association = organizer;
            this.organizerId = organizer.organizerId;
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

  loadEvents(): void {
    if (this.organizerId) {
      this.eventService.getEventsByOrganizerId(this.organizerId).subscribe({
        next: (events: Event[]) => {
          this.allEvents = events;
          this.updateFilteredEvents();
        },
        error: (err) => {
          console.error('Virhe tapahtumien lataamisessa:', err);
        },
      });
    }
  }

  updateFilteredEvents(): void {
    this.filteredEventsSignal = computed(() => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const futureEvents = this.allEvents.filter((event) => {
        const eventEndDate = this.parseCustomDate(
          event.endingDate || event.date
        );
        eventEndDate.setHours(0, 0, 0, 0);
        return eventEndDate >= currentDate;
      });

      return futureEvents.sort((a, b) => {
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);
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
