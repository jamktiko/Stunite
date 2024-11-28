import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { AssociationsComponent } from './features/associations/associations.component';
// import { adminGuard } from './core/guards/admin-guard.guard';
import { organizerGuard } from './core/guards/organizer-guard.guard';
import { UserprofileComponent } from './features/userprofile/userprofile.component';
import { EventDetailsComponent } from './features/events/event-details/event-details.component';
import { OrganizerViewComponent } from './features/organizer-view/organizer-view.component';
import { CreateEventComponent } from './features/events/create-event/create-event.component';
import { AssociationsDetailComponent } from './features/associations/associations-detail/associations-detail.component';
import { RegisterComponent } from './features/register/register.component';
import { OrganizerCalendarComponent } from './features/organizer-calendar/organizer-calendar.component';
import { EventGuard } from './core/guards/event-guard.guard';
import { MobileLoginComponent } from './shared/mobile-login/mobile-login.component';
import { MobileOrganizerLoginComponent } from './shared/mobile-organizer-login/mobile-organizer-login.component';
import { EventArchiveComponent } from './features/events/event-archive/event-archive.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'associations', component: AssociationsComponent },
  { path: 'mobile-login', component: MobileLoginComponent },
  { path: 'mobile-organizer-login', component: MobileOrganizerLoginComponent },
  { path: 'userprofile', component: UserprofileComponent },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
    canActivate: [EventGuard],
  },
  { path: 'event-archive', component: EventArchiveComponent },
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
  { path: 'associations/:id', component: AssociationsDetailComponent },
  { path: '**', redirectTo: '' },
];
