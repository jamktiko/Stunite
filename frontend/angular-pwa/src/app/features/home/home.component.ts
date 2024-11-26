import { Component, OnInit, computed, Signal, signal } from '@angular/core';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { EventService } from '../events/event.service';
import { CommonModule } from '@angular/common';
import { EventcardComponent } from '../events/eventcard/eventcard.component';
import { Router } from '@angular/router';
import { AssociationService } from '../associations/association.service';
import { AssociationcardComponent } from '../associations/associationcard/associationcard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CalendarComponent,
    CommonModule,
    EventcardComponent,
    AssociationcardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  featuredEvents!: Signal<any[]>;
  featuredAssociations!: Signal<any[]>;

  constructor(
    private eventService: EventService,
    private associationService: AssociationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.featuredEvents = signal([]);

    this.eventService.getPublishedEvents().subscribe({
      next: (eventsData) => {
        this.featuredEvents = signal(eventsData.reverse().slice(0, 4));
      },
      error: (err) => {
        console.error('Error fetching featured events:', err);
      },
    });
    this.featuredAssociations = signal([]);
    this.associationService.getAssociations().subscribe({
      next: (associationsData) => {
        this.featuredAssociations = signal(associationsData); // All associations without slice
      },
      error: (err) => {
        console.error('Error fetching associations:', err);
      },
    });
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }

  goToAssociations(): void {
    this.router.navigate(['/associations']);
  }
}
