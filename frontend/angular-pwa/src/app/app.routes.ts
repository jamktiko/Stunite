import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { AssociationsComponent } from './features/associations/associations.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'associations', component: AssociationsComponent },

];
