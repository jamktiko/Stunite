import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { EventService } from '../events/event.service';
import { CommonModule } from '@angular/common';
import { EventcardComponent } from '../events/eventcard/eventcard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, CommonModule, EventcardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  featuredEvents: any[] = [];
  constructor(private eventService: EventService, private router: Router) {}
  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.featuredEvents = events.slice(0, 4);
    });
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }
}
