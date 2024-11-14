import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssociationService } from '../association.service';
import { EventService } from '../../events/event.service';
import { Event } from '../../../shared/models/event.model';
import { EventcardComponent } from '../../events/eventcard/eventcard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-associations-detail',
  standalone: true,
  imports: [CommonModule, EventcardComponent],
  templateUrl: './associations-detail.component.html',
  styleUrls: ['./associations-detail.component.css'],
})
export class AssociationsDetailComponent implements OnInit {
  association: any;
  allEvents: Event[] = [];
  organizerId: string = '';

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
        },
        error: (err) => {
          console.error('Virhe tapahtumien lataamisessa:', err);
        },
      });
    }
  }
}
