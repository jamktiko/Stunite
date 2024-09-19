import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-associationcard',
  standalone: true,
  imports: [],
  templateUrl: './associationcard.component.html',
  styleUrl: './associationcard.component.css',
})
export class AssociationcardComponent {
  @Input() association: any;
}
