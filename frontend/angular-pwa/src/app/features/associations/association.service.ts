import { Injectable, signal, WritableSignal } from '@angular/core';
import { Organizer } from '../../shared/models/organization.model';
import { InMemoryDataService } from '../../shared/in-memory-services/in-memory-data.service';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private associationsSignal: WritableSignal<Organizer[]>;

  constructor(private inMemoryDataService: InMemoryDataService) {

    this.associationsSignal = signal(this.loadAssociations());
  }

  private loadAssociations(): Organizer[] {
    return this.inMemoryDataService.getOrganizers()();
  }

  getAssociations(): WritableSignal<Organizer[]> {
    return this.associationsSignal;
  }

  getAssociationById(id: string): Organizer | undefined {
    return this.associationsSignal().find(
      (assoc) => assoc.id.toString() === id
    );
  }

  createOrganizer(newOrganizer: Organizer) {
    const currentAssociations = this.associationsSignal();
    this.associationsSignal.set([...currentAssociations, newOrganizer]);
    this.inMemoryDataService.createOrganizer(newOrganizer);
  }
}
