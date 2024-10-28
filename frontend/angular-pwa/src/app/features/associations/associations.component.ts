import { Component, OnInit, signal, Signal, computed } from '@angular/core';
import { AssociationcardComponent } from './associationcard/associationcard.component';
import { AssociationService } from './association.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organizer } from '../../shared/models/organization.model';

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [AssociationcardComponent, CommonModule, FormsModule],
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css'],
})
export class AssociationsComponent implements OnInit {
  searchTerm = signal('');
  associationData!: Signal<Organizer[]>;
  filteredAssociationData!: Signal<Organizer[]>;

  constructor(private associationService: AssociationService) {}

  ngOnInit(): void {
    this.associationData = this.associationService.getAssociations();

    console.log('Loaded associations: ', this.associationData());

    this.filteredAssociationData = computed(() => {
      const search = this.searchTerm().toLowerCase();
      console.log('Current Search Term:', search);
      const filteredAssociations = this.associationData().filter(
        (association) =>
          association.organizationName
            .toLowerCase()
            .includes(search)
      );
      console.log('Filtered Associations:', filteredAssociations);
      return filteredAssociations;
    });
  }
}
