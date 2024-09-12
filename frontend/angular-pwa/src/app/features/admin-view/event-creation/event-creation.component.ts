import { Component } from '@angular/core';
import { EventService } from '../../events/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css'],
})
export class EventCreationComponent {
  event: any = {
    eventName: '',
    date: '',
    startingTime: '',
    location: {
      venue: '',
      city: '',
      address: '',
    },
  };
  errorMessage: string = '';

  constructor(private eventService: EventService) {}

  onSubmit() {
    this.eventService.createEvents(this.event).subscribe(
      (response) => {
        console.log('Tapahtuma luotu onnistuneesti:', response);
      },
      (error) => {
        this.errorMessage = 'Tapahtuman luonti epäonnistui';
        console.error('Error creating event:', error);
      }
    );
  }
}
