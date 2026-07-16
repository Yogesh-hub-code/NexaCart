import { Routes } from '@angular/router';
import { HomeComponent } from './NexaCart/home/home.component';
import { LoginComponent } from './NexaCart/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
