import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { AssociationcardComponent } from './associationcard/associationcard.component';
import { AssociationService } from './association.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organizer } from '../../shared/models/organization.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [AssociationcardComponent, CommonModule, FormsModule],
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css'],
})
export class AssociationsComponent implements OnInit {
  searchTerm = signal('');
  selectedCity = signal('');
  selectedType = signal('');

  availableCities: string[] = [];
  availableTypes: string[] = [];
  associationSignal!: Observable<Organizer[]>;
  filteredAssociationData!: Signal<Organizer[]>;

  constructor(private associationService: AssociationService) {}

  ngOnInit(): void {
    this.associationSignal = this.associationService.getAssociations();
    this.associationSignal.subscribe((associationsData) => {
      associationsData.forEach((association) => {
        if (!this.availableCities.includes(association.city)) {
          this.availableCities.push(association.city);
        }
        if (!this.availableTypes.includes(association.organizationType)) {
          this.availableTypes.push(association.organizationType);
        }
      });

      this.updateFilteredAssociations(associationsData);
    });
  }

  updateFilteredAssociations(associationsData: Organizer[]) {
    this.filteredAssociationData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      const city = this.selectedCity();
      const type = this.selectedType();
      let filteredAssociations = associationsData.filter((associations) => {
        const matchesSearch = associations.organizationName
          .toLowerCase()
          .includes(search);
        const matchesCity = city ? associations.city === city : true;
        const matchesType = type
          ? associations.organizationType === type
          : true;

        return matchesCity && matchesSearch && matchesType;
      });
      return filteredAssociations;
    });
  }
}
