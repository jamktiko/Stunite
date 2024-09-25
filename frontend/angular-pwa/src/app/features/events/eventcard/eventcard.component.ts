import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event } from '../../../shared/models/event.model';
@Component({
  selector: 'app-eventcard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './eventcard.component.html',
  styleUrl: './eventcard.component.css',
})
export class EventcardComponent {
  @Input() event!: Event;
  @Input() onlyImage: boolean = false;
}
