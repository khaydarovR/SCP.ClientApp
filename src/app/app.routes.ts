import { Routes } from '@angular/router';

import {inject} from "@angular/core";
import {CanActivate} from "./services/can-activate.service";
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CreateRecordComponent} from "./create-record/create-record.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'create-record/:id/:title',
    component: CreateRecordComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    component: AppComponent,
  },
];
