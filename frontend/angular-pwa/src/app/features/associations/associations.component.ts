import { Component, OnInit } from '@angular/core';
import { AssociationcardComponent } from './associationcard/associationcard.component';
import { AssociationService } from './association.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [AssociationcardComponent, CommonModule, FormsModule],
  templateUrl: './associations.component.html',
  styleUrl: './associations.component.css',
})
export class AssociationsComponent implements OnInit {
  associationData: any[] = [];

  filteredAssociationData: any[] = [];
  searchTerm: string = '';
  newData: any[] = [];
  constructor(private associationService: AssociationService) {}
  ngOnInit(): void {
    this.associationService.getAssociations().subscribe((data) => {
      this.associationData = data;
      this.filteredAssociationData = data;
      console.log('Ladatut paikallisyhdistykse: ', this.associationData);
    });
  }
  onSearch() {
    console.log('Hakutermi:', this.searchTerm);

    if (this.searchTerm) {
      this.filteredAssociationData = this.associationData.filter(
        (association) =>
          association.organizationPublicInfo.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredAssociationData = this.associationData;
    }
  }
}
