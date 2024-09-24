import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-associationcard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './associationcard.component.html',
  styleUrl: './associationcard.component.css',
})
export class AssociationcardComponent {
  @Input() association: any;
  @Input() onlyImage: boolean = false;
}
