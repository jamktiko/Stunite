import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../shared/models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  isOrganizer: boolean = false;

  private map: any; // Lazy-load: ei suoraa viittausta Leafletin tyyppiin

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // SSR-tuki
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const eventId = this.activatedRoute.snapshot.paramMap.get('id');
      if (eventId) {
        this.eventService.getEventById(eventId).subscribe({
          next: (event: Event) => {
            this.event = event;
            this.loadMap(); // Lataa kartta vain selaimessa
          },
          error: (err) => {
            console.error('Error fetching event:', err);
          },
        });
      }

      this.isOrganizer = this.authService.getIsOrganizer();
    }
  }

  private async loadMap(): Promise<void> {
    if (!this.event || !this.event.address) return;

    if (isPlatformBrowser(this.platformId)) {
      const defaultCoords: [number, number] = [60.192059, 24.945831]; // Helsinki

      // Lazy-load Leaflet vasta tässä kohtaa
      const L = await import('leaflet');

      if (!this.map) {
        this.map = L.map('map').setView(defaultCoords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);
      }

      const geocodeServiceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${this.event.address}, ${this.event.city}`
      )}`;

      fetch(geocodeServiceUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            if (this.map) {
              this.map.setView([lat, lon], 15);

              L.marker([lat, lon])
                .addTo(this.map)
                .bindPopup(this.event?.venue || 'Event Venue')
                .openPopup();
            }
          } else {
            console.error('Address not found');
          }
        })
        .catch((error) => {
          console.error('Geocoding error:', error);
        });
    }
  }

  // formats ticketsale times to ->  hh:mm dd.mm.yyyy
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
}
