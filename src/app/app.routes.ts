import { Routes } from '@angular/router';

import {inject} from "@angular/core";
import {CanActivate} from "./services/can-activate.service";
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CreateRecordComponent} from "./create-record/create-record.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UserManagerComponent} from "./user-manager/user-manager.component";
import {AccComponent} from "./acc/acc.component";
import {LogsComponent} from "./logs/logs.component";

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
    path: 'u-m/:id',
    component: UserManagerComponent,
  },
  {
    path: 'rlogs/:rid',
    component: LogsComponent,
  },
  {
    path: 'acc',
    component: AccComponent,
  },
  {
    path: '',
    component: AppComponent,
  },
];
