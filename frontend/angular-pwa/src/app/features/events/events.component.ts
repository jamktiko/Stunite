import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { EventcardComponent } from './eventcard/eventcard.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventcardComponent, CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventData: any;

  constructor(private eventService: EventService) {}
  ngOnInit(): void {
    this.eventService.getEvents().subscribe((data) => {
      this.eventData = data;
    });
  }
}
