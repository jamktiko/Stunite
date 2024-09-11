import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-eventcard',
  standalone: true,
  imports: [],
  templateUrl: './eventcard.component.html',
  styleUrl: './eventcard.component.css',
})
export class EventcardComponent {
  @Input() event: any;
}