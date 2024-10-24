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
        const events = this.eventService.getAllEvents()();
        const foundEvent = events.find((e) => e._id === id);
        return foundEvent;
      });
    }
  }

  // formats ticketsale times to ->  hh:mm dd.mm.yyyy
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
}
