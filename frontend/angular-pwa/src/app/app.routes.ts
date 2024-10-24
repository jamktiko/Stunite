import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { AssociationsComponent } from './features/associations/associations.component';
import { AdminViewComponent } from './features/admin-view/admin-view.component';
// import { adminGuard } from './core/guards/admin-guard.guard';
import { organizerGuard } from './core/guards/organizer-guard.guard';
import { UserprofileComponent } from './features/userprofile/userprofile.component';
import { EventDetailsComponent } from './features/events/event-details/event-details.component';
import { OrganizerViewComponent } from './features/organizer-view/organizer-view.component';
import { CreateEventComponent } from './features/events/create-event/create-event.component';
import { AssociationsDetailComponent } from './features/associations/associations-detail/associations-detail.component';
import { RegisterComponent } from './features/register/register.component';
import { OrganizerCalendarComponent } from './features/organizer-calendar/organizer-calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'associations', component: AssociationsComponent },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  // {
  //   path: 'admin-view',
  //   component: AdminViewComponent,
  //   canActivate: [adminGuard],
  // }, // possibly not needed
  {
    path: 'organizer-view',
    component: OrganizerViewComponent,
    canActivate: [organizerGuard],
  },
  { path: 'organizer-view/create-event', component: CreateEventComponent },
  { path: 'organizer-view/edit-event/:id', component: CreateEventComponent },
  {
    path: 'organizer-view/organizer-calendar',
    component: OrganizerCalendarComponent,
  },
  { path: 'association/:id', component: AssociationsDetailComponent },
];
