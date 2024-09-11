import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { EventcardComponent } from './eventcard/eventcard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventcardComponent, CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventData: any[] = [];

  filteredEventData: any[] = [];
  searchTerm: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((data) => {
      this.eventData = data;
      this.filteredEventData = data;
      console.log('Tapahtumat ladattu:', this.eventData);
    });
  }

  onSearch() {
    console.log('Hakutermi:', this.searchTerm);

    if (this.searchTerm) {
      this.filteredEventData = this.eventData.filter((event) =>
        event.eventName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log('Suodatetut tapahtumat:', this.filteredEventData);
    } else {
      this.filteredEventData = this.eventData;
      console.log('Näytetään kaikki tapahtumat');
    }
  }
}
