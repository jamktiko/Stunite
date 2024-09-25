import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../../../shared/models/event.model';
import { InMemoryUserService } from '../../../shared/in-memory-services/in-memory-user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CalendarComponent, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent {
  eventName: string = '';
  eventDate: string = '';
  eventTime: string = '';
  venue: string = '';
  city: string = '';
  address: string = '';
  maxticketprice: number | null = null;
  minticketprice: number | null = null;
  theme: string = '';
  isFavorite: boolean = false;
  details: string = '';
  ticketLink: string = '';
  ticketSaleStart: string = '';
  ticketSaleEnd: string = '';
  publishDateTime: string = '';
  status: string = 'preliminary';
  imageUrl: string = '';
  cities: string[] = ['Helsinki', 'Tampere', 'Turku', 'Oulu', 'Jyväskylä'];
  organizerId: number = 1; // this should be edited !
  isEditMode: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: InMemoryUserService,
    private authService: AuthService
  ) {}

  onSubmit() {
    const currentUser = this.getCurrentUser();
    console.log('current user', currentUser);
    const newEvent: Event = {
      id: Math.floor(Math.random() * 1000),
      eventName: this.eventName,
      date: this.formatDate(this.eventDate),
      startingTime: this.eventTime,
      location: {
        venue: this.venue,
        city: this.city,
        address: this.address,
      },
      ticketprice: {
        minticketprice: this.minticketprice || 0,
        maxticketprice: this.maxticketprice || 0,
      },
      theme: this.theme,
      isFavorite: this.isFavorite,
      details: this.details,
      imageUrl: this.imageUrl,
      ticketLink: this.ticketLink,
      ticketSaleStart: this.ticketSaleStart,
      ticketSaleEnd: this.ticketSaleEnd,
      publishDateTime: this.publishDateTime,
      status: this.status,
      organizerId: this.organizerId,
    };

    this.eventService.createEvent(newEvent, this.organizerId);
    this.router.navigate(['/events']);
  }

  private formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[2].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[0];
      return `${day}.${month}.${year}`;
    }
    console.warn(`Invalid date format: ${dateStr}`);
    return dateStr;
  }

  private getCurrentUser() {
    const email = this.authService.getCurrUser()?.email;
    return email ? this.userService.getCurrentUser(email) : null;
  }
}
