import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { AssociationsComponent } from './features/associations/associations.component';
import { AdminViewComponent } from './features/admin-view/admin-view.component';
import { adminGuard } from './core/admin-guard.guard';
import { UserprofileComponent } from './features/userprofile/userprofile.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'associations', component: AssociationsComponent },
  { path: 'userprofile', component: UserprofileComponent },
  {
    path: 'admin-view',
    component: AdminViewComponent,
    canActivate: [adminGuard],
  },
];
