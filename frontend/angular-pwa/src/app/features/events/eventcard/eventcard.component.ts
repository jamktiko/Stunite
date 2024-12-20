import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event } from '../../../shared/models/event.model';

@Component({
  selector: 'app-eventcard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './eventcard.component.html',
  styleUrls: ['./eventcard.component.css'],
})
export class EventcardComponent implements AfterViewInit {
  @Input() event!: Event;
  @Input() onlyImage: boolean = false;

  @ViewChild('eventName') eventName!: ElementRef;

  isNameOverflow: boolean = false;

  ngAfterViewInit(): void {
    if (this.eventName) {
      this.isNameOverflow = this.isOverflow(this.eventName);
    } else {
      this.isNameOverflow = false;
    }
  }

  isOverflow(element: ElementRef): boolean {
    return (
      element.nativeElement.scrollWidth > element.nativeElement.clientWidth
    );
  }
}
