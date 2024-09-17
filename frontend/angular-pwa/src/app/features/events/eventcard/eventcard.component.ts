import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventcard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './eventcard.component.html',
  styleUrl: './eventcard.component.css',
})
export class EventcardComponent {
  @Input() event: any;
  @Input() onlyImage: boolean = false;
}
