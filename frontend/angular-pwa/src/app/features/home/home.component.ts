import { Component, OnInit, computed, Signal } from '@angular/core';
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
  styleUrl: './home.component.css',
})
export class HomeComponent {
  featuredEvents!: Signal<any[]>;
  featuredAssociations: any[] = [];
  constructor(
    private eventService: EventService,
    private associationService: AssociationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Use signals and call them as functions to access values, then apply array methods
    this.featuredEvents = computed(() =>
      this.eventService.getEvents()().slice(0, 4)
    ); // Call the signal with `()`
    this.associationService.getAssociations().subscribe((associations) => {
      this.featuredAssociations = associations; // Store associations
    });
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }
  goToAssociations(): void {
    this.router.navigate(['/associations']);
  }
}
