import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssociationService } from '../association.service';

@Component({
  selector: 'app-associations-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './associations-detail.component.html',
  styleUrls: ['./associations-detail.component.css'],
})
export class AssociationsDetailComponent implements OnInit {
  association: any = null;
  associations: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Hae ID:', id);
    if (id) {
      this.associationService.getAssociationsById(id).subscribe((data) => {
        console.log('Ladattu data:', data);
        this.association = data;
      });
    }
  }
}
