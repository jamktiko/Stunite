import { Component, OnInit } from '@angular/core';
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
  styleUrl: './associations.component.css',
})
export class AssociationsComponent implements OnInit {
  associationData: Organizer[] = [];

  filteredAssociationData: Organizer[] = [];
  searchTerm: string = '';

  newData: any[] = [];
  constructor(private associationService: AssociationService) {}

  ngOnInit(): void {
    this.associationData = this.associationService.getAssociations()();
    this.filteredAssociationData = this.associationData;
    console.log('Ladatut paikallisyhdistykset: ', this.associationData);
  }

  onSearch() {
    console.log('Hakutermi:', this.searchTerm);
    this.filteredAssociationData = this.searchTerm
      ? this.associationData.filter((association) =>
          association.organizationPublicInfo.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        )
      : this.associationData;
  }
}
