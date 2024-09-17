import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eventcard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './eventcard.component.html',
  styleUrl: './eventcard.component.css',
})
export class EventcardComponent {
  @Input() event: any;
  @Input() onlyImage: boolean = false;
}
