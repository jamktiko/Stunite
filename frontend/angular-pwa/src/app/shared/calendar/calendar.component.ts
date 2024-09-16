import { Component } from '@angular/core';
import { IgxCalendarModule } from 'igniteui-angular';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IgxCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {}
