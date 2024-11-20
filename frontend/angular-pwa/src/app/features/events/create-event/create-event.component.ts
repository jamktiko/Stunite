import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../../../shared/models/event.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

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
    private location: Location,
    private notificationService: NotificationService
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

    if (event.imageUrl) {
      this.imagePreview = event.imageUrl;
    }
  }

  private formatDateForInput(dateStr: string): string {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Luo esikatselukuva
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancel() {
    this.location.back();
  }

  onTagChange(selectedTags: string[]) {
    this.eventTags = selectedTags;
  }

  onSubmit() {
    // Clear previous error message
    this.errorMessage = '';

    // Validate required fields
    if (
      !this.eventName ||
      !this.eventDate ||
      !this.eventTime ||
      !this.venue ||
      !this.city
    ) {
      this.errorMessage = 'Tähdelliset kentät ovat pakollisia.';
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

    // prepare event object for sending to the backend
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

    // upload image if selected
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('eventName', updatedEvent.eventName);
      formData.append('date', updatedEvent.date);
      formData.append('startingTime', updatedEvent.startingTime);
      formData.append('endingTime', updatedEvent.endingTime);
      formData.append('endingDate', updatedEvent.endingDate);
      formData.append('address', updatedEvent.address);
      formData.append('venue', updatedEvent.venue);
      formData.append('city', updatedEvent.city);
      formData.append(
        'ticketprice[minticketprice]',
        updatedEvent.ticketprice.minticketprice.toString()
      );
      formData.append(
        'ticketprice[maxticketprice]',
        updatedEvent.ticketprice.maxticketprice.toString()
      );
      formData.append('theme', updatedEvent.theme);
      formData.append('isFavorite', updatedEvent.isFavorite.toString());
      formData.append('details', updatedEvent.details);
      formData.append('ticketLink', updatedEvent.ticketLink);
      formData.append('ticketSaleStart', updatedEvent.ticketSaleStart);
      formData.append('ticketSaleEnd', updatedEvent.ticketSaleEnd);
      formData.append('publishDateTime', updatedEvent.publishDateTime);
      formData.append('status', updatedEvent.status);
      formData.append('organizerId', updatedEvent.organizerId);
      formData.append('organizationName', updatedEvent.organizationName);

      this.eventTags.forEach((tag) => {
        formData.append('eventTags[]', tag);
      });

      formData.append('image', this.selectedFile, this.selectedFile.name);

      // if in edit mode, update the event
      if (this.isEditMode) {
        this.eventService.editEvent(updatedEvent, this.selectedFile).subscribe({
          next: (response) => {
            this.router.navigate([`/events/${updatedEvent._id}`]);
            this.onEditSuccess()
          },
          error: (err) => {
            console.error('Error editing event:', err);
            this.errorMessage =
              'Tapahtuman muokkaus epäonnistui: ' + err.message;
            alert(this.errorMessage);
          },
        });
      } else {
        // if not in edit mode, create a new event
        this.eventService.uploadEventWithImage(formData).subscribe({
          next: (response) => {
            this.router.navigate([`/events/${updatedEvent._id}`]);
            this.onCreateSuccess();
          },
          error: (err) => {
            console.error('Error creating event:', err);
            this.errorMessage =
              'Tapahtuman luominen epäonnistui: ' + err.message;
            alert(this.errorMessage);
          },
        });
      }
    } else {
      // no image selected, submit the event without an image
      if (this.isEditMode) {
        this.eventService.editEvent(updatedEvent).subscribe({
          next: (response) => {
            console.log('Event edited without image');
            this.router.navigate([`/events/${updatedEvent._id}`]);
            this.onEditSuccess()
          },
          error: (err) => {
            console.error('Error editing event:', err);
            this.errorMessage =
              'Tapahtuman muokkaus epäonnistui: ' + err.message;
            alert(this.errorMessage);
          },
        });
      } else {
        this.eventService.createEvent(updatedEvent, null).subscribe({
          next: (response) => {
            this.router.navigate([`/events/${updatedEvent._id}`]);
            this.onCreateSuccess();
          },
          error: (err) => {
            console.error('Error creating event:', err);
            this.errorMessage =
              'Tapahtuman luominen epäonnistui: ' + err.message;
            alert(this.errorMessage);
          },
        });
      }
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
  onCreateSuccess() {
    this.notificationService.showSuccess('Tapahtuman luonti onnistui.', '');
  }
  onEditSuccess() {
    this.notificationService.showSuccess('Tapahtuman muokkaus onnistui.', '');
  }
}
