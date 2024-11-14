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
  associationSignal!: Observable<Organizer[]>;
  filteredAssociationData!: Signal<Organizer[]>;

  constructor(private associationService: AssociationService) {}
  ngOnInit(): void {
    this.associationSignal = this.associationService.getAssociations();

    this.filteredAssociationData = computed(() => {
      const search = this.searchTerm().toLowerCase();

      let filteredAssociations: Organizer[] = [];
      this.associationSignal.subscribe((associations) => {
        filteredAssociations = associations.filter((association) =>
          association.organizationName.toLowerCase().includes(search)
        );
      });

      return filteredAssociations;
    });
  }
}
