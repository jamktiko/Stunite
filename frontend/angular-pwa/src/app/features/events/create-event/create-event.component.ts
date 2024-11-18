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
  endingDate: string = '';
  endingTime: string = '';
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
  eventTags: string[] = [];
  errorMessage: string = '';

  // imagePreview: string | null = null;
  // selectedFile: File | null = null;

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
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event: Event) => {
          this.populateFormFields(event);
        },
        error: (err) => {
          console.error('Error fetching event:', err);
        },
      });
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
    this.eventTags = event.eventTags || [];
    this.endingTime = event.endingTime;
    this.endingDate = this.formatDateForInput(event.endingDate);
  }

  private formatDateForInput(dateStr: string): string {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  // onFileSelected(event: any): void {
  //   const fileInput = event.target as HTMLInputElement;

  //   // Check if fileInput.files is not null and has at least one file
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0];

  //     // Now you can safely use the file
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result as string;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   } else {
  //     console.log('No file selected');
  //   }
  // }

  onCancel() {
    this.location.back();
  }

  onTagChange(selectedTags: string[]) {
    this.eventTags = selectedTags;
  }

  onSubmit() {
    // Tyhjennetään edellinen virheilmoitus
    this.errorMessage = '';

    if (this.status === 'Tuotannossa' && this.publishDateTime) {
      this.errorMessage =
        'Alustavalle tapahtumalle ei voi asettaa julkaisuaikaa.';
      console.error(this.errorMessage);
      alert(this.errorMessage);
      return;
    }

    const loggedInOrganizer = this.authService.getCurrUser();
    if (
      !loggedInOrganizer ||
      !loggedInOrganizer.organizerId ||
      !loggedInOrganizer.organizationName
    ) {
      this.errorMessage =
        'Kirjautuneen käyttäjän järjestäjän tiedot puuttuvat.';
      console.error(this.errorMessage);
      alert(this.errorMessage);
      return;
    }

    const currentDateTime = new Date();
    const saleStartDate = new Date(this.ticketSaleStart);
    const saleEndDate = new Date(this.ticketSaleEnd);
    const eventDate = new Date(this.eventDate);
    if (saleStartDate < currentDateTime) {
      this.errorMessage =
        'Lipunmyynnin aloituspäivä ei voi olla menneisyydessä.';
      console.error(this.errorMessage);
      alert(this.errorMessage);
      return;
    }

    if (saleEndDate <= saleStartDate) {
      this.errorMessage =
        'Lipunmyynnin lopetuspäivä tulee olla aloituspäivän jälkeen.';
      console.error(this.errorMessage);
      alert(this.errorMessage);
      return;
    }

    if (eventDate < currentDateTime) {
      this.errorMessage = 'Tapahtuman päivämäärä ei voi olla menneisyydessä.';
      console.error(this.errorMessage);
      alert(this.errorMessage);
      return;
    }

    const updatedEvent: Event = {
      _id: this.isEditMode
        ? this.eventId!.toString()
        : Math.random().toString(36).substr(2, 9),
      eventName: this.eventName,
      date: this.formatDate(this.eventDate),
      startingTime: this.eventTime,
      endingTime: this.endingTime,
      endingDate: this.formatDate(this.endingDate),
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
      eventTags: this.eventTags,
    };

    // if (this.selectedFile) {
    //   const formData = new FormData();
    //   formData.append('image', this.selectedFile);
    //   formData.append('eventName', this.eventName);
    //   // Add other form fields if necessary

    //   this.eventService.uploadEventImage(formData).subscribe({
    //     next: (response) => {
    //       console.log('Event with image created:', response);
    //       this.router.navigate([`/events/${response._id}`]);
    //     },
    //     error: (err) => console.error('Image upload failed:', err),
    //   });
    // } else {
    //   console.error('No image selected!');
    // }

    // Tarkistetaan pakolliset kentät
    if (
      !updatedEvent.eventName ||
      !updatedEvent.date ||
      !updatedEvent.startingTime ||
      !updatedEvent.venue ||
      !updatedEvent.city ||
      !updatedEvent.organizerId ||
      !updatedEvent.organizationName
    ) {
      this.errorMessage = 'Tähdelliset kentät ovat pakollisia.';
      console.error(this.errorMessage, updatedEvent);
      alert(this.errorMessage);
      return;
    }

    if (this.isEditMode) {
      this.eventService.editEvent(updatedEvent).subscribe({
        next: () => {
          this.router.navigate([`/events/${updatedEvent._id}`]);
        },
        error: (err: any) => {
          this.errorMessage =
            'Tapahtuman muokkaaminen epäonnistui: ' + err.message;
          console.error(this.errorMessage);
        },
      });
    } else {
      this.eventService.createEvent(updatedEvent).subscribe({
        next: () => {
          this.router.navigate([`/events/`]);
        },
        error: (err: any) => {
          this.errorMessage = 'Tapahtuman luominen epäonnistui: ' + err.message;
          console.error(this.errorMessage);
        },
      });
    }
  }

  openCalendar(event: any) {
    const target = event.target as HTMLInputElement;
    if (target && typeof target.showPicker === 'function') {
      target.showPicker();
    } else {
      target.focus();
    }
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

  onTagCheckboxChange(event: any) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox) {
      const tagValue = checkbox.value;

      if (checkbox.checked) {
        // Lisää tagi valittujen listaan
        if (!this.eventTags.includes(tagValue)) {
          this.eventTags.push(tagValue);
        }
      } else {
        // Poista tagi valituista
        this.eventTags = this.eventTags.filter((tag) => tag !== tagValue);
      }
    }
  }
}
