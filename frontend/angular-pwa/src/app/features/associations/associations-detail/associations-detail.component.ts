import { Component, OnInit, WritableSignal, signal } from '@angular/core';
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
  association!: WritableSignal<Organizer | undefined>;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService
  ) {
    this.association = signal<Organizer | undefined>(undefined);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.associationService
        .getAssociationById(id)
        .subscribe((fetchedAssociation) => {
          this.association.set(fetchedAssociation ?? undefined);
        });
    }
  }
}
