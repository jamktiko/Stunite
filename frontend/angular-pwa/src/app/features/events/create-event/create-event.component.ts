import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../../../shared/models/event.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
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
  status: string = '';
  imageUrl: string = '';
  cities: string = '';
  organizerId: string = '';
  organizationName: string = '';
  isEditMode: boolean = false;
  eventId: string | null = null;
  eventTags: string[] = []; // Taulukko valituista tapahtumatyypeistä

  // Tapahtumatyypit
  availableEventTags: string[] = [
    'Sitsit',
    'Appro',
    'Alkoholiton',
    'Lajikokeilu',
    'Risteily',
    'Ekskursio',
    'Liikunta',
    'Vuosijuhla',
    'Sillis',
    'Festivaali',
    'Musiikki',
    'Tanssiaiset',
    'Turnaus',
    'Online',
    'Bileet',
    'Bingo',
    'Poikkitieteellinen',
    'Vain jäsenille',
    'Vaihto-opiskelijoille',
    'Ilmainen',
    'Vappu',
    'Vapaa-aika',
    'Ruoka',
    'Kulttuuri',
    'Ammatillinen tapahtuma',
  ];

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId !== null) {
      this.isEditMode = true;
      this.eventId = eventId;
      const event = this.eventService.getEventById(this.eventId);
      if (event) {
        this.populateFormFields(event);
      }
    }
  }

  private populateFormFields(event: Event) {
    this.eventName = event.eventName;
    this.eventDate = this.formatDateForInput(event.date);
    this.eventTime = event.startingTime;
    this.venue = event.venue;
    this.city = event.city;
    this.address = event.address;
    this.minticketprice = event.ticketprice.minticketprice;
    this.maxticketprice = event.ticketprice.maxticketprice;
    this.theme = event.theme;
    this.isFavorite = event.isFavorite;
    this.details = event.details;
    this.ticketLink = event.ticketLink;
    this.ticketSaleStart = event.ticketSaleStart;
    this.ticketSaleEnd = event.ticketSaleEnd;
    this.publishDateTime = event.publishDateTime;
    this.status = event.status;
    this.imageUrl = event.imageUrl;
    this.eventTags = event.eventTags || []; // Täytä valitut tapahtumatyypit
  }

  private formatDateForInput(dateStr: string): string {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  onCancel() {
    this.location.back();
  }

  onTagChange(selectedTags: string[]) {
    this.eventTags = selectedTags; // Päivitä valitut tapahtumatyypit
  }

  onSubmit() {
    const loggedInOrganizer = this.authService.getCurrUser();
    console.log(loggedInOrganizer);

    if (
      !loggedInOrganizer ||
      !loggedInOrganizer.organizerId ||
      !loggedInOrganizer.organizationName
    ) {
      console.error(
        'Organizer not logged in or missing organizerId or organizationName'
      );
      return;
    }

    const currentDateTime = new Date();
    const saleStartDate = new Date(this.ticketSaleStart);
    const saleEndDate = new Date(this.ticketSaleEnd);
    const eventDate = new Date(this.eventDate);

    // Tarkistus: lipun myynti ei voi alkaa ennen nykyhetkeä
    if (saleStartDate < currentDateTime) {
      console.error('Ticket sale start date cannot be in the past.');
      return;
    }

    // Tarkistus: lipun myynti päättymisaika ei voi olla ennen aloitusaikaa
    if (saleEndDate <= saleStartDate) {
      console.error('Ticket sale end date must be after the start date.');
      return;
    }

    // Tarkistus: tapahtuman päivämäärä ei voi olla ennen nykyhetkeä
    if (eventDate < currentDateTime) {
      console.error('Event date cannot be in the past.');
      return;
    }

    const updatedEvent: Event = {
      _id: this.isEditMode
        ? this.eventId!.toString()
        : Math.random().toString(36).substr(2, 9),
      eventName: this.eventName,
      date: this.formatDate(this.eventDate),
      startingTime: this.eventTime,
      venue: this.venue,
      city: this.city,
      address: this.address,
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
      organizerId: loggedInOrganizer.organizerId,
      organizationName: loggedInOrganizer.organizationName,
      eventTags: this.eventTags, // Lisää valitut tapahtumatyypit
    };

    console.log('Updated Event Payload:', updatedEvent);

    if (
      !updatedEvent.eventName ||
      !updatedEvent.date ||
      !updatedEvent.startingTime ||
      !updatedEvent.venue ||
      !updatedEvent.city ||
      !updatedEvent.organizerId ||
      !updatedEvent.organizationName
    ) {
      console.error('Missing required fields in event:', updatedEvent);
      return;
    }

    if (this.isEditMode) {
      this.eventService.editEvent(updatedEvent);
    } else {
      this.eventService.createEvent(updatedEvent);
    }

    this.router.navigate(['/organizer-view']);
  }

  private formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[2].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[0];
      return `${day}.${month}.${year}`;
    }
    return dateStr;
  }
}
