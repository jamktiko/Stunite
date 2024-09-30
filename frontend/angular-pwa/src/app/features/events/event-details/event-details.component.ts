import { Component, OnInit, computed, Signal } from '@angular/core';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
})
export class EventDetailsComponent implements OnInit {
  event!: Signal<any | undefined>;
  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.event = computed(() => {
        const events = this.eventService.getEvents()();
        const foundEvent = events.find((e) => e.id === +id);
        console.log(foundEvent); // Tarkista, että löytyi tapahtuma
        return foundEvent;
      });
    }
  }
}
