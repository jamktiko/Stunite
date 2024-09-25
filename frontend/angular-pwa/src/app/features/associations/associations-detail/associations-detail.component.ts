import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssociationService } from '../association.service';
import { Organizer } from '../../../shared/models/organization.model';

@Component({
  selector: 'app-associations-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './associations-detail.component.html',
  styleUrls: ['./associations-detail.component.css'],
})
export class AssociationsDetailComponent implements OnInit {
  association: Organizer | null = null;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Hae ID:', id);
    
    if (id) {
      const associations = this.associationService.getAssociations()();
      this.association = associations.find(
        (association) => association.id.toString() === id
      ) || null;

      console.log('Ladattu data:', this.association);
    }
  }
}
